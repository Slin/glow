//
//	wgRenderer.js
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

var wgRenderer = new function()
{
    this.first_obj = new wgObject();
    this.first_light = new wgLight();
	this.texture = 0;
	this.shader = 0;
	this.devicePixelRatio = window.devicePixelRatio || 1;

	this.mesh = 0;

	function setViewport()
	{
	  var newWidth = Math.round(wgMain.canvas.clientWidth*this.devicePixelRatio);
	  var newHeight = Math.round(wgMain.canvas.clientHeight*this.devicePixelRatio);

//	  newWidth = Math.clamp(newWidth, 1, 20000);
//	  newHeight = Math.clamp(newHeight, 1, 20000);

	  if (wgMain.canvas.width !== newWidth || wgMain.canvas.height !== newHeight) {
	    canvassizex = wgMain.canvas.width = newWidth;
	    canvassizey = wgMain.canvas.height = newHeight;

	    wgMain.gl.viewport(0, 0, newWidth, newHeight);
	  }
	}

    this.render = function(ts)
    {
    	setViewport();

        // Hintergrund loeschen
        wgMain.gl.clearDepth(1.0);
        wgMain.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        wgMain.gl.clear(wgMain.gl.COLOR_BUFFER_BIT|wgMain.gl.DEPTH_BUFFER_BIT);

//        wgMain.gl.colorMask(true, true, true, false);
        
        wgMain.gl.blendFunc(wgMain.gl.ONE, wgMain.gl.ONE_MINUS_SRC_ALPHA);
        wgMain.gl.enable(wgMain.gl.BLEND);
        wgMain.gl.disable(wgMain.gl.DEPTH_TEST);

        var lightposlist = [];
        var lightcollist = [];
        var light = this.first_light.next;
        while(light != 0)
        {
        	lightposlist.push(light.pos.x);
        	lightposlist.push(light.pos.y);
        	lightposlist.push(light.range);

        	lightcollist.push(light.color.r);
        	lightcollist.push(light.color.g);
        	lightcollist.push(light.color.b);
        	light = light.next;
        }
        while(lightposlist.length < 6*3)
        {
        	lightposlist.push(0.0);
        	lightcollist.push(0.0);
        }
        var lightpos = new Float32Array(lightposlist);
        var lightcol = new Float32Array(lightcollist);
        
        var tempobj = wgRenderer.first_obj.next;
		var counter = 0;
        while(tempobj != 0)
        {
			//TODO: remove hacky culling
			var pos = {x: Math.floor(tempobj.pos.x-wgCamera.pos.x), y: Math.floor(tempobj.pos.y-wgCamera.pos.y)};
			
            if (pos.x+tempobj.size.x < -canvassizex*0.5*scalefactor ||
                pos.y+tempobj.size.y < -canvassizey*0.5*scalefactor || 
                pos.x > canvassizex*0.5*scalefactor || 
                pos.y > canvassizey*0.5*scalefactor)
			{
				tempobj = tempobj.next;
				continue;
			}
		
			counter += 1;
            tempobj.material.updateAnimation(ts);
            
			if(this.shader != tempobj.material.shader)
			{
				wgMain.gl.useProgram(tempobj.material.shader);
				this.shader = tempobj.material.shader;
			}
            
			if(this.texture != tempobj.material.imageResource.texture)
			{
				wgMain.gl.activeTexture(wgMain.gl.TEXTURE0);
				wgMain.gl.bindTexture(wgMain.gl.TEXTURE_2D, tempobj.material.imageResource.texture);
				wgMain.gl.uniform1i(tempobj.material.shader.texloc, 0);
				this.texture = tempobj.material.imageResource.texture;
			}
            
            wgMain.gl.uniform4f(tempobj.material.shader.projloc, canvassizex, canvassizey, scalefactor/2.0, tempobj.rot);
            wgMain.gl.uniform4f(tempobj.material.shader.objloc, tempobj.pos.x, tempobj.pos.y, tempobj.size.x, tempobj.size.y);
            wgMain.gl.uniform2f(tempobj.material.shader.camposloc, wgCamera.pos.x, wgCamera.pos.y);

            wgMain.gl.uniform4f(tempobj.material.shader.atlasloc, tempobj.material.atlas.width, tempobj.material.atlas.height, tempobj.material.atlas.posx, tempobj.material.atlas.posy);
            wgMain.gl.uniform1f(tempobj.material.shader.inverttexx, tempobj.material.inverttexx);
			wgMain.gl.uniform4f(tempobj.material.shader.colorloc, tempobj.material.color.r, tempobj.material.color.g, tempobj.material.color.b, tempobj.material.color.a);
			
			if(!(tempobj.material.shader.lightposloc === undefined) && this.first_light.next != 0)
			{
				wgMain.gl.uniform3fv(tempobj.material.shader.lightposloc, lightpos);
				wgMain.gl.uniform3fv(tempobj.material.shader.lightcolorloc, lightcol);
			}

            wgMain.gl.vertexAttribPointer(tempobj.material.shader.posloc, 2, wgMain.gl.FLOAT, false, 0, 0);
            wgMain.gl.enableVertexAttribArray(tempobj.material.shader.posloc);
            wgMain.gl.drawArrays(wgMain.gl.TRIANGLES, 0, 6);
            
            tempobj = tempobj.next;
        }
    };
};