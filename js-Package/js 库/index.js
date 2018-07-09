
var index=0;//定义全局变量，默认时0
$(function () {
    //找到所有的图片
    var pics=$(".bg li");//找到bg下面的所有li
    //找到所有的小圆点
    var lis=$(".indicator li");
/*--------------------------------------------------------------------*/
    //提取一个公共的换图方法
    function changePic() {
        //控制li 的class就可以显示出来，实现换图
     /*--------------------------------------------------------------------*/
        //给当前的元素添加class，同时找到他的兄弟节点移除样式
        pics.eq(index).addClass("current").siblings().removeClass("current");//添加一个样式，方法
    /*--------------------------------------------------------------------*/
        //控制小圆点颜色的变化
        lis.eq(index).addClass("current").siblings().removeClass("current");
    }
    changePic();//调用函数
/*--------------------------------------------------------------------*/
    //点击小圆点换图
    lis.click(function () {
        //去改变index的值
        index=$(this).index();//this代表当前每一个li元素
        // console.log(index);
        //调用换图的函数
        changePic();
    });
    /*--------------------------------------------------------------------*/
    //点击左右箭头换图
    $(".left").click(function () {
        //点击左侧箭头
        index--;
        if(index==-1){
            index=lis.length-1;//重新赋值回到最后一个5----->照片是6张，索引值为0-5；
        }
        changePic();
    });
    /*--------------------------------------------------------------------*/
    $(".right").click(function () {
        //点击右侧箭头
        index++;
        if(index==lis.length){
            index=0;/*向右加到超出范围，给它指回第一个*/
        }
        changePic();
    })
});