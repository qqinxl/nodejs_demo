var net=require('net');
var chatServer=net.createServer();
var clientList=[];
 
chatServer.on('connection',function(client){
    client.write('hi!\n');
    clientList.push(client);
    client.on('data',function(data){
        for(var i= 0,len=clientList.length;i<len;i++){
            if(client!=clientList[i]){
                clientList[i].write(data);
            }
        }
        console.log(data);
    });
})
chatServer.listen(9001);