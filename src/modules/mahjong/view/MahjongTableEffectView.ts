module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongTableEffectView
     * @Description:  //特效表现层界面，吃碰杠 补花 胡牌
     * @Create: DerekWu on 2017/11/23 9:38
     * @Version: V1.0
     */
    export class MahjongTableEffectView extends BaseView {

        /** 单例 */
        private static _onlyOne:MahjongTableEffectView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = MahjongTableEffectViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 所有的吃碰杠胡 使用的图片 的链表 */
        private _imgLinkedList:Game.LinkedList = new Game.LinkedList();


        /** 所有的发文字 使用的组件的链表 */
        private _componentLinkedList:Game.LinkedList = new Game.LinkedList();

        /** 补花链表有时候会同时出来好多个 */
        private _buhuaMovieLinkedList:Game.LinkedList = new Game.LinkedList();
        /** 每个方向的最后补花时间，用来处理在同一个方向上连续的补花只播放一个 */
        private _lastBuhuaTime:{[pzOrientation:number]:number} = {};
        /** 补花牌显示 图片存储链表 */
        // private _buhuaCardImgLinkedList:Game.LinkedList = new Game.LinkedList();
        /** 各个方向补花显示组 */
        // private _upBuhuaCardGroup:eui.Group;
        // private _downBuhuaCardGroup:eui.Group;
        // private _leftBuhuaCardGroup:eui.Group;
        // private _rightBuhuaCardGroup:eui.Group;

        /** 胡牌的背景需要旋转 */
        private _huBgImage:eui.Image;
        private _newHuBgImageArray:Array<eui.Image> = [];

        public bottomGroup:eui.Group;

        public topGroup:eui.Group;

        /** 丢色子,最多有四个*/
        private _shaiziGroup:eui.Group;
        private _shaiZiImage1:eui.Image;
        private _shaiZiImage2:eui.Image;
        private _shaiZiImage3:eui.Image;
        private _shaiZiImage4:eui.Image;
        private _MahjongDiuShaiZiMsgAck:MahjongDiuShaiZiMsgAck

        /** 微信语音图标，同时只能处理一个语音，所以唯一的图片 */
        private _weChatVoiceImg:eui.Image;

        /** 原生语音组件*/
        private _nativeTalkMod: TalkAni;

        /** 调停者 */
        private _mediator:MahjongTableEffectViewMediator;

        private constructor() {
            super();
            let self = this;
            self.top = self.bottom = self.left = self.right = 0;
            self.touchEnabled = false, self.touchChildren = false;
        }

        public static getInstance():MahjongTableEffectView {
            if (!this._onlyOne) {
                this._onlyOne = new MahjongTableEffectView();
            }
            return this._onlyOne;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            self.bottomGroup = new eui.Group();
            self.bottomGroup.width = 1280;
            self.bottomGroup.height = 720;
            self.bottomGroup.left = self.bottomGroup.right = self.bottomGroup.top = self.bottomGroup.bottom = 0;
            self.bottomGroup.touchEnabled = false;
            self.addChild(self.bottomGroup);

            self.topGroup = new eui.Group();
            self.topGroup.width = 1280;
            self.topGroup.height = 720;
            self.topGroup.left = self.topGroup.right = self.topGroup.top = self.topGroup.bottom = 0;
            self.topGroup.touchEnabled = false;
            self.addChild(self.topGroup);
            self._mediator = new MahjongTableEffectViewMediator(self);
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView():void {
            if (this._huBgImage) {
                Game.Tween.removeTweens(this._huBgImage);
            }
            if (this._newHuBgImageArray.length > 0) {
                for (let vIndex:number = 0; vIndex < this._newHuBgImageArray.length; ++vIndex) {
                    Game.Tween.removeTweens(this._newHuBgImageArray[vIndex]);
                }
                this._newHuBgImageArray = [];
            }
            MvcUtil.regMediator(this._mediator);
        }

        /** 从界面移除以后框架自动调用 */
        protected onRemView():void {
            if (this._huBgImage) {
                Game.Tween.removeTweens(this._huBgImage);
            }
            if (this._newHuBgImageArray.length > 0) {
                for (let vIndex:number = 0; vIndex < this._newHuBgImageArray.length; ++vIndex) {
                    Game.Tween.removeTweens(this._newHuBgImageArray[vIndex]);
                }
                this._newHuBgImageArray = [];
            }
            if (this._weChatVoiceImg) {
                Game.Tween.removeTweens(this._weChatVoiceImg);
            }
            this.startGame();
            if (this._viewGangCardView) {
                ViewUtil.removeChild(this, this._viewGangCardView);
            }
        }

        /**
         * 出牌
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} cardValue
         */
        public chuCard(pzOrientation:PZOrientation, cardValue:number):void {
            //出牌图片
            let vChuCardImage:MahjongCardItem = MahjongCardManager.getMahjongCommonCard(cardValue);
            if (MahjongHandler.isLaiZi(cardValue)) {
                // vChuCardImage.filters = [MahjongHandler.laiziColorFilter];
            }
            this.playChiPengGang(pzOrientation, vChuCardImage);
        }

        /**
         * 补花
        * @param {FL.PZOrientation} pzOrientation
            */
            public buHua(pzOrientation:PZOrientation):void {
                let self = this;
            //处理连续紧挨着的补花，只播放一个
            if (self._lastBuhuaTime[pzOrientation] && self._lastBuhuaTime[pzOrientation]+300 > egret.getTimer()) {
                return;
            } else {
                self._lastBuhuaTime[pzOrientation] = egret.getTimer();
            }
            let vMovie:dragonBones.Movie = this.getBuhuaMovie();
            //获得舞台宽高
            let vEgretStag:egret.Stage = egret.MainContext.instance.stage;
            let vStageWidth:number = vEgretStag.stageWidth;
            let vStageHeight:number = vEgretStag.stageHeight;
            if (pzOrientation === PZOrientation.UP) {
                // tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = -200;
                vMovie.x = vStageWidth/2, vMovie.y = vStageHeight/2 - 200;
            } else if (pzOrientation === PZOrientation.DOWN) {
                // tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = 150;
                vMovie.x = vStageWidth/2, vMovie.y = vStageHeight/2 + 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                // tweenImage.horizontalCenter = -310, tweenImage.verticalCenter = -30;
                vMovie.x = vStageWidth/2 - 310, vMovie.y = vStageHeight/2 - 30;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                // tweenImage.horizontalCenter = 310, tweenImage.verticalCenter = -30;
                vMovie.x = vStageWidth/2 + 310, vMovie.y = vStageHeight/2 - 30;
            }
            vMovie.play("animation", 1);
            // vMovie.gotoAndPlay("animation", 0,1);
            vMovie.addEventListener(dragonBones.MovieEvent.COMPLETE, this.delAndGiveBackMovie, this);
            self.bottomGroup.addChild(vMovie);
        }

        /** 补花表现细节，后面再优化 */
        // public addBuhuaCard():void {
        //
        // }
        //
        // public getBuhuaCardGroup(pzOrientation:PZOrientation):void {
        //     let self = this;
        //     let vBuhuaCardGroup:eui.Group;
        //     if (pzOrientation === PZOrientation.UP) {
        //         vBuhuaCardGroup = self._upBuhuaCardGroup;
        //         if (vBuhuaCardGroup) {
        //
        //         }
        //     } else if (pzOrientation === PZOrientation.DOWN) {
        //         // tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = 150;
        //         vMovie.x = vStageWidth/2, vMovie.y = vStageHeight/2 + 150;
        //     } else if (pzOrientation === PZOrientation.LEFT) {
        //         // tweenImage.horizontalCenter = -310, tweenImage.verticalCenter = -30;
        //         vMovie.x = vStageWidth/2 - 310, vMovie.y = vStageHeight/2 - 30;
        //     } else if (pzOrientation === PZOrientation.RIGHT) {
        //         // tweenImage.horizontalCenter = 310, tweenImage.verticalCenter = -30;
        //         vMovie.x = vStageWidth/2 + 310, vMovie.y = vStageHeight/2 - 30;
        //     }
        // }

        public chi(pzOrientation:PZOrientation):void {
            let vImage:eui.Image = this.getImage();
            vImage.source = "chi_key_png";
            this.playChiPengGang(pzOrientation, vImage);
        }

        public peng(pzOrientation:PZOrientation):void {
            let vImage:eui.Image = this.getImage();
            vImage.source = "peng_key_png";
            this.playChiPengGang(pzOrientation, vImage);
        }

        public gang(pzOrientation:PZOrientation):void {
            let vImage:eui.Image = this.getImage();
            vImage.source = "gang_key_png";
            this.playChiPengGang(pzOrientation, vImage);
        }

        public buZhang(pzOrientation:PZOrientation):void {
            let vImage:eui.Image = this.getImage();
            vImage.source = "bu_key_png";
            this.playChiPengGang(pzOrientation, vImage);
        }

        /** 只在回放中用 */
        public guo(pzOrientation:PZOrientation) {
            let vImage:eui.Image = this.getImage();
            vImage.source = "guo_key_png";
            this.playChiPengGang(pzOrientation, vImage);
        }

        /**
         * 胡牌
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} cardValue 胡哪张牌
         */
        public hu(pzOrientation:PZOrientation, cardValue:number, zimo:boolean = false):void {
            let self = this;
            //胡字图片
            let vHuImage:eui.Image = new eui.Image();
            if (zimo) {
                vHuImage.source = "zimo_key_png";
            }
            else {
                vHuImage.source = "hu_key_png";
            }
            //胡牌的图片
            let vCardImage: MahjongCardItem = MahjongCardManager.getMahjongCommonCard(cardValue);
            // if (MahjongHandler.isLaiZi(cardValue)) {
                // vCardImage.filters = [MahjongHandler.laiziColorFilter];
            // }
            //胡牌背景图片
            let vHuBgImage:eui.Image = self.getNewHuBgImage();
            ViewUtil.removeChild(self.bottomGroup, vHuBgImage);
            Game.Tween.removeTweens(vHuBgImage);

            let zimoOffset = 0;
            if (zimo) {
                zimoOffset = 35
            }

            //获得舞台宽高
            let vEgretStag:egret.Stage = egret.MainContext.instance.stage;
            let vStageWidth:number = vEgretStag.stageWidth;
            let vStageHeight:number = vEgretStag.stageHeight;
            if (pzOrientation === PZOrientation.UP) {
                // vHuBgImage.horizontalCenter = 0, vHuBgImage.verticalCenter = -200;
                vHuBgImage.x = vStageWidth/2, vHuBgImage.y = vStageHeight/2 - 200;
                vHuImage.horizontalCenter = -59, vHuImage.verticalCenter = -200;
                vCardImage.horizontalCenter = 45 + zimoOffset, vCardImage.verticalCenter = -200;
            } else if (pzOrientation === PZOrientation.DOWN) {
                // vHuBgImage.horizontalCenter = 0, vHuBgImage.verticalCenter = 150;
                vHuBgImage.x = vStageWidth/2, vHuBgImage.y = vStageHeight/2 + 150;
                vHuImage.horizontalCenter = -59, vHuImage.verticalCenter = 150;
                vCardImage.horizontalCenter = 45 + zimoOffset, vCardImage.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                // vHuBgImage.x = vStageWidth/2 - 310, vHuBgImage.y = vStageHeight/2 - 30;
                // vHuImage.horizontalCenter = -369, vHuImage.verticalCenter = -30;
                // vCardImage.horizontalCenter = -265, vCardImage.verticalCenter = -30;
                vHuBgImage.x = vStageWidth/2 - 250, vHuBgImage.y = vStageHeight/2 - 30;
                vHuImage.horizontalCenter = -309, vHuImage.verticalCenter = -30;
                vCardImage.horizontalCenter = -205 + zimoOffset, vCardImage.verticalCenter = -30;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                // vHuBgImage.x = vStageWidth/2 + 310, vHuBgImage.y = vStageHeight/2 - 30;
                // vHuImage.horizontalCenter = 251, vHuImage.verticalCenter = -30;
                // vCardImage.horizontalCenter = 355, vCardImage.verticalCenter = -30;
                vHuBgImage.x = vStageWidth/2 + 250, vHuBgImage.y = vStageHeight/2 - 30;
                vHuImage.horizontalCenter = 191, vHuImage.verticalCenter = -30;
                vCardImage.horizontalCenter = 295 + zimoOffset, vCardImage.verticalCenter = -30;
            }
            //初始化值
            vHuImage.scaleX = 2.5, vHuImage.scaleY = 2.5, vHuImage.alpha = 0.33;
            vCardImage.scaleX = 2.5, vCardImage.scaleY = 2.5, vCardImage.alpha = 0.33;

            //缓动后回收
            // Game.Tween.get(vHuImage).to({scaleX:1, scaleY:1, alpha:1}, 200).wait(10000).call(self.delAndGiveBackImage, self, [vHuImage]);
            // Game.Tween.get(vCardImage).to({scaleX:1, scaleY:1, alpha:1}, 200).wait(10000).call(self.delAndGiveBackImage, self, [vCardImage]);
            Game.Tween.get(vHuImage).to({scaleX:1, scaleY:1, alpha:1}, 200);
            Game.Tween.get(vCardImage).to({scaleX:1, scaleY:1, alpha:1}, 200);
            vHuBgImage.rotation = 0;
            Game.Tween.get(vHuBgImage, {loop:true}).to({rotation:360}, 5000).call(function (vHuBgImage) {
                vHuBgImage.rotation = 0;
            }, this, [vHuBgImage]);
            // Game.Tween.get(vHuBgImage).to({rotation:360}, 5000);
            self.bottomGroup.addChild(vHuBgImage);
            self.bottomGroup.addChild(vHuImage);
            self.bottomGroup.addChild(vCardImage);
        }

        /**
         * 胡牌
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} cardValues 胡多张牌
         */
        public hu2(pzOrientation:PZOrientation, cardValues:number[], zimo: boolean = false):void {
            let self = this;
            //胡字图片
            let vHuImage:eui.Image = new eui.Image();
            if (zimo) {
                vHuImage.source = "zimo_key_png";
            }
            else {
                vHuImage.source = "hu_key_png";
            }
            //胡牌背景图片
            let vHuBgImage:eui.Image = self.getNewHuBgImage();
            ViewUtil.removeChild(self.bottomGroup, vHuBgImage);
            Game.Tween.removeTweens(vHuBgImage);
            //获得舞台宽高
            let vEgretStag:egret.Stage = egret.MainContext.instance.stage;
            let vStageWidth:number = vEgretStag.stageWidth;
            let vStageHeight:number = vEgretStag.stageHeight;
            if (pzOrientation === PZOrientation.UP) {
                // vHuBgImage.horizontalCenter = 0, vHuBgImage.verticalCenter = -200;
                vHuBgImage.x = vStageWidth/2, vHuBgImage.y = vStageHeight/2 - 200;
                vHuImage.horizontalCenter = -59, vHuImage.verticalCenter = -200;
                // vCardImage.horizontalCenter = 45, vCardImage.verticalCenter = -200;
            } else if (pzOrientation === PZOrientation.DOWN) {
                // vHuBgImage.horizontalCenter = 0, vHuBgImage.verticalCenter = 150;
                vHuBgImage.x = vStageWidth/2, vHuBgImage.y = vStageHeight/2 + 150;
                vHuImage.horizontalCenter = -59, vHuImage.verticalCenter = 150;
                // vCardImage.horizontalCenter = 45, vCardImage.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                // vHuBgImage.x = vStageWidth/2 - 310, vHuBgImage.y = vStageHeight/2 - 30;
                // vHuImage.horizontalCenter = -369, vHuImage.verticalCenter = -30;
                // vCardImage.horizontalCenter = -265, vCardImage.verticalCenter = -30;
                vHuBgImage.x = vStageWidth/2 - 250, vHuBgImage.y = vStageHeight/2 - 30;
                vHuImage.horizontalCenter = -309, vHuImage.verticalCenter = -30;
                // vCardImage.horizontalCenter = -205, vCardImage.verticalCenter = -30;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                // vHuBgImage.x = vStageWidth/2 + 310, vHuBgImage.y = vStageHeight/2 - 30;
                // vHuImage.horizontalCenter = 251, vHuImage.verticalCenter = -30;
                // vCardImage.horizontalCenter = 355, vCardImage.verticalCenter = -30;
                vHuBgImage.x = vStageWidth/2 + 250, vHuBgImage.y = vStageHeight/2 - 30;
                vHuImage.horizontalCenter = 191, vHuImage.verticalCenter = -30;
                // vCardImage.horizontalCenter = 295, vCardImage.verticalCenter = -30;
            }
            //初始化值
            vHuImage.scaleX = 2.5, vHuImage.scaleY = 2.5, vHuImage.alpha = 0.33;
            // vCardImage.scaleX = 2.5, vCardImage.scaleY = 2.5, vCardImage.alpha = 0.33;

            //缓动后回收
            // Game.Tween.get(vHuImage).to({scaleX:1, scaleY:1, alpha:1}, 200).wait(10000).call(self.delAndGiveBackImage, self, [vHuImage]);
            // Game.Tween.get(vCardImage).to({scaleX:1, scaleY:1, alpha:1}, 200).wait(10000).call(self.delAndGiveBackImage, self, [vCardImage]);
            Game.Tween.get(vHuImage).to({scaleX:1, scaleY:1, alpha:1}, 200);
            // Game.Tween.get(vCardImage).to({scaleX:1, scaleY:1, alpha:1}, 200);
            vHuBgImage.rotation = 0;
            Game.Tween.get(vHuBgImage, {loop:true}).to({rotation:360}, 5000).call(function (vHuBgImage) {
                vHuBgImage.rotation = 0;
            }, this, [vHuBgImage]);
            // Game.Tween.get(vHuBgImage).to({rotation:360}, 5000);
            self.bottomGroup.addChild(vHuBgImage);

            //胡牌的图片
            for (let vIndex:number = 0; vIndex < cardValues.length; ++vIndex) {
                let vOneCardValue = cardValues[vIndex];
                let vCardImage: MahjongCardItem = MahjongCardManager.getMahjongCommonCard(vOneCardValue);
                if (MahjongHandler.isLaiZi(vOneCardValue)) {
                    // vCardImage.filters = [MahjongHandler.laiziColorFilter];
                }

                let zimoOffset = 0;
                if (zimo) {
                    zimoOffset = 35
                }
                if (pzOrientation === PZOrientation.UP) {
                    vCardImage.horizontalCenter = 45 + vIndex * 75 + zimoOffset, vCardImage.verticalCenter = -200;
                } else if (pzOrientation === PZOrientation.DOWN) {
                    vCardImage.horizontalCenter = 45 + vIndex * 75 + zimoOffset, vCardImage.verticalCenter = 150;
                } else if (pzOrientation === PZOrientation.LEFT) {
                    vCardImage.horizontalCenter = -205 + vIndex * 75 + zimoOffset, vCardImage.verticalCenter = -30;
                } else if (pzOrientation === PZOrientation.RIGHT) {
                    vCardImage.horizontalCenter = 295 + vIndex * 75 + zimoOffset, vCardImage.verticalCenter = -30;
                }
                self.bottomGroup.addChild(vCardImage);
            }

            self.bottomGroup.addChild(vHuImage);

        }

        // private resetRotation():void {
        //     this.getHuBgImage().rotation = 0;
        // }

        /**
         * 播放分数更新
         * @param {FL.PZOrientation} start
         * @param {FL.PZOrientation} end
         * @param {number} scoreUpdate
         * @param {number} startScore
         */
        public playScoreUpdate(start:PZOrientation, end:PZOrientation, scoreUpdate:number, startScore:number): void {
            // 获得开始方向的头像中心坐标
            let vStartHeadPoint:{x:number, y:number} = MahjongTableEffectView.getInstance().getIconOrientation(start);
            if (start !== end) {
                // 位置不同则播放飞行动画
                let vFlyGoldNum:number = Math.abs(scoreUpdate);
                // 获得结束方向的头像中心坐标
                let vEndHeadPoint:{x:number, y:number} = MahjongTableEffectView.getInstance().getIconOrientation(end);
                for (let vIndex:number = 0; vIndex < vFlyGoldNum; ++vIndex) {
                    // 生成一个金币图片
                    let vGoldImg:eui.Image = new eui.Image();
                    vGoldImg.source = "gold_icon_png";
                    vGoldImg.width = vGoldImg.height = 56;
                    vGoldImg.anchorOffsetX = vGoldImg.anchorOffsetY = 28;
                    vGoldImg.x = vStartHeadPoint.x, vGoldImg.y = vStartHeadPoint.y;
                    // 增加的延时播放
                    MyCallBackUtil.delayedCallBack(vIndex*100, this.playGoldFly, this, vGoldImg, vEndHeadPoint);
                }
            }
            // 改变分数动画
            let vScoreGroup:eui.Group = new eui.Group();
            vScoreGroup.width = 160, vScoreGroup.height = 51;
            let vLayout:eui.HorizontalLayout = new eui.HorizontalLayout();
            vLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
            vLayout.gap = 0;
            vScoreGroup.layout = vLayout;
            //设置分数
            let vScoreText:string;
            if (scoreUpdate > 0) {
                vScoreText = "+"+scoreUpdate;
            } else {
                vScoreText = ""+scoreUpdate;
            }
            let vScoreImageArray:eui.Image[] = MahjongHandler.genScoreImageArray(vScoreText);
            for (let vIndex:number = 0; vIndex < vScoreImageArray.length; ++vIndex) {
                vScoreGroup.addChild(vScoreImageArray[vIndex]);
            }
            // 计算坐标
            let vScoreGroupX:number, vStartY:number, vEndY:number;
            if (start === PZOrientation.UP || start === PZOrientation.RIGHT) {
                vScoreGroupX = vStartHeadPoint.x - 140;
            } else {
                vScoreGroupX = vStartHeadPoint.x + 20;
            }
            vStartY = vStartHeadPoint.y, vEndY = vStartHeadPoint.y - 51;
            vScoreGroup.x = vScoreGroupX, vScoreGroup.y = vStartY, vScoreGroup.alpha = 0.7;

            // 播放缓动
            if (start !== end) {
                this.addAndPlayTween(vScoreGroup, vEndY, start, startScore);
            } else {
                // 增加的延时播放
                MyCallBackUtil.delayedCallBack(600, this.addAndPlayTween, this, vScoreGroup, vEndY, start, startScore);
            }
        }

        /**
         * 播放金币飞行
         * @param {eui.Image} goldImg
         * @param {{x: number; y: number}} endPoint
         */
        private playGoldFly(goldImg:eui.Image, endPoint:{x:number, y:number}): void {
            let vTopGroup = this.topGroup;
            // 添加到topGroup
            vTopGroup.addChild(goldImg);
            Game.Tween.get(goldImg).to({x:endPoint.x, y:endPoint.y}, 600).call(function () {
                ViewUtil.removeChild(vTopGroup, goldImg);
                // 播放声音
                SoundManager.playEffect("chips_to_table_mp3");
            });
        }

        /**
         * 添加并播放缓动
         * @param {eui.Group} scoreGroup
         * @param {number} endY
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} score
         */
        private addAndPlayTween(scoreGroup:eui.Group, endY:number, pzOrientation:PZOrientation, score:number): void {
            let vTopGroup = this.topGroup;
            // 添加到topGroup
            vTopGroup.addChild(scoreGroup);
            Game.Tween.get(scoreGroup).to({y:endY, alpha:1}, 600).wait(800).to({alpha:0}, 300).call(function () {
                ViewUtil.removeChild(vTopGroup, scoreGroup);
            });

            // 获得玩家信息
            // let vGamePlayer:GamePlayer = MahjongHandler.getGamePlayerInfo(pzOrientation);
            // vGamePlayer.chip = score;
            //发送更新玩家信息指令
            MvcUtil.send(MahjongModule.MAHJONG_UPDATE_PLAYER_HEAD_AREA, pzOrientation);
        }

        /**
         * 表情
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} fType
         */
        public playFace(pzOrientation:PZOrientation, fType):void {
            let tweenImage = new eui.Image();
            tweenImage.source = "face"+fType+"_png";
            if (pzOrientation === PZOrientation.UP) {
                tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = -200;
            } else if (pzOrientation === PZOrientation.DOWN) {
                tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                tweenImage.horizontalCenter = -310, tweenImage.verticalCenter = -30;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                tweenImage.horizontalCenter = 310, tweenImage.verticalCenter = -30;
            }
            Game.Tween.get(tweenImage).to({verticalCenter :tweenImage.verticalCenter-30}, 1000, Game.Ease.elasticOut).call(this.delAndGiveBackImageOnTopGroup, this, [tweenImage]);
            this.topGroup.addChild(tweenImage);
        }

        /**
         * 快捷文字
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} fType
         */
        public playQuickText(pzOrientation:PZOrientation, fType):void {
            let chatText:string = MJGameChatView.getInstance().getQuickTextArr(fType);
            let tweenChatBubble = new eui.Component();
            tweenChatBubble.skinName = "skins.ChatMsgBoxSkin";
            tweenChatBubble["texLabel"].text = chatText;
            //初始化值
            tweenChatBubble.scaleX = 0.33, tweenChatBubble.scaleY = 0.33;
            //缓动后回收
            Game.Tween.get(tweenChatBubble).to({scaleX:1.3, scaleY:1.3}, 150).to({scaleX:1, scaleY:1}, 80).wait(1500).call(this.delAndGiveBackComOnTopGroup, this, [tweenChatBubble]);
            this.topGroup.addChild(tweenChatBubble);
            if (pzOrientation === PZOrientation.UP) {
                tweenChatBubble.horizontalCenter = 0, tweenChatBubble.verticalCenter = -200;
                tweenChatBubble["backgroundImg"].scaleX= -1;
                tweenChatBubble["texLabel"].left = 18;
                tweenChatBubble["texLabel"].right = 25;
            } else if (pzOrientation === PZOrientation.DOWN) {
                tweenChatBubble.horizontalCenter = 0, tweenChatBubble.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                tweenChatBubble.x = this.getIconOrientation(PZOrientation.LEFT).x +80;
                tweenChatBubble.y = this.getIconOrientation(PZOrientation.LEFT).y -16;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                tweenChatBubble["backgroundImg"].scaleX= -1;
                tweenChatBubble["texLabel"].left = 18;
                tweenChatBubble["texLabel"].right = 25;
                tweenChatBubble.x = this.getIconOrientation(PZOrientation.RIGHT).x -70-tweenChatBubble.width;
                tweenChatBubble.y = this.getIconOrientation(PZOrientation.RIGHT).y -16;
            }
            //道具声音
            MahjongSoundHandler.chat(pzOrientation, fType+1);
        }
        /**
         * 文字
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} fType
         */
        public playText(pzOrientation:PZOrientation, mText):void {
            let tweenChatBubble = new eui.Component();
            tweenChatBubble.skinName = "skins.ChatMsgBoxSkin";
            tweenChatBubble["texLabel"].text = mText;
            //初始化值
            tweenChatBubble.scaleX = 0.33, tweenChatBubble.scaleY = 0.33;
            //缓动后回收
            Game.Tween.get(tweenChatBubble).to({scaleX:1.3, scaleY:1.3}, 150).to({scaleX:1, scaleY:1}, 80).wait(1500).call(this.delAndGiveBackComOnTopGroup, this, [tweenChatBubble]);
            this.topGroup.addChild(tweenChatBubble);
            if (pzOrientation === PZOrientation.UP) {
                tweenChatBubble.horizontalCenter = 0, tweenChatBubble.verticalCenter = -200;
                tweenChatBubble["backgroundImg"].scaleX= -1;
                tweenChatBubble["texLabel"].left = 18;
                tweenChatBubble["texLabel"].right = 25;
            } else if (pzOrientation === PZOrientation.DOWN) {
                tweenChatBubble.horizontalCenter = 0, tweenChatBubble.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                tweenChatBubble.x = this.getIconOrientation(PZOrientation.LEFT).x +80;
                tweenChatBubble.y = this.getIconOrientation(PZOrientation.LEFT).y -16;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                tweenChatBubble["backgroundImg"].scaleX= -1;
                tweenChatBubble["texLabel"].left = 18;
                tweenChatBubble["texLabel"].right = 25;
                tweenChatBubble.x = this.getIconOrientation(PZOrientation.RIGHT).x -70-tweenChatBubble.width;
                tweenChatBubble.y = this.getIconOrientation(PZOrientation.RIGHT).y -16;
            }
        }

        /**
         * 色子动画
         * @param {FL.MahjongDiuShaiZiMsgAck} msg
         */
        public shaiZiAnimation(msg:MahjongDiuShaiZiMsgAck):void{
            let self = this;
            self._MahjongDiuShaiZiMsgAck = msg;
            let mahjongShaiZi:MahjongShaiZi = msg.mahjongShaiZi;
            let shaiziGroup = new eui.Group();
            let vHorizontalLayout:eui.HorizontalLayout = new eui.HorizontalLayout();
            vHorizontalLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
            vHorizontalLayout.verticalAlign = egret.VerticalAlign.MIDDLE;
            vHorizontalLayout.gap = 10;
            shaiziGroup.layout = vHorizontalLayout;
            self._shaiziGroup = shaiziGroup;

            let vMovie:dragonBones.Movie = DragonBonesUtil.buildMovie(DBGroupName.SHAI_ZI);
            vMovie.x = 140,vMovie.y=140;
            vMovie.play("animation",1);
            self._shaiziGroup.addChild(vMovie);
            if(mahjongShaiZi.shaiZiNum1>0){
                let shaiZiImg:eui.Image = new eui.Image();
                shaiZiImg.source = "diushaizi_"+mahjongShaiZi.shaiZiNum1+"_png";
                shaiZiImg.visible = false;
                self._shaiZiImage1 = shaiZiImg;
                self._shaiziGroup.addChild(self._shaiZiImage1);
            }
            if(mahjongShaiZi.shaiZiNum2>0){
                let shaiZiImg:eui.Image = new eui.Image();
                shaiZiImg.source = "diushaizi_"+mahjongShaiZi.shaiZiNum2+"_png";
                shaiZiImg.visible = false;
                self._shaiZiImage2 = shaiZiImg;
                self._shaiziGroup.addChild(self._shaiZiImage2);
            }
            if(mahjongShaiZi.shaiZiNum3>0){
                let shaiZiImg:eui.Image = new eui.Image();
                shaiZiImg.source = "diushaizi_"+mahjongShaiZi.shaiZiNum3+"_png";
                shaiZiImg.visible = false;
                self._shaiZiImage3 = shaiZiImg;
                self._shaiziGroup.addChild(self._shaiZiImage3);
            }
            if(mahjongShaiZi.shaiZiNum4>0){
                let shaiZiImg:eui.Image = new eui.Image();
                shaiZiImg.source = "diushaizi_"+mahjongShaiZi.shaiZiNum4+"_png";
                shaiZiImg.visible = false;
                self._shaiZiImage4 = shaiZiImg;
                self._shaiziGroup.addChild(self._shaiZiImage4);
            }
            self.topGroup.addChild(self._shaiziGroup);
            // console.log(self.stage.width);
            // console.log(self.width);
            // console.log(self.topGroup.width);
            self._shaiziGroup.x=self.width/2-288/2; self._shaiziGroup.y=240;
            vMovie.addEventListener(dragonBones.MovieEvent.COMPLETE, this.throwShaiZiAnimateComplete, this);
        }

        /**
         * 丢色子动画结束回调
         * @param {dragonBones.MovieEvent} e
         */
        private throwShaiZiAnimateComplete(e:dragonBones.MovieEvent):void{
            let self = this;
            let vMovie:dragonBones.Movie = e.target;

            //删除播放完成事件
            vMovie.removeEventListener(dragonBones.MovieEvent.COMPLETE, this.throwShaiZiAnimateComplete, this);
            //删除
            ViewUtil.removeChild(this.topGroup, vMovie);

            if(self._shaiZiImage1)
                self._shaiZiImage1.visible = true;
            if(self._shaiZiImage2)
                self._shaiZiImage2.visible = true;
            if(self._shaiZiImage3)
                self._shaiZiImage3.visible = true;
            if(self._shaiZiImage4)
                self._shaiZiImage4.visible = true;
            FL.MyCallBackUtil.delayedCallBack(1000, self.flyShaiZi, self);
        }

        /**
         * 色子飞起来
         */
        private flyShaiZi(){
            let self = this;
            //送达头像位置
            let endPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(self._MahjongDiuShaiZiMsgAck.mahjongShaiZi.playerPos);
            let endX = self.getIconOrientation(endPZOrientation).x;
            let endY = self.getIconOrientation(endPZOrientation).y;
            Game.Tween.get(self._shaiziGroup).to({x:self._shaiziGroup.x,y:self._shaiziGroup.y}, 0).to({x:endX, y:endY, scaleX: 0.5, scaleY: 0.5}, 800).call(self.rmShaiZiGroup, self);
        }

        /**
         * 移除色子组
         */
        private rmShaiZiGroup():void{
            if(this._MahjongDiuShaiZiMsgAck.afterDiuShowTipDesc){
                PromptUtil.show(this._MahjongDiuShaiZiMsgAck.afterDiuShowTipDesc,PromptType.ALERT);
            }
            ViewUtil.removeChild(this._shaiziGroup, this._shaiZiImage1);
            ViewUtil.removeChild(this._shaiziGroup, this._shaiZiImage2);
            ViewUtil.removeChild(this._shaiziGroup, this._shaiZiImage3);
            ViewUtil.removeChild(this._shaiziGroup, this._shaiZiImage4);
            ViewUtil.removeChild(this.topGroup,this._shaiziGroup);
        }

        /**
         * 送道具
         * @param {Array<number>} start  起点坐标
         * @param {Array<number>} end  终点坐标
         * @param pType 道具类型
         * @param hudongNum 道具声音编号
         */
        public sendProps(start:Array<number>,end:Array<number>,pType,hudongNum:number):void {
            let self = this;
            /**根据路径长度算出播放时间*/
            let time = Math.sqrt((end[0]-start[0])*(end[0]-start[0])+(end[1]-start[1])*(end[1]-start[1])) / 2;
            let vMovie:dragonBones.Movie = DragonBonesUtil.buildMovie(pType);
            vMovie.play("animation1",0);
            Game.Tween.get(vMovie).to({x:start[0],y:start[1]}, 0).to({x:end[0],y:end[1]}, time).call(this.recvProps, this, [vMovie, end, hudongNum]);
            self.topGroup.addChild(vMovie);
        }

        /**
         * 收道具
         * @param vMovie  动画
         * @param {Array<number>} location 道具到达位置坐标
         * @param hudongNum 道具声音编号
         */
        public recvProps(vMovie,location:Array<number>,hudongNum:number):void {
            let self = this;
            vMovie.x = location[0], vMovie.y = location[1];
            vMovie.play("animation2", 1);
            //道具声音
            MahjongSoundHandler.huDong(hudongNum);
            vMovie.addEventListener(dragonBones.MovieEvent.COMPLETE, self.delMovie, self);
        }

        /**
         * 删除动画
         * @param {dragonBones.Movie} e
         */
        private delMovie(e:dragonBones.MovieEvent):void {
            let vMovie:dragonBones.Movie = e.target;
            //删除播放完成事件
            vMovie.removeEventListener(dragonBones.MovieEvent.COMPLETE, this.delMovie, this);
            //删除
            ViewUtil.removeChild(this.topGroup, vMovie);
        }

        /**
         * 播放微信语音
         * @param {FL.PZOrientation} pzOrientation
         */
        public playWeChatVoice(pzOrientation:PZOrientation): void {
            let vWeChatVoiceImg:eui.Image = this.getWeChatVoiceImg();
            // egret.log("pzOrientation="+pzOrientation);
            let vPos:{x:number, y:number} = this.getIconOrientation(pzOrientation);
            let vOffsetX:number = 52;
            if (pzOrientation === PZOrientation.UP) {
                vWeChatVoiceImg.source = "voice_left_png";
                vWeChatVoiceImg.x = vPos.x - vOffsetX + 4;
                // vWeChatVoiceImg.x = vPos.x - 75;
                // vWeChatVoiceImg.y = vPos.y;
            } else if (pzOrientation === PZOrientation.DOWN) {
                vWeChatVoiceImg.source = "voice_right_png";
                vWeChatVoiceImg.x = vPos.x + vOffsetX;
                // vWeChatVoiceImg.x = vPos.x + 75;
                // vWeChatVoiceImg.y = vPos.y;
            } else if (pzOrientation === PZOrientation.LEFT) {
                vWeChatVoiceImg.source = "voice_right_png";
                vWeChatVoiceImg.x = vPos.x + vOffsetX;
                // vWeChatVoiceImg.x = vPos.x + 65;
                // vWeChatVoiceImg.y = vPos.y + 96;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                vWeChatVoiceImg.source = "voice_left_png";
                vWeChatVoiceImg.x = vPos.x - vOffsetX + 4;
                // vWeChatVoiceImg.x = vPos.x - 60;
                // vWeChatVoiceImg.y = vPos.y + 96;
            }
            vWeChatVoiceImg.y = vPos.y + 3;

            // 先删除缓动
            Game.Tween.removeTweens(vWeChatVoiceImg);

            // 开始闪烁
            vWeChatVoiceImg.alpha = 1;
            let vWeChatVoiceImgTween:Game.Tween = Game.Tween.get(vWeChatVoiceImg, {loop:true});
            vWeChatVoiceImgTween.to({alpha:0.5}, 200).to({alpha:1}, 200);

            this.topGroup.addChild(vWeChatVoiceImg);
        }

        /**
         * 播放微信语音结束
         * @param {number} voiceLocalId
         */
        public playWeChatVoiceEnd(voiceLocalId:number): void {
            let vWeChatVoiceImg:eui.Image = this.getWeChatVoiceImg();
            // 先删除缓动
            Game.Tween.removeTweens(vWeChatVoiceImg);
            // 再移除
            this.topGroup.removeChild(vWeChatVoiceImg);
        }

        /**
         *重置旋转
         * @param {eui.Image} huBgImage
         */
        // private resetRotation(huBgImage:eui.Image):void {
        //     huBgImage.rotation = 0;
        // }

        /**
         * 播放吃碰杠
         * @param {FL.PZOrientation} pzOrientation
         * @param {eui.Image} tweenImage
         */
        private playChiPengGang(pzOrientation:PZOrientation, tweenImage: eui.Image | MahjongCardItem):void {
            if (pzOrientation === PZOrientation.UP) {
                tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = -200;
            } else if (pzOrientation === PZOrientation.DOWN) {
                tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                tweenImage.horizontalCenter = -310, tweenImage.verticalCenter = -30;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                tweenImage.horizontalCenter = 310, tweenImage.verticalCenter = -30;
            }
            //初始化值
            tweenImage.scaleX = 0.5, tweenImage.scaleY = 0.5;
            //缓动后回收
            Game.Tween.get(tweenImage).to({scaleX:1.3, scaleY:1.3}, 102).to({scaleX:1, scaleY:1}, 68).wait(340).call(this.delAndGiveBackImage, this, [tweenImage]);
            this.bottomGroup.addChild(tweenImage);
        }

        /**
         * 从链表中获得一张图片
         * @returns {eui.Image}
         */
        private getImage():eui.Image {
            let self = this;
            let vImage:eui.Image = self._imgLinkedList.pollFirst();
            if (!vImage) {
                vImage = new eui.Image();
            }
            Game.Tween.removeTweens(vImage);
            vImage.filters = null;
            return vImage;
        }

        /**
         * 最上层删除Image 并 归还到链表
         * @param {eui.Image} img
         */
        private delAndGiveBackImageOnTopGroup(img:eui.Image):void {
            //删除
            ViewUtil.removeChild(this.topGroup, img);
            if (this._imgLinkedList.getSize() < 10) {
                //归还 最多存储6个
                this._imgLinkedList.addLast(img);
            }
        }

        /**
         * 最上层删除Component 并 归还到链表
         * @param {eui.Component} com
         */
        private delAndGiveBackComOnTopGroup(com:eui.Component):void {
            //删除
            ViewUtil.removeChild(this.topGroup, com);
            if (this._componentLinkedList.getSize() < 10) {
                //归还 最多存储6个
                this._componentLinkedList.addLast(com);
            }
        }

        /**
         * 最下层删除Image 并 归还到链表
         * @param {eui.Image} img
         */
        private delAndGiveBackImage(img:eui.Image | MahjongCardItem):void {
            //删除
            ViewUtil.removeChild(this.bottomGroup, img);
            if (this._imgLinkedList.getSize() < 10 && (img instanceof eui.Image)) {
                //归还 最多存储6个
                this._imgLinkedList.addLast(img);
            }
        }

        /**
         * 获得图片背景
         * @returns {eui.Image}
         */
        public getHuBgImage():eui.Image {
            let self = this;
            if (!self._huBgImage) {
                let vImage:eui.Image = new eui.Image("hu_bg_png");
                vImage.anchorOffsetX = 154, vImage.anchorOffsetY = 98;
                self._huBgImage = vImage;
            }
            return self._huBgImage;
        }

        /**
         * 获得图片背景
         * @returns {eui.Image}
         */
        public getNewHuBgImage():eui.Image {
            let vImage:eui.Image = new eui.Image("hu_bg_png");
            vImage.anchorOffsetX = 154, vImage.anchorOffsetY = 98;
            this._newHuBgImageArray.push(vImage);
            return vImage;
        }

        /**
         * 获得微信语音图标
         * @returns {eui.Image}
         */
        private getWeChatVoiceImg():eui.Image {
            let self = this;
            if (!self._weChatVoiceImg) {
                let vImage:eui.Image = new eui.Image("voice_left_png");
                vImage.anchorOffsetX = 18, vImage.anchorOffsetY = 18;
                self._weChatVoiceImg = vImage;
            }
            return self._weChatVoiceImg;
        }

        /**
         * 获得补花影片
         * @returns {dragonBones.Movie}
         */
        private getBuhuaMovie():dragonBones.Movie {
            let self = this;
            let vMovie:dragonBones.Movie = self._buhuaMovieLinkedList.pollFirst();
            if (!vMovie) {
                vMovie = DragonBonesUtil.buildMovie(DBGroupName.BU_HUA);
            }
            return vMovie;
        }

        /**
         * 删除 并 归还
         * @param {dragonBones.Movie} e
         */
        private delAndGiveBackMovie(e:dragonBones.MovieEvent):void {
            let vMovie:dragonBones.Movie = e.target;
            //删除播放完成事件
            vMovie.removeEventListener(dragonBones.MovieEvent.COMPLETE, this.delAndGiveBackMovie, this);
            //删除
            ViewUtil.removeChild(this.bottomGroup, vMovie);
            if (this._buhuaMovieLinkedList.getSize() < 6) {
                //归还 最多存储6个
                this._buhuaMovieLinkedList.addLast(vMovie);
            }
        }

        /**
         * 获取头像中点坐标
         * @param {FL.PZOrientation} vPZOrientation
         * @returns {x,y}
         */
        public getIconOrientation(vPZOrientation: PZOrientation): {x:number, y:number} {
            let vMahjongTableBaseView: MahjongTableBaseView = MahjongTableBaseView.getInstance();
            if (vPZOrientation === PZOrientation.UP) {
                let viewX = vMahjongTableBaseView.headViewUp.x;
                let viewY = vMahjongTableBaseView.headViewUp.y;
                let iconX = vMahjongTableBaseView.headViewUp.headIcon.x;
                let iconY = vMahjongTableBaseView.headViewUp.headIcon.y;
                return {x: viewX + iconX + 42, y: viewY + iconY + 42};
            } else if (vPZOrientation === PZOrientation.LEFT) {
                let viewX = vMahjongTableBaseView.headViewLeft.x;
                let viewY = vMahjongTableBaseView.headViewLeft.y;
                let iconX = vMahjongTableBaseView.headViewLeft.headIcon.x;
                let iconY = vMahjongTableBaseView.headViewLeft.headIcon.y;
                return {x: viewX + iconX + 42, y: viewY + iconY + 42};
            } else if (vPZOrientation === PZOrientation.RIGHT) {
                let viewX = vMahjongTableBaseView.headViewRight.x;
                let viewY = vMahjongTableBaseView.headViewRight.y;
                let iconX = vMahjongTableBaseView.headViewRight.headIcon.x;
                let iconY = vMahjongTableBaseView.headViewRight.headIcon.y;
                return {x: viewX + iconX + 42, y: viewY + iconY + 42};
            } else if (vPZOrientation === PZOrientation.DOWN) {
                let viewX = vMahjongTableBaseView.headViewDown.x;
                let viewY = vMahjongTableBaseView.headViewDown.y;
                let iconX = vMahjongTableBaseView.headViewDown.headIcon.x;
                let iconY = vMahjongTableBaseView.headViewDown.headIcon.y;
                return {x: viewX + iconX + 42, y: viewY + iconY + 42};
            }
        }

        /**
         * 开始游戏
         */
        public startGame():void {
            if (this.bottomGroup) {
                this.bottomGroup.removeChildren();
                this.topGroup.removeChildren();
            }
        }

        /**
         * 获取原生语音动画
         */
        public getNativeTalkAni() {
            if (!this._nativeTalkMod) {
                this._nativeTalkMod = new TalkAni();
                this.addChild(this._nativeTalkMod);
            }
            return this._nativeTalkMod;
        }

        // 显示杠牌界面
        private _viewGangCardView:eui.Component;
        public changShaViewGangCard(msg:MahjongChangShaViewGangCardMsgAck) {
            if (!this._viewGangCardView) {
                let vViewGangCardView = new eui.Component();
                vViewGangCardView.skinName = "skins.MahjongBuCardSkin";
                this._viewGangCardView = vViewGangCardView
            }
            if (!msg.isView) {
                ViewUtil.removeChild(this, this._viewGangCardView);
                return;
            }

            this._viewGangCardView["container"].removeChildren();
            let huCard1 = MahjongCardManager.getMahjongCommonCard(msg.card1, 58, 82);
            this._viewGangCardView["container"].addChild(huCard1);
            let huCard2 = MahjongCardManager.getMahjongCommonCard(msg.card2, 58, 82);
            this._viewGangCardView["container"].addChild(huCard2);

            let vPZOrientation:PZOrientation = MahjongHandler.getPZOrientation(msg.playerPos);
            if (vPZOrientation === PZOrientation.UP) {
                this._viewGangCardView.horizontalCenter = 0, this._viewGangCardView.verticalCenter = -200;
            } else if (vPZOrientation === PZOrientation.DOWN) {
                this._viewGangCardView.horizontalCenter = 0, this._viewGangCardView.verticalCenter = -23;
            } else if (vPZOrientation === PZOrientation.LEFT) {
                this._viewGangCardView.horizontalCenter = -310, this._viewGangCardView.verticalCenter = -30;
            } else if (vPZOrientation === PZOrientation.RIGHT) {
                this._viewGangCardView.horizontalCenter = 310, this._viewGangCardView.verticalCenter = -30;
            }
            // if (msg.isView) {
                ViewUtil.addChild(this, this._viewGangCardView);
            // }
        }

    }

}