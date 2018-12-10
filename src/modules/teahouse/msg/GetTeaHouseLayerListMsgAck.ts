module FL {
    export class GetTeaHouseLayerListMsgAck extends AbstractNewNetMsgBaseAck {
        /**楼层列表 */
        public layerList: Array<TeaHouseLayer>;//List<TeaHouseLayer> 

        public constructor() {
            super(MsgCmdConstant.MSG_GET_TEAHOUSE_LAYER_LIST_ACK);
        }

        public newSerialize(ar: ObjectSerializer): void {
            let self = this;
            self.layerList = <Array<TeaHouseLayer>>ar.sObjArray(self.layerList);
        }
    }
}