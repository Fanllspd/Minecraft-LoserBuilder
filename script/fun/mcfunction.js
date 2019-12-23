const fs = require('fs')
start = false

var mcfun = (path,session) => {
    fs.readFile(path,(err,data) => {
    if(err){session.tellraw(err)}
       console.log(data.toString())
       var command = data.toString().split('\n')
       if(command[command.length-1] ==' '){
        command.splice(command.length-1,1)
    }
    for(var c =0;c<command.length;c++){
        command[c] = ['execute @s',position[0],position[1],position[2],''].join(' ')+command[c]
        start = true
    }
    console.log(command)
    if(start == true){
//    for(var c =0;c<command.length;c++){
        session.sendCommandQueue(command,0,[])
    }
})
}
mcfun.connection = 'Script mcfunction Loading...'

module.exports = mcfun