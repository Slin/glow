//
// wgMain.js
// Webgine
//
// Created by Nils Daumann on 30.10.11.
// Copyright (c) 2011 Nils Daumann


// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:


// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.


// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


var gGlobals = new function()
{
	this.player = 0;
    this.background = null;
    
	this.cursorposx = 0;
	this.cursorposy = 0;

	this.numlights = 0;

	this.reload = false;
	this.nextlevel = false;

	this.currlevelfunc = 0;
	this.nextlevelfunc = 0;

	this.maxlevel = 1;
	var cookie = getCookie("maxlevel");
	if(cookie != null && cookie != "")
	{
		this.maxlevel = parseInt(cookie);
	}
	this.currlevel = 1;
};

/*var musicplaying = "song1";
function toggleMusic()
{
	if(musicplaying != 0)
	{
		wgAudio.stopAudio(musicplaying);
		musicplaying = 0;
	}else
	{
		wgAudio.playAudio("song1", 1);
		musicplaying = "song1";
	}
}

var audioplaying = 1;
function toggleSound()
{
	if(audioplaying == 1)
	{
		wgAudio.muteAudio("song1");
		wgAudio.muteSounds();
		audioplaying = 0;
	}else
	{
		wgAudio.unmuteAudio("song1");
		wgAudio.unmuteSounds();
		audioplaying = 1;
	}
}*/

function setCookie(c_name, value, exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : ", expires="+exdate.toUTCString());
	var cookie = c_name + "=" + c_value+", path=/";
	document.cookie=cookie;
	alert(cookie+" : "+document.cookie);
}

function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(",");
	for (i=0;i<ARRcookies.length;i++)
	{
	  	x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
		    return unescape(y);
		}
	}
}

function gameevent(ts)
{
	if(gGlobals.numlights == 0)
	{
		wgCamera.follow.exit = true;
	}
	if(gGlobals.reload == true)
	{
		gGlobals.reload = false;
		setTimeout(function(){destroyLevel(); gGlobals.currlevelfunc();}, 2000);
	}
	if(gGlobals.nextlevel == true)
	{
		gGlobals.nextlevel = false;
		destroyLevel();
		gGlobals.nextlevelfunc();

		if(gGlobals.maxlevel <= gGlobals.currlevel)
		{
			gGlobals.maxlevel = gGlobals.currlevel;
			setCookie("maxlevel", gGlobals.maxlevel, 365);
		}
	}
}


function loadLevel1()
{
	gGlobals.background = wgMain.first_ent.addEntity("game/textures/stage_1_collision.png", new aLevel());
	gGlobals.background.object.material.imageResource.imageData = level1_collisiondata;

	wgMain.first_ent.addEntity("game/textures/stage_1_asset.png", new aLevel());
    
	wgMain.first_ent.addEmpty(new aSpiderNet(2200, 1100, 300*300));

    // The player entity.
    gGlobals.player = wgMain.first_ent.addEntity("game/textures/player.png", new aPlayer());
    gGlobals.player.action.pos.x = 813;
    gGlobals.player.action.pos.y = 3230;

	var light = wgMain.first_ent.addEntity("game/textures/flower.png", new aLight({x: 568, y: 536}));
	light.object.pos.x = 468;
	light.object.pos.y = 325;

	light = wgMain.first_ent.addEntity("game/textures/flower.png", new aLight({x: 3042, y: 3724}));
//	light.object.material.inverttexx = true;
	light.object.pos.x = 2942;
	light.object.pos.y = 3508;

	var ent = wgMain.first_ent.addEntity("game/textures/spider.png", new aSpider());
	ent.object.pos.x = 800;
	ent.object.pos.y = 3630;
	ent.object.rot = Math.PI-0.13;

    var movePath = [
        {x: 3088, y: 4096 - 3000}, 
        {x: 2064, y: 4096 - 3096}, 
        {x: 1520, y: 4096 - 2552}, 
        {x: 848, y: 4096 - 2136},
        {x: 936, y: 4096 - 952},
        {x: 848, y: 4096 - 2136},
        {x: 1520, y: 4096 - 2552}, 
        {x: 2064, y: 4096 - 3096}
        ];
        
	var ent = wgMain.first_ent.addEntity("game/textures/bat.png", new aBat(movePath));
	ent.object.pos.x = 800;
	ent.object.pos.y = 2000;

	wgMain.first_ent.addEntity("game/textures/stage_1_fog.png", new aLevel(), "light");

	gGlobals.currlevelfunc = loadLevel1;
	gGlobals.nextlevelfunc = loadLevel2;

	gGlobals.currlevel = 1;
}

function loadLevel2()
{
	gGlobals.background = wgMain.first_ent.addEntity("game/textures/stage_2_collision.png", new aLevel());
	gGlobals.background.object.material.imageResource.imageData = level2_collisiondata;

	wgMain.first_ent.addEntity("game/textures/stage_2_asset.png", new aLevel());
    
    // The player entity.
    gGlobals.player = wgMain.first_ent.addEntity("game/textures/player.png", new aPlayer());
    gGlobals.player.action.pos.x = 2048;
    gGlobals.player.action.pos.y = 1612;


	var light = wgMain.first_ent.addEntity("game/textures/flower.png", new aLight({x: 2836, y: 3276}));
	light.object.pos.x = 2736;
	light.object.pos.y = 3060;

	light = wgMain.first_ent.addEntity("game/textures/flower.png", new aLight({x: 796, y: 2484}));
	light.object.pos.x = 696;
	light.object.pos.y = 2268;

	light = wgMain.first_ent.addEntity("game/textures/flower.png", new aLight({x: 3324, y: 940}));
	light.object.pos.x = 3224;
	light.object.pos.y = 724;

	wgMain.first_ent.addEntity("game/textures/stage_2_fog.png", new aLevel(), "light");

	gGlobals.currlevelfunc = loadLevel2;
	gGlobals.nextlevelfunc = loadLevel1;

	gGlobals.currlevel = 2;
}

function destroyLevel()
{
	gGlobals.player = 0;
	gGlobals.background = 0;
	wgCamera.follow = 0;
	wgCamera.followobj = 0;

	while(wgMain.first_ent.next!=0)
	{
		wgMain.first_ent.next.destroy();
	}
	wgMain.first_ent = new wgEntity();

	gGlobals.numlights = 0;
}

function main(level)
{
	setCookie("maxlevel", 2, 356);

	wgMain.initWebgine(gameevent);

	switch(level)
	{
		case 1:
			loadLevel1();
			break;

		case 2:
			loadLevel2();
			break;
	}

	wgAudio.playAudio("ambient", true);

	wgMain.mainLoop();
}
