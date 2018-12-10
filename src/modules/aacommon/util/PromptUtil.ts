module FL {

    /**
     * 提示文字类型
     * "styles": {
        "pSucc": {
          "size": 36,
          "textColor": "0x00FF00",
          "strokeColor": "0x2E5A00"
        },
        "pField": {
          "size": 36,
          "textColor": "0xFF0000",
          "strokeColor": "0x670000"
        }
      }
     */
    export enum PromptType {
        SUCCESS, //成功消息
        ERROR, //异常消息
        ALERT  //警告消息
    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  GxnjyWeb - PromptUtil
     * @Description:  //提示工具类
     * @Create: DerekWu on 2017/8/10 20:05
     * @Version: V1.0
     */
    export class PromptUtil {

        /** 提示类型对应的属性信息Map */
        private static _promptTypeInfoMap:{[promptType:number]:{size:number, textColor:number, strokeColor:number}};

        /**
         * 初始化
         */
        private static init() {
            let vPromptTypeInfoMap:{[promptType:number]:{size:number, textColor:number, strokeColor:number}} = {};
            vPromptTypeInfoMap[PromptType.SUCCESS] = {size:36, textColor:0x00FF00, strokeColor:0x006700};
            vPromptTypeInfoMap[PromptType.ERROR] = {size:36, textColor:0xFF0000, strokeColor:0x670000};
            vPromptTypeInfoMap[PromptType.ALERT] = {size:36, textColor:0xFFFF00, strokeColor:0x676700};
            this._promptTypeInfoMap = vPromptTypeInfoMap;
        }

        /**
         * 显示提示信息
         * @param {string} text
         * @param {FL.PromptType} promptType
         */
        public static show(text:string, promptType:PromptType):void {
            if (!this._promptTypeInfoMap) {
                //初始化
                this.init();
            }
            let vMsgLabel:eui.Label = new eui.Label(text);
            vMsgLabel[ViewEnum.viewLayer] =  ViewLayerEnum.TOOLTIP_TOP; //提示信息层
            //vMsgLabel.verticalCenter = 0; //往上移动不能使用这个
            vMsgLabel.y = egret.MainContext.instance.stage.stageHeight/2-150;  //中间偏上一点
            // vMsgLabel.y = egret.MainContext.instance.stage.stageHeight-250;  //中间偏下一点
            vMsgLabel.horizontalCenter = 0, vMsgLabel.verticalAlign = egret.VerticalAlign.MIDDLE, vMsgLabel.textAlign = "center", vMsgLabel.fontFamily = "SimHei", vMsgLabel.stroke = 2, vMsgLabel.touchEnabled = false;
            let vPromptTypInfo = this._promptTypeInfoMap[promptType];
            vMsgLabel.size = vPromptTypInfo.size, vMsgLabel.textColor = vPromptTypInfo.textColor, vMsgLabel.strokeColor = vPromptTypInfo.strokeColor;
            MvcUtil.send(CommonModule.COMMON_SHOW_PROMPT, vMsgLabel);
        }

        // /**
        //  * 显示提示信息
        //  * @param text 信息内容
        //  * @param style 文字样式 风格 pSucc pField
        //  */
        // public static show(text:string, style:string):void {
        //     let vMsgLabel:eui.Label = new eui.Label(text);
        //     vMsgLabel[ViewEnum.viewLayer] =  ViewLayerEnum.TOOLTIP_TOP; //提示信息层
        //     //vMsgLabel.verticalCenter = 0; //往上移动不能使用这个
        //     vMsgLabel.y = egret.MainContext.instance.stage.stageHeight/2-150;  //中间偏上一点
        //     // vMsgLabel.y = egret.MainContext.instance.stage.stageHeight-250;  //中间偏下一点
        //     vMsgLabel.horizontalCenter = 0;
        //     vMsgLabel.verticalAlign = egret.VerticalAlign.MIDDLE;
        //     vMsgLabel.textAlign = "center";
        //     vMsgLabel.fontFamily = "SimHei";
        //     vMsgLabel.stroke = 2;
        //     vMsgLabel.touchEnabled = false;
        //     vMsgLabel.style = style;
        //     MvcUtil.send(CommonModule.COMMON_SHOW_PROMPT, vMsgLabel);
        // }

    }



}