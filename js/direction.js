'use strict'

//矢印線書く関数( 始点x, 始点y, 終点x, 終点y, 矢印線角度, 矢印線長さ )
function aline(x1, y1, x2, y2, r, len){
	//元の線
	ctx.beginPath();
	ctx.moveTo( x1, y1 );
	ctx.lineTo( x2, y2 );
	ctx.stroke();

	//元の線の角度
	var rad = Math.atan2(y2-y1, x2-x1);
	//矢印線の角度
	var radA = r * Math.PI / 180;

	//矢印線1
	ctx.beginPath();
	ctx.moveTo( x2, y2 );
	ctx.lineTo( x2 - len * Math.cos(rad+radA), y2 - len * Math.sin(rad+radA) );
	ctx.stroke();

	//矢印線2
	ctx.beginPath();
	ctx.moveTo( x2, y2 );
	ctx.lineTo( x2 - len * Math.cos(rad-radA), y2 - len * Math.sin(rad-radA) );
	ctx.stroke();
}

class Direction{
	constructor(str,dirX,dirY){
		this.str = str;
		// ベクトルの長さ
		this.distance = Math.hypot(Math.abs(dirX), Math.abs(dirY));
	}
}

function getDirection(baseObj,toObj){
	let directions = new Array();
	directions.push(new Direction("R", toObj.getLeftPos() - baseObj.getRightPos(), toObj.y - baseObj.y));
	directions.push(new Direction("L", toObj.getRightPos() - baseObj.getLeftPos(), toObj.y - baseObj.y));
	directions.push(new Direction("T", toObj.x - baseObj.x, toObj.getBottomPos() - baseObj.getTopPos()));
	directions.push(new Direction("B", toObj.x - baseObj.x, toObj.getTopPos() - baseObj.getBottomPos()));

	let result = directions[0];
	directions.forEach(function(value,index){
		if(index == 0) return;
		if(value.distance < result.distance) result = value;
	});
	return result.str;
}

function drawLineDirection(dir,baseObj,toObj,space){
	switch(dir){
		case "R":
			ctx.moveTo( toObj.getLeftPos(), toObj.y + space);
			ctx.lineTo( baseObj.getRightPos(), baseObj.y + space);
			break;
		case "L":
			ctx.moveTo( toObj.getRightPos(), toObj.y + space);
			ctx.lineTo( baseObj.getLeftPos(), baseObj.y + space);
			break;
		case "T":
			ctx.moveTo( toObj.x + space, toObj.getBottomPos());
			ctx.lineTo( baseObj.x + space, baseObj.getTopPos());
			break;
		case "B":
			ctx.moveTo( toObj.x + space, toObj.getTopPos());
			ctx.lineTo( baseObj.x + space, baseObj.getBottomPos());
			break;
		default:
			alert("不明な方向が指定されました");
			break;
	}
}

function drawALineDirection(dir,baseObj,toObj){
	switch(dir){
		case "R":
			aline(baseObj.getRightPos(), baseObj.y, toObj.getLeftPos(), toObj.y, 30, 10);
			break;
		case "L":
			aline(baseObj.getLeftPos(), baseObj.y, toObj.getRightPos(), toObj.y, 30, 10);
			break;
		case "T":
			aline(baseObj.x, baseObj.getTopPos(), toObj.x, toObj.getBottomPos(), 30, 10);
			break;
		case "B":
			aline(baseObj.x, baseObj.getBottomPos(), toObj.x, toObj.getTopPos(), 30, 10);
			break;
		default:
			alert("不明な方向が指定されました");
			break;
	}
}
