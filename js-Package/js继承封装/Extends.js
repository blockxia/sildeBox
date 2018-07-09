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
        }
    }
})();
/*var Box=(function () {
    function Box(num) {
        this.b=10;
        this.z=num;
    }
    Box.prototype={
        a:3,
        c:function () {
            console.log(this.a);
        }
    };
    return Box;
})();
var Desk=(function () {
    function Desk(num) {
        Box.call(this,num);
    }
    // Desk.prototype=new Box();
    // Desk.prototype=Box.prototype;
    //较全的继承模式，支持多个浏览器
    util.extend(Desk,Box);
    Desk.prototype.c=function () {
            console.log("desk")
    };
    //仅支持IE8以上浏览器
    /!*Desk.prototype=Object.create(Box.prototype);
    Desk.prototype.constructor=Desk;
    Desk.superClass=Box;*!/
    return Desk;
})();*/
(function (win) {
    function Box(num) {
        this.a=3;
        this.b=num;
    }
    Box.prototype={
        c:5,
        d:function () {
            console.log(this.b);
        }
    };
    function Desk(num) {
        Box.call(this,num);
    }
    util.extend(Desk,Box);
    // Desk.prototype=new Box();
    Desk.prototype.d=function () {
        Desk.superClass.prototype.d.call(this);
        console.log("desk");
    };
    win.Box=Box;
    win.Desk=Desk;
})(window);


