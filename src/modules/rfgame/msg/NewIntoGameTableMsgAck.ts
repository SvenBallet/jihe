module FL {
    export class NewIntoGameTableMsgAck extends AbstractNewNetMsgBaseAck {

        /**
         * 我的桌子位置
         */
        public playerPos = 0;//byte
        /**
         * 房主名称
         */
        public creatorName = "";//String
        /**
         * 房主ID
         */
        public createPlayerID = "";//String

        // 如果是vip桌子，这个不是0
        public vipRoomID = 0;//int

        /**
         * 玩家列表
         */
        public gamePlayers: Array<GamePlayer> = new Array<GamePlayer>();// List<GamePlayer>

        /**
         * 总局数
         */
        public totalPlayCount = 0;//int
        /**
         * 当前局数
         */
        public currPlayCount = 0;//int
        /**
         * 主玩法
         */
        public mainGamePlayRule = 0;//int

        /**
         * 子玩法
         */
        public subGamePlayRuleList: Array<number> = new Array<number>();//List<Integer>

        /**
         * 玩家人数
         */
        public playersNumber = 0;//byte

        /**
         * 支付标识，0：房主支付, 1：房费均摊
         */
        public payType = 0;//byte

        /**
         * 开房的标识，0：普通，1：代开房，2：俱乐部开房
         */
        public createType = 0;//byte
        /** 是否回放 */
        public isReplay = false;//boolean
        /** 是否需要准备 */
        public isNeedReady = false;//boolean

        /** 茶楼ID */
        public teaHouseId = 0;
        /** 楼层  */
        public teaHouseLayer = 0;
        /** 桌子序号 */
        public teaHouseDesk = 0;

        /** 是否可以离开房间(主要用于在牌桌界面中右下角是显示 解散房间 还是 离开房间的提示) */
        public isCanLeaveRoom: boolean = false;

        /** 茶楼是否防封群 是否禁止分享 1允许分享*/
        public forbidShare:number = 1;

        /** 玩家可选的人数模式列表，列表的内容为人数（二人模式、三人模式等），没有值的话就没有可选模式 */
        public canSelectPlayerNumPatterns: Array<number> = [];


        /** 开始时间 (不进行序列化，回放的时候使用)  */
        public beginTimes: string = "";
        /** 结束时间 (不进行序列化，回放的时候使用)*/
        public endTimes: string = "";

        public constructor() {
            super(MsgCmdConstant.MSG_INTO_GAME_TABLE);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.playerPos = ar.sByte(self.playerPos);
            self.creatorName = ar.sString(self.creatorName);
            self.createPlayerID = ar.sString(self.createPlayerID);
            self.vipRoomID = ar.sInt(self.vipRoomID);
            self.gamePlayers = <Array<GamePlayer>>ar.sObjArray(self.gamePlayers);
            self.totalPlayCount = ar.sInt(self.totalPlayCount);
            self.currPlayCount = ar.sInt(self.currPlayCount);
            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.subGamePlayRuleList = <Array<number>>ar.sIntArray(self.subGamePlayRuleList);
            self.playersNumber = ar.sByte(self.playersNumber);
            self.payType = ar.sByte(self.payType);
            self.createType = ar.sByte(self.createType);
            self.isReplay = ar.sBoolean(self.isReplay);
            self.isNeedReady = ar.sBoolean(self.isNeedReady);
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.teaHouseDesk = ar.sInt(self.teaHouseDesk);
            self.isCanLeaveRoom = ar.sBoolean(self.isCanLeaveRoom);
            self.forbidShare = ar.sInt(self.forbidShare);
            self.canSelectPlayerNumPatterns = <Array<number>>ar.sIntArray(self.canSelectPlayerNumPatterns);
        }
    }

}