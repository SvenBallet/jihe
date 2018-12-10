module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - DissolveRoomView
     * @Description:  //解散房间界面
     * @Create: DerekWu on 2017/12/11 14:57
     * @Version: V1.0
     */
    export class DissolveRoomView extends BaseView {

        /** 单例 */
        private static _onlyOne:DissolveRoomView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        /** 关闭按钮 */
        public closeBtn:eui.Group;

        /** 玩家信息 */
        public playerInfoGroup:eui.Group;
        public firstPlayerItem:DissolveRoomItem;
        public secondPlayerItem:DissolveRoomItem;
        public thirdPlayerItem:DissolveRoomItem;
        public firstLine:eui.Image;
        public secondLine:eui.Image;

        /** 同意 和 拒绝 按钮 */
        public agreeBtn:GameButton;
        public rejectBtn:GameButton;

        /** 解散描述 */
        public dissolveDesc:eui.Label;
        /** 时间 */
        public timeLabel:eui.Label;

        /** 定时器 */
        private _timeTickerTimer:Game.Timer;
        /** 倒计时剩余时间（秒） */
        private _leftTimes:number;

        /** 显示条目数 */
        private _viewItemNum:number;

        /** 我的条目 */
        private _myPlayerItem:DissolveRoomItem;

        private constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.DissolveRoomViewSkin";
            //不可触摸
            this.touchEnabled = false;
        }

        public static getInstance():DissolveRoomView {
            if (!this._onlyOne) {
                this._onlyOne = new DissolveRoomView();
            }
            return this._onlyOne;
        }

        protected createChildren():void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeBtn, self.closeBtn);
            TouchTweenUtil.regTween(self.agreeBtn, self.agreeBtn);
            TouchTweenUtil.regTween(self.rejectBtn, self.rejectBtn);
            //注册按钮点击事件
            self.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.close, self);
            self.agreeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.agree, self);
            self.rejectBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.reject, self);
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            this.startTickerTimer();
        }

        /** 从界面移除以后框架自动调用 */
        protected onRemView():void {
            this.stopTickerTimer();
        }

        /**
         * 重置界面
         * @param {FL.SimplePlayer[]} playerArray
         */
        public resetView(playerArray:SimplePlayer[]):void {
            let self = this;
            //设置相应值
            self._viewItemNum = playerArray.length;
            //设置
            self._myPlayerItem = null;

            //第一二三个玩家
            let vSimplePlayerIndex0:SimplePlayer = playerArray[0];
            let vSimplePlayerIndex1:SimplePlayer = playerArray[1];
            let vSimplePlayerIndex2:SimplePlayer = playerArray[2];
            //设置第一个
            self.resetPlayerItem(self.firstPlayerItem, vSimplePlayerIndex0);
            //设置第三个
            if (vSimplePlayerIndex2) {
                ViewUtil.addChild(self.playerInfoGroup, self.secondLine);
                ViewUtil.addChild(self.playerInfoGroup, self.thirdPlayerItem);
                self.resetPlayerItem(self.thirdPlayerItem, vSimplePlayerIndex2);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.thirdPlayerItem);
                ViewUtil.removeChild(self.playerInfoGroup, self.secondLine);
            }
            //设置第二个
            if (vSimplePlayerIndex1) {
                ViewUtil.addChild(self.playerInfoGroup, self.firstLine);
                ViewUtil.addChild(self.playerInfoGroup, self.secondPlayerItem);
                self.resetPlayerItem(self.secondPlayerItem, vSimplePlayerIndex1);
            } else {
                ViewUtil.removeChild(self.playerInfoGroup, self.secondPlayerItem);
                ViewUtil.removeChild(self.playerInfoGroup, self.firstLine);
            }

        }

        /**
         * 重置条目
         * @param {FL.DissolveRoomItem} dissolveRoomItem
         * @param {FL.SimplePlayer} simplePlayer
         */
        private resetPlayerItem(dissolveRoomItem:DissolveRoomItem, simplePlayer:SimplePlayer):void {
            dissolveRoomItem.resetItem(simplePlayer.headImgUrl, simplePlayer.playerName);
            if (MJGameHandler.getTablePos(PZOrientation.DOWN) === simplePlayer.tablePos) {
                this._myPlayerItem = dissolveRoomItem;
            }
        }

        /** 开始倒计时时间(这两个属性用来处理进入后台后时间不走的问题) */
        private _startCountBackwardsTimes:number = 0;
        /** 开始的剩余时间 */
        private _startLeftTimes:number = 0;

        /**
         * 初始化剩余时间
         * @param {number} leftTimes
         */
        public initLeftTimes(leftTimes:number):void {
            this._leftTimes = leftTimes;
            this._startLeftTimes = leftTimes;
            this._startCountBackwardsTimes = Date.now();
            //设置时间
            if (this._leftTimes >= 0) {
                this.timeLabel.text = ""+this._leftTimes;
            } else {
                this.timeLabel.text = "0";
            }
        }

        /**
         * 更新状态 和 描述
         * @param {number[]} stateArray
         * @param {string} desc
         */
        public updateStateAndDesc(stateArray:number[], desc:string):void {
            let self = this;
            //描述
            self.dissolveDesc.text = desc+", 等待其他玩家选择，超过[180]秒未做选择，则默认同意！";
            //一二三个玩家的状态
            let vState0:number = stateArray[0];
            let vState1:number = stateArray[1];
            let vState2:number = stateArray[2];
            //设置值
            self.firstPlayerItem.state = vState0;
            if (vState1 !== undefined) self.secondPlayerItem.state = vState1;
            if (vState2 !== undefined) self.thirdPlayerItem.state = vState2;

            //验证是否显示按钮
            self.checkViewBtn();
        }

        /**
         * 验证是否显示按钮
         */
        private checkViewBtn():void {
            let self = this;
            //判断隐藏还是显示 按钮
            if (self._myPlayerItem && self._myPlayerItem.state === 0) {
                //显示
                ViewUtil.addChild(self, self.agreeBtn);
                ViewUtil.addChild(self, self.rejectBtn);
            } else {
                //移除
                ViewUtil.removeChild(self, self.rejectBtn);
                ViewUtil.removeChild(self, self.agreeBtn);
            }

            //投票数量 和 拒绝数量
            let vVoteNum:number = 0, vRejectNum:number = 0, vTempStr:string = "由于";
            let vState0:number = self.firstPlayerItem.state;
            if (vState0 !==0 ) vVoteNum++;
            if (vState0 ===2 ) {
                vTempStr += "玩家【"+self.firstPlayerItem.playerNameStr+"】";
                vRejectNum++;
            }
            if (self._viewItemNum > 1) {
                let vState1:number = self.secondPlayerItem.state;
                if (vState1 !==0 ) vVoteNum++;
                if (vState1 ===2 ) {
                    if (vRejectNum >= 1)  vTempStr += "和"
                    vTempStr += "玩家【"+self.secondPlayerItem.playerNameStr+"】";
                    vRejectNum++;
                }
            }
            if (self._viewItemNum > 2) {
                let vState2:number = self.thirdPlayerItem.state;
                if (vState2 !==0 ) vVoteNum++;
                if (vState2 ===2 ) {
                    if (vRejectNum >= 1)  vTempStr += "和"
                    vTempStr += "玩家【"+self.thirdPlayerItem.playerNameStr+"】";
                    vRejectNum++;
                }
            }

            //显示数量判断
            if (vVoteNum === self._viewItemNum && (vVoteNum === vRejectNum || vRejectNum >=2)) {
                vTempStr += "拒绝，房间解散失败，游戏继续！";

                //弹出确认框
                ReminderViewUtil.showReminderView({
                    hasLeftBtn:true,
                    text:vTempStr
                });
                //删除本界面
                MvcUtil.delView(self);
            }

        }

        /**
         * 启动定时任务
         */
        private startTickerTimer():void {
            let self = this;
            //添加定时任务,1秒钟任务一次
            if (!self._timeTickerTimer) {
                let timer: Game.Timer = new Game.Timer(1000);
                timer.addEventListener(egret.TimerEvent.TIMER, self.updateTimer, self);
                self._timeTickerTimer = timer;
            }
            if (!self._timeTickerTimer.running) {
                self._timeTickerTimer.start();
            }
        }

        /**
         * 停止定时任务
         */
        private stopTickerTimer():void {
            let self = this;
            //添加定时任务,1秒钟任务一次
            if (self._timeTickerTimer) {
                if (self._timeTickerTimer.running) {
                    self._timeTickerTimer.stop();
                }
            }
        }

        /**
         * 定时器更新
         */
        private updateTimer(e:egret.TimerEvent):void {
            let self = this;
            //递减
            // self._leftTimes--;
            // 计算真实的递减
            self._leftTimes = self._startLeftTimes - Math.round((Date.now() - self._startCountBackwardsTimes)/1000);

            // egret.log("_leftTimes="+this._leftTimes);
            // egret.log("vRealLeftTimes="+vRealLeftTimes);

            //设置时间
            if (self._leftTimes >= 0) {
                self.timeLabel.text = ""+self._leftTimes;
            } else {
                self.timeLabel.text = "0";
            }

            if (self.firstPlayerItem.state === 0) {
                self.updateWaitingLabel(self.firstPlayerItem);
            }
            if (self._viewItemNum > 1 && self.secondPlayerItem.state === 0) {
                self.updateWaitingLabel(self.secondPlayerItem);
            }
            if (self._viewItemNum > 2 && self.thirdPlayerItem.state === 0) {
                self.updateWaitingLabel(self.thirdPlayerItem);
            }
        }

        /**
         * 更新等待Label
         * @param {FL.DissolveRoomItem} dissolveRoomItem
         */
        private updateWaitingLabel(dissolveRoomItem:DissolveRoomItem):void {
            let vPointNum:number = this._timeTickerTimer.currentCount%4;
            let vPointStr:string = "";
            if (vPointNum === 1) {
                vPointStr = ".";
            } else if (vPointNum === 2) {
                vPointStr = "..";
            } else if (vPointNum === 3) {
                vPointStr = "...";
            }
            dissolveRoomItem.stateLabel.text = "等待中"+vPointStr;
        }


        /**
         * 关闭界面，关闭界面等于拒绝
         * @param {egret.TouchEvent} e
         */
        private close(e:egret.TouchEvent):void {
            let self = this;
            if (self._myPlayerItem && self._myPlayerItem.state === 0) {
                this.reject(e); //没投过票就投票
            }
            MvcUtil.delView(this);
        }

        /**
         * 同意
         * @param {egret.TouchEvent} e
         */
        private agree(e:egret.TouchEvent):void {
            this.sendDissolveMsg(2);
            this._myPlayerItem.state = 1;
            this.checkViewBtn();
        }

        /**
         * 拒绝
         * @param {egret.TouchEvent} e
         */
        private reject(e:egret.TouchEvent):void {
            this.sendDissolveMsg(3);
            this._myPlayerItem.state = 2;
            this.checkViewBtn();
        }

        /**
         * 发送解散消息
         * @param {number} opValue
         */
        private sendDissolveMsg(opValue:number):void {
            let vPlayerTableOperationMsg:PlayerTableOperationMsg = new PlayerTableOperationMsg();
            vPlayerTableOperationMsg.operation = GameConstant.MAHJONG_OPERTAION_WAITING_OR_CLOSE_VIP;
            vPlayerTableOperationMsg.opValue = opValue; //1是请求解散，2是同意解散，3是不同意解散
            ServerUtil.sendMsg(vPlayerTableOperationMsg);
        }

    }

}