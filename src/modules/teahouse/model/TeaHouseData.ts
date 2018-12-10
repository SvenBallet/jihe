module FL {
    /** 楼层数据枚举 */
    export enum EFloorData {
        fstFloorData = 1,//一楼
        sndFloorData = 2,//二楼
        trdFloorData = 3,//三楼
    }

    /** 茶楼玩家权限 */
    export enum ETHPlayerPower {
        ILLEGAL = -1,//非法值
        CREATOR = 1,//创建者
        MANAGER = 2,//管理员
        MEMBER = 4,//普通成员
    }

    /** 茶馆信息数据接口 */
    export interface ITHInfo {
        name?: string;//名字
        id?: any;//id
        notice?: string;//公告         
        floorNum?: number;//楼层数
        creatorName?: string;//老板名字
        creatorID?: any;//老板ID
        diamond?: number;//钻石数    
        /** 茶楼管理--设置 */
        sameIP?: boolean;//禁止同IP
        verify?: boolean;//茶楼审核
        share?: boolean;//防封群
        emoicon?: boolean;//禁止坏表情
        resetTime?: number;//战绩重置时间 
        /** 茶楼管理--布局--打烊留言 */
        leaveMsg?: string;//留言
    }

    /** 茶楼管理设置数据接口 */
    export interface ITHMgrSettings {
        sameIP: boolean;//禁止同IP
        verify: boolean;//茶楼审核
        share: boolean;//防封群
        emoicon: boolean;//禁止坏表情
        resetTime: number;//战绩重置时间
    }

    /** 茶楼管理留言数据接口 */
    export interface ITHLeaveMsg {
        leaveMsg: string;
    }

    /** 茶楼数据 */
    export class TeaHouseData {
        /** 当前茶楼ID */
        public static curID: any;
        /** 当前楼层游戏类型 */
        public static curType: EGameType = EGameType.MAHJONG;
        /** 当前楼层玩法类型 */
        public static curPlayWay: ECardGamePlayWay | MJGamePlayWay = MJGamePlayWay.ZHUAN_ZHUAN_MJ;// ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI;
        /** 当前楼层子玩法 */
        public static curRuleList: number[] = [];
        /** 当前楼层每桌游戏人数 */
        public static curPlayerNum: number = 2;
        /** 当前楼层游戏总局数 */
        public static curGameNum: number = 10;
        /** 玩家在当前茶楼权限 */
        public static curPower: ETHPlayerPower = ETHPlayerPower.CREATOR;
        /** 当前茶楼每层最大桌子数 */
        public static curMaxTableNum: number = 30;
        /** 当前所在楼层 */
        public static curFloor: number = 1;
        /** 当前楼层桌子列表 */
        public static curTable: ITHTableItem[] = [];
        /** 茶楼当前申请数 */
        public static curApplyCount: number = 0;
        /** 当前楼层正显示的最大桌子序号 */
        public static curMaxTableIndex: number = 0;
        /** 当前楼层已有最大的桌子序号（根据服务端数据） */
        public static maxTableIndex: number = 0;
        /** 茶楼一楼数据*/
        public static fstFloorData: TeaHouseLayer = null;
        /** 茶楼二楼数据 */
        public static sndFloorData: TeaHouseLayer = null;
        /** 茶楼三楼数据 */
        public static trdFloorData: TeaHouseLayer = null;
        /** 茶楼是否打烊 */
        public static isOff: boolean = false;

        /** 茶楼总楼层数 */
        public static teaHouseTotalFloor: number = 0;
        /** 茶楼信息数据 */
        public static teaHouseInfo: ITHInfo = {
            name: "经典跑得快", id: 111112, floorNum: 1, creatorName: "王麻子", creatorID: 121212, notice: "", diamond: 0
            // sameIP: false, verify: true, share: false, emoicon: false, resetTime: 24, leaveMsg: ""
        };
        /** 茶樓 */
        public static teaHouse: TeaHouse = null;
        /** 茶楼桌子列表 */
        public static teaHouseTableList: Array<TeaHouseDeskInfo> = [];
        /** 茶楼成员列表 */
        public static teaHouseMemList: Array<TeaHouseMember> = [];
        /** 茶楼申请成员列表 */
        public static teaHouseApplyList: Array<TeaHouseApply> = [];
        /** 茶樓小二候選列表 */
        public static teaHouseWaiterList: Array<TeaHouseMember> = [];
        /** 茶楼战绩列表 */
        public static teaHouseRecordList: Array<VipRoomRecord> = [];
        /** 大赢家列表 */
        public static teaHouseWinnerList: Array<TeaHouseMember> = [];
        /** 茶楼经营状况 */
        public static teaHousePerformanceList: Array<TeaHousePerformanceAll> = [];
        /** 茶楼战榜列表 */
        public static teaHouseRankingList: Array<TeaHouseWarList> = [];
        /** 茶楼管理设置数据 */
        // public static teaHouseMgrSettings: ITHMgrSettings = { sameIP: false, verify: true, share: false, emoicon: false, resetTime: 24 }
        /** 滚动公告内容 */
        public static anounceMsgText: string = "不要998，不要98，只要9块8，你的代码就能原地爆炸！";
    }
}