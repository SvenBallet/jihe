module Game {

    /**
     * 
     * @Name:  Game - LinkedList
     * @Description:  //链表
     * @Create: DerekWu on 2017/3/24 15:43
     * @Version: V1.0
     */
    export class LinkedList {

        /** 链表中元素的数量 */
        private _size:number = 0;
        private _firstNode:LinkedNode;
        private _lastNode:LinkedNode;

        /**
         * 获得第一个
         * @return {null}
         */
        public getFirst():any {
            return this._firstNode?this._firstNode.data:null;
        }

        /**
         * 获得最后一个
         * @return {null}
         */
        public getLast():any {
            return this._lastNode?this._lastNode.data:null;
        }

        /**
         * 迭代处理
         * @param pCallBack
         * @param pCallBackObject
         */
        public forEach(pCallBack:(pData:any) => void, pCallBackObject?:any):void {
            // if (this._size > 0) {
                let currNode:LinkedNode = this._firstNode, tempNode:LinkedNode;
                while (currNode) {
                    tempNode = currNode.nextNode;
                    pCallBack.call(pCallBackObject, currNode.data);
                    currNode = tempNode;
                }
            // }
        }

        /**
         * 获取并移除此列表的第一个元素；如果此列表为空，则返回 null。
         * @return {any}
         */
        public pollFirst():any {
            let self = this;
            if (self._firstNode) {
                let vData:LinkedNode = self._firstNode;
                if (vData.nextNode) {
                    self._firstNode = vData.nextNode;
                    self._firstNode.upNode = null;
                } else {
                    self._firstNode = null;
                    self._lastNode = null;
                }
                self._size--;
                vData.nextNode = null;
                return vData.data;
            } else {
                return null;
            }
        }

        /**
         * 获取并移除此列表的最后一个元素；如果此列表为空，则返回 null。
         * @return {any}
         */
        public pollLast():any {
            let self = this;
            if (self._lastNode) {
                let vData:LinkedNode = self._lastNode;
                if (vData.upNode) {
                    self._lastNode = vData.upNode;
                    self._lastNode.nextNode = null;
                } else {
                    self._firstNode = null;
                    self._lastNode = null;
                }
                self._size--;
                vData.nextNode = null;
                return vData.data;
            } else {
                return null;
            }
        }

        /**
         * 将指定元素插入此列表的开头。
         * @param pData
         */
        public addFirst(pData:any):void {
            let self = this;
            let vNewLinkedNode:LinkedNode = new LinkedNode();
            vNewLinkedNode.data = pData;
            if (self._firstNode) {
                vNewLinkedNode.nextNode = self._firstNode;
                self._firstNode.upNode = vNewLinkedNode;
                self._firstNode = vNewLinkedNode;
            } else {
                self._firstNode = vNewLinkedNode;
                self._lastNode = vNewLinkedNode;
            }
            self._size++;
        }

        /**
         * 将指定元素添加到此列表的结尾。
         * @param pData
         */
        public addLast(pData:any):void {
            let self = this;
            let vNewLinkedNode:LinkedNode = new LinkedNode();
            vNewLinkedNode.data = pData;
            if (self._lastNode) {
                self._lastNode.nextNode = vNewLinkedNode;
                vNewLinkedNode.upNode = self._lastNode;
                self._lastNode = vNewLinkedNode;
            } else {
                self._firstNode = vNewLinkedNode;
                self._lastNode = vNewLinkedNode;
            }
            self._size++;
        }

        /**
         * 获得链表中元素数量
         * @return {number}
         */
        public getSize():number {
            return this._size;
        }

    }

    /**
     * 链表节点
     */
    export class LinkedNode {
        public upNode:LinkedNode;
        public data:any;
        public nextNode:LinkedNode;
    }

}