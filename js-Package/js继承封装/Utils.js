var Box=(function () {
    function Box() {
        this.a=3;
        this.b=4;
    }
    Box.prototype={
        c:10,
        d:function () {
            console.log(this.c);
        }
    };
    // Box.prototype.constructor=Box;
    return Box;
})();
var DivClass=(function () {
    function DivClass(w,h,bg) {
        var div=document.createElement("div");
        div.style.width=w+"px";
        div.style.height=h+"px";
        div.style.backgroundColor=bg;
        div.addEventListener("click",this.clickHandler);
        Utils.appendPrototype(div,DivClass.prototype);
        return div;
    }
    DivClass.prototype={
        randomColor:function () {
            var col="rgba(";
            for(var i=0;i<3;i++){
                col+=Math.floor(Math.random()*256)+",";
            }
            col+="1)";
            return col;
        },
        clickHandler:function () {
            this.style.backgroundColor=this.randomColor();
        }
    };
    return DivClass;
})();
var Utils=(function () {
    return {
        appendPrototype:function (target,source) {
            var names=Object.getOwnPropertyNames(source);
            for(var i=0;i<names.length;i++){
                var proto=Object.getOwnPropertyDescriptor(source,names[i]);
                Object.defineProperty(target,names[i],proto);
            }
        }
    }
})();