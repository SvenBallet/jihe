module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LongUtil
     * @Description:  Long工具类
     * @Create: DerekWu on 2017/11/9 21:46
     * @Version: V1.0
     */
    export class LongUtil {

        // /**
        //  * 已经废弃, 不是别人有bug，是自己使用方法不对 。。。。。。。
        //  * 按位亦或  Long 的 xor 有bug 不能用，所以自己写一个简单的
        //  * @param {dcodeIO.Long} letf
        //  * @param {dcodeIO.Long} right
        //  * @returns {dcodeIO.Long}
        //  */
        // public static xor(letf:dcodeIO.Long, right:dcodeIO.Long):dcodeIO.Long {
        //     let leftBitStr:string = letf.toString(2);
        //     let rightBitStr:string = right.toString(2);
        //     let leftStrLength:number = leftBitStr.length;
        //     let rightStrLength:number = rightBitStr.length;
        //     if (leftStrLength > rightStrLength) {
        //         let vAddFirstStrArray:Array<string> = new Array<string>();
        //         for (let vIndex:number = 0, vLength:number = leftStrLength - rightStrLength; vIndex < vLength; ++vIndex) {
        //             vAddFirstStrArray.push("0");
        //         }
        //         rightBitStr = vAddFirstStrArray.join("") + rightBitStr;
        //     } else if (leftStrLength < rightStrLength) {
        //         let vAddFirstStrArray:Array<string> = new Array<string>();
        //         for (let vIndex:number = 0, vLength:number = rightStrLength - leftStrLength; vIndex < vLength; ++vIndex) {
        //             vAddFirstStrArray.push("0");
        //         }
        //         leftBitStr = vAddFirstStrArray.join("") + leftBitStr;
        //     }
        //
        //     let newLongBitStr:Array<string> = new Array<string>(), leftOneBit:string, rightOneBit:string;
        //     for (let vIndex:number = 0; vIndex < leftStrLength; ++vIndex) {
        //         leftOneBit = leftBitStr.charAt(vIndex);
        //         rightOneBit = rightBitStr.charAt(vIndex);
        //         if (rightOneBit === "0") {
        //             newLongBitStr.push(leftOneBit);
        //         } else {
        //             if (leftOneBit === "0") {
        //                 newLongBitStr.push("1");
        //             } else {
        //                 newLongBitStr.push("0");
        //             }
        //         }
        //     }
        //
        //     //返回新的
        //     return dcodeIO.Long.fromString(newLongBitStr.join(""),2);
        // }

    }

}