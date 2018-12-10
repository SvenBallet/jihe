module FL {
    /** 茶楼桌子详情移出玩家消息 */
    export class TeaHouseRemoveTablePlayerMsg extends NetMsgBase {
        /**茶楼ID */
        public teaHouseId: number;
        
        /** 楼层*/
        public teaHouseLayer: number;
        
        /**房间Id */
        public vipRoomId: number = 0;
        
        /**移除的玩家索引 */
        public targetPlayerIndex: number = 0;

        constructor() {
            super(MsgCmdConstant.MSG_TEAHOUSE_REMOVE_PLAYER);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.teaHouseId = ar.sInt(self.teaHouseId);
            self.teaHouseLayer = ar.sInt(self.teaHouseLayer);
            self.vipRoomId = ar.sInt(self.vipRoomId);
            self.targetPlayerIndex = ar.sInt(self.targetPlayerIndex);
        }
    }
}