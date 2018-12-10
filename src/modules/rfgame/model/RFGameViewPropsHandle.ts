module FL {
    /** 位置属性接口 */
    export interface IPosProps {
        x?: number;
        y?: number;
        verticalCenter?: number;//verticalCenter
        horizontalCenter?: number;//horizontalCenter
        left?: number;//left
        right?: number;//right
        bottom?: number;//bottom
        top?: number;//top
        width?: number;
        height?: number
    }

    /** 显示卡牌组属性接口 */
    export interface IViewCardProps {
        scale?: number;//scale
        gap?: number;//gap
    }

    /** 玩家头像信息组属性接口 */
    export interface IInfoProps {
        init: IPosProps;//未开始打牌时头像组的初始位置
        initInfo: IPosProps;//未开始打牌时信息组的初始位置
        end: IPosProps;//打牌时头像组的位置
        endInReplay?: IPosProps;//回放时头像组的位置，没有则使用 end
        endInfo: IPosProps;//打牌时信息组的位置
    }

    /** 玩家出牌显示组属性接口 */
    export interface IChuProps {
        vcp: IViewCardProps;//卡牌属性
        vie: IPosProps;//显示组props
        chu: IPosProps;//出牌组props
        eff: IPosProps;//特效组props
    }

    /** 玩家手牌页面显示组属性接口 */
    export interface IHandProps {
        timer: IPosProps;//计时器位置属性
        singleEnd: IPosProps;//报单特效位置属性
    }

    /** 剩余牌显示组属性接口 */
    export interface IRestProps {
        pos: IPosProps;//位置属性
        vcp: IViewCardProps;//卡牌显示属性
    }

    /**
     * 显示类属性控制
     */
    export class RFGameViewPropsHandle {
        //玩家信息组pos
        public static LEFT_INFOPROPS: { [index: number]: IInfoProps };
        public static RIGHT_INFOPROPS: { [index: number]: IInfoProps };
        public static UP_INFOPROPS: { [index: number]: IInfoProps };
        public static DOWN_INFOPROPS: { [index: number]: IInfoProps };

        //玩家手牌组pos
        public static LEFT_HANDPROPS: { [index: number]: IHandProps };
        public static RIGHT_HANDPROPS: { [index: number]: IHandProps };
        public static DOWN_HANDPROPS: { [index: number]: IHandProps };
        public static UP_HANDPROPS: { [index: number]: IHandProps };

        //玩家显示牌pos
        public static LEFT_CHUPROPS: { [index: number]: IChuProps };
        public static RIGHT_CHUPROPS: { [index: number]: IChuProps };
        public static DOWN_CHUPROPS: { [index: number]: IChuProps };
        public static UP_CHUPROPS: { [index: number]: IChuProps };

        /** 特效props */
        public static EFF_PROPS: { [index: number]: IPosProps };

        /** 剩余牌显示组props */
        public static REST_CARDSPROPS: { [index: number]: IRestProps };

        //根据牌桌方向以及当前游戏类型获取玩家信息组的位置信息
        public static getInfoProps(pzOrientation: PZOrientation, gameType: EGameType) {
            if (pzOrientation == PZOrientation.DOWN) return this.DOWN_INFOPROPS[gameType];
            else if (pzOrientation == PZOrientation.UP) return this.UP_INFOPROPS[gameType];
            else if (pzOrientation == PZOrientation.RIGHT) return this.RIGHT_INFOPROPS[gameType];
            else if (pzOrientation == PZOrientation.LEFT) return this.LEFT_INFOPROPS[gameType];
        }

        /** 根据人数初始化玩家信息组pos */
        public static initInfoProps(n: number) {
            this.LEFT_INFOPROPS = {};
            this.RIGHT_INFOPROPS = {};
            this.UP_INFOPROPS = {};
            this.DOWN_INFOPROPS = {};
            switch (n) {
                case 2://2个人，只有上下
                    //新麻将
                    this.UP_INFOPROPS[EGameType.MAHJONG] = {
                        init: { horizontalCenter: 0, top: 50 },
                        initInfo: { x: 173, y: 105 },
                        end: { horizontalCenter: 330, top: 3 },
                        endInfo: {}
                    };
                    this.DOWN_INFOPROPS[EGameType.MAHJONG] = {
                        init: { horizontalCenter: 0, bottom: 26 },
                        // initInfo: { x: 275, y: 36 },
                        initInfo: { x: 173, y: 105 },
                        end: { horizontalCenter: -566, bottom: 104 },
                        endInfo: {}
                    };

                    //扑克
                    this.UP_INFOPROPS[EGameType.RF] = {
                        // init: { horizontalCenter: 0, top: 100 },
                        // initInfo: { x: 173, y: 105 },
                        // end: { horizontalCenter: 306, top: 3 },
                        // endInfo: {}
                        init: { verticalCenter: 8, right: 61 },
                        initInfo: { x: 173, y: 105 },
                        end: { verticalCenter: -120, right: -135 },
                        endInfo: {}
                    };
                    this.DOWN_INFOPROPS[EGameType.RF] = {
                        init: { horizontalCenter: 0, bottom: 68 },
                        initInfo: { x: 173, y: 105 },
                        // end: { horizontalCenter: -585, bottom: 0 },
                        end: { horizontalCenter: -585, bottom: 210 },
                        endInfo: {}
                    };
                    break;
                case 3://3个人，只有左右下
                    //新麻将
                    this.LEFT_INFOPROPS[EGameType.MAHJONG] = {
                        init: { verticalCenter: 8, left: 61 },
                        initInfo: { x: 173, y: 105 },
                        end: { verticalCenter: 0, left: -140 },
                        endInfo: {}
                    };
                    this.RIGHT_INFOPROPS[EGameType.MAHJONG] = {
                        init: { verticalCenter: 8, right: 61 },
                        initInfo: { x: 173, y: 105 },
                        end: { verticalCenter: -120, right: -134 },
                        endInReplay: { verticalCenter: -74, right: -134 },
                        endInfo: {}
                    };
                    this.DOWN_INFOPROPS[EGameType.MAHJONG] = {
                        init: { horizontalCenter: 0, bottom: 26 },
                        // initInfo: { x: 275, y: 36 },
                        initInfo: { x: 173, y: 105 },
                        end: { horizontalCenter: -566, bottom: 104 },
                        endInfo: {}
                    };

                    //扑克
                    this.LEFT_INFOPROPS[EGameType.RF] = {
                        init: { verticalCenter: 8, left: 61 },
                        initInfo: { x: 173, y: 105 },
                        // end: { verticalCenter: -90, left: -160 },
                        end: { verticalCenter: -120, left: -160 },
                        endInfo: {}
                    };
                    this.RIGHT_INFOPROPS[EGameType.RF] = {
                        init: { verticalCenter: 8, right: 61 },
                        initInfo: { x: 173, y: 105 },
                        end: { verticalCenter: -120, right: -135 },
                        endInfo: {}
                    };
                    this.DOWN_INFOPROPS[EGameType.RF] = {
                        init: { horizontalCenter: 0, bottom: 68 },
                        // initInfo: {x: 275, y: 26},
                        initInfo: { x: 173, y: 105 },
                        // end: { horizontalCenter: -585, bottom: 0 },
                        end: { horizontalCenter: -585, bottom: 210 },
                        endInfo: {}
                    };
                    break;
                case 4://4个人
                    //新麻将
                    this.LEFT_INFOPROPS[EGameType.MAHJONG] = {
                        init: { verticalCenter: 8, left: 61 },
                        initInfo: { x: 173, y: 105 },
                        end: { verticalCenter: -51, left: -140 },
                        endInfo: {}
                    };
                    this.RIGHT_INFOPROPS[EGameType.MAHJONG] = {
                        init: { verticalCenter: 8, right: 61 },
                        initInfo: { x: 173, y: 105 },
                        end: { verticalCenter: -120, right: -134 },
                        endInReplay: { verticalCenter: -74, right: -134 },
                        endInfo: {}
                    };
                    this.UP_INFOPROPS[EGameType.MAHJONG] = {
                        init: { horizontalCenter: 0, top: 50 },
                        initInfo: { x: 173, y: 105 },
                        end: { horizontalCenter: 330, top: 3 },
                        endInfo: {}
                    };
                    this.DOWN_INFOPROPS[EGameType.MAHJONG] = {
                        init: { horizontalCenter: 0, bottom: 26 },
                        initInfo: { x: 173, y: 105 },
                        end: { horizontalCenter: -566, bottom: 104 },
                        endInfo: {}
                    };

                    //扑克
                    this.LEFT_INFOPROPS[EGameType.RF] = {
                        init: { verticalCenter: 8, left: 61 },
                        initInfo: { x: 173, y: 110 },
                        end: { verticalCenter: -90, left: -134 },
                        endInfo: {}
                    };
                    this.RIGHT_INFOPROPS[EGameType.RF] = {
                        init: { verticalCenter: 8, right: 61 },
                        initInfo: { x: 173, y: 110 },
                        end: { verticalCenter: -90, right: -134 },
                        endInfo: {}
                    };
                    this.UP_INFOPROPS[EGameType.RF] = {
                        init: { horizontalCenter: 0, top: 100 },
                        initInfo: { x: 173, y: 110 },
                        end: { horizontalCenter: 306, top: 3 },
                        endInfo: {}
                    };
                    this.DOWN_INFOPROPS[EGameType.RF] = {
                        init: { horizontalCenter: 0, bottom: 68 },
                        initInfo: { x: 173, y: 110 },
                        end: { horizontalCenter: -560, bottom: 0 },
                        endInfo: {}
                    };

                    break;
                default:
                    break;
            }
        }

        public static getChuProps(pzOrientation: PZOrientation, gameType: EGameType) {
            if (pzOrientation == PZOrientation.DOWN) return this.DOWN_CHUPROPS[gameType];
            else if (pzOrientation == PZOrientation.UP) return this.UP_CHUPROPS[gameType];
            else if (pzOrientation == PZOrientation.RIGHT) return this.RIGHT_CHUPROPS[gameType];
            else if (pzOrientation == PZOrientation.LEFT) return this.LEFT_CHUPROPS[gameType];
        }

        /** 初始化玩家出牌显示组props */
        public static initChuProps(n: number) {
            this.LEFT_CHUPROPS = {};
            this.RIGHT_CHUPROPS = {};
            this.UP_CHUPROPS = {};
            this.DOWN_CHUPROPS = {};
            switch (n) {
                case 2://2个人，只有上下，还有左（显示剩余牌）                 
                    //麻将   
                    // this.UP_CHUPROPS[EGameType.MJ] = { vcp: {}, chu: {} };
                    // this.DOWN_CHUPROPS[EGameType.MJ] = {};

                    //扑克
                    this.UP_CHUPROPS[EGameType.RF] = {
                        // vcp: { scale: 0.75, gap: -35 },
                        // vie: { width: 380, height: 100, horizontalCenter: 0, top: 140 },
                        // chu: { width: 380, height: 100 },
                        // eff: { width: 380, height: 100 }
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, verticalCenter: -220, right: 220 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };
                    this.DOWN_CHUPROPS[EGameType.RF] = {
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, horizontalCenter: 0, bottom: 300 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };
                    break;
                case 3://3个人，只有左右下
                    //麻将   
                    // this.LEFT_CHUPROPS[EGameType.MJ] = {};
                    // this.RIGHT_CHUPROPS[EGameType.MJ] = {};
                    // this.DOWN_CHUPROPS[EGameType.MJ] = {};

                    //扑克
                    this.LEFT_CHUPROPS[EGameType.RF] = {
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, verticalCenter: -220, left: 190 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };
                    this.RIGHT_CHUPROPS[EGameType.RF] = {
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, verticalCenter: -220, right: 220 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };
                    this.DOWN_CHUPROPS[EGameType.RF] = {
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, horizontalCenter: 0, bottom: 300 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };
                    break;
                case 4://4个人
                    //麻将   
                    // this.LEFT_CHUPROPS[EGameType.MJ] = {};
                    // this.RIGHT_CHUPROPS[EGameType.MJ] = {};
                    // this.UP_CHUPROPS[EGameType.MJ] = {};
                    // this.DOWN_CHUPROPS[EGameType.MJ] = {};

                    //扑克
                    this.LEFT_CHUPROPS[EGameType.RF] = {
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, verticalCenter: -150, left: 190 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };
                    this.RIGHT_CHUPROPS[EGameType.RF] = {
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, verticalCenter: -150, right: 220 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };
                    this.UP_CHUPROPS[EGameType.RF] = {
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, horizontalCenter: 0, top: 140 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };
                    this.DOWN_CHUPROPS[EGameType.RF] = {
                        vcp: { scale: 0.75, gap: -35 },
                        vie: { width: 380, height: 100, horizontalCenter: 0, bottom: 300 },
                        chu: { width: 380, height: 100 },
                        eff: { width: 380, height: 100 }
                    };

                    break;
                default:
                    break;
            }
        }

        public static getHandProps(pzOrientation: PZOrientation, gameType: EGameType) {
            if (pzOrientation == PZOrientation.DOWN) return this.DOWN_HANDPROPS[gameType];
            else if (pzOrientation == PZOrientation.UP) return this.UP_HANDPROPS[gameType];
            else if (pzOrientation == PZOrientation.RIGHT) return this.RIGHT_HANDPROPS[gameType];
            else if (pzOrientation == PZOrientation.LEFT) return this.LEFT_HANDPROPS[gameType];
        }

        /** 初始化玩家手牌页面显示组props */
        public static initHandProps(n: number) {
            this.LEFT_HANDPROPS = {};
            this.RIGHT_HANDPROPS = {};
            this.UP_HANDPROPS = {};
            this.DOWN_HANDPROPS = {};
            switch (n) {
                case 2:
                    //扑克
                    this.UP_HANDPROPS[EGameType.RF] = {
                        // timer: { verticalCenter: 0, horizontalCenter: -120 },
                        // singleEnd: { verticalCenter: -120, horizontalCenter: -100 }
                        timer: { verticalCenter: 90, horizontalCenter: 0 },
                        singleEnd: { verticalCenter: 90, horizontalCenter: 50 }
                    };
                    this.DOWN_HANDPROPS[EGameType.RF] = {
                        timer: { verticalCenter: -130, horizontalCenter: -320 },
                        singleEnd: { bottom: 40, horizontalCenter: -500 }
                    };
                    break;
                case 3:
                    //扑克
                    this.LEFT_HANDPROPS[EGameType.RF] = {
                        timer: { verticalCenter: 90, horizontalCenter: 0 },
                        singleEnd: { verticalCenter: 90, horizontalCenter: -50 }
                    };
                    this.RIGHT_HANDPROPS[EGameType.RF] = {
                        timer: { verticalCenter: 90, horizontalCenter: 0 },
                        singleEnd: { verticalCenter: 90, horizontalCenter: 50 }
                    };
                    this.DOWN_HANDPROPS[EGameType.RF] = {
                        timer: { verticalCenter: -130, horizontalCenter: -320 },
                        singleEnd: { bottom: 40, horizontalCenter: -500 }
                    };
                    break;
                case 4:
                    //扑克
                    this.LEFT_HANDPROPS[EGameType.RF] = {
                        timer: { verticalCenter: 130, horizontalCenter: 50 },
                        singleEnd: { verticalCenter: 110, horizontalCenter: -50 }
                    };
                    this.RIGHT_HANDPROPS[EGameType.RF] = {
                        timer: { verticalCenter: 130, horizontalCenter: -50 },
                        singleEnd: { verticalCenter: 110, horizontalCenter: 50 }
                    };
                    this.UP_HANDPROPS[EGameType.RF] = {
                        timer: { verticalCenter: 0, horizontalCenter: -120 },
                        singleEnd: { verticalCenter: -120, horizontalCenter: -100 }
                    };
                    this.DOWN_HANDPROPS[EGameType.RF] = {
                        timer: { verticalCenter: -130, horizontalCenter: -320 },
                        singleEnd: { bottom: 40, horizontalCenter: -500 }
                    };
                    break;
            }
        }

        /** 获取特效属性 */
        public static getEffProps(type: DBGroupName) {
            return this.EFF_PROPS[type];
        }

        /** 初始化特效属性 */
        public static initEffProps() {
            this.EFF_PROPS = {};
            this.EFF_PROPS[DBGroupName.FEI_JI] = { x: 1280 / 2, y: 720 / 2 };
            this.EFF_PROPS[DBGroupName.ZHA_DAN] = { x: 1280 / 2 + 30, y: 720 / 2 };
            this.EFF_PROPS[DBGroupName.CHUN_TIAN] = { x: 1280 / 2, y: 550 };
        }

        /** 获取余牌显示组属性 */
        public static getRestProps(type: EGameType) {
            return this.REST_CARDSPROPS[type];
        }
        /** 初始化余牌显示组属性 */
        public static initRestProps() {
            this.REST_CARDSPROPS = {};
            this.REST_CARDSPROPS[EGameType.RF] = { pos: { width: 380, height: 100, verticalCenter: -220, left: 190 }, vcp: { scale: 0.75, gap: -35 } }
        }

        /**
         * 给显示对象赋予属性值
         */
        public static addPropsToObj(target: any, props: any) {
            for (let k in props) {
                target[k] = props[k];
            }
        }

        /** 初始化 */
        public static init(n: number) {
            this.initInfoProps(n);
            this.initChuProps(n);
            this.initHandProps(n);
            this.initEffProps();
            this.initRestProps();
        }
    }
}