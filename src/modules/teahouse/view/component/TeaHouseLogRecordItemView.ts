module FL {
    /** 茶楼战绩元素数据接口 */
    export interface ITHRecordItemData {
        // isReplay: boolean;//是否是回放
        roomID?: string;//房间id
        roomIndex?: number;//房间index
        shareID?: number;//分享id
        index?: number;//序号
        recordID?: any;//战绩编号
        end?: string;//战绩结束日期
        start?: string;//开始时间
        totalNum?: number;//总局数
        rules?: any;//玩法规则
        playerInfo: { id: any, name: string, score: number }[];//玩家显示信息数组;
        mainType: number;
    }

    /** 茶楼战绩---战绩元素视图 */
    export class TeaHouseLogRecordItemView extends eui.ItemRenderer {
        /** 序号 */
        private indexLab: eui.Label;

        /** 玩家1信息：（昵称：局数/分数） */
        private playerInfo1: eui.Label;
        /** 玩家2信息：（昵称：局数/分数） */
        private playerInfo2: eui.Label;
        /** 玩家3信息：（昵称：局数/分数） */
        private playerInfo3: eui.Label;
        /** 玩家4信息：（昵称：局数/分数） */
        private playerInfo4: eui.Label;

        /** 战绩显示组（一级页面） */
        private recordGroup: eui.Group;
        /** 战绩编号 */
        private recordID: eui.Label;
        /** 战绩日期 */
        private dateLab: eui.Label;

        /** 查看详情，回放（二级页面） */
        private replayBtn: GameButton;

        /** 房间信息（房间号，战绩时间，局数） */
        private roomLab: eui.Label;
        /** 玩法 */
        private wanfaLab: eui.Label;
        /** 玩家1信息组 */
        private playerGroup1: eui.Group;
        private playerName1: eui.Label;
        private playerScore1: eui.Label;
        /** 玩家2信息组 */
        private playerGroup2: eui.Group;
        private playerName2: eui.Label;
        private playerScore2: eui.Label;
        /** 玩家3信息组 */
        private playerGroup3: eui.Group;
        private playerName3: eui.Label;
        private playerScore3: eui.Label;
        /** 玩家4信息组 */
        private playerGroup4: eui.Group;
        private playerName4: eui.Label;
        private playerScore4: eui.Label;
        /** 查看局数 */
        // private numLab: eui.Label;
        private numInput: FL.NumberInput;
        /** 回放按钮 */
        private replayGroup: eui.Group;
        private replay: eui.Group;
        /** 分享按钮 */
        private shareGroup: eui.Group;
        private shareBtn: eui.Group;

        /** 数据源 */
        public data: ITHRecordItemData;
        constructor() {
            super();
            this.top = this.left = 0;
            this.right = this.bottom = 6;
            this.skinName = "skins.TeaHouseLogRecordItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.replayGroup, self.replay);
            TouchTweenUtil.regTween(self.shareGroup, self.shareBtn);
            //------
            // TouchTweenUtil.regTween(self.replayBtn, self.replayBtn);
            //注册监听事件
            self.replayGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onReplay, self);
            self.shareGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onShare, self);
            self.numInput.addEventListener(egret.TouchEvent.TOUCH_TAP, self.inputNum, self);
            //------
            // self.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showLogDetail, self);
            // self.replayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onReplay, self);
            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) return;
            this.showPlayerInfo();
            // this.dateLab.text = StringUtil.formatDate("yyyy-MM-dd hh:mm:ss", new Date(this.data.date));
            this.indexLab.text = "" + this.data.index;
            this.roomLab.text = "房间号:" + this.data.roomIndex + " " + this.data.start + "(" + this.data.totalNum + "局)"; // StringUtil.formatDate("yyyy-MM-dd hh:mm:ss", new Date(this.data.start)) + "(" + this.data.totalNum + "局)";
            this.numInput.text = "1";
            this.numInput.minValue = 1;
            // let wanfa = TeaHouseHandle.handleMinorRuleListData(this.data.rules, TeaHouseData.curPlayWay).join(" ");
            let minorRuleStr = GameHandler.handleMinorRuleListData(this.data.rules, this.data.mainType).shortStrArray.join(" ");
            let mainStr = TeaHouseHandle.handlePrimaryRuleData(this.data.mainType);
            this.wanfaLab.text = mainStr + "，" + minorRuleStr;
            //查看局数文本可编辑
            // this.numLab.touchEnabled = true;
            // this.numLab.type = egret.TextFieldType.INPUT;
            //----test
            // if (!this.data.isReplay) {
            //     //一级页面
            //     this.recordGroup.visible = true;
            //     this.replayBtn.visible = false;
            //     this.recordID.text = "战绩编号：" + this.data.id;
            //     this.dateLab.text = this.data.date;
            //     this.indexLab.text = "" + (this.data.index + 1);
            //     this.showPlayerInfo();
            // } else {
            //     //二级页面
            //     this.touchEnabled = false;//不可触摸
            //     this.recordGroup.visible = false;
            //     this.replayBtn.visible = true;
            //     this.indexLab.text = "" + (this.data.index + 1);
            //     this.showPlayerInfo();
            // }
        }

        /**
         * 显示输入数字页面
         */
        private inputNum() {
            if (!this.data) return;
            this.numInput.confirmBtnText = "确定";
            this.numInput.titleLabelText = "输入数字";
            let vNumberInputAreaView: NumberInputAreaView = new NumberInputAreaView(this.numInput, this.data.totalNum, 1);
            MvcUtil.addView(vNumberInputAreaView);
            vNumberInputAreaView.setValue(this.numInput.text);
        }

        /** 显示二级页面，即对应的战绩详情列表 */
        private showLogDetail() {

        }

        /** 显示玩家信息 */
        private showPlayerInfo() {
            //显示玩家信息，现在暂且以最多4人为准
            let i = 1;
            this.data.playerInfo.forEach(x => {
                if (this['playerGroup' + i]) {
                    this['playerGroup' + i].visible = true;
                    this['playerName' + i].text = StringUtil.subStrSupportChinese(x.name, 9, "..");
                    this['playerScore' + i].text = x.score;
                    this['playerScore' + i].textColor = x.score >= 0 ? "0xE04130" : "0x2D1B1A";
                    i++;
                }
            });
            for (; i < 5; ++i) {
                //剩余的隐藏
                if (this['playerGroup' + i]) this['playerGroup' + i].visible = false;
            }
            //--------
            // let i = 1;
            // this.data.playerInfo.forEach(x => { if (this['playerInfo' + i]) { this['playerInfo' + i].text = x; i++ } }, this);
            // for (; i < 5; ++i) {
            //     //剩余的隐藏
            //     if (this['playerInfo' + i]) this['playerInfo' + i].visible = false;
            // }
        }

        /** 查看详情，回放 */
        private onReplay() {
            let self = this;
            let vCheckMcNameRoleRegExp: RegExp = new RegExp("^[0-9]*$");
            let legal = vCheckMcNameRoleRegExp.test(self.numInput.text);
            if (legal) {
                let index: number = parseInt(self.numInput.text);
                if (index <= 0 || index > this.data.totalNum) {
                    PromptUtil.show("请输入数字1-" + this.data.totalNum + "！", PromptType.ERROR);
                    return;
                }
            } else {
                PromptUtil.show("请输入数字1-" + this.data.totalNum + "！", PromptType.ERROR);
                return;
            }
            let vGetPlayerGameLogMsg: GetPlayerGameLogMsg = new GetPlayerGameLogMsg();
            vGetPlayerGameLogMsg.gameTableID = "" + self.data.roomID;
            vGetPlayerGameLogMsg.handIndex = parseInt(self.numInput.text);
            vGetPlayerGameLogMsg.date = self.data.start.substr(0, 10).replace(/-/g, "");
            ServerUtil.sendMsg(vGetPlayerGameLogMsg);
            RecordView.lobbyRecord = false;
        }

        /** 分享 */
        private onShare() {
            if (TeaHouseData.teaHouseInfo.share) {
                let params = {
                    hasLeftBtn: true,
                    text: "该茶楼设置不允许分享"
                }
                ReminderViewUtil.showReminderView(params);
                return;
            }

            if (Game.CommonUtil.isNative) {
                let str = "战绩回放码：[" + this.data.shareID + "]【" + GConf.Conf.gameName + "】";
                let tipStr = "(复制此条消息粘贴到战绩回放码可播放他人对局)";
                str += tipStr;
                let jsonData = {
                    "eventType": SendNativeMsgType.SEND_NATIVE_SET_CLIPBOARD,
                    "data": {
                        "clipboardStr": str
                    }
                }
                NativeBridge.getInstance().sendNativeMessage(JSON.stringify(jsonData));

                MvcUtil.send(CommonModule.COMMON_NATIVE_OPEN_CHOOSE_ROAD);
            }
        }

        protected dataChanged() {
            this.initView();
        }
    }
}