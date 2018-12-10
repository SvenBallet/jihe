module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubOptDiamondMsg
     * @Description:  新增钻石
     * @Create: ArielLiang on 2018/3/12 16:13
     * @Version: V1.0
     */
    export class ClubOptDiamondMsg extends NetMsgBase
    {
        public clubId:number = 0;
        public diamond:number = 0;

        constructor()
        {
            super(MsgCmdConstant.MSG_OPT_DIAMOND);
        }

        public serialize(ar:ObjectSerializer):void
        {
            super.serialize(ar);
            let self = this;
            self.clubId = ar.sInt(self.clubId);
            self.diamond = ar.sInt(self.diamond);
        }
    }
}