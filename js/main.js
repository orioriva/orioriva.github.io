'use strict'

var loading = {
	isLoading: false,
	now: 0,
	end: 0
};

// ページのロードが終わったら
window.addEventListener("load", init() );

/** 起動時処理 */
function init() {
	setInterval(update, 60);

	loadObjects();
}

function addNumber(x,y,text,number){
	let obj = new NumberClass(x,y,text,number);
	objects.push(obj);
	return obj;
}

/** フレーム毎の処理 */
function update(){
	drawObj();
}

/** オブジェクトの読込 */
function loadObjects(){
	loading.isLoading = true;

	const jsonData = $('#jsonData').val();

	if(jsonData == undefined || jsonData == null || jsonData == ''){
		return;
	}

	// JavaScriptオブジェクトへ変換
	let objData;
	objData = JSON.parse(jsonData);

	for(let value of objData){
		let targetObj = null;

		if(value.type == "number"){
			if(value.calcSource != null){
				// 計算元があれば計算結果を生成させる
				let signObj = objects[value.calcSource];
				let signObjData = objData[value.calcSource];
				signObj.setNextObj(objects[signObjData.nextObj[0]]);

				// 計算結果オブジェクトに値を反映
				targetObj = signObj.resultObj;
				targetObj.text = value.tag;
				targetObj.setPositions();
			}else
				targetObj = addNumber(value.x, value.y, value.tag, value.number);
		}else if(value.type == "sign"){
			targetObj = objects[value.prevObj[0]].addSign(value.typeText);
		}else if(value.type == "pointer"){
			let parentObj = objects[value.parent];
			parentObj.createPointer();
			targetObj = parentObj.nextPointer;
		}

		targetObj.x = value.x;
		targetObj.y = value.y;
	}

	selectedChange(null);

	$('#jsonData').val('');

	loading.isLoading = false;
}

/** オブジェクト情報を文字列化（JSON） */
function objectsToString(){
	let save = new Array();
	for(let value of objects){
		save.push(new SaveObj(value));
	}

	// JSONへ変換
	let jsonData = JSON.stringify(save);
	console.log(jsonData.length);

	return jsonData;
}