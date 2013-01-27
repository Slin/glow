		function addListeners()
		{
			var count = 0;
			var counter = 0;
			var interval = window.setInterval(function(){animetext();},30);
			document.getElementById('arRight').addEventListener("click",NextLevel,false);
			document.getElementById('arLleft').addEventListener("click",PreviousLevel,false);
			document.getElementById('level1').addEventListener("click",StartLevel1,false);
			document.getElementById("intro").addEventListener("click", ShowInstructions, false);
			document.getElementById("introBack").addEventListener("click", HideInstructions, false);
			window.addEventListener("keydown",keyListener);
			window.addEventListener("click",keyListener);
			
			// add your fuctions
			function animetext()
			{
				count +=0.05;
				var pic = document.getElementById('tltScreen');
				pic.style.opacity = Math.sin(count)*0.5+0.5;
			}
			function keyListener()
			{
				wgAudio.playSound("heartbeat");
				window.removeEventListener("keydown",keyListener);
				window.removeEventListener("click",keyListener);
				clearInterval(interval);
				ShowLevelMenu();
			}
			function StartLevel1()
			{	
				HideLevelMenu();
				wgAudio.stopAudio("menu");
				main(1);
			}
			
			function StartLevel2()
			{	
				HideLevelMenu();
				wgAudio.stopAudio("menu");
				main(2);
			}
			function StartLevel3()
			{	
				HideLevelMenu();
				wgAudio.stopAudio("menu");
				main(3);
			}
			function PreviousLevel()
			{
				changeLevel(-1);
			}
			function NextLevel()
			{
				changeLevel(1);
				
			}
			function checkLevel2(unlocked)
			{
				var curTab1 = document.getElementById('level1');
				curTab1.style.display = "none";
				var curTab2 = document.getElementById('locked3');
				curTab2.style.display = "none";
				var curTab3 = document.getElementById('level3');
				curTab3.style.display = "none";
				document.getElementById('level1').removeEventListener("click",StartLevel1,false);
				
				if(unlocked)
				{
					var curTab4 = document.getElementById('level2');
					curTab4.style.display = "block";
					var curTab5 = document.getElementById('locked2');
					curTab5.style.display = "none";
					document.getElementById('level2').addEventListener("click",StartLevel2,false);
				}
				else
				{
					var curTab6 = document.getElementById('locked2');
					curTab6.style.display = "block";
					var curTab7 = document.getElementById('level2');
					curTab7.style.display = "none";
				}
			}
			
			function checkLevel3(unlocked)
			{
				var curTab1 = document.getElementById('level1');
				curTab1.style.display = "none";
				var curTab2 = document.getElementById('locked2');
				curTab2.style.display = "none";
				var curTab3 = document.getElementById('level2');
				curTab3.style.display = "none";
				document.getElementById('level1').removeEventListener("click",StartLevel2,false);
				
				if(unlocked)
				{
					var curTab4 = document.getElementById('level3');
					curTab4.style.display = "block";
					var curTab5 = document.getElementById('locked3');
					curTab5.style.display = "none";
					document.getElementById('level3').addEventListener("click",StartLevel3,false);
				}
				else
				{
					var curTab6 = document.getElementById('locked3');
					curTab6.style.display = "block";
					var curTab7 = document.getElementById('level3');
					curTab7.style.display = "none";
				}
			}
			function changeLevel(factor)
			{
				counter += factor;
				if(counter < 0)
				{
					counter = 0;
				}
				
				if(counter > 2)
				{
					counter = 2;
				}
				
				switch(counter)
				{
					case 0:
						document.getElementById("level1").addEventListener("click", StartLevel1, false);
						var curTab1 = document.getElementById('level1');
						curTab1.style.display = "block";
						var curTab2 = document.getElementById('level2');
						curTab2.style.display = "none";
						var curTab3 = document.getElementById('locked2');
						curTab3.style.display = "none";
						var curTab4 = document.getElementById('locked3');
						curTab4.style.display = "none";
						var curTab5 = document.getElementById('level3');
						curTab5.style.display = "none";
						document.getElementById('level2').removeEventListener("click",StartLevel2,false);
					break;
					case 1:
						checkLevel2((gGlobals.maxlevel >= 2)?true:false);
					break;
					case 2:
						checkLevel3((gGlobals.maxlevel >= 3)?true:false);
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
				curBg4 = document.getElementById('intro');
				curBg4.style.display = "block";
				
				HideMenu();
			}
			function HideLevelMenu()
			{
				var curTab1 = document.getElementById('chapScreen');
				curTab1.style.display = "none";
				var curTab2 = document.getElementById('level1');
				curTab2.style.display = "none";
				var curTab3 = document.getElementById('level2');
				curTab3.style.display = "none";
				var curTab4 = document.getElementById('level3');
				curTab4.style.display = "none";
				var curTab5 = document.getElementById('locked2');
				curTab5.style.display = "none";
				var curTab6 = document.getElementById('locked3');
				curTab6.style.display = "none";
				var curBg7 = document.getElementById('arRight');
				curBg7.style.display = "none";
				var curBg8 = document.getElementById('arLleft');
				curBg8.style.display = "none";
				curTab4 = document.getElementById('intro');
				curTab4.style.display = "none";
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

			function ShowInstructions()
			{
				var curTab = document.getElementById('introSheet');
				curTab.style.display = "block";

				curTab = document.getElementById('introBack');
				curTab.style.display = "block";
			}

			function HideInstructions()
			{
				var curTab = document.getElementById('introSheet');
				curTab.style.display = "none";

				curTab = document.getElementById('introBack');
				curTab.style.display = "none";
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
			adjustPicture("arRight","116","87","180","-300");
			adjustPicture("arLleft","116","87","-140","-300");
			adjustPicture("level2","410","410","13","8");
			adjustPicture("locked2","410","410","13","8");
			adjustPicture("level3","410","410","13","8");
			adjustPicture("locked3","410","410","13","8");

			adjustPicture("intro","145","145","700","400");
			adjustPicture("introSheet","1920","1080","0","0");
			adjustPicture("introBack","116","87","500","-300");
		}
		function OnLoad()
		{
			addListeners();
			OnResize();
			wgAudio.playAudio("menu", true);
		}