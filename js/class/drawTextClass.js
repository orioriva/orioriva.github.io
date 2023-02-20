'use strict'

class DrawObj{
	constructor(parent,x,y,fillColor){
		this.parent = parent;
		this.x = x;
		this.y = y;
		this.width = 0;
		this.height = 0;
		this.fillColor = fillColor;
		this.alpha = 1.0;
	}

	update(){}
	draw(){}
}

// 3桁カンマ区切りとする（小数点も考慮）.
function comma(num) {
    var s = String(num).split('.');
    var ret = String(s[0]).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    if (s.length > 1) {
        ret += '.' + s[1];
    }
    return ret;
}

/**
 * テキスト描画クラス
 */
class DrawTextClass extends DrawObj{
	constructor(parent,text,font,x,y,adjustY,fillColor,numberSlice) {
		super(parent,x,y,fillColor);
		if(numberSlice == undefined) numberSlice = false;
		this.text = numberSlice ? comma(text) : text;
		this.font = font;

		this.update();

		// 座標を自身の高さの半分補正するか？
		// 0未満か0より大きいかで上下方向判断
		if(adjustY < 0){
			this.y -= (this.height / 2.0);
		}else if(adjustY > 0){
			this.y += (this.height / 2.0);
		}

		// 親の当たり判定を更新
		const halfW = this.width / 2.0;
		const halfH = this.height / 2.0;
		parent.bounds.update(
			this.x - halfW,
			this.x + halfW,
			this.y - halfH,
			this.y + halfH
		);
	}

	/** 各種ステータス更新 */
	update(){
		ctx.beginPath();
		ctx.font = this.font;
		const bounds = ctx.measureText(this.text);
		this.width = bounds.width;
		this.height = bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent;
		ctx.closePath();
	}

	/** 描画 */
	draw(){
		ctx.beginPath();
		ctx.globalAlpha = this.parent.alpha * this.alpha;
		ctx.font = this.font;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillStyle = this.fillColor;
		ctx.fillText(this.text, this.parent.x + this.x, this.parent.y + this.y);
		ctx.closePath();
	}

	getHalfHeight(){
		return this.height / 2.0;
	}
}