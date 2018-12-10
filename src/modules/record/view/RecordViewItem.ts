module FL {
	export class RecordViewItem extends eui.ItemRenderer{

        public roomNumLabel:eui.Label;
        public name1:eui.Label;
        public name2:eui.Label;
        public name3:eui.Label;
        public name4:eui.Label;
        public playerID1:eui.Label;
        public playerID2:eui.Label;
        public playerID3:eui.Label;
        public playerID4:eui.Label;
        public score1:eui.Label;
        public score2:eui.Label;
        public score3:eui.Label;
        public score4:eui.Label;
        public numLabel:eui.Label;
        public playBtn:GameButton;
        public shareBtn:GameButton;
        public input:NumberInput;

        /** 房间类型*/
        public roomTypeGroup:eui.Group;
        public roomTypeLabel:eui.Label;

        constructor()
        {
            super();
        }

		protected childrenCreated():void {
            super.childrenCreated();
            TouchTweenUtil.regTween(this.playBtn, this.playBtn);
            TouchTweenUtil.regTween(this.shareBtn, this.shareBtn);
            this.playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playRecord, this);
            this.shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
            // this.input.backgroundColor = 0;
            this.input.text = "1";
            this.input.minValue = 1;

            // this.input.inputType = egret.TextFieldInputType.TEL;
            // this.input.addEventListener(egret.Event.CHANGE,this.onTextChange,this);
        }

        /**
         * 输入牌局数
         * @param {egret.Event} e
         */
        private onTextChange(e:egret.Event){
            this.input.maxValue = this.data.totalHandsNum;
            let _checkMcNameRoleRegExp:RegExp = new RegExp("^[0-9]*$");
            let legal = _checkMcNameRoleRegExp.test(e.target.text);
            if(legal){
                let index:number = Number(e.target.text);
                if (index <= 0 )
                    this.input.text = "1";
                else if(index > Number(this.data.totalHandsNum))
                    this.input.text = this.data.totalHandsNum;
            }else{
                this.input.text = "1";
            }
        }

        /**
         * 播放回放视频
         * @param {egret.Event} e
         */
        private playRecord(e:egret.Event):void {
            let self = this;
            let vCheckMcNameRoleRegExp:RegExp = new RegExp("^[0-9]*$");
            let legal = vCheckMcNameRoleRegExp.test(self.input.text);
            if(legal){
                let index:number = parseInt(self.input.text);
                if (index <= 0 || index > this.data.totalHandsNum) {
                    PromptUtil.show("请输入数字1-"+this.data.totalHandsNum+"！", PromptType.ERROR);
                    return;
                }
            } else {
                PromptUtil.show("请输入数字1-"+this.data.totalHandsNum+"！", PromptType.ERROR);
                return;
            }

            let vGetPlayerGameLogMsg:GetPlayerGameLogMsg = new GetPlayerGameLogMsg();
            vGetPlayerGameLogMsg.gameTableID = self.data.roomID;
            vGetPlayerGameLogMsg.handIndex = parseInt(self.input.text);
            vGetPlayerGameLogMsg.date = self.data.start.substr(0,10).replace(/-/g,"");
            ServerUtil.sendMsg(vGetPlayerGameLogMsg);
            RecordView.lobbyRecord = true;
        }

        /**
         * 初始化数据
         */
        public dataChanged(){
            let self = this;
            self.input.maxValue = this.data.totalHandsNum;
            self.roomNumLabel.text = "房间号:" + self.data.roomIndex + " "+ self.data.start +" ("+self.data.totalHandsNum+"局)";
            if(self.data instanceof VipRoomRecord) {
                self.name1.text = StringUtil.subStrSupportChinese(self.getNameStr(self.data.player1RealName), 12, "...");
                self.playerID1.text = "ID:"+self.getPlayerID(self.data.player1RealName);
            } else { //没有代开房字段的都为授权代理开房记录
                self.name1.text = StringUtil.subStrSupportChinese(self.getNameStr(self.data.player1Name), 12, "...");
                self.playerID1.text = "ID:"+self.getPlayerID(self.data.player1Name);
            }
            self.name2.text = StringUtil.subStrSupportChinese(self.getNameStr(self.data.player2Name), 12, "...");
            self.name3.text = StringUtil.subStrSupportChinese(self.getNameStr(self.data.player3Name), 12, "...");
            self.name4.text = StringUtil.subStrSupportChinese(self.getNameStr(self.data.player4Name), 12, "...");

            self.playerID2.text = "ID:"+self.getPlayerID(self.data.player2Name);
            self.playerID3.text = "ID:"+self.getPlayerID(self.data.player3Name);
            self.playerID4.text = "ID:"+self.getPlayerID(self.data.player4Name);

            self.score1.text = self.getScoreStr(self.data.score1);
            self.score2.text = self.getScoreStr(self.data.score2);
            self.score3.text = self.getScoreStr(self.data.score3);
            self.score4.text = self.getScoreStr(self.data.score4);
            self.score3.visible = self.playerID3.visible = self.data.player3Name != "";
            self.score4.visible = self.playerID4.visible = self.data.player4Name != "";
            self.numLabel.text = String((self.itemIndex+1) + (RecordView.indexMultiple-1)*RecordView.itemLength);
            if(self.data.roomType === 2){
                self.roomTypeGroup.visible = true;
                self.roomTypeLabel.text = "代开房";
            }else if(self.data.roomType === 1){
                self.roomTypeGroup.visible = true;
                self.roomTypeLabel.text = "俱乐部开房";
            }
        }


        /**
         * 获取玩家名称
         * @param {string} name
         * @returns {string}
         */
        private getNameStr(name:string):string {
            let index = name?name.indexOf('-'):-1;
            if(index<0){
                return "";
            }
            let str:string = name.substr(index+1);
            return str;
        }

        /**
         * 获取玩家ID
         * @param {string} name
         * @returns {string}
         */
        private getPlayerID(name:string):string {
            let index = name.indexOf('-')?name.indexOf('-'):-1;
            if(index<0){
                return "";
            }
            let str:string = name.substr(0,index);
            return str;
        }

        /**
         * 获取得分
         * @param {dcodeIO.Long} score
         * @returns {string}
         */
        private getScoreStr(score:dcodeIO.Long) {
            let ret = score.toString();
            if(score.isPositive()) {
                ret = "+"+ret;
            }
            return ret;
        }

        /** 分享 */
        private onShare() {
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
            }else{
                PromptUtil.show("此客户端不支持该功能！", PromptType.ALERT);
                return;
            }
        }
	}
}