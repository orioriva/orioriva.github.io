'use strict'

BigNumber.config({
    ROUNDING_MODE: BigNumber.ROUND_DOWN // 切り下げ
});

/** ポインタクラス */
class Pointer extends ObjectClass{
	constructor(parent,x,y,fillCollor){
		super("pointer",x,y);
		this.parent = parent;
		this.circle;
		this.fillCollor = fillCollor;
		this.init();
	}

	/** 初期化 */
	init(){
		this.setPositions();
	}

	/** */
	setPositions(){
		this.circle = new DrawCircleClass(
			this,
			0,
			0,
			7,
			this.fillCollor
		);
		limitPos(this);
	}

	/** 描画 */
	draw(){
		this.circle.draw();
	}
}

/**
 * 符号クラス
 */
class SignClass extends ObjectClass{
	constructor(x,y,signType){
		super("sign",x,y);
		this.typeText = signType;
		this.text;
		this.setTypeParam();
		this.signText = null;
		this.signBG = null;
		this.resultObj = null;
		this.nextPointer = null;
		this.oldPrevNumber = 0.0;
		this.oldNextNumber = 0.0;
		this.init();
	}

	/** 初期化 */
	init(){
		this.setPositions();
	}

	/** 表示するテキストと色セット */
	setTypeParam(){
		switch(this.typeText){
			case "+":	// 足し算
				this.text = "＋";
				this.fillColor = "#dc143c";
				break;
			case "-":	// 減算
				this.text = "－";
				this.fillColor = "#0000cd";
				break;
			case "*": 	// 掛け算
				this.text = "×";
				this.fillColor = "#ff8c00";
				break;
			case "/":	// 割り算
				this.text = "÷";
				this.fillColor = "#9400d3";
				break;
			default:
				alert("不明な符号タイプです");
				break;
		}
	}

	/** 計算処理 */
	calculate(){
		this.oldPrevNumber = this.prevObj[0].number;
		this.oldNextNumber = this.nextObj[0].number;
		switch(this.typeText){
			case "+":	return BigNumber(this.oldPrevNumber).plus(this.oldNextNumber);
			case "-":	return BigNumber(this.oldPrevNumber).minus(this.oldNextNumber);
			case "*":	return BigNumber(this.oldPrevNumber).times(this.oldNextNumber);
			case "/":	return BigNumber(this.oldPrevNumber).div(this.oldNextNumber);
			default:	alert("不明な符号タイプです");
		}
		return 0;
	}

	setPositions(){
		this.bounds.clear();

		// 符号テキスト
		this.signText = new DrawTextClass(
			this,
			this.text,
			"24px sans-serif",
			0,
			0,
			0,
			"#ffffff"
		);

		// 背景
		this.signBG = new DrawCircleClass(
			this,
			0,
			0,
			15,
			this.fillColor
		);
		limitPos(this);
	}

	/** 描画 */
	draw(){
		if(this.prevObj.length == 0){
			// 計算元となる数字オブジェクトが無いなら
			this.isDelete();
			return;
		}

		ctx.globalAlpha = this.alpha;

		// 計算元へ線を引く
		this.drawLineForPrevObj();

		// 計算先へ矢印を引く
		this.drawLineForDestination();

		// 符号部分描画
		this.signBG.draw();
		this.signText.draw();

		// 計算結果へ線を引く
		this.drawLineForResult();
	}

	/** ポインタオブジェクトを生成 */
	createPointer(){
		if(this.nextPointer != null){
			return;
		}

		this.nextPointer = new Pointer(
			this,
			this.getRightPos() + 50,
			this.y,
			this.fillColor
		);
	}

	/** 矢印を引くべき先を取得 */
	getDestination(){
		// 計算先を判断
		if(this.nextObj.length > 0){	// 計算先オブジェクトがあれば
			if(this.nextPointer != null){
				this.nextPointer.isDelete();
				this.nextPointer = null;
			}
			return this.nextObj[0];
		}else{							// 計算先オブジェクトが無ければ
			this.createPointer();
			return this.nextPointer;
		}
	}

	/** 計算元へ線を引く */
	drawLineForPrevObj(){
		ctx.beginPath();

		let dir = getDirection(this.prevObj[0],this);
		let path = getStrokePath(dir, this.prevObj[0], this, 0);
		ctx.strokeStyle = vmConfig.strokeAnim == "on" ? getGradient(path, this.fillColor) : this.fillColor;
		ctx.moveTo( path.toX, path.toY);
		ctx.lineTo( path.baseX, path.baseY);
		ctx.lineWidth = 3;
		ctx.stroke();

		ctx.closePath();
	}

	/** 計算先へ矢印を引く */
	drawLineForDestination(){
		// 計算先を判断
		let lineToObj = this.getDestination();

		// 計算先へ矢印を引く
		let dir = getDirection(this,lineToObj);
		let path = getStrokePath(dir, this, lineToObj, 0);
		ctx.strokeStyle = vmConfig.strokeAnim == "on" ? getGradient(path, this.fillColor) : this.fillColor;
		aline(path.baseX, path.baseY, path.toX, path.toY, 30, 10);
	}

	/** 計算結果へ線を引く */
	drawLineForResult(){
		if(this.resultObj == null)
			return;

		if(this.nextObj[0] == null){
			this.resultObj.clearCalcSource();
			this.resultObj = null;
			return;
		}

		let space = 5; // 線２本の間の間隔（これの２倍）
		ctx.beginPath();

		let dir = getDirection(this.nextObj[0],this.resultObj);
		let paths = [
			getStrokePath(dir, this.nextObj[0], this.resultObj, -space),
			getStrokePath(dir, this.nextObj[0], this.resultObj, space)
		];
		paths.forEach((value)=>{
			ctx.strokeStyle = vmConfig.strokeAnim == "on" ? getGradient(value, this.fillColor) : this.fillColor;
			ctx.moveTo( value.toX, value.toY);
			ctx.lineTo( value.baseX, value.baseY);
		});
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.closePath();

		// 計算元と計算先の数値が前と違っていれば再計算
		if(	this.oldPrevNumber != this.prevObj[0].number ||
			this.oldNextNumber != this.nextObj[0].number)
		{
			this.createResultObj();
		}
	}

	/** 削除時 */
	isDelete(){
		super.isDelete();
		deleteArrayItem(objects, this.nextPointer);
		this.nextPointer = null;
		if(this.resultObj != null){
			this.resultObj.clearCalcSource();
		}
	}

	/** 計算結果オブジェクトを生成 */
	createResultObj(){
		if(this.resultObj === null){
			this.resultObj = new NumberClass(
				0,
				this.nextObj[0].y,
				vmConfig.resultTag == "default" ? this.prevObj[0].text + " " + this.text + " " + this.nextObj[0].text : vmConfig.resultTagName,
				this.calculate(),
				this
			);
			this.resultObj.x = this.nextObj[0].getRightPos() + (this.resultObj.bounds.width / 2) + 50;
			limitPos(this.resultObj);
		}else{
			this.resultObj.setNumber(this.calculate());
		}
	}

	/** 計算先オブジェクトをセット */
	setNextObj(nextObj){
		this.nextObj[0] = nextObj;
		this.nextObj[0].prevObj.push(this);
		this.createResultObj();
	}
}