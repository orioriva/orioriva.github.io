'use strict'

/** オブジェクトの依存関係追加 */
function insertObj(obj, prevObj, nextObj){
	if(prevObj != null){
		obj.prevObj.push(prevObj);
		prevObj.nextObj.push(obj);
	}
	if(nextObj != null){
		obj.nextObj.push(nextObj);
		nextObj.prevObj.push(obj);
	}
}

/** 当たり判定クラス */
class Bounds{
	constructor() {
		this.left = 0.0;
		this.right = 0.0;
		this.top = 0.0;
		this.bottom = 0.0;
		this.width = 0.0;
		this.height = 0.0;
	}

	update(left,right,top,bottom){
		this.left = (this.left < left) ? this.left : left;
		this.right = (this.right > right) ? this.right : right;
		this.top = (this.top < top) ? this.top : top;
		this.bottom = (this.bottom > bottom) ? this.bottom : bottom;
		this.width = this.right - this.left;
		this.height = this.bottom - this.top;
	}

	clear(){
		this.left = 0.0;
		this.right = 0.0;
		this.top = 0.0;
		this.bottom = 0.0;
		this.width = 0.0;
		this.height = 0.0;
	}
}

/** オブジェクト共通クラス */
class ObjectClass {
	constructor(type,x,y) {
		this.type = type;
		this.padding = 5;
		this.alpha = 1.0;
		this.x = x;
		this.y = y;
		this.nextObj = new Array();
		this.prevObj = new Array();
		this.bounds = new Bounds();
		this.fillColor = "#ffffff"
		objects.push(this);
	}

	/** 削除処理 */
	isDelete(){
		// オブジェクト配列から自身を削除
		let index = objects.indexOf(this);
		objects.splice(index,1);

		// 前のオブジェクトとの依存関係削除
		if(this.prevObj.length > 0){
			for(let value of this.prevObj){
				value.deleteNextObj(this);
			}
		}

		// 次のオブジェクトとの依存関係削除
		if(this.nextObj.length > 0){
			for(let value of this.nextObj){
				value.deletePrevObj(this);
			}
		}

		this.nextObj = null;
		this.prevObj = null;
	}

	/**  */
	deleteNextObj(obj){
		deleteArrayItem(this.nextObj,obj);
	}

	/**  */
	deletePrevObj(obj){
		deleteArrayItem(this.prevObj,obj);
	}

	init(){ alert('init():オーバーライド前が呼び出されました！'); }
	update(){ alert('update():オーバーライド前が呼び出されました！'); }
	setPositions(){ alert('setPositions():オーバーライド前が呼び出されました！'); }
	draw(){ alert('draw():オーバーライド前が呼び出されました！'); }

	hitTest(pointX,pointY){
		const isHit =
				(this.getLeftPos() <= pointX && this.getRightPos() >= pointX)	// 横方向の判定
			&&	(this.getTopPos() <= pointY && this.getBottomPos() >= pointY);	// 縦方向の判定
		return isHit;
	}
	
	getLeftPos(){ return this.x + this.bounds.left; }
	getRightPos(){ return this.x + this.bounds.right; }
	getTopPos(){ return this.y + this.bounds.top; }
	getBottomPos(){ return this.y + this.bounds.bottom; }
}