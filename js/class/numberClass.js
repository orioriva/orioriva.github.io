'use strict'

// 数値クラス
class NumberClass extends ObjectClass{
	constructor(x,y,text,number,calcSource) {
		super("number",x,y);
		if(calcSource === undefined) calcSource = null;
		this.text = text;
		this.number = number;
		this.viewNumber = number.toString();

		this.numberText = null;
		this.tagText = null;
		this.allBG = null;
		this.numberBG = null;

		this.calcSource = calcSource;

		this.init();
	}

	/** 初期化 */
	init(){
		this.fillColor = (this.calcSource != null) ? this.calcSource.fillColor : "#32cd32" ;
		this.setPositions();
	}

	/** 各表示オブジェクト配置 */
	setPositions(){
		this.bounds.clear();

		// タグテキスト
		this.tagText = new DrawTextClass(
			this,
			this.text,
			"bold 18px sans-serif",
			0,
			-this.padding,
			-1,
			"#ffffff"
		);

		// 数字テキスト
		this.numberText = new DrawTextClass(
			this,
			this.viewNumber,
			"18px sans-serif",
			0,
			this.padding,
			1,
			"#8b0000",
			true
		);

		// 全体の背景部分
		this.allBG = new DrawRectClass(
			this,
			this.bounds.left - this.padding,
			this.bounds.top - this.padding,
			this.bounds.width + (this.padding * 2.0),
			this.bounds.height + (this.padding * 2.0),
			this.fillColor
		);

		// 数字部分の背景
		this.numberBG = new DrawRectClass(
			this,
			this.bounds.left,
			this.bounds.bottom - this.numberText.height - this.padding * 2.0,
			this.bounds.width,
			this.getBottomPos() - this.y,
			"#ffffff",
			this.fillColor
		);

		limitPos(this);
	}

	/** 削除時 */
	isDelete(){
		if(this.calcSource != null){
			alert("計算結果は直接削除出来ません！！\r\n先に紐づいた符号オブジェクトを削除して下さい");
			selectedChange(this.calcSource);
			return;
		}
		super.isDelete();
	}

	/** 各種描画 */
	draw(){
		this.allBG.draw();
		this.numberBG.draw();
		this.numberText.draw();
		this.tagText.draw();
	}

	/** タグと数字のどちらに当たっているか判定 */
	hitTestTagOrNumber(pointX,pointY){
		if(this.getLeftPos() <= pointX && this.getRightPos() >= pointX){
			if(this.y + this.bounds.top <= pointY && this.y >= pointY)
				return "Tag";
			else if(this.y <= pointY && this.y + this.bounds.bottom >= pointY)
				return "Number";
		}
		return null;
	}

	/** 計算先に符号を追加 */
	addSign(type){
		let obj = new SignClass( this.getRightPos() + 50, this.y, type);
		insertObj(obj,this,null);
		selectedChange(obj);
		return obj;
	}

	/** 計算元情報クリア */
	clearCalcSource(){
		this.calcSource = null;
		this.fillColor = "#32cd32";
		this.allBG.fillColor = this.fillColor;
		this.allBG.strokeColor = this.fillColor;
		this.numberBG.strokeColor = this.fillColor;
	}

	/** 数字変更 */
	setNumber(number){
		this.number = BigNumber(number);
		this.viewNumber = this.number.toString();
		this.setPositions();
	}

	/** タグ名を入力 */
	inputTagText(){
		let text = prompt("タグ名を変更", this.text);
		if(text == null) return;
		this.text = text;
		this.setPositions();
	}

	/** 数字を入力 */
	inputNumber(){
		if(this.calcSource != null){
			alert("計算結果を直接変更する事は出来ません！");
			return;
		}
		let text = prompt("数値を変更", this.viewNumber);
		if(text == null) return;
		if(BigNumber(text).isNaN()){
			alert("エラー：数値として変換出来ません");
			return;
		}
		this.setNumber(text);
	}

	/** １桁追加 */
	addNumberOne(number){
		if(this.calcSource != null){
			alert("計算結果を直接変更する事は出来ません！");
			return;
		}

		/*
		// 小数点以降の桁数を調べる
		let numbers = String(this.viewNumber).split('.');
		const decimal = numbers[1] ? numbers[1].length : 0;
		*/
		/*
		const digit = numbers[0].length + decimal;
		if(digit >= 17){
			alert("これ以上桁数は増やせません");
			return;
		}*/

		// 既に小数点が入力されているなら
		if(number === '.' && this.viewNumber.indexOf('.') !== -1){
			return;
		}

		this.viewNumber = (this.viewNumber === "0" && number !== '.') ? number : this.viewNumber + number;
		this.number = BigNumber(this.viewNumber);

		this.setPositions();
	}

	/** １桁削除 */
	removeNumberOne(){
		if(this.calcSource != null){
			alert("計算結果を直接変更する事は出来ません！");
			return;
		}

		this.viewNumber = this.viewNumber.slice( 0, -1 );
		if(this.viewNumber.length < 1){
			this.viewNumber = '0';
		}
		this.number = BigNumber(this.viewNumber);

		this.setPositions();
	}

	/** 数字リセット */
	clearNumber(){
		if(this.calcSource != null){
			alert("計算結果を直接変更する事は出来ません！");
			return;
		}
		this.viewNumber = '0';
		this.number = BigNumber(this.viewNumber);

		this.setPositions();
	}
}
