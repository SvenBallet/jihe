module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - MahjongChoosePiaoView
     * @Description: 麻将 飘分选择
     * @Create: ArielLiang on 2018/6/5 14:26
     * @Version: V1.0
     */
    export class MahjongChoosePiaoView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 不飘*/
        public buPiaoBtn:eui.Group;
        /** 飘一分*/
        public piaoOneBtn:eui.Group;
        /** 飘二分*/
        public piaoTwoBtn:eui.Group;
        /** 飘三分*/
        public piaoThreeBtn:eui.Group;

        public constructor() {
            super();
            this.skinName = "skins.MahjongChoosePiaoSkin";
            this.horizontalCenter = this.verticalCenter = 0;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.buPiaoBtn, self.buPiaoBtn);
            TouchTweenUtil.regTween(self.piaoOneBtn, self.piaoOneBtn);
            TouchTweenUtil.regTween(self.piaoTwoBtn, self.piaoTwoBtn);
            TouchTweenUtil.regTween(self.piaoThreeBtn, self.piaoThreeBtn);

            self.buPiaoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.choosePiao, self);
            self.piaoOneBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.choosePiao, self);
            self.piaoTwoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.choosePiao, self);
            self.piaoThreeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.choosePiao, self);
        }

        private choosePiao(e:egret.Event):void {
            let piaoFen:number = parseInt(e.currentTarget.name);
            let vMahjongPlayerChooseItemMsg:MahjongPlayerChooseItemMsg = new MahjongPlayerChooseItemMsg();
            vMahjongPlayerChooseItemMsg.operChosen.playerPos = MahjongHandler.getTablePos(PZOrientation.DOWN);
            vMahjongPlayerChooseItemMsg.operChosen.operType = EMahjongChooseItem.PIAO_FEN;
            vMahjongPlayerChooseItemMsg.operChosen.operValue = piaoFen;
            ServerUtil.sendMsg(vMahjongPlayerChooseItemMsg,MsgCmdConstant.MSG_MAHJONG_PLAYER_CHOOSE_ITEM_ACK);
            this.closeView();
        }

        private closeView():void {
            MvcUtil.delView(this);
        }

    }
}