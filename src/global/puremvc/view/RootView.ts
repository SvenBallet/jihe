/**
 * 
 * @Name:  FL - RootView
 * @Description:  跟界面，自动管理各种界面的添加和删除
 * @Create: DerekWu on 2016/4/8 15:49
 * @Version: V1.0
 */
module FL {
    export class RootView {

        /** 单例 */
        private static _onlyOne: RootView;

        /** 根显示层级 */
        private readonly _root: eui.UILayer;
        /** 子层级Map */
        private readonly _subLayerMap: { [key: number]: eui.UILayer } = {};
        /** 遮罩矩形 */
        // private _shadeRect:eui.Rect;
        private _shadeRect: eui.Image;

        private constructor(root: eui.UILayer) {
            this._root = root;
            for (let index: number = ViewLayerEnum.BOTTOM_BOTTOM_ONLY; index <= ViewLayerEnum.TOOLTIP_TOP; ++index) {
                let vOneLayer = new eui.UILayer();
                vOneLayer.touchEnabled = false;
                this._subLayerMap[index] = vOneLayer;
            }
            // this.intShadeRect();
        }

        /**
         * 初始化遮罩矩形
         */
        private getShade(): eui.Image {
            if (!this._shadeRect) {
                // let vOneShadeRect:eui.Rect = new eui.Rect();
                // vOneShadeRect.touchEnabled = true;
                // vOneShadeRect.percentWidth = 100;
                // vOneShadeRect.percentHeight = 100;
                // vOneShadeRect.fillColor = 0x000000;
                // vOneShadeRect.fillAlpha = 0.05;
                let vOneShadeRect: eui.Image = new eui.Image();
                vOneShadeRect.source = GConf.Conf.popupShadeRes;
                vOneShadeRect.touchEnabled = true;
                vOneShadeRect.top = vOneShadeRect.bottom = vOneShadeRect.left = vOneShadeRect.right = -50;
                // vOneShadeRect.percentWidth = 100;
                // vOneShadeRect.percentHeight = 100;
                vOneShadeRect.alpha = 0.05;
                vOneShadeRect["viewLayer"] = ViewLayerEnum.POPUP;
                // vOneShadeRect["addTween"] = [{data:[{fillAlpha:0.05}, {fillAlpha:0.33}, 400, Game.Ease.cubicOut]}];
                // vOneShadeRect["delTween"] = [{data:[{fillAlpha:0.05}, 100, Game.Ease.cubicIn]}];
                vOneShadeRect["addTween"] = [{ data: [{ alpha: 0.05 }, { alpha: 0.7 }, 400, Game.Ease.cubicOut] }];
                vOneShadeRect["delTween"] = [{ data: [{ alpha: 0.05 }, 100, Game.Ease.cubicIn] }];
                this._shadeRect = vOneShadeRect;
            }
            return this._shadeRect;
        }

        private getNewShade(size: number) {
            let vOneShadeRect: eui.Image = new eui.Image();
            vOneShadeRect.source = GConf.Conf.popupShadeRes;
            vOneShadeRect.touchEnabled = true;
            vOneShadeRect.top = vOneShadeRect.bottom = vOneShadeRect.left = vOneShadeRect.right = size;
            // vOneShadeRect.percentWidth = 100;
            // vOneShadeRect.percentHeight = 100;
            vOneShadeRect.alpha = 0.05;
            vOneShadeRect["viewLayer"] = ViewLayerEnum.POPUP;
            // vOneShadeRect["addTween"] = [{data:[{fillAlpha:0.05}, {fillAlpha:0.33}, 400, Game.Ease.cubicOut]}];
            // vOneShadeRect["delTween"] = [{data:[{fillAlpha:0.05}, 100, Game.Ease.cubicIn]}];
            vOneShadeRect["addTween"] = [{ data: [{ alpha: 0.05 }, { alpha: 0.7 }, 400, Game.Ease.cubicOut] }];
            vOneShadeRect["delTween"] = [{ data: [{ alpha: 0.05 }, 100, Game.Ease.cubicIn] }];
            return vOneShadeRect;
        }

        public static getInstance(root: eui.UILayer): RootView {
            if (!this._onlyOne) {
                this._onlyOne = new RootView(root);
            }
            return this._onlyOne;
        }

        /**
         * 添加显示对象
         * @param pDisplayObject
         */
        public fl_addElement(element: egret.DisplayObject): void {
            //标记为新增，0=新增标记 1=删除标记
            //element["flViewStat"] = 0;
            //console.log("------------------------------");
            let viewLayer: ViewLayerEnum = element[ViewEnum.viewLayer];
            if (!viewLayer) {
                console.error("# fl_addElement ViewLayerEnum is null");
                return;
            }
            if (viewLayer >= ViewLayerEnum.BOTTOM_BOTTOM_ONLY && viewLayer <= ViewLayerEnum.TOOLTIP_TOP) {
                //如果有添加音乐，则在添加界面的时候播放
                let addMusic: string = element[ViewEnum.addMusic];
                this.playMusicEffect(addMusic);
                if (viewLayer != ViewLayerEnum.TOOLTIP_TOP) {
                    // let elementTween:egret.Tween = egret.Tween.get(element);
                    let addTween = element[ViewEnum.addTween];
                    let laterTimes = element[ViewEnum.laterTimes];
                    if (addTween) {
                        let vIndex: number = 0, vLength: number = addTween.length, vOneTweenData, vOneTweenObj: Game.Tween, vExeObj, vOneTarget, vOneTweenDataData;
                        for (; vIndex < vLength; ++vIndex) {
                            vOneTweenData = addTween[vIndex];
                            vOneTarget = vOneTweenData.target;
                            if (!vOneTarget) {
                                Game.Tween.removeTweens(element);
                                vOneTweenObj = Game.Tween.get(element);
                                vExeObj = element;
                            } else if (element[vOneTarget]) {
                                vExeObj = element[vOneTarget];
                                Game.Tween.removeTweens(vExeObj);
                                vOneTweenObj = Game.Tween.get(vExeObj);
                            } else {
                                continue;
                            }
                            //设置不可见
                            vExeObj.visible = false;
                            //是否有字典属性
                            if (vOneTweenData.tweenDict) {
                                vOneTweenDataData = TweenDict.getTween(vOneTweenData.tweenDict);
                            } else {
                                vOneTweenDataData = vOneTweenData.data;
                            }
                            //初始化属性
                            let beginAttrObj = vOneTweenDataData[0];
                            for (let beginAttr in beginAttrObj) {
                                vExeObj[beginAttr] = beginAttrObj[beginAttr];
                            }
                            //执行缓动
                            // if (addTween[4] != undefined) { //是否有延迟缓动
                            //     vOneTweenObj.wait(laterTimes+addTween[4]).call(this.fl_addElementLater, this, [vExeObj]).to(addTween[1], addTween[2], addTween[3]);
                            //     //elementTween.call(this.fl_addElementLater, this, [element]).to(addTween[1], addTween[2], addTween[3]);
                            // } else if (laterTimes > 0) {
                            //     vOneTweenObj.wait(laterTimes).call(this.fl_addElementLater, this, [vExeObj]).to(addTween[1], addTween[2], addTween[3]);
                            //     //elementTween.call(this.fl_addElementLater, this, [element]).to(addTween[1], addTween[2], addTween[3]);
                            // } else {
                            //     vOneTweenObj.call(this.fl_addElementLater, this, [vExeObj]).to(addTween[1], addTween[2], addTween[3]);
                            // }
                            if (vOneTweenDataData[4]) { //是否有延迟缓动
                                vOneTweenObj.wait(laterTimes + vOneTweenDataData[4]).call(this.fl_addElementLater, this, [vExeObj]).to(vOneTweenDataData[1], vOneTweenDataData[2], vOneTweenDataData[3]);
                                //elementTween.call(this.fl_addElementLater, this, [element]).to(addTween[1], addTween[2], addTween[3]);
                            } else if (laterTimes > 0) {
                                vOneTweenObj.wait(laterTimes).call(this.fl_addElementLater, this, [vExeObj]).to(vOneTweenDataData[1], vOneTweenDataData[2], vOneTweenDataData[3]);
                                //elementTween.call(this.fl_addElementLater, this, [element]).to(addTween[1], addTween[2], addTween[3]);
                            } else {
                                vOneTweenObj.call(this.fl_addElementLater, this, [vExeObj]).to(vOneTweenDataData[1], vOneTweenDataData[2], vOneTweenDataData[3]);
                            }
                        }
                    } else {
                        if (laterTimes && laterTimes > 0) {
                            Game.Tween.removeTweens(element);
                            element.visible = false;
                            let elementTween = Game.Tween.get(element);
                            elementTween.wait(laterTimes).call(this.fl_addElementLater, this, [element]);
                            //elementTween.call(this.fl_addElementLater, this, [element]).to(addTween[1], addTween[2], addTween[3]);
                        }
                    }
                }
                this.my_addElement(element);
            } else {
                console.error("### viewLayer is not ");
            }
        }

        private my_addElement(element: egret.DisplayObject): void {
            // if (FL.Config.isTrue(FL.ConfigEnum.DEV_MODE)) {
            //     console.log("----addView Name="+egret.getQualifiedClassName(element));
            // }
            let viewLayer: ViewLayerEnum = element[ViewEnum.viewLayer];
            switch (viewLayer) {
                case ViewLayerEnum.BOTTOM_BOTTOM_ONLY: {
                    this.addOnlyToLayer(element, ViewLayerEnum.BOTTOM_BOTTOM_ONLY, ViewLayerEnum.BOTTOM_BOTTOM_ONLY);
                    break;
                }
                case ViewLayerEnum.BOTTOM_ONLY: {
                    this.addOnlyToLayer(element, ViewLayerEnum.BOTTOM_ONLY, ViewLayerEnum.BOTTOM_ONLY, ViewLayerEnum.BOTTOM, ViewLayerEnum.POPUP_SHADE, ViewLayerEnum.CENTER, ViewLayerEnum.POPUP_ONLY, ViewLayerEnum.POPUP, ViewLayerEnum.TOOLTIP_BOTTOM, ViewLayerEnum.TOOLTIP_CENTER);
                    break;
                }
                case ViewLayerEnum.POPUP_ONLY: {
                    this.addOnlyToLayer(element, ViewLayerEnum.POPUP_ONLY, ViewLayerEnum.POPUP_ONLY, ViewLayerEnum.POPUP);
                    break;
                }
                case ViewLayerEnum.BOTTOM_CENTER:
                case ViewLayerEnum.BOTTOM:
                case ViewLayerEnum.POPUP_SHADE:
                case ViewLayerEnum.CENTER:
                case ViewLayerEnum.POPUP:
                case ViewLayerEnum.TOOLTIP_BOTTOM:
                case ViewLayerEnum.TOOLTIP_CENTER:
                case ViewLayerEnum.TOOLTIP_TOP:
                    {
                        this.addToLayer(element, viewLayer);
                        break;
                    }
            }
            this.checkShadeRect(element, true);

        }

        /**
         * 添加低层的only类界面,先添加，再删除
         * @param currLayer 当前界面所在层级
         * @param removeLayers  删除的层级数组
         */
        private addOnlyToLayer(element: egret.DisplayObject, currLayer: ViewLayerEnum, ...removeLayers: ViewLayerEnum[]): void {
            //先添加
            this.addToLayer(element, currLayer);
            //再循环层级删除
            for (let vIndex: number = 0, vLength: number = removeLayers.length; vIndex < vLength; ++vIndex) {
                let vOneViewLayer: ViewLayerEnum = removeLayers[vIndex];
                let vCurrUILayer: eui.UILayer = this._subLayerMap[vOneViewLayer];
                for (let vNumChildren: number = vCurrUILayer.numChildren - 1; vNumChildren >= 0; --vNumChildren) {
                    let vOneChild: egret.DisplayObject = vCurrUILayer.getChildAt(vNumChildren);
                    if (element != vOneChild) {
                        this.fl_removeElement(vOneChild);
                    } else {
                        continue;
                    }
                }
            }
        }

        /**
         * 添加到层级
         * @param element
         * @param viewLayerEnum
         */
        private addToLayer(element: egret.DisplayObject, viewLayerEnum: ViewLayerEnum): void {
            //排除删除层级界面
            if (element instanceof DelLayerView) {
                return;
            }
            let self = this, vCurrUILayer: eui.UILayer = self._subLayerMap[viewLayerEnum];
            let vBeforeAddNum: number = vCurrUILayer.numChildren;
            if (vBeforeAddNum === 0) {
                //先将空的层级添加到根容器
                let vAddIndex: number;
                for (let vViewLayerIndex: number = viewLayerEnum; vViewLayerIndex <= ViewLayerEnum.TOOLTIP_TOP; ++vViewLayerIndex) {
                    let vOneUILayer: eui.UILayer = self._subLayerMap[vViewLayerIndex];
                    if (vOneUILayer.numChildren > 0) {
                        vAddIndex = this._root.getChildIndex(vOneUILayer);
                        break;
                    }
                }
                if (vAddIndex != undefined) {
                    //添加到当前位置
                    self._root.addChildAt(vCurrUILayer, vAddIndex);
                } else {
                    //添加到最后
                    self._root.addChild(vCurrUILayer);
                }
            }
            vCurrUILayer.addChild(element);

            if (!element[ViewEnum.isHandleAddedLogic]) {
                let vAddViewCallBack: Function = element[ViewEnum.onAddView];
                if (vAddViewCallBack) {
                    vAddViewCallBack.call(element);
                }
                // egret.log("------vAddViewCallBack");
            }

            // if (viewLayerEnum >= ViewLayerEnum.POPUP_ONLY && viewLayerEnum <= ViewLayerEnum.POPUP) {
            // }
        }


        /**
         * 删除元素
         * @param element {DisplayObject}
         */
        public fl_removeElement(element: egret.DisplayObject): void {
            //删除后禁止触摸
            // element.touchEnabled = false;
            // if (element instanceof egret.DisplayObjectContainer) {
            //     element.touchChildren = false
            // }
            //console.log("--0--fl_removeElement");
            let vViewLayer: ViewLayerEnum = element[ViewEnum.viewLayer];
            if (!vViewLayer) {
                console.error("# fl_removeElement ViewLayerEnum is null");
                return;
            }
            let vCurrUILayer: eui.UILayer = this._subLayerMap[vViewLayer];
            if (vCurrUILayer.getChildIndex(element) === -1) {
                if (element.parent) {
                    console.log(element);
                    console.error("# 移除界面失败，element 添加到了错误的界面");
                }
                //没有则返回
                return;
            }
            this.checkShadeRect(element, false);
            //console.log("--1--element[flViewStat]="+element["flViewStat"]);
            //如果已经标记为移除，则不处理
            //if (element["flViewStat"]==1) {
            //    return undefined;
            //}
            //标记为已经移除，0=新增标记 1=删除标记
            //element["flViewStat"] = 1;
            //console.log("--2--element[flViewStat]="+element["flViewStat"]);

            //如果有删除音乐，则在移除界面的时候删除
            let removeMusic: string = element[ViewEnum.delMusic];
            this.playMusicEffect(removeMusic);

            // // 添加缓动移除
            // let addTween = element[ViewEnum.addTween];
            // let laterTimes = element[ViewEnum.laterTimes];
            // if (addTween) {
            //     let vIndex: number = 0, vLength: number = addTween.length, vOneTweenData, vOneTweenObj: Game.Tween, vExeObj, vOneTarget, vOneTweenDataData;
            //     for (; vIndex < vLength; ++vIndex) {
            //         vOneTweenData = addTween[vIndex];
            //         vOneTarget = vOneTweenData.target;
            //         if (!vOneTarget) {
            //             Game.Tween.removeTweens(element);
            //             // vOneTweenObj = Game.Tween.get(element);
            //             // vExeObj = element;
            //         } else if (element[vOneTarget]) {
            //             vExeObj = element[vOneTarget];
            //             Game.Tween.removeTweens(vExeObj);
            //             // vOneTweenObj = Game.Tween.get(vExeObj);
            //         } else {
            //             continue;
            //         }
            //     }
            // } else {
            //     if (laterTimes && laterTimes > 0) {
            //         // element.visible = false;
            //         Game.Tween.removeTweens(element);
            //         // let elementTween = Game.Tween.get(element);
            //         // elementTween.wait(laterTimes).call(this.fl_addElementLater, this, [element]);
            //         //elementTween.call(this.fl_addElementLater, this, [element]).to(addTween[1], addTween[2], addTween[3]);
            //     }
            // }

            //如果有移除缓动
            let removeTween: [{}] = element[ViewEnum.delTween];
            //console.log("--3--fl_removeElement");
            if (removeTween) {
                //console.log("--4--fl_removeElement");
                let vIndex: number = 0, vLength: number = removeTween.length, vOneTweenData, vOneTweenObj: Game.Tween, vOneTarget, vOneTweenDataData, vExeObj;
                //设置等待缓动删除数量，没删除一次，数量减一，直到减为零则正是删除
                element["WAIT_T_O_COUNT"] = vLength;
                for (; vIndex < vLength; ++vIndex) {
                    vOneTweenData = removeTween[vIndex];
                    vOneTarget = vOneTweenData.target;
                    if (!vOneTarget) {
                        Game.Tween.removeTweens(element);
                        vOneTweenObj = Game.Tween.get(element);
                    } else if (element[vOneTarget]) {
                        vExeObj = element[vOneTarget];
                        Game.Tween.removeTweens(vExeObj);
                        vOneTweenObj = Game.Tween.get(vExeObj);
                    } else {
                        element["WAIT_T_O_COUNT"]--;
                        continue;
                    }
                    //是否有字典属性
                    if (vOneTweenData.tweenDict) {
                        vOneTweenDataData = TweenDict.getTween(vOneTweenData.tweenDict);
                    } else {
                        vOneTweenDataData = vOneTweenData.data;
                    }
                    if (vOneTweenDataData[3]) {  //是否有延迟缓动
                        vOneTweenObj.wait(vOneTweenDataData[3]).to(vOneTweenDataData[0], vOneTweenDataData[1], vOneTweenDataData[2]).call(this.my_removeElement, this, [element]);
                    } else {
                        //console.log("--6--fl_removeElement");
                        //console.log("--7--fl_removeElement removeTween[0]="+removeTween[0]+"  removeTween[1]="+removeTween[0]+ " removeTween[2]="+removeTween[2]+" removeTween[3]="+removeTween[3]);
                        vOneTweenObj.to(vOneTweenDataData[0], vOneTweenDataData[1], vOneTweenDataData[2]).call(this.my_removeElement, this, [element]);
                        //console.log("--8--fl_removeElement");
                    }
                }
            } else {
                // this.playMusicEffect(removeMusic);
                this.my_removeElement(element);
            }
        }

        /**
         * 真正的删除
         * @param element
         */
        private my_removeElement(element: egret.DisplayObject): void {
            //看一下是否有等待缓动结束数量
            if (element["WAIT_T_O_COUNT"]) {
                element["WAIT_T_O_COUNT"]--;
                if (element["WAIT_T_O_COUNT"] > 0) {
                    return; //还有缓动没有执行完毕，跳出
                }
            }
            let vViewLayer: ViewLayerEnum = element[ViewEnum.viewLayer];
            let vCurrUILayer: eui.UILayer = this._subLayerMap[vViewLayer];
            let vChildIndex: number = vCurrUILayer.getChildIndex(element);
            if (vChildIndex === -1) {
                //没有则返回
                return;
            }
            //删除
            vCurrUILayer.removeChildAt(vChildIndex);
            // if (vViewLayer >= ViewLayerEnum.POPUP_ONLY && vViewLayer <= ViewLayerEnum.POPUP) {
            // }
            //没有元素了则从跟节点删除所在层级
            if (vCurrUILayer.numChildren === 0) {
                let vCurrUILayerIndex = this._root.getChildIndex(vCurrUILayer);
                this._root.removeChildAt(vCurrUILayerIndex);
            }

            // 解除数据绑定
            if (!element[ViewEnum.isHandleRemovedLogic]) {
                BindManager.remAllAttrListener(element);
                let vRemViewCallBack: Function = element[ViewEnum.onRemView];
                if (vRemViewCallBack) {
                    vRemViewCallBack.call(element);
                }
                //处理调停者
                let mediatorName: string = element[ViewEnum.mediatorName];
                if (mediatorName) {
                    // console.log("removeMediator mediatorName="+mediatorName);
                    let vIMediator: puremvc.IMediator = AppFacade.getInstance().retrieveMediator(mediatorName);
                    //解除数据绑定
                    BindManager.remAllAttrListener(vIMediator);
                    //删除Mediator
                    MvcUtil.delMediator(mediatorName);
                }
                // egret.log("------vAddViewCallBack");
            }

        }

        /**
         * 添加元素的时候缓动，
         * @param element
         * @param elementTw
         */
        private fl_addElementLater(element: egret.DisplayObject): void {
            element.visible = true;
        }

        /**
         * 播放音效
         * @param source
         */
        private playMusicEffect(source: string): void {
            if (source) {
                SoundManager.playEffect(source);
            }
        }

        /**
         * 验证遮罩矩形，是否是添加，还是移除
         */
        private checkShadeRect(element, flag: boolean): void {
            let self = this;
            let vShade;
            if (!flag) {
                vShade = element['XaXX_POPUP_vShade_POPUP_XXaX'];
                if (vShade && vShade.parent) {
                    vShade.parent.removeChild(vShade);
                }
            } else {
                let viewLayerEnum = element[ViewEnum.viewLayer];
                if (viewLayerEnum >= ViewLayerEnum.POPUP_ONLY && viewLayerEnum <= ViewLayerEnum.POPUP) {
                    vShade = self.getNewShade(-1000);
                    Game.Tween.removeTweens(vShade);
                    vShade.alpha = 0.5;
                    element.addChildAt(vShade, 0);
                    element['XaXX_POPUP_vShade_POPUP_XXaX'] = vShade;
                    //给shade添加监听事件
                    vShade.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeShadeElement, self);
                }
            }

            // if (viewLayerEnum >= ViewLayerEnum.POPUP_ONLY && viewLayerEnum <= ViewLayerEnum.POPUP) {
            //     Game.Tween.removeTweens(vShade);
            //     vShade.alpha = 0.5;
            //     if (flag) {
            //         if (vParent) {
            //             vParent.removeChild(vShade);
            //         }
            //         let vLayer = self._subLayerMap[viewLayerEnum];
            //         vLayer.addChildAt(vShade, vLayer.numChildren - 1);
            //     } else {
            //         if (vParent) {
            //             vParent.removeChild(vShade);
            //         }
            //         // let vPopUpOnlyNumChildren: number = self._subLayerMap[ViewLayerEnum.POPUP_ONLY].numChildren;
            //         // let vPopUpNumChildren: number = self._subLayerMap[ViewLayerEnum.POPUP].numChildren;
            //         // if (vPopUpNumChildren === 0 && vPopUpOnlyNumChildren === 0) return;
            //         // if(vPopUpNumChildren){
            //         //     let vLayer =  self._subLayerMap[ViewLayerEnum.POPUP_ONLY];
            //         //     vLayer.addChildAt(vShade, vLayer.numChildren-1);
            //         // }
            //     }
            // } else {
            //     switch (viewLayerEnum) {
            //         case ViewLayerEnum.BOTTOM_BOTTOM_ONLY:
            //             if (vParent) {
            //                 vParent.removeChild(vShade);
            //             }
            //             return;
            //         case ViewLayerEnum.BOTTOM_ONLY:
            //             if (vParent) {
            //                 vParent.removeChild(vShade);
            //             }
            //             return;
            //     }
            // }

            //     switch (viewLayerEnum) {
            //         case ViewLayerEnum.BOTTOM_CENTER: return;
            //         case ViewLayerEnum.BOTTOM: return;
            //         case ViewLayerEnum.CENTER: return;
            //         case ViewLayerEnum.TOOLTIP_BOTTOM: return;
            //         case ViewLayerEnum.TOOLTIP_CENTER: return;
            //         case ViewLayerEnum.TOOLTIP_TOP: return;
            //         case ViewLayerEnum.BOTTOM_BOTTOM_ONLY:
            //             if (vParent) {
            //                 vParent.removeChild(vShade);
            //             }
            //             return;
            //         case ViewLayerEnum.BOTTOM_ONLY:
            //             if (vParent) {
            //                 vParent.removeChild(vShade);
            //             }
            //             return;
            //         case ViewLayerEnum.POPUP:
            //             break;
            //         case ViewLayerEnum.POPUP_ONLY:
            //             if (vParent && vParent == self._subLayerMap[ViewLayerEnum.POPUP_ONLY]) {
            //                 vParent.removeChild(vShade);
            //                 return;
            //             }
            //             // if (vParent) {
            //             //     vParent.removeChild(vShade);
            //             // }
            //             // let vPopUpOnlyNumChildren: number = self._subLayerMap[ViewLayerEnum.POPUP_ONLY].numChildren;
            //             // if (vPopUpOnlyNumChildren > 1) {
            //             //     return;
            //             // }
            //             break;
            //         case ViewLayerEnum.POPUP_SHADE:
            //             break;
            //     }
            //     let _vParent = vShade.parent;
            //     if (_vParent) {
            //         _vParent.removeChild(vShade);
            //     }
            //     Game.Tween.removeTweens(self.getShade());
            //     self.getShade().alpha = 0.5;
            //     if (flag) {
            //         let vLayer: eui.UILayer = self._subLayerMap[viewLayerEnum];
            //         vLayer.addChildAt(vShade, vLayer.numChildren - 1);
            //     } else {
            //         let vPopUpOnlyNumChildren: number = self._subLayerMap[ViewLayerEnum.POPUP_ONLY].numChildren;
            //         let vPopUpNumChildren: number = self._subLayerMap[ViewLayerEnum.POPUP].numChildren;
            //         if (vPopUpOnlyNumChildren === 0 && vPopUpNumChildren === 0) return;
            //         if (vPopUpNumChildren) {
            //             let vLayer: eui.UILayer = self._subLayerMap[ViewLayerEnum.POPUP];
            //             vLayer.addChildAt(vShade, vLayer.numChildren - 1);
            //         } else if (vPopUpOnlyNumChildren) {
            //             let vLayer: eui.UILayer = self._subLayerMap[ViewLayerEnum.POPUP_ONLY];
            //             vLayer.addChildAt(vShade, vLayer.numChildren - 1);
            //         }
            //     }
        }

        /** 关闭被遮罩的层级 */
        private closeShadeElement(e: egret.TouchEvent) {
            let parent = e.currentTarget.parent;
            //被遮罩的层级是否存在，并且是否其flag_shadeClick属性是否开启
            if (parent && parent.flag_shadeClick) MvcUtil.delView(parent);
        }
    }

}