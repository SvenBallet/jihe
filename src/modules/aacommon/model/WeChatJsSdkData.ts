module FL {

    /**
     * 在分享位置
     */
    export enum ShareLocationEnum {
        LOBBY, // 大厅中
        VIP_ROOM,  // vip房间中
        GOLD_GAME_OVER, // 金币场牌局结算  , 暂时和大厅分享一样，看图片分享效果好不好再说
        VIP_ROOM_GAME_OVER, // vip房间牌局结算，小结算  , 暂时和大厅分享一样，看图片分享效果好不好再说
        ROOM_OVER // vip房间结束大结算  , 暂时和大厅分享一样，看图片分享效果好不好再说
    }

    /**
     * 微信语音类型
     */
    // export enum WeChatVoiceTypeEnum {
    //     GAME = 1 // 打麻将游戏中录音
    // }

    /**
     * 微信语音功能的各种状态
     */
    // export enum WeChatVoiceStateEnum {
    //     NORMAL, // 正常状态
    //     RECORDING,  // 录音中
    //     PLAYING, // 播放中
    //     UPLOADING, // 上传中
    //     DOWNLOADING // 下载中
    // }

    /**
     * 微信语音场景枚举
     */
    export enum WeChatVoiceSceneEnum {
        GAME = 1  //1=游戏中录音，其他可以再拓展
    }

    /**
     * 微信语音动作枚举
     */
    export enum WeChatVoiceActionEnum {
        RECORD,  // 录音
        STOP_RECORD, //停止录音
        PLAY, // 播放
        UPLOAD, // 上传
        DOWNLOAD // 下载
    }

    /**
     * 自定义的微信语音动作
     */
    export class WeChatVoiceAction {

        /** 语音ID计数 这个是自己的ID，不同意微信语音的localId 和 serverId */
        private static ACTION_ID_COUNT:number = 1;

        /** 语音动作ID */
        public readonly actionId:number;
        /** 语音动作 */
        public readonly voiceAction:WeChatVoiceActionEnum;
        /** 语音动作发出场景 */
        public readonly voiceScene:WeChatVoiceSceneEnum;
        /** 语音的localId */
        public readonly localId:string;
        /** 语音的serverId */
        public readonly serverId:string;
        /** 目标动作ID，标识和本动作关联的actionId */
        public readonly targetActionId:number;
        /** 目标动作开始时间 */
        public readonly targetStartTimes:number;
        /** 是否处理中，刚创建的时候 */
        public readonly isInHandle:boolean = false;
        /** 开始时间 */
        public readonly startTimes:number;
        /** 携带数据，比如在播放接口中携带自己的数据，比如playerPos座位位置 */
        public readonly data:any;

        constructor(voiceAction:WeChatVoiceActionEnum, voiceScene:WeChatVoiceSceneEnum, localId?:string, serverId?:string, targetActionId?:number, targetStartTimes?:number, data?:any) {
            this.actionId = WeChatVoiceAction.ACTION_ID_COUNT++;
            this.voiceAction = voiceAction;
            this.voiceScene = voiceScene;
            if (localId) this.localId = localId;
            if (serverId) this.serverId = serverId;
            if (targetActionId) this.targetActionId = targetActionId;
            if (targetStartTimes) this.targetStartTimes = targetStartTimes;
            this.data = data;
            this.startTimes = new Date().getTime();
        }

        public printInfo(str?:string):void {
            let printStr:string = "";
            if (str) {
                printStr += str+" ";
            }
            printStr += "actionId="+this.actionId+" voiceAction="+this.voiceAction+" localId="+this.localId;
            egret.log(printStr);
        }

    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShareObj
     * @Description:  //分享对象
     * @Create: DerekWu on 2018/1/8 11:22
     * @Version: V1.0
     */
    export class ShareObj {
        /** 分享标题 分享到好友和朋友圈 都需要使用 */
        public title:string = "";
        /** 分享描述 仅分享到好友 使用 */
        public desc:string = "";
        /** 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致  分享到好友和朋友圈 都需要使用 */
        public link:string = "";
        /** 分享图标URL地址 分享到好友和朋友圈 都需要使用 */
        public imgUrl:string = "";
        /** 分享类型,music、video或link，不填默认为link  仅分享到好友 使用 */
        public type:string = "link";
        /** 如果type是music或video，则要提供数据链接，默认为空  仅分享到好友 使用 */
        public dataUrl:string = "";
    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShareDate
     * @Description:  //分享相关数据
     * @Create: DerekWu on 2018/1/8 12:01
     * @Version: V1.0
     */
    export class WeChatJsSdkData {

        /** 分享位置 */
        public static shareLocation:ShareLocationEnum;

        /** 分享到朋友/群的 分享对象 */
        public static readonly shareToFriends:ShareObj = new ShareObj();
        /** 分享到朋友圈的 分享对象 */
        public static readonly shareToCircleOfFriends:ShareObj = new ShareObj();


        // /** 微信语音类型 */
        // public static weChatVoiceType:WeChatVoiceTypeEnum = WeChatVoiceTypeEnum.GAME;
        // /** 微信语音功能状态 */
        // public static weChatVoiceState:WeChatVoiceStateEnum = WeChatVoiceStateEnum.NORMAL;
        // /** 最后开始录音时间 */
        // public static startRecordTime:number = 0;
        // /** 最后停止录音时间 */
        // public static endRecordTime:number = 0;

        /** 微信语音动作队列，队列FIFO执行，队列中没有有内容或者一些特殊情况 才能允许开始录音 */
        public static readonly weChatVoiceActionLinkedList:Game.LinkedList = new Game.LinkedList();
        /** 最后开始录音时间 */
        public static lastStartRecordTime:number = 0;
        /** 处理微信动作的定时器 */
        public static weChatVoiceTimer:Game.Timer;

    }



}