module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameScrollMsg
     * @Description:  打麻将界面的跑马灯消息
     * @Create: ArielLiang on 2018/1/17 15:01
     * @Version: V1.0
     */
    export class MJGameScrollMsg extends BaseView {
        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.TOOLTIP_CENTER;


        public msgLabel:eui.Label;
        private msgTween:Game.Tween;

        public msg:ScrollMsg;


        private static _only:MJGameScrollMsg;

        public static getInstance():MJGameScrollMsg {
            if (!this._only) {
                this._only = new MJGameScrollMsg();
            }
            return this._only;
        }

        private constructor() {
            super();
            this.y = 120;
            this.horizontalCenter = 0;
            this.skinName = "skins.MJGameScrollMsgSkin";
        }

        protected childrenCreated(): void {
            let self = this;
            super.childrenCreated();

            self.changeMsg();
        }

        public changeMsg(){
            let self = this;
            let isRmPreviousMsg:number = self.msg.removeAllPreviousMsg;
            let text:string = self.msg.msg;
            if(isRmPreviousMsg === 1){
                this.msgLabel.text = text;
            }else{
                this.msgLabel.text = this.msgLabel.text+" "+text;
            }
            let srcPosx = 410;
            if(!this.msgTween){
                //每秒钟100像素
                let speedTime = (srcPosx + this.msgLabel.width)/100 * 1000;
                this.msgTween = Game.Tween.get( this.msgLabel,{loop:true} ).to( {x:0-this.msgLabel.width},speedTime).to({x:srcPosx}).wait(1000);
            }
        }

    }
}