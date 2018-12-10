module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - NumberUtil
     * @Description:  //数字工具类
     * @Create: DerekWu on 2017/12/2 9:05
     * @Version: V1.0
     */
    export class NumberUtil {

        /**
         * 与一个值进行与运算，返回是否和这个值相当
         * @param {number} baseValue
         * @param {number} andValue
         * @returns {boolean}
         */
        public static isAndNumber(baseValue:number, andValue:number):boolean {
            return (baseValue&andValue)===andValue;
        }

    }
}