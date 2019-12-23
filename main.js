const MeoWS = require('meowslib');
const WSServer = MeoWS.WSServer;
const BuildSession = MeoWS.BuildSession;
const fs = require('fs')
const logos = require("./script"); 
const paint = require('./script/paint/paint.js');
const schematic = require('./script/schematic/schematic.js');
const skin = require('./script/skin/skin.js');
const buildExport = require('./script/BuildExport/export.js');
const mcfun = require('./script/fun/mcfunction.js');
let wss = new WSServer(2333);
const WebSocket = require('ws');

buildChunk=128;choose = true;
fs.appendFile('./now.txt','',()=>{})
var nowPath = fs.readFileSync('./now.txt').toString().split(' ')

wss.on('client', (session, request) => {
/*
const ws = new WebSocket('ws://103.45.173.176:8080');

ws.on('open', function open() {
    session.sendCommand("getlocalplayername",(data) => {
      ws.send(data.localplayername);
    });
    session.on('onMessage', (msg, player) => {
       ws.send('['+player+']:'+ msg);
    });
ws.on('message', function incoming(data) {
//  console.log(data)
  session.tellraw(data);
});//当收到消息时，在控制台打印出来
});//在连接创建完成后发送一条信息
*/
    console.log(request.connection.remoteAddress + ' connected!');
    session.tellraw('§b\n'+fs.readFileSync('./script/logo/lb.txt'));
    session.tellraw("§bLoser_Builder Connection!");
    session.tellraw(["" ,paint.connect,schematic.connect,skin.connect,mcfun.connection,buildExport.connection].join("\n "))
    session.tellraw('§bMeoWebsocket library v2.0.0 by §cCAIMEO.');
    session.sendCommand("testforblock ~~~ air",(data) => {
        x=data.position.x;y=data.position.y;z=data.position.z;
        session.tellraw("§bConnection Position: "+x+" "+y+" "+z);
        position=[x,y,z]
        console.log(position)
    });
    session.sendCommand("getlocalplayername",(data) => {
      session.tellraw('§bPlayer: '+data.localplayername+', Thank you for using this program.');
    });
    session.sendCommand("testforblock ~~~ air",(data) => {
      console.log(JSON.stringify(data));
    });
    if(nowPath[4]!=0&&fs.readFileSync('./now.txt').toString()!=''&&nowPath[4]!=nowPath[6]&&choose==true) {
        session.tellraw('§cDo you want to continue last Building?  [y/n]<§eYou have 10 seconds>')
        session.subscribe("PlayerMessage", (json) => {
            var Message = json.properties.Message
            if (Message == 'y' || Message == 'Y'){
              if(choose==true) {
                session.tellraw('§bContinue to Build...')
                position = [Number(nowPath[0]),Number(nowPath[1]),Number(nowPath[2])]
                session.sendCommand(['tp @s',Number(nowPath[0]),Number(nowPath[1]),Number(nowPath[2])].join(' '))
                paint(nowPath[3], session,nowPath[5] ,true)
                choose = false
              }
            }
            if (Message == 'n' || Message == 'N'){
              if(choose == true){
                choose = false
                session.tellraw('§bRemove Last Build...')
                fs.writeFileSync('./now.txt','',()=>{})
              }
            }else{
                if(choose == true){
                    var chooses = setTimeout(function(){
                    choose=false
                    fs.writeFileSync('./now.txt','',()=>{})
                    session.tellraw('§cTime out!')
                    clearTimeout(chooses)
                },10000)}
            }
        })
    }
    BuildSession.createAndBind(session);
    session.on('onMessage', (msg, player) => {
        console.log('['+player+']:'+ msg);
    });
    session.subscribe("PlayerMessage", (json) => {
        var Message=json.properties.Message
        if (Message.substring(0, 10) == 'paint -xz ') {
          if(Message.indexOf('-Dither ')!=-1){
            var paintPath = Message.substring(18, Message.length)
            paint(paintPath,session,'dither')
          }else{
            var paintPath = Message.substring(10, Message.length)
            paint(paintPath,session,'normal')
          }
        }
        if (Message.substring(0, 5) == 'skin ') {
            var skinPath = Message.substring(5, Message.length)
            skin(skinPath,session)
        }
        if (Message.substring(0, 10) == 'schematic ') {
            var schePath = Message.substring(10, Message.length)
            schematic(schePath,session)
        }
        if (Message.substring(0,7) == 'export ') {
            var exportPos = Message.substring(7, Message.length).trim()
            buildExport(exportPos,session)
        }
        if (Message.substring(0,9) == 'function ') {
            var funPath = Message.substring(9, Message.length).trim()
            mcfun(funPath,session)
        }
        if(Message=='pos'){
            session.sendCommand("testforblock ~~~ air", (data) => {
                x=data.position.x;y=data.position.y;z=data.position.z;
                console.log(x,y,z);
                session.tellraw("§bPosition: "+x+" "+y+" "+z);
                position=[x,y,z]
            });
        }
        if(Message =="map pos"){
            position[0] >= 0 ? position[0] = position[0] - (position[0] % 128 + 64) : position[0] = position[0] - (position[0] % 128 - 64);
            position[2] >= 0 ? position[2] = position[2] - (position[2] % 128 + 64) : position[2] = position[2] - (position[2] % 128 - 64);
            session.tellraw("§bGot Map Position: " + position[0] + " " + position[1] + " " + position[2]);
            session.sendCommand('tp @s ' + position[0] + " " + position[1] + " " + position[2]);
        }
        })
});