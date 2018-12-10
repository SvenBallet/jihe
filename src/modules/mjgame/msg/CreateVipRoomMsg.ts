module FL {
    import numberToBlendMode = egret.sys.numberToBlendMode;

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - CreateVipRoomMsg
     * @Description:  //创建房间
     * @Create: DerekWu on 2017/11/14 21:16
     * @Version: V1.0
     */
    export class CreateVipRoomMsg extends NetMsgBase {

        public quanNum: number;//几圈的
        public psw: string = "";
        public roomID: number;  //MJRoomID
        public selectWayNum: number;//变种玩法选择

        /** 主玩法 */
        public mainGamePlayRule: number = 0;

        /** 子玩法 */
        public minorGamePlayRuleList: Array<number> = new Array<number>();

        /** 玩家人数 */
        public playersNumber: number = 0;

        /** 多人支付标识，0房主支付, 1房费均摊 */
        public payType: number = 0;

        /** 开房的标识，0代表普通，1代表代开房，2代表俱乐部开房 */
        public roomType: number = 0;

        /** 代开房的数量 */
        public daiKaiNumber: number = 0;

        // public unused_0: number; //房间人数 GameConstant.GAME_PLAY_RULE_4_REN *** ***
        // public unused_1: number; //房费是否均摊  0：否 1：是
        // public unused_2: number; //代开房字段  (msg.unused_2 & 0xffff) == GameConstant.AGENT_TABLE_FLAG  int daiKaiNum = (msg.unused_2 >> 16) & 0xfff;
        // public unused_3: number;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_VIP_CREATE_ROOM);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.quanNum = ar.sInt(self.quanNum);
            self.psw = ar.sString(self.psw);
            self.roomID = ar.sInt(self.roomID);
            self.selectWayNum = ar.sInt(self.selectWayNum);

            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.minorGamePlayRuleList = <Array<number>> ar.sIntArray(self.minorGamePlayRuleList);
            self.playersNumber = ar.sInt(self.playersNumber);
            self.payType = ar.sInt(self.payType);
            self.roomType = ar.sInt(self.roomType);
            self.daiKaiNumber = ar.sInt(self.daiKaiNumber);
        }

    }
}