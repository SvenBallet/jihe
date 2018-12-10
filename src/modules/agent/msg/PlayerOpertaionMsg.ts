module FL{

    export class PlayerOpertaionMsg extends NetMsgBase{
        public opertaionID:number = 0;

        //账户
        public account:string = "";

        //昵称
        public playerName:string ="";

        //头像索引
        public headIndex:number =0;

        //性别
        public sex:number = 0;

        //旧密码
        public oldPassWord:string ="";

        //新密码
        public newPassWord:string ="";

        //是否可以加为好友（0,可以，1不可以）
        public canFriend:number =0;

        //扩展字符
        public opStr:string="";

        constructor(opertaionID:number,oldPassWord:string,newPassWord:string){
            super(MsgCmdConstant.MSG_GAME_SEND_PLAYER_OPERATIOIN_STRING);
            this.opertaionID = opertaionID;
            this.oldPassWord = oldPassWord;
            this.newPassWord = newPassWord;
        }


        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            let vPlayerVO:PlayerVO = LobbyData.playerVO;
            this.account = vPlayerVO.account;
            self.opertaionID = ar.sInt(self.opertaionID);
            self.account = ar.sString(self.account);
            self.playerName = ar.sString(self.playerName);
            self.headIndex = ar.sInt(self.headIndex);
            self.sex = ar.sInt(self.sex);
            self.oldPassWord = ar.sString(self.oldPassWord);
            self.newPassWord = ar.sString(self.newPassWord);
            self.canFriend = ar.sInt(self.canFriend);
            self.opStr = ar.sString(self.opStr);
        }

    }
}