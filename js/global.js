'use strict'

var stage;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

//ドラッグした場所を保存する変数
var dragOn = false;
var onMove = false;
var dragPointX;
var dragPointY;

var _mouseX = 0.0;
var _mouseY = 0.0;

var objects = new Array();
var selectedObj = null;

var tapCount = 0;

/** マウス座標の更新 */
function updateMousePos(e){
	const rect = canvas.getBoundingClientRect();
	_mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
	_mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
}

// pc
if(typeof window.ontouchstart === "undefined"){
	canvas.addEventListener('mousedown', e => { onMousedown(e); });
	canvas.addEventListener('dblclick', e => { onDoubleClick(e); });
	canvas.addEventListener('mousemove', e => { onMouseMove(e); });
	canvas.addEventListener('mouseup',()=> { onMouseUp(); });
}
// smartphone
else{
	$('#calc-keys').show();
	$('#selectCanvasSize').val('2');
	changeCanvasSize('2');
	canvas.addEventListener('touchstart', e => {
		// シングルタップ
		if( !tapCount ) {
			tapCount++;
			setTimeout( function() { tapCount = 0; }, 350);
			onMousedown(e.touches[0]);
		// ダブルタップ
		} else {
			tapCount = 0;
			onDoubleClick(e.touches[0]);
		}
	});
	canvas.addEventListener('touchmove', e => {
		onMouseMove(e.touches[0]);
		if(onMove) e.preventDefault();	// スクロール防止
	});
	canvas.addEventListener('touchend',()=> { onMouseUp(); });
}

/** クリックされた時の処理 */
function onMousedown(e){
	updateMousePos(e);

	// どのオブジェクトがタッチされたか探す（逆順）
	let touchObj = null;
	for (let i = objects.length - 1; i >= 0 ; i--){
		objects[i].alpha = 1.0;
		// タッチ判定は数値オブジェクト以外を優先
		if(touchObj != null && touchObj.type != "number" && objects[i].type == "number"){
			continue;
		}
		if(objects[i].hitTest(_mouseX,_mouseY)){
			touchObj = objects[i];
		}
	}

	if(touchObj == null){
		selectedObj = null;
	}else{
		dragOn = true;
		selectedChange(touchObj);
		// ドラッグを開始した座標を覚えておく
		dragPointX = _mouseX - selectedObj.x;
		dragPointY = _mouseY - selectedObj.y;
	}
}
/** ダブルクリックされた時の処理 */
function onDoubleClick(e){
	if(selectedObj == null || selectedObj.type != "number")
		return;

	updateMousePos(e);

	switch(selectedObj.hitTestTagOrNumber(_mouseX,_mouseY)){
		case "Tag":
			selectedObj.inputTagText();
			break;
		case "Number":
			selectedObj.inputNumber();
			break;
	}
}

/** マウスが動いた時の処理(高頻度) */
function onMouseMove(e){
	updateMousePos(e);

	if(selectedObj == null || !dragOn){
		return;
	}

	// マウス座標に追随する
	// ただしドラッグ開始地点との補正をいれておく
	selectedObj.x = _mouseX - dragPointX;
	selectedObj.y = _mouseY - dragPointY;

	onMove = true;
}

/** マウスが動いた時の処理(フレーム毎) */
function mouseMove(){
	if(selectedObj == null){
		return;
	}
	limitPos(selectedObj);
	// ポインタを動かしているなら
	hitTestPointer(
		(obj)=>{ obj.alpha = 0.7; return true; },
		(obj)=>{ obj.alpha = 1.0; }
	);
}

/** マウスボタンを離した時の処理 */
function onMouseUp(){
	dragOn = false;

	if(selectedObj == null){
		return;
	}

	hitTestPointer((obj)=>{
		selectedObj.parent.setNextObj(obj);
		return false;
	});
}

/** ポインタの当たり判定 */
function hitTestPointer(hitFunc,nohitFunc){
	// ポインタを動かしているなら
	if(selectedObj.type == "pointer"){
		for (let i = objects.length - 1; i >= 0 ; i--){
			if(	objects[i].type != "number" ||
				objects[i] == selectedObj ||
				objects[i] == selectedObj.parent.prevObj[0])
			{
				continue;
			}
			if(objects[i].hitTest(selectedObj.x,selectedObj.y)){
				if(!hitFunc(objects[i])){
					return;
				}
			}else if(nohitFunc !== undefined){
				nohitFunc(objects[i]);
			}
		}
	}
}

// 何らかのキーを押された時の処理
window.addEventListener('keydown', e => {
	keyAction(e.key);
});
function keyAction(key){
	if(selectedObj != null && selectedObj.type == "number"){
		switch(key){
			case '+':
			case '-':
			case '*':
			case '/':
				selectedObj.addSign(key);
				break;
			case 'Backspace':
				selectedObj.removeNumberOne();
				break;
			case 'c':
				selectedObj.clearNumber();
				break;
			case '.':
				selectedObj.addNumberOne(key);
				break;
		}
	}

	switch(key){
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			let obj = null;
			if(selectedObj == null){
				obj = addNumber(_mouseX, _mouseY, "NEW", parseInt(key));
			}else if(selectedObj.type == "number"){
				selectedObj.addNumberOne(key);
			}else if(selectedObj.type == "sign"){
				obj = addNumber(selectedObj.getRightPos() + 100, selectedObj.y, "NEW", parseInt(key));
				selectedObj.setNextObj(obj);
			}
			if(obj !== null)
				selectedChange(obj);
			break;
		case 'Delete':
			deleteObj();
			break;
	}
}

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
		if(value.type == "number")
			value.draw();
	}
	// それ以外を手前に描画
	for(let value of objects){
		if(value.type != "number")
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