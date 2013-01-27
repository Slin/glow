function aBat() 
{
    
}

aBat.prototype.onInit = function () 
{
	this.ent.object.size = {x: 256, y: 256};
    this.ent.createLight();
    this.ent.light.range = 20;
    this.ent.light.color.r = 1.0;
    this.ent.light.color.g = 0.0;
    this.ent.light.color.b = 0.0;
}

aBat.prototype.onUpdate = function (ts) 
{
	this.ent.light.pos.x = this.ent.object.pos.x+198;
    this.ent.light.pos.y = this.ent.object.pos.y+256-178;
}
