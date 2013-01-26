//
//	wgMain.js
//	Webgine
//
//	Created by Nils Daumann on 28.10.11.
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

var scalefactor = 2/(window.devicePixelRatio || 1);
var canvassizex = 800;
var canvassizey = 400;
var gamemode = 1;

function fullscreen()
{
    var el = document.getElementById('wgCanvas');
 
    if(el.webkitRequestFullScreen)
    {
        el.webkitRequestFullScreen();
    }
    else
    {
        el.mozRequestFullScreen();
    }            
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

var wgMain = new function()
{
    this.canvas = 0;
    this.gl = 0;
	this.first_ent = new wgEntity();
    this.gameeventhandler = 0;

    this.mainLoop = function()
    {
        window.requestAnimFrame(wgMain.mainLoop, this.canvas);
        
        wgTimer.getTime();
        wgMain.gameeventhandler(wgTimer.timestep);

        //console.log(wgTimer.timestep);
		
		var tempent = wgMain.first_ent.next;
		while(tempent)
		{
			if(tempent.action)
			{
				if(tempent.action.onUpdate)
				{
					tempent.action.onUpdate(wgTimer.timestep);
				}
			}
			tempent = tempent.next;
		}
        
        wgRenderer.render(wgTimer.timestep);
    };

    this.throwOnGLError = function(err, funcName, args)
    {
        throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to" + funcName;
    };

    this.initWebgine = function(event)
    {
        // canvas ist die "Leinwand" auf die gezeichnet werden kann
        this.canvas = document.getElementById("wgCanvas");//, {alpha : false});
        wgKeyboard.initKeyboard();
        this.gl = WebGLUtils.setupWebGL(this.canvas);
        WebGLDebugUtils.makeDebugContext(this.gl, this.throwOnGLError);
        wgMain.gameeventhandler = event;

        this.canvas.addEventListener("click", toggleFullScreen);
    };
};