module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubRoomPlayerDetailItemView
     * @Description:  房间玩家详情
     * @Create: ArielLiang on 2018/3/14 10:30
     * @Version: V1.0
     */
    export class ClubRoomPlayerDetailItemView extends eui.ItemRenderer{

        public headGroup:eui.Group;
        public headImg:eui.Image;
        public playerName:eui.Label;
        public playerID:eui.Label;

        public rmBtn:GameButton;

        public tableID:number;

        public vSimplePlayer:SimplePlayer;

        public mainGamePlayRule:number;

        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubRoomPlayerDetailItemSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.playerID.text = self.vSimplePlayer.palyerIndex?""+self.vSimplePlayer.palyerIndex:"";
            self.playerName.text = self.vSimplePlayer.playerName?StringUtil.subStrSupportChinese(self.vSimplePlayer.playerName, 8, "..."):"";
            if(self.playerID.text === "" || ClubData.vClub.myState === ClubData.CLUB_TYPE_MEMBER || ClubRoomListItemView.roomState === 3){
                self.rmBtn.visible = false;
            }else{
                self.rmBtn.visible = true;
            }

            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(this.headImg, self.vSimplePlayer.headImgUrl, this.headGroup, 54,52,46);
                GWXAuth.setRectWXHeadImg(this.headImg, self.vSimplePlayer.headImgUrl);
            }

            TouchTweenUtil.regTween(self.rmBtn, self.rmBtn);

            self.rmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.removePlayer, self);
        }

        private removePlayer():void{
            ReminderViewUtil.showReminderView({
                hasLeftBtn:true,
                leftCallBack:new MyCallBack(this.realRemovePlayer, this),
                hasRightBtn:true,
                text:"您确定移除玩家："+this.vSimplePlayer.playerName+"吗？ "
            });
        }

        private realRemovePlayer():void{

            // let vParams = {itemID:GameConstant.AGENT_CMD_REJECT_TABLE_PLAYER,unused_0:this.tableID,unused_1:this.vSimplePlayer.palyerIndex};
            // ServerUtil.sendMsg(new GameBuyItemMsg(vParams), MsgCmdConstant.MSG_GAME_BUY_ITEM_ACK);

            let vClubRemoveTablePlayerMsg:ClubRemoveTablePlayerMsg = new ClubRemoveTablePlayerMsg();
            vClubRemoveTablePlayerMsg.clubId = ClubData.vClub.id;
            vClubRemoveTablePlayerMsg.mainGamePlayRule = this.mainGamePlayRule;
            vClubRemoveTablePlayerMsg.vipRoomId = this.tableID;
            vClubRemoveTablePlayerMsg.removePlayerIndex = this.vSimplePlayer.palyerIndex;
            ServerUtil.sendMsg(vClubRemoveTablePlayerMsg, MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW);
        }
    }
}