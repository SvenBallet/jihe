module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GameConstant
     * @Description:  //游戏常量
     * @Create: DerekWu on 2017/11/21 20:30
     * @Version: V1.0
     */
    export enum EGameType {
        MJ,//麻将
        MAHJONG,//新麻将
        RF,//跑得快（扑克）
        ZIPAI // 字牌
    }

    export class GameConstant {

        /**客户端通知服务器，购买物品**/
        public static readonly GAME_OPERTAION_BUY_ITEM: number = 1007;

        /**房主申请解散房间*/
        public static readonly GAME_OPERATION_APPLY_CLOSE_VIP_ROOM: number = 1034;

        public static readonly GAME_OPERTAION_BUY_DIAMOND: number = 1050;

        /** 查询是否有人请求解散桌子 */
        public static readonly GAME_OPERTAION_QUERY_TABLE_DISMISS: number = 2001;

        public static readonly DIAMOND_NOT_ENOUGH: number = 0x10; //房卡不足,即钻石不足

        /**
         * 代开房标识
         */
        public static readonly SEND_PLAYER_CMD_GET_MY_PAY_BACK: number = 0x17679;//获取我的返利
        public static readonly GAME_OPERTAION_GET_QUN_ZHU_PAY_BACK: number = 1061; //群主获取返利
        public static readonly AGENT_CMD_GET_FANGLIST: number = 0x17685;//查询代开房
        public static readonly AGENT_CMD_DISSMISS_TABLE: number = 0x17686;//解散代开房间
        public static readonly PLAYER_TYPE_AGENT: number = 2;//授权玩家代开房
        public static readonly AGENT_TABLE_FLAG: number = 0x12AB; //代开房
        public static readonly CLUB_TABLE_FLAG: number = 0x52CC; //俱乐部开房
        public static readonly AGENT_CMD_REJECT_TABLE_PLAYER = 0x17691;//踢出代开房玩家
        public static readonly REJECT_TABLE_PLAYER_ACK = 0x20000;//踢出代开房玩家返回

        public static readonly SEND_PLAYER_DIAMOND_CMD: number = 0x13475; //赠送钻石
        public static readonly SEND_PLAYER_DIAMOND_FAILED: number = 0x01;//失败，原因未知
        public static readonly SEND_PLAYER_DIAMOND_SUCCESSFULLY: number = 0x02;//成功
        public static readonly SEND_PLAYER_DIAMOND_FAILED___DIAMOND_NOT_ENOUGH: number = 0x10;//钻石不足
        public static readonly SEND_PLAYER_DIAMOND_FAILED___TARGET_PLAYER_NOT_FOUND: number = 0x20;//id不对
        public static readonly SEND_PLAYER_DIAMOND_FAILED___PASSWORD_WRONG: number = 0x40;//密码错误
        public static readonly SEND_PLAYER_DIAMOND_FAILED___TARGET_PLAYER_TYPE_ERROR: number = 0x80;//对方不是普通玩家
        public static readonly SEND_PLAYER_DIAMOND_CHECK_SUCCESSFULLY = 0x100;//测试成功，让群主确认就转钻石
        public static readonly SEND_PLAYER_DIAMOND_CMD_CONFIRMED = 0x17675;//确认赠送钻石

        public static readonly AGENT_CMD_GET_LIST: number = 0x17690;//获得玩家授权列表
        public static readonly AGENT_CMD_SET_PLAYERID: number = 0x17687;//授权玩家
        public static readonly AGENT_CMD_SET_PLAYER_DIAMOND: number = 0x17688;//授权玩家钻石
        public static readonly AGENT_CMD_CANCEL_AGENT: number = 0x17689;//取消授权
        public static readonly SEND_PLAYER_CMD_GET_MY_SEND_DIAMOND_LOG: number = 0x17676;
        public static readonly SEND_PLAYER_CMD_GET_XIAJI_INFO: number = 0x1767b; //获取下级信息
        public static readonly SEND_PLAYER_CMD_GET_MY_SUB_DIAMOND_LOG: number = 0x17678 //支出
        public static readonly SEND_PLAYER_CMD_GET_MY_ADD_DIAMOND_LOG: number = 0x17677 //收入
        public static readonly DISMISS_VIP_TABLE_FAILED = 0x400;
        public static readonly ADMIN_OPERATION_RESULT = 0x1000; //客户操作结果提示
        public static readonly SUPER_ADMIN_OPERTAION_INFO_GET_PAY_BACK = 0x8000;   //获取返利


        public static readonly RESET_PASSWORD_BY_ADMIN: number = 0x13470; //重置密码  count:128710
        public static readonly SET_PLAYER_TYPE_BY_ADMIN: number = 0x13471; //设置代理count:128711 cardNo:128711 cardPsw:128710
        //public static readonly SET_PLAYER_TYPE_BY_ADMIN:number =0x13471; //取消代理 count:128711 cardNo:128711 unused_0:17
        public static readonly DISMISS_VIP_TABLE_BY_ADMIN: number = 0x13474; //管理员解散桌子 count:128710 cardNo:128710
        public static readonly DISMISS_VIP_TABLE_BY_ADMIN_CONFIRMED: number = 0x13473; //管理员再次确认解散桌子
        public static readonly SEND_PLAYER_CMD_SUB_DIAMOND: number = 0x17681; //扣除玩家的钻石 count:10 unused_0:128710
        public static readonly PLAYER_CMD_GUA_XIA_JI: number = 0x17682; //玩家1挂到玩家2下面 上级：count：128710  unused_0:128711
        public static readonly PLAYER_CMD_QUERY_INFO: number = 0x17683; //查询玩家信息 count：128710
        public static readonly PLAYER_CMD_QUERY_DIAMOND_LOG: number = 0x17684; //查询玩家信息
        public static readonly SEND_PLAYER_CMD_GET_SYSTEM_INFO: number = 0x1767a; //获取系统信息

        public static readonly SEND_PLAYER_CMD_SHARE_TO_WX: number = 0x13775;// 分享到微信
        public static readonly SEND_PLAYER_SHARE_TO_WX_SUCCESSFULLY: number = 0x2000;// 微信分享成功
        public static readonly SEND_PLAYER_SHARE_TO_WX_TIP: number = 0x4000;// 微信分享提示

        public static readonly UPDATE_PLAYER_CLIENT_IP: number = 0x13461; //客户端发送外网ip过来

        /**玩家信息修改*/
        public static readonly GAME_OPERATION_COMPLETE_ACCOUNT_AND_PASSWORD: number = 1033;//补全帐号和密码
        public static readonly GAME_OPERTAION_UPDATE_PASSWORD: number = 1025;//客户端请求修改密码
        /**
         * 淮北玩法的玩家操作：下坐拉跑
         */
        public static readonly GAME_OPERTAION_XIA_ZUO_LA_PAO: number = 2002;

        /**
         * 砀山玩法的玩家操作：下马
         */
        public static readonly GAME_OPERTAION_XIA_MA: number = 2003;

        /**
         * “杠了就有”在回放中的操作值
         */
        public static readonly GAME_OPERTAION_GANG_LE_JIU_YOU: number = 2004;

        /**
         * 中鸟在回放中的操作值
         */
        public static readonly GAME_OPERTAION_ZHONG_NIAO: number = 2005;


        /**服务器通知客户端，桌子上坐上一个新玩家**/
        public static readonly GAME_OPERTAION_TABLE_ADD_NEW_PLAYER: number = 1004;
        /**服务器通知客户端，桌子上有玩家离开**/
        public static readonly GAME_OPERTAION_PLAYER_LEFT_TABLE: number = 1005;

        public static readonly MAHJONG_OPERTAION_WAITING_OR_CLOSE_VIP: number = 0x400000;//VIP房间有人逃跑，是否继续等待


        public static readonly GAME_PLAY_RULE_4_REN: number = 0x0;//4人麻将
        public static readonly GAME_PLAY_RULE_3_REN: number = 0x1;//3人麻将
        public static readonly GAME_PLAY_RULE_2_REN: number = 0x2;//2人麻将

        /**玩家牌局结果*/
        public static readonly MAHJONG_HU_CODE_DIAN_PAO: number = 0x0002;//点炮
        public static readonly MAHJONG_HU_CODE_ZI_MO: number = 0x0008;//自摸;
        public static readonly MAHJONG_HU_CODE_WIN: number = 0x100000;//赢
        // public static readonly MAHJONG_HU_CODE_LOSE:number = 0x200000;//输

        public static readonly GAME_PLAY_RULE_SU_ZHOU: number = 0x1;
        // public static readonly GAME_PLAY_RULE_DIAN_PAO: number = 0x2;//是否可点炮
        public static readonly GAME_PLAY_RULE_DONG_FENG_LING: number = 0x4;//是否东风也是花
        public static readonly GAME_PLAY_RULE_GANG_45: number = 0x8;////明4暗5”即明杠算4分，暗杠算5分；
        public static readonly GAME_PLAY_RULE_BAO_TING: number = 0x10;////报听

        /**
         * 是否包牌的标识
         */
        public static readonly GAME_PLAY_RULE_BAO_PAI: number = 0x20;

        /**
         * 淮北麻将坐拉跑的标识
         */
        public static readonly GAME_PLAY_RULE_DAI_ZUO_LA_PAO: number = 0x4000;
        /**
         * 淮北麻将抢杠胡包3家的标识
         */
        public static readonly GAME_PLAY_RULE_SAN_JIA_BAO: number = 0x1000;

        /**
         * 淮北麻将，杠了就有的玩法标识
         */
        public static readonly GAME_PLAY_RULE_GANG_LE_JIU_YOU: number = 0x800000;

        /**
         * 淮北麻将，杠随胡走的玩法标识
         */
        public static readonly GAME_PLAY_RULE_GANG_SUI_HU_ZOU: number = 0x400000;

        /**
         * 砀山麻将可以吃的玩法标识
         */
        public static readonly GAME_PLAY_RULE_CHI: number = 0x20000;

        /**
         * 砀山麻将可以一炮多响的玩法标识
         */
        public static readonly GAME_PLAY_RULE_YI_PAO_DUO_XIANG: number = 0x40000;

        /**
         * 砀山麻将海底翻倍的玩法标识
         */
        public static readonly GAME_PLAY_RULE_HAI_DI_FAN_BEI: number = 0x80000;

        /**
         * 砀山麻将杠随马走的玩法标识
         */
        public static readonly GAME_PLAY_RULE_GANG_SUI_MA_ZOU: number = 0x200000;

        /**
         * 砀山麻将下马的玩法标识
         */
        public static readonly GAME_PLAY_RULE_XIA_MA: number = 0x100000;

        public static readonly GAME_PLAY_RULE_DIAN_PAO: number = 0x2;//是否可点炮
        public static readonly GAME_PLAY_RULE_MUST_HU: number = 0x8;//有胡必胡
        public static readonly GAME_PLAY_RULE_ZHUANG_XIAN: number = 0x200000; //庄闲
        // 可胡七对
        public static readonly GAME_PLAY_RULE_ZZ_7_DUI: number = 0x100;
        //中鸟加翻
        public static readonly GAME_PLAY_RULE_ZZ_NIAO_JIA_FAN: number = 0x200;
        //中鸟加分
        public static readonly GAME_PLAY_RULE_ZZ_NIAO_JIA_FEN: number = 0x400;
        //庄家中鸟
        public static readonly GAME_PLAY_RULE_ZZ_ZHUANG_NIAO: number = 0x800;
        //159中鸟
        public static readonly GAME_PLAY_RULE_ZZ_159_NIAO: number = 0x1000;
        //抓一鸟
        public static readonly GAME_PLAY_RULE_ZZ_1_NIAO: number = 0x2000;
        //抓2鸟
        public static readonly GAME_PLAY_RULE_ZZ_2_NIAO: number = 0x4000;
        //抓4鸟
        public static readonly GAME_PLAY_RULE_ZZ_4_NIAO: number = 0x8000;
        //抓6鸟
        public static readonly GAME_PLAY_RULE_ZZ_6_NIAO: number = 0x10000;

        /**玩家的麻将操作*/
        public static readonly MAHJONG_OPERTAION_GANG_NOTIFY: number = 0x9914878;//玩家杠的通知，杠不杠的成功，看有没有人抢

        public static readonly MAHJONG_OPERTAION_CHI: number = 0x01;//吃
        public static readonly MAHJONG_OPERTAION_PENG: number = 0x02;//碰
        public static readonly MAHJONG_OPERTAION_AN_GANG: number = 0x04;//暗杠，自己摸了4 个
        public static readonly MAHJONG_OPERTAION_MING_GANG: number = 0x08;//明杠，手里有3个，别人打一个
        public static readonly MAHJONG_OPERTAION_CHU: number = 0x10;//出牌
        public static readonly MAHJONG_OPERTAION_HU: number = 0x20;//胡牌
        public static readonly MAHJONG_OPERTAION_TING: number = 0x40;//TING
        public static readonly MAHJONG_OPERTAION_CANCEL: number = 0x80;//给玩家提示操作，玩家点取消

        public static readonly MAHJONG_OPERTAION_OFFLINE: number = 0x100;//断线
        public static readonly MAHJONG_OPERTAION_ONLINE: number = 0x200;//断线后又上线
        public static readonly MAHJONG_OPERTAION_LOG_SEND_CARDS: number = 0x200;//回放用，发牌消息

        public static readonly MAHJONG_OPERTAION_GAME_OVER_CONTINUE: number = 0x2000;//牌局结束，玩家选择继续开始游戏

        public static readonly MAHJONG_OPERTAION_MO_CARD: number = 0x4000;//重用字段，这个只有记录牌局回放使用

        public static readonly MAHJONG_OPERTAION_PLAYER_HU_CONFIRMED: number = 0x40000;//玩家点胡，此局结束显示结果
        public static readonly MAHJONG_OPERTAION_OVERTIME_AUTO_CHU: number = 0x80000;//超时自动出牌

        public static readonly MAHJONG_OPERTAION_BU_HUA: number = 0x1000000;//补花
        // public static readonly MSG_GAME_PLAYER_OPERATION_NOTIFY: number = 0xc30061; // 中鸟

        public static readonly MAHJONG_OPERTAION_TIP: number = 0x20000;
        /**提示当前谁在操作**/

        public static readonly MAHJONG_OPERTAION_HU_CARD_LIST_UPDATE: number = 0x10000000;//提醒玩家可以胡的牌
        public static readonly MAHJONG_OPERTAION_BU_GANG: number = 0x20000000;//补杠，自己摸起来，3个已经碰了，再补杠
        public static readonly MAHJONG_OPERTAION_REMOE_CHU_CARD: number = 0x40000000;//玩家打出的牌，被吃碰杠走了
        public static readonly MAHJONG_OPERTAION_SCORE_UPDATE: number = -2147483648;//更新客户端玩家的分数

        public static readonly GAME_OPERTAION_SET_TUOGUAN: number = 1029;		//设置托管状态

        // /**玩家进入桌子，等待中**/
        public static readonly PALYER_GAME_STATE_IN_TABLE_READY: number = 1;
        // /**玩家进入桌子，游戏中**/
        public static readonly PALYER_GAME_STATE_IN_TABLE_PLAYING: number = 2;
        // /**玩家进入桌子，已经离开，暂停中**/
        // public static readonly PALYER_GAME_STATE_IN_TABLE_PAUSED:number = 3;
        /**玩家进入桌子，牌局结束，等待玩家点继续或者离开**/
        public static readonly PALYER_GAME_STATE_IN_TABLE_GAME_OVER_WAITING_TO_CONTINUE: number = 4;

        //扑克发牌
        public static readonly MSG_POKER_SEND_PAI = 0x1100;//int
        //扑克出牌
        public static readonly MSG_POKER_CHU_PAI = 0x1101;//int
        //扑克不出牌
        public static readonly MSG_POKER_BU_CHU_PAI = 0x1102;//int
        //剩余牌数
        public static readonly MSG_POKER_LEFT_PAI = 0x1103;//int

        //麻将发牌
        public static readonly MSG_MAHJONG_SEND_CARDS =0x1200;
        //麻将摸牌
        public static readonly MSG_MAHJONG_MO_CARD =0x1201;
        //麻将出牌
        public static readonly MSG_MAHJONG_CHU_CARD =0x1202;
        //麻将动作，吃
        public static readonly MSG_MAHJONG_CHI =0x1203;
        //麻将动作，碰
        public static readonly MSG_MAHJONG_PENG =0x1204;
        //麻将动作，杠
        public static readonly MSG_MAHJONG_GANG =0x1205;
        //麻将动作，接炮胡
        public static readonly MSG_MAHJONG_JIE_PAO_HU =0x1206;
        //麻将动作，自摸胡
        public static readonly MSG_MAHJONG_ZI_MO_HU =0x1207;
        //麻将动作，小胡
        public static readonly MSG_MAHJONG_XIAO_HU =0x1208;
        //麻将动作，抓鸟
        public static readonly MSG_MAHJONG_ZHUA_NIAO =0x1209;
        //麻将动作，添加牌到出牌区域
        public static readonly MSG_MAHJONG_ADD_CHU_CARD =0x1210;
        //麻将动作，添加牌到出牌区域
        public static readonly MSG_MAHJONG_UPDATE_SCORE =0x1211;

        //麻将动作，长沙显示杠牌
        public static readonly MSG_MAHJONG_CHANG_SHA_VIEW_GANG_CARD =0x1300;
        //麻将动作，长沙隐藏杠牌
        public static readonly MSG_MAHJONG_CHANG_SHA_HIDE_GANG_CARD =0x1301;
        //长沙麻将飘分
        public static readonly MSG_MAHJONG_CHANG_SHA_PIAO_FEN =0x1302;

        //游戏内部标识--------------------------------------------------------------------------------------------
        /**
         * 当前游戏操作类
         */
        public static CURRENT_HANDLE: any = MJGameHandler;
        /**
         * 当前游戏类型
         */
        public static CURRENT_GAMETYPE: EGameType = EGameType.MAHJONG;

        /**
         * 设置当前游戏操作类和游戏类型
         */
        public static setCurrentGame(type: EGameType) {
            switch (type) {
                case EGameType.MJ:
                    this.CURRENT_GAMETYPE = type;
                    this.CURRENT_HANDLE = MJGameHandler;
                    break;
                case EGameType.RF:
                    this.CURRENT_GAMETYPE = type;
                    this.CURRENT_HANDLE = RFGameHandle;
                    break;
                case EGameType.MAHJONG:
                    this.CURRENT_GAMETYPE = type;
                    this.CURRENT_HANDLE = MahjongHandler;
                    break;
            }
        }

    }


}