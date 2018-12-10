module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - CommonData
     * @Description:  //
     * @Create: DerekWu on 2017/12/9 7:57
     * @Version: V1.0
     */
    export class CommonData {

        /** 登录标记，是否已经进入游戏，如果已经进入麻将游戏，将不会进入大厅 */
        public static isIntoGame:boolean = false;

        /** 开发版本登录信息 */
        public static devLoginMsg:LoginMsg;

        /** 微信版本登录信息 */
        public static wxLoginMsg:H5WXLoginMsg;

        /** 游戏中同时只能出现唯一一个加载界面 */
        public static loadingView:LoadingView;

        /** 心跳ID */
        public static heartBeatingID: number = 0;
        public static lastHeartBeatingStartTimes: number = 0;
        public static lastHeartBeatingEndTimes: number = 0;
        /** 最后接收服务端发起心跳时间 */
        public static lastReceivedServerInitiatedHeartbeatTimes: number = 0;

        /** 延时进入大厅的时候ID */
        public static delayedExeAfterLoginIntoLobbyID: number = 1;

        /** 最后停留的位置，在没有在游戏中，断线重连的时候直接到这个位置（1=大厅，2=茶楼） */
        public static lastStopPosition: number = 1;

        /** 透明遮罩，链接网络的时候的遮罩 */
        public static netConnectMask: eui.Group;

        /** 网络状态  0.无网络  1.WIFI   2.移动网络*/
        public static netSatate: number = 1;

    }

}