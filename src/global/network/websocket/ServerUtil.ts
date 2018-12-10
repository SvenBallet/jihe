module FL {
    /**
     * 
     * @Name:  GxnjyHtml5 - ServerUtil
     * @Description:  //对服务端的工具类
     * @Create: DerekWu on 2017/7/6 8:53
     * @Version: V1.0
     */
    export class ServerUtil {

        private static readonly _gSocket:GameSocket = new GameSocket();

        private static _isInit:boolean = false;

        public static init(pConnectUrl: string):void {
            if (!this._isInit) {
                this._gSocket.connect(pConnectUrl);
                this._isInit = true;
            }
        }

        /**
         * 手动关闭socket，不自动重连socket
         */
        public static closeSocket():void {
            this._gSocket.close();
            this._isInit = false;
        }

        /**
         * 重置socket
         */
        // public static resetSocket():void {
        //     ServerUtil.closeSocket();
        //     this._gSocket.removeUrl();
        //     this._gSocket.reset();
        // }

        /**
         * 是否已经链接到服务器
         * @return {boolean}
         */
        public static hasConnect():boolean {
            return this._gSocket.hasConnect();
        }

        /**
         * 当没有建立连接的时候立刻进行连接
         */
        public static connectAtOnceWhenNotConnect(): void {
            this._gSocket.connectAtOnceWhenNotConnect();
        }

        /**
         * 关闭连接当心跳异常
         */
        // public static closeConnectedWhenHeartBeatError(): void {
        //     this._gSocket.closeConnectedWhenHeartBeatError();
        // }

        /**
         * 设置服务端的时间偏差
         * @param {number} value
         */
        public static setTimeDifference(value:number):void {
            this._gSocket.setTimeDifference(value);
        }

        /**
         * 获得服务端的时间
         * @return {number}
         */
        public static getServerTime():number {
            return this._gSocket.getServerTime();
        }

        /**
         * 获得服务端的时间，日期格式
         * @return {Date}
         */
        public static getServerDate():Date {
            return new Date(this._gSocket.getServerTime());
        }

        /**
         * 获得服务端的时间字符串
         * @param {string} format "yyyy-MM-dd hh:mm:ss"
         * @returns {string}
         */
        public static getFormatServerDate(format:string):string {
            return StringUtil.formatDate(format, new Date(this._gSocket.getServerTime()));
        }

        private static x():string {
            let vServerTime:number = this._gSocket.getServerTime();
            let vServerTimeLong:dcodeIO.Long = dcodeIO.Long.fromNumber(vServerTime);
            //0xa97ef1a45ee9ab04
            let myKeyLong:dcodeIO.Long = dcodeIO.Long.fromString("a97ef1a45ee9ab04", true, 16);
            //异或一下
            let vResultStr:string = vServerTimeLong.xor(myKeyLong).toString();
            // //补充至32位长度
            // let vResultLength:number = vResultStr.length;
            // let vResultStrArray:Array<string> = [];
            // for (let vIndex:number = 0; vIndex < 32; ++vIndex) {
            //     if (vIndex < vResultLength) {
            //         vResultStrArray.push(vResultStr.charAt(vIndex));
            //     } else {
            //         vResultStrArray.push("0");
            //     }
            // }
            // vResultStr = vResultStrArray.join("");
            // egret.log(" vResultStr = " + vResultStr);
            // let vResultByteArray:egret.ByteArray = new egret.ByteArray(null, 34);
            // vResultByteArray.writeUTF(vResultStr);
            // vResultByteArray.position = 34;
            return vResultStr;
        }

        /**
         * 发送消息给服务端
         * @param netMsgBase 消息
         * @param loadingOverCmd 有这个参数的时候会弹出请求loading和遮罩，当返回这个指令的时候会移除请求loading和遮罩
         */
        public static sendMsg(netMsgBase:NetMsgBase, loadingOverCmd?:number) {
            if (!this._gSocket.hasConnect()) { // 有链接发消息才有效
                return;
            }
            //设置验证码
            // netMsgBase.md5Key = "230710DAF8E7BD917FF6BF7FC989D150";
            netMsgBase.md5Key = "sd45gg4d55g4h4uj4n16pa6r9rt331qe";
            let vObjectSerializer:ObjectSerializer = new ObjectSerializer();

            let vSrcBytes:egret.ByteArray = vObjectSerializer.srcBytes;
            vObjectSerializer.sInt(0);
            vObjectSerializer.sInt(0);
            netMsgBase.serialize(vObjectSerializer);
            let vByteLength:number = vSrcBytes.position;
            vSrcBytes.position = 0;
            vObjectSerializer.sInt(vByteLength-8);
            //补充替换md5码
            vSrcBytes.position = 22;
            let vX:string = this.x();
            let vKeyBytes:egret.ByteArray = new egret.ByteArray(null, 32);
            let vUint8Array:Uint8Array = (<any>vSrcBytes).encodeUTF8(vX);
            vKeyBytes._writeUint8Array(vUint8Array);
            vKeyBytes.position = 32;
            vSrcBytes.writeBytes(vKeyBytes, 0, 32);
            //设置位置
            vSrcBytes.position = vByteLength;
            // this._gSocket.sendMsg(netMsgBase.msgCMD, vSrcBytes);
            //打印发送消息
            if (DEBUG) {
                if (netMsgBase.msgCMD !== 0xa10002 && netMsgBase.msgCMD !== 0xc30061 && netMsgBase.msgCMD !== 0xc30062) {
                    egret.log("## sendMsg cmd=%s", StringUtil.numToHexStr(netMsgBase.msgCMD));
                    egret.log(netMsgBase);
                }
            }
            // egret.log("vByteLength = "+vByteLength);
            // egret.log("vByteLength2 = "+vSrcBytes.length);
            // egret.log("write_position = "+vSrcBytes["write_position"]);
            //发送
            this._gSocket.sendMsg(netMsgBase.msgCMD, vSrcBytes);

            //有loading回调
            if (loadingOverCmd) {
                // 移除loading
                let vReqLoadingViewServer:ReqLoadingViewServer = ReqLoadingViewServer.getInstance();
                if (vReqLoadingViewServer.parent) {
                    MvcUtil.delView(vReqLoadingViewServer);
                    if (vReqLoadingViewServer.parent) {
                        ViewUtil.removeChild(vReqLoadingViewServer.parent, vReqLoadingViewServer);
                    }
                }
                let vNewViewId:number = vReqLoadingViewServer.genNewViewId();
                let vMyCallBack:MyCallBack = new MyCallBack(ServerUtil.loadingOver, ServerUtil, loadingOverCmd, vNewViewId);
                ServerUtil.loadingOverCallBackObj[loadingOverCmd] = {viewId:vNewViewId, myCallBack:vMyCallBack};

                // 改用timer实现
                let vTempTimer: Game.Timer = new Game.Timer(3000);
                vTempTimer.once(egret.TimerEvent.TIMER, ()=>{
                    vMyCallBack.apply();
                    vTempTimer.stop();
                }, this);
                vTempTimer.start();

                //延时4秒回调（改用timer实现）
                // MyCallBackUtil.delayedMyCallBack(4000, vMyCallBack);
                // if () {
                MvcUtil.addView(vReqLoadingViewServer);
                // }
            }
        }

        /** 请求结束回调对象 */
        public static readonly loadingOverCallBackObj:{[cmd:number]:{viewId:number, myCallBack:MyCallBack}}={};

        public static loadingOver(cmd:number, viewId:number):void {
            // egret.log("# loadingOver viewId = " + viewId);
            let vOneCallBack = ServerUtil.loadingOverCallBackObj[cmd];
            // if (vOneCallBack) {
            //     egret.log("# loadingOver vOneCallBack.viewId = "+ vOneCallBack.viewId);
            // }
            if (vOneCallBack && vOneCallBack.viewId === viewId) {
                delete ServerUtil.loadingOverCallBackObj[cmd];
                // egret.log("#  delete loadingOverCallBackObj OK ");
            }
            let vReqLoadingViewServer:ReqLoadingViewServer = ReqLoadingViewServer.getInstance();
            // if (!vReqLoadingView.isView()) return;
            if (!vReqLoadingViewServer.parent) {
                return;
            }
            if (viewId) {
                if (vReqLoadingViewServer.getViewId() === viewId) {
                    MvcUtil.delView(vReqLoadingViewServer);
                    if (vReqLoadingViewServer.parent) {
                        ViewUtil.removeChild(vReqLoadingViewServer.parent, vReqLoadingViewServer);
                    }
                }
            }
        }


        // public static sendMsg(cmd: number, msgCont:{}, pMyCallBack?:MyCallBack) {
        //     this._gSocket.sendMsg(cmd, ServerMsgUtil.msgToByteArray(cmd, msgCont), pMyCallBack);
        // }

    }

    /**
     * 
     * @Name:  GxnjyHtml5 - ServerMsgUtil
     * @Description:  //对服务端的工具类
     * @Create: DerekWu on 2017/7/6 8:53
     * @Version: V1.0
     */
    export class ServerMsgUtil {

        /** 指令map集合 */
        private static readonly _CMD_MAP:{[cmd:number]:ServerCmd} = {};

        /**
         * 将消息转变为 ByteArray
         * @param cmd
         * @param msgCont
         * @return {any}
         */
        // public static msgToByteArray(cmd: number, msgCont:{}):egret.ByteArray {
        //     let vServerCmdVO:ServerCmdVO = this._CMD_MAP[cmd];
        //     if (vServerCmdVO) {
        //         let vSendProtoModule:string, vSendProtoMsgName:string;
        //         if (vServerCmdVO.sendProtoModule) {
        //             vSendProtoModule = vServerCmdVO.sendProtoModule, vSendProtoMsgName = vServerCmdVO.sendProtoMsgName;
        //         } else {
        //             vSendProtoModule = "Common_rfptf", vSendProtoMsgName = "CommonReq";
        //         }
        //         //解码
        //         // let vProtoModule:IProtoModule = RES.getRes(vSendProtoModule);
        //         // let vProtoMessage = vProtoModule.createMessage(vSendProtoMsgName, msgCont);
        //         // let vNewProtoMessage:ArrayBuffer = vProtoMessage.encode().toBuffer();
        //         // let vdecode = vProtoModule.getMessage(vServerCmdVO.sendProtoMsgName).decode(vNewProtoMessage);
        //         // egret.log(vdecode);
        //         // return new egret.ByteArray(vNewProtoMessage);
        //     } else {
        //         egret.error("### msgToByteArray err cmd = %d is not exists", cmd);
        //     }
        //     return null;
        // }

        /**
         * 收到消息处理
         * @param pServerMsgVO
         */
        // public static exeReceiveMsg(pReceiveMsgVO:ReceiveMsgVO, pMyCallBack?:MyCallBack) {
        //     let vServerCmdVO:ServerCmdVO = this._CMD_MAP[pReceiveMsgVO.cmd];
        //     if (vServerCmdVO) {
        //         if (vServerCmdVO.callBack || vServerCmdVO.dataVO || vServerCmdVO.onUpdateCmd) { //确认消息不做处理
        //             Game.ServerCmd.addServerCmd(ServerMsgUtil.asyncExeReceiveMsg, ServerMsgUtil, pReceiveMsgVO, pMyCallBack);
        //         }
        //     } else {
        //         egret.error("### exeReceiveMsg err cmd = %d is not exists", pReceiveMsgVO.cmd);
        //     }
        // }

        /**
         * 处理接收消息 
         */
        public static exeReceiveMsg(receiveByteArray:egret.ByteArray):void {
            //使用小端格式
            receiveByteArray.endian = egret.Endian.LITTLE_ENDIAN;

            //消息长度
            let vMsgLength:number = receiveByteArray.readInt();
            let vFlag:number = receiveByteArray.readInt(); //标记

            //记录位置
            let vPos:number = receiveByteArray.position;
            //指令号
            let vCmd:number = receiveByteArray.readInt();

            //回调
            let vOneCallBack = ServerUtil.loadingOverCallBackObj[vCmd];
            if (vOneCallBack) {
                vOneCallBack.myCallBack.apply();
            }

            //打印收到消息
            if (DEBUG) {
                if (vCmd !== 0xa10001 && vCmd !== 0xc30061 && vCmd !== 0xc30062) {
                    egret.log("## receiveMsg cmd=%s", StringUtil.numToHexStr(vCmd));
                }
            }

            //重置位置
            receiveByteArray.position = vPos;

            //是否已处理
            let vIsExe:boolean = false;
            //序列化对象
            let vBaseObject:IBaseObject = SerializerCache.constructObjByCmd(vCmd);
            if (vBaseObject) {
                vBaseObject.serialize(new ObjectSerializer(true, receiveByteArray));
                // 判断是都是新消息的
                let newNetMsgBaseAckResult: number = vBaseObject["newNetMsgBaseAckResult"];
                if (newNetMsgBaseAckResult != null) {
                    if (newNetMsgBaseAckResult === -1) {
                        // 重设提示消息
                        vCmd = MsgCmdConstant.MSG_SHOW_TIP_MSG_ACK_NEW;
                        // 重设处理的消息
                        vBaseObject = vBaseObject["newShowTipAckMsg"];
                    } else if (newNetMsgBaseAckResult === 1) {
                        return;
                    }
                }

                //打印收到消息
                if (DEBUG) {
                    if (vCmd !== 0xa10001 && vCmd !== 0xc30061 && vCmd !== 0xc30062) {
                        egret.log(vBaseObject);
                    }
                }

                //处理回调和转发，假如有的话
                let vServerCmd:ServerCmd = this._CMD_MAP[vCmd];
                if (vServerCmd) {
                    if (vServerCmd.callBack) {
                        //有回调则执行回调
                        vServerCmd.callBack.call(vServerCmd.callBackThis, vBaseObject);
                        vIsExe = true;
                    }
                    if (vServerCmd.onUpdateCmd) {
                        //有更新指令则转发
                        MvcUtil.send(vServerCmd.onUpdateCmd, vBaseObject);
                        vIsExe = true;
                    }
                }
            }
            if (!vIsExe) {
                egret.error("### serverCmd = %s not execute", StringUtil.numToHexStr(vCmd));
            }

        }

        // /** 消息前缀，长度 */
        // public static readonly MSG_PREFIX_L:number = 4;
        // /**
        //  * 异步处理
        //  * @param pReceiveMsgVO
        //  */
        // private static asyncExeReceiveMsg(pReceiveMsgVO:ReceiveMsgVO, pMyCallBack?:MyCallBack) {
        //     if (pReceiveMsgVO.msgCont) {
        //         //真正消息长度.去除消息前缀之后
        //         let vRealMsgLength:number = pReceiveMsgVO.msgCont.length - this.MSG_PREFIX_L;
        //         let vRealMsgCont:egret.ByteArray = new egret.ByteArray(new ArrayBuffer(vRealMsgLength));
        //         pReceiveMsgVO.msgCont.readBytes(vRealMsgCont);
        //         (<any>pReceiveMsgVO).msgCont = vRealMsgCont;
        //     }

        //     egret.log("## asyncExeReceiveMsg cmd=%d isSucc=%s", pReceiveMsgVO.cmd, pReceiveMsgVO.isSucc);

        //     let vServerCmdVO:ServerCmdVO = this._CMD_MAP[pReceiveMsgVO.cmd], vCallBackParam = pReceiveMsgVO;
        //     if (vServerCmdVO.receiveProtoModule) {
        //         //存在则自动解析
        //         // let vProtoModule:IProtoModule = RES.getRes(vServerCmdVO.receiveProtoModule);
        //         // let vProtoMessage = vProtoModule.getMessage(vServerCmdVO.receiveProtoMsgName);
        //         // let vCallBackParam = vProtoMessage.decode(pReceiveMsgVO.msgCont.buffer);
        //         // let vDataVO = vServerCmdVO.dataVO;
        //         // if (vDataVO) {
        //         //     //存在则自动赋值
        //         //     let vChangNormalAttrNum = ProtoUtil.setProtoData(vDataVO, vCallBackParam);
        //         //     if (vChangNormalAttrNum > 0 && vServerCmdVO.onUpdateCmd) {
        //         //         if (vDataVO.copy) {
        //         //             //存在则自动发消息，必须要有copy 方法
        //         //             MvcUtil.send(vServerCmdVO.onUpdateCmd, vDataVO.copy());
        //         //         } else {
        //         //             egret.error("### dataVO no copy func, cmd=%d", pReceiveMsgVO.cmd);
        //         //         }
        //         //     }
        //         // }
        //     }
        //     if (vServerCmdVO.callBack) {
        //         //有回调则执行回调
        //         vServerCmdVO.callBack.call(vServerCmdVO.callBackThis, vCallBackParam);
        //     }
        //     if (!vServerCmdVO.dataVO && vServerCmdVO.onUpdateCmd) {
        //         //直接发送对应消息
        //         MvcUtil.send(vServerCmdVO.onUpdateCmd);
        //     }
        //     //假如有回调
        //     if (pMyCallBack) {
        //         pMyCallBack.apply();
        //     }
        // }

        public static regServerCmd(pModule:ModuleBase):void {
            let vServerCmdVOs:Array<ServerCmd> = pModule.serverCmdVOs();
            for (let i=vServerCmdVOs.length-1; i>=0; i--) {
                let vOneServerCmdVO:ServerCmd = vServerCmdVOs[i];
                if (this._CMD_MAP[vOneServerCmdVO.cmd]) {
                    egret.error("### reg err serverCmd = %s is exists", StringUtil.numToHexStr(vOneServerCmdVO.cmd));
                } else {
                    this._CMD_MAP[vOneServerCmdVO.cmd] = vOneServerCmdVO;
                }
            }
        }

        public static delServerCmd(pModule:ModuleBase):void {
            let vServerCmdVOs:Array<ServerCmd> = pModule.serverCmdVOs();
            for (let i=vServerCmdVOs.length-1; i>=0; i--) {
                let vOneServerCmdVO:ServerCmd = vServerCmdVOs[i];
                delete this._CMD_MAP[vOneServerCmdVO.cmd];
            }
        }

    }

    /**
     * 
     * @Name:  GxnjyHtml5 - ReceiveMsgVO
     * @Description:  //服务端返回的消息对象
     * @Create: DerekWu on 2017/7/6 8:53
     * @Version: V1.0
     */
    export class ServerCmd {
        /** 指令编号 */
        public readonly cmd:number;
        /**处理指令，的回调函数*/
        public readonly callBack:(pHandleObj:any)=>void;
        /** 回调this对象 */
        public readonly callBackThis:any;

        /** onUpdateCmd 数据已经更新指令， 在自动的情况下，如果这个有值，并且修改到任何一个非绑定的字段，那么就通过pureMVC 发出这个指令 */
        public readonly onUpdateCmd:string;

        private constructor(msgCMD:number, sObj?:Function, sClassName?:string, callBack?:(pHandleObj:any)=>void, callBackThis?:any, onUpdateCmd?:string) {
            this.cmd = msgCMD;
            if (sObj) {
                // if (!SerializerCache.cmdIsInCache(msgCMD)) {
                    SerializerCache.registerByCmd(msgCMD, sObj);
                // }
                // if (sClassName && !SerializerCache.nameIsInCache(sClassName)) {
                if (sClassName) {
                    SerializerCache.registerByName(sClassName, sObj);
                }
            } else {
                if (sClassName) {
                    egret.error("not exists sObj, sClassName="+sClassName);
                }
            }
            if (callBack) this.callBack = callBack;
            if (callBackThis) this.callBackThis = callBackThis;
            if (onUpdateCmd) this.onUpdateCmd = onUpdateCmd;
        }

        /**
         * 构建回调指令，如果有更新指令，则回调后自动转发更新指令
         * @param {number} cmd
         * @param {Function} sObj 序列化对象, 只有当服务器返回指令的之后才需要这个值
         * @param {(pHandleObj: FL.NetMsgBase) => void} callBack
         * @param callBackThis
         * @param {string} onUpdateCmd
         * @param {string} sClassName 序列化对象的名字, 非必要，只有消息序列化对象存在别的消息序列化中时才需要设置，
         *                              这个是服务端的对象类名，注意，包含包名字，举例：com.linyun.base.msg.system.LinkValidationMsg
         * @returns {FL.ServerCmd}
         */
        public static buildCallBack(cmd:number, sObj:Function, callBack:(pHandleObj:NetMsgBase)=>void, callBackThis:any, onUpdateCmd?:string, sClassName?:string):ServerCmd {
            if (!callBack || !callBackThis) {
                egret.error("err callBack="+callBack+" callBackThis="+callBackThis);
            }
            return new ServerCmd(cmd, sObj, sClassName, callBack, callBackThis, onUpdateCmd);
        }

        /**
         * 构建转发更新指令
         * @param {number} cmd
         * @param {Function} sObj 序列化对象, 只有当服务器返回指令的之后才需要这个值
         * @param {string} onUpdateCmd
         * @param {string} sClassName  序列化对象的名字, 非必要，只有消息序列化对象存在别的消息序列化中时才需要设置，
         *                              这个是服务端的对象类名，注意，包含包名字，举例：com.linyun.base.msg.system.LinkValidationMsg
         * @returns {FL.ServerCmd}
         */
        public static buildTranspond(cmd:number, sObj:Function, onUpdateCmd:string, sClassName?:string):ServerCmd {
            return new ServerCmd(cmd, sObj, sClassName, null, null, onUpdateCmd);
        }

        /**
         * 构建发送到服务器的指令，该指令不会从服务器返回，仅仅用于指令验证是否重复 
         * @param cmd
         * @return {FL.ServerCmd}
         */
        public static buildSendCmd(cmd:number):ServerCmd {
            return new ServerCmd(cmd);
        }

    }

}