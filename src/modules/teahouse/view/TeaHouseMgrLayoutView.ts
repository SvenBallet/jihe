module FL {
    /** 茶楼管理---茶楼布局页面 */
    export class TeaHouseMgrLayoutView extends eui.Component {

        /** 打烊按钮 */
        private offBtn: eui.Image;
        /** 销毁茶楼按钮 */
        private destroyBtn: eui.Image;

        /** 一楼 */
        private titleLab1: eui.Label;//玩法标题
        private wanfaLab1: eui.Label;//玩法
        private changeBtnGroup1: eui.Group;
        private changeBtn1: eui.Image;//修改按钮

        /** 二楼 */
        private openGroup2: eui.Group;//开启按钮组
        private openBtnGroup2: eui.Group;
        private openBtn2: eui.Image;//开启按钮

        private showGroup2: eui.Group;//显示组
        private titleLab2: eui.Label;//玩法标题
        private wanfaLab2: eui.Label;//玩法
        private changeBtnGroup2: eui.Group;
        private changeBtn2: eui.Image;//修改按钮
        private delBtnGroup2: eui.Group;
        private delBtn2: eui.Image;//删除按钮

        /** 三楼 */
        private openGroup3: eui.Group;//开启按钮组
        private openBtnGroup3: eui.Group;
        private openBtn3: eui.Image;//开启按钮
        private showGroup3: eui.Group;//显示组
        private titleLab3: eui.Label;//玩法标题
        private wanfaLab3: eui.Label;//玩法
        private delBtnGroup3: eui.Group;
        private changeBtnGroup3: eui.Group;
        private changeBtn3: eui.Image;//修改按钮
        private delBtn3: eui.Image;//删除按钮

        /** 删除层数 */
        private flag_delFloor: number = 2;
        constructor() {
            super();
            this.top = this.left = this.right = 0;
            this.bottom = 20;
            this.skinName = "skins.TeaHouseMgLayoutViewSkin";
        }

        protected childrenCreated() {
            let self = this;

            /**注册缓动事件 */
            TouchTweenUtil.regTween(self.offBtn, self.offBtn);
            TouchTweenUtil.regTween(self.destroyBtn, self.destroyBtn);
            TouchTweenUtil.regTween(self.changeBtnGroup1, self.changeBtn1);
            TouchTweenUtil.regTween(self.openBtnGroup2, self.openBtn2);
            TouchTweenUtil.regTween(self.changeBtnGroup2, self.changeBtn2);
            TouchTweenUtil.regTween(self.delBtnGroup2, self.delBtn2);
            TouchTweenUtil.regTween(self.openBtnGroup3, self.openBtn3);
            TouchTweenUtil.regTween(self.changeBtnGroup3, self.changeBtn3);
            TouchTweenUtil.regTween(self.delBtnGroup3, self.delBtn3);

            //注册监听事件
            self.offBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onOff, self);
            self.destroyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onDestroy, self);
            self.changeBtnGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onChange, self);
            self.changeBtnGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onChange, self);
            self.changeBtnGroup3.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onChange, self);
            self.delBtnGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onDel, self);
            self.delBtnGroup3.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onDel, self);
            self.openBtnGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onOpen, self);
            self.openBtnGroup3.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onOpen, self);

            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            //根据楼层数据以及权限显示页面            
            //一楼
            this.titleLab1.text = TeaHouseData.fstFloorData.teahouseLayerName;
            this.wanfaLab1.text = TeaHouseHandle.handlePrimaryRuleData(TeaHouseData.fstFloorData.primaryType, TeaHouseData.fstFloorData.maxPlayersNum, TeaHouseData.fstFloorData.totalPlayCount);
            // this.wanfaLab1.text = TeaHouseData.fstFloorData.playWay;
            //二楼
            this.openGroup2.visible = false;
            this.showGroup2.visible = false;
            if (TeaHouseData.sndFloorData) {
                this.showGroup2.visible = true;
                this.titleLab2.text = TeaHouseData.sndFloorData.teahouseLayerName;
                this.wanfaLab2.text = TeaHouseHandle.handlePrimaryRuleData(TeaHouseData.sndFloorData.primaryType, TeaHouseData.sndFloorData.maxPlayersNum, TeaHouseData.sndFloorData.totalPlayCount);
                // this.wanfaLab2.text = TeaHouseData.sndFloorData.playWay;

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
            this.changeOffBtnState();
        }

        private changeOffBtnState() {
            //打烊按钮状态
            let flag = TeaHouseData.isOff;
            this.offBtn.source = (flag) ? "ON_png" : "OFF_png";
        }

        /** 打烊/关闭打烊 */
        private onOff() {
            if (TeaHouseData.curPower == ETHPlayerPower.MEMBER) {
                PromptUtil.show("权限不足，老板专用", PromptType.ERROR);
                return;
            }
            let flag = TeaHouseData.isOff;
            this.offBtn.source = (flag) ? "ON_png" : "OFF_png";
            if (!flag) {
                MvcUtil.addView(new TeaHouseLeaveMsgView());
            }
            else {
                //开启
                let msg = new OptTeaHouseStateMsg();
                msg.teaHouseId = TeaHouseData.curID;
                msg.operationType = OptTeaHouseStateMsg.TYPE_ON_TEA_HOUSE;
                ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_STATE_ACK);
            }
        }

        /** 销毁茶楼 */
        private onDestroy() {
            if (TeaHouseData.curPower != ETHPlayerPower.CREATOR) {
                PromptUtil.show("权限不足，老板专用", PromptType.ERROR);
                return;
            }
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.confirmDestroy, this),
                hasRightBtn: true,
                text: "您确定销毁茶楼吗？"
            })
        }

        /** 修改茶楼玩法设置 */
        private onChange(e: egret.TouchEvent) {
            let num;
            if (e.currentTarget == this.changeBtnGroup1) {
                num = 1;
            } else if (e.currentTarget == this.changeBtnGroup2) {
                num = 2;
            } else {
                num = 3;
            }
            // let view = TeaHouseAlterRulesView.getInstance();
            // let floorData: TeaHouseLayer = TeaHouseData[EFloorData[num]];
            // MvcUtil.addView(view);
            // view.initView(floorData.primaryType, floorData.minorGamePlayRuleList, num);

            let floorData: TeaHouseLayer = TeaHouseData[EFloorData[num]];
            let crv = new LobbyCreateGameView();
            crv.setBottomView(ELobbyCreateType.TeaHouseChange);
            MvcUtil.addView(crv);
            crv.setTeaHouseRule(floorData.primaryType, floorData.minorGamePlayRuleList, num);
        }

        /** 
         * 删除楼层
         */
        private onDel(e: egret.TouchEvent) {
            if (TeaHouseData.curPower != ETHPlayerPower.CREATOR) {
                PromptUtil.show("权限不足，老板专用", PromptType.ERROR);
                return;
            }
            if (e.currentTarget == this.delBtnGroup2) {
                this.flag_delFloor = 2;
            } else {
                this.flag_delFloor = 3;
            }
            ReminderViewUtil.showReminderView({
                hasLeftBtn: true,
                leftCallBack: new MyCallBack(this.confirmDel, this),
                hasRightBtn: true,
                text: "您确定要删除该楼层吗？"
            })

        }

        /** 确认删除 */
        private confirmDel() {
            let msg = new DeleteTeaHouseLayerMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.teahouseLayerNum = this.flag_delFloor;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_TEAHOUSE_LAYER_LIST_ACK);
        }
        /**
         * 开启新楼层
         */
        private onOpen() {
            if (TeaHouseData.curPower != ETHPlayerPower.CREATOR) {
                PromptUtil.show("权限不足，老板专用", PromptType.ERROR);
                return;
            }
            let crv = new LobbyCreateGameView();
            crv.setBottomView(ELobbyCreateType.Floor);
            MvcUtil.addView(crv);
        }


        /** 确定销毁 */
        private confirmDestroy() {
            let msg = new OptTeaHouseStateMsg();
            msg.teaHouseId = TeaHouseData.curID;
            msg.operationType = OptTeaHouseStateMsg.TYPE_DESTROY_TEA_HOUSE;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_OPT_TEAHOUSE_STATE_ACK);
        }
    }
}