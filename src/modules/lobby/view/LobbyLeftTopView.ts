module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyLeftTopView
     * @Description:  //大厅左上角界面
     * @Create: DerekWu on 2017/11/10 21:44
     * @Version: V1.0
     */
    export class LobbyLeftTopView extends BaseView {

        public readonly mediatorName: string = LobbyLeftTopViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        //添加界面的缓动
        // public addTween:Array<any> = [{data:[{top:-106}, {top:0}, 1000, Game.Ease.quintOut]}];

        //头像
        public avatarGroup: eui.Group;
        public headImg: eui.Image;
        public avatarBtn: eui.Image;


        //ID
        public idLabel: eui.Label;
        //名字
        public playerNameLabel: eui.Label;
        //金币
        public goldNum: eui.Label;
        //增加金币组和按钮
        public addGoldGroup: eui.Group;
        public addGoldBtn: eui.Image;

        //钻石
        public diamondNum: eui.Label;
        //增加金币组和按钮
        public addDiamondGroup: eui.Group;
        public addDiamondBtn: eui.Image;

        public inviteCodeGroup: eui.Group;
        public inviteCodeLabel: eui.Label;
        public codeInput: NumberInput;

        //TODO ....

        /** 单例 */
        private static _only: LobbyLeftTopView;

        /** 调停者 */
        private _mediator: LobbyLeftTopViewMediator;

        public static getInstance(): LobbyLeftTopView {
            if (!this._only) {
                this._only = new LobbyLeftTopView();
            }
            return this._only;
        }

        constructor() {
            super();
            this.left = this.top = 0;
            this.skinName = "skins.LobbyLeftTopViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.addGoldGroup, self.addGoldBtn);
            TouchTweenUtil.regTween(self.addDiamondGroup, self.addDiamondBtn);
            // TouchTweenUtil.regTween(self.avatarGroup, self.avatarGroup);

            //调停者
            self._mediator = new LobbyLeftTopViewMediator(self);
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            let self = this;
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            MvcUtil.regMediator(self._mediator);
            //绑定金币属性，发生改变将回调
            BindManager.addAttrListener(vPlayerVO.gold.attrId, self.updateGoldNum, self);
            //绑定金币属性，发生改变将回调
            BindManager.addAttrListener(vPlayerVO.diamond.attrId, self.updateDiamondNum, self);

            //初始化数据
            this.initViewData();
        }


        /**
         * 初始化界面数据
         */
        private initViewData(): void {
            let self = this;
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            self.idLabel.text = "ID：" + vPlayerVO.playerIndex;
            let inviteCode: number = vPlayerVO.inviteCode;
            if (inviteCode) {
                self.inviteCodeGroup.visible = true;
                self.inviteCodeLabel.visible = true;
                self.inviteCodeLabel.text = "邀请码:" + inviteCode;
                this.inviteCodeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareInviteCode, self);
            } else {
                self.inviteCodeGroup.visible = false;
            }
            self.playerNameLabel.text = StringUtil.subStrSupportChinese(vPlayerVO.playerName, 12, "...");
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(self.headImg, vPlayerVO.headImageUrl, self, 54,52,46);
                GWXAuth.setRectWXHeadImg(self.headImg, vPlayerVO.headImageUrl);
            }
            // else {
            //     GWXAuth.setRectWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0");
            // }
        }


        /**
         * 更新金币属性
         * @param {number} goldNum
         */
        private updateGoldNum(goldNum: number): void {
            this.goldNum.text = "" + goldNum;
        }

        /**
         * 更新钻石属性
         * @param {number} diamondNum
         */
        private updateDiamondNum(diamondNum: number): void {
            this.diamondNum.text = "" + diamondNum;
        }

        /**
         * 分享邀请码
         */
        private shareInviteCode(): void {
            MvcUtil.send(AgentModule.AGENT_SHARE_INVITE_CODE);
        }
    }
}