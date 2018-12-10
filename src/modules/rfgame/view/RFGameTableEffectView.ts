module FL {
    /** 特效表现层 */
    export class RFGameTableEffectView extends BaseView {
        /** 单例 */
        private static _onlyOne: RFGameTableEffectView;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = RFGameTableEffectViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 所有使用的图片 的链表 */
        private _imgLinkedList: Game.LinkedList = new Game.LinkedList();

        /** 所有的发文字 使用的组件的链表 */
        private _componentLinkedList: Game.LinkedList = new Game.LinkedList();


        public bottomGroup: eui.Group;
        public topGroup: eui.Group;

        /** 原生语音组件*/
        private _nativeTalkMod: TalkAni;

        /** 调停者 */
        private _mediator: RFGameTableEffectViewMediator;
        private constructor() {
            super();
            let self = this;
            self.top = self.bottom = self.left = self.right = 0;
            self.touchEnabled = false, self.touchChildren = false;
        }

        public static getInstance(): RFGameTableEffectView {
            if (!this._onlyOne) {
                this._onlyOne = new RFGameTableEffectView();
            }
            return this._onlyOne;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.bottomGroup = new eui.Group();
            self.bottomGroup.width = 1280;
            self.bottomGroup.height = 720;
            self.bottomGroup.left = self.bottomGroup.right = self.bottomGroup.top = self.bottomGroup.bottom = 0;
            self.addChild(self.bottomGroup);

            self.topGroup = new eui.Group();
            self.topGroup.width = 1280;
            self.topGroup.height = 720;
            self.topGroup.left = self.topGroup.right = self.topGroup.top = self.topGroup.bottom = 0;
            self.addChild(self.topGroup);
            self._mediator = new RFGameTableEffectViewMediator(self);
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        /** 从界面移除以后框架自动调用 */
        protected onRemView(): void {

        }

        /**
         * 从链表中获得一张图片
         * @returns {eui.Image}
         */
        private getImage(): eui.Image {
            let self = this;
            let vImage: eui.Image = self._imgLinkedList.pollFirst();
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
        private delAndGiveBackImageOnTopGroup(img: eui.Image): void {
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
        private delAndGiveBackComOnTopGroup(com: eui.Component): void {
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
        private delAndGiveBackImage(img: eui.Image): void {
            //删除
            ViewUtil.removeChild(this.bottomGroup, img);
            if (this._imgLinkedList.getSize() < 10) {
                //归还 最多存储6个
                this._imgLinkedList.addLast(img);
            }
        }

        /**
         * 表情
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} fType
         */
        public playFace(pzOrientation: PZOrientation, fType): void {
            let tweenImage = new eui.Image();
            tweenImage.source = "face" + fType + "_png";
            if (pzOrientation === PZOrientation.UP) {
                tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = -200;
            } else if (pzOrientation === PZOrientation.DOWN) {
                tweenImage.horizontalCenter = 0, tweenImage.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                tweenImage.horizontalCenter = -310, tweenImage.verticalCenter = -30;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                tweenImage.horizontalCenter = 310, tweenImage.verticalCenter = -30;
            }
            Game.Tween.get(tweenImage).to({ verticalCenter: tweenImage.verticalCenter - 30 }, 1000, Game.Ease.elasticOut).call(this.delAndGiveBackImageOnTopGroup, this, [tweenImage]);
            this.topGroup.addChild(tweenImage);
        }

        /**
         * 快捷文字
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} fType
         */
        public playQuickText(pzOrientation: PZOrientation, fType): void {
            let chatText: string = MJGameChatView.getInstance().getQuickTextArr(fType);
            let tweenChatBubble = new eui.Component();
            tweenChatBubble.skinName = "skins.ChatMsgBoxSkin";
            tweenChatBubble["texLabel"].text = chatText;
            //初始化值
            tweenChatBubble.scaleX = 0.33, tweenChatBubble.scaleY = 0.33;
            //缓动后回收
            Game.Tween.get(tweenChatBubble).to({ scaleX: 1.3, scaleY: 1.3 }, 150).to({ scaleX: 1, scaleY: 1 }, 80).wait(1500).call(this.delAndGiveBackComOnTopGroup, this, [tweenChatBubble]);
            this.topGroup.addChild(tweenChatBubble);
            if (pzOrientation === PZOrientation.UP) {
                tweenChatBubble.horizontalCenter = 0, tweenChatBubble.verticalCenter = -200;
                tweenChatBubble["backgroundImg"].scaleX = -1;
                tweenChatBubble["texLabel"].left = 18;
                tweenChatBubble["texLabel"].right = 25;
            } else if (pzOrientation === PZOrientation.DOWN) {
                tweenChatBubble.horizontalCenter = 0, tweenChatBubble.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                tweenChatBubble.x = this.getIconOrientation(PZOrientation.LEFT).x + 80;
                tweenChatBubble.y = this.getIconOrientation(PZOrientation.LEFT).y - 16;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                tweenChatBubble["backgroundImg"].scaleX = -1;
                tweenChatBubble["texLabel"].left = 18;
                tweenChatBubble["texLabel"].right = 25;
                tweenChatBubble.x = this.getIconOrientation(PZOrientation.RIGHT).x - 70 - tweenChatBubble.width;
                tweenChatBubble.y = this.getIconOrientation(PZOrientation.RIGHT).y - 16;
            }
            //道具声音
            RFGameSoundHandle.chat(pzOrientation, fType + 1);
        }
        /**
         * 文字
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} fType
         */
        public playText(pzOrientation: PZOrientation, mText): void {
            let tweenChatBubble = new eui.Component();
            tweenChatBubble.skinName = "skins.ChatMsgBoxSkin";
            tweenChatBubble["texLabel"].text = mText;
            //初始化值
            tweenChatBubble.scaleX = 0.33, tweenChatBubble.scaleY = 0.33;
            //缓动后回收
            Game.Tween.get(tweenChatBubble).to({ scaleX: 1.3, scaleY: 1.3 }, 150).to({ scaleX: 1, scaleY: 1 }, 80).wait(1500).call(this.delAndGiveBackComOnTopGroup, this, [tweenChatBubble]);
            this.topGroup.addChild(tweenChatBubble);
            if (pzOrientation === PZOrientation.UP) {
                tweenChatBubble.horizontalCenter = 0, tweenChatBubble.verticalCenter = -200;
                tweenChatBubble["backgroundImg"].scaleX = -1;
                tweenChatBubble["texLabel"].left = 18;
                tweenChatBubble["texLabel"].right = 25;
            } else if (pzOrientation === PZOrientation.DOWN) {
                tweenChatBubble.horizontalCenter = 0, tweenChatBubble.verticalCenter = 150;
            } else if (pzOrientation === PZOrientation.LEFT) {
                tweenChatBubble.x = this.getIconOrientation(PZOrientation.LEFT).x + 80;
                tweenChatBubble.y = this.getIconOrientation(PZOrientation.LEFT).y - 16;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                tweenChatBubble["backgroundImg"].scaleX = -1;
                tweenChatBubble["texLabel"].left = 18;
                tweenChatBubble["texLabel"].right = 25;
                tweenChatBubble.x = this.getIconOrientation(PZOrientation.RIGHT).x - 70 - tweenChatBubble.width;
                tweenChatBubble.y = this.getIconOrientation(PZOrientation.RIGHT).y - 16;
            }
        }

        /**
      * 送道具
      * @param {Array<number>} start  起点坐标
      * @param {Array<number>} end  终点坐标
      * @param pType 道具类型
      * @param hudongNum 道具声音编号
      */
        public sendProps(start: Array<number>, end: Array<number>, pType, hudongNum: number): void {
            let self = this;
            /**根据路径长度算出播放时间*/
            let time = Math.sqrt((end[0] - start[0]) * (end[0] - start[0]) + (end[1] - start[1]) * (end[1] - start[1])) / 2;
            let vMovie: dragonBones.Movie = DragonBonesUtil.buildMovie(pType);
            vMovie.play("animation1", 0);
            Game.Tween.get(vMovie).to({ x: start[0], y: start[1] }, 0).to({ x: end[0], y: end[1] }, time).call(this.recvProps, this, [vMovie, end, hudongNum]);
            self.topGroup.addChild(vMovie);
        }

        /**
         * 收道具
         * @param vMovie  动画
         * @param {Array<number>} location 道具到达位置坐标
         * @param hudongNum 道具声音编号
         */
        public recvProps(vMovie, location: Array<number>, hudongNum: number): void {
            let self = this;
            vMovie.x = location[0], vMovie.y = location[1];
            vMovie.play("animation2", 1);
            //道具声音
            MJGameSoundHandler.huDong(hudongNum);
            vMovie.addEventListener(dragonBones.MovieEvent.COMPLETE, self.delMovie, self);
        }

        /**
        * 删除动画
        * @param {dragonBones.Movie} e
        */
        private delMovie(e: dragonBones.MovieEvent): void {
            let vMovie: dragonBones.Movie = e.target;
            //删除播放完成事件
            vMovie.removeEventListener(dragonBones.MovieEvent.COMPLETE, this.delMovie, this);
            //删除
            ViewUtil.removeChild(this.topGroup, vMovie);
        }

        /**
         * 获取头像中点坐标
         * @param {FL.PZOrientation} vPZOrientation
         * @returns {x,y}
         */
        public getIconOrientation(vPZOrientation: PZOrientation): { x: number, y: number } {
            let vTableBoardBaseView: RFGameTableBaseView = RFGameTableBaseView.getInstance();
            if (vPZOrientation === PZOrientation.UP) {
                let viewX = vTableBoardBaseView.headViewUp.x;
                let viewY = vTableBoardBaseView.headViewUp.y;
                let iconX = vTableBoardBaseView.headViewUp.headIcon.x;
                let iconY = vTableBoardBaseView.headViewUp.headIcon.y;
                return { x: viewX + iconX + 42, y: viewY + iconY + 42 };
            } else if (vPZOrientation === PZOrientation.LEFT) {
                let viewX = vTableBoardBaseView.headViewLeft.x;
                let viewY = vTableBoardBaseView.headViewLeft.y;
                let iconX = vTableBoardBaseView.headViewLeft.headIcon.x;
                let iconY = vTableBoardBaseView.headViewLeft.headIcon.y;
                return { x: viewX + iconX + 42, y: viewY + iconY + 42 };
            } else if (vPZOrientation === PZOrientation.RIGHT) {
                let viewX = vTableBoardBaseView.headViewRight.x;
                let viewY = vTableBoardBaseView.headViewRight.y;
                let iconX = vTableBoardBaseView.headViewRight.headIcon.x;
                let iconY = vTableBoardBaseView.headViewRight.headIcon.y;
                return { x: viewX + iconX + 42, y: viewY + iconY + 42 };
            } else if (vPZOrientation === PZOrientation.DOWN) {
                let viewX = vTableBoardBaseView.headViewDown.x;
                let viewY = vTableBoardBaseView.headViewDown.y;
                let iconX = vTableBoardBaseView.headViewDown.headIcon.x;
                let iconY = vTableBoardBaseView.headViewDown.headIcon.y;
                return { x: viewX + iconX + 42, y: viewY + iconY + 42 };
            }
        }

        /** 播放动画 */
        public playAni(type: DBGroupName) {
            let self = this;
            let vMovie: dragonBones.Movie = DragonBonesUtil.buildMovie(type);
            vMovie.play("animation", 1);
            vMovie.clipTimeScale = (type == DBGroupName.FEI_JI) ? 2 : 1;
            // vMovie.x = 1280 / 2;
            // vMovie.y = 720 / 2 - 50;
            let props = RFGameViewPropsHandle.getEffProps(type);
            RFGameViewPropsHandle.addPropsToObj(vMovie, props);
            self.topGroup.addChild(vMovie);
            vMovie.addEventListener(dragonBones.MovieEvent.COMPLETE, self.delMovie, self);
        }

        /**
       * 开始游戏
       */
        public startGame(): void {
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
    }
}