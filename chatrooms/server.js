var http=require('http');
var fs=require('fs');
var path=require('path');
var mime=require('mime');
var cache={};
var server=http.createServer(function(request,response){
    var filePath=false;
    if(request.url=='/'){
        filePath='public/index.html';
    }else{
        filePath='public'+request.url;
    }
    var absPath='./'+filePath;
    serverStatic(response,cache,absPath);
});
server.listen(3000,function(){
    console.log("Server listening on port 3000.");
})
//var io = require('socket.io').listen(server);
var chatServer=require('./lib/chat_server');
chatServer.listen(server);
//发送404错误
function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('Error 404:response not found.');
    response.end();
}
//发送文件
function sendFile(response,filePath,fileContents)
{
    response.writeHead(200,{"content-type":mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}
//静态文件服务
function serverStatic(response,cache,absPath)
{
    //检查是否有缓存
    if(cache[absPath]){
        sendFile(response,absPath,cache[absPath]);
    }else
    {
       fs.exists(absPath,function(exists){
           if(exists)
           {
               fs.readFile(absPath,function(err,data){
                   if(err){
                       send404(response);
                   }
                   else
                   {
                       cache[absPath]=data;
                       sendFile(response,absPath,data);
                   }
               })
           }else
           send404(response);
       });
    }
}

//server.listen(app.get('port'));