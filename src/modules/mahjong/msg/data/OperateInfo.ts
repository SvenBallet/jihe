module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase_ChangSha - OperateInfo
     * @Description:  操作选项信息
     * @Create: ArielLiang on 2018/6/5 11:53
     * @Version: V1.0
     */
    export class OperateInfo implements IBaseObject {

        public static readonly NAME:string = "com.linyun.xgamenew.core.game.mahjong.base.OperateInfo";
        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string = OperateInfo.NAME;

        /** 操作者位置 */
        public playerPos:number = 0;

        /** 操作类型 */
        public operType:number = 0;

        /** 操作值*/
        public operValue:number = 0;

        public serialize(ar:ObjectSerializer):void {
            this.playerPos = ar.sByte(this.playerPos);
            this.operType = ar.sInt(this.operType);
            this.operValue = ar.sInt(this.operValue);
        }

    }
}