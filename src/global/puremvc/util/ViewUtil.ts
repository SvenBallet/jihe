module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ViewUtil
     * @Description:  //界面工具类
     * @Create: DerekWu on 2017/11/23 16:50
     * @Version: V1.0
     */
    export class ViewUtil {

        /**
         * 添加到最后
         * @param {egret.DisplayObjectContainer} vDisplayObjectContainer
         * @param {egret.DisplayObject} vDisplayObject
         */
        public static addChild(vDisplayObjectContainer:egret.DisplayObjectContainer, vDisplayObject:egret.DisplayObject):void {
            let vIndex:number = vDisplayObjectContainer.getChildIndex(vDisplayObject);
            if (vIndex === -1) vDisplayObjectContainer.addChild(vDisplayObject);
        }

        /**
         * 在某个元素之前添加
         * @param {egret.DisplayObjectContainer} vDisplayObjectContainer
         * @param {egret.DisplayObject} vAddObject
         * @param {egret.DisplayObject} vOneObject
         * @param {egret.DisplayObject} vTwoObject
         * @param {egret.DisplayObject} vThreeObject
         */
        public static addChildBefore(vDisplayObjectContainer:egret.DisplayObjectContainer, vAddObject:egret.DisplayObject, vOneObject?:egret.DisplayObject, vTwoObject?:egret.DisplayObject, vThreeObject?:egret.DisplayObject):void {
            let vIndex:number = vDisplayObjectContainer.getChildIndex(vAddObject);
            if (vIndex === -1) {
                if (vOneObject) {
                    vIndex = vDisplayObjectContainer.getChildIndex(vOneObject);
                    if (vIndex === -1) {
                        if (vTwoObject) {
                            vIndex = vDisplayObjectContainer.getChildIndex(vTwoObject);
                            if (vIndex === -1) {
                                if (vThreeObject) {
                                    vIndex = vDisplayObjectContainer.getChildIndex(vThreeObject);
                                }
                            }
                        }
                    }
                    if (vIndex !== -1) {
                        vDisplayObjectContainer.addChildAt(vAddObject, vIndex);
                        return;
                    }
                }
                vDisplayObjectContainer.addChild(vAddObject);
            }
        }

        /**
         * 在某一个对象之后添加一个元素
         * @param {egret.DisplayObjectContainer} vDisplayObjectContainer
         * @param {egret.DisplayObject} vAddObject
         * @param {egret.DisplayObject} vBeforeObject
         */
        public static addChildAfter(vDisplayObjectContainer:egret.DisplayObjectContainer, vAddObject:egret.DisplayObject, vBeforeObject:egret.DisplayObject):void {
            let vIndex:number = vDisplayObjectContainer.getChildIndex(vAddObject);
            if (vIndex === -1) {
                vIndex = vDisplayObjectContainer.getChildIndex(vBeforeObject);
                if (vIndex !== -1) {
                    vDisplayObjectContainer.addChildAt(vAddObject, vIndex+1);
                } else {
                    vDisplayObjectContainer.addChild(vAddObject);
                }
            }
        }

        /**
         * 移除某个元素
         * @param {egret.DisplayObjectContainer} vDisplayObjectContainer
         * @param {egret.DisplayObject} vDisplayObject
         */
        public static removeChild(vDisplayObjectContainer:egret.DisplayObjectContainer, vDisplayObject:egret.DisplayObject):void {
            let vIndex:number = vDisplayObjectContainer.getChildIndex(vDisplayObject);
            if (vIndex !== -1) vDisplayObjectContainer.removeChild(vDisplayObject);
        }

    }
}