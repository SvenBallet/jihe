module FL {

    /**
     * 支持序列化，必须从这个基类继承
     * 和服务端结构保持一致，避免之后服务端改了之后本地修改代码 
     */
    export interface IBaseObject {

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        readonly sClassName: string;

        /**
         * 序列化对象 
         */
        serialize(ObjectSerializer: ObjectSerializer): void;

    }

    /**
     * 网络消息的基类
     */
    export class NetMsgBase implements IBaseObject {

        /** 序列化类的名字，用来序列化对象用，必须和服务端的类型对应 */
        public readonly sClassName: string;

        public msgCMD: number;//操作指令
        public sessionID: dcodeIO.Long; //session id 默认为0，服务端用的
        public md5Key = "";//对整个消息进行md5，校验消息完合法性

        // public neverCompressedMe: boolean = false;//这个包是否不需要压缩，里面已经自己压缩了

        public unused_0: number;
        public unused_1: number;
        public unused_2: number;
        public unused_3: number;

        /**
         * 网络消息基类构造函数 
         * @param msgCMD 消息指令号
         * @param sObj 序列化对象, 只有当服务器返回指令的之后才需要这个值
         * @param sClassName 序列化对象的名字, 非必要，只有消息序列化对象存在别的消息序列化中时才需要设置，
         *                   这个是服务端的对象类名，注意，包含包名字，举例：com.linyun.base.msg.system.LinkValidationMsg
         */
        // constructor(msgCMD: number, sObj?: Function, sClassName?: string) {
        constructor(msgCMD?: number, sClassName?: string) {
            if (msgCMD) this.msgCMD = msgCMD;
            if (sClassName) this.sClassName = sClassName;
        }

        /**
         * 序列化对象 
         */
        public serialize(ar: ObjectSerializer): void {
            let self = this;
            self.msgCMD = ar.sInt(self.msgCMD);
            self.sessionID = ar.sLong(self.sessionID);
            self.md5Key = ar.sString(self.md5Key);
            self.unused_0 = ar.sInt(self.unused_0);
            self.unused_1 = ar.sInt(self.unused_1);
            self.unused_2 = ar.sInt(self.unused_2);
            self.unused_3 = ar.sInt(self.unused_3);
        }

    }

    /**
     * 序列化缓存，存储类函数 
     */
    export class SerializerCache {

        /** 序列化对象缓存 */
        private static _cmdSObjCache: { [cmd: number]: any } = {};
        private static _nameSObjCache: { [className: string]: any } = {};

        /**
         * 是否存在序列化回调对象
         */
        public static nameIsInCache(className: string): boolean {
            return this._nameSObjCache[className] ? true : false;
        }

        /**
         * 注册一个序列化对象
         */
        public static registerByName(className: string, pFunction: Function): void {
            if (this.nameIsInCache(className)) {
                egret.error("is exists className=" + className);
            } else {
                this._nameSObjCache[className] = pFunction;
            }
        }

        /**
         * 构造一个序列化对象
         */
        public static constructObjByName(className: string): IBaseObject {
            let vFunction = this._nameSObjCache[className];
            if (vFunction) {
                return new vFunction();
            } else {
                egret.error("not exists obj in cache className=" + className);
            }
        }

        /**
         * 是否存在序列化回调对象
         */
        public static cmdIsInCache(cmd: number): boolean {
            return this._cmdSObjCache[cmd] ? true : false;
        }

        /**
         * 注册一个序列化对象
         */
        public static registerByCmd(cmd: number, pFunction: Function): void {
            if (this.cmdIsInCache(cmd)) {
                egret.error("is exists cmd=%s", StringUtil.numToHexStr(cmd));
            } else {
                this._cmdSObjCache[cmd] = pFunction;
            }
        }

        /**
         * 构造一个序列化对象
         */
        public static constructObjByCmd(cmd: number): IBaseObject {
            let vFunction = this._cmdSObjCache[cmd];
            if (vFunction) {
                return new vFunction();
            } else {
                egret.error("not exists obj in cache cmd=%s", StringUtil.numToHexStr(cmd));
            }
        }

    }

}