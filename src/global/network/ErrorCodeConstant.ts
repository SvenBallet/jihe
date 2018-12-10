module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ErrorCodeConstant
     * @Description:  //错误码
     * @Create: DerekWu on 2017/11/20 19:41
     * @Version: V1.0
     */
    export class ErrorCodeConstant {

        public static readonly CMD_EXE_OK:number =  0;// 命令执行成功

        /** 卡号错误或不存在 -100 */
        public static readonly YIKATONG_CARDNO_ERROR:number =  -100;
        /** 密码错误 -200 */
        public static readonly YIKATONG_CARDPWD_ERROR:number =  -200;
        /** 卡未生效 -300 */
        public static readonly YIKATONG_CARD_DISABLE:number =  -300;
        /** 卡余额不足付费 -400 */
        public static readonly YIKATONG_CARD_MONEY_NOT_ENOUGH:number =  -400;
        /** 接口不支持此卡付费 -500 */
        public static readonly YIKATONG_CARD_NOT_SUPPORTED:number =  -500;
        /** 商家付费流水号重复 -600 */
        public static readonly YIKATONG_OUTTRADENO_REPEAT:number =  -600;
        /** 参数错误 -700 */
        public static readonly YIKATONG_PARA_ERROR:number =  -700;
        /** 未提供此商品ID 付费功能 -800 */
        public static readonly YIKATONG_PARTNER_ID_ERROR:number =  -800;
        /** md5 校验码验证错误 -900 */
        public static readonly YIKATONG_MD5_ERROR:number =  -900;

        public static readonly CMD_EXE_FAILED:number =  1000;// 命令执行失败

        public static readonly WRONG_PASSWORD:number =  1001;// 密码错误
        public static readonly USER_NOT_FOUND:number =  1002;// 玩家未找到
        public static readonly SERVER_BUSY:number =  1003;// 服务忙碌
        public static readonly USER_ALREADY_EXIST:number =  1004;// 同名玩家已经存在

        public static readonly LIFE_NOT_ENOUGH:number =  1005;// 生命值不够

        public static readonly GOLD_NOT_ENOUGH:number =  1006;// 金币不够

        public static readonly ITEM_USE_FAILED_NO_VALID_TARGET:number =  1007;// 物品使用失败，没有可用的目标
        public static readonly ITEM_USE_FAILED_NO_ITEM:number =  1008;// 物品使用失败，没有这个物品

        public static readonly AMIMAL_TICKET_GET_REWARD_SUCCESSFULLY:number =  1009;// 彩票领奖成功
        public static readonly AMIMAL_TICKET_BUY_SUCCESSFULLY:number =  1010;// 购买彩票领奖成功
        public static readonly AMIMAL_TICKET_NOT_OPENED_THIS_TIME:number =  1011;// 11点
        // 19点不开放

        public static readonly ACCOUNT_ALREADY_EXIST:number =  1012;// 帐号重复
        public static readonly MACHINE_CODE_ALREADY_EXIST:number =  1013;// 机器码重复
        public static readonly SERVER_IS_BUSY:number =  1014;// 服务器忙碌
        public static readonly SERVER_IS_FULL:number =  1015;// 服务器注册量已满

        public static readonly GEM_NOT_ENOUGH:number =  1016;// 金币不够

        public static readonly USER_NickName_ALREADY_EXIST:number =  1017;// 昵称重复

        public static readonly GIFT_CODE_OUT_DATE:number =  1018;// 礼品卡过期
        public static readonly GIFT_CODE_MAX_USE_TIMES_OVER:number =  1019;// 礼品卡超过最多使用次数（已失效）

        public static readonly FANGKIA_NOT_FOUND:number =  1100;// 钻石不足
        public static readonly GOLD_LOW_THAN_MIN_LIMIT:number =  1101;// 金币低于下限
        public static readonly GOLD_HIGH_THAN_MAX_LIMIT:number =  1102;// 金币超过上限

        public static readonly CAN_ENTER_VIP_ROOM:number =  1103;// 可以进入VIP房间

        public static readonly VIP_TABLE_IS_FULL:number = 1104;	//vip桌子已经满座了

        public static readonly VIP_TABLE_IS_GAME_OVER:number =  1105;	//VIP桌子已经结束了

        public static readonly IS_PLAYING_CAN_NOT_ENTER_ROOM:number =  1106;	//正在游戏中不能进入其他房间 

        public static readonly SERVER_IS_MAINTAIN:number = 1107 ;//服务器正在维护，暂时关闭开启房间
        public static readonly TODAY_GAME_RECORD_OUT_LIMIT_IN_ROOM:number =  1200;		//今日输赢超过房间上限	
        public static readonly TODAY_GAME_RECORD_OUT_LIMIT_IN_GAME:number =  1201;		//今日输赢超过游戏上限

        public static readonly VIP_TABLE_NOT_FOUND:number = 1300;	//桌子未找到
        public static readonly TARGET_NOT_FOUND:number = 1301;	//目标角色找不到
        public static readonly PLAYER_TYPE_VALID:number = 1302;	//角色类型不合法
        public static readonly AGENT_PLAYER_LIMIT:number = 1303;	//授权玩家已达上限
        public static readonly PLAYER_HAS_BEEN_AGENT:number = 1304;	//此玩家已被授权了
        public static readonly AGENT_DIAMOND_NOT_ENOUGH:number = 1305;	//授权钻石不足
        public static readonly CANNOT_AGENT_SAME_DIAMOND:number = 1306;	//不能设置相同的授权钻石
        public static readonly CANNOT_AGENT_MYSELF:number = 1307;	//不能操作玩家自己
        public static readonly AGENT_RECORD_NOT_FOUND:number = 1308;	//授权记录不存在
        public static readonly AGENT_MONEY_DOWN_LIMIT:number = 1309;	//授权钻石不能低于100钻石


        public static readonly PLAYER_BANNED:number = 1500; //玩家被封号

    }

}