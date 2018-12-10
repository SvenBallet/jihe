module FL {
    /** 茶楼邀请界面 */
    export class TeaHouseInviteView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseInviteView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "TeaHouseInviteViewMediator";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;
        /** 调停者 */
        private _mediator: TeaHouseInviteViewMediator;

        /** 详情信息数据源 */
        private arrCollection: eui.ArrayCollection;

        public baseGroup:eui.Group;
        public inviteGro:eui.Group;
        public inviteBtn:eui.Group;
        public inviteBtnGray:eui.Group;
        public playerList:eui.List;
        public titleLab:eui.Label;
        public closeGroup:eui.Group;
        public closeBtn:eui.Image;
        public noLab:eui.Label;

        /** 当前数据源 */
        public data: Array<TeaHouseMember>;
        /** 茶楼ID */
        public static teahouseId: number;
        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = skins.TeaHouseInivteViewSkin;
        }

        public static getInstance() {
            if (!this._onlyOne) {
                this._onlyOne = new TeaHouseInviteView();
            }
            return this._onlyOne;
        }

        protected childrenCreated() {
            let self = this;
            //注册触摸缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.inviteBtn, self.inviteBtn);

            self._mediator = new TeaHouseInviteViewMediator(self);
            this.playerList.useVirtualLayout = false;
        }

        /** 添加到界面框架自动调用 */
        protected onAddView() {
            let self = this;
            //注册调停者
            MvcUtil.regMediator(self._mediator);
        }

        /** 初始化页面 */
        public initView(data: Array<TeaHouseMember>, teahouseId: number) {
            this.noLab.visible = false;
            this.inviteGro.visible = true;
            TeaHouseInviteView.teahouseId = teahouseId;
            this.data = data;
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.playerList.dataProvider = this.arrCollection;
            this.playerList.itemRenderer = TeaHouseInviteItem;

            if (!data || (data && data.length < 1)) {
                this.noLab.visible = true;
                this.inviteGro.visible = false;
            }

            this.refreshView();
            this.refreshInviteBtn();
        }

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.arrCollection.replaceAll(data);
            this.playerList.validateNow();
        }

        /** 一键邀请状态 */
        public refreshInviteBtn(grayFlag: boolean = false) {
            this.inviteBtn.visible = !grayFlag;
            this.inviteBtnGray.visible = grayFlag;
        }
    }
}