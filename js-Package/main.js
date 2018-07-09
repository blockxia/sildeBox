function RollImage3D(_imgList){
    if(_imgList.length<3){
        console.error("图片张数小于3张");
        return;
    }
    this.imgList=_imgList;
    this.rollImage=null;
    this.leftP=0;
    this.rightP=0;
}
RollImage3D.prototype={
    createRollImage:function () {
        if(this.rollImage) return this.rollImage;
        this.rollImage=$("<div></div>").css({
            width:"900px",
            height:"250px",
            position:"relative",
            overflow:"hidden"
        });
        for(var i=0;i<3;i++){
            var div=this.createImageDiv(this.imgList[i]);
            div.css({
                left:i*250+"px",
                zIndex:i
            });
            if(i==1){
                div.css({
                    zIndex:99,
                    opacity:1
                });
            }
            div.children().first().css("transform","rotateY("+(20-i*20)+"deg)");
            this.rollImage.append(div);
        }

        this.leftP=0;
        this.rightP=2;
        return this.rollImage;
    },
    clickHandler:function (e) {
        if(!this.mouseenable) return;
        var index=$(this).css("zIndex");
       if(index==99) return;
        if(index==2){
            //向左移
            this.self.leftMove();
        }else if(index==0){
            //向右移
            this.self.rightMove();
        }
    },
    createImageDiv:function (src) {
        var div=$("<div></div>").css({
            width: "400px",
            height: "200px",
            perspective: "500px",
            position:"absolute",
            opacity:0.6

        });
        var img=$("<img>");
        img.attr("src",src);
        img.css({
            width: "400px",
            height: "200px",
            boxShadow:"0px 5px 10px",
        });
        div.append(img);
        div.on("click",this.clickHandler);
        div[0].mouseenable=true;
        div[0].self=this;
        return div;
    },
    leftMove:function () {
       this.leftP++;
        this.rightP++;
        if(this.leftP>this.imgList.length-1){
            this.leftP=0;
        }
        if(this.rightP>this.imgList.length-1){
            this.rightP=0;
        }

        var div=this.createImageDiv(this.imgList[this.rightP]);
        div.css("left","950px");
        div[0].mouseenable=true;
        this.rollImage.append(div);
        var divs=this.rollImage[0].getElementsByTagName("div");
        for(var i=0;i<4;i++){
            divs[i].mouseenable=false;
        }

        $(divs[0]).animate({
            left:"-400px",
            zIndex:-1
        },1000,function () {
            divs[0].remove();
            for(var j=0;j<divs.length;j++){
                divs[j].mouseenable=true;
            }
        });


        $(divs[1]).animate({
            left:"0px",
            zIndex:0,
            opacity:0.6
        },1000);
        $(divs[1].children[0]).css({transform:"rotateY(20deg)"});
        $(divs[2]).animate({
            left:"250px",
            zIndex:99,
            opacity:1
        },1000);
        $(divs[2].children[0]).css({transform:"rotateY(0deg)"});
        $(divs[3]).animate({
            left:"500px",
            zIndex:2,
            opacity:0.6
        },1000);
        $(divs[3].children[0]).css({transform:"rotateY(-20deg)"});

    },
    rightMove:function () {
        this.leftP--;
        this.rightP--;
        if(this.leftP<0){
            this.leftP=this.imgList.length-1;
        }
        if(this.rightP<0){
            this.rightP=this.imgList.length-1;
        }

        var div=this.createImageDiv(this.imgList[this.leftP]);
        div.css("left","-400px");
        div[0].mouseenable=true;
        this.rollImage.prepend(div);
        var divs=this.rollImage[0].getElementsByTagName("div");
        for(var i=0;i<4;i++){
            divs[i].mouseenable=false;
        }
        $(divs[0]).animate({
            left:"0px",
            opacity:0.6,
            zIndex:0
        },1000);
        $(divs[0].children[0]).css({transform:"rotateY(20deg)"});
        $(divs[1]).animate({
            left:"250px",
            zIndex:99,
            opacity:1
        },1000);
        $(divs[1].children[0]).css({transform:"rotateY(0deg)"});
        $(divs[2]).animate({
            left:"500px",
            zIndex:2,
            opacity:0.6
        },1000);
        $(divs[2].children[0]).css({transform:"rotateY(-20deg)"});
        $(divs[3]).animate({
            left:"900px",
            zIndex:-1,
            opacity:0.6
        },1000,function () {
            $(divs[3]).remove();
            for(var j=0;j<divs.length;j++){
                   divs[j].mouseenable=true;
            }
        });

    }

};
RollImage3D.prototype.constructor=RollImage3D;