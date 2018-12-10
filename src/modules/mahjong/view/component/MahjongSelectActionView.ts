module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongSelectActionView
     * @Description:  麻将开杠选择
     * @Create: ArielLiang on 2018/6/22 11:37
     * @Version: V1.0
     */
    export class MahjongSelectActionView extends BaseView {

        /** 单例 */
        private static _onlyOne: MahjongSelectActionView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        public tipLabel:eui.Label;
        /** 胡按钮旁显示的牌*/
        public showCard1:eui.Group;
        public showCard2:eui.Group;
        public huBtn:eui.Image;
        public score1:eui.Label;
        // public score2:eui.Label;

        /** 第一组吃碰杠听胡按钮*/
        public actionGroup1:eui.Group;
        public card1:eui.Image;
        public chiBtn1:eui.Image;
        public pengBtn1:eui.Image;
        public gangBtn1:eui.Image;
        public buBtn1:eui.Image;

        /** 第二组吃碰杠听胡按钮*/
        public actionGroup2:eui.Group;
        public card2:eui.Image;
        public chiBtn2:eui.Image;
        public pengBtn2:eui.Image;
        public gangBtn2:eui.Image;
        public buBtn2:eui.Image;

        public guoBtn:GameButton;

        // public popUpGroup:eui.Group;


        /** 吃等有多个选择时*/
        private actionSelectArray1:Array<MahjongActionResult> = new Array<MahjongActionResult>();
        private actionSelectArray2:Array<MahjongActionResult> = new Array<MahjongActionResult>();

        /** 吃牌和杠牌显示组，当吃牌有多个的时候，当杠牌有多个的时候，这个时候需要玩家做出选择，就弹出这个显示，里面最多包含3个 */
        private _selectChiGangGroup:eui.Group;

        /** 一个遮罩，用来屏蔽下面层级的所有操作 */
        // private _shadeGroup:eui.Group = new eui.Group();

        /** 数据 */
        private _chi1Action:MahjongActionResult[] = [];
        private _peng1Action:MahjongActionResult;
        private _gang1Action:MahjongActionResult;
        private _bu1Action:MahjongActionResult;
        private _chi2Action:MahjongActionResult[] = [];
        private _peng2Action:MahjongActionResult;
        private _gang2Action:MahjongActionResult;
        private _bu2Action:MahjongActionResult;
        // 胡牌动作
        private _huAction:MahjongActionResult;

        private constructor() {
            super();
            this.skinName = "skins.MahjongSelectActionViewSkin";
            this.horizontalCenter = this.verticalCenter = 0;
        }

        public static getInstance(): MahjongSelectActionView {
            if (!this._onlyOne) {
                this._onlyOne = new MahjongSelectActionView();
            }
            return this._onlyOne;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            // self.popUpGroup.horizontalCenter = 1;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.chiBtn1, self.chiBtn1);
            TouchTweenUtil.regTween(self.pengBtn1, self.pengBtn1);
            TouchTweenUtil.regTween(self.gangBtn1, self.gangBtn1);
            TouchTweenUtil.regTween(self.buBtn1, self.buBtn1);

            TouchTweenUtil.regTween(self.chiBtn2, self.chiBtn2);
            TouchTweenUtil.regTween(self.pengBtn2, self.pengBtn2);
            TouchTweenUtil.regTween(self.gangBtn2, self.gangBtn2);
            TouchTweenUtil.regTween(self.buBtn2, self.buBtn2);

            TouchTweenUtil.regTween(self.huBtn, self.huBtn);

            self.chiBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
            self.pengBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
            self.gangBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
            self.buBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);

            self.chiBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
            self.pengBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
            self.gangBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
            self.buBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);

            self.huBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);

            self.guoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.guoAction, self);
        }

        public resetView(msg:MahjongChangShaOpenSelectActionViewAfterGangMsgAck):void{
            let self = this;
            // 清空动作数据
            self._chi1Action = [];
            self._peng1Action = null;
            self._gang1Action = null;
            self._bu1Action = null;
            self._chi2Action = [];
            self._peng2Action = null;
            self._gang2Action = null;
            self._bu2Action = null;
            self._huAction = null;
            // 重设动作数据
            let vActionList:Array<MahjongActionResult> = msg.actionList;
            for (let vIndex:number = 0; vIndex < vActionList.length; ++vIndex) {
                let vMahjongActionResult:MahjongActionResult = vActionList[vIndex];
                let vAction: number = vMahjongActionResult.action;
                if (MahjongActionEnum.JIE_PAO === vAction) {
                    self._huAction = vMahjongActionResult;
                } else if (vMahjongActionResult.targetCard === msg.card1) {
                    if (MahjongActionEnum.CHI === vAction) {
                        self._chi1Action.push(vMahjongActionResult);
                    } else if (MahjongActionEnum.PENG === vAction) {
                        self._peng1Action = vMahjongActionResult;
                    } else if (MahjongActionEnum.CHANG_SHA_MING_GANG === vAction) {
                        self._gang1Action = vMahjongActionResult;
                    } else if (MahjongActionEnum.CHANG_SHA_MING_BU_ZHANG === vAction) {
                        self._bu1Action = vMahjongActionResult;
                    }
                } else if (vMahjongActionResult.targetCard === msg.card2) {
                    if (MahjongActionEnum.CHI === vAction) {
                        self._chi2Action.push(vMahjongActionResult);
                    } else if (MahjongActionEnum.PENG === vAction) {
                        self._peng2Action = vMahjongActionResult;
                    } else if (MahjongActionEnum.CHANG_SHA_MING_GANG === vAction) {
                        self._gang2Action = vMahjongActionResult;
                    } else if (MahjongActionEnum.CHANG_SHA_MING_BU_ZHANG === vAction) {
                        self._bu2Action = vMahjongActionResult;
                    }
                }
            }

            //显示提示消息
            let gangPlayerPZ:PZOrientation = MahjongHandler.getPZOrientation(msg.gangPlayerPos);
            let gangPlayerName:string = MahjongHandler.getGamePlayerInfo(gangPlayerPZ).playerName;
            self.tipLabel.text = "玩家【"+gangPlayerName+"】可开杠，如下所示：";

            //显示两张牌
            if (msg.card1) {
                self.actionGroup1.visible = true;
                let card1 = MahjongCardManager.getMahjongCommonCard(msg.card1, self.card1.width, self.card1.height);
                card1.x = self.card1.x;
                card1.y = self.card1.y;
                self.actionGroup1.addChild(card1);
                self.showCard1.visible = false;
            } else {
                self.actionGroup1.visible = false;
            }
            if(msg.card2){
                self.actionGroup2.visible = true;
                let card2 = MahjongCardManager.getMahjongCommonCard(msg.card2, self.card2.width, self.card2.height);
                card2.x = self.card2.x;
                card2.y = self.card2.y;
                self.actionGroup2.addChild(card2);
                self.showCard2.visible = false;
            }else {
                self.actionGroup2.visible = false;
            }

            // 胡牌按钮处的处理
            if (self._huAction) {
                self.huBtn.source = "btnCanHu_png";
                self.huBtn.touchEnabled = true;
                self.score1.visible = true;
                // 看一下胡几张牌，最多两张
                let vHuCard1:number = self._huAction.targetCard & 0xFF;
                let vHuCard2:number = (self._huAction.targetCard >> 8) & 0xFF;
                if (vHuCard1 > 0) {
                    self.showCard1.visible = true;
                    let card1 = MahjongCardManager.getMahjongCommonCard(vHuCard1, self.card1.width, self.card1.height);
                    self.showCard1.addChild(card1);
                } else {
                    self.showCard1.visible = false;
                }
                if (vHuCard2 > 0) {
                    // 胡两张
                    self.showCard2.visible = true;
                    let card2 = MahjongCardManager.getMahjongCommonCard(vHuCard1, self.card1.width, self.card1.height);
                    self.showCard2.addChild(card2);
                } else {
                    self.showCard2.visible = false;
                }
                // 设置分数
                if (vHuCard2 > 0) {
                    // 胡两张
                    self.score1.text = "共"+self._huAction.value + "分";
                } else {
                    self.score1.text = self._huAction.value + "分";
                }
            } else {
                self.huBtn.source = "btnHu_png";
                self.huBtn.touchEnabled = false;
                self.showCard1.visible = false;
                self.showCard2.visible = false;
                self.score1.visible = false;
            }

            // 按钮处理
            if (self._chi1Action.length > 0) {
                self.chiBtn1.source = "btnCanChi_png";
                self.chiBtn1.touchEnabled = true;
            } else {
                self.chiBtn1.source = "btnChi_png";
                self.chiBtn1.touchEnabled = false;
            }
            if (self._peng1Action) {
                self.pengBtn1.source = "btnCanPeng_png";
                self.pengBtn1.touchEnabled = true;
            } else {
                self.pengBtn1.source = "btnPeng_png";
                self.pengBtn1.touchEnabled = false;
            }
            if (self._gang1Action) {
                self.gangBtn1.source = "btnCanGang_png";
                self.gangBtn1.touchEnabled = true;
            } else {
                self.gangBtn1.source = "btnGang_png";
                self.gangBtn1.touchEnabled = false;
            }
            if (self._bu1Action) {
                self.buBtn1.source = "btnCanBu_png";
                self.buBtn1.touchEnabled = true;
            } else {
                self.buBtn1.source = "btnBu_png";
                self.buBtn1.touchEnabled = false;
            }

            if (self._chi2Action.length > 0) {
                self.chiBtn2.source = "btnCanChi_png";
                self.chiBtn2.touchEnabled = true;
            } else {
                self.chiBtn2.source = "btnChi_png";
                self.chiBtn2.touchEnabled = false;
            }
            if (self._peng2Action) {
                self.pengBtn2.source = "btnCanPeng_png";
                self.pengBtn2.touchEnabled = true;
            } else {
                self.pengBtn2.source = "btnPeng_png";
                self.pengBtn2.touchEnabled = false;
            }
            if (self._gang2Action) {
                self.gangBtn2.source = "btnCanGang_png";
                self.gangBtn2.touchEnabled = true;
            } else {
                self.gangBtn2.source = "btnGang_png";
                self.gangBtn2.touchEnabled = false;
            }
            if (self._bu2Action) {
                self.buBtn2.source = "btnCanBu_png";
                self.buBtn2.touchEnabled = true;
            } else {
                self.buBtn2.source = "btnBu_png";
                self.buBtn2.touchEnabled = false;
            }


            //点亮可操作的动作
            // let actionResultArray:Array<MahjongActionResult> = msg.actionList;
            // let vTempAction: number = -1;
            // let vTempCard: number = 0;
            // let vTempActionSubList: Array<MahjongActionResult>;
            // for (let i:number=0, iLength=actionResultArray.length; i<iLength; ++i) {
            //     let vOneAction: MahjongActionResult = actionResultArray[i];
            //     if (vOneAction.action !== vTempAction || (vOneAction.action == vTempAction && vOneAction.targetCard !== vTempCard)) {
            //         if (vTempActionSubList && vTempActionSubList.length > 0) {
            //             if(vOneAction.targetCard=== msg.card1){
            //                 self.setActionBtn(vOneAction,1,true);
            //             }else if(vOneAction.targetCard === msg.card2){
            //                 self.setActionBtn(vOneAction,2,true);
            //             }else {
            //                 return;
            //             }
            //         }
            //         vTempActionSubList = [];
            //         vTempAction = vOneAction.action;
            //         vTempCard = vOneAction.targetCard;
            //     }
            //     if(vOneAction.action == vTempAction && vOneAction.targetCard == vTempCard){
            //         if(vOneAction.targetCard=== msg.card1){
            //             self.actionSelectArray1.push(vOneAction);
            //         }else if(vOneAction.targetCard === msg.card2){
            //             self.actionSelectArray2.push(vOneAction);
            //         }
            //     }
            //     vTempActionSubList.push(vOneAction);
            // }
        }


        /**
         * 设置动作按钮
         * @param actionId
         * @param {number} groupNum
         * @param {boolean} isOn
         */
        // private setActionBtn(actionInfo:MahjongActionResult,groupNum:number,isOn:boolean):void{
        //     let self = this;
        //     let btnRes:string;
        //     switch (actionInfo.action) {
        //         case MahjongActionEnum.CHI:
        //             btnRes = isOn?"btnCanChi_png":"btnChi_png";
        //             if(groupNum == 1){
        //                 self.chiBtn1.source = btnRes;
        //                 self.chiBtn1.name = ""+actionInfo.id;
        //                 if(isOn){
        //                     TouchTweenUtil.regTween(self.chiBtn1, self.chiBtn1);
        //                     self.chiBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //                 }
        //             }else{
        //                 self.chiBtn2.source = btnRes;
        //                 self.chiBtn2.name = ""+actionInfo.id;
        //                 if(isOn){
        //                     TouchTweenUtil.regTween(self.chiBtn2, self.chiBtn2);
        //                     self.chiBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //                 }
        //             }
        //             break;
        //         case MahjongActionEnum.PENG:
        //             btnRes = isOn?"btnCanPeng_png":"btnPeng_png";
        //             if(groupNum == 1){
        //                 self.pengBtn1.source = btnRes;
        //                 self.pengBtn1.name = ""+actionInfo.id;
        //                 if(isOn){
        //                     TouchTweenUtil.regTween(self.pengBtn1, self.pengBtn1);
        //                     self.pengBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //                 }
        //             }else{
        //                 self.pengBtn2.source = btnRes;
        //                 self.pengBtn2.name = ""+actionInfo.id;
        //                 if(isOn){
        //                     TouchTweenUtil.regTween(self.pengBtn2, self.pengBtn2);
        //                     self.pengBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //                 }
        //             }
        //             break;
        //         case MahjongActionEnum.CHANG_SHA_MING_GANG:
        //             btnRes = isOn?"btnCanGang_png":"btnGang_png";
        //             if(groupNum == 1){
        //                 self.gangBtn1.source = btnRes;
        //                 self.gangBtn1.name = ""+actionInfo.id;
        //                 if(isOn){
        //                     TouchTweenUtil.regTween(self.gangBtn1, self.gangBtn1);
        //                     self.gangBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //                 }
        //             }else{
        //                 self.gangBtn2.source = btnRes;
        //                 self.gangBtn2.name = ""+actionInfo.id;
        //                 if(isOn){
        //                     TouchTweenUtil.regTween(self.gangBtn2, self.gangBtn2);
        //                     self.gangBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //                 }
        //             }
        //             break;
        //         case MahjongActionEnum.CHANG_SHA_MING_BU_ZHANG:
        //             btnRes = isOn?"btnCanBu_png":"btnBu_png";
        //             if(groupNum == 1){
        //                 self.buBtn1.source = btnRes;
        //                 self.buBtn1.name = ""+actionInfo.id;
        //                 if(isOn){
        //                     TouchTweenUtil.regTween(self.buBtn1, self.buBtn1);
        //                     self.buBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //                 }
        //             }else{
        //                 self.buBtn2.source = btnRes;
        //                 self.buBtn2.name = ""+actionInfo.id;
        //                 if(isOn){
        //                     TouchTweenUtil.regTween(self.buBtn2, self.buBtn2);
        //                     self.buBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //                 }
        //             }
        //             break;
        //         case MahjongActionEnum.ZI_MO || MahjongActionEnum.JIE_PAO:
        //             btnRes = isOn?"btnCanHu_png":"btnHu_png";
        //             self.huBtn.source = btnRes;
        //             self.huBtn.name = ""+actionInfo.id;
        //             if(isOn){
        //                 self.showCard1.visible = true;
        //                 self.showCard2.visible = true;
        //                 self.showCard1.source = MahjongHandler.getCardResName(PZOrientation.UP, actionInfo.targetCard << 8 & 0xFF);
        //                 self.showCard2.source = MahjongHandler.getCardResName(PZOrientation.UP, actionInfo.targetCard >> 8 & 0xFF);
        //                 self.score1.text = actionInfo.value+"分";
        //                 // self.score2.text = actionInfo.value+"分";
        //                 TouchTweenUtil.regTween(self.huBtn, self.huBtn);
        //                 self.huBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.chooseAction, self);
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        // }


        private chooseAction(e:egret.Event):void{
            let self = this;
            let  vTarget = e.target;
            let vSelectTempActions: MahjongActionResult[] = [];
            if (vTarget === self.chiBtn1) {
                vSelectTempActions = self._chi1Action;
            } else if (vTarget === self.chiBtn2) {
                vSelectTempActions = self._chi2Action;
            } else if (vTarget === self.pengBtn1) {
                if (self._peng1Action) vSelectTempActions.push(self._peng1Action);
            } else if (vTarget === self.pengBtn2) {
                if (self._peng2Action) vSelectTempActions.push(self._peng2Action);
            } else if (vTarget === self.gangBtn1) {
                if (self._gang1Action) vSelectTempActions.push(self._gang1Action);
            } else if (vTarget === self.gangBtn2) {
                if (self._gang2Action) vSelectTempActions.push(self._gang2Action);
            } else if (vTarget === self.buBtn1) {
                if (self._bu1Action) vSelectTempActions.push(self._bu1Action);
            } else if (vTarget === self.buBtn2) {
                if (self._bu2Action) vSelectTempActions.push(self._bu2Action);
            } else if (vTarget === self.huBtn) {
                if (self._huAction) vSelectTempActions.push(self._huAction);
            }
            // 没有动作
            if (vSelectTempActions.length === 0) {
                return;
            }
            // 只有一个动作
            if (vSelectTempActions.length == 1) {
                let vMahjongActionSelectMsg: MahjongActionSelectMsg = new MahjongActionSelectMsg();
                vMahjongActionSelectMsg.selectActionId = vSelectTempActions[0].id;
                ServerUtil.sendMsg(vMahjongActionSelectMsg); // 选择当前动作
                MvcUtil.delView(this); // 删除自己
                return;
            }
            // 多个动作
            let vSubGroupArray:Array<any> = [];
            for (let vIndex:number = 0; vIndex < vSelectTempActions.length; ++vIndex) {
                let vMahjongActionResult: MahjongActionResult = vSelectTempActions[vIndex];
                let vSubGroup: eui.Group = this.initSubSelectGroup(vMahjongActionResult);
                vSubGroupArray.push(vSubGroup);
            }
            this.newViewSelectGroup(vSubGroupArray);


            // console.log(e.target.name);
            // let actionID:number = parseInt(e.target.name);
            // if (this.actionSelectArray1.length>1 || this.actionSelectArray2.length > 1) {
            //     // 有多选，展示子选择
            //     let actionResultArray = this.actionSelectArray1.length>1?this.actionSelectArray1:this.actionSelectArray2;
            //     for (let vIndex:number = 0; vIndex < actionResultArray.length; ++vIndex) {
            //         let vSubGroupArray:Array<any> = [];
            //         for (let vIndex:number = 0; vIndex < actionResultArray.length; ++vIndex) {
            //
            //             let vMahjongActionResult: MahjongActionResult = actionResultArray[vIndex];
            //             let vSubGroup: eui.Group = this.initSubSelectGroup(vMahjongActionResult);
            //             vSubGroupArray.push(vSubGroup);
            //         }
            //         this.newViewSelectGroup(vSubGroupArray);
            //     }
            // } else {
            //     let vMahjongActionSelectMsg: MahjongActionSelectMsg = new MahjongActionSelectMsg();
            //     vMahjongActionSelectMsg.selectActionId = actionID;
            //     ServerUtil.sendMsg(vMahjongActionSelectMsg); // 选择当前动作
            //     // console.log(vMahjongActionSelectMsg);
            //     if (MahjongHandler.getCurrOperationOrientation() === PZOrientation.DOWN) {
            //         MahjongHandler.touchHandCardSwitch.compelOpen();
            //     } else {
            //         MahjongHandler.touchHandCardSwitch.close();
            //     }
            //     // this.closeView();
            //     MvcUtil.delView(this);
            // }
        }

        public newViewSelectGroup(subGroupArray:any): void {
            let self = this;
            //选择吃杠组
            if (!this._selectChiGangGroup) {
                let vChiGangGroup:eui.Group = new eui.Group();
                vChiGangGroup.height = 517, vChiGangGroup.width = 820, vChiGangGroup.x = 0, vChiGangGroup.y = 0;
                //布局
                let vHorizontalLayout:eui.HorizontalLayout = new eui.HorizontalLayout();
                vHorizontalLayout.horizontalAlign = egret.HorizontalAlign.LEFT;
                vHorizontalLayout.verticalAlign = egret.VerticalAlign.TOP;
                vHorizontalLayout.gap = 20;
                vHorizontalLayout.paddingLeft = 0;
                vChiGangGroup.layout = vHorizontalLayout;
                this._selectChiGangGroup = vChiGangGroup;
                this._selectChiGangGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.resetPopUpGroup, self);
            }
            this._selectChiGangGroup.removeChildren();
            for (let vIndex:number = 0; vIndex < subGroupArray.length; ++vIndex) {
                self._selectChiGangGroup.addChild(subGroupArray[vIndex]);
            }
            ViewUtil.addChild(self, self._selectChiGangGroup);
            // ViewUtil.addChild(self.popUpGroup, self._shadeGroup);
        }

        private initSubSelectGroup(subActionResult:MahjongActionResult):eui.Group{
            let self = this;
            let vCardArray: Array<number> = [];
            let subSelectGroup:eui.Group = new eui.Group();
            let vCard1:number = subActionResult.value & 0xFF;
            let vCard2:number = subActionResult.value >> 8 & 0xFF;
            let vCard3:number = subActionResult.value >> 16 & 0xFF;
            let vCard4:number = subActionResult.value >> 24 & 0xFF;
            vCardArray.push(vCard1);
            vCardArray.push(vCard2);
            vCardArray.push(vCard3);
            if (vCard4 > 0) {
                vCardArray.push(vCard4);
            }
            subSelectGroup.width = vCardArray.length * 55 +40;
            subSelectGroup.height = 110;
            let vImg:eui.Image = new eui.Image();
            vImg.width = subSelectGroup.width, vImg.height = subSelectGroup.height;
            vImg.source = "hubg_png"; // scale9Grid="18,12,30,4"
            vImg.scale9Grid = new egret.Rectangle(18,12,30,4); // 九宫格
            subSelectGroup.addChild(vImg);
            for (let vIndex:number = 0; vIndex < vCardArray.length; ++vIndex) {
                let vImg = MahjongCardManager.getMahjongCommonCard(vCardArray[vIndex], 55, 84);
                vImg.y = 13;
                vImg.x = vIndex * 55 + 20;
                subSelectGroup.addChild(vImg);
            }
            // console.log(subActionResult);
            subSelectGroup["actionId"] = subActionResult.id;
            subSelectGroup.touchChildren = false;
            // ViewUtil.addChild(this._selectChiGangGroup, self);
            subSelectGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.selectSubAction, self);
            return subSelectGroup;
        }

        private selectSubAction(e:egret.Event): void {
            let self = this;
            // console.log(e.target["actionId"]);
            // let actionID:number = parseInt(e.target["actionId"]);
            let actionID:number = e.target["actionId"];
            let vMahjongActionSelectMsg: MahjongActionSelectMsg = new MahjongActionSelectMsg();
            vMahjongActionSelectMsg.selectActionId = actionID;
            ServerUtil.sendMsg(vMahjongActionSelectMsg); // 选择当前动作
            // console.log(vMahjongActionSelectMsg);
            self.resetPopUpGroup();
            // self.closeView();
            MvcUtil.delView(this);
        }

        private resetPopUpGroup():void {
            let self = this;
            ViewUtil.removeChild(self, self._selectChiGangGroup);
            // ViewUtil.removeChild(self._shadeGroup, self._selectChiGangGroup);
            // ViewUtil.removeChild(self.popUpGroup, self._shadeGroup);
        }

        private closeView():void{
            MvcUtil.delView(this);
        }

        private guoAction(): void {
            // 发送过消息
            let vMahjongActionSelectMsg: MahjongActionSelectMsg = new MahjongActionSelectMsg();
            vMahjongActionSelectMsg.selectActionId = 1; // 1为过消息
            ServerUtil.sendMsg(vMahjongActionSelectMsg);
            this.closeView();
        }

    }
}