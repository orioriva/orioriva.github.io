'use strict'

/**
 * 角が丸い四角形のパスを作成する
 * @param  {CanvasRenderingContext2D} ctx コンテキスト
 * @param  {Number} x   左上隅のX座標
 * @param  {Number} y   左上隅のY座標
 * @param  {Number} w   幅
 * @param  {Number} h   高さ
 * @param  {Number} r   半径
 */
function createRoundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, Math.PI * (3/2), 0, false);
    ctx.lineTo(x + w, y + h - r);
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * (1/2), false);
    ctx.lineTo(x + r, y + h);
    ctx.arc(x + r, y + h - r, r, Math.PI * (1/2), Math.PI, false);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * (3/2), false);
    ctx.closePath();
}

/**
 * 角が丸い四角形を塗りつぶす
 * @param  {CanvasRenderingContext2D} ctx コンテキスト
 * @param  {Number} x   左上隅のX座標
 * @param  {Number} y   左上隅のY座標
 * @param  {Number} w   幅
 * @param  {Number} h   高さ
 * @param  {Number} r   半径
 */
function fillRoundRect(ctx, x, y, w, h, r) {
    createRoundRectPath(ctx, x, y, w, h, r);
    ctx.fill();
}

/**
 * 角が丸い四角形を描画
 * @param  {CanvasRenderingContext2D} ctx コンテキスト
 * @param  {Number} x   左上隅のX座標
 * @param  {Number} y   左上隅のY座標
 * @param  {Number} w   幅
 * @param  {Number} h   高さ
 * @param  {Number} r   半径
 */
function strokeRoundRect(ctx, x, y, w, h, r) {
    createRoundRectPath(ctx, x, y, w, h, r);
    ctx.stroke();
}

/**
 * 矩形描画クラス
 */
class DrawRectClass extends DrawObj{
	constructor(parent, x, y, width, height, fillColor, strokeColor) {
		super(parent,x,y,fillColor);
		if(strokeColor === undefined) strokeColor = fillColor;
		this.width = width;
		this.height = height;
		this.strokeColor = strokeColor;

        // 親の当たり判定を更新
		parent.bounds.update(
			this.x,
			this.x + this.width,
			this.y,
			this.y + this.height
		);
	}

	draw(){
		ctx.globalAlpha = this.parent.alpha * this.alpha;
		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = 3;
		let mX = this.parent.x + this.x;
		let mY = this.parent.y + this.y;

		//roundedRect(mX, mY, this.width, this.height, 10);
		//ctx.fillRect(mX, mY, this.width, this.height);

		fillRoundRect(ctx, mX, mY, this.width, this.height, 10);
		strokeRoundRect(ctx, mX , mY, this.width, this.height, 10);
	}
}