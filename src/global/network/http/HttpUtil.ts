/**

 * @Name:   - HttpUtil
 * @Description:  Http工具类
 * @Create: DerekWu on 2015/5/26 16:50
 * @Version: V1.0
 */
module FL {
    export class HttpUtil {

        public static getHttpParams(name:string):string {
            var r = new RegExp("(\\?|#|&)"+name+"=([^&#]*)(&|#|$)");
            var m = location.href.match(r);
            return decodeURIComponent(!m?"":m[2]);
        }

        public static getStrUrlParams(strUrl:string,name:string):string {
            var r = new RegExp("(\\?|#|&)"+name+"=([^&#]*)(&|#|$)");
            var m = strUrl.match(r);
            return decodeURIComponent(!m?"":m[2]);
        }

        public static getHttpSubParams(name, subName):string {
            var r = new RegExp("(\\?|#|&)"+name+"=([^&#]*)(&|#|$)");
            var m = location.href.match(r);
            var params = decodeURIComponent(!m?"":m[2]);
            var r2 = new RegExp("(\\?|#|&)"+subName+"=([^&#]*)(&|#|$)");
            var ret = params.match(r2);
            return decodeURIComponent(!ret?"":ret[2]);
        }

        // /**
        //  * 将长字符串转换为数字的数组
        //  * @param str
        //  * @returns {Array}
        //  */
        // public static longStr2Array(str:string):Array<number> {
        //     var retArray:Array<number> = new Array<number>();
        //     var tempLength:number = str.length;
        //     var splitMaxLength:number = 0;
        //     if (tempLength == 39) {
        //         splitMaxLength = 34;
        //     } else if (tempLength == 32) {
        //         splitMaxLength = 32;
        //     } else {
        //         return retArray;
        //     }
        //     for (var i=0; i<splitMaxLength; i+=5) {
        //         var tempEndIndex = i+5;
        //         if (tempEndIndex < splitMaxLength) {
        //             retArray.push(parseInt(str.substring(i,tempEndIndex),36));
        //         } else {
        //             retArray.push(parseInt(str.substring(i,splitMaxLength),36));
        //         }
        //     }
        //     if (splitMaxLength == 34) {
        //         retArray.push(parseInt(str.substring(34,39),36));
        //     }
        //     return retArray;
        // }
        //
        // /**
        //  * 将数字数组转化成字符串
        //  * @param arrayNums
        //  * @returns {string}
        //  */
        // public static array2LongStr(arrayNums:Array<number>):string {
        //     var retStr:string = "";
        //     var tempLength:number = arrayNums.length;
        //     if (tempLength == 0) return "";
        //     var strLengthArray:Array<number> = [5,5,5,5,5,5,4,5];
        //     if (tempLength == 7) {
        //         strLengthArray = [5,5,5,5,5,5,2];
        //     }
        //     for (var i=0; i<tempLength; i++) {
        //         var oneTempStr:string = arrayNums[i].toString(36);
        //         var lessLength:number = strLengthArray[i] - oneTempStr.length;
        //         if (lessLength == 0) {
        //             retStr = retStr + oneTempStr;
        //         } else {
        //             //空位补0
        //             var startStr:string = "";
        //             for (var j=0; j<lessLength; j++) {
        //                 startStr = startStr + "0";
        //             }
        //             retStr = retStr + startStr + oneTempStr;
        //         }
        //     }
        //     return retStr.toLocaleUpperCase();
        // }
        //
        // /**
        //  * 获取登录的url参数
        //  * @returns {Array<string>} [0]=roleTopicId [1]=stepId [2]=inviteId [3]=nameFlag
        //  */
        // public static getLoginUrlParamArray():Array<string> {
        //     var pArr:Array<string> = new Array<string>();
        //     var app_custom:string = FL.HttpUtil.getHttpParams("app_custom");
        //     var ext_args:string = FL.HttpUtil.getHttpParams("ext_args");
        //     var roleTopicId:string = ""; //题目ID
        //     var stepId:string = ""; //关卡ID
        //     var inviteId:string = ""; //邀请ID
        //     var nameFlag:string = ""; //openId
        //     if (app_custom != "") {
        //         roleTopicId = FL.HttpUtil.getStrUrlParams(app_custom, "roleTopicId");
        //         stepId = FL.HttpUtil.getStrUrlParams(app_custom, "stepId");
        //         inviteId = FL.HttpUtil.getStrUrlParams(app_custom, "inviteId");
        //         nameFlag = FL.HttpUtil.getStrUrlParams(app_custom, "nameFlag");
        //     } else if (ext_args != "") {
        //         var temp_ext_args:string = "%26"+ext_args;
        //         inviteId = this.getInviteId(temp_ext_args);
        //         var ACT_TYPE:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "ACT_TYPE");
        //         if (ACT_TYPE == "1") {
        //             stepId = FL.HttpUtil.getStrUrlParams(temp_ext_args, "WAR");
        //             nameFlag = this.getNameFlag(temp_ext_args);
        //         } else if (ACT_TYPE == "2") {
        //             roleTopicId = this.getRoleTopicId(temp_ext_args);
        //         }
        //     }
        //     pArr.push(roleTopicId);
        //     pArr.push(stepId);
        //     pArr.push(inviteId);
        //     pArr.push(nameFlag);
        //     return pArr;
        // }
        //
        // /**
        //  * 获得inviteId
        //  * @param temp_ext_args ACT_ID:inArr[0], SOURCE:inArr[1], FROM_SERVER:inArr[2], FROM_USER:inArr[3], EXCLUDE:inArr[4], UNION_ID:inArr[5], ZONE_ID:inArr[6], TROOPBAR_ID:inArr[7]
        //  */
        // private static getInviteId(temp_ext_args:string):string {
        //     var pArr:Array<number> = new Array<number>();
        //     var ACT_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "ACT_ID");
        //     if (ACT_ID !='') { pArr.push(parseInt(ACT_ID)); } else { return ""; }
        //     var SOURCE:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "SOURCE");
        //     if (SOURCE !='') { pArr.push(parseInt(SOURCE)); } else { return ""; }
        //     var FROM_SERVER:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "FROM_SERVER");
        //     if (FROM_SERVER !='') { pArr.push(parseInt(FROM_SERVER)); } else { return ""; }
        //     var FROM_USER:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "FROM_USER");
        //     if (FROM_USER !='') { pArr.push(parseInt(FROM_USER)); } else { return ""; }
        //     var EXCLUDE:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "EXCLUDE");
        //     if (EXCLUDE !='') { pArr.push(parseInt(EXCLUDE)); } else { return ""; }
        //     var UNION_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "UNION_ID");
        //     if (UNION_ID !='') { pArr.push(parseInt(UNION_ID)); } else { return ""; }
        //     var ZONE_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "ZONE_ID");
        //     if (ZONE_ID !='') { pArr.push(parseInt(ZONE_ID)); } else { return ""; }
        //     var TROOPBAR_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "TROOPBAR_ID");
        //     if (TROOPBAR_ID !='') { pArr.push(parseInt(TROOPBAR_ID)); } else { return ""; }
        //     return this.array2LongStr(pArr);
        // }
        //
        // /**
        //  * 获得roleTopicId
        //  * @param temp_ext_args IMAGE_ID:rtArr[0], ITEM_ID:rtArr[1], PROPS_ID:rtArr[2], AWARD_ID:rtArr[3], TITLE:rtArr[4], MESSAGE:rtArr[5], GIFT:rtArr[6], TASK:rtArr[7]
        //  */
        // private static getRoleTopicId(temp_ext_args:string):string {
        //     var pArr:Array<number> = new Array<number>();
        //     var IMAGE_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "IMAGE_ID");
        //     if (IMAGE_ID !='') { pArr.push(parseInt(IMAGE_ID)); } else { return ""; }
        //     var ITEM_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "ITEM_ID");
        //     if (ITEM_ID !='') { pArr.push(parseInt(ITEM_ID)); } else { return ""; }
        //     var PROPS_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "PROPS_ID");
        //     if (PROPS_ID !='') { pArr.push(parseInt(PROPS_ID)); } else { return ""; }
        //     var AWARD_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "AWARD_ID");
        //     if (AWARD_ID !='') { pArr.push(parseInt(AWARD_ID)); } else { return ""; }
        //     var TITLE:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "TITLE");
        //     if (TITLE !='') { pArr.push(parseInt(TITLE)); } else { return ""; }
        //     var MESSAGE:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "MESSAGE");
        //     if (MESSAGE !='') { pArr.push(parseInt(MESSAGE)); } else { return ""; }
        //     var GIFT:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "GIFT");
        //     if (GIFT !='') { pArr.push(parseInt(GIFT)); } else { return ""; }
        //     var TASK:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "TASK");
        //     if (TASK !='') { pArr.push(parseInt(TASK)); } else { return ""; }
        //     return this.array2LongStr(pArr);
        // }
        //
        // /**
        //  * 获得nameFlag
        //  * @param temp_ext_args IMAGE_ID:rtArr[0], ITEM_ID:rtArr[1], PROPS_ID:rtArr[2], AWARD_ID:rtArr[3], TITLE:rtArr[4], MESSAGE:rtArr[5], GIFT:rtArr[6]
        //  */
        // private static getNameFlag(temp_ext_args:string):string {
        //     var pArr:Array<number> = new Array<number>();
        //     var IMAGE_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "IMAGE_ID");
        //     if (IMAGE_ID !='') { pArr.push(parseInt(IMAGE_ID)); } else { return ""; }
        //     var ITEM_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "ITEM_ID");
        //     if (ITEM_ID !='') { pArr.push(parseInt(ITEM_ID)); } else { return ""; }
        //     var PROPS_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "PROPS_ID");
        //     if (PROPS_ID !='') { pArr.push(parseInt(PROPS_ID)); } else { return ""; }
        //     var AWARD_ID:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "AWARD_ID");
        //     if (AWARD_ID !='') { pArr.push(parseInt(AWARD_ID)); } else { return ""; }
        //     var TITLE:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "TITLE");
        //     if (TITLE !='') { pArr.push(parseInt(TITLE)); } else { return ""; }
        //     var MESSAGE:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "MESSAGE");
        //     if (MESSAGE !='') { pArr.push(parseInt(MESSAGE)); } else { return ""; }
        //     var GIFT:string = FL.HttpUtil.getStrUrlParams(temp_ext_args, "GIFT");
        //     if (GIFT !='') { pArr.push(parseInt(GIFT)); } else { return ""; }
        //     return this.array2LongStr(pArr);
        // }

        //发送get请求
        public static requestGetText(url: string, data?: any, success?: Function, thisObject?: any, error?: Function): void {
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            if (data) {
                let param = this.changeUrlCode(data);
                request.open(url + "?" + param, egret.HttpMethod.GET);
            }
            else {
                request.open(url, egret.HttpMethod.GET);
            }
            // request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
            if (success) request.addEventListener(egret.Event.COMPLETE, success, thisObject);
            if (error) request.addEventListener(egret.IOErrorEvent.IO_ERROR, error, thisObject);
        }

        private static changeUrlCode(param: Object): string {
            if (!param) return null;
            let str = "";
            for (let key in param) {
                str += key + "=" + param[key] + "&";
            }
            return str.substr(0, str.length - 1);
        }

    }
}