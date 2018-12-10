module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardEffectViewMediator
     * @Description:  //特效表现层界面 调停者
     * @Create: DerekWu on 2017/11/23 9:40
     * @Version: V1.0
     */
    export class TableBoardEffectViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "TableBoardEffectViewMediator";

        constructor(pView: TableBoardEffectView) {
            super(TableBoardEffectViewMediator.NAME, pView);
        }

        // /**
        //  * 注册之后调用
        //  */
        // public onRegister():void {
        //     egret.log("--TableBoardEffectViewMediator--onRegister");
        // }
        //
        // /**
        //  * 移除之后调用
        //  */
        // public onRemove():void {
        //     egret.log("--TableBoardEffectViewMediator--onRemove");
        // }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                MJGameModule.MJGAME_CHU_PAI,
                MJGameModule.MJGAME_BU_HUA,
                MJGameModule.MJGAME_CHI,
                MJGameModule.MJGAME_PENG,
                MJGameModule.MJGAME_MING_GANG,
                MJGameModule.MJGAME_AN_GANG,
                MJGameModule.MJGAME_BU_GANG,
                MJGameModule.MJGAME_HU,
                MJGameModule.MJGAME_SCORE_UPDATE,
                MJGameModule.MJGAME_SEND_PROS,
                MJGameModule.MJGAME_SEND_FACE,
                MJGameModule.MJGAME_SEND_QUICK_TEXT,
                MJGameModule.MJGAME_SEND_TEXT,
                CommonModule.COMMON_WE_CHAT_VOICE_PLAY_START,
                CommonModule.COMMON_WE_CHAT_VOICE_PLAY_END,
                CommonModule.COMMON_SHOW_TALK_ANI_REALY,
                CommonModule.COMMON_HIDE_TALK_ANI_REALY
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case MJGameModule.MJGAME_CHU_PAI: {
                    this.chuCard(data);
                    break;
                }
                case MJGameModule.MJGAME_BU_HUA: {
                    this.buHua(data);
                    break;
                }
                case MJGameModule.MJGAME_CHI: {
                    this.chi(data);
                    break;
                }
                case MJGameModule.MJGAME_PENG: {
                    this.peng(data);
                    break;
                }
                case MJGameModule.MJGAME_MING_GANG:
                case MJGameModule.MJGAME_AN_GANG:
                case MJGameModule.MJGAME_BU_GANG: {
                    this.mingGang(data);
                    break;
                }
                case MJGameModule.MJGAME_HU: {
                    this.hu(data);
                    break;
                }
                case MJGameModule.MJGAME_SCORE_UPDATE: {
                    this.scoreUpdate(data);
                    break;
                }
                case MJGameModule.MJGAME_SEND_PROS: {
                    this.sendPros(data);
                    break;
                }
                case MJGameModule.MJGAME_SEND_FACE: {
                    this.sendFace(data);
                    break;
                }
                case MJGameModule.MJGAME_SEND_QUICK_TEXT: {
                    this.sendQuickText(data);
                    break;
                }
                case MJGameModule.MJGAME_SEND_TEXT: {
                    this.sendText(data);
                    break;
                }
                case CommonModule.COMMON_WE_CHAT_VOICE_PLAY_START:{
                    this.startPlayWeChatVoice(data);
                    break;
                }
                case CommonModule.COMMON_WE_CHAT_VOICE_PLAY_END:{
                    this.endPlayWeChatVoice(data);
                    break;
                }
                case CommonModule.COMMON_SHOW_TALK_ANI_REALY: {
                    console.log("WTF=="+data.scaleX+"x=="+data.x+"y=="+data.y);
                    this.startPlayNativeVoice(data);
                    break;
                }
                case CommonModule.COMMON_HIDE_TALK_ANI_REALY: {
                    this.stopPlayNativeVoice();
                    break;
                }
            }
        }

        /**
         * 出牌
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public chuCard(msg: PlayerTableOperationMsg): void {
            //获得牌桌方向
            let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            //播放出牌效果 和 声音
            this.getView().chuCard(vPZOrientation, msg.card_value);
            //播放出牌音效
            MJGameSoundHandler.chuCard(msg.card_value, vPZOrientation);
        }

        /**
         * 补花
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public buHua(buhuaObj: { tablePos: number, isMyAutoBuhua: boolean, huaCardArray: Array<number> }): void {
            //获得牌桌方向
            let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(buhuaObj.tablePos);
            // if (vPZOrientation === PZOrientation.DOWN) {
            //     egret.log("myBuhuaNum=" + MJGameHandler.getMyBuhuaNum());
            // }
            // egret.log("buHua 1");

            if (MJGameHandler.isReplay()) {
                //播放补花动画 和 声音
                this.getView().buHua(vPZOrientation);
                MJGameSoundHandler.buhua(vPZOrientation);
            } else {
                //非自动补花就要播放补花声音，如果是我自己自动补花，这判断是否已经有补花了，有了就不播放补花声音，没有就播放补花身影
                if (!buhuaObj.isMyAutoBuhua || (buhuaObj.isMyAutoBuhua && MJGameHandler.getMyBuhuaNum() === 0)) {
                    //播放补花动画 和 声音
                    this.getView().buHua(vPZOrientation);

                    // this.getView().buHua(PZOrientation.UP);
                    // this.getView().buHua(PZOrientation.DOWN);
                    // this.getView().buHua(PZOrientation.LEFT);
                    // this.getView().buHua(PZOrientation.RIGHT);
                    MJGameSoundHandler.buhua(vPZOrientation);
                    // egret.log("buHua 2");
                }
            }
        }

        /**
         * 吃
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public chi(msg: PlayerTableOperationMsg): void {
            let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            //播放碰牌的声音 和 特效
            this.getView().chi(vPZOrientation);
            MJGameSoundHandler.chi(vPZOrientation);
        }

        /**
         * 碰牌
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private peng(msg: PlayerTableOperationMsg): void {
            let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            //播放碰牌的声音 和 特效
            this.getView().peng(vPZOrientation);
            MJGameSoundHandler.peng(vPZOrientation);
        }

        /**
         * 明杠
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private mingGang(msg: PlayerTableOperationMsg): void {
            //判断是否是通知消息
            if (msg.opValue === GameConstant.MAHJONG_OPERTAION_GANG_NOTIFY || MJGameHandler.isReplay()) {
                let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
                //播放杠动画 和 声音
                this.getView().gang(vPZOrientation);
                //播放音效
                MJGameSoundHandler.gang(vPZOrientation);
            }
        }

        /**
         * 胡
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        private hu(msg: PlayerOperationNotifyMsg): void {
            let vPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            //播放声音 和 特效
            this.getView().hu(vPZOrientation, msg.target_card);
            if (Math.random() > 0.5) {
                MJGameSoundHandler.hu(vPZOrientation);
            } else {
                MJGameSoundHandler.hu(vPZOrientation, true);
            }
        }

        /**
         * 更新分数
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private scoreUpdate(msg:PlayerTableOperationMsg): void {
            // 当前消息信息中玩家的方向
            let vCurrPlayerPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.player_table_pos);
            // 赢钱玩家方向
            let vWinScorePZOrientation:PZOrientation = MJGameHandler.getPZOrientation(msg.chuOffset);
            // 播放更新分数
            this.getView().playScoreUpdate(vCurrPlayerPZOrientation, vWinScorePZOrientation, msg.card_value, msg.opValue);
        }

        /**
         * 互动表情
         * @param {Object} data
         */
        private sendPros(data: any): void {
            let msg: TalkingInGameMsg = data.msg;
            let tType = data.tType;
            let hudongNum = msg.msgNo + 1;
            let startPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.playerPos);
            let endPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.unused_0);
            //送出头像位置
            let startX = TableBoardEffectView.getInstance().getIconOrientation(startPZOrientation).x,
                startY = TableBoardEffectView.getInstance().getIconOrientation(startPZOrientation).y;
            //送达头像位置
            let endX = TableBoardEffectView.getInstance().getIconOrientation(endPZOrientation).x;
            let endY = TableBoardEffectView.getInstance().getIconOrientation(endPZOrientation).y;
            //发送道具
            this.getView().sendProps([startX, startY], [endX, endY], tType, hudongNum);
        }

        /**
         * 快捷文字
         * @param {FL.TalkingInGameMsg} msg
         */
        private sendQuickText(msg): void {
            let sPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.playerPos);
            this.getView().playQuickText(sPZOrientation, msg.msgNo);
        }


        /**
         * 表情
         * @param {FL.TalkingInGameMsg} msg
         */
        private sendFace(msg): void {
            let sPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.playerPos);
            this.getView().playFace(sPZOrientation, msg.msgNo);
        }

        /**
         * 文字
         * @param {FL.TalkingInGameMsg} msg
         */
        private sendText(msg): void {
            let sPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(msg.playerPos);
            this.getView().playText(sPZOrientation, msg.msgText);
        }

        /**
         * 开始播放微信语音
         * @param {{localId: string; voiceType: FL.WeChatVoiceTypeEnum}} recordObj
         */
        private startPlayWeChatVoice(playerAction:WeChatVoiceAction):void {
            if (GConf.Conf.useWXAuth) {
                if (playerAction.voiceScene === WeChatVoiceSceneEnum.GAME) {
                    // egret.log("playerAction.data="+playerAction.data);
                    let sPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(playerAction.data);
                    this.getView().playWeChatVoice(sPZOrientation);
                }
            }
        }

        /**
         * 结束播放微信语音
         * @param {number} voiceLocalId
         */
        private endPlayWeChatVoice(voiceLocalId:number):void {
            if (GConf.Conf.useWXAuth) {
                this.getView().playWeChatVoiceEnd(voiceLocalId);
            }
        }

        public getView(): TableBoardEffectView {
            return <TableBoardEffectView>this.viewComponent;
        }

        private startPlayNativeVoice(data: any) {
            if (Game.CommonUtil.isNative) {
                console.log("getData=="+data.scaleX+"x=="+data.x+"y=="+data.y);
                let talkAni: TalkAni = this.getView().getNativeTalkAni()
                talkAni.scaleX = data.scaleX;
                talkAni.x = data.x;
                talkAni.y = data.y;

                talkAni.showPlay();
            }
        }

        private stopPlayNativeVoice() {
            if (Game.CommonUtil.isNative) {
                this.getView().getNativeTalkAni().hide();
            }
        }
    }
}