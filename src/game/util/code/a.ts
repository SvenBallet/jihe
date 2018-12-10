module Game {
    /**
     * 
     * @Name:  Game - a
     * @Description:  加解密的工具类，取名特殊，做一点掩护
     * @Create: DerekWu on 2017/4/7 15:18
     * @Version: V1.0
     */
    export class a {

        /**
         * 加密
         * @param pData 数据对象
         * @param pOffset 偏移
         * @param pLength 加密长度
         * @param pKey 加密Key
         * @param pKeySumValue 加密Key的和
         * @param pPassOffset 加密偏移
         */
        public static e(pData:Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array, pOffset:number, pLength:number, pKey:string, pKeySumValue:number, pPassOffset:number) {
            let iIndex:number = pOffset, kIndex:number = 0, iDataLen:number = pLength, iKeyLen:number = pKey.length;
            for (; iIndex < pLength; ++iIndex) {
                pData[iIndex] = pData[iIndex] ^ pKeySumValue,
                    pData[iIndex] = pData[iIndex] - iDataLen + pPassOffset,
                    pData[iIndex] = pData[iIndex] ^ pKey.charCodeAt(kIndex),
                    kIndex++,iDataLen--;
                if (kIndex >= iKeyLen) {
                    kIndex = 0;
                }
            }
        }

        /**
         * 解密
         * @param pData 数据对象
         * @param pOffset 偏移
         * @param pLength 加密长度
         * @param pKey 加密Key
         * @param pKeySumValue 加密Key的和
         * @param pPassOffset 加密偏移
         */
        public static d(pData:Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array, pOffset:number, pLength:number, pKey:string, pKeySumValue:number, pPassOffset:number) {
            let iIndex:number = pOffset, kIndex:number = 0, iDataLen:number = pLength, iKeyLen:number = pKey.length;
            for (; iIndex < pLength; ++iIndex) {
                pData[iIndex] = pData[iIndex] ^ pKey.charCodeAt(kIndex),
                    pData[iIndex] = pData[iIndex] + iDataLen - pPassOffset,
                    pData[iIndex] = pData[iIndex] ^ pKeySumValue,
                    kIndex++,iDataLen--;
                if (kIndex >= iKeyLen) {
                    kIndex = 0;
                }
            }
        }

    }
}