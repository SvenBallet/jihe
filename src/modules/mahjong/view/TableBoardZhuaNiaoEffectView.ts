module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardZhuaNiaoEffectView
     * @Description:  // 抓鸟效果显示组
     * @Create: DerekWu on 2018/3/15 18:56
     * @Version: V1.0
     */
    export class TableBoardZhuaNiaoEffectView extends eui.Group {

        // 界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM;

        /** 是否庄家中鸟，否则159中鸟 */
        private _isZhuang: boolean;

        /** 是否新的抓鸟协议 */
        private _isNewZhuaNiao: boolean = false;

        /** 鸟牌信息列表 */
        private _niaoArray: Array<{ card: number, isZhong: boolean, pos: number }> = [];

        /** 等待播放索引 */
        private _waitingPlayIndex: number = 0;
        /** 当前正在播放的鸟牌信息 */
        private _currNiaoCard: NiaoCard;
        /** 唯一的鸟动画 */
        private _niaoMovie: dragonBones.Movie = DragonBonesUtil.buildMovie(DBGroupName.ZHUA_NIAO);
        /** 位置已经显示鸟的数量 */
        private _niaoPosNumMap: { [pos: number]: number } = {};

        constructor(isZhuang: boolean, niaoSimpleArray: Array<number>, msg?: MahjongGameOverZhuaNiaoMsgAck) {
            super();
            this.top = this.bottom = this.left = this.right = 0;
            this.touchEnabled = true, this.touchChildren = false;

            // 底层黑色半透明 背景
            let vImg: eui.Image = new eui.Image();
            vImg.source = "wanfa_bg_png", vImg.alpha = 0.5, vImg.top = vImg.bottom = vImg.left = vImg.right = 0;
            this.addChild(vImg);
            
            // 初始化数据
            this._isZhuang = isZhuang;
            if (msg) {
                this._isZhuang = msg.isYiWuJiuZhongNiao ? false : true;
                let vNiaoPaiList: Array<MahjongMaPaiInfo> = msg.niaoPaiList;
                for (let vIndex: number = 0; vIndex < vNiaoPaiList.length; ++vIndex) {
                    this._niaoArray.push({
                        card: vNiaoPaiList[vIndex].card,
                        isZhong: vNiaoPaiList[vIndex].isZhong,
                        pos: vNiaoPaiList[vIndex].tablePos
                    });
                }
                this._isNewZhuaNiao = true;
            } else {
                // 列表中3个元素为1组
                for (let vIndex: number = 0; vIndex < niaoSimpleArray.length; vIndex += 3) {
                    this._niaoArray.push({
                        card: niaoSimpleArray[vIndex],
                        isZhong: niaoSimpleArray[vIndex + 1] === 1,
                        pos: niaoSimpleArray[vIndex + 2]
                    });
                }
            }

            // 设置好鸟列表
            MJGameHandler.setZhuanZhuanNiaoArray(this._niaoArray);

            // 将鸟的锚点居中
            this._niaoMovie.anchorOffsetX = -8;
            this._niaoMovie.anchorOffsetY = -46;
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            // 延迟开始抓鸟
            MyCallBackUtil.delayedCallBack(150, this.startZhuaNiaoEffect, this);
        }

        /**
         * 开始抓鸟效果
         */
        private startZhuaNiaoEffect(): void {
            let self = this;
            // 移除和停止鸟动画
            ViewUtil.removeChild(self, self._niaoMovie);
            self._niaoMovie.stop();

            // 获得当前抓鸟信息
            let vCurrNiao = self._niaoArray[self._waitingPlayIndex];
            // 如果没有了，则结束
            if (!vCurrNiao) {
                if (!MahjongHandler.isReplay()) {
                    MyCallBackUtil.delayedCallBack(700, this.overNiaoEffect, this);
                }
                else {
                    this.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                        MvcUtil.delView(this);
                    },this)
                }
                return;
            }

            // 索引+1，下一次播放的时候就取到下一个值
            self._waitingPlayIndex++;

            // 显示当前鸟牌
            // self.viewOneNiaoCard(vCurrNiao);
            self.viewAllNiaoCards(self._niaoArray);
        }

        /**
         * 结束鸟效果
         */
        private overNiaoEffect(): void {
            // MvcUtil.delView(this);
            // 展示结束界面
            if (this._isNewZhuaNiao) {
                MvcUtil.send(MahjongModule.MAHJONG_OPEN_GAME_OVER_VIEW);
            } else {
                MvcUtil.send(MJGameModule.MJGAME_OPEN_GAME_OVER_VIEW);
            }
        }

        /**
         * 显示所有鸟牌
         */
        private async viewAllNiaoCards(niaoList: { card: number, isZhong: boolean, pos: number }[]) {
            await niaoList.forEach(x => {
                let vNiaoCard: NiaoCard = new NiaoCard();
                // 设置鸟牌
                vNiaoCard.reset(x);
                // 设置坐标
                this.setNiaoCardPos(vNiaoCard);
                // 初始化值
                vNiaoCard.scaleX = 0.33, vNiaoCard.scaleY = 0.33;
                // 缓动后判断是否中鸟
                Game.Tween.get(vNiaoCard).to({ scaleX: 1.3, scaleY: 1.3 }, 80).to({
                    scaleX: 1,
                    scaleY: 1
                }, 80)
                if (x.isZhong) this._currNiaoCard = vNiaoCard;
                this._waitingPlayIndex++;
                this.addChild(vNiaoCard);
            }, this);
            this.playCurrNiaoMovie();
        }

        /**
         * 显示当前鸟牌
         */
        private viewOneNiaoCard(oneNiao: { card: number, isZhong: boolean, pos: number }): void {
            let vNiaoCard: NiaoCard = new NiaoCard();
            // 设置鸟牌
            vNiaoCard.reset(oneNiao);
            // 设置坐标
            this.setNiaoCardPos(vNiaoCard);

            // 设置当前鸟牌
            this._currNiaoCard = vNiaoCard;

            // 当前鸟抓出来的缓动
            // 初始化值
            vNiaoCard.scaleX = 0.33, vNiaoCard.scaleY = 0.33;
            // 缓动后判断是否中鸟
            Game.Tween.get(vNiaoCard).to({ scaleX: 1.3, scaleY: 1.3 }, 80).to({
                scaleX: 1,
                scaleY: 1
            }, 80).wait(0)
                .call(this.playCurrNiaoMovie, this);

            this.addChild(vNiaoCard);
        }

        /**
         * 播放抓鸟Movie动画
         */
        private playCurrNiaoMovie(): void {
            let vCurrNiaoCard: NiaoCard = this._currNiaoCard;
            if (vCurrNiaoCard && vCurrNiaoCard.niaoInfo.isZhong) {
                let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(vCurrNiaoCard.niaoInfo.pos);

                // 鸟Movie动画
                let vNiaoMovie = this._niaoMovie;
                // 鸟飞行的起点位置
                let vStartX = vCurrNiaoCard.x;
                let vStartY = vCurrNiaoCard.y;

                // 到达头像中点位置
                let vEndX = TableBoardEffectView.getInstance().getIconOrientation(vPZOrientation).x;
                let vEndY = TableBoardEffectView.getInstance().getIconOrientation(vPZOrientation).y;

                vNiaoMovie.x = vStartX, vNiaoMovie.y = vStartY;
                // 设置方向
                if (vStartX < vEndX) {
                    vNiaoMovie.scaleX = -1;
                } else {
                    vNiaoMovie.scaleX = 1;
                }

                // 添加、播放、缓动
                this.addChild(vNiaoMovie);
                vNiaoMovie.play("animation", 0);
                let vWeChatVoiceImgTween: Game.Tween = Game.Tween.get(vNiaoMovie);
                let vMoveTimes: number = Math.sqrt(Math.pow(vEndX - vStartX, 2) + Math.pow(vEndY - vStartY, 2)) * 1.5;
                // egret.log("vMoveTimes=" + vMoveTimes);
                if (vMoveTimes > 500) {
                    vMoveTimes = 500;
                }
                vWeChatVoiceImgTween.to({
                    x: vEndX,
                    y: vEndY
                }, vMoveTimes).wait(0).call(this.startZhuaNiaoEffect, this);

            } else {
                // 开始下一个抓鸟效果
                this.startZhuaNiaoEffect();
            }
        }

        /**
         *  设置鸟牌的坐标
         * @param {FL.NiaoCard} niaoCard
         */
        private setNiaoCardPos(niaoCard: NiaoCard): void {
            let self = this;
            // 两个牌中间的距离
            let vCardDistance: number = 100;

            // 鸟牌总数
            let vNiaoNum: number = self._niaoArray.length;
            // if (self._isZhuang && !MahjongHandler.hasMinorGamePlayRule(GameConstant.GAME_PLAY_RULE_ZZ_NIAO_JIA_FAN)) {
            if (self._isZhuang) {
                // 按庄家中鸟
                // 当前位置已经放置了几个鸟
                let vCurrPosNiaoNum: number = 0;
                if (self._niaoPosNumMap[niaoCard.niaoInfo.pos]) {
                    vCurrPosNiaoNum = self._niaoPosNumMap[niaoCard.niaoInfo.pos];
                }
                // 获得方向
                let vPZOrientation: PZOrientation = MahjongHandler.getPZOrientation(niaoCard.niaoInfo.pos);
                // 不同的方向不同的位置
                if (vPZOrientation === PZOrientation.UP) {
                    niaoCard.top = 150;
                    niaoCard.horizontalCenter = 186 - (vCardDistance * vCurrPosNiaoNum);
                } else if (vPZOrientation === PZOrientation.DOWN) {
                    niaoCard.bottom = 150;
                    niaoCard.horizontalCenter = -362 + (vCardDistance * vCurrPosNiaoNum);
                } else if (vPZOrientation === PZOrientation.LEFT) {
                    niaoCard.verticalCenter = -50;
                    niaoCard.left = 200 + (vCardDistance * vCurrPosNiaoNum);
                } else if (vPZOrientation === PZOrientation.RIGHT) {
                    niaoCard.verticalCenter = -50;
                    niaoCard.right = 200 + (vCardDistance * vCurrPosNiaoNum);
                }
                // 设置数量
                self._niaoPosNumMap[niaoCard.niaoInfo.pos] = vCurrPosNiaoNum + 1;
            } else {
                // 159中鸟
                // 当前鸟索引
                let vCurrInex: number = self._waitingPlayIndex - 1;
                niaoCard.verticalCenter = -50;
                if (vNiaoNum === 1) {
                    niaoCard.horizontalCenter = 0;
                } else {
                    let vMinLeft: number = -((vNiaoNum / 2 - 1) * vCardDistance + vCardDistance / 2);
                    niaoCard.horizontalCenter = vMinLeft + (vCurrInex * vCardDistance);
                }
            }
        }

    }
}