//
//	wgCamera.js
//	Webgine
//
//	Created by Nils Daumann on 29.10.11.
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

var wgCamera = new function() 
{
    this.BorderAmount = {x: 0.4, y: 0.4};
    
    this.borderMargin = {x: 100, y: 100};
    this.pos = {x: 0, y: 0};
    this.dir = 0;
	this.look = 0;
    this.speed = 1;
	this.speedy = 0.9;
	
	this.follow = 0; // Camera follows this wgObject
	this.followobj = 0;
	
	this.set = function(x,y)
	{
		this.pos.x=x;
		this.pos.y=y;
	}
	
    this.update = function(speed) 
    {
		if(!this.follow)
			return;
            
        // Update inner frame size
        this.borderMargin.x = canvassizex * this.BorderAmount.x;
		this.borderMargin.y = canvassizey * this.BorderAmount.y;
		
		x = this.follow.pos.x+this.followobj.size.x*0.5;
		y = this.follow.pos.y+this.followobj.size.y*0.5;
		
		this.speed = speed;
	  
        var xOff = this.borderMargin.x - Math.max(Math.min((canvassizex / 2) 
            - Math.abs(this.pos.x - x), this.borderMargin.x), 0);
      
        if (x - this.pos.x < 0)
        {
            xOff *= -1;
        }

        var yOff = this.borderMargin.y - Math.max(Math.min((canvassizey / 2) 
            - Math.abs(this.pos.y - y), this.borderMargin.y), 0); 
                  
        if (y - this.pos.y < 0)
        {
            yOff *= -1;
        }
        
        //console.log(xOff + " " + yOff + "," );
      
        x = this.pos.x + xOff;
        y = this.pos.y + yOff;
      
        // Always keep inside the level.
        x = Math.min(Math.max(x, canvassizex/2*scalefactor), gGlobals.background.object.size.x - canvassizex*scalefactor/2);
        y = Math.min(Math.max(y, canvassizey/2*scalefactor), gGlobals.background.object.size.y - canvassizey*scalefactor/2);
        
        this.pos.x = x;
        this.pos.y = y;
    }
};
