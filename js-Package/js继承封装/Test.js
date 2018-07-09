var util=(function () {
    return {
        extend:function (subClass,supClass) {
            function F() {}
            F.prototype=supClass.prototype;
            subClass.prototype=new F();
            subClass.prototype.constructor=subClass;
            subClass.superClass=supClass;
            if(supClass.prototype.constructor===Object.prototype.constructor){
                supClass.prototype.constructor=supClass;
            }
        },
        appendPrototype:function (target,source) {
            var names=Object.getOwnPropertyNames(source);
            for(var i=0;i<names.length;i++){
                var proto=Object.getOwnPropertyDescriptor(source,names[i]);
                Object.defineProperty(target,names[i],proto);
            }
        }
    }
})();
(function (win) {
    function DivElem(bg) {
        this.div=document.createElement("div");
        util.appendPrototype(this.div,DivElem.prototype);
        this.setBgColor(bg);
        return this.div;
    }
    DivElem.prototype={
        _width:0,
        _height:0,
        set width(value){
            this._width=value;
            this.style.width=value+"px";
        },
        get width(){
            return this._width;
        },
        set height(value){
            this._height=value;
            this.style.height=value+"px";
        },
        get height(){
            return this._height;
        },
        setBgColor:function (bg) {
            this.style.backgroundColor=bg;
            this.style.transform="rotate(60deg)";
        }
    };
    
    function BgDivElem(bg) {
        DivElem.call(this,bg);
        util.appendPrototype(this.div,BgDivElem.prototype);
        return this.div;
    }
    util.extend(BgDivElem,DivElem);
    BgDivElem.prototype.setBgColor=function (bg) {
        // this.div.style.backgroundColor=bg;
        BgDivElem.superClass.prototype.setBgColor.call(this.div,bg);
        this.div.style.border="1px solid #000000"
    };
    BgDivElem.prototype.scale=function (num) {
        // this.style.transform="scale("+num+","+num+")";
    };
    win.BgDivElem=BgDivElem;
    win.DivElem=DivElem;
})(window);