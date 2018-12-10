module FL {
    /**
     * 属性缓动对象，当一个对象中有多个缓动属性，为了互不干扰，则可以使用属性缓动对象分离
     * @Name:  FL - AttrTweenObj
     * @Company 
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/10/14 18:24
     * @Version: V1.0
     */
    export class AttrTweenObj {

        /** 属性对象 */
        private readonly _obj:any;
        private readonly _attr1:string;
        private readonly _attr2:string;
        private readonly _attr3:string;

        constructor(pObj:any, pAttrName1:string, pAttrName2?:string, pAttrName3?:string) {
            this._obj = pObj;
            this._attr1 = pAttrName1;
            if (pAttrName2) this._attr2 = pAttrName2;
            if (pAttrName3) this._attr3 = pAttrName3;
        }

        get v1(): string {
            return this._obj[this._attr1];
        }

        set v1(value: string) {
            this._obj[this._attr1] = value;
        }

        get v2(): string {
            return this._obj[this._attr2];
        }

        set v2(value: string) {
            this._obj[this._attr2] = value;
        }

        get v3(): string {
            return this._obj[this._attr3];
        }

        set v3(value: string) {
            this._obj[this._attr3] = value;
        }

    }
}