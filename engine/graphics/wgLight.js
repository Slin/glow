//
//	wgObject.js
//	Webgine
//
//	Created by Nils Daumann on 30.10.11.
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

function wgLight()
{
    this.prev = 0;
    this.next = 0;

    this.pos = {x : 0, y : 0};
    this.color = {r: 1, g: 1, b: 1};
    this.range = 100;
    
    this.mesh = 0;
    this.material = 0;
}

wgLight.prototype.addLight = function()
{
    var temp = new wgLight();
    temp.next = this.next;
    this.next.prev = temp;
    this.next = temp;
    this.next.prev = this;
	
    return temp;
};

wgLight.prototype.destroy = function() 
{
	this.prev.next = this.next; 
	this.next.prev = this.prev;
};