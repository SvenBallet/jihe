module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTableEffectViewMediator
     * @Description:  //特效表现层界面 调停者
     * @Create: DerekWu on 2017/11/23 9:40
     * @Version: V1.0
     */
    export class MahjongTableEffectViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME: string = "MahjongTableEffectViewMediator";

        constructor(pView: MahjongTableEffectView) {
            super(MahjongTableEffectViewMediator.NAME, pView);
        }

        // /**
        //  * 注册之后调用
        //  */
        // public onRegister():void {
        //     egret.log("--MahjongTableEffectViewMediator--onRegister");
        // }
        //
        // /**
        //  * 移除之后调用
        //  */
        // public onRemove():void {
        //     egret.log("--MahjongTableEffectViewMediator--onRemove");
        // }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests(): Array<any> {
            return [
                MahjongModule.MAHJONG_CHANG_SHA_VIEW_GANG_CARD,
                MahjongModule.MAHJONG_PLAY_CHU_PAI_EFFECT,
                MahjongModule.GAME_SEND_PROS,
                MahjongModule.GAME_SEND_FACE,
                MahjongModule.GAME_SEND_QUICK_TEXT,
                MahjongModule.GAME_SEND_TEXT,
                MahjongModule.MAHJONG_UPDATE_SCORE,
                MahjongModule.MAHJONG_ACTION_EFFECT,
                MahjongModule.MAHJONG_THROW_SHAI_ZI,
                CommonModule.COMMON_WE_CHAT_VOICE_PLAY_START,
                CommonModule.COMMON_WE_CHAT_VOICE_PLAY_END,
                CommonModule.COMMON_SHOW_TALK_ANI_REALY,
                CommonModule.COMMON_HIDE_TALK_ANI_REALY,
                MahjongModule.MAHJONG_OPT_GUO,
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification: puremvc.INotification): void {
            // console.log("HANDLE ENTER---");
            let data: any = pNotification.getBody();
            switch (pNotification.getName()) {
                case MahjongModule.MAHJONG_PLAY_CHU_PAI_EFFECT: {
                    this.chuCardEffect(data);
                    break;
                }
                case MahjongModule.GAME_SEND_PROS:
                    this.sendPros(data);
                    break;
                case MahjongModule.GAME_SEND_FACE:
                    this.sendFace(data);
                    break;
                case MahjongModule.GAME_SEND_QUICK_TEXT:
                    this.sendQuickText(data);
                    break;
                case MahjongModule.GAME_SEND_TEXT:
                    this.sendText(data);
                    break;
                case MahjongModule.MAHJONG_UPDATE_SCORE:
                    this.scoreUpdate(data);
                    break;
                case MahjongModule.MAHJONG_ACTION_EFFECT:
                    this.processActionEffect(data);
                    break;
                case MahjongModule.MAHJONG_THROW_SHAI_ZI:
                    this.throwShaiZi(data);
                    break;
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
                case MahjongModule.MAHJONG_CHANG_SHA_VIEW_GANG_CARD: {
                    this.getView().changShaViewGangCard(data);
                    break;
                }
                case MahjongModule.MAHJONG_OPT_GUO: {
                    this.getView().guo(data);
                    break;
                }
            }
        }

        /**
         * 出牌
         * @param {FL.MahjongPlayCardMsgAck} msg
         */
        // public chuCard(msg: MahjongPlayCardMsgAck): void {
        //     //获得牌桌方向
        //     let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
        //     if(msg.playCard){
        //         //播放出牌效果
        //         this.getView().chuCard(vPZOrientation, msg.playCard);
        //         //播放出牌音效
        //         MahjongSoundHandler.chuCard(msg.playCard, vPZOrientation);
        //     }
        // }

        /**
         * 出牌特效和音效
         * @param {{playerPos: number; playCard: number}} msg
         */
        public chuCardEffect(msg: {playerPos:number, playCard:number}): void {
            // egret.log("chuCardEffect");
            //获得牌桌方向
            let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            if(msg.playCard){
                //播放出牌效果
                this.getView().chuCard(vPZOrientation, msg.playCard);
                //播放出牌音效(改到放桌上的时候播放)
                // MahjongSoundHandler.chuCard(msg.playCard, vPZOrientation, false);
            }
        }

        /**
         * 丢色子
         * @param {FL.MahjongDiuShaiZiMsgAck} msg
         */
        public throwShaiZi(msg:MahjongDiuShaiZiMsgAck):void{
            let self = this;
            if(msg.beforeDiuShowTipDesc){
                PromptUtil.show(msg.beforeDiuShowTipDesc,PromptType.ALERT);
            }
            self.getView().shaiZiAnimation(msg);
        }

        /**
         * 补花
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public buHua(buhuaObj: { tablePos: number, isMyAutoBuhua: boolean, huaCardArray: Array<number> }): void {
            //获得牌桌方向
            let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(buhuaObj.tablePos);
            // if (vPZOrientation === PZOrientation.DOWN) {
            //     egret.log("myBuhuaNum=" + MahjongHandler.getMyBuhuaNum());
            // }
            // egret.log("buHua 1");

            if (MahjongHandler.isReplay()) {
                //播放补花动画 和 声音
                this.getView().buHua(vPZOrientation);
                MahjongSoundHandler.buhua(vPZOrientation);
            } else {
                //非自动补花就要播放补花声音，如果是我自己自动补花，这判断是否已经有补花了，有了就不播放补花声音，没有就播放补花身影
                if (!buhuaObj.isMyAutoBuhua || (buhuaObj.isMyAutoBuhua && MahjongHandler.getMyBuhuaNum() === 0)) {
                    //播放补花动画 和 声音
                    this.getView().buHua(vPZOrientation);

                    // this.getView().buHua(PZOrientation.UP);
                    // this.getView().buHua(PZOrientation.DOWN);
                    // this.getView().buHua(PZOrientation.LEFT);
                    // this.getView().buHua(PZOrientation.RIGHT);
                    MahjongSoundHandler.buhua(vPZOrientation);
                    // egret.log("buHua 2");
                }
            }
        }

        /**
         * 吃
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public chi(msg: PlayerTableOperationMsg): void {
            let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.player_table_pos);
            //播放碰牌的声音 和 特效
            this.getView().chi(vPZOrientation);
            MahjongSoundHandler.chi(vPZOrientation);
        }

        /**
         * 碰牌
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private peng(msg: PlayerTableOperationMsg): void {
            let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.player_table_pos);
            //播放碰牌的声音 和 特效
            this.getView().peng(vPZOrientation);
            MahjongSoundHandler.peng(vPZOrientation);
        }

        /**
         * 明杠
         * @param {FL.PlayerTableOperationMsg} msg
         */
        private mingGang(msg: PlayerTableOperationMsg): void {
            //判断是否是通知消息
            if (msg.opValue === GameConstant.MAHJONG_OPERTAION_GANG_NOTIFY || MahjongHandler.isReplay()) {
                let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.player_table_pos);
                //播放杠动画 和 声音
                this.getView().gang(vPZOrientation);
                //播放音效
                MahjongSoundHandler.gang(vPZOrientation);
            }
        }

        /**
         * 胡
         * @param {FL.PlayerOperationNotifyMsg} msg
         */
        private hu(msg: PlayerOperationNotifyMsg): void {
            let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.player_table_pos);
            //播放声音 和 特效
            this.getView().hu(vPZOrientation, msg.target_card);
            if (Math.random() > 0.5) {
                MahjongSoundHandler.hu(vPZOrientation);
            } else {
                MahjongSoundHandler.hu(vPZOrientation, true);
            }
        }

        /**
         * 更新分数
         * @param {FL.MahjongUpdateScoreMsgAck} msg
         */
        private scoreUpdate(msg:MahjongUpdateScoreMsgAck): void {
            // 赢家位置
            let vWinPos:number = -1;
            let vScoreInfos:Array<MahjongUpdateScorePlayerInfo> = msg.scoreInfos;
            let vScoreInfo:MahjongUpdateScorePlayerInfo = null;
            for (let vIndex:number = 0; vIndex < vScoreInfos.length; ++vIndex) {
                vScoreInfo = vScoreInfos[vIndex];
                if (vScoreInfo.score > 0) {
                    vWinPos = vScoreInfo.tablePos;
                    break;
                }
            }
            // 循环处理
            for (let vIndex:number = 0; vIndex < vScoreInfos.length; ++vIndex) {
                vScoreInfo = vScoreInfos[vIndex];
                // 当前消息信息中玩家的方向
                let vCurrPlayerPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(vScoreInfo.tablePos);
                // 赢钱玩家方向
                let vWinScorePZOrientation:PZOrientation = MahjongHandler.getPZOrientation(vWinPos);
                // 玩家信息
                // 获得玩家信息
                let vGamePlayer:GamePlayer = MahjongHandler.getGamePlayerInfo(vCurrPlayerPZOrientation);
                vGamePlayer.zhongTuScore += vScoreInfo.score;
                // 播放更新分数
                this.getView().playScoreUpdate(vCurrPlayerPZOrientation, vWinScorePZOrientation, vScoreInfo.score, vGamePlayer.chip);
            }

        }

        /**
         * 互动表情
         * @param {Object} data
         */
        private sendPros(data: any): void {
            let msg: NewTalkingInGameMsgAck = data.msg;
            let tType = data.tType;
            let hudongNum = msg.msgNo + 1;
            let startPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            let endPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.receiverPos);
            //送出头像位置
            let startX = MahjongTableEffectView.getInstance().getIconOrientation(startPZOrientation).x,
                startY = MahjongTableEffectView.getInstance().getIconOrientation(startPZOrientation).y;
            //送达头像位置
            let endX = MahjongTableEffectView.getInstance().getIconOrientation(endPZOrientation).x;
            let endY = MahjongTableEffectView.getInstance().getIconOrientation(endPZOrientation).y;
            //发送道具
            this.getView().sendProps([startX, startY], [endX, endY], tType, hudongNum);
        }

        /**
         * 快捷文字
         * @param {FL.TalkingInGameMsg} msg
         */
        private sendQuickText(msg): void {
            let sPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            this.getView().playQuickText(sPZOrientation, msg.msgNo);
        }


        /**
         * 表情
         * @param {FL.TalkingInGameMsg} msg
         */
        private sendFace(msg): void {
            let sPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            this.getView().playFace(sPZOrientation, msg.msgNo);
        }

        /**
         * 文字
         * @param {FL.TalkingInGameMsg} msg
         */
        private sendText(msg): void {
            let sPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            this.getView().playText(sPZOrientation, msg.msgText);
        }

        /**
         * 处理动作特效
         * @param {FL.MahjongActionSelectMsgAck} msg
         */
        private processActionEffect(msg:MahjongActionSelectMsgAck): void {
            egret.log(msg);
            let vMahjongTableEffectView: MahjongTableEffectView = this.getView();
            let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            switch (msg.action) {
                case MahjongActionEnum.CHI:
                    vMahjongTableEffectView.chi(vPZOrientation);
                    MahjongSoundHandler.chi(vPZOrientation);
                    return;
                case MahjongActionEnum.PENG:
                    vMahjongTableEffectView.peng(vPZOrientation);
                    MahjongSoundHandler.peng(vPZOrientation);
                    return;
                case MahjongActionEnum.QIANG_GANG_HU:
                case MahjongActionEnum.JIE_PAO:
                    if (msg.cards.length > 1) {
                        vMahjongTableEffectView.hu2(vPZOrientation, msg.cards);
                    } else {
                        vMahjongTableEffectView.hu(vPZOrientation, msg.cards[0]);
                    }
                    MahjongSoundHandler.hu(vPZOrientation, false);
                    return;
                case MahjongActionEnum.ZI_MO:
                    if (msg.cards.length > 1) {
                        vMahjongTableEffectView.hu2(vPZOrientation, msg.cards, true);
                    } else {
                        vMahjongTableEffectView.hu(vPZOrientation, msg.cards[0], true);
                    }
                    MahjongSoundHandler.hu(vPZOrientation, true);
                    return;
                case MahjongActionEnum.BAO_TING:
                    // vMahjongTableEffectView.(vPZOrientation);
                    return;
                case MahjongActionEnum.MING_GANG:
                case MahjongActionEnum.BU_GANG:
                case MahjongActionEnum.AN_GANG:
                case MahjongActionEnum.CHANG_SHA_AN_GANG:
                case MahjongActionEnum.CHANG_SHA_MING_GANG:
                case MahjongActionEnum.CHANG_SHA_BU_GANG:
                    vMahjongTableEffectView.gang(vPZOrientation);
                    MahjongSoundHandler.gang(vPZOrientation);
                    return;
                case MahjongActionEnum.CHANG_SHA_AN_BU_ZHANG:
                case MahjongActionEnum.CHANG_SHA_MING_BU_ZHANG:
                case MahjongActionEnum.CHANG_SHA_BU_BU_ZHANG:
                    vMahjongTableEffectView.buZhang(vPZOrientation);
                    MahjongSoundHandler.buZhang(vPZOrientation);
                    return;
                case MahjongActionEnum.CHANG_SHA_DASIXI:
                    return;
                case MahjongActionEnum.CHANG_SHA_DASIXI_ZHONGTU:
                    return;
                case MahjongActionEnum.CHANG_SHA_BANBANHU:
                    return;
                case MahjongActionEnum.CHANG_SHA_QUEYISE:
                    return;
                case MahjongActionEnum.CHANG_SHA_LIULIUSHUN:
                case MahjongActionEnum.CHANG_SHA_LIULIUSHUN_ZHONGTU:
                    return;
                case MahjongActionEnum.CHANG_SHA_YIZHIHUA:
                    return;
                case MahjongActionEnum.CHANG_SHA_3TONG:
                    return;
                case MahjongActionEnum.CHANG_SHA_JIEJIEGAO:
                    return;
                default:
                    return;
            }
        }

        /**
         * 开始播放微信语音
         * @param {{localId: string; voiceType: FL.WeChatVoiceTypeEnum}} recordObj
         */
        private startPlayWeChatVoice(playerAction:WeChatVoiceAction):void {
            if (GConf.Conf.useWXAuth) {
                if (playerAction.voiceScene === WeChatVoiceSceneEnum.GAME) {
                    // egret.log("playerAction.data="+playerAction.data);
                    let sPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(playerAction.data);
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

        public getView(): MahjongTableEffectView {
            return <MahjongTableEffectView>this.viewComponent;
        }

        private startPlayNativeVoice(data: any) {
            if (Game.CommonUtil.isNative) {
                // console.log("getData=="+data.scaleX+"x=="+data.x+"y=="+data.y);
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