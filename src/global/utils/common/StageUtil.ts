module FL {
    export enum EOrientaion {
        portrait,//竖屏
        landscape//横屏
    }

    export class StageUtil {
        public static STAGE_ORIENTATION = EOrientaion.landscape;

        private static changedOrientation() {
            if (window.orientation == 90 || window.orientation == -90) {
                StageUtil.STAGE_ORIENTATION = EOrientaion.landscape;
            } else {
                StageUtil.STAGE_ORIENTATION = EOrientaion.portrait;
            }
        }

        public static init(stage: any) {
            this.changedOrientation();
            stage.addEventListener(egret.StageOrientationEvent.ORIENTATION_CHANGE, this.changedOrientation, this);
        }
    }
}