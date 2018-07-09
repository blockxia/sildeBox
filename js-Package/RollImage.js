function RollImage(imageList,width,height,lrBnList) {
    this.liWH=20;
    //            所有的轮播图片样式
    this.imgsStyle= {
        width: width+"px",
        height:height+"px"
    };
//            右侧按钮样式
    this.rightBnStyle={
        position: "absolute",
        right: "10px"
    };
//            左侧按钮的样式
    this.leftBnStyle={
        position: "absolute",
        left: "10px"
    };
//            所有li的样式
    this.liStyle={
        width:this.liWH+"px",
        height: this.liWH+"px",
        borderRadius:this.liWH+"px",
        backgroundColor:"rgba(255,0,0,0.6)",
        border: "1px solid #FF0000",
        float: "left",
        lineHeight: this.liWH+"px",
        textAlign: "center",
        marginLeft: this.liWH+"px",
        color:"white"
    };
//            ul的样式
    this.ulStyle={
        listStyle: "none",
        position: "absolute",
        bottom: "10px"
    };
//            轮播图片的容器样式
    this.imgConStyle={
        width: width*2+"px",
        height:height+"px",
        position: "absolute",
        left:"0px"
    };
//            最大容器的样式
    this.maskDivStyle={
        width: width+"px",
        height: height+"px",
        overflow: "hidden",
        position: "absolute",
        // position:"relative" ,
        // margin: "auto",
        backgroundColor: "antiquewhite"
    };
    //            轮播图片容器
    this.imgCon=null;
//            最大容器
   this.maskDiv=null;
//            左侧按钮
    this.leftBn=null;
//            右侧按钮
    this.rightBn=null;
//            所有li
    this.lis=null;
//            目标要轮播的位置
    this.targetP=0;
//            当前的位置
   this.currentP=0;
//            轮播方向
    this.direction="";
//            自动轮播间隔时间
    this.time=120;
//            是否自动轮播
    this.autoBool=true;
//            要轮播图片的数组
    this.imgArr=imageList;
    this.directionButtonSource=lrBnList;
    this.width=width;
    this.height=height;
    this._timeInit=120;
}
RollImage.prototype={
        speed:30,
        autoRoll:false,
        get timeInit(){
            return this._timeInit;
        },
        set timeInit(value){
            this._timeInit=value;
            this.time=value;
        },
        createRoll:function () {
            this.initHtml();
             this.changeLi();
            this.update();
            this.leftBn.addEventListener("click",this.clickHandler.bind(this));
            this.rightBn.addEventListener("click",this.clickHandler.bind(this));
            for(var j=0;j<this.lis.length;j++){
                this.lis[j].addEventListener("click",this.clickHandler.bind(this));
            }
            this.maskDiv.addEventListener("mouseover",this.maskDivHandler.bind(this));
            this.maskDiv.addEventListener("mouseout",this.maskDivHandler.bind(this));
            return this.maskDiv;
        },
    update:function () {
        this.autoShow();
        this.imgMove();
    },
    initHtml:function () {
        //                创建最大容器div，并且添加到body
        this.maskDiv=ElementUtil.createDiv("maskDiv",this.maskDivStyle);
        // document.body.appendChild(this.maskDiv);
//                创建图片滚动容器，并且放在最大容器中
        this.imgCon=ElementUtil.createDiv("imgCon",this.imgConStyle);
        this.maskDiv.appendChild(this.imgCon);
//                创建左右图片按钮
        this.leftBn=ElementUtil.createImg(this.directionButtonSource[0],"leftBn",this.leftBnStyle);
        this.maskDiv.appendChild(this.leftBn);
        this.rightBn=ElementUtil.createImg(this.directionButtonSource[1],"rightBn",this.rightBnStyle);
        this.maskDiv.appendChild(this.rightBn);
        this.leftBn.addEventListener("load",onload.bind(this));
        this.rightBn.addEventListener("load",onload.bind(this));
        function onload(e) {
            e.target.style.top=(this.height-e.target.height)/2+"px";
        }
//                新建列表内容数组，根据图片的列表数组创建，有多少图片就有多少项
        var list=[];
        for(var i=0;i<this.imgArr.length;i++){
            list.push(i+1);
        }
//                根据列表内容创建ul，li列表,并且设置他们的样式
        var ul=ElementUtil.createUl(list,this.ulStyle,this.liStyle);
        this.maskDiv.appendChild(ul);

        var ulWidth=this.liWH*2*list.length;
        ul.style.left=(this.width-ulWidth)/2+"px";
//                获取创建好的li列表
        this.lis=ul.getElementsByTagName("li");
//                创建轮播图的首图,首图是图片列表中的第一张
        var img=ElementUtil.createImg(this.imgArr[0],"",this.imgsStyle);
        this.imgCon.appendChild(img);
    },
    changeLi:function () {
        for(var i=0;i<this.lis.length;i++){
            if(this.currentP==i){
                this.lis[this.currentP].style.backgroundColor="rgba(255,255,255,0.6)";
                this.lis[this.currentP].style.color="#FF0000";
            }else{
                this.lis[i].style.backgroundColor="rgba(255,0,0,0.6)";
                this.lis[i].style.color="#FFFFFF";
            }
        }
    },
    clickHandler:function (e) {
        if(!e){
            e=window.event;
        }
//                如果不是空是表示当前正在轮播，因此返回出去不执行后续语句
        if(this.direction!="") return;
        if(this.leftBn==e.target){
            if(this.targetP==0){
                this.targetP=this.lis.length-1;
            }else{
                this.targetP--;
            }
//                    告知函数向右运动
            this.changeDirection(false);
        }else if(this.rightBn==e.target){
            if(this.targetP==this.lis.length-1){
                this.targetP=0
            }else{
                this.targetP++;
            }
//                    告知函数向左运动
            this.changeDirection(true);
        }else{
            for(var i=0;i<this.lis.length;i++){
                if(this.lis[i]==e.target){
                    this.targetP=i;
//                            如果目标位置小于当前位置时，传入向右走，否则传入向左走
                    if(this.targetP<this.currentP){
                        this.changeDirection(false);
                    }else{
                        this.changeDirection(true);
                    }
                }
            }
        }
    },
    maskDivHandler:function (e) {
        if(!e){
            e=window.event;
        }
        if(e.type=="mouseover"){
            this.autoBool=false;
        }else if(e.type=="mouseout"){
            this.autoBool=true;
        }
        this.time=this.timeInit;
    },
    changeDirection:function (left) {
        if(this.targetP==this.currentP) return;
        var img=ElementUtil.createImg(this.imgArr[this.targetP],"",this.imgsStyle);
        if(left){
            this.direction="left";
            this.imgCon.appendChild(img);
        }else{
            this.direction="right";
            this.imgCon.insertBefore(img,this.imgCon.firstElementChild);
            this.imgCon.style.left=-this.width+"px";
        }
    },
    imgMove:function () {
        //如果方向不是左并且不是右的时候，不进入该函数内容
        if(this.direction!="left" && this.direction!="right") return;
        if(this.direction=="left"){
            if(parseFloat(this.imgCon.style.left)>-this.width){
                this.imgCon.style.left=parseFloat(this.imgCon.style.left)-this.speed+"px"
            }else{
                this.imgCon.removeChild(this.imgCon.firstElementChild);
                this.imgCon.style.left="0px";
                this.direction="";
                this.currentP=this.targetP;
                this.changeLi();
                this.time=this.timeInit;
            }

        }
        if(this.direction=="right"){
            if(parseFloat(this.imgCon.style.left)<0){
                this.imgCon.style.left=parseFloat(this.imgCon.style.left)+this.speed+"px"
            }else{
                this.imgCon.removeChild(this.imgCon.lastElementChild);
                this.imgCon.style.left="0px";
                this.direction="";
                this.currentP=this.targetP;
                this.changeLi();
                this.time=this.timeInit;
            }

        }
    },
    autoShow:function () {
        if(!this.autoRoll) return;
        if(!this.autoBool) return;
        this.time--;
        if(this.time!=0) return;

        if(this.targetP==this.imgArr.length-1){
            this.targetP=0
        }else{
            this.targetP++;
        }
        this.changeDirection(true);
    },
    dispose:function () {
        this.leftBn.removeEventListener("click",this.clickHandler.bind(this));
        this.rightBn.removeEventListener("click",this.clickHandler.bind(this));
        for(var j=0;j<this.lis.length;j++){
            this.lis[j].removeEventListener("click",this.clickHandler.bind(this));
        }
        this.maskDiv.removeEventListener("mouseover",this.maskDivHandler.bind(this));
        this.maskDiv.removeEventListener("mouseout",this.maskDivHandler.bind(this));
        this.imgsStyle= null;
        this.rightBnStyle=null;
        this.leftBnStyle=null;
        this.liStyle=null;
        this.ulStyle=null;
        this.imgConStyle=null;
        this.maskDivStyle=null;
        if(this.lis){
            this.lis.length=0;
            this.lis=null;
        }
        if(this.leftBn){
            this.leftBn.remove();
            this.leftBn =null;
        }
        if(this.rightBn){
            this.rightBn.remove();
            this.rightBn=null;
        }
        if(this.maskDiv){
            this.maskDiv.remove();
            this.maskDiv=null;
        }
        if(this.imgCon){
            this.imgCon.remove();
            this.imgCon=null;
        }
        this.imgArr.length=0;
        this.imgArr=null;
        this.directionButtonSource.length=0;
        this.directionButtonSource=null;
    }
};

var ElementUtil=ElementUtil || (function () {
        return {
            changeObjectStyle:function (obj,style) {
//                循环传入的style样式对象下的所有属性
                for(var str in style){
//                  与该内容相似  obj.style.backgroundColor=style.backgroundColor
                    obj.style[str]=style[str];
                }
            },
            createDiv:function (id,style) {
//                创建一个div
                var div=document.createElement("div");
                if(id.length>0){
                    div.id=id;
                }
                this.changeObjectStyle(div,style);
                return div;
            },
            createImg:function (src,id,style) {
                var img=new Image();
                if(id.length>0){
                    img.id=id;
                }
                img.src=src;
                this.changeObjectStyle(img,style);
                return img;
            },
            createUl:function (list,ulStyle,liStyle) {
 //                创建ul标签
                var ul=document.createElement("ul");
//                给ul标签添加样式
                this.changeObjectStyle(ul,ulStyle);
//                根据传入的列表项创建li
                for(var i=0;i<list.length;i++){
//                    创建li
                    var li=document.createElement("li");
//                    给li添加样式
                    this.changeObjectStyle(li,liStyle);
//                    给li的内容赋值为列表项
                    li.textContent=list[i];
//                    把li添加到ul中
                    ul.appendChild(li);
                }
                return ul;
            }
        }
    })();