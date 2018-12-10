module FL {

    /**
	 * 本地缓存统一管理
     */
	export class Storage {

		/** 背景音乐音量 */
		public static readonly MUSIC_VOLUME:string = "MUSIC_VOLUME";
		/** 音效音量 */
		public static readonly EFFECT_VOLUME:string = "EFFECT_VOLUME";

		/** 金币场选择玩法 */
		public static readonly GOLD_PLAY_WAY:string = "GOLD_PLAY_WAY";

        /** 麻将牌背资源前缀 */
        public static readonly MJ_PB_RES_PREFIX:string = "MJ_PB_RES_PREFIX";
        /** 扑克风格 */
        public static readonly POKER_STYLE:string = "POKER_STYLE";
        /** 牌桌资源名 */
        public static readonly PZ_RES_NAME:string = "PZ_RES_NAME";
        /** 微信登陆TOKEN信息 */
        public static readonly WX_ACCESS_TOKEN_INFO: string = "WX_ACCESS_TOKEN_INFO";
        /** 闲聊登陆TOKEN信息 */
        public static readonly XL_ACCESS_TOKEN_INFO: string = "XL_ACCESS_TOKEN_INFO";
        /** 麻将语言风格 */
        public static readonly MAHJONG_LANGUAGE_STYLE: string = "MAHJONG_LANGUAGE_STYLE";

		public static getMusicVolume():number {
			let volume = this.getItem(this.MUSIC_VOLUME);
			if(!volume)
				return 1;
			return Number(volume);
		}

        public static setMusicVolume(volume:number) {
			this.setItem(this.MUSIC_VOLUME,volume.toString());
		}

        public static getEffectVolume():number {
            let volume = this.getItem(this.EFFECT_VOLUME);
            if(!volume)
                return 1;
            return Number(volume);
        }

        public static setEffectVolume(volume:number) {
			this.setItem(this.EFFECT_VOLUME,volume.toString());
		}

        public static getGoldPlayWay():number {
            let volume = this.getItem(this.GOLD_PLAY_WAY);
            if(!volume)
                return MJRoomID.ZHUAN_ZHUAN;
            return Number(volume);
        }

        public static setGoldPlayWay(playerWay:number) {
            this.setItem(this.GOLD_PLAY_WAY, playerWay.toString());
        }

        public static getPZResName():string {
            let volume = this.getItem(this.PZ_RES_NAME);
            if(!volume)
                return "pz_bg_green_jpg";
            return volume;
        }

        public static setPZResName(pzResName:string) {
            this.setItem(this.PZ_RES_NAME, pzResName);
        }

        public static getMJPBResPrefix():string {
            return this.getItem(this.MJ_PB_RES_PREFIX);
        }

        public static setMJPBResPrefix(mjResPrefix:string) {
            this.setItem(this.MJ_PB_RES_PREFIX, mjResPrefix);
        }

        public static getPokerStyle():string {
            return this.getItem(this.POKER_STYLE)
        }

        public static setPokerStyle(pokerStyle:string) {
            this.setItem(this.POKER_STYLE, pokerStyle);
        }

        public static getMahjongLanguageStyle():string {
            return this.getItem(this.MAHJONG_LANGUAGE_STYLE)
        }

        public static setMahjongLanguageStyle(style:string) {
            this.setItem(this.MAHJONG_LANGUAGE_STYLE, style);
        }

        public static setItem(key:string, value:string): boolean{
			return egret.localStorage.setItem(key,value);
		}

        public static getItem(key:string): string{
			return egret.localStorage.getItem(key) || null;
		}

        public static removeItem(key:string){
            return egret.localStorage.removeItem(key);
        }

        public static setItemNum(key:string, value:number): void{
            egret.localStorage.setItem(key,""+value);
        }

        public static getItemNum(key:string): number {
            let tempNum: string = egret.localStorage.getItem(key) || null;
            // let tempNum: string = egret.localStorage.getItem(key);
            if (tempNum) {
                return Number(tempNum);
            } else {
                return null;
            }
        }
	}

}