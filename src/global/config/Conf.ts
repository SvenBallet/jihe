module FL {
    /**
     * 
     * @Name:   - Conf
     * @Description:  //客户端配置文件
     * "isDev":true,
     "disProfiler":true,
     "logLevel":"Debug",
     "viewWireframe":true,
     "baseUrl":"ws://192.168.1.103:9999/x"
     * @Create: DerekWu on 2017/7/28 13:57
     * @Version: V1.0
     */
    export class GameConf {

        /** 是否是开发模式 */
        public readonly isDev:boolean;
        /** 日志级别 */
        public readonly logLevel:string;
        /** 是否支持WebP格式的图片 */
        public readonly isSupportWebP:boolean;
        /** 是 web 环境 还是 native 环境 */
        public readonly isNative:boolean;
        /** 版本号，大版本号 */
        public readonly version:string;
        /** 版本号，小版本号 */
        public readonly sVersion:string;
        /** 服务端地址 */
        public readonly baseUrl:string;
        /** 资源下载最大线程数 */
        public readonly maxLoadingThread:number;
        /** 皮肤文件名 */
        public readonly thm:string;
        /** 资源文件名 */
        public readonly resConfig:string;
        /** 获得微信头像URL */
        public readonly wxHeadImgUrl:string;

        /** 分享配置 */
        public readonly shareToFriendsTitle:string;  // "shareToFriendsTitle":"【宿州麻将】宿州人自己的棋牌游戏",
        public readonly shareToFriendsDesc:string;  // "shareToFriendsDesc":"有宿州麻将、灵璧夹子、灵璧带拱子、淮北玩法，点击马上进入游戏！",
        public readonly shareToCircleOfFriendsTitle:string;  // "shareToCircleOfFriendsTitle":"【宿州麻将】宿州人自己的棋牌游戏，点击马上进入游戏！",
        public readonly shareImgUrl:string;  // "shareImgUrl":"http://cdn.sjfc08.com/h5/suzhou/suzhou_icon_114.png",'
        public readonly moreGameUrl:string;  // "moreGameUrl":"http://www.tt2kj.com/t23_download.html",
        public readonly wxGongZhongHaoUrl:string;
        public readonly agentMgrUrl:string;

        /** 游戏名字 */
        public readonly gameName:string;
        /** 是否使用微信授权 1=公众号登陆 2=原生微信登陆 其他登陆*/
        public readonly useWXAuth: any;
        /** jssdk准备状态 0=正在准备中，1=准备成功，-1，准备失败*/
        public readonly wxJssdkReady:number = 0;

        /************ 以下为游戏启动后设置的系统参数 *********/
        /** loading遮罩资源名 */
        public readonly loadingShadeRes:string;
        /** 弹窗遮罩资源名 */
        public readonly popupShadeRes:string;
    }

    export class GConf {

        public static readonly Conf:GameConf;

        /**
         * 获得资源跟目录
         * @returns {string}
         */
        public static getResRoot():string {
            if (this.Conf.isDev) {
                return "resource/";
            }
            else if (Game.CommonUtil.isNative){
                return "resource/";
            } else {
                return this.Conf.version+"/resource/";
            }
        }

        /**
         * 获得皮肤文件名, 支持增量更新，后续考虑兼容换肤
         * @returns {string}
         */
        public static getThmFileName():string {
            //TODO 后续考虑兼容换肤
            return this.Conf.thm;
        }

        /**
         * 获得资源配置文件名，支持增量更新， 后续考虑兼容换肤  和 支持webp格式的图片，以减少流量消耗
         * @returns {string}
         */
        public static getResConfigFileName():string {
            //TODO 后续考虑兼容换肤  和 支持webp格式的图片，以减少流量消耗
            return this.Conf.resConfig;
        }

        /**
         * 设置弹窗遮罩资源名字
         * @param {string} resName
         */
        public static setPopupShadeRes(resName:string):void {
            (<any>this.Conf).popupShadeRes = resName;
        }

        /**
         * 设置loading遮罩资源名字
         * @param {string} resName
         */
        public static setLoadingShadeRes(resName:string):void {
            (<any>this.Conf).loadingShadeRes = resName;
        }

        /**
         * 用户管理后台地址
         */
        public static get agentUrl():string {
            if (Game.CommonUtil.isNative) {
                // 原生连接到服务器地址
                if (FL.NativeBridge.getInstance().mTestFlag) {
                    // (<any>FL.GConf).Conf.agentMgrUrl = "http://119.23.141.43:9011/mainServer/agent/agency/agentpage_player.action";
                    (<any>FL.GConf).Conf.agentMgrUrl = "ws://47.106.209.178:9099/mainServer/agent/agency/agentpage_player.action";
                }
                else {
                    // (<any>FL.GConf).Conf.agentMgrUrl = "http://hunanlg.mjiang365.com/mainServer/agent/agency/agentpage_player.action";
                    (<any>FL.GConf).Conf.agentMgrUrl = "ws://47.106.209.178:9099/mainServer/agent/agency/agentpage_player.action";
                }
            }
            else {
                // 测试
                // (<any>FL.GConf).Conf.agentMgrUrl = "http://119.23.141.43:9011/mainServer/agent/agency/agentpage_player.action";
                // 正式
                // (<any>FL.GConf).Conf.agentMgrUrl = "http://hunanlg.mjiang365.com/mainServer/agent/agency/agentpage_player.action";
                // 本地
                (<any>FL.GConf).Conf.agentMgrUrl = "http://192.168.1.109:8081/mainServer/agent/agency/agentpage_player.action";
            }
            return FL.GConf.Conf.agentMgrUrl;
        }

        /**
         * 获取服务器地址
         */
        public static get mBaseUrl():string {
            if (Game.CommonUtil.isNative) {
                // 原生连接到服务器地址
                if (FL.NativeBridge.getInstance().mTestFlag) {
                    // 本机：ws://192.168.1.104:16765
                    // 外网测试：ws://119.23.141.43:16621
                    (<any>FL.GConf).Conf.baseUrl = "ws://47.106.209.178:16765";
                    // (<any>FL.GConf).Conf.baseUrl = "ws://192.168.1.104:16765";
                }
                else {
                    (<any>FL.GConf).Conf.baseUrl = "ws://47.106.209.178:16765";
                }
            }
            else {
                // 没有则链接conf.json配置的地址
                // (<any>FL.GConf).Conf.baseUrl = "ws://192.168.1.104:16765";
                // (<any>FL.GConf).Conf.baseUrl = "ws://119.23.141.43:16621";
                // (<any>FL.GConf).Conf.baseUrl = "ws://hunangw.mjiang365.com";
                (<any>FL.GConf).Conf.baseUrl = "ws://47.106.209.178:16765";//ALI
            }
            return FL.GConf.Conf.baseUrl;
        }
    }


    /** 配置对象 */
    //export let Conf:GameConf;

    // export class Config {
    //
    //     private static _confObj:{[key:string]:any};
    //
    //     public static getStr(pKey:string):string {
    //         if (this._confObj[pKey]) {
    //             return <string>this._confObj[pKey];
    //         } else {
    //             return undefined;
    //         }
    //     }
    //
    //     public static isTrue(pKey:string):boolean {
    //         if (this._confObj[pKey]) {
    //             return <boolean>this._confObj[pKey];
    //         } else {
    //             return undefined;
    //         }
    //     }
    //
    //     public static getNum(pKey:string):number {
    //         if (this._confObj[pKey]) {
    //             return <number>this._confObj[pKey];
    //         } else {
    //             return undefined;
    //         }
    //     }
    //
    //     public static init(obj:Object):void {
    //         if (this._confObj == null) {
    //             this._confObj = obj;
    //         }
    //     }
    // }

}