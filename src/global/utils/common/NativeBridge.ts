module FL {
    /**
     * 原生通信类
     * @copyright 深圳市天天爱科技有限公司
     * @author Sven
     * @date 2018/3/15
     */
    export class NativeBridge {
        // 单例
		private static _only: NativeBridge;

        /**机器码 */
        public machineCode: string = "";
        /**位置信息 */
        public mLocation: any;
        /**分享内容 */
        public mShareData: nativeShareData;
        /**是否安装微信 */
        public mWXFlag: boolean = false;
        /**是否安装闲聊 */
        public mXLFlag: boolean = false;
        /**是否是IOS APPSTORE 版本 */
        public mIOSAppStore: boolean = false;
        /**是否自动走微信登陆流程，测试设为FALSE */
        public static readonly mAutoLogin = true;
        /**分享链接 下载*/
        public static readonly mShareUrl = "http://d.tt2kjgame.com/d?n=lqhnmj#/";
        /**分享链接 茶楼邀请 */
        public static readonly teahouseShareUrl = "liuyangh5.sjfc08.com/join-club/index";
        /**分享魔窗链接 */
        public static readonly mMWshareUrl:string = "https://agswth.mlinks.cc/Aeth";
        /**分享邀请二维码链接 */
        public static readonly mShareCodeUrl: string = "http://wxbeihai.ttaai.com/lqhn/";
        /**分享小程序ID */
        public static readonly mShareMiniId: string = "gh_2a1134e3f828";
        /**分享小程序路径 */
        public static readonly mShareMiniPath: string = "pages/home/main";
        /**分享小程序路径 */
        /**自己的推荐邀请码*/
        public static mInvitecode:string;
        /** 进入微信登陆流程后的标记 */
        public static intoWXLogin:boolean = false;
        /**安卓返回键弹窗引用 */
        public mBackView: ReminderView;
        public mRefreshGpsFlag: boolean = false;
        /**原生包是否为测试包 */
        public mTestFlag: boolean = false;
        /**魔窗房间ID记录 */
        public static mwRoomId: string = "";
        /**微信小程序传低的ID记录 */
        public static wxMiniId: string = "";
        /**安装包版本号 */
        public static appVersion: number = 1.11;
        /**loading版本号 */
        public static version:string = ""
        /**原生版本号 （日期+小时+(分钟？)）*/
        public static readonly _mVersion:string = "12071033";

        private constructor() {
            egret.ExternalInterface.addCallback("EGRET_REV", this.revNativeMessage);  
        }

        public static getInstance():NativeBridge {
			if (!this._only) {
				this._only = new NativeBridge();
			}
			return this._only;
		}

        /**微信第三方包名 */
        public static get packageName() {
            if (Game.CommonUtil.IsIos) {
                return "weixin://"
            }
            else if (Game.CommonUtil.IsAndroid) {
                return "com.tencent.mm";
            }
            return "";
        }

        /**闲聊第三方包名 */
        public static get xlPackageName() {
            if (Game.CommonUtil.IsIos) {
                return "xianliaoreturnback://"
            }
            else if (Game.CommonUtil.IsAndroid) {
                return "org.xianliao";
            }
            return "";
        }

        /**原生版本号补充 */
        public static get mVersion():string {
            if (Game.CommonUtil.isNative) {
                return "_n_"+NativeBridge._mVersion;
            }
            else {
                return "";
            }
        }

        /**测试服标记字符串 */
        public static get mTest():string {
            if (NativeBridge.getInstance().mTestFlag) {
                return "_test";
            }
            else {
                return "";
            }
        }

        /**是否屏蔽IOS端微信相关功能 */
        public static get IOSMask():boolean {
            let inst:NativeBridge = NativeBridge.getInstance();
            if ((!inst.mWXFlag ) && inst.mIOSAppStore) {
                return true;
            }
            return false;
        }

        /**原生消息接收 */
        private revNativeMessage(msg: string) {
            if (!msg) {
                console.warn("egret rev msg abnormal");
            }

            // console.log("revMSG::");
            // console.log(msg);
            let revData: any;
            try{
                revData = JSON.parse(msg);
            }catch(e){}

            let msgType: RevNativeMsgType = revData.eventType || 0;
            switch (msgType) {
                case RevNativeMsgType.REV_NATIVE_TEST:
                    if (revData.data.testFlag) {
                        NativeBridge.getInstance().mTestFlag = true;
                    }
                    if (revData.data.appVersion) {
                        NativeBridge.appVersion = Number(revData.data.appVersion);
                        NativeBridge.version = "版本:" + revData.data.appVersion;
                    }
                    break;
                case RevNativeMsgType.REV_NATIVE_WX_CODE:
                    WxApiUtil.revNativeWXCode(revData.data.code);
                    break;
                case RevNativeMsgType.REV_NATIVE_XL_CODE:
                    XlApiUtil.revNativeWXCode(revData.data.code);
                    break;
                case RevNativeMsgType.REV_NATIVE_LOCATION:
                    NativeBridge.getInstance().mLocation = revData.data;
                    if (NativeBridge.getInstance().mRefreshGpsFlag) {
                         MvcUtil.send(CommonModule.COMMON_CHANGE_GPS);
                    }
                    break;
                case RevNativeMsgType.REV_NATIVE_BATTERY:
                    MvcUtil.send(CommonModule.COMMON_RE_BATTERY, revData.data.battery);
                    break;
                case RevNativeMsgType.REV_NATIVE_CONNECT_TYPE:
                    CommonData.netSatate = revData.data.connectType;
                    MvcUtil.send(CommonModule.COMMON_RE_CONNECT_STATE, revData.data.connectType);
                    break;
                case RevNativeMsgType.REV_NATIVE_UDID:
                    NativeBridge.getInstance().machineCode = revData.data.udid;
                    break;
                case RevNativeMsgType.REV_NATIVE_CLIPBOARD:
                    MvcUtil.send(CommonModule.COMMON_NATIVE_PARSE_CLIPBOARD, revData.data.clipboard);
                    break;
                case RevNativeMsgType.REV_NATIVE_MW_PARAM:
                    MvcUtil.send(CommonModule.COMMON_NATIVE_PARSE_MV_PARAM, revData.data.mw);
                    break;
                case RevNativeMsgType.REV_NATIVE_WX_PAY_RESULT:
                    break;
                case RevNativeMsgType.REV_NATIVE_WX_SHARE_RESULT:
                    let shareRoad = Number(NativeBridge.getInstance().mShareData.road);
                    let sharePlatform = Number(NativeBridge.getInstance().mShareData.platform);
                    if (sharePlatform == SharePlatform.SHARE_XL) {
                        MvcUtil.send(CommonModule.COMMON_SHARE_TO_FRIENDS_SUCCESS);
                    }
                    else {
                        if (shareRoad == ShareWXRoad.SHARE_SESSION) {
                            MvcUtil.send(CommonModule.COMMON_SHARE_TO_FRIENDS_SUCCESS);
                        }
                        else if(shareRoad == ShareWXRoad.SHARE_TIMELINE) {
                            if (NativeBridge.getInstance().mShareData.url) {
                                MvcUtil.send(CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS, true);
                            }
                            else {
                                MvcUtil.send(CommonModule.COMMON_SHARE_TO_CIRCLE_OF_FRIENDS_SUCCESS);
                            }
                        }
                    }
                    break;
                case RevNativeMsgType.REV_NATIVE_ONTOUCH_BACK:
                    MvcUtil.send(CommonModule.COMMON_NATIVE_ONTOUCH_BACK);
                    break;
                case RevNativeMsgType.REV_NATIVE_WX_INSTALLED:
                    if (revData.data && revData.data.installed && revData.data.installed != "0") {
                        NativeBridge.getInstance().mWXFlag = true;
                    }
                    else {
                        console.warn("not installed wx");
                        NativeBridge.getInstance().mWXFlag = false;
                    }
                    if (revData.data && revData.data.installedXL && revData.data.installedXL != "0") {
                        NativeBridge.getInstance().mXLFlag = true;
                    }
                    else {
                        console.warn("not installed xl");
                        NativeBridge.getInstance().mXLFlag = false;
                    }
                    FL.MvcUtil.addView(FL.ViewManager.getLoginBg());
                    FL.MvcUtil.addView(new FL.LoginView());
                    break;
                case RevNativeMsgType.REV_NATIVE_IOS_TYPE:
                    NativeBridge.getInstance().mIOSAppStore = revData.data.IOSType?true:false;
                    break;
                case RevNativeMsgType.REV_NATIVE_RECORD_END:
                    MvcUtil.send(CommonModule.COMMON_SEND_TALK_VOICE, revData.data.voiceData);
                    break;
                case RevNativeMsgType.REV_NATIVE_RECORD_PLAY_COMPLETE:
                    TalkCache.nextTalk();
                    break;
                case RevNativeMsgType.REV_NATIVE_RECORD_VOICE:
                    MvcUtil.send(CommonModule.COMMON_RE_TALK_VOICE, Number(revData.data.level));
                    break;
                case RevNativeMsgType.REV_NATIVE_RECORD_VOICE:
                    MvcUtil.send(CommonModule.COMMON_RE_TALK_VOICE, Number(revData.data.level));
                    break;
                case RevNativeMsgType.REV_NATIVE_XL_INVITE:
                    console.log("revMSG::");
                    console.log(msg);
                    MvcUtil.send(CommonModule.COMMON_XL_INVITE, revData.data);
                    break;
                case RevNativeMsgType.REV_NATIVE_WX_MINI_PARAM:
                    console.log("revWXPARAMMSG::");
                    console.log(msg);
                    MvcUtil.send(CommonModule.COMMON_WX_MINI_PARAM, revData.data);
                    break;
                default:
                    console.warn("rev msg type abnormal")
                    break;
            }
        }

        /**原生消息发送 */
        public sendNativeMessage(msg: string) {
            if (!Game.CommonUtil.isNative) return;
            // console.log("sendMSG::");
            // console.log(msg);
            egret.ExternalInterface.call("EGRET_SEND", msg);
        }

        /** MAIN调用时注册的定时器 */
        public static initMainTimer() {
            let timer: Game.Timer = new Game.Timer(1000);
            timer.addEventListener(egret.TimerEvent.TIMER, ()=>{
                // 网络
                if (!NativeBridge.getInstance().mTestFlag) {
                    let netData = {
                        "eventType": SendNativeMsgType.SEND_NATIVE_GET_CONNECT_TYPE,
                        "data": {
                        }
                    }
                    NativeBridge.getInstance().sendNativeMessage(JSON.stringify(netData));
                }
            }, this);
            timer.start();
        }
    }

    /**分享类型 */
    export enum ShareWXType {
        SHARE_TEXT,
        SHARE_IMG,
        SHARE_URL,
        SHARE_MINI
    }

    /**微信分享 会话、朋友圈, 闲聊 */
    export enum ShareWXRoad {
        SHARE_SESSION,
        SHARE_TIMELINE
    }

    /**分享途径 */
    export enum SharePlatform {
        SHARE_WX,
        SHARE_XL
    }

    /**闲聊邀请类型 */
    export enum InviteXLType {
        INVITE_ROOM,
        INVITE_TEAHOUSE,
        INVITE_CODE,
        INVITE_REWARD_CODE
    }

    /**原生分享数据 */
    export class nativeShareData {
        /**分享途径 */
        public platform: SharePlatform = SharePlatform.SHARE_WX;
        /**分享方式 */
        public road: string = ShareWXRoad.SHARE_SESSION + "";
        /**分享类型 */
        public type: ShareWXType;
        /**分享文本 */
        public text: string;
        /**分享图片base64字符串 */
        public baseStr: string;
        /**分享链接 */
        public url: string;
        /**链接标题 */
        public title: string;
        /**链接内容描述 */
        public desc: string;
        /**额外内容类型 */
        public extraType: number = InviteXLType.INVITE_ROOM;
        /**额外内容 */
        public extraContent: string = "0";
        /**小程序ID */
        public miniID: string;
        /**小程序路径 */
        public miniPath: string;
        /**分享源APPID */
        public origionAppID: string;
    }

    /**录音结束状态 */
    export enum RecordResult {
        RECORD_CANCLE,
        RECORD_SUCCESS
    }

    /**接收的原生消息 */
    class RevNativeMsgType {
        /** 测试消息，改为区分原生包是否为测试包*/
        public static readonly REV_NATIVE_TEST: string = "REV_NATIVE_TEST";
        /** 接收微信登陆CODE*/ 
        public static readonly REV_NATIVE_WX_CODE: string = "REV_NATIVE_WX_CODE";
        /** 接收闲聊登陆CODE */
        public static readonly REV_NATIVE_XL_CODE: string = "REV_NATIVE_XL_CODE";
        /** 获取设备电池*/
        public static readonly REV_NATIVE_BATTERY: string = "REV_NATIVE_BATTERY";
        /** 获取网络类型、状态*/
        public static readonly REV_NATIVE_CONNECT_TYPE: string = "REV_NATIVE_CONNECT_TYPE";
        /** 获取设备UDID号*/
        public static readonly REV_NATIVE_UDID: string = "REV_NATIVE_UDID";
        /** 获取地理位置*/
        public static readonly REV_NATIVE_LOCATION: string = "REV_NATIVE_LOCATION";
        /** 获取剪贴板内容 */
        public static readonly REV_NATIVE_CLIPBOARD: string = "REV_NATIVE_CLIPBOARD";
        /** 微信支付结果接收 */
        public static readonly REV_NATIVE_WX_PAY_RESULT: string = "REV_NATIVE_WX_PAY_RESULT";
        /** 微信分享结果接收, 闲聊分享结果接收 */
        public static readonly REV_NATIVE_WX_SHARE_RESULT: string = "REV_NATIVE_WX_SHARE_RESULT";
        /** 接收小程序跳转参数*/
        public static readonly REV_NATIVE_WX_MINI_PARAM: string = "REV_NATIVE_WX_MINI_PARAM";
        /** 闲聊接受邀请 */
        public static readonly REV_NATIVE_XL_INVITE: string = "REV_NATIVE_XL_INVITE";
        /** 手机返回键点击 */
        public static readonly REV_NATIVE_ONTOUCH_BACK: string = "REV_NATIVE_ONTOUCH_BACK";
        /** 返回是否安装微信 */
        public static readonly REV_NATIVE_WX_INSTALLED: string = "REV_NATIVE_WX_INSTALLED";
        /** 返回IOS版本类型 */
        public static readonly REV_NATIVE_IOS_TYPE: string = "REV_NATIVE_IOS_TYPE";
        /** 返回录音结果 */
        public static readonly REV_NATIVE_RECORD_END: string = "REV_NATIVE_RECORD_END";
        /**返回录音音量 */
        public static readonly REV_NATIVE_RECORD_VOICE: string = "REV_NATIVE_RECORD_VOICE";
        /** 录音播放完成 */
        public static readonly REV_NATIVE_RECORD_PLAY_COMPLETE: string = "REV_NATIVE_RECORD_PLAY_COMPLETE";
        /** 接收魔窗参数*/
        public static readonly REV_NATIVE_MW_PARAM: string = "REV_NATIVE_MW_PARAM";
    }

    /**发送的原生消息 */
    export class SendNativeMsgType {
        /** 测试消息*/
        public static readonly SEND_NATIVE_TEST: string = "SEND_NATIVE_TEST";
        /** 关闭闪屏*/
        public static readonly SEND_NATIVE_OFF_SPLASH: string = "SEND_NATIVE_OFF_SPLASH";
        /** 请求微信登陆CODE*/
        public static readonly SEND_NATIVE_GET_WX_CODE: string = "SEND_NATIVE_GET_WX_CODE";
        /** 请求闲聊登陆CODE*/
        public static readonly SEND_NATIVE_GET_XL_CODE: string = "SEND_NATIVE_GET_XL_CODE";
        /** 获取设备电池*/
        public static readonly SEND_NATIVE_GET_BATTERY: string = "SEND_NATIVE_GET_BATTERY";
        /** 获取网络类型、状态（1.wifi 2.gprs 0.无）*/
        public static readonly SEND_NATIVE_GET_CONNECT_TYPE: string = "SEND_NATIVE_GET_CONNECT_TYPE";
        /** 获取设备UDID号*/
        public static readonly SEND_NATIVE_GET_UDID: string = "SEND_NATIVE_GET_UDID";
        /** 获取地理位置, 高德地图SDK*/
        public static readonly SEND_NATIVE_GET_LOCATION: string = "SEND_NATIVE_GET_LOCATION";
        /** 获取剪贴板内容 */
        public static readonly SEND_NATIVE_GET_CLIPBOARD: string = "SEND_NATIVE_GET_CLIPBOARD";
        /** 设置剪贴板内容 */
        public static readonly SEND_NATIVE_SET_CLIPBOARD: string = "SEND_NATIVE_SET_CLIPBOARD";
        /** 发送微信支付订单(订单生成内容无法假数据模拟，暂未测试) */
        public static readonly SEND_NATIVE_SEND_WX_PAY: string = "SEND_NATIVE_SEND_WX_PAY";
        /** 分享到微信 */
        public static readonly SEND_NATIVE_SHARE_TO_WX: string = "SEND_NATIVE_SHARE_TO_WX";
        /** 根据包名打开第三方应用 */
        public static readonly SEND_NATIVE_OPEN_ELSE_APP: string = "SEND_NATIVE_OPEN_ELSE_APP";
        /** 关闭游戏*/
        public static readonly SEND_NATIVE_QUIT_GAME: string = "SEND_NATIVE_QUIT_GAME";
        /** 是否安装微信*/
        public static readonly SEND_NATIVE_WX_INSTALLED: string = "SEND_NATIVE_WX_INSTALLED";
        /** 发起苹果支付请求*/
        public static readonly SEND_NATIVE_IAP_PAY: string = "SEND_NATIVE_IAP_PAY";
        /** 获取IOS版本 APPSTORE 或 企业证书版*/
        public static readonly SEND_NATIVE_GET_IOS_TYPE: string = "SEND_NATIVE_GET_IOS_TYPE";
        /** 发送录音开始 */
        public static readonly SEND_NATIVE_RECORD_BEGIN: string = "SEND_NATIVE_RECORD_BEGIN";
        /** 发送录音结束 */
        public static readonly SEND_NATIVE_RECORD_END: string = "SEND_NATIVE_RECORD_END";
        /** 获取录音音量 */
        public static readonly SEND_NATIVE_GET_RECORD_VOICE: string = "SEND_NATIVE_GET_RECORD_VOICE";
        /** 发送播放语音 */
        public static readonly SEND_NATIVE_RECORD_PLAY: string = "SEND_NATIVE_RECORD_PLAY";
        /** 浏览器打开链接 */
        public static readonly SEND_NATIVE_OPEN_URL: string = "SEND_NATIVE_OPEN_URL";
        /** 获取魔窗参数*/
        public static readonly SEND_NATIVE_GET_MW_PARAM: string = "SEND_NATIVE_GET_MW_PARAM";
    }

    /**分享APPID管理类 */
    export class ShareAppIDManager {
        public static appIDList: Array<string> = [
            /**
             * 本体,乐趣湖南
             */
            // "wxd1615220058b0405",
            /**
             * 开放平台 魔幻积木
             * AppID：wx5394600901a68208
             * AppSecret: f0bff55c26895781a08487d9f46ac595
             */
            // "wx5394600901a68208",
            /**
             * 开放平台  开心飞行棋
             * AppID：wxc7091427ee1783c5
             * AppSecret: 7ba973bdd3cf65009fdc16c5ee13bdf2
             */
            // "wxc7091427ee1783c5",
            /**
             * 开放平台 黑白五子棋
             * AppID：wx6da783599c91fc6d
             * AppSecret: 205eb1c7059f4cdbb815fddef833ee93
             */
            // "wx6da783599c91fc6d",
            /**
             * 开放平台 五子连
             * AppID：wx74198bd6d92e4450
             * AppSecret: 6725062291a9adb31ecf3dcadc0a5dab
             */
            // "wx74198bd6d92e4450",
            /**
             * 乐乐休闲，只能分享用
             * AppID：wx6a0ab960a231bc11
             * AppSecret: d0042b6b1ccbacbdc76b763a9d8c9b85
             */
            "wx6a0ab960a231bc11"

        ];

        /**
         * 随机获取一个分享源APPID
         */
        public static get shareAppID():string {
            let str: string = ShareAppIDManager.appIDList[0];
            let num: number = Math.floor(Math.random() * (ShareAppIDManager.appIDList.length));
            if (ShareAppIDManager.appIDList[num]) str = ShareAppIDManager.appIDList[num];
            console.log("SHARE_APPID:"+str);
            return str;
        }
    }
}