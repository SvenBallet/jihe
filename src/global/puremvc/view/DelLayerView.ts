module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - DelLayerView
     * @Description:  //删除层级界面，改界面不会添加到界面，只用来根据层级约束删除对应的层级上的界面
     * @Create: DerekWu on 2017/12/8 12:45
     * @Version: V1.0
     */
    export class DelLayerView extends egret.DisplayObject {
        /**
         * 界面的pureMvc的Mediator名字，避免出现遗漏的情况，所以定义为抽象属性，必须有值，不可修改
         * 在移除界面的时候会同时把这个界面对应的Mediator移除
         */
        public readonly mediatorName:string = "";

        /**
         * 界面的层级，避免出现遗漏的情况，所以定义抽象属性，必须有值，不可修改
         * 参考 FL.ViewLayerEnum 中的定义
         */
        public readonly viewLayer:ViewLayerEnum;

        constructor(pViewLayer:ViewLayerEnum) {
            super();
            this.viewLayer = pViewLayer;
        }

    }

}