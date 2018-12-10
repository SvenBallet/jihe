module FL {
    /** 茶楼布局页面 */
    export class TeaHouseLayoutView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseLayoutView;
        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TeaHouseLayoutViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;
        /** 调停者 */
        private _mediator: TeaHouseLayoutViewMediator;

        /** 关闭 */
        public closeGroup: eui.Group;
        private closeBtn: eui.Image;

        /** 一楼 */
        private titleLab1: eui.Label;//玩法标题
        private wanfaLab1: eui.Label;//玩法
        public joinBtnGroup1: eui.Group;
        public joinBtn1: eui.Image;//进入按钮

        /** 二楼 */
        private openGroup2: eui.Group;//开启按钮组
        private openBtn2: eui.Image;//开启按钮
        private showGroup2: eui.Group;//显示组
        private titleLab2: eui.Label;//玩法标题
        private wanfaLab2: eui.Label;//玩法
        public joinBtnGroup2: eui.Group;
        public joinBtn2: eui.Image;//进入按钮

        /** 三楼 */
        private openGroup3: eui.Group;//开启按钮组
        private openBtn3: eui.Image;//开启按钮
        private showGroup3: eui.Group;//显示组
        private titleLab3: eui.Label;//玩法标题
        private wanfaLab3: eui.Label;//玩法
        public joinBtnGroup3: eui.Group;
        public joinBtn3: eui.Image;//进入按钮

        /** 
         * 退出茶楼
         */
        public exitGroup: eui.Group;
        public exitBtn: eui.Image;

        /** 您的位置图示，表示当前所在楼层 */
        private curFloor: eui.Image;
        public curFloorGroup: eui.Group;


        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.TeaHouseLayoutViewSkin";
        }

        public static getInstance() {
            if (!this._onlyOne) {
                this._onlyOne = new TeaHouseLayoutView();
            }
            return this._onlyOne;
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.joinBtnGroup1, self.joinBtn1);
            TouchTweenUtil.regTween(self.openBtn2, self.openBtn2);
            TouchTweenUtil.regTween(self.joinBtnGroup2, self.joinBtn2);
            TouchTweenUtil.regTween(self.openBtn3, self.openBtn3);
            TouchTweenUtil.regTween(self.joinBtnGroup3, self.joinBtn3);
            TouchTweenUtil.regTween(self.curFloorGroup, self.curFloor);
            TouchTweenUtil.regTween(self.exitGroup, self.exitBtn);

            self._mediator = new TeaHouseLayoutViewMediator(self);
        }

        /** 添加到舞台自动调用 */
        protected onAddView() {
            let self = this;
            //注册调停者
            MvcUtil.regMediator(self._mediator);
            self.initView();
        }

        /** 初始化页面 */
        public initView() {
            //根据楼层数据以及权限显示页面 
            //一楼
            this.titleLab1.text = TeaHouseData.fstFloorData.teahouseLayerName;
            this.wanfaLab1.text = TeaHouseHandle.handlePrimaryRuleData(TeaHouseData.fstFloorData.primaryType,  TeaHouseData.fstFloorData.maxPlayersNum, TeaHouseData.fstFloorData.totalPlayCount);

            //二楼
            this.openGroup2.visible = false;
            this.showGroup2.visible = false;
            if (TeaHouseData.sndFloorData) {
                this.showGroup2.visible = true;
                this.titleLab2.text = TeaHouseData.sndFloorData.teahouseLayerName;
                this.wanfaLab2.text = TeaHouseHandle.handlePrimaryRuleData(TeaHouseData.sndFloorData.primaryType,  TeaHouseData.sndFloorData.maxPlayersNum, TeaHouseData.sndFloorData.totalPlayCount);

            } else {
                this.openGroup2.visible = true;
            }
            //三楼
            this.openGroup3.visible = false;
            this.showGroup3.visible = false;
            if (TeaHouseData.trdFloorData) {
                this.showGroup3.visible = true;
                this.titleLab3.text = TeaHouseData.trdFloorData.teahouseLayerName;
                // this.wanfaLab3.text = TeaHouseData.trdFloorData.playWay;
                this.wanfaLab3.text = TeaHouseHandle.handlePrimaryRuleData(TeaHouseData.trdFloorData.primaryType, TeaHouseData.trdFloorData.maxPlayersNum, TeaHouseData.trdFloorData.totalPlayCount);

            } else {
                this.openGroup3.visible = true;
            }
            this.showCurFloor();
            this.showJoinBtn();
            this.handleViewByPower();
        }

        /**
       * 根据权限显示页面
       */
        private handleViewByPower() {
            if (TeaHouseData.curPower == ETHPlayerPower.MEMBER) {
                this.exitGroup.visible = true;
            } else {
                this.exitGroup.visible = false;
            }
        }

        /** 显示当前位置 */
        private showCurFloor() {
            let y = 0;
            switch (TeaHouseData.curFloor) {
                case 1:
                    y = 455;
                    break;
                case 2:
                    y = 307;
                    break;
                case 3:
                    y = 155;
                    break;
            }
            this.curFloorGroup.y = y;
        }

        /** 显示进入按钮 */
        private showJoinBtn() {
            this.joinBtnGroup1.visible = true;
            this.joinBtnGroup2.visible = true;
            this.joinBtnGroup3.visible = true;
            //当前所在楼层的进入按钮隐藏
            if (this["joinBtnGroup" + TeaHouseData.curFloor]) this["joinBtnGroup" + TeaHouseData.curFloor].visible = false;
        }
    }
}