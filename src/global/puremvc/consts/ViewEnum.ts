/**
 * 
 * @Name:  FL - ViewEnum
 * @Description:  界面枚举，清查看 BaseView
 * @Create: DerekWu on 2015/6/9 14:51
 * @Version: V1.0
 * @see FL.BaseView
 */
module FL {
    export class ViewEnum {

        public static readonly mediatorName:string = "mediatorName";
        public static readonly viewLayer:string = "viewLayer";

        public static readonly laterTimes:string = "laterTimes";
        public static readonly addTween:string = "addTween";
        public static readonly delTween:string = "delTween";
        public static readonly addMusic:string = "addMusic";
        public static readonly delMusic:string = "delMusic";
        // public static readonly modalColor:string = "modalColor";
        // public static readonly modalAlpha:string = "modalAlpha";

        public static readonly onAddView:string = "onAddView";
        public static readonly onRemView:string = "onRemView";

        public static readonly isHandleAddedLogic = "isHandleAddedLogic";
        public static readonly isHandleRemovedLogic = "isHandleRemovedLogic";

    }
}