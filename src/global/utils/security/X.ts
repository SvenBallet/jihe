/**
 * 
 * @Name:  FL - X
 * @Description:  X要低调，你懂的
 * @Create: DerekWu on 2015/6/25 17:11
 * @Version: V1.0
 */
module FL {
    export class X {
        public static x(pSessId:string,pTimes:number):string {
            var vTempCheckNum:number = pTimes%9+4;
            var vSessLength:number = pSessId.length
            var vResultArray = [];
            for (var i=1; i<=vSessLength-vTempCheckNum; i++) {
                var vTempIndex:number = (i*vTempCheckNum)%vSessLength;
                vResultArray.push(pSessId.charAt(vTempIndex));
            }
            return vResultArray.join("");
        }
    }
}