module FL {
    /**
     * *日志常量
     */

    export class LogConstant {

        /**主操作类型 获得  消耗  operation_type*/
        public static OPERATION_TYPE_ADD_GOLD :number = 1;//增加金币
        public static OPERATION_TYPE_SUB_GOLD :number = 2;//减少金币
        public static OPERATION_TYPE_ADD_GEM :number = 3;//增加晶石
        public static OPERATION_TYPE_SUB_GEM :number = 4;//减少晶石
        public static OPERATION_TYPE_ADD_PRO :number = 5;//增加功能道具
        public static OPERATION_TYPE_SUB_PRO :number = 6;//消耗功能道具
        public static OPERATION_TYPE_ADD_PACKS :number = 7;//增加大礼包
        public static OPERATION_TYPE_ADD_DIAMOND :number = 9;//增加钻石
        public static OPERATION_TYPE_SUB_DIAMOND :number = 10;//减少钻石
        public static OPERATION_TYPE_ADD_LIFE:number =11;//添加生命力
        public static OPERATION_TYPE_SUB_LIFE:number =12;//添加生命力

        public static OPERATION_TYPE_USE_RMB:number =13;//使用人民币

        public static OPERATION_TYPE_SEND_TO_OTHER_PLAYER_DIAMOND :number = 14;//赠送给其他玩家钻石，减钻石
        public static OPERATION_TYPE_AGENT_ROOM :number = 15;//授权开房

        /**子操作类型 具体玩家操作的具体行为（获得、消耗的来源 ）  如抽奖、使用道具等  operation_sub_type*/
        public static OPERATION_GAME_WIN :number = 1;//游戏胜利
        public static OPERATION_FINISH_TASK:number =2;//完成任务
        public static OPERATION_EXIT_ROOM_BEFORE_GAME_START:number =3;//在游戏开始前退出
        public static OPERATION_BUY_BIG_GIFT:number =4;//购买大礼包，附带赠送
        public static OPERATION_CONTINUE_LOGIN:number =5;//连续登录获得
        public static OPERATION_GAME_LOSS :number =6;//游戏失败
        public static OPERATION_ENTER_MULTI_PLAYER_ROOM:number =7;//进多人场
        public static OPERATION_DEAD_ALIVE:number =8;//游戏内快速复活
        public static OPERATION_PLAYER_USE_PRO :number = 9;//游戏内消耗功能道具
        public static OPERATION_PAY :number =10;//充值行为
        public static OPERATION_DIAMOND_SEND:number =11;//钻石，每日赠送
        public static OPERATION_GOLD_BUY:number =12;//金币购买其他
        public static OPERATION_DIAMOND_SEND_FRIST:number =13;//购买钻石，一次性赠送
        public static OPERATION_GOLD_FAST_BUY_ITEM:number =14;//金币快速购买道具
        public static OPERATION_GIFT_CARD_SEND:number =15;//礼品卡赠送得到

        public static OPERATION_BUY_ANIMAL_TICKET_REWARD:number =16;//小动物彩票中奖
        public static OPERATION_BUY_ANIMAL_TICKET:number =17;//购买小动物彩票
        public static OPERATION_GEM_EXCHANGE_GOLD:number =18;//晶石换金币
        public static OPERATION_LOTTERY:number =19;//抽奖

        public static OPERATION_CHANGE_ITEM_BY_DEVICE:number =20;	//安卓和IOS道具相互转换
        public static OPERATION_ACTIVITY_ADD_GOLD :number = 21; //活动增加金币
        public static OPERATION_ACTIVITY_ADD_DIAMOND :number = 22; //活动增加钻石
        public static OPERATION_ACTIVITY_ADD_DIAMOND_LOGIN_REWARD :number = 23;//登录奖励活动增加钻石
        public static OPERATION_ACTIVITY_ADD_DIAMOND_KAIFANG :number = 24;//开房送钻活动增加钻石
        public static OPERATION_ACTIVITY_ADD_DIAMOND_WXSHARE :number = 25;//分享有钻活动增加钻石
        public static OPERATION_ACTIVITY_ADD_DIAMOND_RECOMMEND :number = 26;//推荐有礼活动增加钻石
        /**
         * 关注微信公众号增加钻石
         */
        public static OPERATION_ACTIVITY_ADD_DIAMOND_WX_GONGZHONGHAO :number = 27;

        public static OPERATION_TYPE_SUB_GOLD_GAME_LOSE:number =100;//打牌输金币
        public static OPERATION_TYPE_ADD_GOLD_GAME_WIN:number =200;//打牌赢金币
        public static OPERATION_TYPE_ADD_GOLD_SAVE:number =300;//救济

        public static OPERATION_TYPE_SUB_PRO_CREATE_VIP_TABLE:number =400;//开房消耗道具

        public static OPERATION_TYPE_SUB_GOLD_TAKE_TO_GAME_TABLE:number =101;//金币带到桌子上
        public static OPERATION_TYPE_ADD_GOLD_GAME_WIN_GOLD_BACK:number =201;//桌子金币回到帐号

        public static OPERATION_TYPE_SUB_GOLD_GAME_SERVICE_FEE:number =102;//每局扣金币
        public static OPERATION_TYPE_SUB_SHARE_GAIN_DIAMOND:number =110;//分享送钻石

        public static OPERATION_TYPE_ADMIN_CHANGE_USER_DATA :number = 1000;		//管理员手动修改玩家数据
        public static OPERATION_TYPE_ADMIN_EXCHANGE_PLAYER_GOLD :number = 1001;	//后台转赠
        public static OPERATION_TYPE_WEB_REQUEST_SUB_GOLD :number = 1002;			//网页消费扣除金币
        public static OPERATION_TYPE_ADMIN_CHANGE_USER_ITEM :number = 1003;		//群主修改玩家钻石数

        /**操作的物品类型 金币  道具 晶石  */
        public static MONEY_TYPE_GOLD :number = 1;//金币
        public static MONEY_TYPE_GEM :number = 2;//晶石
        public static MONEY_TYPE_DIAMOND :number = 3;//钻石
        public static MONEY_TYPE_DIAMOND_BOUGHT :number = 4;//买的钻石


    }

}