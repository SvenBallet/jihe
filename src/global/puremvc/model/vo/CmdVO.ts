/**
 * 
 * @Name:  FL - CmdVO
 * @Description:  指令基础对象
 * @Create: DerekWu on 2015/4/25 10:44
 * @Version: V1.0
 */
module FL {
    export class CmdVO {
        public readonly key:string;
        public readonly command:Function;

        public constructor(pKey:string, pCommand:Function) {
            this.key = pKey;
            this.command = pCommand;
        }
    }
}