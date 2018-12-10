module FL {
    /** 大厅基础页面（重新设计） */
    export class LobbyBaseRedesignView extends BaseView {
        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        //添加界面的缓动
        // public addTween:Array<any> = [
        //     {target:"leftNoticeGroup", data:[{left:-260}, {left:15}, 1000, Game.Ease.quintOut]},
        //     {target:"bottomGroup", data:[{bottom:-65}, {bottom:0}, 1000, Game.Ease.quintOut]}
        //     ];

        //背景图片，在childrenCreated 中替换
        public bgImg: eui.Image;

        //左侧公告
        public leftNoticeGroup: eui.Group;
        public leftNoticeImg: eui.Image;

        //底部区域
        public bottomGroup: eui.Group;
        // public bottomNoticeLabel: eui.Label;

        //顶部区域
        public topGroup: eui.Group;

        //左侧区域
        public leftGroup: eui.Group;

        //右侧区域
        public rightGroup: eui.Group;

        //分享
        public shareGroup: eui.Group;
        public shareBtn: eui.Image;

        //对战记录
        public recordGroup: eui.Group;
        public recordBtn: eui.Image;

        //商城
        public mallGroup: eui.Group;
        public mallBtn: eui.Image;

        //客服 
        public serviceGroup: eui.Group;
        public serviceBtn: eui.Image;

        //实名认证
        public identifyGroup: eui.Group;
        public identifyBtn: eui.Image;

        // //活动按钮
        // public activityGroup: eui.Group;
        // public activityBtn: eui.Image;

        //创建游戏
        public createGroup: eui.Group;
        public createBtn: eui.Image;
        private createText: eui.Image;
        //创建茶楼
        public createTHGroup: eui.Group;
        public createTHBtn: eui.Image;
        public createTHText: eui.Image;
        //加入游戏
        public joinGroup: eui.Group;
        public joinBtn: eui.Image;
        //金币场
        public goldGroup: eui.Group;
        public goldBtn: eui.Image;
        private goldText: eui.Image;
        //俱乐部
        // public clubGroup: eui.Group;
        // public clubBtn: eui.Image;

        // public elseGroup: eui.Group;

        //加入茶楼
        public joinTHGroup: eui.Group;
        public joinTHBtn: eui.Image;
        private joinTHText: eui.Image;

        //测试
        // public testGroup: eui.Group;
        // public testBtn: eui.Image;


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

        //设置组
        public settingGroup: eui.Group;
        public settingBtn: eui.Image;
        public msgLabel: eui.Label;

        //滚动字幕组
        public scrollGroup: eui.Group;
        private msgTween: Game.Tween;
        public noticeScroller: eui.Scroller;


        //帮助按钮
        public helpGroup: eui.Group;
        public helpBtn: eui.Image;

        /** 茶楼列表数据源 */
        public thData: ILobbyTHListItem[];
        /** 茶楼列表显示组件 */
        public teaHouseScroller: eui.Scroller;
        public teaHouseDatagroup: eui.DataGroup;
        public teaHouseArrcollection: eui.ArrayCollection;

        public rewardImg:eui.Image;

        /** 单例 */
        private static _only: LobbyBaseRedesignView;

        /** 调停者 */
        private _mediator: LobbyBaseRedesignViewMediator;

        public static getInstance(): LobbyBaseRedesignView {
            if (!this._only) {
                this._only = new LobbyBaseRedesignView();
            }
            return this._only;
        }

        constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.LobbyBaseRedesignViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            //底部通知
            // let msgTitle:string = LobbyData.noticeTitle;
            // self.bottomNoticeLabel.text = msgTitle;

            TouchTweenUtil.regTween(self.shareGroup, self.shareBtn);
            // TouchTweenUtil.regTween(self.activityGroup, this.activityBtn);
            TouchTweenUtil.regTween(self.mallGroup, self.mallBtn);
            TouchTweenUtil.regTween(self.recordGroup, self.recordBtn);
            // TouchTweenUtil.regTween(self.clubGroup, self.clubBtn);
            TouchTweenUtil.regTween(self.goldGroup, self.goldBtn);
            TouchTweenUtil.regTween(self.goldGroup, self.goldText);

            TouchTweenUtil.regTween(self.serviceGroup, self.serviceBtn);
            TouchTweenUtil.regTween(self.identifyGroup, self.identifyBtn);

            TouchTweenUtil.regTween(self.joinGroup, self.joinBtn);
            TouchTweenUtil.regTween(self.createGroup, self.createBtn);
            TouchTweenUtil.regTween(self.createGroup, self.createText);

            TouchTweenUtil.regTween(self.createTHGroup, self.createTHBtn);
            TouchTweenUtil.regTween(self.createTHGroup, self.createTHText);

            TouchTweenUtil.regTween(self.joinTHGroup, self.joinTHBtn);
            TouchTweenUtil.regTween(self.joinTHGroup, self.joinTHText);

            TouchTweenUtil.regTween(self.addGoldGroup, self.addGoldBtn);
            TouchTweenUtil.regTween(self.addDiamondGroup, self.addDiamondBtn);

            TouchTweenUtil.regTween(self.settingGroup, this.settingBtn);
            TouchTweenUtil.regTween(self.helpGroup, this.helpBtn);
            // //初始化数据
            // this.initViewData();
            //调停者
            self._mediator = new LobbyBaseRedesignViewMediator(self);

            // APPSTORE屏蔽
            if (NativeBridge.IOSMask) {
                // self.clubGroup.parent && self.clubGroup.parent.removeChild(self.clubGroup);
                // self.elseGroup.horizontalCenter = 0;

                self.shareGroup.parent && self.shareGroup.parent.removeChild(self.shareGroup);
            }

            this.teaHouseDatagroup.useVirtualLayout = false;
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            let self = this;
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            //初始化数据
            self.initViewData();
            MvcUtil.regMediator(self._mediator);
            // 绑定金币属性，发生改变将回调
            BindManager.addAttrListener(vPlayerVO.gold.attrId, self.updateGoldNum, self);
            // 绑定钻石属性，发生改变将回调
            BindManager.addAttrListener(vPlayerVO.diamond.attrId, self.updateDiamondNum, self);
            //滚动公告显示
            let msgContent: string = LobbyData.anounceMsgText;
            self.showAnnounceMsg(msgContent, 1);
            self.sendJoinTHListMsg();
        }

        /**
         * 请求大厅茶楼列表数据
         */
        private sendJoinTHListMsg() {
            let msg = new ShowJoinTeaHouseListMsg();
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            msg.page = 1;
            msg.content = vPlayerVO.playerIndex.toString();
            console.log(msg);
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_SHOW_JOIN_TEAHOUSE_LIST_ACK);
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
                GWXAuth.setCircleWXHeadImg(self.headImg, vPlayerVO.headImageUrl, self.avatarGroup, 57, 55.3, 66 / 2);
                // GWXAuth.setRectWXHeadImg(self.headImg, vPlayerVO.headImageUrl);
            }
            else {
                //画一个遮罩
                let circle: egret.Shape = new egret.Shape();
                circle.graphics.beginFill(0xffffff);
                circle.graphics.drawCircle(57, 55.3, 66 / 2);
                circle.graphics.endFill();
                self.avatarGroup.addChild(circle);
                self.headImg.mask = circle;
                self.headImg.source = "headIcon_1_jpg";
                // GWXAuth.setCircleWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", self, 0, 0, 72 / 2);
                // GWXAuth.setRectWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0");
            }
            //---test
            // this.thData = [];
            // for (let i = 0; i < 20; i++) {
            //     let m = <ILobbyTHListItem>{};
            //     m.name = "我是你爸爸";
            //     m.id = "121231" + i;
            //     m.creatorName = "美上天的小仙女" + i;
            //     m.headImageUrl = "";
            //     this.thData.push(m);
            // }
            //---test
            this.initTeaHouseList();
        }

        /** 
         *初始化茶楼列表
         */
        private initTeaHouseList() {
            if (!this.teaHouseArrcollection) this.teaHouseArrcollection = new eui.ArrayCollection();
            this.teaHouseDatagroup.dataProvider = this.teaHouseArrcollection;
            let layout = new eui.VerticalLayout();
            layout.gap = 5;
            this.teaHouseDatagroup.layout = layout;
            this.teaHouseScroller.viewport = this.teaHouseDatagroup;
            this.teaHouseDatagroup.itemRenderer = LobbyTeaHouseListItemView;
            this.teaHouseScroller.scrollPolicyH = "off";
            this.refreshTHList();
        }

        /**
         * 刷新茶楼列表
         */
        public refreshTHList(data: ILobbyTHListItem[] = this.thData) {
            this.thData = data;
            this.teaHouseScroller.viewport.scrollV = 0;
            this.teaHouseArrcollection.replaceAll(data);
            this.teaHouseDatagroup.validateNow();
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
            // MvcUtil.send(AgentModule.AGENT_SHARE_INVITE_CODE);
            MvcUtil.addView(new ShareQrCodeView());
        }

        public showAnnounceMsg(text: string, isRmPreviousMsg: number): void {
            if (isRmPreviousMsg === 1) {
                this.msgLabel.text = text;
            } else {
                this.msgLabel.text = this.msgLabel.text + " " + text;
            }
            let srcPosx = 410;
            // this.scrollGroup.validateNow();
            if (!this.msgTween) {
                //每秒钟100像素
                let speedTime = (srcPosx + this.msgLabel.width) / 100 * 1000;
                this.msgTween = Game.Tween.get(this.msgLabel, { loop: true }).to({ x: srcPosx }).to({ x: 0 - this.msgLabel.width }, speedTime).wait(1000);
            }
        }

        protected onRemView(): void {
            if (this.msgTween) {
                Game.Tween.removeTweens(this.msgLabel);
                this.msgTween = null;
            }

        }
    }
}