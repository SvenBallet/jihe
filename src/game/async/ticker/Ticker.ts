module Game {
    /**
     * 
     * @Name:  Game - Ticker
     * @Description:  //Game 心跳计时器
     * @Create: DerekWu on 2017/3/23 18:03
     * @Version: V1.0
     */
    export class Ticker { 

        /** 心跳队列 */
        private static $tickCallBackList:any[] = [];
        private static $tickThisList:any[] = [];

        /**
         * 添加心跳回调函数
         * @param callBack
         * @param thisObject
         */
        public static $startTick(callBack:(timeStamp:number)=>boolean, thisObject:any):void {
            let self = this;
            self.concatTick();
            self.$tickCallBackList.push(callBack);
            self.$tickThisList.push(thisObject);
        }

        /**
         * 停止某个心跳
         * @param callBack
         * @param thisObject
         */
        public static $stopTick(callBack:(timeStamp:number)=>boolean, thisObject:any):void {
            let self = this;
            let index = self.getTickIndex(callBack, thisObject);
            if (index === -1) {
                return;
            }
            self.concatTick();
            self.$tickCallBackList.splice(index, 1);
            self.$tickThisList.splice(index, 1);
        }

        /**
         * 心跳一下
         */
        public static $ticker(timeStamp:number):void {
            let callBackList = this.$tickCallBackList;
            let thisObjectList = this.$tickThisList;
            let length = callBackList.length;
            // let timeStamp = egret.getTimer();
            for (let i = 0; i < length; ++i) {
                callBackList[i].call(thisObjectList[i], timeStamp);
            }
        }

        /**
         * concat 目的是在心跳里面添加的在下一帧生效
         */
        private static concatTick():void {
            let self = this;
            self.$tickCallBackList = self.$tickCallBackList.concat();
            self.$tickThisList = self.$tickThisList.concat();
        }

        /**
         * 获得索引
         * @param callBack
         * @param thisObject
         * @returns {number}
         */
        private static getTickIndex(callBack:Function, thisObject:any):number {
            let self = this;
            let callBackList = self.$tickCallBackList;
            let thisObjectList = self.$tickThisList;
            for (let i = callBackList.length - 1; i >= 0; i--) {
                if (callBackList[i] == callBack && thisObjectList[i] == thisObject) {//这里不能用===，因为有可能传入undefined和null.
                    return i;
                }
            }
            return -1;
        }

    }
}