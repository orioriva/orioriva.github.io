class DrawCircleClass extends DrawObj{
    constructor(parent, x, y, radius, fillColor) {
		super(parent,x,y,fillColor);
		this.width = radius;
		this.height = radius;

        // 親の当たり判定を更新
		parent.bounds.update(
			this.x - this.width,
			this.x + this.width,
			this.y - this.height,
			this.y + this.height
		);
    }

    /** 円の描画 */
    draw(){
        ctx.beginPath();

        const mX = this.parent.x + this.x;
        const mY = this.parent.y + this.y;
        const mRad = 360 * Math.PI / 180;
        ctx.arc( mX, mY, this.width, 0, mRad, false );

        ctx.globalAlpha = this.parent.alpha * this.alpha;
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        
        ctx.strokeStyle = this.fillColor;
        ctx.lineWidth = 3;
        ctx.stroke() ;

        ctx.closePath();
    }
}