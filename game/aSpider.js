function aSpider() {}

aSpider.prototype.onInit = function () {
	this.ent.object.size.x = 256;
	this.ent.object.size.y = 256;
}
aSpider.prototype.onUpdate = function (ts) {
	if (wgSimpleCollision.isColliding(            this.ent.object.pos,             this.ent.object.size,             wgCamera.follow.ent.object.pos,             wgCamera.follow.ent.object.size))     {
		wgAudio.playSound("activate");
	}
}
