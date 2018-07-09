/*
*    类使用函数来描述，类名必须首字母大写，驼峰命名法则
*    Box.prototype  原型
*    用来定义类名的函数，这种函数叫做构造函数，比如下面的Box就构造函数
*    类被实例化后形成对象，对象就具备两种属性和方法，
*    一种是对象属性，这种属性写在构造函数中
*    一种是原型属性，这种属性写在原型中
*    对象属性可以直接用for in遍历，但是原型属性不能遍历
*    如果原型属性和对象属性都有设置，并且设置相同时，
*    那么在构造函数中的这个对象属性和原型属性并列存在，调用时实际是调用对象属性
*    原型属性不改变，只有通过原型链来改变原型属性(this.__proto__.属性)
*
*
*
* */

function Box() {
    this.a=10;
    this.d=5;
}
/*原型链*/
Box.prototype={
     a:1,
     b:2,
     c:function () {
        console.log(this.a,this.b,this.d);
     }
};
Box.prototype.play=function () {
    
};

/*var Circle=(function () {
    var abc=3;
    function Circle() {
        
    }
    Circle.prototype={
        a:3,
        b:4,
        c:function () {
            
        }
    };
    return Circle;
})();*/
(function (win) {
  function Circle(w,h) {
     this.w=w;
     this.a=h;
  }
  Circle.prototype={
      a:10,
      b:200,
      c:function () {
           console.log(this.a,this.__proto__.a)
      }
  };
  win.Circle=Circle;
})(window);
