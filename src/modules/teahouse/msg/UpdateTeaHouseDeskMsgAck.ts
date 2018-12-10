module FL {
    /** 更新茶楼桌子变更类型 */
    export enum EUpdateTableType {
        /** 新增玩家 */
        newPlayer = 1,//
        /** 删除玩家 */
        delPlayer = 2,//
        /** 新增桌子 */
        newTable = 3,//
        /** 解散桌子 */
        disTable = 4,//
        /** 更新桌子状态 */
        updateTable = 5,//
        /** 更新整个桌子 */
        reTable = 6
    }

    /** 更新茶楼桌子消息返回 */
    export class UpdateTeaHouseDeskMsgAck extends AbstractNewNetMsgBaseAck {
        /** 茶楼ID */
        public teaHouseId;
        /** 楼层*/
        public teaHouseLayer;
        /** 桌子编号*/
        public deskNum;
        /** 牌桌ID*/
        public tableId: string;
        /** 变更类型*///1.新增玩家   2.删除玩家  3.新增桌子 4.解散桌子 5.更新桌子状态
        public updateType;
        /** 状态*/
        public tableState = -1;
        /** 变更玩家,新增玩家或桌子时用*/
        public updatePlayer: GamePlayer = null;
        /** 位置，删除玩家时用*/
        public updatePos = -1;
        /** 整个桌子信息，type=6时使用*/
	    public deskInfo: TeaHouseDeskInfo = null;
        /** 当前局数 */
        public curentRound: number;
        /** 总局数 */
        public totalRound: number;

        public constructor() {
            super(MsgCmdConstant.MSG_UPDATE_TEAHOUSE_DESK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;

            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.deskNum = ar.sInt(self.deskNum);
            self.tableId = ar.sString(self.tableId);
            self.updateType = ar.sInt(self.updateType);
            self.tableState = ar.sInt(self.tableState);
            self.updatePlayer = <GamePlayer>ar.sObject(self.updatePlayer);
            self.updatePos = ar.sInt(self.updatePos);
            self.deskInfo = <TeaHouseDeskInfo>ar.sObject(self.deskInfo);
            self.curentRound = ar.sInt(self.curentRound);
            self.totalRound = ar.sInt(self.totalRound);
        }
    }
}