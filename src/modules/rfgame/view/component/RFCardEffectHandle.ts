module FL {
    /** 卡牌效果操作类 */
    export class RFCardEffectHandle {
        /** 缓动图片 */
        private _tweenImg: eui.Image;

        /** 显示组 */
        private cView: RFChuGroupHandle;

        /** 牌桌方位 */
        private readonly pzOrientation: PZOrientation = null;

        private cardEffectType: ECardEffectType = null;

        public constructor(pView: RFChuGroupHandle, pzOrientation: PZOrientation) {
            this._tweenImg = new eui.Image();
            this.cView = pView;
            this.pzOrientation = pzOrientation;
            pView._effectGroup.addChild(this._tweenImg);
        }

        /**
         *  处理特效
         * @param {ECardEffectType} type //特效类型
         * @param {number} value  //音效资源对应的值
         */
        public handleEffect(type: ECardEffectType, value?: number) {
            let resName;
            this.cardEffectType = type;
            let _value = (isNaN(value)) ? "" : value;
            //如果是回放，则没有动画
            let useAni = true;
            if (RFGameHandle.isReplay()) useAni = false;
            //普通牌型无特效，特殊牌型有特效，管牌时不显示特效，要不起特殊处理，报单特殊处理
            if (type == ECardEffectType.Single
                || type == ECardEffectType.Double
                || type == ECardEffectType.San
                || type == ECardEffectType.Dani) {//不使用图片特效
                this.tweenAni(resName, false);
                this.playSound(type, value);//播放的声音对应资源有值
            } else if (type == ECardEffectType.SingleEnd) {//报单，添加特效
                this.tweenAni(resName, false);
                this.playSound(type, 0);//播放的声音对应资源有值         
                MvcUtil.send(RFGameModule.CARD_SINGLE_END, this.pzOrientation);
            } else if (type == ECardEffectType.Pass) {//不要，要不起
                resName = ECardEffectType[type] + "_png";
                this.tweenAni(resName);
                this.playSound(type, value);//播放的声音对应资源有值                   
            } else if (type == ECardEffectType.Zhadan
                || type == ECardEffectType.Feiji) {
                this.tweenAni(resName, false);
                this.playSound(type);//播放的声音对应资源没有有值
                MvcUtil.send(RFGameModule.RFGAME_PLAY_CARD_ANI, type);
            }
            else {
                resName = ECardEffectType[type] + "_png";
                this.tweenAni(resName, useAni);
                this.playSound(type);//播放的声音对应资源没有值   
            }
            this.aniEnd();
        }

        /** 播放音效*/
        private playSound(type: ECardEffectType, value?: number) {
            //---test
            let resName = RFGameSoundHandle.getSoundResName(type, value);
            RFGameSoundHandle.playSound(this.pzOrientation, resName);
        }

        /**
         * 缓动动画
         * @param {string} resName //资源名字
         * @param {boolean} useAni //是否使用图片缓动特效
         */
        private tweenAni(resName: string, useAni: boolean = true) {
            if (!useAni) {
                // this.aniEnd();
                return;
            }
            this._tweenImg.horizontalCenter = 0;
            this._tweenImg.verticalCenter = 10;
            // this._tweenImg.y = -20;
            this._tweenImg.alpha = 0;
            this._tweenImg.source = resName;
            if (!this._tweenImg.parent) this.cView._effectGroup.addChild(this._tweenImg);
            let duration = 1000;
            this.aniBegin1(duration);
            // await this.aniEnd();
        }

        /** 动画开始 */
        private aniBegin(duration: number) {
            Game.Tween.get(this._tweenImg)
                .to({ x: 50, alpha: 1 }, duration / 8, Game.Ease.circIn)
                .wait(duration * 2 / 4)
                .to({ x: 150, alpha: 0 }, duration / 8, Game.Ease.circIn)
            // .wait(200)
            // .call(this.aniEnd, this);
        }

        /** 动画开始（根据方向改变） */
        private aniBegin1(duration: number) {
            let startProps = {};
            let endProps = {};
            switch (this.pzOrientation) {
                case PZOrientation.DOWN:
                    this._tweenImg.horizontalCenter = 5;
                    this._tweenImg.verticalCenter = 50;
                    startProps = { verticalCenter: 40, alpha: 1 };
                    endProps = { verticalCenter: 30, alpha: 0 };
                    break;
                case PZOrientation.UP:
                    // startProps = { verticalCenter: 30, alpha: 1 };
                    // endProps = { verticalCenter: 20, alpha: 0 };
                    this._tweenImg.horizontalCenter = 50;
                    this._tweenImg.verticalCenter = 50;
                    startProps = { horizontalCenter: 30, alpha: 1 };
                    endProps = { horizontalCenter: 20, alpha: 0 };
                    break;
                case PZOrientation.LEFT:
                    this._tweenImg.horizontalCenter = -35;
                    this._tweenImg.verticalCenter = 50;
                    startProps = { horizontalCenter: -10, alpha: 1 };
                    endProps = { horizontalCenter: -20, alpha: 0 };
                    break;
                case PZOrientation.RIGHT:
                    this._tweenImg.horizontalCenter = 50;
                    this._tweenImg.verticalCenter = 50;
                    startProps = { horizontalCenter: 30, alpha: 1 };
                    endProps = { horizontalCenter: 20, alpha: 0 };
                    break;
            }
            Game.Tween.get(this._tweenImg)
                .to(startProps, duration / 8, Game.Ease.circIn)
                .wait(duration * 2 / 4)
                .to(endProps, duration / 8, Game.Ease.circIn)
            // .wait(200)
            // .call(this.aniEnd, this);
        }

        /** 动画结束 */
        private aniEnd() {
            if (this.cardEffectType == ECardEffectType.Pass) {
                //要不起没有出牌音效
                return;
            }
            //---test
            this.cView.drawCards(this.cView.data.data);
            RFGameSoundHandle.playCardSound();
        }
    }
}