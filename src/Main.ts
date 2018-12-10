//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


// 资源配置，您可以访问
// https://github.com/egret-labs/resourcemanager/tree/master/docs
// 了解更多细节

import MvcUtil = FL.MvcUtil;
import MyCallBackUtil = FL.MyCallBackUtil;
import ViewLayerEnum = FL.ViewLayerEnum;

// 强制使用库项目库，不使用系统promise
this.Promise = 2;
this.ES6Promise.polyfill();

@RES.mapConfig("config.json", () => "resource", path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var typeMap = {
        "jpg": "image",
        "png": "image",
        "webp": "image",
        "json": "json",
        "fnt": "font",
        "pvr": "pvr",
        "mp3": "sound"
    }
    var type = typeMap[ext];
    if (type == "json") {
        if (path.indexOf("sheet") >= 0) {
            type = "sheet";
        } else if (path.indexOf("movieclip") >= 0) {
            type = "movieclip";
        };
    }
    return type;
})

class Main extends eui.UILayer {

    /** 首页当前进度条百分比,默认50 */
    public static indexCurrProcessValue: number = 60;

    protected createChildren(): void {

        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        });

        egret.lifecycle.onPause = () => {
            if (RELEASE) {
                egret.ticker.pause();
                MvcUtil.send(FL.AppModule.APP_INTO_BACKSTAGE);
            }
        };

        egret.lifecycle.onResume = () => {
            if (RELEASE) {
                egret.ticker.resume();
                MvcUtil.send(FL.AppModule.APP_BACK_FROM_BACKSTAGE);
            }
        };

        // 同时只能触摸一个点
        this.stage.maxTouches = 1;
        let mVersion = 1555;
        console.log("mVersion:" + mVersion);

        // Native环境初始化数据对象
        if (Game.CommonUtil.isNative) {
            console.log("isNative");
            window["globalMyGameParamsJson"] = { "isDev": false, "logLevel": "error", "maxLoadingThread": 4, "logoImgUrl": "logo.png", "useWXAuth": true, "gameId": "ttasuzhoumahjongtest", "gameName": "乐趣湖南麻将", "appId": "wx36af02480dee4979", "wxAuthScope": "snsapi_userinfo", "wxAuthRedirectUri": "http://test.sjfc08.com/aiyoule/h5/authUserInfo", "autoAuthUrl": "http://test.sjfc08.com/aiyoule/h5/autoAuth", "jssdkSignatureUrl": "http://test.sjfc08.com/aiyoule/h5/jssdkSignature", "wxHeadImgUrl": "http://hunangzh.mjiang365.com/aiyoule/h5/wxHeadImg", "shareToFriendsTitle": "天天爱宿州麻将\n宿州人自己的棋牌游戏", "shareToFriendsDesc": "有 宿州麻将、灵璧夹子、灵璧带拱子、淮北玩法、砀山玩法，点击进入！", "shareToCircleOfFriendsTitle": "天天爱宿州麻将\n宿州人自己的棋牌游戏，点击进入！", "shareImgUrl": "http://cdn.sjfc08.com/h5/suzhou/suzhou_icon_114.png", "moreGameUrl": "http://www.tt2kj.com/t23_download.html", "wxGongZhongHaoUrl": "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0MjI4NDM3OA==&scene=124#wechat_redirect", "agentMgrUrl": "http://hunanlg.mjiang365.com/mainServer/agent/agency/agentpage_player.action", "jssdkDebug": true, "version": "V1.0", "sVersion": "V1.0.17121301", "manifest": "manifest.json", "thm": "default.thm.json", "resConfig": "config.json", "baseUrl": "ws://hunangw.mjiang365.com", "jssdkApiList": ["onMenuShareTimeline", "onMenuShareAppMessage", "getLocation", "hideOptionMenu", "showOptionMenu", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "closeWindow", "chooseWXPay", "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice", "stopVoice", "onVoicePlayEnd", "uploadVoice", "downloadVoice"] }

            window["myGameConfJson"] = window["globalMyGameParamsJson"];
        }

        //初始化 客户端 配置,改为外部加载
        // (<any>FL.GConf).Conf = RES.getRes("game_conf_json");
        (<any>FL.GConf).Conf = window["myGameConfJson"];

        // console.log("收到 (-9)");
        // console.log("收到啊 (+10)");
        // console.log("收到dsdf : +2");
        // console.log("收到收到 : +1");
        // console.log("收到a : + 7");

        // 微信登陆标识区分
        if (FL.GConf.Conf.useWXAuth) {
            if (Game.CommonUtil.isNative) {
                (<any>FL.GConf).Conf.useWXAuth = 2;
            }
            else {
                (<any>FL.GConf).Conf.useWXAuth = 1;
            }
        }

        //初始化Url参数
        if (window["globalMyGameParamsJson"]) {
            (<any>FL.GUrlParam).UrlParam = window["globalMyGameParamsJson"];
        }
        //微信授权信息
        if (FL.GConf.Conf.useWXAuth == 1) {
            (<any>FL.GWXAuth).WXAuth = window["globalWXAuthInfoJson"];
        }

        //设置日志级别
        /**
         * <ul>
         * <li>Logger.ALL -- 所有等级的log都可以打印出来。</li>
         * <li>Logger.DEBUG -- 可以打印debug、info、log、warn、error。</li>
         * <li>Logger.INFO -- 可以打印info、log、warn、error。</li>
         * <li>Logger.WARN -- 可以打印warn、error。</li>
         * <li>Logger.ERROR -- 可以打印error。</li>
         * <li>Logger.OFF -- 全部关闭。</li>
         * </ul>
         */
        if (FL.NativeBridge.getInstance().mTestFlag) {
            egret.Logger.logLevel = "info";
        }
        else {
            egret.Logger.logLevel = FL.GConf.Conf.logLevel;
        }

        //设置资源加载进程数
        RES.setMaxLoadingThread(FL.GConf.Conf.maxLoadingThread);

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        // let vMyGameConfJson = window["myGameConfJson"];
        // let vResRoot:string;
        // if (vMyGameConfJson.isDev) {
        //     vResRoot = "resource/";
        // } else {
        //     vResRoot = vMyGameConfJson.version+"/resource/";
        // }
        // RES.resourceRoot = vResRoot;
        // let theme = new eui.Theme(vResRoot+vMyGameConfJson.thm, this.stage);

        // let vStage:egret.Stage = egret.MainContext.instance.stage;
        // let vPlayerOption:PlayerOption = (<any>vStage.$screen).playerOption;

        // 更改下载线程数，放大一倍，默认值是2
        // RES.setMaxLoadingThread(4);

        //初始化puremvc
        FL.AppFacade.getInstance().start(this);
        //注册公共模块
        FL.ModuleManager.regModule(FL.CommonModule.NAME, FL.CommonModule.getInstance());

        //游戏初始化提示
        // this.alertInitInfo();

        //初始化游戏驱动
        Game.GameDrive.getInstance().start();

        FL.ImgGCManager.init();
        FL.StageUtil.init(this.stage);

        //初始化
        this.init();
    }

    /**
     * 提示初始化信息（有了外部的js进度条，废弃这个）
     */
    // private alertInitInfo():void {
    //     let vAlertLabel:eui.Label = new eui.Label("正在初始化...");
    //     vAlertLabel.horizontalCenter = vAlertLabel.verticalCenter = 0;
    //     vAlertLabel.textColor = 0x000000;
    //     vAlertLabel.fontFamily = "SimHei";
    //     vAlertLabel.touchEnabled = false;
    //     vAlertLabel.size = 36;
    //     vAlertLabel[FL.ViewEnum.viewLayer] = FL.ViewLayerEnum.BOTTOM_ONLY;
    //     FL.MvcUtil.addView(vAlertLabel);
    // }

    /**
     * 初始化 
     */
    private async init() {
        try {
            //设置资源跟路径
            RES.resourceRoot = FL.GConf.getResRoot();
            //设置资源配置
            RES.setConfigURL(FL.GConf.getResConfigFileName());
            console.log("LOADCONF BEFO");
            //加载配置文件
            await RES.loadConfig();
            console.log("LOADCONF LAST");

            // 进度前进 5%
            FL.IndexProxy.setIndexProgress(Main.indexCurrProcessValue += 5, 100);

            // egret.log("initGame loadConfig over");

            //初始化除了公共模块之外的pureMVC模块
            this.regPureMVCModules();

            //初始化缓动字典
            FL.TweenDict.init();

            //加载preload资源组
            await RES.loadGroup("preload");

            //---test
            // await RES.loadGroup("rfgame");

            // 进度前进 5%
            FL.IndexProxy.setIndexProgress(Main.indexCurrProcessValue += 5, 100);

            //设置文本code code_text_json
            FL.Local.init(RES.getRes("code_text_json"));

            //设置loading遮罩
            FL.GConf.setLoadingShadeRes("loading_shade_bg_png");
            //设置弹窗遮罩
            FL.GConf.setPopupShadeRes("shade_bg_png");

            //链接服务器（废弃，放后面处理）
            // FL.ServerUtil.init(FL.GConf.Conf.baseUrl);


            // 其他资源加载任务
            let vOtherAllPromiseTaskReporter: FL.RESPromiseTaskReporter = new FL.RESPromiseTaskReporter();

            if (FL.GConf.Conf.useWXAuth == 1) {
                //开始加载
                await RES.loadGroup("common", 0, vOtherAllPromiseTaskReporter);
                await RES.loadGroup("mjgame", 0, vOtherAllPromiseTaskReporter);

                //-----test
                await RES.loadGroup("rfgame", 0, vOtherAllPromiseTaskReporter);
                await RES.loadGroup("teahouse", 0, vOtherAllPromiseTaskReporter);
                await RES.loadGroup("mahjong", 0, vOtherAllPromiseTaskReporter);
                // await RES.loadGroup("otherAll", 0, vOtherAllLoadingTask);
            } else {
                //加载login资源组
                await RES.loadGroup("login", 0, vOtherAllPromiseTaskReporter);
            }

            //初始化logo背景图片(废弃)
            // let vLogoBg:FL.FullSameRatioImage = new FL.FullSameRatioImage("Flash_Screen_jpg");
            // vLogoBg[FL.ViewEnum.viewLayer] = FL.ViewLayerEnum.BOTTOM_ONLY;
            // FL.MvcUtil.addView(vLogoBg);

            //初始化logo背景图片，显示3秒后移除，渐隐效果以后再说 (废弃)
            // if (FL.GConf.Conf.isDev) {
            //     FL.MyCallBackUtil.delayedCallBack(500, this.onViewLogoOver, this, [vLogoBg]);
            // } else {
            //     FL.MyCallBackUtil.delayedCallBack(3000, this.onViewLogoOver, this, [vLogoBg]);
            // }

            // //加载登录资源
            // await RES.loadGroup("login");
            // //加载预加载
            // await RES.loadGroup("preload");
            // //加载大厅资源，后续再优化加载顺序
            // await RES.loadGroup("lobby");
            // //加载公共资源
            // await RES.loadGroup("common");
            // //加载对战记录资源
            // await RES.loadGroup("record");
            // //加载麻将游戏资源
            // await RES.loadGroup("mjgame");

            //加载其他资源
            // await RES.loadGroup("agreement");
            // await RES.loadGroup("otherAll");

            let theme = new eui.Theme(FL.GConf.getResRoot() + FL.GConf.getThmFileName(), this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

            //预加载结束
            this.onPreloadComlete();

            // 更改下载线程数（去掉）
            // RES.setMaxLoadingThread(1);

            MyCallBackUtil.delayedCallBack(1500, this.loadingOther, this);
            // //加载loading组员组
            // await RES.loadGroup("loading");

            // //发送预加载结束指令
            // FL.MvcUtil.send(FL.CommonModule.COMMON_PRELOAD_OVER);

            //播放背景音乐，在声音加载完成之后会自动播放
            FL.SoundManager.enableSound();
            // FL.SoundManager.playBg("game_bg_mp3");

            //最后加载声音
            // RES.getResAsync("game_bg_mp3", this.enableSound, this);
            // RES.getResAsync("lobby_bg_mp3", this.enableSound, this);
            // await RES.getResAsync("game_bg_mp3");
            // FL.SoundManager.enableSound();
            // await RES.getResAsync("lobby_bg_mp3");
            // FL.SoundManager.enableSound();
            // await RES.loadGroup("sound");

        } catch (e) {
            FL.AsyncError.exeError(e);
        }
    }

    private async loadingOther() {
        await RES.loadGroup("animate");
        await RES.loadGroup("emoji");
    }

    /**
     * 注册pureMvc模块 
     */
    private regPureMVCModules(): void {
        //注册登录模块
        FL.ModuleManager.regModule(FL.LoginModule.NAME, FL.LoginModule.getInstance());
        FL.ModuleManager.regModule(FL.PayModule.NAME, FL.PayModule.getInstance());
        FL.ModuleManager.regModule(FL.LobbyModule.NAME, FL.LobbyModule.getInstance());
        FL.ModuleManager.regModule(FL.RecordModule.NAME, FL.RecordModule.getInstance());
        FL.ModuleManager.regModule(FL.MallModule.NAME, FL.MallModule.getInstance());
        FL.ModuleManager.regModule(FL.AgentModule.NAME, FL.AgentModule.getInstance());
        FL.ModuleManager.regModule(FL.MJGameModule.NAME, FL.MJGameModule.getInstance());
        FL.ModuleManager.regModule(FL.ActivityModule.NAME, FL.ActivityModule.getInstance());
        FL.ModuleManager.regModule(FL.ClubModule.NAME, FL.ClubModule.getInstance());
        FL.ModuleManager.regModule(FL.RFGameModule.NAME, FL.RFGameModule.getInstance());
        FL.ModuleManager.regModule(FL.TeaHouseModule.NAME, FL.TeaHouseModule.getInstance());
        FL.ModuleManager.regModule(FL.MahjongModule.NAME, FL.MahjongModule.getInstance());
    }

    /**
     * 激活声音
     */
    // private enableSound():void {
    //     //加载完成后激活
    //     FL.SoundManager.enableSound();
    // }



    /** 主题文件是否加载完整 */
    private isThemeLoadEnd: boolean = false;
    /** 初始化logo背景图片，显示3秒后移除 是否结束 (废弃)*/
    // private isViewLogoOver: boolean = false;
    /** 预加载是否完毕 */
    private isPreloadEnd: boolean = false;

    /**
     * 主题文件加载完成
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        // egret.log("onThemeLoadComplete");
        // 进度前进 10%
        FL.IndexProxy.setIndexProgress(Main.indexCurrProcessValue += 10, 100);
        this.startGame();
    }

    /**
     * 显示logo完毕(废弃)
     */
    // private onViewLogoOver(pLogoComp:FL.FullSameRatioImage):void {
    //     this.isViewLogoOver = true;
    //     // egret.log("onViewLogoOver");
    //     this.startGame();
    // }

    /** 预加载完毕 */
    private onPreloadComlete(): void {
        this.isPreloadEnd = true;
        // egret.log("onPreloadComlete");
        this.startGame();
    }

    /**
     * 启动游戏 
     */
    private startGame(): void {
        //三个都完成才能启动
        // if (!this.isThemeLoadEnd || !this.isViewLogoOver || !this.isPreloadEnd) return;
        if (!this.isThemeLoadEnd || !this.isPreloadEnd) return;

        //使用微信授权的处理不一样
        if (FL.GConf.Conf.useWXAuth == 1) {
            //发送微信登录信息
            FL.MvcUtil.send(FL.LoginModule.LOGIN_WEIXIN_LOGIN);
        }
        //原生微信登录
        else if (FL.GConf.Conf.useWXAuth == 2 || FL.GConf.Conf.useWXAuth == 3) {
            let idData = {
                "eventType": FL.SendNativeMsgType.SEND_NATIVE_WX_INSTALLED,
                "data": {
                }
            }
            FL.NativeBridge.getInstance().sendNativeMessage(JSON.stringify(idData));

            // 启动定时器
            FL.NativeBridge.initMainTimer();
        }
        else {
            //登录背景
            FL.MvcUtil.addView(FL.ViewManager.getLoginBg());
            //打开登录界面
            FL.MvcUtil.addView(new FL.LoginView());

            // 删除首页显示
            FL.IndexProxy.removeInitView();
        }
    }
}

