module FL {
    export class AgentPlayerManageView extends BaseView{

        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        /** 单例 */
        private static _only: AgentPlayerManageView;

        public static getInstance(): AgentPlayerManageView {
            if (!this._only) {
                this._only = new AgentPlayerManageView();
            }
            return this._only;
        }


        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;


        }

        protected childrenCreated():void {
            super.childrenCreated();

        }

        public setContent(msg){
            this.removeChildren();
            let contentLabel = new eui.Label();
            contentLabel.fontFamily = "Microsoft YaHei";
            contentLabel.y = -280;
            contentLabel.textColor = 236482;
            contentLabel.lineSpacing = 14;
            contentLabel.text = msg.order;
            this.addChild(contentLabel);
        }


    }
}