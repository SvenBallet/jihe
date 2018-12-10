module FL {
    export enum MahjongLanguageStyle {
        PUTONGHUA = 1,
        CHANGSHAHUA = 2
    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MahjongSoundHandler
     * @Description:  //打麻将声音处理
     * @Create: DerekWu on 2017/12/4 11:18
     * @Version: V1.0
     */
    export class MahjongSoundHandler {
        /** 麻将语言风格 */
        public static languageStyle: MahjongLanguageStyle = Number(Storage.getMahjongLanguageStyle()) || MahjongLanguageStyle.PUTONGHUA;

        /**
         * 出牌
         * @param {number} cardValue
         * @param {FL.PZOrientation} pzOrientation 牌桌方向
         * @param {boolean} withOnTable 是否同时播放牌放桌子上的声音
         */
        public static chuCard(cardValue:number, pzOrientation:PZOrientation, withOnTable:boolean = true):void {
            this.playMJGameEffect(pzOrientation, this.getCardEffectRes(cardValue), true);
            if (withOnTable) {
                this.cardToTable();
            }
        }

        /**
         * 补花
         * @param {FL.PZOrientation} pzOrientation
         */
        public static buhua(pzOrientation:PZOrientation):void {
            this.playMJGameEffect(pzOrientation, "e_buhua_1_mp3");
        }

        /**
         * 吃
         * @param {FL.PZOrientation} pzOrientation
         */
        public static chi(pzOrientation:PZOrientation):void {
            this.playMJGameEffect(pzOrientation, "e_chi_1_mp3", true);
        }

        /**
         * 碰
         * @param {FL.PZOrientation} pzOrientation
         */
        public static peng(pzOrientation:PZOrientation):void {
            this.playMJGameEffect(pzOrientation, "e_peng_1_mp3", true);
        }

        /**
         * 杠
         * @param {FL.PZOrientation} pzOrientation
         */
        public static gang(pzOrientation:PZOrientation):void {
            this.playMJGameEffect(pzOrientation, "e_gang_1_mp3", true);
        }

        /**
         * 杠
         * @param {FL.PZOrientation} pzOrientation
         */
        public static buZhang(pzOrientation:PZOrientation):void {
            this.playMJGameEffect(pzOrientation, "e_bu_zhang_1_mp3", true);
        }

        /**
         * 听
         * @param {FL.PZOrientation} pzOrientation
         */
        public static ting(pzOrientation:PZOrientation):void {
            this.playMJGameEffect(pzOrientation, "e_ting_1_mp3");
        }

        /**
         * 胡
         * @param {FL.PZOrientation} pzOrientation
         * @param {boolean} isZimo 是否自摸
         */
        public static hu(pzOrientation:PZOrientation, isZimo:boolean = false):void {
            if (!isZimo) {
                this.playMJGameEffect(pzOrientation, "e_hu_1_mp3", true);
            } else {
                this.playMJGameEffect(pzOrientation, "e_hu_zm_1_mp3");
            }
        }

        /**
         * 播放固定的聊天音效，chatId
         * @param {FL.PZOrientation} pzOrientation
         * @param {number} chatId
         */
        public static chat(pzOrientation:PZOrientation, chatId:number):void {
            if (1<=chatId && chatId<=12) {
                this.playMJGameEffect(pzOrientation, "chat_"+chatId+"_mp3");
            }
        }

        /**
         * 播放互动音效
         * @param {number} hudongId
         */
        public static huDong(hudongId:number):void {
            if (1<=hudongId && hudongId<=6) {
                SoundManager.playEffect("hudong_"+hudongId+"_mp3");
            }
        }


        /**
         * 播放麻将游戏音效
         * @param {FL.PZOrientation} pzOrientation 牌桌方向
         * @param {number} string
         */
        private static playMJGameEffect(pzOrientation:PZOrientation, resName:string, haveCS: boolean = false):void {
            if (haveCS && MahjongSoundHandler.languageStyle == 2) {
                resName = "cs_" + resName;
            }

            //获得性别
            let vSex:number = MahjongHandler.getGamePlayerInfo(pzOrientation).sex;
            if (vSex === 1) {
                //男
                SoundManager.playEffect("m_"+resName);
            } else {
                //女
                SoundManager.playEffect("f_"+resName);
            }
        }

        /**
         * 牌放桌子上
         */
        public static cardToTable():void {
            SoundManager.playEffect("dapai_mp3");
        }


        /** 音效resMap */
        private static _cardSoundEffectResMap:{[cardValue:number]:string} = {};

        /**
         * 获得牌的音效资源名
         * @param {number} cardNum
         * @returns {string}
         */
        public static getCardEffectRes(cardValue:number):string {
            return this._cardSoundEffectResMap[cardValue];
        }

        /**
         * 初始化资源
         */
        public static initCardSoundResMap():void {
            let vResMap = this._cardSoundEffectResMap;
            //万
            //万子，一万到九万
            let startNum:number = 1, endNum:number = 9, tempCardNo:number = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vResMap[startNum] = "wan_"+tempCardNo+"_mp3";
            }
            //条子，一条到九条
            startNum = 17, endNum = 25, tempCardNo = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vResMap[startNum] = "tiao_"+tempCardNo+"_mp3";
            }
            //筒子，一筒到九筒
            startNum = 33, endNum = 41, tempCardNo = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vResMap[startNum] = "tong_"+tempCardNo+"_mp3";
            }
            //字 东南西北中发白
            startNum = 49, endNum = 55, tempCardNo = 1;
            for (; startNum <= endNum; ++startNum, ++tempCardNo) {
                vResMap[startNum] = "zi_"+tempCardNo+"_mp3";
            }
        }

    }
}