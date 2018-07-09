var http=require("http");
var querystring=require("querystring");
var server=http.createServer(function(req,res){
    console.log(req.headers.host);
    req.on("data",function (data) {

    });
    req.on("end",function () {
        var dataObj=querystring.parse(req.url.split("?")[1]);
        // console.log(dataObj);
        //写入消息头
        res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
        // var str=(Number(dataList.a)+10)+"&"+(Number(dataList.b)+20);
        /*dataObj.a=Number(dataObj.a)+10;
        dataObj.b=Number(dataObj.b)+20;*/
        console.log(dataObj.name+"签到成功");
        dataObj.age=Number(dataObj.age)+10;
        res.write(JSON.stringify(dataObj));
        res.end();
    })
});
server.listen(3000,"localhost",function(){
    console.log("开始监听...");
});

