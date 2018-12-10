module FL {

    /**
     * 公共界面名字
     */
    export class CommonViewName { 
        // //主界面头像区域名字
        // public static readonly HeadView:string = "HeadView";
        // //其他玩家头像显示区域
        // public static readonly OtherPlayerHeadView:string = "OtherPlayerHeadView";
        // //主界面上部资源区域名字
        // public static readonly MainTopView:string = "MainTopView";
        // //主界面左部区域名字
        // public static readonly MainBaseLeftView:string = "MainBaseLeftView";
        // //测试界面
        // public static readonly MainBaseLeftTestView:string = "MainBaseLeftTestView";
        // //战利品，可获取资源界面
        // public static readonly GetResInfoView:string = "GetResInfoView";
        // //主界面右部区域名字
        // public static readonly MainBaseRightView:string = "MainBaseRightView";
        // //可攻击军队界面
        // public static readonly CanAttackArmyView:string = "CanAttackArmyView";

        // //攻击时上面中间的显示界面  攻击倒计时界面
        // public static readonly AttackTopMiddleView:string = "AttackTopMiddleView";
        // //攻击时上面右边的显示界面
        // public static readonly AttackTopRightView:string = "AttackTopRightView";
        // //攻击时的操作界面
        // public static readonly CombatHandleView:string = "CombatHandleView";
    }

    /**
     * 公共界面
     * @Name:  FL - CommonView
     * @Company 深圳市天天爱科技有限公司 版权所有
     * @Description:  无详细描述
     * @Create: DerekWu on 2017/10/16 13:28
     * @Version: V1.0
     */
    export class CommonView {

        /** 界面Map */
        private static _viewMap:{[viewName:string]:egret.DisplayObject} ={};

        public static getView(pViewName:string):egret.DisplayObject {
            return this._viewMap[pViewName];
        }

        public static register(pViewName:string, pView:egret.DisplayObject):void {
            if (this._viewMap[pViewName]) {
                egret.error("CommonView viewName "+pViewName+" is exists");
            } else {
                this._viewMap[pViewName] = pView;
            }
        }

    }

}