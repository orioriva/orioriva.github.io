'use strict'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

var objects = new Array();
var selectedObj = null;

/** 全オブジェクト削除 */
function allDelete(){
	while(objects.length > 0){
		objects[0].isDelete();
	}
}

/** 各種オブジェクト描画 */
function drawObj(){
	if(onMove)
		mouseMove();
	onMove = false;

	// 画面クリア
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// 数値オブジェクトを奥に描画
	for(let value of objects){
		value.draw();
	}

	// マウス位置（デバッグ）
	/*
	ctx.beginPath();
	ctx.rect(_mouseX-2.5, _mouseY-2.5, 5, 5);
	ctx.globalAlpha = 1.0;
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.closePath();
	*/
}

/** 選択オブジェクト削除 */
function deleteObj(){
	if(selectedObj === null || selectedObj.type == "pointer"){
		return;
	}
	const save = selectedObj;
	selectedObj.isDelete();
	if(selectedObj == save)
		selectedObj = null;
}

/** 選択オブジェクト変更 */
function selectedChange(object){
	if(selectedObj != null){
		selectedObj.alpha = 1.0;
	}
	selectedObj = object;
	if(selectedObj != null)
		selectedObj.alpha = 0.7;
}

/** 配列から特定の要素を検索して削除 */
function deleteArrayItem(array, item){
	if(array.length < 1)
		return;
	let index = array.indexOf(item);
	if(index < 0)
		return;
	array.splice(index,1);
}

/** 描画領域を超えているなら描画領域内の座標に戻す */
function limitPos(obj){
	let dist = obj.getRightPos() - canvas.width;
	if(dist > 0){ obj.x -= dist; }
	dist = -obj.getLeftPos();
	if(dist > 0){ obj.x += dist; }
	dist = obj.getBottomPos() - canvas.height;
	if(dist > 0){ obj.y -= dist; }
	dist = -obj.getTopPos();
	if(dist > 0){ obj.y += dist; }
}