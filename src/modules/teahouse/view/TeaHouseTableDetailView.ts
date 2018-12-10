module FL {
    /** 茶楼桌子详情页面 */
    export class TeaHouseTableDetailView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseTableDetailView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "TeaHouseTableDetailViewMediator";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;
        /** 调停者 */
        private _mediator: TeaHouseTableDetailViewMediator;
        /** 关闭按钮组 */
        public closeGroup: eui.Group;
        private closeBtn: eui.Image;

        /** 详情信息数据源 */
        private arrCollection: eui.ArrayCollection;
        /** 详情显示组 */
        private dataGroup: eui.DataGroup;

        public btnGro:eui.Group;
        public disGro:eui.Group;
        public dissBtn:eui.Group;
        public joinGro:eui.Group;
        public joinBtn:eui.Group;
        public inviteGro:eui.Group;
        public inviteBtn:eui.Group;
        public titleLab:eui.Label;
        public titleImg:eui.Image;

        /** 当前桌子信息 */
        public curTableInfo: ITHTableItem;
        /** 当前桌子序号 */
        public flag_index: number;
        /** 当前数据源 */
        public data: ITHPlayerInfo[];
        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = skins.TeaHouseTableDetailViewSkin_n;
        }

        // public static getInstance() {
        //     if (!this._onlyOne) {
        //         this._onlyOne = new TeaHouseTableDetailView();
        //     }
        //     return this._onlyOne;
        // }

        protected childrenCreated() {
            let self = this;
            //注册触摸缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.dissBtn, self.dissBtn);
            TouchTweenUtil.regTween(self.joinBtn, self.joinBtn);
            TouchTweenUtil.regTween(self.inviteBtn, self.inviteBtn);

            self._mediator = new TeaHouseTableDetailViewMediator(self);
        }

        /** 添加到界面框架自动调用 */
        protected onAddView() {
            let self = this;
            //注册调停者
            MvcUtil.regMediator(self._mediator);
        }

        /** 初始化页面 */
        public initView(data?: ITHPlayerInfo[], index?: number, tableInfo?: ITHTableItem) {
            this.data = data;
            this.flag_index = index;
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            this.dataGroup.dataProvider = this.arrCollection;
            this.dataGroup.itemRenderer = TeaHouseTableDetailItemView;

            //解散桌子显示
            if (TeaHouseData.curPower == ETHPlayerPower.CREATOR || TeaHouseData.curPower == ETHPlayerPower.MANAGER) {
                this.btnGro.addChildAt(this.disGro, 1);
            } else {
                this.disGro.parent && this.disGro.parent.removeChild(this.disGro);
            }

            // 加入和邀请显示
            let Fullflag = true;
            for (let i = 0;i < this.data.length;i ++) {
                if (!this.data[i].info) {
                    Fullflag = false;
                    break;
                }
            }
            if (!Fullflag) {
                this.btnGro.addChildAt(this.joinGro, 2);
                this.btnGro.addChildAt(this.inviteGro, 3);
            }
            else {
                this.joinGro.parent && this.joinGro.parent.removeChild(this.joinGro);
                this.inviteGro.parent && this.inviteGro.parent.removeChild(this.inviteGro);
            }

            this.curTableInfo = tableInfo;
            this.titleLab.text = "牌桌ID:" + (tableInfo.id || "");
            this.titleImg.visible = false;
            this.titleLab.visible = true;

            this.refreshView();
        }

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.arrCollection.replaceAll(data);
            this.dataGroup.validateNow();
        }
    }
}