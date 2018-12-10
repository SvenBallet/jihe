module Game {


    /**
     * 角度信息接口，不允许外部修改
     */
    export interface IAngleInfo {
        readonly sin:number;
        readonly cos:number;
    }

    /**
     * 角度信息实现类
     */
    export class $AngleInfo {
        sin:number;
        cos:number;
    }


    /**
     * 
     * @Name:  Game - MathUtil
     * @Description:  可使用 MathUtil 类 进行3d矩阵的计算
     * @Create: DerekWu on 2016/6/16 18:23
     * @Version: V1.0
     */
    export class MathUtil {

        /**
         * @language zh_CN
         * 1弧度为多少角度
         * @version Egret 3.0
         * @platform Web,Native
         */
        public static readonly RADIANS_TO_DEGREES: number = 180 / Math.PI;

        /**
         * @language zh_CN
         * 1角度为多少弧度
         * @version Egret 3.0
         * @platform Web,Native
         */
        public static readonly DEGREES_TO_RADIANS: number = Math.PI / 180;

        /** 45度角 的 sin值，即上帝视角 ,顺时针旋转 */
        public static readonly GOD_VIEW_SIN:number =Math.sin(45/180 * Math.PI);
        public static readonly GOD_VIEW_SIN_POW2:number = MathUtil.GOD_VIEW_SIN * MathUtil.GOD_VIEW_SIN;

        /**
         * @private
         * 1角度为多少弧度
         * @version Egret 3.0
         * @platform Web,Native
         */
        public static readonly RAW_DATA_CONTAINER: Float32Array = new Float32Array(16);

        /**
         * @private
         */
        // public static readonly CALCULATION_MATRIX: Matrix4_4 = new Matrix4_4();

        /**
         * @private
         */
        // public static readonly CALCULATION_QUATERNION: Quaternion = new Quaternion();

        /**
         * @private
         */
        //public static CALCULATION_VECTOR3D: Vector3D = new Vector3D();


        /**
         * 将某个点顺时针旋转某个角度，基于（0,0）
         * @param x
         * @param y
         * @param angle 角度
         * @return {{x: number, y: number}}
         */
        public static rotation(x:number, y:number, angle:number):{x:number, y:number} {
            // let vRadians:number = angle/180 * Math.PI,
            //     vSinValue:number = Math.sin(vRadians),
            //     vCosValue:number = Math.cos(vRadians);
            let vOneAngleInfo:IAngleInfo = this.getAngleInfo(angle);
            // let vTempX:number = Math.round(x * vOneAngleInfo.cos + y * vOneAngleInfo.sin),
            //     vTempY:number = Math.round(y * vOneAngleInfo.cos - x * vOneAngleInfo.sin);
            let vTempX:number = x * vOneAngleInfo.cos + y * vOneAngleInfo.sin,
                vTempY:number = y * vOneAngleInfo.cos - x * vOneAngleInfo.sin;
            return {x:vTempX, y:vTempY};
        }

        /**
         * 将某个点顺时针旋转某个角度，基于（baseX,baseY）
         * @param x
         * @param y
         * @param angle 角度
         * @param baseX
         * @param baseY
         * @return {{x: number, y: number}}
         */
        public static rotationByPoint(x:number, y:number, angle:number, baseX:number, baseY:number):{x:number, y:number} {
            // let vRadians:number = angle/180 * Math.PI,
            //     vSinValue:number = Math.sin(vRadians),
            //     vCosValue:number = Math.cos(vRadians);
            let vOneAngleInfo:IAngleInfo = this.getAngleInfo(angle);
            // let vTempX:number = Math.round((x - baseX) * vOneAngleInfo.cos + (y - baseY) * vOneAngleInfo.sin + baseX),
            //     vTempY:number = Math.round((y - baseY) * vOneAngleInfo.cos - (x - baseX) * vOneAngleInfo.sin + baseY);
            let vTempX:number = (x - baseX) * vOneAngleInfo.cos + (y - baseY) * vOneAngleInfo.sin + baseX,
                vTempY:number = (y - baseY) * vOneAngleInfo.cos - (x - baseX) * vOneAngleInfo.sin + baseY;
            return {x:vTempX, y:vTempY};
        }

        /**
         * 角度信息Map
         * @type {{}}
         * @private
         */
        private static _angleInfoMap:{[angle:number]:$AngleInfo} = {};

        /**
         * 获得角度信息
         * @param angle
         * @return {$AngleInfo}
         */
        public static getAngleInfo(angle:number):IAngleInfo {
            let self = this, vTempAngle:number = ~~angle, vOneAngleInfo:$AngleInfo;
            if (vTempAngle < 0) {
                if (vTempAngle < -360) {
                    vTempAngle = 360 + vTempAngle%360;
                } else {
                    vTempAngle = 360 + vTempAngle;
                }
            } else if (vTempAngle > 360) {
                vTempAngle %= 360;
            }
            vOneAngleInfo = self._angleInfoMap[vTempAngle];
            if (!vOneAngleInfo) {
                let vMath = Math, vRadians:number = vTempAngle/180 * vMath.PI, vSinValue:number = vMath.sin(vRadians), vCosValue:number = vMath.cos(vRadians);
                vOneAngleInfo = new $AngleInfo();
                vOneAngleInfo.sin = vSinValue, vOneAngleInfo.cos = vCosValue;
                self._angleInfoMap[vTempAngle] = vOneAngleInfo;
            }
            return vOneAngleInfo;
        }

        /**
         * 计算距离
         * @param pStartX
         * @param pStartY
         * @param pEndX
         * @param pEndY
         * @return {number}
         */
        public static countDistance(pStartX:number, pStartY:number, pEndX:number, pEndY:number):number {
            let vDisX:number = pStartX - pEndX, vDisY:number = pStartY - pEndY;
            return Math.sqrt(vDisX*vDisX + vDisY*vDisY);
        }

        // /**
        //  * 获得value是2的n次方的n，2^n=value 获得n，SkipList专用方法，已经移到SkipList类中
        //  * @param value
        //  * @return {number} 返回 number>=1
        //  */
        // public static getTwoPow(value:number):number {
        //     let vTempNum:number, vLevel:number = 0;
        //     if (value <= 0) {
        //         vTempNum = 1;
        //     } else {
        //         vTempNum = value;
        //     }
        //     while (vTempNum > 0) {
        //         // console.log(vTempNum);
        //         vTempNum >>= 1, vLevel++;
        //     }
        //     return vLevel;
        // }

        /**
         * @language zh_CN
         * 四元数转矩阵
         * @param quarternion 源四元数
         * @param m 目标矩阵 默认为null 如果为null将会new 一个Matrix4_4
         * @returns 返回转出矩阵
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public static quaternion2matrix(quarternion: Quaternion, m: Matrix4_4 = null): Matrix4_4 {
        //    var x: number = quarternion.x;
        //    var y: number = quarternion.y;
        //    var z: number = quarternion.z;
        //    var w: number = quarternion.w;
        //
        //    var xx: number = x * x;
        //    var xy: number = x * y;
        //    var xz: number = x * z;
        //    var xw: number = x * w;
        //
        //    var yy: number = y * y;
        //    var yz: number = y * z;
        //    var yw: number = y * w;
        //
        //    var zz: number = z * z;
        //    var zw: number = z * w;
        //
        //    var raw: Float32Array = MathUtil.RAW_DATA_CONTAINER;
        //    raw[0] = 1 - 2 * (yy + zz);
        //    raw[1] = 2 * (xy + zw);
        //    raw[2] = 2 * (xz - yw);
        //    raw[4] = 2 * (xy - zw);
        //    raw[5] = 1 - 2 * (xx + zz);
        //    raw[6] = 2 * (yz + xw);
        //    raw[8] = 2 * (xz + yw);
        //    raw[9] = 2 * (yz - xw);
        //    raw[10] = 1 - 2 * (xx + yy);
        //    raw[3] = raw[7] = raw[11] = raw[12] = raw[13] = raw[14] = 0;
        //    raw[15] = 1;
        //
        //    if (m) {
        //        m.copyRawDataFrom(raw);
        //        return m;
        //    } else
        //        return new Matrix4_4(new Float32Array(raw));
        //}

        /**
         * @language zh_CN
         * 得到矩阵朝前的方向
         * @param m 源矩阵
         * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
         * @returns Vector3D 返回方向
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public static getForward(m: Matrix4_4, v: Vector3D = null): Vector3D {
        //    if (v === null) {
        //        v = new Vector3D(0.0, 0.0, 0.0);
        //    }
        //
        //    m.copyRowTo(2, v);
        //    v.normalize();
        //    return v;
        //}

        /**
         * @language zh_CN
         * 得到矩阵朝上的方向
         * @param m 源矩阵
         * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
         * @returns Vector3D 返回方向
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public static getUp(m: Matrix4_4, v: Vector3D = null): Vector3D {
        //    //v ||= new Vector3D(0.0, 0.0, 0.0);
        //
        //    if (v === null) {
        //
        //        v = new Vector3D(0.0, 0.0, 0.0);
        //
        //    }
        //
        //    m.copyRowTo(1, v);
        //    v.normalize();
        //
        //    return v;
        //}

        /**
         * @language zh_CN
         * 得到矩阵朝右的方向
         * @param m 源矩阵
         * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
         * @returns Vector3D 返回方向
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public static getRight(m: Matrix4_4, v: Vector3D = null): Vector3D {
        //    //v ||= new Vector3D(0.0, 0.0, 0.0);
        //    if (v === null) {
        //
        //        v = new Vector3D(0.0, 0.0, 0.0);
        //
        //    }
        //
        //    m.copyRowTo(0, v);
        //    v.normalize();
        //
        //    return v;
        //}

        /**
         * @language zh_CN
         * 比较两个矩阵是否相同
         * @param m1 矩阵1
         * @param m2 矩阵2
         * @returns boolean 相同返回true
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public static compare(m1: Matrix4_4, m2: Matrix4_4): boolean {
        //    var r1: Float32Array = MathUtil.RAW_DATA_CONTAINER;
        //    var r2: Float32Array = m2.rawData;
        //    m1.copyRawDataTo(r1);
        //
        //    for (var i: number = 0; i < 16; ++i) {
        //        if (r1[i] != r2[i])
        //            return false;
        //    }
        //
        //    return true;
        //}

        /**
         * @language zh_CN
         * 得到平面的反射矩阵
         * @param plane 反射的面
         * @param target 计算返回的矩阵 可为null 如果为null将会new 一个Matrix4_4
         * @returns Matrix4_4 返回计算的结果
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public static reflection(plane: Plane3D, target: Matrix4_4 = null): Matrix4_4 {
        //    if (target === null)
        //        target = new Matrix4_4();
        //
        //    var a: number = plane.a, b: number = plane.b, c: number = plane.c, d: number = plane.d;
        //    var rawData: Float32Array = MathUtil.RAW_DATA_CONTAINER;
        //    var ab2: number = -2 * a * b;
        //    var ac2: number = -2 * a * c;
        //    var bc2: number = -2 * b * c;
        //    // reflection matrix
        //    rawData[0] = 1 - 2 * a * a;
        //    rawData[4] = ab2;
        //    rawData[8] = ac2;
        //    rawData[12] = -2 * a * d;
        //    rawData[1] = ab2;
        //    rawData[5] = 1 - 2 * b * b;
        //    rawData[9] = bc2;
        //    rawData[13] = -2 * b * d;
        //    rawData[2] = ac2;
        //    rawData[6] = bc2;
        //    rawData[10] = 1 - 2 * c * c;
        //    rawData[14] = -2 * c * d;
        //    rawData[3] = 0;
        //    rawData[7] = 0;
        //    rawData[11] = 0;
        //    rawData[15] = 1;
        //    target.copyRawDataFrom(rawData);
        //
        //    return target;
        //}

        /**
         * @language zh_CN
         * 得到矩阵的平移
         * @param transform 计算的矩阵
         * @param result 计算返回平移坐标 可为null 如果为null将会new 一个Vector3D
         * @returns Vector3D 返回平移坐标
         * @version Egret 3.0
         * @platform Web,Native
         */
        //public static getTranslation(transform: Matrix4_4, result: Vector3D = null): Vector3D {
        //    if (!result)
        //        result = new Vector3D();
        //
        //    transform.copyRowTo(3, result);
        //    return result;
        //}

        /**
         * @language zh_CN
         * 把一个值固定在一个范围之内
         * @param value 当前判定的值
         * @param min_inclusive 最小取值
         * @param max_inclusive 最大取值
         * @returns number 计算后的结果
         * @version Egret 3.0
         * @platform Web,Native
         */
        public static clampf(value: number, min_inclusive: number, max_inclusive: number) : number {
            if (min_inclusive > max_inclusive) {
                var temp: number = min_inclusive;
                min_inclusive = max_inclusive;
                max_inclusive = temp;
            }
            return value < min_inclusive ? min_inclusive : (value < max_inclusive ? value : max_inclusive);
        }

        /**
         * @private
         */
        //public static ScreenToPosition(value: number, offset: number, max: number): number {
        //    return (value + offset * 0.5) / max * 2 - 1;
        //}

        /**
         * @private
         */
        //public static PositionToScreen(value: number, offset: number, max: number): number {
        //    return (value + 1) * 0.5 * max - offset * 0.5;
        //}
    }
}