const getPixels = require('get-pixels');
const colorLibrary = require('./colors.js');
finish = false

function getColors(r, g, b) {
    colorList = [];
    for (var i = 0; i < colorLibrary.length; i++) {
        R = r - colorLibrary[i][1][0];
        G = g - colorLibrary[i][1][1];
        B = b - colorLibrary[i][1][2];
        colorList.push(Math.abs(R) + Math.abs(G) + Math.abs(B));
    }
    colorLib = colorLibrary[(colorList.indexOf(Math.min.apply(null, colorList)))];
    return colorLib[1][3];
}

function getColors2(r, g, b) {
    colorList = [];
    for (var i = 0; i < colorLibrary.length; i++) {
        R = r - colorLibrary[i][1][0];
        G = g - colorLibrary[i][1][1];
        B = b - colorLibrary[i][1][2];
        colorList.push(Math.abs(R) + Math.abs(G) + Math.abs(B));
    }
    colorLib = colorLibrary[(colorList.indexOf(Math.min.apply(null, colorList)))];
    return colorLib[1]
}
function floydSteinberg(sb, w, h) {
    for (var i = 0; i < h; i++)
        for (var j = 0; j < w; j++) {
            var ci = i * w + j;
            var ccR = sb[ci][0];
            var ccG = sb[ci][1];
            var ccB = sb[ci][2];
            var rcR = (getColors2(sb[ci][0], sb[ci][1], sb[ci][2]))[0];
            var rcG = (getColors2(sb[ci][0], sb[ci][1], sb[ci][2]))[1];
            var rcB = (getColors2(sb[ci][0], sb[ci][1], sb[ci][2]))[2];
            var errR = ccR - rcR;
            var errG = ccG - rcG;
            var errB = ccB - rcB;
            sb[ci][0] = rcR;
            sb[ci][1] = rcG;
            sb[ci][2] = rcB;
            if (j + 1 < w) {
                sb[ci + 1][0] += (errR * 7) / 16;
                sb[ci + 1][1] += (errG * 7) / 16;
                sb[ci + 1][2] += (errB * 7) / 16
            }
            if (i + 1 == h) {
                continue
            }
            if (j > 0) {
                sb[ci + w - 1][0] += (errR * 3) / 16;
                sb[ci + w - 1][1] += (errG * 3) / 16;
                sb[ci + w - 1][2] += (errB * 3) / 16;
                sb[ci + w][0] += (errR * 5) / 16;
                sb[ci + w][1] += (errG * 5) / 16;
                sb[ci + w][2] += (errB * 5) / 16
            }
            if (j + 1 < w) {
                sb[ci + w + 1][0] += (errR * 1) / 16;
                sb[ci + w + 1][1] += (errG * 1) / 16;
                sb[ci + w + 1][2] += (errB * 1) / 16
            }
        }
}

function chunksBuild(cmdList, w, h, num,session ) {
    var emm = w / num
    var paintList2 = []
    var emmm = 0
    if (w % num != 0) {
        emm = parseInt(emm) + 1
        //console.log(3)
    }
    for (var we = 0; we < emm; we++) {
        for (var i = 0; i < h; i++) {
            if (we == emm - 1) {
                cc = w % num
                for (var j = emmm; j < emmm + cc; j++) {
                    var ci = i * w + j;
                    paintList2.push(cmdList[ci])
                }
            } else {
                for (var j = emmm; j < emmm + num; j++) {
                    // console.log(j)
                    var ci = i * w + j;
                    paintList2.push(cmdList[ci])
                }
            }
            if (i % (num) == 0) {
                if (we == emm - 1) {
                    cc = w % num
                    paintList2.push('tp @s ' + (Number(cmdList[ci].split(' ')[1]) - Number(parseInt(cc / 2))) + ' ' + (Number(cmdList[ci].split(' ')[2])+1) + ' ' + (Number(cmdList[ci].split(' ')[3]) + Number(parseInt(cc / 2))))
                }else{
                    paintList2.push('tp @s ' + (Number(cmdList[ci].split(' ')[1]) - Number(parseInt(num / 2))) + ' ' + (Number(cmdList[ci].split(' ')[2])+1) + ' ' + (Number(cmdList[ci].split(' ')[3]) + Number(parseInt(num / 2))))
                    //console.log(('tp @s ' + ((cmdList[ci].split(' ')[1]) - parseInt(num / 2)) + ' ' + cmdList[ci].split(' ')[2] + ' ' + ((cmdList[ci].split(' ')[3]) )))
                    paintList2.push('give @s map ')
                }
            }
        }
        paintList2.push('tp @s ' + cmdList[ci].split(' ')[1] + ' ' + cmdList[ci].split(' ')[2] + ' ' + (cmdList[ci].split(' ')[3] - (h - 1)))
        paintList2.push('give @s map ')
        emmm = emmm + num
    }
    //console.log(cmdList)
    paintLock = true
    return paintList2
}


var paint = (path, session, mode, Continue) => {
    getPixels(path, function(err, pixels) {
        if (err) {
            session.tellraw(err)
            return err
        }
        if (!err) {
            pixelsData = pixels.data;
            session.tellraw("§cActivate The Paint Function...");
            session.tellraw("§bPicture Loading...");
            var paintWidth = pixels.shape[0];
            var paintLength = pixels.shape[1];
            var pixelsData1 = [];
            var pixelsData2 = [];
            pixelsGray = []
            for (var group = 0; group < pixelsData.length; group++) {
                pixelsData1.push(pixelsData[group])
                if (group != 0 && (group + 1) % 4 == 0) {
                    pixelsData2.push(pixelsData1);
                    pixelsData1 = []
                }
            }
            paintBlockAll = [];
            paintBlockList = [];
            paintBlockDataList = [];
            if(mode == 'dither'){
                floydSteinberg(pixelsData2, pixels.shape[0], pixels.shape[1]);
            }
            for (var rgb1 = 0; rgb1 < pixelsData2.length; rgb1++) {
                paintBlockList.push(getColors(pixelsData2[rgb1][0], pixelsData2[rgb1][1], pixelsData2[rgb1][2]))
            }

            paintBlockPos = 0;
            var paintList = [];
            paintPosX = position[0];
            paintPosY = position[1];
            paintPosZ = position[2];
            for (var paintZ = 0; paintZ < paintLength; paintZ++) {
                for (var paintX = 0; paintX < paintWidth; paintX++) {
                    paintList.push('setblock ' + (paintPosX + paintX) + ' ' + paintPosY + ' ' + (paintPosZ + paintZ) + ' ' + paintBlockList[paintBlockPos])
                    paintBlockPos++
                }
            }
            paintList = chunksBuild(paintList, pixels.shape[0], pixels.shape[1], buildChunk + 1)
            if (paintLock == true) {
                session.sendCommandQueue(paintList, 0, [], path,mode, Continue)
            }
        }
    })
    finish = true
}

if (finish == true) {
    session.sendCommand("title @a actionbar §b§oWherever you go, Whatever you do,\nI will be right here waiting for you.");
    finish = false;
}
paint.connect = "Script Paint Loading..."


module.exports = paint;