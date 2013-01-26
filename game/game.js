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
};

var musicplaying = "song1";
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
}


function gameevent(ts)
{


}


function main()
{
	wgMain.initWebgine(gameevent);


	wgMain.first_ent.addEntity("game/stage_1_basic.png", new aLevel());
	gGlobals.background = wgMain.first_ent.next;
    
    // The player entity.
    wgMain.first_ent.addEntity("game/player3.png", new aPlayer());
    gGlobals.player = wgMain.first_ent.next;


	var light = wgMain.first_ent.addEntity("game/player2.png", new aLight({x: 832, y: 532}));
	light.object.pos.x = 800;
	light.object.pos.y = 500;

	light = wgMain.first_ent.addEntity("game/player2.png", new aLight({x: 1732, y: 332}));
	light.object.pos.x = 1700;
	light.object.pos.y = 300;


	var x = 0;
	var y = 0;
	for(var i = 0; i < 10; i++)
	{
		x = Math.random()*3000+500;
		y = Math.random()*3000+500;
		light = wgMain.first_ent.addEntity("game/player2.png", new aLight({x: x+32, y: y+32}));
		light.object.pos.x = x;
		light.object.pos.y = y;
	}


	wgMain.first_ent.addEntity("game/stage_1_basic.png", new aLevel(), "light");
    
	
//	wgAudio.playAudio("song1", 1);


	wgMain.mainLoop();
}
