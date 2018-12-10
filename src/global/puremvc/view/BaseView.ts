module FL {
    /**
     * 
     * @Name:   - BaseView
     * @Description:  //基础显示界面
     * @Create: DerekWu on 2017/7/8 12:32
     * @Version: V1.0
     */
    export abstract class BaseView extends eui.Component {
        /**
         * 界面的pureMvc的Mediator名字，避免出现遗漏的情况，所以定义为抽象属性，必须有值，不可修改
         * 在移除界面的时候会同时把这个界面对应的Mediator移除
         */
        abstract readonly  mediatorName:string;

        /**
         * 界面的层级，避免出现遗漏的情况，所以定义抽象属性，必须有值，不可修改
         * 参考 FL.ViewLayerEnum 中的定义
         */
        abstract readonly viewLayer:ViewLayerEnum;

        /**
         * 延迟显示时间，默认值40，如要改变，请赋值，EUI不需要延迟
         */
        // public laterTimes = 40;

        /**
         * 窗口添加到舞台时的缓动特性，不赋值则没有
         * 格式：[{target:"elementId", tweenDict:"openCommon", data:[]}] data[0]=界面初始属性 data[1]=界面最终属性 data[2]=缓动时间 data[3]=缓动函数 data[4]=延迟多久开始（可选，没有则马上执行）
         * 如果是界面本身，则不需要target，如果是界面里面的元素，则需要target，赋值为元素Id，利用反射将他们的值进行改变
         * 如果tweenDict 有值，这优先从 tweenDict 中找到数据类替代 data[]，没有则使用 data[]属性
         */
        public addTween:Array<any>;

        /**
         * 窗口移除舞台时的缓动特性，不赋值则没有
         * 格式：[{target:"elementId", tweenDict:"openCommon", data:[]}] data[0]=界面最终属性 data[1]=缓动时间 data[2]=缓动函数 data[3]=延迟多久开始（可选，没有则马上执行）
         * 如果是界面本身，则不需要target，如果是界面里面的元素，则需要target，赋值为元素Id，利用反射将他们的值进行改变
         * 如果tweenDict 有值，这优先从 tweenDict 中找到数据类替代 data[]，没有则使用 data[]属性
         */
        public delTween:Array<any>;

        /**
         * 窗口添加到舞台时的音效资源key，不赋值则没有
         * 格式：{string}
         */
        public addMusic:string;

        /**
         * 窗口移除舞台时的音效资源key，不赋值则没有
         * 格式：{string}
         */
        public delMusic:string;

        /** 是否已经处理添加到显示后的逻辑 */
        public isHandleAddedLogic:boolean = false;

        /** 是否已经处理从显示移除的逻辑 */
        public isHandleRemovedLogic:boolean = false;

        constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.baseViewAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.baseViewRemovedFromStage, this);
        }

        private baseViewAddedToStage():void {
            let self = this;
            // self.isHandleAddedLogic = true;
            self.isHandleRemovedLogic = false;
            // let vAddViewCallBack: Function = self[ViewEnum.onAddView];
            // if (vAddViewCallBack) {
            //     vAddViewCallBack.call(self);
            // }
            // egret.log("------baseViewAddedToStage");
        }

        protected baseViewRemovedFromStage(): void {
            let self = this;
            self.isHandleAddedLogic = false;
            self.isHandleRemovedLogic = true;
            //解除数据绑定
            BindManager.remAllAttrListener(self);
            let vRemViewCallBack:Function = self[ViewEnum.onRemView];
            if (vRemViewCallBack) {
                vRemViewCallBack.call(self);
            }
            //处理调停者
            let mediatorName:string = self[ViewEnum.mediatorName];
            if (mediatorName) {
                // console.log("removeMediator mediatorName="+mediatorName);
                let vIMediator:puremvc.IMediator = AppFacade.getInstance().retrieveMediator(mediatorName);
                //解除数据绑定
                BindManager.remAllAttrListener(vIMediator);
                //删除Mediator
                MvcUtil.delMediator(mediatorName);
            }
            // egret.log("------baseViewRemovedFromStage");
        }

    }
}