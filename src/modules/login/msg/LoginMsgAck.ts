module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LoginMsgAck
     * @Description:  登录返回消息
     * @Create: DerekWu on 2017/11/10 11:13
     * @Version: V1.0
     */
    export class LoginMsgAck extends NetMsgBase {

        //玩家信息
        public player:Player;
        //
        public baseItemList:Array<ItemBase>;
        public result:number;
        /**登陆的奖励*/
        public reward:number;
        public lifeCD:number;
        //首次登录
        public firstLogin:number;
        //
        public bigGiftContent:string = "";//大礼包内容
        /**持续登录的天数*/
        public continueLanding:number;
        /**5天的奖励*/
        public goldList:Array<number>;

        /**好友列表*/
        public friends:Array<FriendPlayer>;

        /**系统返回的flags*/
        public ackFlags:number;

        public handsDefintions:number; //vip房间是多少把的定义一个字节一种
        /**各种钻石送的道具和数量*/
        public itemAndNumsList:Array<number>;

        /** 已经废弃 */
        public rooms:Array<GameRoom>;

        //客户端配置
        public clientParma:Array<SystemConfigPara>;

        /**是否有公告*/
        public noticeIsExit:number;
        /**公告标题*/
        public noticeTitle:string = "";
        /**公告内容*/
        public noticeContent:string = "";

        /** 麻将创建房间需要钻石，列表结构，局数、消耗钻石数、局数、消耗钻石数、局数、消耗钻石数... */
        public mahjongNeedDiamond:Array<number> = null;
        /** 扑克创建房间需要钻石，列表结构，局数、消耗钻石数、局数、消耗钻石数、局数、消耗钻石数... */
        public pokerNeedDiamond:Array<number> = null;
        /** 字牌创建房间需要钻石，列表结构，局数、消耗钻石数、局数、消耗钻石数、局数、消耗钻石数... */
        public zipaiNeedDiamond:Array<number> = null;

        constructor() {
            super(MsgCmdConstant.MSG_GAME_LOGIN_ACK);
        }

        public serialize(ar:ObjectSerializer):void {
            super.serialize(ar);
            let self = this;
            self.player = <Player> ar.sObject(self.player);
            self.baseItemList = <Array<ItemBase>> ar.sObjArray(self.baseItemList);
            self.result = ar.sInt(self.result);
            self.reward = ar.sInt(self.reward);
            self.lifeCD = ar.sInt(self.lifeCD);
            self.firstLogin = ar.sInt(self.firstLogin);
            self.bigGiftContent = ar.sString(self.bigGiftContent);
            self.continueLanding = ar.sInt(self.continueLanding);
            self.goldList = <Array<number>>ar.sIntArray(self.goldList);
            self.friends = <Array<FriendPlayer>>ar.sObjArray(self.friends);
            self.ackFlags = ar.sInt(self.ackFlags);
            self.handsDefintions = ar.sInt(self.handsDefintions);
            self.itemAndNumsList = <Array<number>>ar.sIntArray(self.itemAndNumsList);

            self.rooms = <Array<GameRoom>>ar.sObjArray(self.rooms);
            self.clientParma = <Array<SystemConfigPara>>ar.sObjArray(self.clientParma);

            self.noticeIsExit = ar.sInt(self.noticeIsExit);
            self.noticeTitle = ar.sString(self.noticeTitle);
            self.noticeContent = ar.sString(self.noticeContent);

            self.mahjongNeedDiamond = <Array<number>>ar.sIntArray(self.mahjongNeedDiamond);
            self.pokerNeedDiamond = <Array<number>>ar.sIntArray(self.pokerNeedDiamond);
            self.zipaiNeedDiamond = <Array<number>>ar.sIntArray(self.zipaiNeedDiamond);
        }

    }
}