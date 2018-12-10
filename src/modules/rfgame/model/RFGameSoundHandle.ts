module FL {
    export class RFGameSoundHandle {

        /** 获取声音资源 */
        public static getSoundResName(type: ECardEffectType, value?: number) {
            let _value = (isNaN(value)) ? "" : value;
            return ECardEffectType[type] + _value + "_mp3";
        }

        /** 播放声音 */
        public static playSound(pzOrientation: PZOrientation, resName: string) {
            //获得性别
            let vSex: number = RFGameHandle.getGamePlayerInfo(pzOrientation).sex;
            if (vSex === 1) {
                //男
                SoundManager.playEffect("M_" + resName);
            } else {
                //女
                SoundManager.playEffect("F_" + resName);
            }
        }

        /** 打牌 */
        public static playCardSound() {
            SoundManager.playEffect('playcard_mp3');
        }

        /** 不要 */
        public static passSound(pzOrientation: PZOrientation) {
            let _value = this.getRandomNumFromField(0, 2);
            let resName = this.getSoundResName(ECardEffectType.Pass, _value);
            this.playSound(pzOrientation, resName);
        }

        /**
      * 播放固定的聊天音效，chatId
      * @param {FL.PZOrientation} pzOrientation
      * @param {number} chatId
      */
        public static chat(pzOrientation: PZOrientation, chatId: number): void {
            if (1 <= chatId && chatId <= 12) {
                let sex = RFGameHandle.getGamePlayerInfo(pzOrientation).sex;
                let temp = (sex) ? "m_" : "f_";
                let resName = temp + "chat_" + chatId + "_mp3";
                SoundManager.playEffect(resName);
            }
        }

        /** 获取区间内的一个随机整值 */
        public static getRandomNumFromField(min: number, max: number) {
            let num = Math.floor(Math.random() * (max - min + 1) + min);
            return num;
        }

        /** 初始化时，发牌的声音 */
        public static sendCardsSound() {
            SoundManager.playEffect('sendcard_mp3');
        }

    }
}