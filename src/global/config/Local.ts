/**
 * 
 * @Name:  FL - Local
 * @Description:  //本地语言类库
 * @Create: DerekWu on 2016/4/8 23:12
 * @Version: V1.0
 */
module FL {
    export class Local {

        private static _localObj:{[key:number]:string} = {};

        private static _isInit:boolean;

        /**
         * 通过code获得对应的文本
         * @param code
         * @return {string}
         */
        public static text(code:number):string{
            let text:string = this._localObj[code];
            if(!text){
                return "{"+code+"}";
            }
            return text;
        }

        /**
         * 通过code获得对应的文本，可以替换参数
         * @param code
         * @param args
         * @return {string}
         */
        public static text2(code:number, ...args):string{
            let text:string = this._localObj[code];
            if(!text){
                return "{"+code+"}";
            }
            let length = args.length;
            for(let i=0;i<length;++i){
                text = text.replace("{" + i + "}", args[i]);
            }
            return text;
        }

        public static init(obj:{[key:number]:string}):void {
            if (!this._isInit) {
                this._localObj = obj;
                this._isInit = true;
            }
        }

    }
}