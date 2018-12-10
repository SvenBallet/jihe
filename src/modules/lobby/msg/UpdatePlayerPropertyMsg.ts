module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - UpdatePlayerPropertyMsg
     * @Description:  //服务器通知客户端更新属性
     * @Create: DerekWu on 2017/11/14 19:57
     * @Version: V1.0
     */
    export class UpdatePlayerPropertyMsg extends NetMsgBase {

        /** 玩家货币0 金币*/
        public gold:number;

        /** 钻石*/
        public diamond:number;
        /** 积分*/
        public score:number;
        /** 胜利记录*/
        public wons:number;
        /** 失败记录*/
        public loses:number;
        /** 逃跑记录*/
        public playerType:number;

        public parentIndex:number;
        //单机生命产生的cd
        public serverCD:number;
        public payBack:number = 0.0;//返利

        /** 邀请码*/
        public inviteCode:number = 0;
        //新增代理等级
        public agentLevel:number;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_UPDATE_PLAYER_PROPERTY);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.gold=ar.sInt(self.gold);
            self.diamond=ar.sInt(self.diamond);
            self.score=ar.sInt(self.score);
            self.wons=ar.sInt(self.wons);
            self.loses=ar.sInt(self.loses);
            self.playerType=ar.sInt(self.playerType);
            self.parentIndex=ar.sInt(self.parentIndex);
            self.serverCD=ar.sInt(self.serverCD);
            self.payBack=ar.sFloat(self.payBack);
            self.inviteCode=ar.sInt(self.inviteCode);
            self.agentLevel=ar.sInt(self.agentLevel);
        }

    }
}