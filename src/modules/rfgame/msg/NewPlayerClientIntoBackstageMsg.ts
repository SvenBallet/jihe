module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  Tag0731 - NewPlayerClientIntoBackstageMsg
     * @Description:  // 客户端进入后台，从后台回来的消息
     * @Create: DerekWu on 2018/7/31 17:29
     * @Version: V1.0
     */
    export class NewPlayerClientIntoBackstageMsg extends NetMsgBase {
        /** 是否和后台相关（进入后台为true，从后台回来的时候为false） */
        public isBackstage: boolean = true;

        public constructor() {
            super(MsgCmdConstant.MSG_PLAYER_CLIENT_INTO_BACKSTAGE);
        }

        public serialize(ar: ObjectSerializer): void {
            super.serialize(ar);
            let self = this;
            self.isBackstage = ar.sBoolean(self.isBackstage);
        }
    }
}