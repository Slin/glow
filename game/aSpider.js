function aSpider() 
{
    this.spiderCollisionScale = {x: 0.7, y: 0.7};
    this.spiderBox = {x: 0, y: 0};
}

aSpider.prototype.onInit = function () 
{
	this.ent.object.size.x = 256;
	this.ent.object.size.y = 256;

    this.spiderBox.x = this.ent.object.size.x * this.spiderCollisionScale.x;
    this.spiderBox.y = this.ent.object.size.y * this.spiderCollisionScale.y;
    
    this.ent.object.material.initAtlas(4, 4, 1024, 512, 1024, 512);
    this.ent.object.material.setAnimation(0, 7, 0.1, 1);
}

aSpider.prototype.onUpdate = function (ts) 
{
	if (wgSimpleCollision.isColliding(
            this.ent.object.pos, 
            this.spiderBox, 
            wgCamera.follow.ent.object.pos, 
            wgCamera.follow.ent.object.size)) 
    {
          
		wgAudio.playSound("spider");
        
        var length =  Math.sqrt(wgCamera.follow.velocity.x * wgCamera.follow.velocity.x 
            + wgCamera.follow.velocity.y * wgCamera.follow.velocity.y);
            
        var direction = 
        {
            x: wgCamera.follow.velocity.x / length,
            y: wgCamera.follow.velocity.y / length
        };
        var rot = this.ent.object.rot;
        var upVector = {x: -Math.sin(rot), y: Math.cos(rot) };
        var dot = upVector.x * direction.x + upVector.y * direction.y;
        var reflectVector = { x: 0, y:0 };
        
        // Check if the reflection faces in the wall and correct it.
        if (dot > 0)
        {
            reflectVector = upVector;
        }
        else
        {
            reflectVector = {
                x: direction.x - 2 * upVector.x * dot,
                y: direction.y - 2 * upVector.y * dot
            };
        }
        
        wgCamera.follow.velocity.x = reflectVector.x * wgCamera.follow.ent.object.size.x * 10;
        wgCamera.follow.velocity.y = reflectVector.y * wgCamera.follow.ent.object.size.y * 10;
        
        wgCamera.follow.setPoison();
	}
}
