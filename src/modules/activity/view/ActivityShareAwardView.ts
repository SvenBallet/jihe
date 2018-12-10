module FL {

    import data = RES.FileSystem.data;

    export class ActivityShareAwardView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public share:GameButton;
        public diamondNum:eui.Label;

        public colorFlilter = new egret.ColorMatrixFilter(
            [0.5,0,0,0,0,
            0,0.5,0,0,0,
            0,0,0.5,0,0,
            0,0,0,1,0]);

        private static _only:ActivityShareAwardView;

        public static getInstance():ActivityShareAwardView {
            if (!this._only) {
                this._only = new ActivityShareAwardView();
            }
            return this._only;
        }

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            // this.skinName = "skins.ActivityShareAwardViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();

            // MvcUtil.regMediator( new ActivityBaseViewMediator(self) );
        }

        public setData(msg){
            let self = this;
            let dataList:Array<number> = msg.vlist;
            let isGet:number = dataList[0];
            self.diamondNum.text = ""+dataList[1];
            if(isGet === 1){  //关闭
                self.share.filters = [self.colorFlilter];
            }else{
                TouchTweenUtil.regTween(self.share, self.share);
                this.share.addEventListener(egret.TouchEvent.TOUCH_TAP, self.shareAward, self);
            }
        }

        private shareAward(e:egret.Event):void{
            MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
        }

    }
}