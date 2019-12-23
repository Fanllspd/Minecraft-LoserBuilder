const getPixel = require('get-pixels');
const skinThin = require('./64x64细臂模型');
const colorLibrary = require('./colors.js');
var skinCmdList = [];

function getColors(r, g, b, a) {
    if (a == 0) {
        return 'air'
    }
    colorList = [];
    for (var i = 0; i < colorLibrary.length; i++) {
        R = r - colorLibrary[i][0];
        G = g - colorLibrary[i][1];
        B = b - colorLibrary[i][2];
        colorList.push(Math.abs(R) + Math.abs(G) + Math.abs(B));
    }
    colorLib = colorLibrary[(colorList.indexOf(Math.min.apply(null, colorList)))];
    return colorLib[3];
}

var skin = (path, session) => {
    getPixel(path, (err, skinData) =>{
        if (err) {
            session.tellraw('§b' + err);
        }
        if (!err) {
            session.tellraw("§cActivate The Paint Function...");
            session.tellraw('§bSkin Loading...');
            skinCmdList = [];
            skinPosX = position[0];
            skinPosY = position[1];
            skinPosZ = position[2];
            var pixelsData1 = [];
            var pixelsData2 = [];
            for (var group = 0; group < skinData.data.length; group++) {
                pixelsData1.push(skinData.data[group]) 
                if (group != 0 && (group + 1) % 4 == 0) {
                    pixelsData2.push(pixelsData1);
                    pixelsData1 = []
                }
            }
            for (var h = 0; h < skinData.shape[1]; h++) {
                for (var w = 0; w < skinData.shape[0]; w++) {
                    pos = (h + ' 0 ' + w) 
                    var ci = h * skinData.shape[0] + w;
                    var block = getColors(pixelsData2[ci][0], pixelsData2[ci][1], pixelsData2[ci][2], pixelsData2[ci][3]) 
                    if (skinThin[pos] != undefined&&block!='air') {
                        skinCmdList.push(['setblock', (skinPosX) + Number(skinThin[pos].split(' ')[0]), skinPosY + Number(skinThin[pos].split(' ')[1]), skinPosZ + Number(skinThin[pos].split(' ')[2]), block].join(' '))
                    }
                }
            }
            session.sendCommandQueue(skinCmdList, 0, [])
        }
    })
}
skin.connect = "Script Skin Loading... "

module.exports = skin;