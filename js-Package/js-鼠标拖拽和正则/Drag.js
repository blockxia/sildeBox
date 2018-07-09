var Drag=(function () {
     return {
         start:function (elem,range) {
             elem.addEventListener("mousedown",mouseHandler);
             var offsetPoint={};
             function mouseHandler(e) {
                 if(e.type==="mousedown"){
                    this.addEventListener("mouseup",mouseHandler);
                    window.addEventListener("mousemove",mouseHandler);
                    this.addEventListener("mouseleave",mouseHandler);
                     offsetPoint.x=e.offsetX;
                     offsetPoint.y=e.offsetY;
                 }else if(e.type==="mouseup" || e.type==="mouseleave"){
                     this.removeEventListener("mouseleave",mouseHandler);
                     this.removeEventListener("mouseup",mouseHandler);
                     window.removeEventListener("mousemove",mouseHandler);
                 }else if(e.type==="mousemove"){
                    elem.style.left=e.clientX-offsetPoint.x+"px";
                    elem.style.top=e.clientY-offsetPoint.y+"px";
                    if(range){
                        if(elem.offsetLeft<=range.left){
                            elem.style.left=range.left+"px";
                        }
                        if(elem.offsetTop<=range.top){
                            elem.style.top=range.top+"px";
                        }
                        if(elem.offsetLeft>=range.left+range.width-elem.offsetWidth){
                            elem.style.left=range.left+range.width-elem.offsetWidth+"px";
                        }
                        if(elem.offsetTop>=range.top+range.height-elem.offsetHeight){
                            elem.style.top=range.top+range.height-elem.offsetHeight+"px";
                        }
                    }
                    var evt=new Event(Drag.ElEM_MOVE_EVENT);
                    evt.point= {x:elem.offsetLeft,y:elem.offsetTop};
                    elem.dispatchEvent(evt);
                 }
             }
         },
         ElEM_MOVE_EVENT:"ElemMovePointEvent"
     }
})();