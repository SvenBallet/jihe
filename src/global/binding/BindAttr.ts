module FL {

    /**
     * 
     * @Name:  FL - BindManager
     * @Description:  //绑定管理器
     * @Create: DerekWu on 2017/7/9 11:26
     * @Version: V1.0
     */
    export class BindManager {

        /** 唯一自增Id */
        private static ATTR_ID_COUNT:number = 1;
        /** 生成Id */
        public static genAttrId():number{
            return this.ATTR_ID_COUNT++;
        }
        /** 唯一自增Id */
        private static LISTENER_ID_COUNT:number = 1;
        /** 生成Id */
        public static genListenerId():number{
            return this.LISTENER_ID_COUNT++;
        }

        /** 绑定属性数据的Map */
        private static _bindAttrMap:{[key:number]:BindAttr<any>} = {};
        public static addBindAttr(pOneBindAttr:BindAttr<any>):void {
            this._bindAttrMap[pOneBindAttr.attrId] = pOneBindAttr;
        }
        public static $delBindAttr(pOneBindAttr:BindAttr<any>):void {
            delete this._bindAttrMap[pOneBindAttr.attrId];
        }

        /**
         * 释放所有的绑定属性
         * @param bindAttrArray
         */
        public static disposeBinAttr(...bindAttrArray:BindAttr<any>[]):void {
            if (bindAttrArray) {
                for (let vIndex:number = 0, vLength:number = bindAttrArray.length; vIndex < vLength; ++vIndex) {
                    bindAttrArray[vIndex].dispose();
                }
            }
        }

        /** 绑定对象的Map */
        private static _listenerMap:{[key:number]:BindListener} = {};
        private static addBindListener(pOneListener:BindListener):void {
            this._listenerMap[pOneListener.listenerId] = pOneListener;
        }

        /** this obj Key */
        private static readonly TO_KEY:string = "$T_B_L_ID_ARRAY$";

        /**
         * 添加属性监听，当属性发生变化的时候会回调
         * @param attrId 属性的Id
         * @param listener
         * @param thisObj
         * @return {number}  监听Id，有的话监听成功，没有的话则监听失败
         */
        public static addAttrListener(attrId:number, listener:Function, thisObj:any):number {
            if (!listener || !thisObj) {
                // FLLog.warn("### bindCallBack undefined this=%o func=%o", thisObj, callBack);
                return;
            }
            let self = this, vOneBindAttr:BindAttr<any> = self._bindAttrMap[attrId];
            if (!vOneBindAttr) {
                return;
            }
            //当前对象上已经监听中的绑定监听对象的Id列表
            let vThisBindListenerIdArray:number[] = thisObj[self.TO_KEY];
            //使用Id
            let vUseListenerId:number;
            if (!vThisBindListenerIdArray) {
                vThisBindListenerIdArray = [];
                thisObj[self.TO_KEY] = vThisBindListenerIdArray;
            } else {
                for (let vIndex:number = 0, vLength:number = vThisBindListenerIdArray.length; vIndex < vLength; ++vIndex) {
                    let vOneBindListener:BindListener = self._listenerMap[vThisBindListenerIdArray[vIndex]];
                    if (attrId === vOneBindListener.attrId && listener == vOneBindListener.listener && thisObj == vOneBindListener.thisObj) {
                        // FLLog.warn("### bindCallBack is repeated this=%o func=%o", thisObj, callBack);
                        vUseListenerId = vOneBindListener.listenerId;
                        break;
                    }
                }
            }
            //假如使用Id没有值，则新建
            if (!vUseListenerId) {
                //创建新的绑定对象
                let vNewBindListener:BindListener = new BindListener(attrId, thisObj, listener);
                vUseListenerId = vNewBindListener.listenerId;
                self.addBindListener(vNewBindListener);
                vThisBindListenerIdArray.push(vUseListenerId);
            }
            vOneBindAttr.addListenerId(vUseListenerId);
            //马上回调一次
            self.updateById(vUseListenerId, vOneBindAttr.getValue());
            return vUseListenerId;
        }

        /**
         * 手动删除属性监听，一般自动释放
         * @param attrId
         * @param listener
         * @param thisObj 属性的Id
         */
        // public static remAttrListener(attrId:number, listener:Function, thisObj:any):void {
        //     if (!listener || !thisObj) {
        //         // FLLog.warn("### bindCallBack undefined this=%o func=%o", thisObj, callBack);
        //         return;
        //     }
        //     let self = this;
        //     // let vOneBindAttr:BindAttr<any> = self._bindAttrMap[attrId];
        //     // if (!vOneBindAttr) {
        //     //     return;
        //     // }
        //     //当前对象上已经监听中的绑定监听对象的Id列表
        //     let vThisBindListenerIdArray:number[] = thisObj[self.TO_KEY];
        //     if (!vThisBindListenerIdArray) {
        //         //没有值则返回
        //         return;
        //     }
        //     //删除Id
        //     let vDelListenerId:number;
        //     for (let vIndex:number = 0, vLength:number = vThisBindListenerIdArray.length; vIndex < vLength; ++vIndex) {
        //         let vOneBindListener:BindListener = self._listenerMap[vThisBindListenerIdArray[vIndex]];
        //         if (attrId === vOneBindListener.attrId && listener == vOneBindListener.listener && thisObj == vOneBindListener.thisObj) {
        //             vDelListenerId = vOneBindListener.listenerId;
        //             vThisBindListenerIdArray.splice(vIndex, 1); //删除
        //             if (vThisBindListenerIdArray.length === 0) {
        //                 thisObj[self.TO_KEY] = null;
        //             }
        //             break;
        //         }
        //     }
        //     //有删除Id则处理
        //     if (vDelListenerId) {
        //         // vOneBindAttr.delListenerId(vUseListenerId);
        //         delete self._listenerMap[vDelListenerId];
        //     }
        // }

        /**
         * 手动删除属性监听，一般自动释放
         * @param attrId
         * @param listener
         * @param thisObj 属性的Id
         */
        public static remAttrListener(listenerId:number):void {
            let self = this, vOneBindListener:BindListener = self._listenerMap[listenerId];
            if (!vOneBindListener) {
                return;
            }
            delete self._listenerMap[listenerId];
            let vThisObj = vOneBindListener.thisObj;
            //当前对象上已经监听中的绑定监听对象的Id列表
            let vThisBindListenerIdArray:number[] = vThisObj[self.TO_KEY];
            if (!vThisBindListenerIdArray) {
                //没有值则返回
                return;
            }
            let vListenerIndex:number = vThisBindListenerIdArray.indexOf(listenerId);
            if (vListenerIndex !== -1) {
                vThisBindListenerIdArray.splice(vListenerIndex, 1);
            }
            if (vThisBindListenerIdArray.length === 0) {
                vThisObj[self.TO_KEY] = null;
            }
        }

        /**
         * 移除一个对象上的所有监听
         * @param obj
         */
        public static remAllAttrListener(obj:any):void { 
            if (!obj) return;
            let self = this, vThisBindListenerIdArray:number[] = obj[self.TO_KEY];
            if (!vThisBindListenerIdArray) {
                //没有值则返回
                return;
            }
            //删除所有的值
            for (let vIndex:number = 0, vLength:number = vThisBindListenerIdArray.length; vIndex < vLength; ++vIndex) {
                delete self._listenerMap[vThisBindListenerIdArray[vIndex]];
            }
            obj[self.TO_KEY] = null;
        }

        /**
         * 通过Id更新
         * @param listenerId
         * @param value
         * @return {boolean}
         */
        public static updateById(listenerId:number, value:any):boolean {
            let vOneBindListener:BindListener = this._listenerMap[listenerId];
            if (vOneBindListener) {
                vOneBindListener.listener.call(vOneBindListener.thisObj, value);
                return true;
            } else
                return false;
        }

    }

    /**
     * 
     * @Name:  FL - BindAttr
     * @Description:  //绑定属性
     * @Create: DerekWu on 2017/7/9 11:26
     * @Version: V1.0
     */
    export class BindAttr<T> {

        /** 绑定属性的唯一Id */
        public readonly attrId:number;
        /** 属性值 */
        private _value:T;
        /** 属性值是否改变 */
        private _isChange:boolean;
        /** 绑定的对象Id列表 */
        private _listenerIds:number[];
        /** 更新时的删除Id列表 */
        private _delIds:number[];

        /** 是否立刻更新 **/
        private readonly _isAtOnce:boolean;

        constructor(value:T, isAtOnceUpdate?:boolean) {
            this._value = value;
            this.attrId = BindManager.genAttrId();
            BindManager.addBindAttr(this);
            if (isAtOnceUpdate) this._isAtOnce = true;
        }

        get value(): T {
            return this._value;
        }

        set value(value: T) {
            this.setValue(value);
        }

        public getValue(): T {
            return this._value;
        }

        public setValue(value: T) {
            let self = this;
            if (self._value === value) {
                return;
            } else {
                self._value = value, self.change();
            }
        }

        public setValueNotUpdateBinder(value: T) {
            let self = this;
            if (self._value === value) {
                return;
            } else {
                self._value = value;
            }
        }

        public change():void {
            let self = this;
            if (!self._isChange && self._listenerIds && self._listenerIds.length > 0) {
                self._isChange = true;
                if (self._isAtOnce) {
                    //立刻更新
                    self.updateBinder();
                } else {
                    //添加到渲染前回调
                    Game.BeforeRender.addLogic(self.updateBinder, self);
                }
            }
        }

        // public getValue(): T {
        //     return this._value;
        // }
        //
        // public setValue(value: T) {
        //     let self = this;
        //     if (self._value === value) {
        //         return;
        //     } else {
        //         self._value = value;
        //         if (!self._isChange && self._listenerIds && self._listenerIds.length > 0) {
        //             self._isChange = true;
        //             //添加到渲染先回调
        //             Game.BeforeRender.addLogic(self.updateBinder, self);
        //         }
        //     }
        // }

        // /**
        //  * 返回所有的监听Id
        //  * @return {number[]}
        //  */
        // public getListenerIds():number[] {
        //     return this._listenerIds;
        // }

        /**
         * 添加监听Id
         * @param listenerId
         */
        public addListenerId(listenerId:number):void {
            let vListenerIds:number[] = this._listenerIds;
            if (!vListenerIds) {
                vListenerIds = [];
                vListenerIds.push(listenerId);
                this._listenerIds = vListenerIds;
            } else {
                if (vListenerIds.indexOf(listenerId) === -1) {
                    vListenerIds.push(listenerId);
                }
            }
        }

        /**
         * 删除监听Id
         * @param listenerId
         */
        // public delListenerId(listenerId:number):void {
        //     let vListenerIds:number[] = this._listenerIds;
        //     if (vListenerIds) {
        //         let vIndex:number = vListenerIds.indexOf(listenerId);
        //         if (vIndex != -1) {
        //             vListenerIds.splice(vIndex, 1); //删除对应Id
        //         }
        //         if (vListenerIds.length === 0) {
        //             this._listenerIds = null;
        //         }
        //     }
        // }

        /**
         * 渲染前回调函数
         */
        private updateBinder():void {
            let self = this;
            if (self._isChange) {
                let vListenerIds:number[] = self._listenerIds;
                if (vListenerIds) {
                    //新版本处理
                    let vIndex:number = 0, vLength:number = vListenerIds.length, vCurrListenerId:number;
                    for (; vIndex < vLength; ++vIndex) {
                        vCurrListenerId = vListenerIds[vIndex];
                        if (!BindManager.updateById(vCurrListenerId, self._value)) {
                            if (!self._delIds) self._delIds = [];
                            self._delIds.push(vCurrListenerId);
                        }
                    }
                    if (self._delIds) {
                        let vTempIndex:number;
                        for (vIndex = 0, vLength = self._delIds.length; vIndex <vLength; ++vIndex) {
                            vTempIndex = vListenerIds.indexOf(self._delIds[vIndex]);
                            vListenerIds.splice(vTempIndex, 1);
                        }
                        self._delIds = null;
                    }
                    //下面是老版的，不要去掉注释
                    // while (vIndex < vListenerIds.length) {
                    //     // let vOneListenerId:number = vListenerIds[vIndex];
                    //     if (!BindManager.updateById(vListenerIds[vIndex], self._value)) {
                    //         vListenerIds.splice(vIndex, 1);
                    //     } else {
                    //         vIndex++;
                    //     }
                    // }
                    if (vListenerIds.length === 0) {
                        self._listenerIds = null;
                    }
                }
                self._isChange = false;
            }
        }

        /**
         * 释放
         */
        public dispose():void {
            let self = this;
            BindManager.$delBindAttr(self);
            let vListenerIds:number[] = self._listenerIds;
            if (vListenerIds) {
                for (let vIndex:number = 0, vLength:number = vListenerIds.length; vIndex < vLength; ++vIndex) {
                    BindManager.remAttrListener(vListenerIds[vIndex]);
                }
                self._listenerIds = null;
            }
        }

    }

    /**
     * 
     * @Name:  FL - BindListener
     * @Description:  //绑定鉴定的数据对象
     * @Create: DerekWu on 2017/7/9 11:26
     * @Version: V1.0
     */
    export class BindListener {
        /** 绑定对象的唯一Id */
        public readonly listenerId:number;
        /** 绑定的属性对象的Id */
        public readonly attrId:number;
        public readonly thisObj:any;
        public readonly listener:Function;
        constructor (attrId:number, thisObj:any, listener:Function) {
            this.listenerId = BindManager.genListenerId();
            this.attrId = attrId;
            this.thisObj = thisObj;
            this.listener = listener;
        }
    }

}