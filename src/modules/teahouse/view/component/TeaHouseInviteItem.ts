module FL {
    /** 茶楼邀请列表元素 */
    export class TeaHouseInviteItem extends eui.ItemRenderer {
        public headIcon:eui.Image;
        public headIconMask:eui.Image;
        public nameLab:eui.Label;
        public idLab:eui.Label;
        public inviteGro:eui.Group;
        public inviteBtn:eui.Image;
        public inviteBtnGray:eui.Group;

        /** 数据源 */
        public data: TeaHouseMember;

        constructor() {
            super();
            this.skinName = skins.TeaHouseInviteItemSkin;
        }

        protected childrenCreated() {
            this.headIcon.mask = this.headIconMask;
            this.inviteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.invitePlayer, this);
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) {
                this.headIcon.source = "";
                this.headIcon.bitmapData = null;
                this.nameLab.text = "";
                this.idLab.text = "";
                this.inviteBtn.visible = false;
                this.inviteBtnGray.visible = true;
            }
            else {
                let player:TeaHouseMember = this.data;
                if (GConf.Conf.useWXAuth) {
                    GWXAuth.setRectWXHeadImg(this.headIcon, player.headImageUrl);
                }
                this.nameLab.text = StringUtil.subStrSupportChinese(player.memberName, 12, "...");
                this.idLab.text = "ID:" + player.playerIndex;

                this.inviteBtn.visible = !this.data.inviteFlag;
                this.inviteBtnGray.visible = this.data.inviteFlag;
            }
        }

        protected dataChanged() {
            this.initView();
        }

        /**
         * 邀请玩家
         */
        private invitePlayer() {
            this.inviteBtn.visible = false;
            this.inviteBtnGray.visible = true;

            let msg: InviteToJoinGameMsg = new InviteToJoinGameMsg();
            msg.teaHouseId = TeaHouseInviteView.teahouseId;
            let vipRoomID = (<NewIntoGameTableMsgAck>GameConstant.CURRENT_HANDLE.getRequestStartGameMsgAck()).vipRoomID;
            if (!vipRoomID) return;
            msg.roomId = vipRoomID;
            msg.operationType = 0;
            msg.playerIndex = this.data.playerIndex;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_INVITE_TO_JOIN_GAME_ACK);
        }
    }
}