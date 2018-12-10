module FL {
    /**
     * 
     * @Name:   - TweenDict
     * @Description:  //TweenDict 缓动字段
     * @Create: DerekWu on 2017/7/8 17:59
     * @Version: V1.0
     */
    export class TweenDict {

        private static readonly _tweenDict:{[key:string]:[{}]} = {};

        public static regTween(name:string, data:[{}]):void {
            if (!this._tweenDict[name]) {
                this._tweenDict[name] = data;
            } else {
                throw new Error("### regTween name="+name + " is exists");
            }
        }

        public static getTween(name:string,):[{}] {
            return this._tweenDict[name];
        }

        public static init():void {
            let self = this;
            // self.regTween("alphaAdd", [{alpha:0.05}, {alpha:1}, 400, Game.Ease.cubicOut]);
            // self.regTween("alphaReduce", [{alpha:0.05}, 400, Game.Ease.cubicIn]);
            self.regTween("alphaAdd", [{alpha:0.0}, {alpha:1.0}, 400]);
            self.regTween("alphaReduce", [{alpha:0.0}, 200]);
            self.regTween("openPopup", [{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]);
        }

    }
}