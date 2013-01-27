function aBat(wayPoints) 
{
    this.wayPoints = wayPoints;
    this.wayPointIndex = 0;
    this.wayPointElapsedTime = 0.0;
    this.wayPointReached = true;
    this.wayPointStartPos = wayPoints[0];
    this.wayPointEndPos = wayPoints[0];
    this.wayPointLength = 0;
    this.unitDuration = 3;
    this.collisionMargin = {x: 0.8, y: 0.8};
    this.collisionSize = {x: 0, y: 0};
}

aBat.prototype.onInit = function () 
{
	this.ent.object.size = {x: 512, y: 512};
    this.collisionSize = {
        x: this.ent.object.size.x * this.collisionMargin.x, 
        y: this.ent.object.size.x * this.collisionMargin.y };
    
    this.ent.createLight();
    this.ent.light.range = 20;
    this.ent.light.color.r = 1.0;
    this.ent.light.color.g = 0.0;
    this.ent.light.color.b = 0.0;
    
    for (var wayPoint in this.wayPoints)
    {
         this.wayPoints[wayPoint].y -= this.ent.object.size.y;
    }
    
    this.ent.object.material.initAtlas(4, 2, 2048, 1024, 2048, 1024);
    this.ent.object.material.setAnimation(0, 7, 0.2, 1);
    
    wgAudio.playSound("bat");
}

aBat.prototype.onUpdate = function (ts) 
{
    this.updateCollision();
    this.updateMovement(ts);
    this.updateLightPos();
}

aBat.prototype.updateLightPos = function()
{
    var isFlipped = this.wayPointStartPos.x - this.wayPointEndPos.x < 0;

    // Move light position.
	this.ent.light.pos.y = this.ent.object.pos.y + this.ent.object.size.y * 0.515;
    
    if (isFlipped)
    {
        this.ent.light.pos.x = this.ent.object.pos.x + this.ent.object.size.x * 0.555;
    }
    else
    {
        this.ent.light.pos.x = this.ent.object.pos.x + this.ent.object.size.x * 0.445;
    }
    
    this.ent.object.material.inverttexx = isFlipped ? 0 : 1;
}

// Update movement.
aBat.prototype.updateMovement = function(ts)
{
    // Select next waypoint.
    if (this.wayPointReached)
    { 
        this.wayPointReached = false;
        this.wayPointStartPos = this.wayPointEndPos;
        this.wayPointIndex = (this.wayPointIndex+1) % this.wayPoints.length;
        this.wayPointEndPos = this.wayPoints[this.wayPointIndex];
        this.wayPointElapsedTime = 0;
        this.wayPointLength = Math.sqrt(
            this.wayPointStartPos.x * this.wayPointStartPos.x + 
            this.wayPointStartPos.y * this.wayPointStartPos.y);
    }
    else
    {
        this.wayPointElapsedTime += ts;
        var progress = Math.min (1, this.wayPointElapsedTime / (this.unitDuration * this.wayPointLength));
        //console.log(progress);
        var interpolatedPosition = {x: 0, y: 0}; 
        interpolatedPosition.x = (1-progress) * this.wayPointStartPos.x + this.wayPointEndPos.x * progress;
        interpolatedPosition.y = (1-progress) * this.wayPointStartPos.y + this.wayPointEndPos.y * progress;
        
        //console.log(interpolatedPosition);
        
        if (progress >= 1)
        {
            this.wayPointReached = true;
        }
        
        // Move light position.
        this.ent.object.pos = interpolatedPosition;
    }
}


// Player dies on collision with the bat.
aBat.prototype.updateCollision = function (ts) 
{
	if (wgSimpleCollision.isColliding(
            this.ent.object.pos, 
            this.collisionSize, 
            wgCamera.follow.ent.object.pos, 
            wgCamera.follow.ent.object.size)) 
    {
        wgAudio.playSound("batCollide");
        wgCamera.follow.die();
    }
}
