/**
 * 
 * @Name:  FL - ViewLayerEnum
 * @Description:  为简化开发流程，归总界面层级枚举，后续还可以拓展类型，需要修改框架内部
 * @Create: DerekWu on 2015/6/7 19:19
 * @Version: V1.0
 */
module FL {
    export enum ViewLayerEnum {
        BOTTOM_BOTTOM_ONLY = 1,        //最底层界面所在层（通常是背景界面），同时只存在一个，在添加到舞台的时候会清除BOTTOM_BOTTOM_ONLY 层中的所有元素
        BOTTOM_CENTER,             //底层中间层，后来添加的在该层最上面
        BOTTOM_ONLY,                //底层界面所在层，同时只存在一个，底层窗口在初始化的时候会清除所有在BOTTOM_ONLY--TOOLTIP_CENTER之间的所有层中的所有元素
        BOTTOM,                      //底层界面所在层，后来添加的在该层最上面
        POPUP_SHADE,                //弹窗遮罩，只有一个元素，就是遮罩面板，面板被点击则移除自己 和 POPUP_ONLY POPUP 两层的界面
        CENTER,                     //中间内容，这部分是允许在遮罩上面，弹出窗口下面的层级
        POPUP_ONLY,                 //弹出层的底层界面类型所在层，但是是唯一的，该界面出现的时候，会清除所有 POPUP_ONLY POPUP 两层的界面
        POPUP,                       //弹出层的底层界面类型所在层，后来添加的在该层最上面
        TOOLTIP_BOTTOM,             //工具提示层，查看tips信息等
        TOOLTIP_CENTER,             //工具提示层，特殊提示层，如升级了特效，进入某个城市的提示，剧情等在这一层
        TOOLTIP_TOP                //工具提示层顶层，消息提示信息在这一层
        // CURSOR_BOTTOM,              //鼠标样式层底层，如果有永久显示固定位置的广告，广告放在这一层
        // CURSOR_CENTER,              //鼠标样式层中间层，连接中层级，还可以扩展其他
        // CURSOR_TOP                  //鼠标样式层，不做PC平台基本不用这个
    }
}