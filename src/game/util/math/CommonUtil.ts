module Game {
    /**
     * 
     * @Name:  Game - CommonUtil
     * @Description:  //公共工具类
     * @Create: DerekWu on 2017/3/18 9:20
     * @Version: V1.0
     */
    export class CommonUtil {

        public static copyFloat32Array():void {

        }

        public static get isNative() {
			return (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE);
        }

        public static get IsWeb() {
			return (egret.Capabilities.runtimeType == egret.RuntimeType.WEB);
		}

		public static get IsIos() {
			return (egret.Capabilities.os == "iOS")
		}

		public static get IsAndroid() {
			return (egret.Capabilities.os == "Android")
		}

        public static get IsWindowsPC() {
			return (egret.Capabilities.os == "Windows PC")
		}

        public static get IsMacOS() {
			return (egret.Capabilities.os == "Mac OS")
		}

        public static get IsLongScreen() {
            let rate = egret.Capabilities.boundingClientWidth / egret.Capabilities.boundingClientHeight;
            if(rate >= 2){
                return true;
            }
            return false;
        }

        public static get DeviceFlag() {
            if (CommonUtil.IsWeb) {
                if (CommonUtil.IsWindowsPC || CommonUtil.IsMacOS) {
                    return 3;
                }
                return 0;
            }
            else if (CommonUtil.isNative) {
                if (CommonUtil.IsIos) {
                    return 1;
                }
                else if (CommonUtil.IsAndroid) {
                    return 2;
                }
            }
            return 0;
        }

        /**
         * 添加允许点击间隔
         */
        public static addTapGap(target: eui.Image | eui.Group | FL.GameButton, gapTime: number) {
            target.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                if (gapTime < 1) return;
                target.touchEnabled = false;
                egret.setTimeout(()=>{
                    target.touchEnabled = true;
                },this,gapTime);
            }, this);
        }

        /**
         * 对象深拷贝
         * @obj 源对象
         */
        public static deepCopy(obj: any):any {
            var newObj;
            if (typeof obj == "object") {
                if (obj === null) {
                    newObj = null;
                }
                else if (obj == undefined) {
                    newObj = undefined;
                }
                else {
                    if (obj instanceof Array) {
                        newObj = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            newObj.push(CommonUtil.deepCopy(obj[i]));
                        }
                    } else {
                        newObj = {};
                        for (var k in obj) {
                            newObj[k] = CommonUtil.deepCopy(obj[k]);
                        }
                    }
                }
            } else {
                newObj = obj;
            }
            return newObj;
        }
    }
}