module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubRoomListView
     * @Description:  房间列表
     * @Create: ArielLiang on 2018/3/7 14:48
     * @Version: V1.0
     */
    export class ClubRoomListView extends eui.Component {

        /** 未开始*/
        public unStartGroup: eui.Group;
        public unStartBtn: eui.Image;
        public unStartLabel: eui.Label;
        /** 对局中*/
        public onGameGroup: eui.Group;
        public onGameBtn: eui.Image;
        public onGameLabel: eui.Label;
        /** 已结束*/
        public overGroup: eui.Group;
        public overBtn: eui.Image;
        public overLabel: eui.Label;
        /** 滚动内容*/
        public roomListScroller: eui.Scroller;
        public roomListGroup: eui.Group;


        public constructor() {
            super();
            this.left = this.right = 0;
            this.top = this.bottom = 0;
            // this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubRoomListViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            //垂直布局
            let layout = new eui.VerticalLayout();
            self.roomListGroup.layout = layout;

            //垂直滚动滚动到起始位置
            self.roomListScroller.viewport.scrollV = 0;
            //水平滚动关闭
            self.roomListScroller.scrollPolicyH = eui.ScrollPolicy.OFF;

            self.unStartGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadUnStartContent, self);
            self.onGameGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadOnGameContent, self);
            self.overGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadOverContent, self);

        }

        /**
         * 显示房间列表
         * @param {FL.AgentDaiKaiMsgAck} msg
         */
        public showRoomList(msg: AgentDaiKaiMsgAck): void {
            this.roomListGroup.removeChildren();
            let list: Array<any> = msg.vlist;
            ClubRoomListItemView.roomState = msg.unused_3;
            if (list == null) {
                return;
            }
            for (let i = 0; i < list.length; i++) {
                let vClubRoomListItemView: ClubRoomListItemView = new ClubRoomListItemView(list[i]);
                this.roomListGroup.addChild(vClubRoomListItemView);
            }
        }

        /**
         * 未开始
         */
        private loadUnStartContent(): void {
            let self = this;
            self.unStartBtn.source = "create_tab_chosen_png";
            self.unStartLabel.textColor = 0xffffff;
            self.onGameBtn.source = "";
            self.onGameLabel.textColor = 0xde6126;
            self.overBtn.source = "";
            self.overLabel.textColor = 0xde6126;
            self.sendMsg(1, 0);
        }

        /**
         * 对局中
         */
        private loadOnGameContent(): void {
            let self = this;
            self.unStartBtn.source = "";
            self.unStartLabel.textColor = 0xde6126;
            self.onGameBtn.source = "create_tab_chosen_png";
            self.onGameLabel.textColor = 0xffffff;
            self.overBtn.source = "";
            self.overLabel.textColor = 0xde6126;
            self.sendMsg(1, 3);
        }

        /**
         * 已结束
         */
        private loadOverContent(): void {
            //进入战绩界面
            let msg: GetVipRoomListMsg = new GetVipRoomListMsg();
            msg.playerID = "" + LobbyData.playerVO.playerIndex;
            msg.unused_0 = 0; //是否代开
            msg.unused_1 = ClubData.vClub.id;
            msg.unused_2 = 1; 
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK2);
            Storage.setItem("clubSearchRecord",""+ClubData.vClub.id);
        }


        /**
         * 发送请求列表消息
         * @param {number} page
         */
        public sendMsg(page: number, roomState: number): void {
            //unused_1 房间状态类型:-1:所有,0:未开始,3:进行中
            let vParams = {
                itemID: GameConstant.AGENT_CMD_GET_FANGLIST,
                unused_1: roomState,
                count: page,
                unused_3: 0,
                unused_0: ClubData.vClub.id
            };
            let vGameBuyItemMsg: GameBuyItemMsg = new GameBuyItemMsg(vParams);
            ServerUtil.sendMsg(vGameBuyItemMsg, MsgCmdConstant.MSG_AGENT_DAIKAI_ACK);
        }
    }
}