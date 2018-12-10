module FL {
    /**
     * 字符串工具类
     * @Name:  FL - StringUitl
     * @Company 
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/10/13 22:11
     * @Version: V1.0
     */
    export class StringUtil {

        /**
         * 转换成游戏货币格式
         * 参考：
         * function formatMoney(number, places, symbol, thousand, decimal) {
                number = number || 0;
                places = !isNaN(places = Math.abs(places)) ? places : 2;
                symbol = symbol !== undefined ? symbol : "$";
                thousand = thousand || ",";
                decimal = decimal || ".";
                var negative = number < 0 ? "-" : "",
                    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
                    j = (j = i.length) > 3 ? j % 3 : 0;
                return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
            }
         * @param pValue
         * @param pThousand
         * @return {string}
         */
        // public static formatGameMoney2(pValue:number, pThousand:string = " "):string {
        //     let iStr:string = ""+pValue;
        //     let j:number = iStr.length > 3 ? iStr.length % 3 : 0;
        //     return (j ? iStr.substr(0, j) + pThousand : "") + iStr.substr(j).replace(/(\d{3})(?=\d)/g, "$1" +pThousand);
        // }

        /**
         * 转换成游戏货币格式
         * @param pValue
         * @param pThousand 千位分隔符，默认是空格
         * @param n位一组
         * @return {string}
         */
        public static formatGameMoney(pValue:number, pThousand:string = " ", pSubNum:number = 4) {
            let vNumStr = (pValue || 0).toString(), vResult = "";
            while (vNumStr.length > pSubNum) {
                vResult = pThousand + vNumStr.slice(-pSubNum) + vResult;
                vNumStr = vNumStr.slice(0, vNumStr.length - pSubNum);
            }
            if (vNumStr) { vResult = vNumStr + vResult; }
            return vResult;
        }

        /**
         * 数字转化为16进制的字符串
         * @param {number} num
         * @returns {string}
         */
        public static numToHexStr(num:number):string {
            if (!num && num !== 0) {
                return "null";
            }
            return "0x"+num.toString(16);
        }

        /**
         * 数字转化为二进制的字符串
         * @param {number} num
         * @returns {string}
         */
        public static numToBinaryStr(num:number):string {
            if (!num && num !== 0) {
                return "null";
            }
            return num.toString(2);
        }

        /**
         * 格式化时间
         * @param {string} pFormat  "yyyy-MM-dd hh:mm:ss"
         * @param {Date} pDate
         * @returns {string}
         */
        public static formatDate(pFormat:string, pDate:Date):string
        { //author: meizz
            var o = {
                "M+" : pDate.getMonth()+1,                 //月份
                "d+" : pDate.getDate(),                    //日
                "h+" : pDate.getHours(),                   //小时
                "m+" : pDate.getMinutes(),                 //分
                "s+" : pDate.getSeconds(),                 //秒
                "q+" : Math.floor((pDate.getMonth()+3)/3), //季度
                "S"  : pDate.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(pFormat))
                pFormat=pFormat.replace(RegExp.$1, (pDate.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(let k in o)
                if(new RegExp("("+ k +")").test(pFormat))
                    pFormat = pFormat.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return pFormat;
        }

        /**
         * 截取字符串，支持中文，一个中文当两个长度
         * @param {string} str
         * @param {number} len
         * @param {string} endStr
         * @param isFullWithBlank
         * @returns {string}
         */
        public static subStrSupportChinese(str:string, len:number, endStr?:string, isFullWithBlank:boolean = false) {
            let newLength:number = 0;
            let newStr:string = "";
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    newLength += 2;
                } else {
                    newLength++;
                }
                if (newLength > len) {
                    break;
                }
                newStr += str.charAt(i).toString();
            }
            if (isFullWithBlank && newLength < len) {
                for (let vIndex = 0, vLength = len - newLength; vIndex < vLength; ++vIndex) {
                    newStr += " ";
                }
            }
            if (newStr.length < str.length && endStr) {
                newStr += endStr;
            }
            return newStr;
        }

    }
}