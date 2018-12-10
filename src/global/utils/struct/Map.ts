/**
 * 
 * @Name:  FL - Map
 * @Description:  自己封装的Map对象，还是个有序map
 * @Create: DerekWu on 2015/6/4 19:21
 * @Version: V1.0
 */
module FL {
    export class Map<K, V> {

        private _size:number;
        private _keys:Array<K>;
        private _values:Array<V>;

        public constructor() {
            this._keys = new Array<K>();
            this._values = new Array<V>();
            this._size = 0;
        }

        public clear():void {
            this._keys = new Array<K>();
            this._values = new Array<V>();
            this._size = 0;
        }

        public remove(pKey:K):V {
            var result:boolean = false;
            var vIndex = this._keys.indexOf(pKey);
            if (vIndex != -1) {
                this._keys.splice(vIndex, 1);
                var removeObj = this._values[vIndex];
                this._values.splice(vIndex, 1);
                this.updateSize();
                return removeObj;
            }
            return null;
        }

        public forEach(pCallBack:(pKey:K, pValue:V) => void, pCallBackObject?:any):void {
            var vSize:number = this._size;
            for (var i = 0; i < vSize; i++) {
                pCallBack.call(pCallBackObject, this._keys[i], this._values[i]);
            }
        }

        public get(pKey:K):V {
            var index = this._keys.indexOf(pKey);
            if (index != -1) {
                return this._values[index];
            }
            return null;
        }

        public has(pKey:K):boolean {
            return this._keys.indexOf(pKey) != -1;
        }

        public put(pKey:K, pValue:V):Map<K, V> {
            var index = this._keys.indexOf(pKey);
            if (index != -1) {
                this._values.splice(index, 1, pValue);
            } else {
                this._keys.push(pKey);
                this._values.push(pValue);
                this.updateSize();
            }
            return this;
        }

        private updateSize():void {
            this._size = this._keys.length;
        }

        public get size():number {
            return this._size;
        }
    }
}