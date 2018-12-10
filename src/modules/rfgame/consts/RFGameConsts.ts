module FL {
    /**
     * 扑克花色
     */
    export enum ECardIconType {
        Diamond = 1,//方块
        Club = 2,//梅花
        Heart = 3,//红心
        Spade = 4,//黑桃
        JokerS = 5,//小王
        JokerL = 6,//大王
    }

    /**
     * 扑克效果类型（用于音效以及动画特效，与资源同名）
     */
    export enum ECardEffectType {
        Single = 101,//单张
        Double = 102,//对子
        Liandui = 103,//连对
        Shunzi = 104,//顺子
        Sandaier = 105,//三带二
        Sidaisan = 106,//四带三        
        Feiji = 107,//飞机
        Zhadan = 108,//炸弹
        San,//三张(只能在最后且没有其他牌时)
        Sandaiyi,//三带一
        Sidaier,//四带二
        SingleEnd,//报单
        Spring,//春天
        Dani,//管牌，这个是比较特殊的类型，没有特效
        Pass,//要不起
    }

    /**
     * 扑克牌型
     */
    export enum ECardPatternType {
        DAN_ZHANG = 101,//单张
        DUI_ZI = 102,//对子
        LIAN_DUI = 103,//连对
        SHUN_ZI = 104,//顺子
        SAN_DAI_ER = 105,//三带二
        SI_DAI_ER = 109,//四带二
        SI_DAI_SAN = 106,//四带三
        FEI_JI = 107,//飞机
        ZHA_DAN = 108//炸弹
    }

    /**
     * 扑克玩法类型
     */
    export enum ECardGameType {
        /** 炸弹不可拆*/
        ZHA_DAN_BU_KE_CHAI = 100002,

        /** 十五张*/
        SHI_WU_ZHANG = 100101,

        /** 首局黑桃三先出*/
        HEI_TAO_SAN_FIRST = 100102,

        /** 红桃十扎鸟*/
        HONG_TAO_SHI_ZHA_NIAO = 100103,

        /** 四个不带牌*/
        SI_GE_BU_DAI_PAI = 100104,

        /** 四个带三张牌*/
        SI_GE_DAI_SAN_PAI = 100107,

        /** 四个带二张牌*/
        SI_GE_DAI_ER_PAI = 100108,

        /** 显示剩余牌数*/
        SHOW_REST_CARD_NUM = 100109,

        /** 三个少带出完 */
        SAN_GE_SHAO_DAI_CHU_WAN = 100111,
        /** 三个少带接完 */
        SAN_GE_SHAO_DAI_JIE_WAN = 100112,
        /** 飞机少带出完 */
        FEI_JI_SHAO_DAI_CHU_WAN = 100113,
        /** 飞机少带接完 */
        FEI_JI_SHAO_DAI_JIE_WAN = 100114,

        /** 普通模式 */
        LOW_SPEED_MODE = 100115,
        /** 快速模式 */
        QUICK_SPEED_MODE = 100116,
    }

    // /**
    // * 扑克牌局状态
    // */
    // export enum ECardGameState {
    //     NULL, //没有牌局，同时也标识牌局结束
    //     WAITING_START, //等待开始中
    //     PLAYING //正在麻将游戏中
    // }

    /**
     * 扑克玩法
     */
    export enum ECardGamePlayWay {
        JING_DIAN_PAO_DE_KUAI = 10000,//经典跑得快
        SHI_WU_ZHANG_PAO_DE_KUAI = 10001,//十五张跑得快
    }
}