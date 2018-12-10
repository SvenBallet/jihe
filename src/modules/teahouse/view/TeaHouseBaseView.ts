module FL {
    /** 茶楼基础显示页（茶楼大堂） */
    export class TeaHouseBaseView extends BaseView {
        /** 单例 */
        private static _onlyOne: TeaHouseBaseView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = TeaHouseBaseViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;
        /** 调停者 */
        private _mediator: TeaHouseBaseViewMediator;

        public bgImg:eui.Image;
        public playerGroup:eui.Group;
        public diamondNum:eui.Label;
        public addDiamondGroup:eui.Group;
        public addDiamondBtn:eui.Image;
        public playerNameLabel:eui.Label;
        public avatarGroup:eui.Group;
        public avatarBtn:eui.Image;
        public headImg:eui.Image;
        public shareGroup:eui.Group;
        public shareBtn:eui.Image;
        public wanfaGroup:eui.Group;
        public wanfaBtn:eui.Image;
        public settingGroup:eui.Group;
        public settingBtn:eui.Image;
        public titleLab:eui.Label;
        public titleIDshadow:eui.Label;
        public titleID:eui.Label;
        public closeGroup:eui.Group;
        public closeBtn:eui.Image;
        public tableGroup1:eui.DataGroup;
        public tableGroup0:eui.DataGroup;
        public bottomGroup:eui.Group;
        public manageGroup:eui.Group;
        public manageBtn:eui.Image;
        public memberGroup:eui.Group;
        public memberBtn:eui.Image;
        public recordGroup:eui.Group;
        public recordBtn:eui.Image;
        public layoutGroup:eui.Group;
        public layoutBtn:eui.Image;
        public quickGro:eui.Group;
        public quickImg:eui.Image;
        public noticeScroller:eui.Scroller;
        public msgLabel:eui.Label;
        public floorLab:eui.Label;
        public downstairsGroup:eui.Group;
        public downstairsBtn:eui.Image;
        public upstairsGroup:eui.Group;
        public upstairsBtn:eui.Image;

        /** 申请列表红点 */
        public redPonit: eui.Group;

        public tableScroller: eui.Scroller;
        /** 桌子显示数据源 */
        private arrCollection: eui.ArrayCollection;
        /** 当前桌子显示 */
        public curTableGroup: eui.DataGroup;

        /** 桌子左右翻页 */
        public rightGroup: eui.Group;
        private rightBtn: eui.Image;
        public leftGroup: eui.Group;
        private leftBtn: eui.Image;

        /** 桌子数据源 */
        /** 当前数据 */
        private currData: ITHTableItem[] = [];
        /** 下一个数据 */
        private nextData: ITHTableItem[] = [];
        private msgTween: Game.Tween;

        private constructor() {
            super();
            this.top = this.bottom = this.left = this.right = 0;
            this.skinName = "skins.TeaHouseBaseSkin";

        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.wanfaGroup, self.wanfaBtn);
            TouchTweenUtil.regTween(self.shareGroup, self.shareBtn);
            TouchTweenUtil.regTween(self.settingGroup, self.settingBtn);
            TouchTweenUtil.regTween(self.addDiamondGroup, self.addDiamondBtn);

            TouchTweenUtil.regTween(self.manageGroup, self.manageBtn);
            TouchTweenUtil.regTween(self.layoutGroup, self.layoutBtn);
            TouchTweenUtil.regTween(self.recordGroup, self.recordBtn);
            TouchTweenUtil.regTween(self.memberGroup, self.memberBtn);
            TouchTweenUtil.regTween(self.quickGro, self.quickImg);

            // TouchTweenUtil.regTween(self.leftGroup, self.leftBtn);
            // TouchTweenUtil.regTween(self.rightGroup, self.rightBtn);

            TouchTweenUtil.regTween(self.downstairsGroup, self.downstairsBtn);
            TouchTweenUtil.regTween(self.upstairsGroup, self.upstairsBtn);

            /** 调停者 */
            self._mediator = new TeaHouseBaseViewMediator(self);
        }

        public static getInstance(): TeaHouseBaseView {
            if (!this._onlyOne) {
                this._onlyOne = new TeaHouseBaseView();
            }
            return this._onlyOne;
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView() {
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            let self = this;
            //绑定个人钻石属性，发生改变将回调
            BindManager.addAttrListener(vPlayerVO.diamond.attrId, self.updateDiamondNum, self);
            //注册调停者
            MvcUtil.regMediator(self._mediator);
            /** 初始化页面 */
            self.initView();
        }

        /** 界面移除框架自动调用 */
        protected onRemView() {
            // console.log('rem th');
            this.sendEixtMsg();
            // 存储当前楼层数 （换到进入茶楼处）
            // egret.localStorage.setItem("th_previous_floor_" + TeaHouseData.curID, "" + TeaHouseData.curFloor);
            //清除茶楼数据
            TeaHouseHandle.clearTHData();
            //清除大厅红点
            if (this.redPonit && this.redPonit.parent) this.redPonit.parent.removeChild(this.redPonit);
        }

        /** 发送退出茶楼消息 */
        private sendEixtMsg() {
            let msg = new ExitTeaHouseLayerMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = TeaHouseData.curFloor;
            ServerUtil.sendMsg(msg);
        }

        /** 刷新页面 */
        public refreshView(data = this.currData) {
            //刷新桌子
            this.refreshTable(data);
            //刷新标题
            this.setTHInfo();
            //刷新滚动公告
            this.showAnnounceMsg(TeaHouseData.anounceMsgText, 1);
            //是否能上下楼
            this.isCanChangeFloor();
            //根据权限显示页面
            this.handleViewByPower();
            /** 刷新红点 */
            this.drawRedPoint(TeaHouseData.curApplyCount);
        }

        /** 初始化页面 */
        private initView() {
            let self = this;
            let vPlayerVO: PlayerVO = LobbyData.playerVO;
            //玩家昵称
            this.playerNameLabel.text = StringUtil.subStrSupportChinese(vPlayerVO.playerName, 12, "...") + "("+ vPlayerVO.playerIndex +")";
            // APPSTORE屏蔽
            if (NativeBridge.IOSMask) {
                self.noticeScroller.visible = false;
            }
            //设置头像
            if (GConf.Conf.useWXAuth) {
                GWXAuth.setCircleWXHeadImg(self.headImg, vPlayerVO.headImageUrl, self.avatarGroup, 57, 55.3, 66 / 2);
            }
            //设置当前桌子显示组
            this.curTableGroup = this.tableGroup0;

            this.initTable();
            this.refreshView();
            this.handleViewByPower();
        }

        /** 
         * 根据玩家权限处理页面
         */
        private handleViewByPower() {
            switch (TeaHouseData.curPower) {
                case ETHPlayerPower.CREATOR:
                    //只有老板有帮助按钮
                    // this.helpGroup.visible = true;
                    //只有老板可以添加茶楼钻石
                    // this.thAddDiamondGroup.visible = true;
                    break;
                case ETHPlayerPower.MANAGER:
                    break;
                case ETHPlayerPower.MEMBER:
                    break;
                case ETHPlayerPower.ILLEGAL:
                    break;
            }
        }

        /** 是否能上下楼 */
        private isCanChangeFloor() {
            this.upstairsGroup.visible = true;
            this.downstairsGroup.visible = true;
        }

        /** 设置茶楼信息 */
        private setTHInfo() {
            let info = TeaHouseData.teaHouseInfo;
            let name = info.name;
            let id = info.id;
            this.titleLab.text = StringUtil.subStrSupportChinese(name, 12, "...") + "";
            this.floorLab.text = (TeaHouseData.curFloor || 1) + "";
            this.titleID.text = "(ID：" + id + ")";
            this.titleIDshadow.text = "(ID：" + id + ")";
            this.updateTHDiamond();
        }

        /** 更新茶楼钻石 */
        public updateTHDiamond() {
        }

        /**
     * 绘制申请列表红点
     */
        public drawRedPoint(data: number) {
            if (this.redPonit) {//移除已有的红点，重新绘制
                if (this.redPonit.parent) this.redPonit.parent.removeChild(this.redPonit);
                this.redPonit = null;
                return this.drawRedPoint(data);
            }
            if (!data) return;
            let op = <IRedPointOptions>{};
            op.useText = true;
            op.text = "" + data;
            op.textSize = 20;
            op.radius = 15;
            let g = RedPointUtil.drawRedPoint(op);
            g.x = this.memberGroup.x + 150;
            g.y = this.memberGroup.y+15;
            this.redPonit = g;
            this.bottomGroup.addChild(this.redPonit);
        }


        /** 
         * 初始化桌子
         */
        private initTable() {
            this.initCurrTableData();
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            let tile = new eui.TileLayout();
            tile.requestedRowCount = 2;
            tile.requestedColumnCount = 3;
            tile.verticalGap = -30;
            tile.columnAlign = eui.ColumnAlign.JUSTIFY_USING_GAP;
            this.curTableGroup.dataProvider = this.arrCollection;
            this.curTableGroup.itemRenderer = TeaHouseTableItemView;
            this.curTableGroup.layout = tile;
        }

        /** 处理当前桌子数据 */
        private initCurrTableData() {
            //找到第一个空座位
            let curEmp = 0;
            let isEmp = false;
            let isAllSeated = true;
            for (let i = 0; i < TeaHouseData.curTable.length; ++i) {
                if (!TeaHouseData.curTable[i].id) {//第一个空桌子
                    curEmp = i;
                    isEmp = true;
                    break;
                }
                TeaHouseData.curTable[i].infos.forEach(x => {
                    if (!x) isAllSeated = false;
                })
                if (!isAllSeated) {
                    curEmp = i;
                    break;
                }
            }
            if (!isEmp && isAllSeated) {
                curEmp = TeaHouseData.curTable.length;
            }
            // for (let i = 0; i < TeaHouseData.teaHouseTableList.length; ++i) {
            //     if (TeaHouseData.teaHouseTableList[i].playerList.length != TeaHouseData.teaHouseTableList[i].totalPlNum) {
            //         curEmp = i;
            //         isAllSeated = false;
            //         break;
            //     }
            // }
            let max = curEmp + (6 - curEmp % 6);//理论上的显示最大空桌序号
            TeaHouseData.curMaxTableIndex = max - 6;
            this.currData = [];
            for (let i = TeaHouseData.curMaxTableIndex; i < TeaHouseData.curMaxTableIndex + 6; ++i) {
                if (TeaHouseData.curTable[i]) {
                    this.currData.push(TeaHouseData.curTable[i]);
                } else {
                    let table = <ITHTableItem>{};
                    table.index = i + 1;
                    table.totalNum = TeaHouseData.curPlayerNum;
                    table.infos = TeaHouseHandle.handleTableInfoData(null, i + 1, table.totalNum);
                    table.isBegin = false;
                    this.currData.push(table);
                }
            }
            TeaHouseData.curMaxTableIndex += 6;
        }

        /** 刷新桌子 */
        public refreshTable(data = this.currData) {
            this.currData = data;
            this.isCanTurnTable();
            this.arrCollection.replaceAll(this.currData);
            this.curTableGroup.validateNow();
        }

        /** 
         * 根据当前的桌子情况确定是否能够翻页并决定显示箭头与否
         */
        private isCanTurnTable() {
            this.leftGroup.visible = false;
            this.rightGroup.visible = false;
            if (TeaHouseData.curMaxTableIndex >= TeaHouseData.maxTableIndex) {
                //当前显示的桌子序号大于等于当前楼层已有的最大桌子序号，则需要看是否空桌子是否大于等3，否就需要翻页
                let emptyNum = 0;
                for (let i = 0; i < TeaHouseData.curTable.length; i++) {
                    if (!TeaHouseData.curTable[i].id) {
                        emptyNum++;
                    }
                    if (emptyNum >= 3) {
                        break;
                    }
                }
                if (emptyNum < 3) {
                    this.rightGroup.visible = true;
                }
                if (TeaHouseData.curMaxTableIndex - TeaHouseData.maxTableIndex >= 6) {
                    this.rightGroup.visible = false;
                }
                if (TeaHouseData.curMaxTableIndex > 6) this.leftGroup.visible = true;
                //代理才能无限开启牌桌
                let playerVO: PlayerVO = LobbyData.playerVO;
                if (playerVO.playerType < 3) {
                    if (TeaHouseData.curMaxTableNum == TeaHouseData.curMaxTableIndex) {
                        this.rightGroup.visible = false;
                    }
                }
            } else {
                //当前显示的桌子序号小于当前楼层已有的最大桌子序号，则需要判断当前桌子序号是否是边界值，不是的话就需要翻页
                if (TeaHouseData.curMaxTableIndex - 6 > 0) {
                    this.leftGroup.visible = true;
                }
                this.rightGroup.visible = true;
            }
        }

        /** 桌子翻页 */
        public nextTable(data = this.nextData, flag: boolean) {
            //----test
            console.log("nextTable");
            this.nextData = data;
            //动画结束前禁止触摸事件
            this.leftGroup.touchEnabled = false;
            this.rightGroup.touchEnabled = false;
            let arrCollection = new eui.ArrayCollection(data);
            let tile = new eui.TileLayout();
            tile.requestedRowCount = 2;
            tile.requestedColumnCount = 3;
            tile.verticalGap = -30;
            tile.columnAlign = eui.ColumnAlign.JUSTIFY_USING_GAP;
            let nextGorup: eui.DataGroup;
            nextGorup = (this.curTableGroup === this.tableGroup0) ? this.tableGroup1 : this.tableGroup0;
            nextGorup.horizontalCenter = (flag) ? -this.width : this.width;
            ViewUtil.addChildAfter(this, nextGorup, this.bottomGroup);
            nextGorup.dataProvider = arrCollection;
            nextGorup.itemRenderer = TeaHouseTableItemView;
            nextGorup.layout = tile;
            let end = (flag) ? this.width : -this.width;
            Game.Tween.get(nextGorup).to({ horizontalCenter: 0 }, 500, Game.Ease.circOut);
            Game.Tween.get(this.curTableGroup).to({ horizontalCenter: end }, 500, Game.Ease.circOut)
                .call((data, viewGroup, arrCollection) => {
                    if (this.curTableGroup.parent) this.curTableGroup.parent.removeChild(this.curTableGroup);
                    this.currData = data;
                    this.curTableGroup = viewGroup;
                    this.arrCollection = arrCollection;
                    //动画结束后开启触摸事件
                    this.leftGroup.touchEnabled = true;
                    this.rightGroup.touchEnabled = true;
                    this.isCanTurnTable();
                }, this, [data, nextGorup, arrCollection]);
        }

        /**
         * 更新钻石属性
         * @param {number} diamondNum
         */
        private updateDiamondNum(diamondNum: number): void {
            this.diamondNum.text = "" + diamondNum;
        }

        /** 跑马灯 */
        public showAnnounceMsg(text: string, isRmPreviousMsg: number): void {
            if (isRmPreviousMsg === 1) {
                this.msgLabel.text = text;
            } else {
                this.msgLabel.text = this.msgLabel.text + " " + text;
            }
            let srcPosx = this.noticeScroller.width;
            //每秒钟100像素
            let speedTime = (srcPosx + this.msgLabel.width) / 100 * 1000;
            if (this.msgTween) {
                Game.Tween.removeTweens(this.msgLabel);
            }
            this.msgTween = Game.Tween.get(this.msgLabel, { loop: true })
                .to({ x: srcPosx })
                .to({ x: 0 - this.msgLabel.width - srcPosx }, speedTime).wait(1000);
        }
    }
}