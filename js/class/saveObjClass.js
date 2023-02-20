'use strict'

class SaveObj{
    constructor(obj){
        this.type = obj.type;
        this.x = obj.x;
        this.y = obj.y;

        if(obj.type == "pointer"){
            this.parent = objects.indexOf(obj.parent);
            return;
        }

        if(obj.type == "number"){
            this.tag = obj.text;
            let sourceIndex = objects.indexOf(obj.calcSource);
            if(sourceIndex >= 0){
                this.calcSource = sourceIndex;
                return;
            }
            this.number = obj.number;
            this.calcSource = null;
        }else if(obj.type == "sign"){
            this.typeText = obj.typeText;
        }

        this.nextObj = new Array();
        this.prevObj = new Array();

        for(let value of obj.nextObj){
            this.nextObj.push(objects.indexOf(value));
        }
        for(let value of obj.prevObj){
            this.prevObj.push(objects.indexOf(value));
        }
    }
}