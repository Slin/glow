function aSpiderNet(x_, y_, range) 
{
    this.pos = {x: x_, y: y_};
    this.range = range;
}

aSpiderNet.prototype.onInit = function () 
{
/*	this.ent.createLight();
    this.ent.light.pos = this.pos;
    this.ent.light.range = Math.sqrt(this.range);*/
}

aSpiderNet.prototype.onUpdate = function (ts) 
{
	var distx = this.pos.x-wgCamera.follow.pos.x-wgCamera.followobj.size.x*0.5;
    var disty = this.pos.y-wgCamera.follow.pos.y-wgCamera.followobj.size.y*0.5;
    var dist = distx*distx+disty*disty;
    if(!this.active && dist < this.range)
    {
        gGlobals.player.action.slowed += 1;
    }
}
