module FL{

    export class RefreshItemBaseACK extends NetMsgBase{


        public baseItemList:Array<ItemBase>;


        constructor(){
            super(MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE_ACK);
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.baseItemList = <Array<ItemBase>> ar.sObjArray(self.baseItemList);
        }

    }
}