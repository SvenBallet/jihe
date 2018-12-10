module FL {
    /**
     * 战绩回放调停者
     * @Name:  FL - RecordViewMediator
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/16 14:30
     * @Version: V1.0
     */
    export class RecordViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "RecordViewMediator";

        public vView:RecordView = this.viewComponent;

        constructor (pView:RecordView) {
            super(RecordViewMediator.NAME, pView);
            let self = this;
            pView.closeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.inviteBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.inviteFriend, self);
            pView.createBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.createGame, self);
            pView.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadPreviousPage, self);
            pView.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.loadNextPage, self);
            pView.replayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onReplay, self);
        }
            
        private closeView(e:egret.Event):void {
            Storage.removeItem("clubSearchRecord");
            MvcUtil.delView(this.viewComponent);
        }

        private inviteFriend(e:egret.Event):void {
            if (Game.CommonUtil.isNative) {
                let shareData = new nativeShareData();
                shareData.type = ShareWXType.SHARE_URL;
                shareData.url = NativeBridge.mShareUrl;
                shareData.title = "乐趣湖南麻将";
                shareData.desc = "你知道浏阳的少男少女们，深夜不睡觉都在干嘛吗？对，都在玩乐趣湖南麻将！一起来玩吧！";
                NativeBridge.getInstance().mShareData = shareData;

                MvcUtil.send(CommonModule.COMMON_NATIVE_SHARE_CHOOSE_ROAD);
            }
            else {
                MvcUtil.send(CommonModule.COMMON_SHOW_SHARE_REMINDER_VIEW, ShareReminderTypeEnum.FRIENDS);
            }
        }

        private createGame(e:egret.Event):void {
            MvcUtil.addView(new DelLayerView(ViewLayerEnum.BOTTOM_ONLY));
            //进入创建游戏界面
            MvcUtil.addView(new LobbyCreateGameView());
        }

        //上一页
        private loadPreviousPage(e:egret.Event):void{
            let currentPage:number = parseInt(this.vView.currentPage.text);
            let previousPage:number = currentPage-1<0 ? 0 : currentPage-1;
            RecordView.indexMultiple = previousPage;
            if(currentPage == 1){
                PromptUtil.show("已经是第一页", PromptType.ALERT);
                return;
            }
            this.sendMsg(previousPage);
        }

        //下一页
        private loadNextPage(e:egret.Event):void{
            let currentPage:number = parseInt(this.vView.currentPage.text);
            let totalPage:number = parseInt(this.vView.totalPage.text);
            if(currentPage == totalPage){
                PromptUtil.show("已经是最后一页", PromptType.ALERT);
                return;
            }
            let nextPage:number = currentPage+1> totalPage? totalPage : currentPage+1;
            RecordView.indexMultiple = nextPage;
            this.sendMsg(nextPage);
        }

        private sendMsg(newPage:number):void{
            let msg: GetVipRoomListMsg = new GetVipRoomListMsg();
            let playerID:string = LobbyData.playerVO.playerID;
            if(this.vView.msg !== null){
                msg.playerID = playerID;
                msg.unused_2 = newPage;
                ServerUtil.sendMsg(msg,MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK);
            }
            // else{
            //     let clubID:number = Storage.getItem("clubSearchRecord")?parseInt(Storage.getItem("clubSearchRecord")):0;
            //     if(clubID !== 0){
            //         let msg: GetVipRoomListMsg = new GetVipRoomListMsg();
            //         msg.playerID = "" + LobbyData.playerVO.playerIndex;
            //         msg.unused_0 = 0; //是否代开
            //         msg.unused_1 = clubID;
            //         msg.unused_2 = newPage;
            //     }else{
            //         msg.unused_0 = 1;
            //         msg.unused_1 = parseInt(playerID);
            //         msg.unused_2 = newPage;
            //     }
            //     ServerUtil.sendMsg(msg,MsgCmdConstant.MSG_GET_VIP_ROOM_RECORD_ACK2);
            // }
        }

        private onReplay():void{
            let self = this;
            let replayStr = self.vView.replayCode.text;
            if (replayStr == "") {
                PromptUtil.show("请输入正确的回放码", PromptType.ERROR);
                return;
            }

            if (replayStr.indexOf("[") != -1 && replayStr.indexOf("]") != -1) {
                replayStr = replayStr.split("[")[1].split("]")[0];
            }

            let vGetPlayerGameLogMsg: GetPlayerGameLogMsg = new GetPlayerGameLogMsg();
            let juStr = self.vView.gameNum.text;
            if (Number(juStr) < 10) {
                juStr = "0"+juStr;
            }
            vGetPlayerGameLogMsg.unused_0 = Number(replayStr+juStr);
            ServerUtil.sendMsg(vGetPlayerGameLogMsg);
            RecordView.lobbyRecord = true;
        }
    }
}