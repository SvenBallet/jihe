module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  GxnjyWeb - RedPointUtil
     * @Description:  //绘制红点工具类
     * @Create: HoyeLee on 2018/3/14 15:15
     * @Version: V1.0
     */
    export interface IRedPointOptions {
        x: number;//起点坐标X，相对于返回的Group
        y: number;//起点坐标Y，相对于返回的Group
        radius: number;//圆点半径
        color: number;//颜色 0xFFFFFF
        alpha: number;//透明度
        useLine: boolean;//是否添加线条样式
        lineTickness: number;//线条粗细
        lineColor: number;//线条颜色
        useText: boolean;//是否添加文字， 一般是数字
        text: string;//文本
        textSize: number;//文本大小
        textColor: number;//文本颜色        
    }

    /**
     * 参数default: <IRedPointOptions>{}
     */
    export class RedPointUtil {

        public static drawRedPoint(params: any): eui.Group {
            let options = <IRedPointOptions>{};
            options.x = params.x || 0;
            options.y = params.y || 0;
            options.alpha = params.alpha || 1;
            options.radius = params.radius || 1;
            options.color = params.color || 0xFC0C35;
            options.useLine = params.useLine || false;
            options.lineColor = params.lineColor || 0xFFFFFF;
            options.useText = params.useText || false;
            options.text = params.text || "";
            options.textSize = params.textSize || 1;
            options.textColor = params.textColor || 0xFFFFFF;
            let group = new eui.Group();
            let shape = new egret.Shape();
            group.addChild(shape);
            shape.graphics.beginFill(options.color, options.alpha);
            if (options.useLine) shape.graphics.lineStyle(options.lineTickness, options.lineColor);
            shape.graphics.drawCircle(options.x, options.y, options.radius);
            shape.graphics.endFill();

            if (options.useText) {
                let lab = new eui.Label();
                lab.text = options.text;
                lab.width = options.text.length * options.textSize;
                // lab.width = options.radius;
                lab.height = (options.textSize > options.radius) ? options.textSize : options.radius;
                lab.textAlign = egret.HorizontalAlign.CENTER;
                lab.verticalAlign = egret.VerticalAlign.MIDDLE;
                lab.textColor = options.textColor;
                lab.size = options.textSize;
                lab.x = options.x - lab.width / 2;
                lab.y = options.y - lab.height / 2;
                group.addChild(lab);
            }
            return group;
        }
    }
}