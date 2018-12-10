module FL {
    export class NewCreateRoomMsg extends NetMsgBase {
        /**
         * 总局数
         */
        public totalPlayCount: number;//byte

        /**
         * 密码
         */
        public psw: string = "";

        /**
         * 主玩法
         */
        public mainGamePlayRule: number = 0;//int

        /**
         * 子玩法
         */
        public subGamePlayRuleList: Array<number> = new Array<number>();

        /**
         * 玩家人数
         */
        public playersNum: number = 0;//byte

        /**
         * 多人支付标识，0房主支付, 1房费均摊
         */
        public payType: number = 0;//byte

        /**
         * 创建类型，0代表普通，1代表代开房，2代表俱乐部开房
         */
        public createType: number = 0;//byte

        /**
         * 代开房的数量
         */
        public daiKaiNumber: number = 0;//int

        /** 俱乐部Id */
        public clubId: number = 0;//int

        public constructor() {
            super(MsgCmdConstant.MSG_CREATE_ROOM);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.totalPlayCount = ar.sByte(self.totalPlayCount);
            self.psw = ar.sString(self.psw);
            self.mainGamePlayRule = ar.sInt(self.mainGamePlayRule);
            self.subGamePlayRuleList = <Array<number>>ar.sIntArray(self.subGamePlayRuleList);
            self.playersNum = ar.sByte(self.playersNum);
            self.payType = ar.sByte(self.payType);
            self.createType = ar.sByte(self.createType);
            self.daiKaiNumber = ar.sInt(self.daiKaiNumber);
            self.clubId = ar.sInt(self.clubId);
        }
    }
}