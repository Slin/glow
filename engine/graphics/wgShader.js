//
//	wgShader.js
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

var wgShader = new function()
{
    this.compileShader = function(type, source)
    {
        var shader = wgMain.gl.createShader(type);
        wgMain.gl.shaderSource(shader, source);
        wgMain.gl.compileShader(shader);
        if(!wgMain.gl.getShaderParameter(shader, wgMain.gl.COMPILE_STATUS))
        {
            alert("invalid shader: "+wgMain.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };

    this.getShader = function(name)
    {
    	if(name != "light")
    	{
			if(!wgResource.getResource("shader_base"))
			{
				var vShaderQuellcode = "attribute vec2 vPosition;"+
					"uniform vec4 projection;"+
					"uniform vec4 object;"+
					"uniform vec2 campos;"+
					"uniform vec4 atlasinfo;"+
					"uniform float inverttexcoordx;"+
					"varying vec2 texcoord0;"+
					"void main()"+
					"{"+
					"	texcoord0 = vPosition;"+
					"	if(inverttexcoordx > 0.1)"+
					"		texcoord0.x = 1.0-texcoord0.x;"+
					"    texcoord0 = texcoord0*atlasinfo.xy+atlasinfo.zw;"+
					"	 vec2 pos = vPosition-vec2(0.5);"+
					"	 pos = vec2(cos(projection.w)*pos.x-sin(projection.w)*pos.y, sin(projection.w)*pos.x+cos(projection.w)*pos.y);"+
					"	 pos += vec2(0.5);"+
					"    gl_Position = vec4((object.xy-campos+pos*object.zw)/projection.xy, 0.0, projection.z);"+
					"}" ;
					
				var fShaderQuellcode = "precision mediump float;"+
					"uniform lowp sampler2D tex0;"+
					"uniform lowp vec4 color;"+
					"varying mediump vec2 texcoord0;"+
					"void main()"+
					"{"+
					"    gl_FragColor = texture2D(tex0, texcoord0)*color;"+
					"	 gl_FragColor.rgb *= gl_FragColor.a;"+
					"}";

				var id = wgMain.gl.createProgram();
				var vShader = this.compileShader(wgMain.gl.VERTEX_SHADER, vShaderQuellcode);
				wgMain.gl.attachShader(id, vShader);
				var fShader = this.compileShader(wgMain.gl.FRAGMENT_SHADER, fShaderQuellcode);
				wgMain.gl.attachShader(id, fShader);
				wgMain.gl.linkProgram(id);
				
				id.posloc = wgMain.gl.getAttribLocation(id, "vPosition");
				id.projloc = wgMain.gl.getUniformLocation(id, "projection");
				id.objloc = wgMain.gl.getUniformLocation(id, "object");
				id.camposloc = wgMain.gl.getUniformLocation(id, "campos");
				id.atlasloc = wgMain.gl.getUniformLocation(id, "atlasinfo");
				id.inverttexx = wgMain.gl.getUniformLocation(id, "inverttexcoordx");
				id.texloc = wgMain.gl.getUniformLocation(id, "tex0");
				id.colorloc = wgMain.gl.getUniformLocation(id, "color");
				
				wgResource.addResource("shader_base", id, null, null);
			}

			return wgResource.getResource("shader_base").texture;
		}
		else
		{
			if(!wgResource.getResource("shader_light"))
			{
				var vShaderQuellcode = "attribute vec2 vPosition;"+
					"uniform vec4 projection;"+
					"uniform vec4 object;"+
					"uniform vec2 campos;"+
					"uniform vec4 atlasinfo;"+
					"uniform float inverttexcoordx;"+
					"varying vec2 texcoord0;"+
					"varying vec2 worldpos;"+
					"void main()"+
					"{"+
					"	texcoord0 = vPosition;"+
					"	if(inverttexcoordx > 0.1)"+
					"		texcoord0.x = 1.0-texcoord0.x;"+
					"    texcoord0 = texcoord0*atlasinfo.xy+atlasinfo.zw;"+
					"	 worldpos = (object.xy+vPosition*object.zw);"+
					"    gl_Position = vec4((worldpos-campos)/projection.xy, 0.0, projection.z);"+
					"}" ;
					
				var fShaderQuellcode = "precision mediump float;"+
					"uniform lowp sampler2D tex0;"+
					"uniform lowp vec4 color;"+
					"uniform mediump vec3 lightpos[6];"+
					"uniform mediump vec3 lightcolor[6];"+
					"varying mediump vec2 texcoord0;"+
					"varying mediump vec2 worldpos;"+
					"void main()"+
					"{"+
					"	 gl_FragColor.rgb = pow(texture2D(tex0, texcoord0).rgb, vec3(2.2));"+
					"	 float dist = length(lightpos[0].xy-worldpos)/lightpos[0].z+0.5;"+
					"    vec3 light = lightcolor[0]/(dist*dist*dist*dist);"+
					"    dist = length(lightpos[1].xy-worldpos)/lightpos[1].z+0.5;"+
					"    light += lightcolor[1]/(dist*dist*dist*dist);"+
					"    dist = length(lightpos[2].xy-worldpos)/lightpos[2].z+0.5;"+
					"    light += lightcolor[2]/(dist*dist*dist*dist);"+
					"    dist = length(lightpos[3].xy-worldpos)/lightpos[3].z+0.5;"+
					"    light += lightcolor[3]/(dist*dist*dist*dist);"+
					"    dist = length(lightpos[4].xy-worldpos)/lightpos[4].z+0.5;"+
					"    light += lightcolor[4]/(dist*dist*dist*dist);"+
					"    dist = length(lightpos[5].xy-worldpos)/lightpos[5].z+0.5;"+
					"    light += lightcolor[5]/(dist*dist*dist*dist);"+
					"	 gl_FragColor.rgb *= light;"+
					"	 gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2));"+
					"    gl_FragColor.a = 1.0;"+
					"	 gl_FragColor.rgb *= gl_FragColor.a;"+
					"}";

				var id = wgMain.gl.createProgram();
				var vShader = this.compileShader(wgMain.gl.VERTEX_SHADER, vShaderQuellcode);
				wgMain.gl.attachShader(id, vShader);
				var fShader = this.compileShader(wgMain.gl.FRAGMENT_SHADER, fShaderQuellcode);
				wgMain.gl.attachShader(id, fShader);
				wgMain.gl.linkProgram(id);
				
				id.posloc = wgMain.gl.getAttribLocation(id, "vPosition");
				id.projloc = wgMain.gl.getUniformLocation(id, "projection");
				id.objloc = wgMain.gl.getUniformLocation(id, "object");
				id.camposloc = wgMain.gl.getUniformLocation(id, "campos");
				id.atlasloc = wgMain.gl.getUniformLocation(id, "atlasinfo");
				id.inverttexx = wgMain.gl.getUniformLocation(id, "inverttexcoordx");
				id.texloc = wgMain.gl.getUniformLocation(id, "tex0");
				id.colorloc = wgMain.gl.getUniformLocation(id, "color");
				id.lightposloc = wgMain.gl.getUniformLocation(id, "lightpos");
				id.lightcolorloc = wgMain.gl.getUniformLocation(id, "lightcolor");
				
				wgResource.addResource("shader_light", id, null, null);
			}

			return wgResource.getResource("shader_light").texture;
		}
    };
};
