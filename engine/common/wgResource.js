//
//	wgResource.js
//	Webgine
//
//	Created by Simon Schmudde on 03.11.11.
//	Copyright (c) 2011 Simon Schmudde

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

var wgResource = new function()
{
    var resources = new Array();
	
	this.getResource = function(filename)
	{
		return resources[filename];
	};
	
	this.addResource = function(filename, res, image, data)
	{
        var newResource = { filename: filename, texture: res, imageData: data, imageObject: image};
    
		resources[filename] = newResource;
        
        return newResource;
	};
    
    this.computeBinaryMap = function(filename)
    {    
        var resource = this.getResource(filename);
    
        if (!resource)
        {
            return null;
        }
        
        if (resource.imageData != null)
        {
            return null;
        }
    
        var img = $(resource.imageObject)[0];
        var canvas = $('<canvas/>')[0];
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        
        resource.imageData = wgTexture.computeBinaryMap(canvas.width, canvas.height, canvas.getContext('2d'));
        resources[filename] = resource;
        
        document.writeln("LevelData:");
        document.write("var levelX_collisiondata = {width: ");
        document.write(resource.imageData.width);
        document.write(", height: ");
        document.write(resource.imageData.height);
        document.write(", data: [");
        document.write(resource.imageData.data);
        document.writeln("]};");
        document.writeln("--------------------");

        /*
        var index = 0;
        var line = "";
        for (var pixel in resource.imageData.data)
        {
            line += resource.imageData.data[pixel];
            index++;
            
            if (index == canvas.width / wgTexture.regionFactor / wgTexture.bytesPerChannel)
            {
                index = 0;
                console.log(line);
                line = "";
            }
        }
        */
        
        return resource;
    }
    
};