module FL {
    /**
     * 公共模块代理
     * @Name:  FL - CommonProxy
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/8/17 9:11
     * @Version: V1.0
     */
    export class CommonProxy extends puremvc.Proxy {
        /** 代理名 */
        public static readonly NAME: string = "CommonProxy";
        /** 单例 */
        private static instance: CommonProxy;

        // 心跳定时器
        private _heartBeatingTimer: Game.Timer;

        private constructor() {
            super(CommonProxy.NAME);
        }

        public static getInstance(): CommonProxy {
            if (!this.instance) {
                this.instance = new CommonProxy();
            }
            return this.instance;
        }

        /**
         * 链接后发送此消息来确认链接的合法性
         * @param {FL.LinkValidationMsgAck} msg
         */
        public exeLinkValidationAck(msg: LinkValidationMsgAck): void {
            // egret.log("msgLinkValidationAck cmd=%s", StringUtil.numToHexStr(msg.msgCMD));
            // std::string CGameGlobal::getServerTimeString()
            // {
            //     __int64 tt=getCurrentServerTime();
            //
            //     __int64 myKey=0xa97ef1a45ee9ab04L;
            //     tt=tt^myKey;//异或一下
            //
            //
            //     char buf[128];
            //     sprintf_s(buf,128,"%lld",tt);
            //     std::string aa(buf);
            //     //CCLog("getServerTimeString=%s",buf);
            //     return aa;
            // }

            // let ctt:number = Number(msg.linkName);

            // egret.log("# cct3 = "+msg.linkName);

            let cttLong: dcodeIO.Long = dcodeIO.Long.fromValue(msg.linkName);
            //0x5447f17345dff01
            let myKeyLong: dcodeIO.Long = dcodeIO.Long.fromString("5447f17345dff01", true, 16);

            // egret.log("cttLong="+cttLong);
            // egret.log("myKeyLong="+myKeyLong);

            // LongUtil.xor(cttLong, myKeyLong);

            // let cttHigh:number = cttLong.getHighBits();
            // let cttLow:number = cttLong.getLowBits();
            //
            // let myKeyHigh:number = myKeyLong.getHighBits();
            // let myKeyLow:number = myKeyLong.getLowBits();
            //
            // cttHigh = cttHigh^myKeyHigh;
            // cttLow = cttLow^myKeyLow;
            //
            // let newLong:dcodeIO.Long = dcodeIO.Long.fromBits(cttLow, cttHigh);

            // let newLong:dcodeIO.Long = LongUtil.xor(cttLong, myKeyLong);
            let newLong: dcodeIO.Long = cttLong.xor(myKeyLong);
            // egret.log("# cct2 = "+newLong.toString());

            newLong = newLong.subtract(13249);
            newLong = newLong.divide(3);
            // let myKey:number = 0x5447f17345dff01;
            // ctt =ctt^myKey;//异或一下，让解密更麻将
            // // ctt=ctt*3+13249;//随便变化下，客户端反过来处理下就对了
            // ctt = (ctt - 13249)/3; 1510232682257 1510232682265

            // egret.log("# cct1 = "+newLong.toString());
            let vTimeDifference: number = newLong.toNumber() - new Date().getTime();
            // egret.log("vTimeDifference="+vTimeDifference);
            //设置服务器时间差
            ServerUtil.setTimeDifference(vTimeDifference);
            //回发心跳请求
            ServerUtil.sendMsg(new HeartBeatingAckMsg());

            // # cct3 = 379563550647457184
            // egret.js:13886 cttLong=379563550647457184
            // egret.js:13886 myKeyLong=379568006245515009
            // egret.js:13886 # cct2 = 4531095792289
            // egret.js:13886 # cct1 = 1510365259680
            // ctt=1510365259680
            // ctt2=4531095792289
            // myKey=379568006245515009
            // ctt3=379563550647457184

            //TODO 。。。请求版本信息 ，暂时不做

            //TODO 模拟app登录
            // let vLoginMsg:LoginMsg = new LoginMsg();
            // vLoginMsg.qqOpenID = "unionId_DEREK_1234567"; //unionId 放到 qqOpenID
            // vLoginMsg.wxOpenID = "app_openId_DEREK_1234567";
            // vLoginMsg.userName = "DerekWu7";
            // vLoginMsg.deviceFlag = 1;
            // vLoginMsg.password = "http://qqq.DerekWu.com/DerekWu";
            // vLoginMsg.sex = parseInt("1");
            // vLoginMsg.machineCode = "unionId_DEREK_123456"; //机器码设置成unionId
            // ServerUtil.sendMsg(vLoginMsg);

            //TODO  .... 测试代码
            // let vH5WXLoginMsg:H5WXLoginMsg = new H5WXLoginMsg();
            // vH5WXLoginMsg.unionId = "unionId_DEREK_1234567";
            // vH5WXLoginMsg.loginAuthCode = "b7d304b464d40ff46bea8748eed3956a";
            // vH5WXLoginMsg.timeStamp = dcodeIO.Long.fromNumber(1514876915674);
            // vH5WXLoginMsg.loginToken = "8bdd4a6752db4fc9c77882dbbb5432c0";
            // vH5WXLoginMsg.openId = "openId_DEREK_1234567";
            // vH5WXLoginMsg.nickname = "DerekWu5";
            // vH5WXLoginMsg.sex = parseInt("1");
            // vH5WXLoginMsg.headimgurl = "http://qqq.DerekWu.com/DerekWu";
            // ServerUtil.sendMsg(vH5WXLoginMsg);

            //如果是断线重连，这发送登录指令，上一次登录信息需要保存
            if (GConf.Conf.useWXAuth == 1) {
                let vLastWXLoginMsg: H5WXLoginMsg = CommonHandler.getLastWXLoginMsg();
                if (vLastWXLoginMsg) {
                    //断线重连不需要遮罩
                    ServerUtil.sendMsg(vLastWXLoginMsg);
                }
            }
            else if (Game.CommonUtil.isNative) {
                // console.log("WX_LOGIN_MSG");
                let vLastLoginMsg: LoginMsg = CommonHandler.getLastDevLoginMsg();
                if (vLastLoginMsg) {
                    //断线重连不需要遮罩
                    // let getIPUrl = "http://ip.taobao.com/service/getIpInfo2.php?ip=myip";
                    // WxApiUtil.getForcePC(getIPUrl, (revData)=>{
                    //     if (revData.code != 0) {
                    //         console.warn("更新IP失败");
                    //         vLastLoginMsg.clientIP = "fail";
                    //     }
                    //     else {
                    //         vLastLoginMsg.clientIP = revData.data.ip;
                    //         console.log("RESRESH CLIENT IP:", vLastLoginMsg.clientIP);
                    //     }
                    //     ServerUtil.sendMsg(vLastLoginMsg);
                    // }, this);
                    ServerUtil.sendMsg(vLastLoginMsg);
                }
            } else {
                let vLastLoginMsg: LoginMsg = CommonHandler.getLastDevLoginMsg();
                if (vLastLoginMsg) {
                    //断线重连不需要遮罩
                    ServerUtil.sendMsg(vLastLoginMsg);
                }
            }

            // 启动心跳定时器
            if (!this._heartBeatingTimer) {
                // 马上发起一次
                this.heartBeatingTicker();
                // 添加定时任务,3秒钟任务一次
                let timer: Game.Timer = new Game.Timer(3000);
                timer.addEventListener(egret.TimerEvent.TIMER, this.heartBeatingTicker, this);
                timer.start();
                this._heartBeatingTimer = timer;
            }
        }

        private heartBeatingTicker(): void {
            if (!ServerUtil.hasConnect() || CommonData.netSatate === 0) {
                // GameSocket.netDelayTime = 3000; // 3000 表示断网了
                CommonData.lastHeartBeatingStartTimes = 0;
                CommonData.lastHeartBeatingEndTimes = 0;
                // MvcUtil.send(CommonModule.COMMON_CHANGE_NET_MS, GameSocket.netDelayTime);
                return;
            }
            // egret.log("3333");
            // CommonData.heartBeatingID++;
            let vCurrTimes: number = new Date().getTime();
            let vIsInitStartTimes: boolean = false;
            if (CommonData.lastHeartBeatingStartTimes === 0) {
                vIsInitStartTimes = true;
                CommonData.lastHeartBeatingStartTimes = vCurrTimes - 1;
            }
            if (CommonData.lastHeartBeatingEndTimes === 0) {
                CommonData.lastHeartBeatingEndTimes = vCurrTimes - 1;
            }

            // egret.log("heartBeatingTicker lastHeartBeatingStartTimes = " + CommonData.lastHeartBeatingStartTimes);
            // egret.log("heartBeatingTicker lastHeartBeatingEndTimes = " + CommonData.lastHeartBeatingEndTimes);

            // if (RELEASE) { // 发布版本才生效，避免测试的时候出问题，（已废弃），服务端8-12秒钟没有收到会断开连接
                if (CommonData.lastHeartBeatingEndTimes < CommonData.lastHeartBeatingStartTimes) {
                    // ServerUtil.closeConnectedWhenHeartBeatError();
                    // 设置网络延时
                    GameSocket.netDelayTime = 1600 + Math.floor(400 * Math.random());
                    MvcUtil.send(CommonModule.COMMON_CHANGE_NET_MS, GameSocket.netDelayTime);
                    return;
                }
            // }

            // 设置开始时间
            if (!vIsInitStartTimes) {
                CommonData.lastHeartBeatingStartTimes = vCurrTimes;
            }

            // ID 自增
            let heartBeatingID = ++CommonData.heartBeatingID;
            // console.log("heartBeatingID="+heartBeatingID+" lastHeartBeatingStartTimes="+CommonData.lastHeartBeatingStartTimes);
            let heartBeatingAckMsg: HeartBeatingAckMsg = new HeartBeatingAckMsg();
            heartBeatingAckMsg.unused_0 = heartBeatingID;
            ServerUtil.sendMsg(heartBeatingAckMsg);

        }


        /**
         * 处理收到服务端发来的心跳
         * @param {FL.HeartBeatingMsg} msg
         */
        public exeHeartBeatingMsg(msg: HeartBeatingMsg): void {
            let currTimes: number = new Date().getTime();
            if (msg.unused_1 === 1) {
                // console.log("# 收到心跳时间："+currTimes);
                CommonData.lastReceivedServerInitiatedHeartbeatTimes = currTimes;
                return; // 服务端主动发起的消息，不需要回复
            }
            if (CommonData.lastHeartBeatingEndTimes === 0) {
                return;
            }
            CommonData.lastHeartBeatingEndTimes = currTimes; // 设置最后心跳收到的时间
            // egret.log("exeHeartBeatingMsg lastHeartBeatingEndTimes = " + CommonData.lastHeartBeatingEndTimes);
            // egret.log("exeHeartBeatingMsg GlobalData.backFromBackTimes = " + GlobalData.backFromBackTimes);
            GameSocket.lastTime = GameSocket.lastHeartTime = currTimes;
            if (msg.unused_0 && CommonData.heartBeatingID && msg.unused_0 === CommonData.heartBeatingID) {
                // 设置网络延时
                GameSocket.netDelayTime = Math.floor((currTimes - CommonData.lastHeartBeatingStartTimes)/2);
                // console.log(GameSocket.netDelayTime); 
                MvcUtil.send(CommonModule.COMMON_CHANGE_NET_MS, GameSocket.netDelayTime);
                // console.log("netDelayTime="+GameSocket.netDelayTime);
            }


            // 利用服务端每4秒一次的心跳包来检测 是否要离开游戏桌子 , app 版本不检测，服务器一定时间内没有收到心跳会主动断开
            // if (GameConstant.CURRENT_HANDLE.getGameState() !== EGameState.NULL && GlobalData.isIntoBack && !GlobalData.isGameIntoBack && Date.now() > GlobalData.intoBackTimes + 8000) {
            //     //给服务器发送消息
            //     // let vPlayerGameOpertaionMsg: PlayerGameOpertaionMsg = new PlayerGameOpertaionMsg();
            //     // vPlayerGameOpertaionMsg.opertaionID = GameConstant.GAME_OPERTAION_PLAYER_LEFT_TABLE;
            //     // ServerUtil.sendMsg(vPlayerGameOpertaionMsg);
            //
            //     // 给服务器发送消息
            //     let msg = new NewPlayerLeaveRoomMsg();
            //     msg.leaveFlag = 0;
            //     ServerUtil.sendMsg(msg);
            //
            //     GlobalData.isGameIntoBack = true;
            // }
        }

        /**
         * 处理收到微信语音
         */
        public exeWeChatVoiceMsg(msg: WeChatVoiceMsg): void {
            // egret.log("msg.voiceServerId = "+msg.voiceServerId);
            // 收到后马上下载
            WeChatJsSdkHandler.downloadWeChatVoice(msg);
        }

        /**
         * 处理新显示提示消息
         * @param {FL.NewShowTipAckMsg} msg
         */
        public exeNewShowTipAckMsg(msg: NewShowTipAckMsg): void {
            /** 0:错误  1:警告 2:成功  3:弹窗*/
            // egret.log(msg);
            let tipType: number = msg.tipType;
            let tip: string = msg.tip;
            if (tipType === 3) {
                if (msg.clientActionCmd) {
                    ReminderViewUtil.showReminderView({
                        hasLeftBtn: true,
                        hasRightBtn: false,
                        leftCallBack: new MyCallBack(MvcUtil.send, MvcUtil, msg.clientActionCmd),
                        text: tip
                    });
                } else {
                    ReminderViewUtil.showReminderView({ hasLeftBtn: true, hasRightBtn: false, text: tip });
                }
            } else {
                 if (tipType === 0) {
                     PromptUtil.show(tip, PromptType.ERROR);
                 } else if (tipType === 1) {
                     PromptUtil.show(tip, PromptType.ALERT);
                 } else if (tipType === 2) {
                     PromptUtil.show(tip, PromptType.SUCCESS);
                 }
                if (msg.clientActionCmd) {
                    MvcUtil.send(msg.clientActionCmd);
                }
            }
        }

    }
}