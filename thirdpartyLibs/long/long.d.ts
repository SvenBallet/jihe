
declare module dcodeIO{
    class Long {

        /**
         * Tests if the specified object is a Long.
         * @function
         * @param {*} obj Object
         * @returns {boolean}
         */
        static isLong(obj:any):boolean;

        /**
         * Returns a Long representing the given 32 bit integer value.
         * @function
         * @param {number} value The 32 bit integer in question
         * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
         * @returns {!Long} The corresponding Long value
         */
        static fromInt(value:number, unsigned?:boolean):Long;

        /**
         * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
         * @function
         * @param {number} value The number in question
         * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
         * @returns {!Long} The corresponding Long value
         */
        static fromNumber(value:number, unsigned?:boolean):Long;

        /**
         * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
         *  assumed to use 32 bits.
         * @function
         * @param {number} lowBits The low 32 bits
         * @param {number} highBits The high 32 bits
         * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
         * @returns {!Long} The corresponding Long value
         */
        static fromBits(lowBits:number, highBits:number, unsigned?:boolean):Long;

        /**
         * @param {string} str
         * @param {(boolean|number)=} unsigned
         * @param {number=} radix
         * @returns {!Long}
         * @inner
         */
        static fromString(str:string, unsigned?:boolean|number, radix?:number):Long;

        /**
         * @function
         * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
         * @returns {!Long}
         * @inner
         */
        static fromValue(val:Long|number|string|{low: number, high: number, unsigned: boolean}):Long;


        static ZERO:Long;
        static UZERO:Long;
        static ONE:Long;
        static UONE:Long;
        static NEG_ONE:Long;


        static MAX_VALUE:Long;
        static MAX_UNSIGNED_VALUE:Long;
        static MIN_VALUE:Long;

        /**
         * 返回数字
         * @returns {number}
         */
        toInt():number;

        /**
         * 返回数字
         * @returns {number}
         */
        toNumber():number;

        /**
         * Gets the high 32 bits as a signed integer.
         * @returns {number} Signed high bits
         */
        getHighBits():number;

        /**
         * Gets the high 32 bits as an unsigned integer.
         * @returns {number} Unsigned high bits
         */
        getHighBitsUnsigned():number;

        /**
         * Gets the low 32 bits as a signed integer.
         * @returns {number} Signed low bits
         */
        getLowBits():number;

        /**
         * Gets the low 32 bits as an unsigned integer.
         * @returns {number} Unsigned low bits
         */
        getLowBitsUnsigned():number;

        /**
         * Converts the Long to a string written in the specified radix.
         * @param {number=} radix Radix (2-36), defaults to 10
         * @returns {string}
         * @override
         * @throws {RangeError} If `radix` is out of range
         */
        toString(radix?:number):string;

        //是否正数
        isPositive():boolean;
        //是否负数
        isNegative():boolean;
        //是否基数
        isOdd():boolean;
        //是否偶数
        isEven():boolean;
        //是否相等
        equals(other:Long|number|string):boolean;
        //是否不相等
        notEquals(other:Long|number|string):boolean;
        lessThan(other:Long|number|string):boolean;
        lessThanOrEqual(other:Long|number|string):boolean;
        greaterThan(other:Long|number|string):boolean;
        greaterThanOrEqual(other:Long|number|string):boolean;

        //增加
        add(other:Long|number|string):Long;
        subtract(other:Long|number|string):Long;
        multiply(other:Long|number|string):Long;
        divide(other:Long|number|string):Long;
        modulo(other:Long|number|string):Long;

        //按位取反
        not(other:Long|number|string):Long;
        //按位与
        and(other:Long|number|string):Long;
        //按位或
        or(other:Long|number|string):Long;
        //按位亦或
        xor(other:Long|number|string):Long;

        /**
         * 转为字节数组
         * le: 是否小端
         */
        toBytes(le?:boolean):Array<number>;

    }
}