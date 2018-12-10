module FL{

    export class RefreshItemBaseMsg extends NetMsgBase{

        public account: string = "";

        constructor(){
            super(MsgCmdConstant.MSG_GAME_REFRESH_ITEM_BASE);
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            // let vPlayerVO:PlayerVO = LobbyData.playerVO;
            // this.account = vPlayerVO.account;
            self.account=ar.sString(self.account);
        }

    }
}