module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - HtmlTextParserUtil
     * @Description: 富文本转换工具类
     * @Create: HoyeLee on 2018/3/15 9:42
     * @Version: V1.0
     */

    /** 根据标签切割的字符串返回接口 */
    export interface IStrSplitByTagRet {
        strArr: string[];//根据标签tag切割后的字符串数组
        indexArr: number[];//标签包含内容所在切割后字符串数组的索引
        infoArr: string[][];//标签tag包含的信息
    }

    /** 富文本属性接口 */
    export interface IHtmlTextOptions {
        name: string;//json文件名
        textColor: number;//字体颜色
        textSize: number;//字体大小
        lineSpacing: number;//字体行距    
        width: number;//组宽度
        height: number;//组高度
        left: number;//左边距
        right: number;//右边距
    }

    /** 标签头内容 */
    export enum ETagInfo {
        type,// string;//类型
    }

    /** 标签 */
    export enum ETag {
        image,//图像
    }

    /** 图片牌堆分组 */
    export enum EImgCardType {
        Normal,//常规的
        Double,//对对胡
    }

    export class HtmlTextParserUtil {
        /**
         * 获取富文本可视化组
         * @param {any} params
         * @returns {eui.Group}
         */
        public static getHtmlTextGroup(params: any): eui.Group {
            let options = <IHtmlTextOptions>{};
            options.name = params.name || "";
            options.width = params.width || null;
            options.left = params.left || null;
            options.right = params.right || null;
            options.height = params.height || null;
            options.textColor = params.textColor || 0x000000;
            options.textSize = params.textSize || 25;
            options.lineSpacing = params.lineSpacing || 5;
            let jsonData = RES.getRes(options.name);
            //---这里可以修改
            let title = jsonData.title;
            let desc = jsonData.desc;
            if (!jsonData) return;
            //---这里应该只用得到desc的数据，获取image标签里的内容
            let s: IStrSplitByTagRet = <IStrSplitByTagRet>HtmlTextParserUtil.splStringByTag(desc, ETag[ETag.image]);
            // HtmlTextParserUtil.getTagInfo(desc, ETag[ETag.image]);
            let group = new eui.Group();
            if (options.width) group.width = options.width;
            if (options.height) group.height = options.height;

            if (!s.indexArr.length) {
                let lab = new eui.Label();
                lab.wordWrap = true;
                lab.width = options.width;
                if (options.left) lab.left = options.left;
                if (options.right) lab.right = options.right;
                lab.textColor = options.textColor;
                lab.lineSpacing = options.lineSpacing;
                lab.fontFamily = "SimHei";
                lab.size = options.textSize;
                lab.textFlow = new egret.HtmlTextParser().parser(desc);
                group.height = lab.height;
                group.addChild(lab);
                return group;
            }

            let indexArr = s.indexArr;
            let strArr = s.strArr;
            let infoArr = s.infoArr;
            let _h = 0;
            let _w = 0;
            let _gap = 10;
            let num = 0;
            for (let i = 0; i < strArr.length; i++) {
                let isImg = false;
                let infoIndex = 0;
                for (let j = 0; j < indexArr.length; j++) {
                    if (i == indexArr[j]) {
                        isImg = true;
                        infoIndex = j;
                        break;
                    }
                }
                if (!isImg) {//文本
                    let lab = new eui.Label();
                    lab.wordWrap = true;
                    if (options.left) lab.left = options.left;
                    if (options.right) lab.right = options.right;
                    lab.width = options.width;
                    lab.textColor = options.textColor;
                    lab.size = options.textSize;
                    lab.lineSpacing = options.lineSpacing;
                    lab.fontFamily = "SimHei";
                    lab.y = _h;
                    lab.textFlow = new egret.HtmlTextParser().parser(strArr[i]);
                    group.addChild(lab);
                    _h += lab.height + _gap * 2;
                } else {//图片
                    let lab = new eui.Label();
                    lab.text = "" + (num + 1);
                    lab.textColor = options.textColor;
                    lab.size = options.textSize;
                    lab.y = _h + _gap * 2;
                    let type;
                    if (infoArr[infoIndex] && infoArr[infoIndex][0] && infoArr[infoIndex][0] != "") {
                        for (let i of infoArr[infoIndex]) {
                            let _arr = HtmlTextParserUtil.splStringBySeparetor(i, "=");
                            if (_arr[0] == ETagInfo[ETagInfo.type]) {
                                type = EImgCardType[_arr[1]];
                                break;
                            }
                        }
                    }
                    // let type = (num == 4) ? ECardType.Double : ECardType.Normal;
                    let imgs = HtmlTextParserUtil.getImgFromHtmlText(strArr[i])
                    let img_group = HtmlTextParserUtil.addImgsByRule(type, imgs);
                    img_group.y = _h;
                    img_group.x = 30;
                    group.addChild(lab);
                    group.addChild(img_group);
                    _h += img_group.height + _gap;
                    num++;
                }
            }
            return group;
        }

        public static addImgsByRule(type: EImgCardType, imgs?: eui.Image[]): eui.Group {
            let rule: number[] = [];
            switch (type) {
                case EImgCardType.Normal:
                    rule = [2, 3, 3, 3, 3];
                    break;
                case EImgCardType.Double:
                    rule = [2, 2, 2, 2, 2, 2, 2];
                    break;
                default:
                    rule = [14];
                    break;
            }
            let _imgs = [];
            _imgs.length = rule.length;
            for (let i = 0; i < rule.length; i++) {
                let arr = []
                for (let j = 0; j < rule[i]; j++) {
                    arr.push(imgs.shift());
                }
                _imgs[i] = arr;
            }
            let width = 766;
            let _w = 0;
            let _h = 0;
            let scaleX = 0.6;
            let scaleY = 0.6;
            let _gap = 10;
            let group = new eui.Group();
            _imgs.forEach(item => {
                if (!item) return;
                item.forEach(img => {
                    if (!img) return;
                    img.x = _w;
                    img.scaleX = scaleX;
                    img.scaleY = scaleY;
                    group.addChild(img);
                    _h = img.height * scaleY;
                    _w += img.width * scaleX;
                });
                _w += _gap;
            });
            group.height = _h;
            return group;
        }

        public static getImgFromHtmlText(imageName: string): eui.Image[] {
            let arr_image = HtmlTextParserUtil.splStringBySeparetor(imageName, "|");
            let arr_img = [];
            for (let k = 0; k < arr_image.length; k++) {
                if (!RES.hasRes(arr_image[k])) continue;//表示RES里面没有该名字的资源
                let data = RES.getRes(arr_image[k]);
                let img: eui.Image = new eui.Image(data);
                img.width = data.textureWidth;
                img.height = data.textureHeight;
                arr_img.push(img);
            }
            return arr_img;
        }


        /**
         * 根据分隔符切割字符串
         * @param {string} str //字符串
         * @param {string} separetor //分隔符
         * @returns {string[]}
         */
        public static splStringBySeparetor(str: string, separetor: string): string[] {
            let arr = str.split(separetor);
            arr.filter(x => {
                return x !== "";
            })
            return arr;
        }

        /**
         * 获取标签头包含信息
         */
        public static getTagInfo(str: string, tag: string, strArr, indexArr, infoArr) {//string<Tag Info:1>include
            if (!str || str == "") return;
            let _reg_s = "<" + tag + " ";//标签头
            let _reg_e = ">";//标签尾
            if (!str.match(_reg_s)) {
                if (!str || str != "") {
                    strArr.push(str);
                }
                return;
            }
            let _arr_s = str.split(_reg_s, 2);//0:string  1: Info:1>include
            let str_s = _arr_s[0];//string
            let _arr_e = _arr_s[1].split(_reg_e, 2);//include
            let str_info = _arr_e[0];//Info:1
            let info = HtmlTextParserUtil.splStringBySeparetor(str_info, " ");//[Info:1]
            let str_include = _arr_e[1];
            if (str_s != "") strArr.push(str_s);
            strArr.push(str_include);
            let index = strArr.length - 1;
            indexArr.push(index);
            infoArr.push(info);
        }

        /**
         *根据Tag切割字符串，并获取标签头包含的信息
         * @param {string} str //文本
         * @param {string} tag //标签 default: image
         * @returns {any}
         */
        public static splStringByTag(str: string, tag: string): any {
            let _reg_s = "<" + tag + " ";//标签头
            let _reg_e = "</" + tag + ">";//标签尾
            if (!str.indexOf(_reg_e)) return;
            // let arr = str.split(_reg_s);
            let arr = str.split(_reg_e);
            // let arr;
            let arr_s = [];
            let arr_index = [];//标签包含内容所在索引
            let arr_info = [];
            let index = 0;
            arr.forEach((x) => {
                HtmlTextParserUtil.getTagInfo(x, tag, arr_s, arr_index, arr_info);
            });
            // arr.forEach((x) => {
            //     if (x.match(_reg_e)) {
            //         // arr_index.push(index);
            //         let s = x.split(_reg_e);
            //         arr_s.push(s[0]);
            //         if (s[1] !== "") {
            //             arr_s.push(s[1]);
            //             index = arr_s.length - 2;
            //         } else {
            //             index = arr_s.length - 1;
            //         }
            //         arr_index.push(index);
            //     } else {
            //         arr_s.push(x);
            //     }
            // });
            let s = <IStrSplitByTagRet>{};
            s.strArr = arr_s;
            s.indexArr = arr_index;
            s.infoArr = arr_info;
            return s;
        }
    }
}