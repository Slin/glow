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
function aPlayer(levelchange)
{
    this.SpeedFactor = 0.02;
    this.VelocityUpdateTime = 50;
    this.velocityReductionFactor = 0.95;
    
    this.velocity = { x: 0, y: 0};
    this.deltaVelocityUpdate = 0;
    
    this.ent = 0;
    this.deltaTime = 0;
    
    this.isAlive = true;
    this.exit = false;
    this.levelchange = levelchange;

    this.pos = {x: 400, y: 400};
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
	this.ent.object.material.setAnimation(0, 7, 0.8, 1);
}

// timeStamp: Elapsed time scince last render call in millisecons.
aPlayer.prototype.onUpdate = function(timeStamp)
{
    this.deltaTime += timeStamp;

	if (!this.isAlive)
    {
        return;
    }

    if(this.exit == false)
    {
        this.updateInput(timeStamp);
    }
    else
    {
        this.gotoExit(timeStamp);
    }
    this.updateCameraPosition(timeStamp);
        
    var isColliding = gGlobals.background.object.getPixel(
        Math.floor(this.ent.object.pos.x + this.ent.object.size.x / 2), 
        Math.floor(this.ent.object.pos.y + this.ent.object.size.y / 2)
        );
        
    this.ent.light.color = isColliding ? {r: 0.632, g: 0.0, b: 0.0} : {r: 0.632, g: 1.0, b: 0.0};
    
    if (isColliding)
    {
        this.die();
    }
    
    this.ent.object.pos.x = this.pos.x;
    this.ent.object.pos.y = this.pos.y; //+Math.sin(this.deltaTime*0.05)*3;
       
    if(this.ent.object.material.inverttexx == 1)
    {
        this.ent.light.pos.x = this.ent.object.pos.x+120;
    }
    else
    {
        this.ent.light.pos.x = this.ent.object.pos.x+8;
    }
    this.ent.light.pos.y = this.ent.object.pos.y+30;
    var clamp = Math.sin(this.deltaTime*0.005)*0.5+0.5;
    this.ent.light.range = $.easing.easeInOutQuad(this.ent.light.range, clamp, 30, 70, 2);
 
};

// Reads keyboard direction keys and moves the player with some velocity.
aPlayer.prototype.updateInput = function(timeStamp)
{
    this.deltaVelocityUpdate += timeStamp;

    if (wgKeyboard.left)
    {
       this.velocity.x -= timeStamp;
    }
    if (wgKeyboard.right)
    {
       this.velocity.x += timeStamp;
    }
    if (wgKeyboard.down)
    {
       this.velocity.y -= timeStamp;
    }
    if (wgKeyboard.up)
    {
       this.velocity.y += timeStamp;
    }
           
    this.pos.x += this.SpeedFactor * this.velocity.x;
    this.pos.y += this.SpeedFactor * this.velocity.y;
    
    while (this.deltaVelocityUpdate > this.VelocityUpdateTime)
    {
        this.deltaVelocityUpdate -= this.VelocityUpdateTime;
         
        this.velocity.x = this.velocity.x * this.velocityReductionFactor;
        this.velocity.y = this.velocity.y * this.velocityReductionFactor;
    }
    
    this.ent.object.material.inverttexx = this.velocity.x < 0 ? 1 : 0;
}

aPlayer.prototype.gotoExit = function(timestep)
{
    var distx = wgCamera.pos.x-this.pos.x;
    var disty = wgCamera.pos.y-this.pos.y;
    this.pos.x += distx*timestep*0.001*0.5;
    this.pos.y += disty*timestep*0.001*0.5;

    if(distx*distx+disty*disty < 25)
    {
        this.levelchange();
    }
}

// This method moves the camera.
aPlayer.prototype.updateCameraPosition = function(timeStamp)
{
    wgCamera.update(timeStamp);
}

// The player collided with the environment.
aPlayer.prototype.die = function()
{
    this.isAlive = false;
    this.ent.object.material.setAnimation(8, 15, 0.4, 0);
}

