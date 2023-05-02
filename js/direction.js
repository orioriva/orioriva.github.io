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

/** 方向クラス */
class Direction{
	constructor(str,dirX,dirY){
		this.str = str;
		// ベクトルの長さ
		this.distance = Math.hypot(Math.abs(dirX), Math.abs(dirY));
	}
}

/** ２オブジェクト間の一番近い方向を取得 */
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

/** 方向から線の始点と終点を取得 */
function getStrokePath(dir, baseObj, toObj, space){
	// 決まった方向から線を引く位置を決定
	let baseX,baseY,toX,toY;
	switch(dir){
		case "R":
			baseX = baseObj.getRightPos();
			toX = toObj.getLeftPos();
		case "L":
			if(!baseX) baseX = baseObj.getLeftPos();
			if(!toX) toX = toObj.getRightPos();
			baseY = baseObj.y + space;
			toY = toObj.y + space;
			break;
		case "T":
			baseY = baseObj.getTopPos();
			toY = toObj.getBottomPos();
		case "B":
			if(!baseY) baseY = baseObj.getBottomPos();
			if(!toY) toY = toObj.getTopPos();
			baseX = baseObj.x + space;
			toX = toObj.x + space;
			break;
		default:
			alert("不明な方向が指定されました");
			return;
	}

	return {
		baseX: baseX,
		baseY: baseY,
		toX: toX,
		toY: toY
	};
}

/** グラデーション用意 */
function getGradient(path,color){
	let gradient = ctx.createLinearGradient(path.baseX, path.baseY, path.toX, path.toY);
	let pos = Date.now() % 2000 / 2000;
	gradient.addColorStop(0, color);
	gradient.addColorStop(Math.max(0, pos - 0.05), color);
	gradient.addColorStop(pos, 'white');
	gradient.addColorStop(Math.min(1, pos + 0.05), color);
	gradient.addColorStop(1, color);
	return gradient;
}