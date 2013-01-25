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
	wgMain.first_ent.addEntity("game/player.png", new aPlayer());
	wgMain.first_ent.addEntity("game/player2.png", 0);
	wgMain.first_ent.next.object.pos.x = 256;
	
//	wgAudio.playAudio("song1", 1);

	wgMain.mainLoop();
}