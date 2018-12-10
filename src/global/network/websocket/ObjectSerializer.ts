module FL {

    /**
     * 对象序列化
     */
    export class ObjectSerializer {

        //true读取，false写入
        public readonly readMode: boolean;
        //二进制
        public readonly srcBytes: egret.ByteArray;

        constructor(readMode: boolean = false, srcBytes?: egret.ByteArray) {
            this.readMode = readMode;
            if (readMode) {
                if (!srcBytes) {
                    egret.error("ObjectSerializer readMode no srcBytes");
                }
                this.srcBytes = srcBytes;
            } else {
                //写模式说明即将要往服务端发送消息，消息内容不会太大
                this.srcBytes = new egret.ByteArray(null, 128);
                // this.srcBytes = new egret.ByteArray();
            }
            //使用小端格式
            this.srcBytes.endian = egret.Endian.LITTLE_ENDIAN;
        }

        /**
         * 序列化一个整型变量
         */
        public sInt(value: number): number {
            if (this.readMode)
                value = this.srcBytes.readInt();
            else {
                if (value)
                    this.srcBytes.writeInt(value);
                else
                    this.srcBytes.writeInt(0);
            }

            //返回 
            return value;
        }

        /**
         * 序列化一个Byte
         */
        public sByte(value: number): number {
            if (this.readMode)
                value = this.srcBytes.readByte();
            else {
                if (value)
                    this.srcBytes.writeByte(value);
                else
                    this.srcBytes.writeByte(0);
            }
            //返回 
            return value;
        }

        /**
         * 序列化一个Bytes 
         */
        public sBytes(value: egret.ByteArray): egret.ByteArray {
            if (this.readMode) {
                let vByteSize: number = this.srcBytes.readInt();
                if (vByteSize > 0) {
                    value = new egret.ByteArray();
                    this.srcBytes.readBytes(value, 0, vByteSize);
                } else {
                    value = null;
                }
            } else {
                let vByteSize: number = 0;
                if (value) vByteSize = value.length;
                this.srcBytes.writeInt(vByteSize);
                if (value) this.srcBytes.writeBytes(value);
            }
            return value;
        }

        /**
         * 序列化一个Bytes, 主要写入的时候，可以写一部分 
         */
        public sBytesWithOffsetAndSize(value: egret.ByteArray, data_offset: number, data_size: number): egret.ByteArray {
            if (this.readMode) {
                let vByteSize: number = this.srcBytes.readInt();
                if (vByteSize > 0) {
                    value = new egret.ByteArray();
                    this.srcBytes.readBytes(value, 0, vByteSize);
                } else {
                    value = null;
                }
            } else {
                let vByteSize: number = data_size;
                if (!value || (data_offset + data_size) > value.length) {
                    vByteSize = 0;
                }
                this.srcBytes.writeInt(vByteSize);
                if (!value && vByteSize > 0) {
                    this.srcBytes.writeBytes(value, data_offset, data_size);
                }
            }
            return value;
        }


        /**
         * 序列化一个Long   注意value 千万不能传null 进来
         */
        public sLong(value: dcodeIO.Long): dcodeIO.Long {
            if (this.readMode) {
                let vLow: number = this.srcBytes.readInt();
                let vHigh: number = this.srcBytes.readInt();
                value = dcodeIO.Long.fromBits(vLow, vHigh);
            }
            else {
                if (!value) value = dcodeIO.Long.ZERO;
                let vSrcBytes = this.srcBytes, vArrayNumber: Array<number> = value.toBytes(true), vIndex: number = 0, vLength: number = vArrayNumber.length;
                for (; vIndex < vLength; ++vIndex) {
                    vSrcBytes.writeByte(vArrayNumber[vIndex]);
                }
            }
            //返回 
            return value;
        }

        /**
         * 序列化一个double变量
         */
        public sDouble(value: number): number {
            if (this.readMode)
                value = this.srcBytes.readDouble();
            else {
                if (value)
                    this.srcBytes.writeDouble(value);
                else
                    this.srcBytes.writeDouble(0);
            }
            //返回 
            return value;
        }


        /**
         * 序列化一个double变量
         */
        public sFloat(value: number): number {
            if (this.readMode)
                value = this.srcBytes.readFloat();
            else {
                if (value)
                    this.srcBytes.writeFloat(value);
                else
                    this.srcBytes.writeFloat(0);
            }
            //返回 
            return value;
        }


        /**
         * 序列化一个字符串 
         */
        public sString(value: string): string {
            if (this.readMode) {
                value = this.srcBytes.readUTF();
                if (value == "null") {
                    value = null;
                }
            } else {
                if (!value && value != "") {
                    this.srcBytes.writeUTF("null");
                } else {
                    this.srcBytes.writeUTF(value);
                }
            }
            //返回 
            return value;
        }

        /**
         * 序列化一个从baseobject继承下来的简单数据对象
         */
        public sObject(value: IBaseObject): IBaseObject {
            if (this.readMode) {
                let className: string = this.srcBytes.readUTF();
                let vBaseObject: IBaseObject = null;
                if (className !== "null") {
                    vBaseObject = SerializerCache.constructObjByName(className);
                }
                //
                value = vBaseObject;
                //
                if (vBaseObject) {
                    vBaseObject.serialize(this);
                }
            } else {
                if (value) {
                    let vSClassName: string = value.sClassName;
                    if (vSClassName === "null") {
                        egret.error("vSClassName is null");
                    } else {
                        this.srcBytes.writeUTF(vSClassName);
                        value.serialize(this);
                    }
                } else {
                    this.srcBytes.writeUTF("null");
                }
            }
            //返回 
            return value;
        }

        /**
         * 序列化一个数组对象 
         */
        public sObjArray(array: Array<IBaseObject>): Array<IBaseObject> {
            let array_length: number = 0;
            if (this.readMode) {
                array_length = this.srcBytes.readInt();
                array = [];
                //
                if (array_length > 0) {
                    let class_name: string = this.srcBytes.readUTF();

                    //
                    for (let i = 0; i < array_length; i++) {
                        let obj: IBaseObject = null;
                        if (class_name !== "null")
                            obj = SerializerCache.constructObjByName(class_name);

                        if (obj) {
                            obj.serialize(this);
                        }
                        array.push(obj);
                    }
                }
                //
            }
            else//写入
            {
                if (!array) {
                    array_length = 0;
                } else {
                    array_length = array.length;
                }
                //
                this.srcBytes.writeInt(array_length);
                //
                if (array_length > 0) {
                    let obj0: IBaseObject = array[0];
                    let vClassName: string = obj0.sClassName;
                    this.srcBytes.writeUTF(vClassName);
                    //
                    for (let i = 0; i < array_length; i++) {
                        let obj: IBaseObject = array[i];
                        obj.serialize(this);
                    }
                }
            }
            return array;
        }

        /**
         * int 数组 
         */
        public sIntArray(array: Array<number>): Array<number> {

            let array_length: number = 0;
            if (this.readMode) {
                array_length = this.srcBytes.readInt();
                array = [];
                //
                if (array_length > 0) {
                    for (let i = 0; i < array_length; i++) {
                        let vInt: number = this.srcBytes.readInt();
                        array.push(vInt);
                    }
                }
                //
            }
            else//写入
            {
                if (!array) {
                    array_length = 0;
                } else {
                    array_length = array.length;
                }
                //
                this.srcBytes.writeInt(array_length);
                //
                if (array_length > 0) {
                    //
                    for (let i = 0; i < array_length; i++) {
                        this.srcBytes.writeInt(array[i]);
                    }
                }
            }
            return array;
        }

        /**
         * byte 数组 
         */
        public sByteArray(array: Array<number>): Array<number> {

            let array_length: number = 0;
            if (this.readMode) {
                array_length = this.srcBytes.readInt();
                array = [];
                //
                if (array_length > 0) {
                    for (let i = 0; i < array_length; i++) {
                        let vInt: number = this.srcBytes.readByte();
                        array.push(vInt);
                    }
                }
                //
            }
            else//写入
            {
                if (!array) {
                    array_length = 0;
                } else {
                    array_length = array.length;
                }
                //
                this.srcBytes.writeInt(array_length);
                //
                if (array_length > 0) {
                    //
                    for (let i = 0; i < array_length; i++) {
                        this.srcBytes.writeByte(array[i]);
                    }
                }
            }
            return array;
        }


        /**
         * string 数组 
         */
        public sStringArray(array: Array<string>): Array<string> {

            let array_length: number = 0;
            if (this.readMode) {
                array_length = this.srcBytes.readInt();
                array = [];
                //
                if (array_length > 0) {
                    for (let i = 0; i < array_length; i++) {
                        let vStr: string = this.srcBytes.readUTF();
                        if (vStr === "null")
                            array.push(null);
                        else
                            array.push(vStr);
                    }
                }
                //
            }
            else//写入
            {
                if (!array) {
                    array_length = 0;
                } else {
                    array_length = array.length;
                }
                //
                this.srcBytes.writeInt(array_length);
                //
                if (array_length > 0) {
                    //
                    for (let i = 0; i < array_length; i++) {
                        let vStr: string = array[i];
                        if (!vStr && vStr != "") {
                            this.srcBytes.writeUTF("null");
                        } else {
                            this.srcBytes.writeUTF(vStr);
                        }
                    }
                }
            }
            return array;
        }

        /**
         * 序列化一个布尔值
         * @param {Boolean} value
         * @returns {Boolean}
         */
        public sBoolean(value: boolean): boolean {
            if (this.readMode) {
                let temp: number = 0;
                temp = this.srcBytes.readInt();
                if (temp == 0) {
                    value = false;
                } else {
                    value = true;
                }

            } else if (value) {
                this.srcBytes.writeInt(1);
            } else {
                this.srcBytes.writeInt(0);
            }

            return value;
        }

    }

}