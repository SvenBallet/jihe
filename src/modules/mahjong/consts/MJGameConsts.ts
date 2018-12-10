module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PZOrientation
     * @Description:  //牌桌方向枚举
     * @Create: DerekWu on 2017/11/16 20:05
     * @Version: V1.0
     */
    export enum PZOrientation {
        /** 上下左右*/
        UP, DOWN, LEFT, RIGHT
    }

    /**
     * 麻将房间ID枚举
     */
    export enum MJRoomID {
        RECONNECT = -1, //断线重连
        VIPROOM = 2002, //vip房间
        ZHUAN_ZHUAN = 2004, //转转麻将 ， 只金币场表示玩法
        JING_DIAN_PAO_DE_KUAI = 2005,  //经典跑得快 ， 只金币场表示玩法
        SHI_WU_ZHANG_PAO_DE_KUAI = 2006,  //十五张跑得快，只金币场表示玩法
        ZHUAN_ZHUAN_MJ = 2007,  // 新转转麻将
        CHANG_SHA_MJ = 2008,  // 长沙麻将
        HONG_ZHONG_MJ = 2009  // 红中麻将
    }

    /**
     * 麻将玩法
     */
    export enum MJGamePlayWay {
        ZHUANZHUAN = 0x40,// 转转麻将

        ZHUAN_ZHUAN_MJ = 20000,// 新版本转转麻将
        CHANG_SHA_MJ = 20001,// 长沙麻将
        HONG_ZHONG_MJ = 20002// 红中麻将
    }

    /**
     * 麻将子玩法
     */
    export enum MJGameSubRule {
        KE_JIE_PAO = 200001, // 可接炮，可点炮胡（没有这个字玩法则只能自摸）
        GUO_SHOU_HU = 200002, // 需要过手胡（没有则不需要过手胡）
        GUO_SHOU_GENG_DA_FAN_KE_HU = 200003, // 过手胡的时候更大翻数可胡，否则不可胡
        BAO_TING = 200004, // 是否有报听玩法
        YOU_HU_BI_HU = 200005, // 有胡必胡 
        ZI_SHUN = 200006, // 支持字顺子，比如 中发白 、 东南西 和 东西北 等算顺子
        QIANG_GANG_HU = 200007, // 支持抢杠胡
        QIANG_GANG_HU_BAO_SAN_JIA = 200008, // 支持抢杠胡包三家
        DUO_XIANG_PAO = 200009, // 支持多响炮
        XIAN_SHI_AN_GANG = 200010, // 显示暗杠

        // 转转麻将 
        ZHUAN_ZHUAN_DIAN_PAO_HU = 200201, // 点炮胡（可抢杠）（默认）  
        ZHUAN_ZHUAN_ZI_MO_HU = 200202, // 自摸胡
        ZHUAN_ZHUAN_ZHUANG_XIAN = 200205, // 庄闲，转转麻将
        ZHUAN_ZHUAN_KE_HU_QI_DUI = 200206, // 可胡七对  转转麻将

        ZHUAN_ZHUAN_AN_ZHUAN_JIA_ZHONG_NIAO = 200211, // 按庄家中鸟，转转麻将
        ZHUAN_ZHUAN_159_ZHONG_NIAO = 200212, // 159中鸟，转转麻将

        ZHUAN_ZHUAN_ZHONG_NIAO_FAN_BEI = 200231, // 中鸟翻倍，转转麻将
        ZHUAN_ZHUAN_ZHONG_NIAO_JIA_FEN = 200232, // 中鸟加分，转转麻将
        ZHUAN_ZHUAN_ZHUA_YI_NIAO = 200233, // 抓1鸟，转转麻将
        ZHUAN_ZHUAN_ZHUA_ER_NIAO = 200234, // 抓2鸟，转转麻将
        ZHUAN_ZHUAN_ZHUA_SI_NIAO = 200235, // 抓4鸟，转转麻将
        ZHUAN_ZHUAN_ZHUA_LIU_NIAO = 200236, // 抓6鸟，转转麻将
        
        //长沙麻将
        CHANG_SHA_ZHUANG_XIAN = 200101, // 庄闲，长沙麻将
        CHANG_SHA_PIAO_FEN = 200102, // 飘分，长沙麻将
        CHANG_SHA_LIU_LIU_SHUN = 200103, // 六六顺，长沙麻将
        CHANG_SHA_QIE_YI_SE = 200104, // 缺一色，长沙麻将
        CHANG_SHA_BAN_BAN_HU = 200105, // 板板胡，长沙麻将
        CHANG_SHA_DA_SI_XI = 200106, // 大四喜，长沙麻将
        CHANG_SHA_JIE_JIE_GAO = 200107, // 节节高，长沙麻将
        CHANG_SHA_SAN_TONG = 200108, //  三同，长沙麻将
        CHANG_SHA_YI_ZHI_HUA = 200109, // 一枝花，长沙麻将
        CHANG_SHA_ZHONG_TU_SI_XI = 200110, // 中途四喜，长沙麻将

        CHANG_SHA_ZHONG_NIAO_FAN_BEI = 200131, // 中鸟翻倍，长沙麻将
        CHANG_SHA_ZHONG_NIAO_JIA_FEN = 200132, // 中鸟加分，长沙麻将
        CHANG_SHA_ZHONG_YI_NIAO = 200133, // 抓1鸟，长沙麻将
        CHANG_SHA_ZHONG_ER_NIAO = 200134, // 抓2鸟，长沙麻将
        CHANG_SHA_ZHONG_SI_NIAO = 200135, // 抓4鸟，长沙麻将
        CHANG_SHA_ZHONG_LIU_NIAO = 200136, // 抓6鸟，长沙麻将

        //// 红中麻将 
        HONG_ZHONG_DIAN_PAO_HU = 200301, // 点炮胡（可抢杠）（默认）  
        HONG_ZHONG_ZI_MO_HU = 200302, // 自摸胡
        HONG_ZHONG_ZI_MO_HU_QIANG_GANG = 200303, // 自摸胡可抢杠
        HONG_ZHONG_ZHUANG_XIAN = 200305, // 庄闲，红中麻将
        HONG_ZHONG_KE_HU_QI_DUI = 200306, // 可胡七对  红中麻将
        
        HONG_ZHONG_AN_ZHUAN_JIA_ZHONG_NIAO = 200311, // 按庄家中鸟，红中
        HONG_ZHONG_159_ZHONG_NIAO = 200312, // 159中鸟，红中麻将
        HONG_ZHONG_WEI_YI_PIAO_NIAO = 200313,//为一票鸟
	    HONG_ZHONG_YI_MA_QUAN_ZHONG = 200314,//一码全中
        HONG_ZHONG_WU_HONG_ZHONG_FAN_BEI = 200315,//无红中翻倍
        HONG_ZHONG_PIAO_FEN = 200316, // 红中飘分
        
        HONG_ZHONG_ZHONG_NIAO_FAN_BEI = 200331, // 中鸟翻倍，红中麻将
        HONG_ZHONG_ZHONG_NIAO_JIA_FEN = 200332, // 中鸟加分，红中麻将
        HONG_ZHONG_ZHUA_YI_NIAO = 200333, // 抓1鸟，红中麻将
        HONG_ZHONG_ZHUA_ER_NIAO = 200334, // 抓2鸟，红中麻将
        HONG_ZHONG_ZHUA_SI_NIAO = 200335, // 抓4鸟，红中麻将
        HONG_ZHONG_ZHUA_LIU_NIAO = 200336, // 抓6鸟，红中麻将
    }

    export enum EMahjongChooseItem {

        PIAO_FEN =  0x10//飘分

    }


    /**
     * 牌局状态
     */
    export enum EGameState {
        NULL, //没有牌局，同时也标识牌局结束
        WAITING_START, //等待开始中
        PLAYER_READY_OVER, //已准备结束
        PLAYING //正在游戏中
    }

    /**
     * 麻将摆牌，吃、碰、杠、胡以及其他摆牌类型枚举
     */
    export enum MahjongCardDownTypeEnum {
        CHI = 1,	    // 吃
        PENG = 2,		// 碰
        MING_GANG = 3,	// 明杠，其他人打出一张，你手上有三张时
        BU_GANG = 4,	// 补杠，碰了之后摸到第四张
        AN_GANG = 5,	// 暗杠，手里有4张
        BAI_PAI = 6 	// 特殊时候的摆牌，明牌、胡牌等
    }

    /**
     * 麻将动作，28位有效，优先级从大到小，多个动作只能选其中一个，（长沙麻将杠上来两张的时候可以选两个）
     */
    export enum MahjongActionEnum {

        GUO = 0x0, // 过
        CHI = 0x10001, // 吃
        PENG = 0x20001, // 碰

        MING_GANG = 0x30001, // 明杠
        BU_GANG = 0x30002, // 补杠
        AN_GANG = 0x30003, // 暗杠

        CHANG_SHA_AN_GANG = 0x30031, // 暗杠，长沙麻将杠 比较特殊
        CHANG_SHA_MING_GANG = 0x30032, // 明杠，长沙麻将杠 比较特殊
        CHANG_SHA_BU_GANG = 0x30033, // 补杠，长沙麻将杠 比较特殊
        CHANG_SHA_AN_BU_ZHANG = 0x30034, // 暗补张，长沙麻将 比较特殊
        CHANG_SHA_MING_BU_ZHANG = 0x30035, // 明补张，长沙麻将 比较特殊
        CHANG_SHA_BU_BU_ZHANG = 0x30036, // 补补张，长沙麻将 比较特殊

        //长沙大四喜
        CHANG_SHA_DASIXI = 0X30006,
        CHANG_SHA_DASIXI_ZHONGTU = 0X30007,
        //长沙板板胡
        CHANG_SHA_BANBANHU = 0X30008,
        //长沙缺一色
        CHANG_SHA_QUEYISE = 0X30009,
        //长沙六六顺
        CHANG_SHA_LIULIUSHUN = 0X30010,
        CHANG_SHA_LIULIUSHUN_ZHONGTU = 0X30011,
        //一枝花
        CHANG_SHA_YIZHIHUA = 0X30012,
        CHANG_SHA_3TONG = 0X30013,
        CHANG_SHA_JIEJIEGAO = 0X30014,

        BAO_TING = 0xF0001, // 报听
        // 胡牌相关的动作 > 0xFFFFFF
        QIANG_GANG_HU = 0xFFFFFFD, // 抢杠胡
        JIE_PAO = 0xFFFFFFE, // 接炮
        ZI_MO = 0xFFFFFFF // 自摸
    }

}