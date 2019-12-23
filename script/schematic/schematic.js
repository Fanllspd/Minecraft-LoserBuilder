const fs = require('fs');
const Schematic = require('mc-schematic')('1.8');
var schCmdList = []

var schematic = (schep, session) => {
    fs.readFile(schep, (err, data) => {
        if (err) {
            session.tellraw("§b" + err);
        }
        if (!err) {
            schCmdList = []
            Schematic.parse(data, (err, schem) => {
                if (err) {
                    session.tellraw('§b' + err)
                }
                if (!err) {
                    schedata = schem;
                    schePosX = position[0];
                    schePosY = position[1];
                    schePosZ = position[2];
                    session.tellraw("§cActivate The Schematic Function...");
                    session.tellraw('§bLoading Building...');
                    if (schedata !== undefined) {
                        for (xx = 0; xx < schedata._.Width; xx++) {
                            for (yy = 0; yy < schedata._.Height; yy++) {
                                for (zz = 0; zz < schedata._.Length; zz++) {
                                    if (schedata.getBlock(xx, yy, zz).name != "air" && schedata.getBlock(xx, yy, zz).name != "") {
                                        schCmdList.push("setblock " + (schePosX + xx) + " " + (schePosY + yy) + " " + (schePosZ + zz) + " " + schedata.getBlock(xx, yy, zz).name + " " + schedata.getBlock(xx, yy, zz).metadata);
                                    }
                                }
                            }
                        }
                        session.sendCommandQueue(schCmdList, 0, [])
                    }
                    if (schedata == undefined) {
                        session.tellraw('Error: Not a correct Schematic file! Please try again or try to change another one.');
                    }
                }
            })
        }
    })
}
schematic.connect = "Script Schematic Loading... "


module.exports = schematic;