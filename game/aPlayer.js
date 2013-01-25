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
function aPlayer()
{
    this.SpeedFactor = 0.02;

	this.ent = 0;
    this.deltaTime = 0;
}

// timeStamp: Elapsed time scince last render call in millisecons.
aPlayer.prototype.onUpdate = function(timeStamp)
{
    this.deltaTime += timeStamp;

    this.updateInput(timeStamp);
};

aPlayer.prototype.updateInput = function(timeStamp)
{
    if (wgKeyboard.left)
    {
       this.ent.object.pos.x -= timeStamp * this.SpeedFactor;
    }
    if (wgKeyboard.right)
    {
       this.ent.object.pos.x += timeStamp * this.SpeedFactor;
    }
    if (wgKeyboard.down)
    {
       this.ent.object.pos.y -= timeStamp * this.SpeedFactor;
    }
    if (wgKeyboard.up)
    {
       this.ent.object.pos.y += timeStamp * this.SpeedFactor;
    }
}
