module FL {

    /**
     * 
     * @Name:  Game - SkillNode
     * @Description:  //跳跃链表 的 节点对象
     * @Create: DerekWu on 2017/6/6 10:52
     * @Version: V1.0
     */
    export class SkillNode<T> {
        /** 对象排序的数值key */
        public readonly key:number;
        /** 节点的值*/
        public readonly value:T;
        /** 上下左右 四个指针 */
        public up:SkillNode<T>;
        public down:SkillNode<T>;
        public left:SkillNode<T>;
        public right:SkillNode<T>;

        constructor (key:number, value:T) {
            this.key = key;
            this.value = value;
        }
    }

    /**
     * 
     * @Name:  Game - SkillList
     * @Description:  //跳跃链表
     * @Create: DerekWu on 2017/6/6 10:52
     * @Version: V1.0
     */
    export class SkillList<T> {
        /** 最底层的头部和尾部对象 */
        private _bottomHead:SkillNode<T>;
        private _bottomTail:SkillNode<T>;
        /** 最顶层的头部和尾部对象 */
        private _topHead:SkillNode<T>;
        private _topTail:SkillNode<T>;
        private _size:number;// 节点总数
        private _level:number;// 层数
        private _maxLevel:number;//最大层级

        constructor (maxSize?:number) {
            let self = this, vTempMaxSize:number = maxSize||65535;
            self._maxLevel = SkillList.genMaxLevel(vTempMaxSize);
            self.clear();
        }

        /**
         * 获得value是2的n次方的n，2^n=value 获得n
         * @param value
         * @return {number} 返回 number>=1
         */
        public static genMaxLevel(value:number):number {
            let vTempNum:number, vLevel:number = 0;
            if (value <= 0) {
                vTempNum = 1;
            } else {
                vTempNum = value;
            }
            while (vTempNum > 0) {
                vTempNum >>= 1, vLevel++;
            }
            return vLevel;
        }

        /**
         * 清空跳跃表
         * */
        public clear(maxSize?:number):void {
            let self = this;
            if (maxSize) {
                self._maxLevel = SkillList.genMaxLevel(maxSize);
            }
            self._topHead = new SkillNode<T>(Number.MIN_VALUE, null);
            self._topTail = new SkillNode<T>(Number.MAX_VALUE, null);
            self._bottomHead = self._topHead;
            self._bottomTail = self._topTail;
            self.horizontalLink(self._topHead, self._topTail);
            self._level = 0;
            self._size = 0;
        }

        public isEmpty():boolean {
            return this._size == 0;
        }

        public getSize():number {
            return this._size;
        }

        /**
         * 在最下面一层，找到要插入的位置前面的那个Node
         * @return {SkillNode<T>}
         */
        private findBeforeNode(key:number):SkillNode<T> {
            let self = this, p:SkillNode<T>= self._topHead;
            while (true) {
                // while (p.right.value != null && self._comparable(p.right.value, value) <= 0 ) {
                while (p.right.value && p.right.key <= key ) {
                    p = p.right;
                }
                // if (p.down != null) {
                if (p.down) {
                    p = p.down;
                } else {
                    break;
                }

            }
            return p;
        }

        /**
         * 找到当前对象的节点，没有则返回null
         * @param value
         * @return {SkillNode<T>}
         */
        private findCurrNode(key:number, value:T):SkillNode<T> {
            let self = this, p:SkillNode<T> = self._topHead, isSelected:boolean;
            while (true) {
                // while (p.right.value != null && !isSelected) {
                while (p.right.value && !isSelected) {
                    if (p.right.key < key) {
                        p = p.right;
                    } else if (p.right.key === key) {
                        if (p.right.value == value)
                            isSelected = true;
                        p = p.right;
                    }
                }
                if (p.down) {
                    p = p.down;
                } else {
                    break;
                }
            }
            return isSelected?p:null;
        }

        /**
         * 向跳跃表中添加value
         * @param key
         * @param value
         * @param addBeforeThisValue 将value添加到这个对象前面,必须和value的key相同
         * @param addBackThisValue 将value添加到这个对象后面,必须和value的key相同
         */
        public add(key:number, value:T, addBeforeThisValue?:T, addBackThisValue?:T):void {
            let self = this, p:SkillNode<T>;
            // if (this.hashMap.containsKey(value.hashCode())) return;
            if (addBeforeThisValue) {
                p = self.findCurrNode(key, value);
            } else if (addBackThisValue) {
                p = self.findCurrNode(key, value);
            } else {
                p = self.findBeforeNode(key);
            }
            //初始化当前新增对象的节点
            let q:SkillNode<T> = new SkillNode<T>(key, value);
            if (addBeforeThisValue) {
                self.backLink(p.left, q);
            } else {
                self.backLink(p, q);
            }

            // this.hashMap.put(value.hashCode(), q);

            let currentLevel=0, maxLevel = Math.min(self._maxLevel, self._level+1);//当前所在的层级是0,每次最多升一级
            //抛硬币
            while (Math.random() < 0.5 && currentLevel < maxLevel) {

                //如果超出了高度，需要重新建一个顶层
                if (currentLevel>=self._level) {
                    self._level++;
                    let p1:SkillNode<T>=new SkillNode<T>(Number.MIN_VALUE, null), p2:SkillNode<T>=new SkillNode<T>(Number.MAX_VALUE, null);
                    self.horizontalLink(p1, p2),
                        self.verticalLink(p1, self._topHead),
                        self.verticalLink(p2, self._topTail),
                        self._topHead=p1, self._topTail=p2;
                }
                //将p移动到上一层
                while (p.up) {
                    p=p.left;
                }
                p=p.up;
                let e:SkillNode<T> = new SkillNode<T>(key, value);
                self.backLink(p, e);//将e插入到p的后面
                self.verticalLink(e, q);//将e和q上下连接
                q=e;
                currentLevel++; //层数递增
            }
            self._size++;//总数递增
        }

        /**
         * 删除一个元素
         * @param key
         * @param value
         */
        public remove(key:number, value:T):void {
            // let node:SkillNode<T> = this.hashMap.get(value.hashCode());
            let self = this, node:SkillNode<T> = self.findCurrNode(key, value);
            if (node) {
                while (true) {
                    node.right.left = node.left;
                    node.left.right = node.right;
                    if (node.up) {
                        node = node.up;
                    } else {
                        break;
                    }
                }
                // self.hashMap.remove(value.hashCode());
                self._size--;//总数递减

                //看看是否需要降级
                while (self._topHead.down && self._topHead.right == self._topTail) {
                    self._topHead = self._topHead.down, self._topTail = self._topTail.down;
                    self._topHead.up = null, self._topTail.up = null;
                    self._level--;
                }
            }
            //    	return false;
        }

        /**
         * node1后面插入node2
         * @param node1
         * @param node2
         */
        private  backLink(node1:SkillNode<T> , node2:SkillNode<T>):void {
            node2.left = node1, node2.right = node1.right, node1.right.left = node2, node1.right = node2;
        }

        /**
         * 水平双向连接
         * @param node1 左边对象
         * @param node2 右边对象
         */
        private  horizontalLink(node1:SkillNode<T> , node2:SkillNode<T>):void {
            node1.right = node2, node2.left = node1;
        }

        /**
         * 垂直双向连接
         * @param node1 上边对象
         * @param node2 下边对象
         */
        private verticalLink(node1:SkillNode<T> , node2:SkillNode<T>):void {
            node1.down = node2, node2.up = node1;
        }

    }

}