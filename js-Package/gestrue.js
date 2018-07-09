(function(win){
	
	win.gesture = function (node,callback){
		//gesturestart是否执行
		var flag = false;
		//线段1
		var startC = 0;
		//∠1
		var startD = 0;
		//gesturestart  手指触碰当前元素，屏幕上有两个或者两个以上的手指
		node.addEventListener('touchstart',function(event){				
			var touch = event.touches;
			if(touch.length >= 2){
				
				flag = true;
				
				//event.touches[0].clientX
				startC = getC(touch[0],touch[1]);
				startD = getD(touch[0],touch[1]);
				
				//gesturestart
				if(callback && typeof callback['start']== 'function'){
					callback['start']();
				};
			};
		})
		//gesturechange 手指触碰当前元素，屏幕上有两个或者两个以上的手指位置在发生移动
		node.addEventListener('touchmove',function(event){
			var touch = event.touches;
			if(touch.length >= 2){
				//gesturechange
				//线段2
				var nowC = getC(touch[0],touch[1]);					
				//缩放比例
				event.scale = nowC/startC;
				//∠2
				var nowD = getD(touch[0],touch[1]);
				event.rotation = nowD - startD;
				
				if(callback && typeof callback['change'] == 'function'){
					callback['change'](event);
				}
			}
				
		});
		//gestureend  在gesturestart后, 屏幕上只剩下两根以下（不包括两根）的手指
		node.addEventListener('touchend',function(event){
			var touch = event.touches;
			if(flag){
				if(touch.length < 2){
					//gestureend
					if(callback && typeof callback['end']=='function'){
						callback['end']();
					}
				}
			};
			//重置
			flag = false;
		})
		
	}
		//求线段距离
	win.getC = function (p1,p2){
		var a = p1.clientX - p2.clientX;
		var b = p1.clientY - p2.clientY;
		//Math.sqrt() 开根号
		var c = Math.sqrt(a*a + b*b);
		
		return c;
	}
		//求角度
	win.getD = function (p1,p2){
		var y = p1.clientY - p2.clientY;
		var x = p1.clientX - p2.clientX;
		
		var deg = Math.atan2(y,x);
		//弧度转角度
		deg = deg*180/Math.PI;
		
		return deg;
	}
	
})(window);
