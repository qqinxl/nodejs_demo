var net=require('net');
var chatServer=net.createServer();
var clientList=[];

chatServer.on('connection',function(client){
    client.name=client.remoteAddress+':'+client.remotePort;
    broadcast('hi,'+ client.name +' join!\r\n',client);
    client.write('hi,'+ client.name +'!\r\n');
    clientList.push(client);

    client.on('data',function(data){
        broadcast(client.name+' say:'+ data+'\r\n',client);
    });

    client.on('end',function(){
        broadcast('hi,'+ client.name +' quit!\r\n',client);
        clientList.splice(clientList.indexOf(client),1);
    });
})

function broadcast(message, client) {
    var cleanup=[];
    for(var i= 0,len=clientList.length;i<len;i++){
        if(client!==clientList[i]){
            if(clientList[i].writable){
                clientList[i].write(message);
            }else{
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
    }

    for(var i= 0,len=cleanup.length;i<len;i++){
        clientList.splice(clientList.indexOf(cleanup[i]),1);
    }
}

chatServer.listen(9001);