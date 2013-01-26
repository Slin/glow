function aSpider() 
{
}

aSpider.prototype.onInit = function () {
	this.ent.object.size.x = 256;
	this.ent.object.size.y = 256;
}
aSpider.prototype.onUpdate = function (ts) {
    if (this.isThrowing)
    {
        this.updateThrow(ts);
        return;
    }

	if (wgSimpleCollision.isColliding(            this.ent.object.pos,             this.ent.object.size,             wgCamera.follow.ent.object.pos,             wgCamera.follow.ent.object.size))     {
          
		wgAudio.playSound("activate");
        
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
        var reflectVector = 
        {
            x: direction.x - 2 * upVector.x * dot,
            y: direction.y - 2 * upVector.y * dot
        };
        
        wgCamera.follow.velocity.x = reflectVector.x * wgCamera.follow.ent.object.size.x * 15;
        wgCamera.follow.velocity.y = reflectVector.y * wgCamera.follow.ent.object.size.y * 15;
        
        wgCamera.follow.setPoison();
	}
}
