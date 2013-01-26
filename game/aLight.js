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


function aLight(lightpos)
{
	this.ent = 0;
	this.time = Math.random()*10000.0;
	this.active = false;
	this.lightpos = lightpos;

	gGlobals.numlights += 1;
}

aLight.prototype.onInit = function()
{
	this.ent.createLight();
	this.ent.light.pos = this.lightpos;
	this.ent.light.color.r = Math.random();
	this.ent.light.color.g = Math.random();
	this.ent.light.color.b = Math.random();
	this.ent.light.range = 0;

	this.ent.object.size.x = 256;
	this.ent.object.size.y = 256;
	this.ent.object.material.initAtlas(2, 1, 512, 256, 512, 256);
	this.ent.object.material.setAtlas(1);
//	this.ent.object.rot = Math.random()*2*Math.PI;
}

aLight.prototype.onUpdate = function(ts)
{
	this.time += ts;
	var clamp = Math.sin(this.time*0.005)*0.5+0.5;
	if(this.active == true)
	{
		this.ent.light.range = $.easing.easeInOutElastic(this.ent.light.range, clamp, 145, 150, 2);
	}
	else
	{
		var distx = this.ent.light.pos.x-wgCamera.follow.pos.x-wgCamera.followobj.size.x*0.5;
		var disty = this.ent.light.pos.y-wgCamera.follow.pos.y-wgCamera.followobj.size.y*0.5;
		var dist = distx*distx+disty*disty;
		if(!this.active && dist < 10000)
		{
			gGlobals.numlights -= 1;
			wgAudio.playSound("activate");
			this.ent.object.material.setAtlas(0);
			this.active = true;
		}
	}
};