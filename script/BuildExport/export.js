const fs = require('fs');
const blockList = require('./BlockList.js')
const ProgressBar = require('./progressbar');

var buildExport = (pos, session) =>{
    console.log(pos)
    fs.writeFile('./export.mcfunction', '', () => {})
    matches = []
    posXXX = []
    posYYY = []
    posZZZ = []
    var posX = Number(pos.split(' ')[0])
    var posY = Number(pos.split(' ')[1])
    var posZ = Number(pos.split(' ')[2])
    var posXX = Number(pos.split(' ')[3]) + 1
    var posYY = Number(pos.split(' ')[4]) + 1
    var posZZ = Number(pos.split(' ')[5]) + 1
    let bar = new ProgressBar('§bProgressBar: §e[:bar§e] §e:percent(:current/:total) §b:etas §b:rate block/s', {
        stream: session,
        total: (posXX - posX) * (posYY - posY) * (posZZ - posZ) * blockList.length,
        width: 25,
        complete: '§2█',
        incomplete: '§c░',
        clear: true,
        callback: () => {
            session.tellraw('§bExport has done!');
        }
    });
    for (var posXXXX = posX; posXXXX < posXX; posXXXX++) {
        for (var posYYYY = posY; posYYYY < posYY; posYYYY++) {
            for (var posZZZZ = posZ; posZZZZ < posZZ; posZZZZ++) {
                for (var blockNum = 0; blockNum < blockList.length; blockNum++) {
                    sleep(0)
                               bar.tick();
                    session.sendCommand((['testforblock', posXXXX, posYYYY, posZZZZ, blockList[blockNum]].join(' ')), (data) => {
                      matches.push(data.matches)
                      posXXX.push(data.position.x)
                      posYYY.push(data.position.y)
                      posZZZ.push(data.position.z)
                        if (matches.length == (posXX - posX) * (posYY - posY) * (posZZ - posZ) * blockList.length) {
                                console.log(77)
                            for (var c = 0; c < matches.length; c++) {
                                if (matches[c] == true) {
                                    fs.appendFile('./export.mcfunction', ['setblock', '~' + (posXXX[c] - posX), '~' + (posYYY[c] - posY), '~' + (posZZZ[c] - posZ), blockList[c % blockList.length], '\n'].join(' '), () => {})
                                }
                        //c++
                            }
                        }
                    })
                }
            }
        }
    }
}

function sleep(delays) {
    var exitTime = (new Date()).getTime() + delays
    while (true) {
        if ((new Date()).getTime() > exitTime) {
            return;
        }
    }
}
buildExport.connection = 'Script buildExport Loading...'

module.exports = buildExport;