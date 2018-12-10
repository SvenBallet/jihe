module FL {
    /**
     * 触摸缓动工具类
     * @Name:  FL - TouchTweenUtil
     * @Company 
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/10/16 10:01
     * @Version: V1.0
     */
    export class TouchTweenUtil {

        public static regTween(pTouchObj:egret.DisplayObject, pTweenObj:any, pTouchBeginObj?:{}, pTouchEndObj?:{}, pTweenTimes:number = 100, pBeginEaseFun?:Function, pEndEaseFun?:Function):TouchTweenObj {
            return new TouchTweenObj(pTouchObj, pTweenObj, pTouchBeginObj, pTouchEndObj, null, pTweenTimes, pBeginEaseFun, pEndEaseFun);
        }

        public static regTweenWithSound(pTouchObj:egret.DisplayObject, pTweenObj:any, pTouchSound:string, pTouchBeginObj?:{}, pTouchEndObj?:{}, pTweenTimes:number = 100, pBeginEaseFun?:Function, pEndEaseFun?:Function):TouchTweenObj {
            return new TouchTweenObj(pTouchObj, pTweenObj, pTouchBeginObj, pTouchEndObj, pTouchSound, pTweenTimes, pBeginEaseFun, pEndEaseFun);
        }

    }

    /**
     * 触摸缓动对象
     * @Name:  FL - TouchTweenObj
     * @Company 
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/10/16 9:28
     * @Version: V1.0
     */
    export class TouchTweenObj { 

        /** 触摸对象 */
        private _touchObj:egret.DisplayObject;
        /** 缓动对象 */
        private _tweenObj:any;

        /** 触摸按下属性变化对象 */
        private _touchBeginObj:{};
        /** 触摸结束属性变化对象 */
        private _touchEndObj:{}; 
        /** 触摸声音 */
        public touchSound:string = "audio_button_click_mp3";
        /** 缓动时间 */
        private _touchTweenTimes:number;
        /** 开始缓动函数 */
        private _touchBeginEase:Function;  
        /** 结束缓动函数 */
        private _touchEndEase:Function;


        constructor(pTouchObj:egret.DisplayObject, pTweenObj:any, pTouchBeginObj?:{}, pTouchEndObj?:{}, pTouchSound?:string, pTweenTimes:number = 100, pBeginEaseFun?:Function, pEndEaseFun?:Function) {
            this._touchObj = pTouchObj;
            this._tweenObj = pTweenObj;
            if (pTouchBeginObj) {
                this._touchBeginObj = pTouchBeginObj;
            } else {
                 this._touchBeginObj = {scaleX:0.95, scaleY:0.95};
            }
            if (pTouchEndObj) {
                this._touchEndObj = pTouchEndObj;
            } else {
                 this._touchEndObj = {scaleX:1, scaleY:1};
            }
            this._touchTweenTimes = pTweenTimes;
            if (pTouchSound) this.touchSound = pTouchSound;
            if (pBeginEaseFun) this._touchBeginEase = pBeginEaseFun;
            if (pEndEaseFun) this._touchEndEase = pEndEaseFun;
            pTouchObj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBaseBegin, this);
            pTouchObj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBaseTap, this);
        }

        /** 是否触摸缓动中 */
        private _isTouchBaseTween:boolean = false; 
        /** 是否按下缓动中 */
        private _isInTouchBaseBeginTween:boolean = false;

        private onTouchBaseBegin(event:egret.TouchEvent):void {
            let self = this;
            if (!self._isTouchBaseTween) {
                let vStage = self._touchObj.$stage;
                vStage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onTouchBaseCancel, self);
                vStage.addEventListener(egret.TouchEvent.TOUCH_END, self.onTouchBaseCancel, self);
                vStage.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.onTouchBaseMove, self);
                //缩小
                let tw:Game.Tween = Game.Tween.get(self._tweenObj);
                // tw.to({ scaleX: 0.95}, 100, Game.Ease.quadIn).call(self.scaleToSmallOver, self);
                tw.to(self._touchBeginObj, self._touchTweenTimes, self._touchBeginEase).call(self.onTouchBaseBeginOver, self);
                //播放音效
                // SoundManager.playEffect(self.touchSound);
                //设置正在触摸缓动中,是否按下缩小缓动中
                self._isTouchBaseTween = true, self._isInTouchBaseBeginTween = true;
            }
            // event.updateAfterEvent();
        }

        private onTouchBaseTap(event:egret.TouchEvent):void {
            //播放音效
            SoundManager.playEffect(this.touchSound);
        }

        private onTouchBaseBeginOver():void {
            this._isInTouchBaseBeginTween = false;
            this.onTouchBaseOver();
        }

        /** 是否触摸结束 */
        private _isTouchBaseOver:boolean = false;

        private onTouchBaseCancel(event:egret.TouchEvent):void {
            let self = this, vStage = event.$currentTarget;
            vStage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onTouchBaseCancel, self);
            vStage.removeEventListener(egret.TouchEvent.TOUCH_END, self.onTouchBaseCancel, self);
            vStage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, self.onTouchBaseMove, self);
            self._isTouchBaseOver = true;
            self.onTouchBaseOver();
        }

        // private static _resultPoint:egret.Point = new egret.Point();

        private onTouchBaseMove(event:egret.TouchEvent):void {
            //egret.log("localX="+event.localX + " localY="+event.localY);
            //egret.log("stageX="+event.stageX + " stageY="+event.stageY);
            // let v = this._touchObj;
            // let vResultPoint:egret.Point = this._touchObj.globalToLocal(event.stageX, event.stageY, TouchTweenObj._resultPoint);
            // egret.log("2 -- localX="+vResultPoint.x + " localY="+vResultPoint.y);
            // egret.log(""+this._touchObj.hitTestPoint(vResultPoint.x, vResultPoint.y, true));
            let vIsHit:boolean = this._touchObj.hitTestPoint(event.stageX, event.stageY);
            if (!vIsHit) this.onTouchBaseCancel(event);
        }

        /**
         * @private
         * 舞台上触摸弹起事件
         */
        // private onStageTouchBaseEnd(event:egret.Event):void {
        //     let self = this, stage = event.$currentTarget;
        //     stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, self.onTouchBaseCancel, self);
        //     stage.removeEventListener(egret.TouchEvent.TOUCH_END, self.onStageTouchBaseEnd, self);
        //     self._isTouchBaseOver = true;
        //     self.onTouchBaseOver();
        // }

        /**
         * 处理触摸结束
         */
        private onTouchBaseOver():void {
            let self = this;
            if (self._isTouchBaseOver && !self._isInTouchBaseBeginTween) {
                //放大
                let tw:Game.Tween = Game.Tween.get(self._tweenObj);
                // tw.to({scaleX: 1}, 100, Game.Ease.quadOut);
                tw.to(self._touchEndObj, self._touchTweenTimes, self._touchEndEase);
                //设置
                self._isTouchBaseTween = false, self._isTouchBaseOver = false;
            }
        }

    }
}