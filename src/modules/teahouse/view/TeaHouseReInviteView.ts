module FL {
    /** 茶楼邀请界面 */
    export class TeaHouseReInviteView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseReInviteView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        /** 详情信息数据源 */
        private arrCollection: eui.ArrayCollection;

        public baseGroup:eui.Group;
        public inviteLab:eui.Label;
        public playLab:eui.Label;
        public agreeGro:eui.Group;
        public agreeBtn:eui.Group;
        public refuseGro:eui.Group;
        public refuseBtn:eui.Group;
        public titleLab:eui.Label;
        public closeGroup:eui.Group;
        public closeBtn:eui.Image;

        public roomId: number;

        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = skins.TeaHouseReInviteView;
        }

        public static getInstance() {
            if (!this._onlyOne) {
                this._onlyOne = new TeaHouseReInviteView();
            }
            return this._onlyOne;
        }

        protected childrenCreated() {
            let self = this;
            //注册触摸缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.agreeGro, self.agreeBtn);
            TouchTweenUtil.regTween(self.refuseGro, self.refuseBtn);

            self.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.delView, self);
            self.agreeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.agreeClick, self);
            self.refuseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.refuseClick, self);
        }

        /** 添加到界面框架自动调用 */
        protected onAddView() {
            let self = this;
        }

        /** 初始化页面 */
        public initView(msg: InviteToJoinGameLogicHandlerMsgAck) {
            this.roomId = msg.roomId;
            let mainName: string = "";
            if (msg.mainGamePlayRule >= 20000) {
                mainName = MahjongHandler.getMJGameNameText(msg.mainGamePlayRule);
            }
            else {
                mainName = RFGameHandle.getCardGameNameText(msg.mainGamePlayRule);
            }
            this.inviteLab.textFlow= <Array<egret.ITextElement>>[  
                { text: msg.teaHouseName, style: {textColor: 0xB95A00}},
				{ text: "茶楼", style: {textColor: 0x000000}},
				{ text: msg.InviterName, style: {textColor: 0xB95A00}},
                { text: "邀请你来玩", style: {textColor: 0x000000}},
                { text: mainName, style: {textColor: 0xB95A00}}];

            let descStr: string = "";
            let numStr: Array<string> = ["零", "一", "二", "三", "四"];
            let totalJu: number = msg.totalPlayCount;
            let maxPlayers: number = msg.totalPlayerNum;
            descStr += totalJu + "局，"+maxPlayers+"人" + "\n";
            let rulestr = "";
            if (msg.mainGamePlayRule >= 20000) {
                rulestr = MahjongHandler.getWanfaSubDescStrNoPersonNum(msg.mainGamePlayRule, msg.subGamePlayRuleList);
            }
            else {
                rulestr = RFGameHandle.getWanfaSubDescStrNoPersonNum(msg.mainGamePlayRule, msg.subGamePlayRuleList);
            }
            rulestr = rulestr.replace(/\n/g, ",");
            rulestr = rulestr.slice(0, rulestr.length-1);
            descStr += rulestr;
            this.playLab.text = descStr;
        }

        /** 关闭页面 */
        private delView() {
            MvcUtil.delView(this);
        }

        private agreeClick() {
            let vNewJoinVipRoomMsg:NewJoinVipRoomMsg = new NewJoinVipRoomMsg();
            vNewJoinVipRoomMsg.vipRoomID = this.roomId;
            ServerUtil.sendMsg(vNewJoinVipRoomMsg, MsgCmdConstant.MSG_INTO_GAME_TABLE);
            this.delView();
        }

        private refuseClick() {
            this.delView();
        }
    }
}