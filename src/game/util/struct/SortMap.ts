module Game {
    /**
     * 
     * @Name:  Game - SortMap
     * @Description:  //自己封装的Map对象，还是个有序map,key,为string或者number类型
     * @Create: DerekWu on 2017/3/8 17:33
     * @Version: V1.0
     */
    export class SortMap<V> {

        private _size:number;
        private _data;
        private _values:Array<V>;

        public constructor() {
            this._data = {};
            this._values = new Array<V>();
            this._size = 0;
        }

        public clear():void {
            this._data = {};
            this._values = new Array<V>();
            this._size = 0;
        }

        public put(pKey:string|number, pValue:V):SortMap<V> {
            let self = this;
            let vValueObj = self._data[pKey];
            if (vValueObj) {
                if (vValueObj == pValue)
                    return self;
                self._data[pKey] = pValue;
                let index = self._values.indexOf(vValueObj);
                self._values.splice(index, 1, pValue);
            } else {
                self._data[pKey] = pValue;
                self._values.push(pValue);
                self.updateSize();
            }
            return self;
        }

        public get(pKey:string|number):V {
            return this._data[pKey];
        }

        public getByIndex(pIndex:number):V {
            return this._values[pIndex];
        }

        public has(pKey:string|number):boolean {
            return this._data[pKey]?true:false;
        }

        public hasObj(pObj:V):boolean {
            return this._values.indexOf(pObj)>-1?true:false;
        }

        public remove(pKey:string|number):V {
            let self = this;
            let vValueObj = self._data[pKey];
            if (vValueObj) {
                let vIndex = self._values.indexOf(vValueObj);
                self._values.splice(vIndex, 1);
                delete self._data[pKey];
                self.updateSize();
                return vValueObj;
            }
            return;
        }

        public getArray(): Array<V> {
            return this._values;
        }

        private updateSize():void {
            this._size = this._values.length;
        }

        public getSize():number {
            return this._size;
        }

    }
}