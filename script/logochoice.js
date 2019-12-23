const fs=require("fs");
let logos=[];

function randNum(Min,Max){
	let Range = Max - Min;
	let Rand = Math.random();
	let num = Min + Math.round(Rand * Range);
	return num;
}

let fls=fs.readdirSync("script/logo/");
for(let i of fls){
	logos.push(fs.readFileSync("script/logo/"+i).toString());
}

module.exports={random:function(){
	return logos[randNum(0,logos.length-1)];
}};