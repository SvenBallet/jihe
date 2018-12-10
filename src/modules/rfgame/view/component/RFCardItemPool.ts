module FL {
    /** 卡牌对象池 */
    export class RFCardItemPool {
        /** 卡牌池 */
        private static _pool = [];
        /** 根据大小初始化池 */
        public static initCardPool(size: number) {
            this.destoryPool();
            for (let i = 0; i < size; i++) {
                let card = new RFHandCardItemView();
                this._pool[i] = card;
            }
        }

        /** 获得一个卡牌对象 */
        public static getCardItem(): RFHandCardItemView {
            let card;
            if (!this._pool.length) {
                card = new RFHandCardItemView();
            } else {
                card = this._pool.pop();
            }
            return card;
        }

        /** 销毁池 */
        public static destoryPool() {
            this._pool = [];
        }

        /** 回收一个卡牌对象 */
        public static recoverCardItem(item: RFHandCardItemView) {
            // if (!(item && item.resetView)) {
            //     return;
            // }
            if (!item || !(item instanceof RFHandCardItemView)) return;
            item.resetView();
            this._pool.push(item);
        }
    }
}