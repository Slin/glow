//
//	player.js
//	Webgine
//
//	Created by Nils Daumann on 06.11.11.
//	Copyright (c) 2011 Nils Daumann

//	Permission is hereby granted, free of charge, to any person obtaining a copy
//	of this software and associated documentation files (the "Software"), to deal
//	in the Software without restriction, including without limitation the rights
//	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//	copies of the Software, and to permit persons to whom the Software is
//	furnished to do so, subject to the following conditions:

//	The above copyright notice and this permission notice shall be included in
//	all copies or substantial portions of the Software.

//	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//	THE SOFTWARE.
function aPlayer()
{
    this.SpeedFactor = 0.02;
    this.VelocityUpdateTime = 50;
    this.RadarUpdateTime = 20;
    this.velocityReductionFactor = 0.95;
    
    this.radarFeedback = 0;
    
    // This value indicates how near you are to an obstacle (range 0..1).
    this.radarFeedbackNormalized = 0;
    
    this.velocity = { x: 0, y: 0};
    this.deltaVelocityUpdate = 0;
    this.deltaRadarUpdate = 0;
    
    this.pos = {x: 400, y: 400};
    this.ent = 0;
    this.deltaTime = 0;
    this.heartbeattimer = 0;
    
    // Gameplay variables.
    this.controlsInverted = false;
    this.isAlive = true;
    this.exit = false;
    this.exitcounter = 0;
    
    this.PoisonDuration = 10000;
    this.poisonedTimeLeft = 0;
    this.PositiveColor = {r: 0.632, g: 1.0, b: 0.0};
    this.NegativeColor = {r: 1.0, g: 0.0, b: 0.0};

    this.slowed = 0;
    this.slowfactor = 1;
}

aPlayer.prototype.onInit = function()
{
	wgCamera.follow = this;
    wgCamera.followobj = this.ent.object;
    this.ent.object.size.x = 128;
    this.ent.object.size.y = 128;
    this.ent.createLight();
    this.ent.light.color = {r: 0.632, g: 1.0, b: 0.0};
	this.ent.object.material.initAtlas(4, 4, 1024, 1024, 1024, 1024);
	this.ent.object.material.setAnimation(0, 7, 0.6, 1);

    this.ent.object.pos.x = this.pos.x;
    this.ent.object.pos.y = this.pos.y;
}

// timeStep: Elapsed time scince last render call in millisecons.
aPlayer.prototype.onUpdate = function(timeStep)
{
    this.deltaTime += timeStep;
    this.slowfactor = (this.slowed>0)?0.5:1.0;

    this.heartbeattimer += timeStep*(this.radarFeedbackNormalized*0.8+0.1);
    if(this.heartbeattimer > 200*this.slowfactor)
    {
        this.heartbeattimer = 0;
        wgAudio.playSound("singleheartbeat");
    }

	if (!this.isAlive)
    {
        return;
    }

    if(this.exit == false)
    {
        this.updateInput(timeStep);
        this.updateCollision(timeStep);
    }
    else
    {
        this.gotoExit(timeStep);
    }

    this.updateCameraPosition(timeStep);
    this.updatePenalties(timeStep);
    
    this.ent.object.pos.x = this.pos.x;
    this.ent.object.pos.y = this.pos.y + Math.sin(this.deltaTime*0.05)*3;
     
    if(this.ent.object.material.inverttexx == 1)
    {
        this.ent.light.pos.x = this.ent.object.pos.x+120;
    }
    else
    {
        this.ent.light.pos.x = this.ent.object.pos.x+8;
    }
    this.ent.light.pos.y = this.ent.object.pos.y+30;

    if(this.isAlive == true && this.exit == false)
    {
        var clamp = Math.sin(this.deltaTime*0.005)*0.5+0.5;
        this.ent.light.range = $.easing.easeInOutQuad(this.ent.light.range, clamp, 30, 70, 2);
    }

    this.slowed = 0;
};

// Reads keyboard direction keys and moves the player with some velocity.
aPlayer.prototype.updateInput = function(timeStep)
{
    this.deltaVelocityUpdate += timeStep;

    if (wgKeyboard.left)
    {
       this.velocity.x -= this.controlsInverted ? -timeStep : timeStep;
    }
    if (wgKeyboard.right)
    {
       this.velocity.x += this.controlsInverted ? -timeStep : timeStep;
    }
    if (wgKeyboard.down)
    {
       this.velocity.y -= this.controlsInverted ? -timeStep : timeStep;
    }
    if (wgKeyboard.up)
    {
       this.velocity.y += this.controlsInverted ? -timeStep : timeStep;
    }
           
    this.pos.x += this.SpeedFactor * this.velocity.x * this.slowfactor;
    this.pos.y += this.SpeedFactor * this.velocity.y * this.slowfactor;
    
    while (this.deltaVelocityUpdate > this.VelocityUpdateTime)
    {
        this.deltaVelocityUpdate -= this.VelocityUpdateTime;
         
        this.velocity.x = this.velocity.x * this.velocityReductionFactor;
        this.velocity.y = this.velocity.y * this.velocityReductionFactor;
        
        var vectorLength = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        
        this.moveDirection = {
            x: this.velocity.x / vectorLength, 
            y: this.velocity.y / vectorLength };
    }
    
    this.ent.object.material.inverttexx = this.velocity.x < 0 ? 1 : 0;
}

aPlayer.prototype.gotoExit = function(timestep)
{
    this.exitcounter += timestep*0.01;
    this.ent.object.size.x -= this.exitcounter*timestep*0.01;
    this.ent.object.size.y -= this.exitcounter*timestep*0.01;

    var clamp = Math.sin(this.deltaTime*0.005)*0.5+0.5;
    this.ent.light.range = $.easing.easeInOutQuad(this.ent.light.range, clamp, 30*this.ent.object.size.x/128, 70*this.ent.object.size.x/128, 2);

    if(this.ent.object.size.x <= 0 || this.ent.object.size.y <= 0)
    {
        gGlobals.nextlevel = true;
    }
}

// This method moves the camera.
aPlayer.prototype.updateCameraPosition = function(timeStep)
{
    wgCamera.update(timeStep);
}

// The player collided with the environment.
aPlayer.prototype.die = function()
{
    if(this.isAlive == true)
    {
        wgAudio.playSound("splatter");
		this.ent.object.material.setAnimation(8, 15, 0.2, 0);
        this.ent.light.range = 0;
        gGlobals.reload = true;
        this.isAlive = false;
    }    
}

// Updates player penalties like poison.
aPlayer.prototype.updatePenalties = function(timeStep)
{
    if (this.poisonedTimeLeft > 0)
    {
        this.poisonedTimeLeft -= timeStep;
        
        var progress = 1 - Math.max(0, Math.min(1, this.poisonedTimeLeft / this.PoisonDuration));
            
        this.ent.light.color.r = this.PositiveColor.r * progress + this.NegativeColor.r * (1 - progress);
        this.ent.light.color.g = this.PositiveColor.r * progress + this.NegativeColor.g * (1 - progress);
        this.ent.light.color.b = this.PositiveColor.r * progress + this.NegativeColor.b * (1 - progress);
    }
    
    if (this.poisonedTimeLeft <= 0)
    {
        this.poisonedTimeLeft = 0;
        this.controlsInverted = false;
        this.ent.light.color = {r: 0.632, g: 1.0, b: 0.0};
    }
}

// The player collided with the environment.
aPlayer.prototype.setPoison = function()
{
    this.controlsInverted = true;
    this.poisonedTimeLeft = this.PoisonDuration;
}

aPlayer.prototype.updateCollision = function(timeStep)
{
    this.deltaRadarUpdate += timeStep;
    var length = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if(length == 0) length = 1.0;
    var velocityNorm = { x: this.velocity.x / length, y: this.velocity.y / length };
    
    var origin = 
        {
            x: Math.floor(this.ent.object.pos.x + this.ent.object.size.x / 2) 
            + (velocityNorm.x * (this.ent.object.size.x * 0.8)),
            y: Math.floor(this.ent.object.pos.y + this.ent.object.size.y / 2)
            + (velocityNorm.y * (this.ent.object.size.y * 0.8))
        };

    var isColliding = gGlobals.background.object.getPixel(origin.x, origin.y);
    
    if (isColliding)
    {
        this.die();
        return;
    }
    
    if (this.deltaRadarUpdate > this.RadarUpdateTime)
    {
        this.deltaRadarUpdate = 0;
            
        var pickDirections = [ {x: -0.71,y: -0.71}, {x: 0.71,y: -0.71}, {x: -0.71,y: 0.71}, {x: 0.71,y: 0.71} ];
        var distanceStep = this.ent.object.size.x;
        var distanceTests = 8;
        var radarStrength = 0;
        
        for (var distanceCounter = 1; distanceCounter <= distanceTests; distanceCounter++)
        {
            for (var direction in pickDirections)
            {
                 // Get a point placed in front of the move direciton.
                var pickPosition = 
                {
                    x: origin.x + pickDirections[direction].x * distanceStep * distanceCounter,
                    y: origin.y + pickDirections[direction].y * distanceStep * distanceCounter 
                };     
                
                if (gGlobals.background.object.getPixel(pickPosition.x, pickPosition.y))
                {
                    radarStrength = (1 - distanceCounter / (distanceTests-1));
                    break;
                }
            }
            
            if (radarStrength != 0)
            {
                break;
            }
        }
        
        this.radarFeedbackNormalized = radarStrength;
    }
}
