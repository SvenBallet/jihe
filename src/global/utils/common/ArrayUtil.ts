module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ArrayUtil
     * @Description:  //数组操作类
     * @Create: DerekWu on 2017/12/2 11:08
     * @Version: V1.0
     */
    export class ArrayUtil {

        /**
         * 添加相同数量的值到数组
         * @param {number[]} array
         * @param {number} value
         * @param {number} num
         */
        public static addSameNumber(array:number[], value:number, num:number=1):void {
            if (num === 1) {
                array.push(value);
            } else if (num > 1) {
                for (let vIndex:number = 0, vLength:number = array.length; vIndex < vLength; ++vIndex) {
                    array.push(value);
                }
            }
        }

        /**
         * 从数组中删除一个元素并新构建一个数组
         * @param {Array<any>} pBaseArray
         * @param pRemoveObj
         * @returns {Array<any>}
         */
        public static removeOneBuildNewArray(pBaseArray:Array<any>, pRemoveObj:any): Array<any> {
            let vArray = [];
            let vIsRemoved = false;
            for (let vIndex:number = 0; vIndex < pBaseArray.length; ++vIndex) {
                if (!vIsRemoved && pBaseArray[vIndex] === pRemoveObj) {
                    vIsRemoved = true;
                } else {
                    vArray.push(pBaseArray[vIndex]);
                }
            }
            return vArray;
        }

    }
}