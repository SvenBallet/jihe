module FL {
    export enum MahjongCardType {
        HAND,   // 手牌
        OUT,    // 出牌
        EAT,    // 吃、碰、杠牌
        ANGANG, // 暗杠
        MING,   // 明牌
        REPLAY  // 回放
    }

    export enum MahjongCardBgColor {
        GREEN = 1,
        YELLOW = 2,
        BLUE = 3
    }

    export class MahjongCardItem extends eui.Component {
        private bgImg: eui.Image;
        private cardImg: eui.Image;
        private oritation: PZOrientation;
        private type: MahjongCardType;
        private bgImgStr: string = "";
        public static cardBgColor: MahjongCardBgColor = Number(Storage.getMJPBResPrefix());

        public constructor() {
            super();
            this.bgImg = new eui.Image();
            this.cardImg = new eui.Image();
            this.addChild(this.bgImg);
            this.addChild(this.cardImg);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        }

        private onRemove() {
            MahjongCardManager._recycle(this);
        }

        /** 设置手牌 */
        public _setHandCard(cardValue: number, pos: PZOrientation) {
            this.oritation = pos;
            this.type = MahjongCardType.HAND;
            this.cardImg.source = this._getCardImgStr(cardValue, pos);
            if (pos == PZOrientation.DOWN) {
                this.bgImgStr = "mjbg_down_hand_";
                this.width = 86;
                this.height = 129;
                this.bgImg.width = 86;
                this.bgImg.height = 129;
                this.cardImg.width = 86;
                this.cardImg.height = 129;
            }
            else if (pos == PZOrientation.UP) {
                this.bgImgStr = "mjbg_up_hand_";
                // this.width = 42;
                // this.height = 64;
                // this.bgImg.width = 43;
                // this.bgImg.height = 64;

                this.width = 47;
                this.height = 70;
                this.bgImg.width = 47;
                this.bgImg.height = 70;
            }
            else if (pos == PZOrientation.LEFT) {
                this.bgImgStr = "mjbg_left_hand_";
                // this.width = 24;
                // this.height = 60;
                // this.bgImg.width = 24;
                // this.bgImg.height = 60;

                this.width = 25;
                this.height = 59;
                this.bgImg.width = 25;
                this.bgImg.height = 59;
            }
            else if (pos == PZOrientation.RIGHT) {
                this.bgImgStr = "mjbg_right_hand_";
                // this.width = 24;
                // this.height = 60;
                // this.bgImg.width = 24;
                // this.bgImg.height = 60;

                this.width = 25;
                this.height = 59;
                this.bgImg.width = 25;
                this.bgImg.height = 59;
            }
            this.bgImg.source = this.bgImgStr + this._getColorStr(MahjongCardItem.cardBgColor) +"_png";
        }

        /** 设置出牌 */
        public _setOutCard(cardValue: number, pos: PZOrientation) {
            this.oritation = pos;
            this.type = MahjongCardType.OUT;
            this.cardImg.source = this._getCardImgStr(cardValue, pos);
            if (pos == PZOrientation.DOWN) {
                this.bgImgStr = "mjbg_down_eat_";
                // this.width = 38;
                // this.height = 58;
                // this.bgImg.width = 38;
                // this.bgImg.height = 58;
                // this.cardImg.width = 84;
                // this.cardImg.height = 124;
                // this.cardImg.scaleX = this.cardImg.scaleY = 0.45;
                // this.cardImg.y = -11;

                this.width = 45;
                this.height = 69;
                this.bgImg.width = 45;
                this.bgImg.height = 69;
                this.cardImg.width = 43;
                this.cardImg.height = 66;
                this.cardImg.x = 1;
                this.cardImg.y = -14;
            }
            else if (pos == PZOrientation.UP) {
                this.bgImgStr = "mjbg_up_out_";
                // this.width = 38;
                // this.height = 58;
                // this.bgImg.width = 38;
                // this.bgImg.height = 58;
                // this.cardImg.width = 84;
                // this.cardImg.height = 124;
                // this.cardImg.scaleX = this.cardImg.scaleY = 0.45;
                // this.cardImg.y = -11;

                this.width = 45;
                this.height = 69;
                this.bgImg.width = 45;
                this.bgImg.height = 69;
                this.cardImg.width = 43;
                this.cardImg.height = 66;
                this.cardImg.x = 1;
                this.cardImg.y = -14;
            }
            else if (pos == PZOrientation.LEFT) {
                this.bgImgStr = "mjbg_left_out_";
                // this.width = 49;
                // this.height = 40;
                // this.bgImg.width = 49;
                // this.bgImg.height = 40;
                // this.cardImg.width = 49;
                // this.cardImg.height = 40;

                this.width = 58;
                this.height = 47;
                this.bgImg.width = 58;
                this.bgImg.height = 47;
                this.cardImg.width = 58;
                this.cardImg.height = 47;
            }
            else if (pos == PZOrientation.RIGHT) {
                this.bgImgStr = "mjbg_right_out_";
                // this.width = 49;
                // this.height = 40;
                // this.bgImg.width = 49;
                // this.bgImg.height = 40;
                // this.cardImg.width = 49;
                // this.cardImg.height = 40;
                // this.cardImg.x = 49;
                // this.cardImg.y = 28;
                // this.cardImg.scaleX = this.cardImg.scaleY = -1;

                this.width = 58;
                this.height = 47;
                this.bgImg.width = 58;
                this.bgImg.height = 47;
                this.cardImg.width = 58;
                this.cardImg.height = 47;
                this.cardImg.x = 58;
                this.cardImg.y = 32;
                this.cardImg.scaleX = this.cardImg.scaleY = -1;
            }
            this.bgImg.source = this.bgImgStr + this._getColorStr(MahjongCardItem.cardBgColor) +"_png";
        }

        /** 设置吃、碰、杠 */
        public _setEatCard(cardValue: number, pos: PZOrientation) {
            this.oritation = pos;
            this.type = MahjongCardType.EAT;
            this.cardImg.source = this._getCardImgStr(cardValue, pos);
            if (pos == PZOrientation.DOWN) {
                this.bgImgStr = "mjbg_down_eat_";
                this.width = 68;
                this.height = 106;
                this.bgImg.width = 68;
                this.bgImg.height = 106;
                this.cardImg.width = 84;
                this.cardImg.height = 124;
                this.cardImg.scaleX = this.cardImg.scaleY = 0.85;
                this.cardImg.x = -2;
                this.cardImg.y = -23;
            }
            else if (pos == PZOrientation.UP) {
                this.bgImgStr = "mjbg_up_out_";
                // this.width = 38;
                // this.height = 59;
                // this.bgImg.width = 38;
                // this.bgImg.height = 59;
                // this.cardImg.width = 84;
                // this.cardImg.height = 124;
                // this.cardImg.scaleX = this.cardImg.scaleY = 0.45;
                // this.cardImg.y = -11;

                this.width = 45;
                this.height = 69;
                this.bgImg.width = 45;
                this.bgImg.height = 69;
                this.cardImg.width = 43;
                this.cardImg.height = 66;
                this.cardImg.x = 1;
                this.cardImg.y = -14;

            }
            else if (pos == PZOrientation.LEFT) {
                this.bgImgStr = "mjbg_left_out_";
                // this.width = 46;
                // this.height = 38;
                // this.bgImg.width = 46;
                // this.bgImg.height = 38;
                // this.cardImg.width = 46;
                // this.cardImg.height = 38;

                this.width = 58;
                this.height = 47;
                this.bgImg.width = 58;
                this.bgImg.height = 47;
                this.cardImg.width = 58;
                this.cardImg.height = 47;
            }
            else if (pos == PZOrientation.RIGHT) {
                this.bgImgStr = "mjbg_right_out_";
                // this.width = 46;
                // this.height = 38;
                // this.bgImg.width = 46;
                // this.bgImg.height = 38;
                // this.cardImg.width = 46;
                // this.cardImg.height = 38;
                // this.cardImg.x = 46;
                // this.cardImg.y = 27;
                // this.cardImg.scaleX = this.cardImg.scaleY = -1;

                this.width = 58;
                this.height = 47;
                this.bgImg.width = 58;
                this.bgImg.height = 47;
                this.cardImg.width = 58;
                this.cardImg.height = 47;
                this.cardImg.x = 58;
                this.cardImg.y = 32;
                this.cardImg.scaleX = this.cardImg.scaleY = -1;

            }
            this.bgImg.source = this.bgImgStr + this._getColorStr(MahjongCardItem.cardBgColor) +"_png";
        }

        /** 设置暗杠 */
        public _setAnGangCard(cardValue: number, pos: PZOrientation) {
            this.oritation = pos;
            this.type = MahjongCardType.ANGANG;
            if (pos == PZOrientation.DOWN) {
                this.bgImgStr = "mjbg_down_angang_";
                this.width = 68;
                this.height = 106;
                this.bgImg.width = 68;
                this.bgImg.height = 106;
            }
            else if (pos == PZOrientation.UP) {
                this.bgImgStr = "mjbg_up_angang_";
                // this.width = 38;
                // this.height = 59;
                // this.bgImg.width = 38;
                // this.bgImg.height = 59;

                this.width = 45;
                this.height = 69;
                this.bgImg.width = 45;
                this.bgImg.height = 69;
            }
            else if (pos == PZOrientation.LEFT) {
                this.bgImgStr = "mjbg_left_angang_";
                // this.width = 46;
                // this.height = 38;
                // this.bgImg.width = 46;
                // this.bgImg.height = 38;

                this.width = 58;
                this.height = 47;
                this.bgImg.width = 58;
                this.bgImg.height = 47;
            }
            else if (pos == PZOrientation.RIGHT) {
                this.bgImgStr = "mjbg_right_angang_";
                // this.width = 46;
                // this.height = 38;
                // this.bgImg.width = 46;
                // this.bgImg.height = 38;

                this.width = 58;
                this.height = 47;
                this.bgImg.width = 58;
                this.bgImg.height = 47;
            }
            this.bgImg.source = this.bgImgStr + this._getColorStr(MahjongCardItem.cardBgColor) +"_png";
        }

        /** 设置明牌 */
        public _setMingCard(cardValue: number, pos: PZOrientation) {
            this.oritation = pos;
            this.type = MahjongCardType.MING;
            this.cardImg.source = this._getCardImgStr(cardValue, pos);
            if (pos == PZOrientation.DOWN) {
                this.bgImgStr = "mjbg_down_eat_";
                this.width = 75;
                this.height = 113;
                this.bgImg.width = 75;
                this.bgImg.height = 113;
                this.cardImg.width = 84;
                this.cardImg.height = 124;
                this.cardImg.scaleX = this.cardImg.scaleY = 0.9;
                this.cardImg.x = 0;
                this.cardImg.y = -25;
            }
            else if (pos == PZOrientation.UP) {
                this.bgImgStr = "mjbg_up_out_";
                this.width = 48;
                this.height = 68;
                this.bgImg.width = 48;
                this.bgImg.height = 68;
                this.cardImg.width = 84;
                this.cardImg.height = 124;
                this.cardImg.scaleX = this.cardImg.scaleY = 0.55;
                this.cardImg.x = 1;
                this.cardImg.y = -15;
            }
            else if (pos == PZOrientation.LEFT) {
                this.bgImgStr = "mjbg_left_out_";
                this.width = 59;
                this.height = 50;
                this.bgImg.width = 59;
                this.bgImg.height = 50;
                this.cardImg.width = 59;
                this.cardImg.height = 50;
            }
            else if (pos == PZOrientation.RIGHT) {
                this.bgImgStr = "mjbg_right_out_";
                this.width = 59;
                this.height = 50;
                this.bgImg.width = 59;
                this.bgImg.height = 50;
                this.cardImg.width = 59;
                this.cardImg.height = 50;
                this.cardImg.x = 59;
                this.cardImg.y = 35;
                this.cardImg.scaleX = this.cardImg.scaleY = -1;
            }
            this.bgImg.source = this.bgImgStr + this._getColorStr(MahjongCardItem.cardBgColor) +"_png";
        }

        /** 设置回放牌 */
        public _setReplayCard(cardValue: number, pos: PZOrientation) {
            this.oritation = pos;
            this.type = MahjongCardType.REPLAY;
            this.cardImg.source = this._getCardImgStr(cardValue, pos);
            if (pos == PZOrientation.DOWN) {
                this.bgImgStr = "mjbg_down_hand_";
                this.width = 86;
                this.height = 129;
                this.bgImg.width = 86;
                this.bgImg.height = 129;
                this.cardImg.width = 86;
                this.cardImg.height = 129;
            }
            else if (pos == PZOrientation.UP) {
                this.bgImgStr = "mjbg_down_hand_";
                // this.width = 42;
                // this.height = 64;
                // this.bgImg.width = 42;
                // this.bgImg.height = 64;
                // this.cardImg.width = 42;
                // this.cardImg.height = 64;

                this.width = 47;
                this.height = 70;
                this.bgImg.width = 47;
                this.bgImg.height = 70;
                this.cardImg.width = 47;
                this.cardImg.height = 70;
            }
            else if (pos == PZOrientation.LEFT) {
                this.bgImgStr = "mjbg_left_out_";
                // this.width = 49;
                // this.height = 40;
                // this.bgImg.width = 49;
                // this.bgImg.height = 40;
                // this.cardImg.width = 49;
                // this.cardImg.height = 40;

                this.width = 58;
                this.height = 47;
                this.bgImg.width = 58;
                this.bgImg.height = 47;
                this.cardImg.width = 58;
                this.cardImg.height = 47;
            }
            else if (pos == PZOrientation.RIGHT) {
                this.bgImgStr = "mjbg_right_out_";
                // this.width = 49;
                // this.height = 40;
                // this.bgImg.width = 49;
                // this.bgImg.height = 40;
                // this.cardImg.width = 49;
                // this.cardImg.height = 40;
                // this.cardImg.x = 49;
                // this.cardImg.y = 28;
                // this.cardImg.scaleX = this.cardImg.scaleY = -1;

                this.width = 58;
                this.height = 47;
                this.bgImg.width = 58;
                this.bgImg.height = 47;
                this.cardImg.width = 58;
                this.cardImg.height = 47;
                this.cardImg.x = 58;
                this.cardImg.y = 32;
                this.cardImg.scaleX = this.cardImg.scaleY = -1;
            }
            this.bgImg.source = this.bgImgStr + this._getColorStr(MahjongCardItem.cardBgColor) +"_png";
        }

        /** 设置通用牌 */
        public _setCommonCard(cardValue: number, w: number, h: number, angang: boolean = false) {
            this.oritation = PZOrientation.DOWN;
            this.type = MahjongCardType.HAND;
            if (angang) {
                this.bgImgStr = "mjbg_up_hand_";
            }
            else {
                this.cardImg.source = this._getCardImgStr(cardValue, PZOrientation.DOWN);
                this.bgImgStr = "mjbg_down_hand_";
            }
            this.width = w;
            this.height = h;
            this.bgImg.top = this.bgImg.bottom = this.bgImg.left = this.bgImg.right = 0;
            this.cardImg.top = this.cardImg.bottom = this.cardImg.left = this.cardImg.right = 0;
            this.bgImg.source = this.bgImgStr + this._getColorStr(MahjongCardItem.cardBgColor) +"_png";
        }

        /** 重设通用牌的牌值 */
        public resetCommonCardValue(cardValue: number) {
            this.cardImg.source = this._getCardImgStr(cardValue, this.oritation);
        }

        private _getColorStr(color: MahjongCardBgColor):string {
            let colorStr = "green";
            if (color == MahjongCardBgColor.BLUE) {
                colorStr = "blue";
            }
            else if (color == MahjongCardBgColor.YELLOW) {
                colorStr = "yellow";
            }
            return colorStr;
        }

        private _getCardImgStr(cardValue: number, pos: PZOrientation):string {
            let cardImgStr = "";
            let orientationStr = "h";
            let valueStr = "1"
            let huaStr = "";
            if (pos == PZOrientation.DOWN || pos == PZOrientation.UP) {
                orientationStr = "s"
            }

            if (cardValue >= 1 && cardValue <= 9) {
                huaStr = "_character_";
                valueStr = cardValue + "";
            }
            else if (cardValue >= 17 && cardValue <= 25) {
                huaStr = "_bamboo_";
                valueStr = (cardValue - 16) + "";
            }
            else if (cardValue >= 33 && cardValue <= 41) {
                huaStr = "_dot_";
                valueStr = (cardValue - 32) + "";
            }
            else if (cardValue >= 49 && cardValue <= 55) {
                huaStr = "_wind_";
                valueStr = (cardValue - 48) + "";
            }
            else {
                return "";
            }
            cardImgStr = orientationStr + huaStr + valueStr + "_png";

            return cardImgStr;
        }

        /** 重置背景 */
        public reBgImg() {
            this.bgImg.source = this.bgImgStr + this._getColorStr(MahjongCardItem.cardBgColor) +"_png";
        }

        /** 回收,保证重设所有设置过的属性 */
        public recycle() {
            this.bgImg.source = null;
            this.cardImg.source = null;

            this.width = 0;
            this.height = 0;
            this.bgImg.width = 0;
            this.bgImg.height = 0;
            this.cardImg.width = 0;
            this.cardImg.height = 0;
            this.cardImg.x = 0;
            this.cardImg.y = 0;
            this.cardImg.scaleX = this.cardImg.scaleY = 1;
            this.type = MahjongCardType.HAND;
        }
    }
}