var Utils=(function () {
  return {
      /*
      *  给对象添加属性
      *
      * */
      addProperty:function (target,source) {
          var names=Object.getOwnPropertyNames(source);
          for(var i=0;i<names.length;i++){
              var prop=Object.getOwnPropertyDescriptor(source,names[i]);
              if(typeof(prop.value)==="object" && prop.value){
                    var obj={};
                    console.log(obj,prop.value);
                  this.addProperty(obj,prop.value);
                  prop.value=obj;
              }
              Object.defineProperty(target,names[i],prop);


          }
      },
      //给DOM元素添加样式
      setElemStyle:function (elem,style) {
          for(var str in style){
              elem.style[str]=style[str];
          }
      }
  }
})();
var EVENT={
    GET_SHOP_DATA:"get_Shop_Data",
    GET_SHOP_LIST:"get_Shop_List",
    ADD_SHOP_GOODS:"add_Shop_Goods",
    REMOVE_SHOP_GOODS:"remove_Shop_Goods",
    SELECT_SHOP_GOODS:"select_Shop_Goods",
    CHANGE_GOODS_NUM:"change_Goods_Num"
};
var HTTP=(function () {
    var xhr=new XMLHttpRequest();
    xhr.addEventListener("load",loadHandler);
    function loadHandler(e) {
        var obj=JSON.parse(decodeURIComponent(xhr.responseText));
        var event;
        switch (Number(obj.type)){
            case 101:
                event=new Event(EVENT.GET_SHOP_DATA);
                break;
            case 102:
                event=new Event(EVENT.GET_SHOP_LIST);
                break;
            case 103:
                event=new Event(EVENT.ADD_SHOP_GOODS);
                break;
            case 104:
                event=new Event(EVENT.REMOVE_SHOP_GOODS);
                break;
            case 105:
                event=new Event(EVENT.SELECT_SHOP_GOODS);
                break;
            case 106:
                event=new Event(EVENT.CHANGE_GOODS_NUM);
                break
        }
        event.resultObj=obj.result;
        window.dispatchEvent(event);
    }
    return {
        PATH:"http://localhost:3000",
        getShopData:function () {
            xhr.open("GET",this.PATH+"?type=101&times="+new Date().getTime());
            xhr.send();
        },
        getShopList:function () {
            xhr.open("GET",this.PATH+"?type=102&times="+new Date().getTime());
            xhr.send();
        },
        addShopGoods:function (id) {
            xhr.open("GET",this.PATH+"?type=103&id="+id+"&times="+new Date().getTime());
            xhr.send();
        },
        removeShopGoods:function (id) {
            xhr.open("GET",this.PATH+"?type=104&id="+id+"&times="+new Date().getTime());
            xhr.send();
        },
        selectShopGoods:function (id,check) {
            xhr.open("GET",this.PATH+"?type=105&id="+id+"&check="+check+"&times="+new Date().getTime());
            xhr.send();
        },
        changeGoodsNum:function (id,num) {
            xhr.open("GET",this.PATH+"?type=106&id="+id+"&num="+num+"&times="+new Date().getTime());
            xhr.send();
        }

    }
})();
(function (win) {
    /*
    *   主对象，首次执行项目时，调用该对象的init方法
    *   data是商品图标数据
    *
    *
    * */
   var Mains={

        //所有内容放在外面的容器
        parent:null,
        //购物车列表

        //商品列表
        table:null,
        div:null,
        /*初始化，根据数据初始化商品图标，
        初始化表格，并且存储这个表格
        侦听window中的icon发出事件*/
        init:function (parent) {
            this.parent=parent;
            this.createShopIcon(parent);
            this.table=this.createTable(parent);
            // this.createDataTr();
            /*
            *  侦听点击icon图标事件
            *  侦听删除购物车中物品事件
            *  侦听选中购物车物品事件
            *  侦听购物车中物品数量更改事件
            *
            * */
            win.addEventListener(EVENT.GET_SHOP_DATA,this.createShopIconContent);
            win.addEventListener(EVENT.ADD_SHOP_GOODS,this.updataTable);
            win.addEventListener(EVENT.REMOVE_SHOP_GOODS,this.updataTable);
            win.addEventListener(EVENT.CHANGE_GOODS_NUM,this.changeGoodNumHandler)
            win.addEventListener(EVENT.GET_SHOP_LIST,this.updataTable);
            win.addEventListener(ShopIcon.ICON_CILICK_EVENT,this.iconClickHandler);
            win.addEventListener(ShopShowTr.DELETE_DATA_EVENT,this.deleteDataHandler);
            win.addEventListener(ShopShowTr.CHECK_DATA_EVENT,this.checkDataHandler);
            win.addEventListener(StepNumber.STEP_CHANGE_EVENT,this.dataNumberChange);
            HTTP.getShopData();

        },
        /*
        *  创建图标
        *  参数 parent  把图标添加到那里
        *  新建shopIcon，并且把数据塞入shopicon
        *  因为数据的塞入，所以内容发生改变
        *  再把每个icon放在容器中
        *
        *
        * */
        createShopIcon:function (parent) {
            this.div=document.createElement("div");
            this.div.className="clearFloat";
            parent.appendChild(this.div);
        },
       createShopIconContent:function (e) {

           var len=Mains.div.children.length;
           for(var i=0;i<len;i++){
               Mains.div.removeChild(0);
           }

           for(var j=0;j<e.resultObj.length;j++){
               var shopIcon=new ShopIcon(true);
               shopIcon.data=e.resultObj[j];
               Mains.div.appendChild(shopIcon);
           }
           HTTP.getShopList();
       },
        /*
        * 创建表格，并且传出
        *
        * */
        createTable:function (parent) {
            var table=document.createElement("table");
            table.style.borderCollapse="collapse";
            parent.appendChild(table);
            return table;
        },
        /*
        * 当点击icon，这里将收到消息
        *
        * */
        iconClickHandler:function (e) {
            HTTP.addShopGoods(e.data.id);
        },
        //创建行
        createDataTr:function (list) {
            //如果当前购物车列表是空的，跳出
            if(list.length===0) return;
            var trH=new ShopShowTr(i);
            trH.number=-1;
            trH.data=Object.getOwnPropertyNames(list[0]);
            this.table.appendChild(trH);
            //从-1开始循环表示创建表头
            for(var i=0;i<list.length;i++){
                var tr=new ShopShowTr(i);
                tr.data=list[i];
                this.table.appendChild(tr);
                if(list[i].selected){
                    Mains.reSum(list[i].id)
                }
            }
        },
        //清除表格
        clearTable:function () {
            for(var i=0;i<this.table.children.length;i++){
                this.table.children[i].dispose();
            }
            this.table.remove();
            this.table=this.createTable(this.parent);
        },
        //删除数据
        deleteDataHandler:function (e) {
            HTTP.removeShopGoods(e.goodId)
        },
        //物品数量修改时
        dataNumberChange:function (e) {
           /* var index=-1;
            for(var i=0;i<Mains.shopingList.length;i++){
                if(Mains.shopingList[i].id===e.id){
                    Mains.shopingList[i].num=e.data;
                    index=i;
                }
            }*/
           HTTP.changeGoodsNum(e.id,e.data);
            Mains.reSum(e.id);
        },
        //选中或者取消选择该物品时
        checkDataHandler:function (e) {

            if(e.num===-1) return;
            console.log(e.checked)
            HTTP.selectShopGoods(e.goodId,e.checked)
            Mains.reSum(e.goodId);
        },
        //计算总价
        reSum:function (id) {
           /* var tr=Mains.table.children[index+1];
            if(!tr) return;
            var sum=0;
            if(Mains.shopingList[index].selected){
                sum=Mains.shopingList[index].price*Mains.shopingList[index].num;
            }
            Mains.shopingList[index].sumPrice=sum;*/
           var sum=0;
           for(var i=0;i<Mains.table.children.length;i++){
              var ids=Number(Mains.table.children[i].children[0].textContent);
               if(ids===Number(id)){
                   if(Mains.table.children[i].children[5].firstElementChild.checked){
                       var number=Mains.table.children[i].children[3].firstElementChild.data;
                       var price=Mains.table.children[i].children[4].textContent;
                       sum=number*price;

                   }
                   Mains.table.children[i].children[6].textContent=sum;


               }
           }

        },
       updataTable:function (e) {
           Mains.clearTable();
           Mains.shopingList=e.resultObj;
           Mains.createDataTr(e.resultObj);
       },
       changeGoodNumHandler:function (e) {
           console.log(e)
       }
    };

    /*
    *   商品图标类
    *   1、是一个div，div的属性中添加该类的原型
    *   2、允许用户输入数据，根据数据重新刷新当前容器中内容
    *   3、当用户点击这个商品图标时对外界通知
    *   4、商品图标中应该有商品的名称
    *
    * */
    function ShopIcon(float) {
        var div=document.createElement("div");
        div.style.width="240px";
        div.style.height="50px";
        div.style.padding="5px";
        if(float){
            div.style.float="left";
        }else{
            div.style.float="none";
        }
        div.style.border="1px solid #000000";
        div.style.cursor="default";
        Utils.addProperty(div,ShopIcon.prototype);
        div.addEventListener("click",this.clickHandler);
        return div;
    }
    ShopIcon.ICON_CILICK_EVENT="Icon_Click_Event";
    ShopIcon.prototype={
        _data:null,
        /*
        *  当设置data值时，
        *   1、清除当前容器中的所有内容
        *   2、重新更新图标容器
        *
        * */
        set data(value){
            this._data=value;
            this.clearIcon();
            this.updataIcon(value.icon,value.name,value.price);
        },
        get data(){
            return this._data;
        },
        /*
        *  清除容器里面的所有元素
        *  因为容器里每次清除，长度都会变化，因此，我们先取出长度
        *  每次清除第0个，原因是删除第0个后下一个会补到第0个
        *
        * */
        clearIcon:function () {
            var len=this.children.length;
            for(var i=0;i<len;i++){
                this.children[0].remove();
            }
        },
        /*
        *  通过参数icon和title，以及price添加对应的元素
        *  icon是一个图片
        *  title是一个标题
        *  price是价格
        *
        * */
        updataIcon:function (icon,title,price) {
            var img=new Image();
            img.src=icon;
            img.style.height="50px";
            img.style.float="left";
            this.appendChild(img);
            var titles=document.createElement("h4");
            titles.textContent=title;
            titles.style.width="180px";
            titles.style.height="30px";
            titles.style.textAlign="center";
            titles.style.float="left";
            this.appendChild(titles);
            var div=document.createElement("div");
            div.textContent=price+"元";
            div.style.textAlign="center";
            this.appendChild(div);
        },
        /*
        * 当点击icon时，抛法事件什么数据被点击了，由外部处理
        *
        * */
        clickHandler:function (e) {
            var event=new Event(ShopIcon.ICON_CILICK_EVENT);
            event.data=this.data;
            win.dispatchEvent(event);
        }
    };
    /*
    *  表格行的类
    *
    * */
    function ShopShowTr(number) {
        var tr=document.createElement("tr");
        Utils.addProperty(tr,ShopShowTr.prototype);
        tr.number=number;
        return tr;
    }
    ShopShowTr.DELETE_DATA_EVENT="delete_data_event";
    ShopShowTr.CHECK_DATA_EVENT="check_data_event";
    ShopShowTr.prototype={
        number:0,
        _data:null,
        step:null,
        check:null,
        //根据数据清除td，创建td
        set data(value){

            this._data=value;
            if(!value) return;
            this.clearTd();
            this.createTd();
        },
        get data(){
            return this._data;
        },
        //清除td
        clearTd:function () {
            var len=this.children.length;
            for(var i=0;i<len;i++){
                this.children[0].remove();
            }
        },
        //创建td
        createTd:function () {
            var tdStyle={
                width:"120px",
                height:"30px",
                textAlign:"center",
                lineHeight:"30px",
                border:"1px solid #000000"
            };
            if(this.number===-1){
                for(var i=0;i<this.data.length;i++){
                    var th=document.createElement("th");
                    if(this.data[i]==="selected"){
                        this.createCheckBox(th);
                    }else{
                        th.textContent=this.data[i];
                    }
                    Utils.setElemStyle(th,tdStyle);
                    this.appendChild(th);
                }
                return;
            }
            for(var str in this.data){
                var td=document.createElement("td");
                if(str==="selected"){
                    this.createCheckBox(td,Boolean(this.data[str]));
                }else if(str==="icon"){
                    var img=new Image();
                    img.src=this.data[str];
                    img.style.height="25px";
                    img.style.marginBottom="-7px";
                    td.appendChild(img);
                }else if(str==="num"){
                    this.step=new StepNumber(this.data.id);
                    td.appendChild(this.step);
                    this.step.data=this.data.num;
                    this.step.style.marginLeft="5px";
                }else if(str==="delete"){
                    var bn=document.createElement("button");
                    bn.textContent="删除";
                    bn.obj=this;
                    bn.addEventListener("click",this.deleteHandler);
                    td.appendChild(bn);
                }else{
                    td.textContent=this.data[str];
                }

                Utils.setElemStyle(td,tdStyle);
                this.appendChild(td);
            }
        },
        //创建多选框
        createCheckBox:function (parent,checked) {
            if(!checked) checked=false;
           this.check=document.createElement("input");
            this.check.type="checkbox";
            this.check.index=this.number;
            this.check.checked=checked;
            this.check.tr=this;
            this.check.addEventListener("click",this.checkChangeHandler);
            parent.appendChild(this.check);
        },
        //多选框修改事件
        checkChangeHandler:function (e) {
            if(this.index===-1){
                for(var i=0;i<this.tr.parentElement.children.length;i++){
                    this.tr.parentElement.children[i].check.checked=this.checked;
                    var event=new Event(ShopShowTr.CHECK_DATA_EVENT);
                    event.num=this.tr.parentElement.children[i].number;
                    event.checked=this.checked;
                    var goodId=this.tr.parentElement.children[i].children[0].textContent;
                    event.goodId=goodId;
                    win.dispatchEvent(event);
                }
                return;
            }
            var evt=new Event(ShopShowTr.CHECK_DATA_EVENT);
            evt.num=this.tr.number;
            evt.checked=this.checked;
            evt.goodId=this.tr.children[0].textContent;
            win.dispatchEvent(evt);
            if(!this.checked && this.tr.parentElement.children[0].check.checked){
                this.tr.parentElement.children[0].check.checked=false;
                return;
            }
            if(!this.tr.parentElement.children[0].check.checked){
                var bool=true;
                for(var j=1;j<this.tr.parentElement.children.length;j++){
                    if(!this.tr.parentElement.children[j].check.checked){
                        bool=false;
                        return;
                    }
                }
                this.tr.parentElement.children[0].check.checked=true;
            }
        },
        //删除按钮事件
        deleteHandler:function (e) {
            var event=new Event(ShopShowTr.DELETE_DATA_EVENT);
            event.goodId=this.obj.data.id;

            win.dispatchEvent(event);
            this.removeEventListener("click",this.obj.deleteHandler);
        },
        dispose:function () {
            // this.check.removeEventListener("click",this.checkChangeHandler);
            this.check=null;
            // this.step.dispose();
            this.step=null;
            this.data=null;
        }
    };
    /*
    *  计步器
    *  左右按钮和文本框
    *  当点击左右按钮时让数据增减
    *  如果输入框内容，验证数据
    *
    * */
    function StepNumber(id) {
        //创建div
        var div=document.createElement("div");
        //把当前类的原型添加到div上
        Utils.addProperty(div,StepNumber.prototype);
        //给div清除浮动
        div.className="clearFloat";
        //给div增加点击事件
        div.addEventListener("click",this.clickHandler);
        //创建div中的个中按钮和文本框
        div.createStep();
        //确认当前输入框的是什么商品的，因此绑定一个商品id，再后续的数据改变抛发事件中告知外部是那个商品的数据改变
        div.shopId=id;
        return div;
    }
    //数据改变的抛法事件名称
    StepNumber.STEP_CHANGE_EVENT="step_change_event";
    StepNumber.prototype={
        //输入文本框
        input:null,
        //step的数据
        _data:1,
        //创建step
        createStep:function () {
            // 所有的样式
            var styles={
                float:"left",
                width:"28px",
                height:"28px",
                textAlign:"center",
                lineHeight:"30px",
                cursor:"default",
                border:"1px solid #000000"
            };
            // 创建左边div的减号按钮
            var leftDiv=document.createElement("div");
            leftDiv.textContent="-";
            Utils.setElemStyle(leftDiv,styles);
            this.appendChild(leftDiv);
            //创建input,并且侦听input事件,设置input的初始显示内容是this.data
            this.input=document.createElement("input");
            this.input.addEventListener("input",this.inputHandler);
            this.input.type="text";
            this.input.value=this.data;
            //因为input侦听事件后this不再是div，而是input，所以我们添加input中的obj属性是div
            this.input.obj=this;
            Utils.setElemStyle(this.input,styles);
            var inputStyle={
                width:"50px",
                borderLeft:"none",
                borderRight:"none"
            };
            Utils.setElemStyle(this.input,inputStyle);
            this.appendChild(this.input);
            //创建右边加号div，并且设置样式
            var rightDiv=document.createElement("div");
            rightDiv.textContent="+";
            Utils.setElemStyle(rightDiv,styles);
            this.appendChild(rightDiv);
        },
        /*
        * div点击时的事件
        * this是div，e.target是被点击的目标
        * 如果被点击的目标不存在时，跳出
        * 如果被点击的目标的文本内容是加号或者减号时，
        * 让this.data加1或者减1，因为this.data是一个访问器，因次设置this.data后，会有其它的操作
        * 如果this.data是1的时候，我们不能让商品数量小于1，因此不执行减1
        *
        *
        * */
        clickHandler:function (e) {
            if(!e.target)return;
            if(e.target.textContent==="+"){
                  this.data++;
            }else if(e.target.textContent==="-"){
                if(this.data===1) return;
                  this.data--;
            }
        },
        /*
        *
        *  当输入文本框时，判断数据并且处理
        *
        * */
        inputHandler:function (e) {
            //当输入的内容是非数值时，删除最后一个元素
            if(isNaN(Number(e.data))){
                this.value=this.value.slice(0,-1);
            }
            //当文本前面插入一个非数值时，我们让该数值为1
            if(isNaN(Number(this.value)))
            {
                this.value="1";
            }
            //让文本内容先清除前后空格，然后转换数值，这样就可以去除前导0，在转换字符
            this.value=Number(this.value.trim()).toString();
            // 如果输入的字符是0，我们让他为1
            if(this.value==="0"){
                this.value="1";
            }
            //div的_data值改变为当前文本内容值，不设置data就是为了不产生冲突
            this.obj._data=Number(this.value);
            //抛法事件，告知外面什么商品的数据改了，带出商品id和数据
            var event=new Event(StepNumber.STEP_CHANGE_EVENT);
            event.data=this.obj.data;
            event.id=this.obj.shopId;
            win.dispatchEvent(event);
        },
        /*
        * stepNumber数值
        * 当点击左右按钮时，重设数值
        * 让input的内容也改变
        * 抛法事件告知外面什么商品的数据改变
        *
        * */
        set data(value){
            this._data=value;
            this.input.value=value;
            var event=new Event(StepNumber.STEP_CHANGE_EVENT);
            event.data=value;
            event.id=this.shopId;
            win.dispatchEvent(event);
        },
        get data(){
            return this._data;
        },
        dispose:function () {

        }
    };

    win.StepNumber=StepNumber;
    win.ShopShowTr=ShopShowTr;
    win.Main=Mains;
    win.ShopIcon=ShopIcon;
})(window);