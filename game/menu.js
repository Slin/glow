function addListeners()
{
	var count = 0;
	var interval = window.setInterval(function(){animetext();},30);
	document.getElementById('arRight').addEventListener("click",NextLevel,false);
	document.getElementById('arLleft').addEventListener("click",PreviousLevel,false);
	document.getElementById('level1').addEventListener("click",StartLevel1,false);
	window.addEventListener("keydown",keyListener);

	// add your fuctions
	function animetext()
	{
		count +=0.05;
		var pic = document.getElementById('tltScreen');
		pic.style.opacity = Math.sin(count)*0.5+0.5;
	}
	function keyListener()
	{
		window.removeEventListener("keydown",keyListener);
		clearInterval(interval);
		ShowLevelMenu();
	}
	function StartLevel1()
	{	
		HideLevelMenu();
		main();
	}
	
	function PreviousLevel()
	{
		document.getElementById('level1').addEventListener("click",StartLevel1,false);
		var curTab2 = document.getElementById('level1');
		curTab2.style.display = "block";
		var curTab2 = document.getElementById('level2');
		curTab2.style.display = "none";
	}
	function NextLevel()
	{
		document.getElementById('level1').removeEventListener("click",StartLevel1,false);
		var curTab2 = document.getElementById('level1');
		curTab2.style.display = "none";
		var curTab2 = document.getElementById('level2');
		curTab2.style.display = "block";
		
	}
	function changeLevel(count)
	{
		switch(count)
		{
			case 0:
			var curTab2 = document.getElementById('level1');
			curTab2.style.display = "block";
			var curTab2 = document.getElementById('level2');
			curTab2.style.display = "none";
			var curTab2 = document.getElementById('level3');
			curTab2.style.display = "none";
			break;
		}
	}
	function ShowLevelMenu()
	{
		var curTab = document.getElementById('chapScreen');
		curTab.style.display = "block";
		var curTab2 = document.getElementById('level1');
		curTab2.style.display = "block";
		var curBg3 = document.getElementById('arRight');
		curBg3.style.display = "block";
		var curBg4 = document.getElementById('arLleft');
		curBg4.style.display = "block";
		
		HideMenu();
	}
	function HideLevelMenu()
	{
		var curTab1 = document.getElementById('chapScreen');
		curTab1.style.display = "none";
		var curTab2 = document.getElementById('level1');
		curTab2.style.display = "none";
		var curBg3 = document.getElementById('arRight');
		curBg3.style.display = "none";
		var curBg4 = document.getElementById('arLleft');
		curBg4.style.display = "none";
	}
	function HideMenu()
	{
		var curTab = document.getElementById('tltScreen');
		curTab.style.display = "none";
		var curTab2 = document.getElementById('strScreen');
		curTab2.style.display = "none";
	}
	
	function ShowMouseOver()
	{
		this.style.backgroundColor= '#ff0';
	}
	function ShowMouseOut()
	{
		this.style.backgroundColor= 'transparent';
	}
}
function adjustPicture(id,width,height,offsetX,offsetY)
{
	var xFactor = window.innerWidth/1920;
	var yFactor = window.innerHeight/1080;
	var element = document.getElementById(id);
	
	element.width = width*xFactor;
	element.height = height*yFactor;
	
	var setMidx = (window.innerWidth- element.width)/2+offsetX*xFactor;
	var setMidy = (window.innerHeight- element.height)/2-offsetY*yFactor;
	
	console.log(innerWidth);
	
	element.style.position = "absolute";
	element.style.left = setMidx+"px";
	element.style.top = setMidy+"px";
}
function OnResize()
{
	adjustPicture("strScreen","1920","1080","0","0");
	adjustPicture("tltScreen","588","33","8","-300");
	adjustPicture("level1","410","410","13","8");
	adjustPicture("chapScreen","1920","1080","0","0");
	adjustPicture("arRight","116","87","360","-30");
	adjustPicture("arLleft","116","87","-320","-30");
	adjustPicture("level2","410","410","13","8");
}
function OnLoad()
{
	addListeners();
	OnResize();
}