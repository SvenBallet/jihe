module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - GlobalData
     * @Description:  // 全局数据
     * @Create: DerekWu on 2018/1/29 12:03
     * @Version: V1.0
     */
    export class GlobalData {

        /** 是否进入后台 */
        public static isIntoBack:boolean = false;

        /** 进入后台时间 */
        public static intoBackTimes:number = 0;

        /** 从后台回到前台的时间 */
        public static backFromBackTimes:number = 0;

        /** 是否处于从后台回到前台的延时期 */
        public static isStartBackFromBackDelayed: boolean = false;


        /** 是否游戏逻辑进入后台 */
        // public static isGameIntoBack:boolean = false;

    }

}