/**
 * 
 * @Name:  FL - SoundManager
 * @Description:  //声音管理
 * @Create: DerekWu on 2016/4/8 22:05
 * @Version: V1.0
 */
module FL {
    export class SoundManager {

        //背景音乐大小
        private static _bgMusicVolume:number = Storage.getMusicVolume();
        //音效声音大小
        private static _effectVolume:number = Storage.getEffectVolume();

        //是否开启声音管理
        private static _enable: boolean = false;
        //当前設置的背景音乐的名字
        private static _nowBg: string = null;
        //当前背景音乐的频道
        private static _bgC: egret.SoundChannel;
        // 当前正在播放的背景音乐的名字
        private static _nowPlayBg: string = null;
        //上次播放音效时间存储字段
        private static _durTDic:{[name:string]:number} = {};
        //循环音效存储字典
        private static _effectLoopDic:{[name:string]:egret.SoundChannel} = {};
        //音效默认多长时间不能再次播放
        public static _defaultDurT:number = 100;

        /**
         * 播放背景音乐
         * @param {string} mp3 xxx_mp3
         * @param {number=0} times 播放次数,默认循环
         */
        public static playBg(mp3: string, times: number = 0): void {
            if (this._nowBg == mp3)
                return;
            this._nowBg = mp3;

            let sd:egret.Sound = RES.getRes(this._nowBg);
            if (sd) {
                this.playBgChannel();
            } else {
                this.loadBgAndPlay(mp3);
            }
        }

        private static async loadBgAndPlay(mp3:string) {
            try {
                await RES.getResAsync(mp3);
                this.playBgChannel();
            } catch (e) {
                FL.AsyncError.exeError(e);
            }
        }

        private static playBgChannel():void {
            if (!this._enable) return;

            if (this._nowPlayBg === this._nowBg) return;

            if (this._bgC) {
                // Game.Tween.removeTweens(this._bgC);
                try{
                    this._nowPlayBg = null;
                    this._bgC.stop();
                }catch(e){

                }
            }
            if (this._nowBg) {
                let sd:egret.Sound = RES.getRes(this._nowBg);
                if(!sd)
                    return;
                this._bgC = sd.play(0, 0);
                if (this._bgC == null)
                    return;
                this._nowPlayBg = this._nowBg;
                this._bgC.volume = this._bgMusicVolume;

                // this._bgC.volume = 0;
                // Game.Tween.get(this._bgC).to({ volume: 1.0 }, 3000);
            }
        }

        private static stopBgChannel():void {
            if (this._bgC) {
                // Game.Tween.removeTweens(this._bgC);
                try{
                    // this._nowBg = null;
                    this._nowPlayBg = null;
                    this._bgC.stop();
                }catch(e){

                }
            }
        }

        /**
         * 激活声音
         */
        public static enableSound():void {
            this._enable = true;
            this.playBgChannel();
        }

        public static stopSound():void {
            this._enable = false;
            this.stopBgChannel();
        }

        /**
         * 循环播放音效
         * @param {string} mp3 xxx_mp3
         * @param {number=1} toV
         */
        public static playEffectLoop(mp3: string, toV: number = 1): void {
            if (!this._enable)
                return;
            if(this._effectLoopDic[mp3]!=null)
                return;
            let sd:egret.Sound = RES.getRes(mp3);
            if(!sd)
                return;
            let cc: egret.SoundChannel = sd.play(0,0);
            if (cc == null)
                return;
            cc.volume = this._effectVolume * toV;
            this._effectLoopDic[mp3] = cc;
        }

        /**
         * 停止循环音效的播放
         * @param {string} mp3
         */
        public static stopEffectLoop(mp3: string): void {
            if(this._effectLoopDic[mp3]==null)
                return;
            let cc:egret.SoundChannel = this._effectLoopDic[mp3];
            cc.stop();
            delete this._effectLoopDic[mp3];
        }

        /**
         * 播放音效
         * @param {string} mp3 音效名称 xxx_mp3
         * @param {number=1} toV 音效大小
         * @param {number=0} durT 多长时间以内不能再次播放次音效
         */
        public static playEffect(mp3: string, toV: number = 1, durT: number = 0): void {
            // egret.log("## mp3 = "+mp3);
            if (!mp3) return;
            let self = this;
            if (!self._enable)
                return;
            let vTempSurT:number = durT <= 0?self._defaultDurT:durT;
            if (vTempSurT > 0) {
                if (self._durTDic[mp3] == null)
                    self._durTDic[mp3] = 0;
                let t: number = new Date().getTime();
                if (t - self._durTDic[mp3] < vTempSurT)
                    return;
                self._durTDic[mp3] = t;
            }
            let sd:egret.Sound = RES.getRes(mp3);
            if(!sd) {
                this.loadEffectAndPlay(mp3, toV);
                return;
            }
            let cc: egret.SoundChannel = sd.play(0, 1);
            if (cc == null)
                return;
            cc.volume = this._effectVolume * toV;
        }

        private static async loadEffectAndPlay(mp3:string, toV: number = 1) {
            try {
                let vCurrSound: egret.Sound = await RES.getResAsync(mp3);
                let cc: egret.SoundChannel = vCurrSound.play(0, 1);
                if (cc == null)
                    return;
                cc.volume = this._effectVolume * toV;
            } catch (e) {
                FL.AsyncError.exeError(e);
            }
        }

        /**
         * 重新设置背景音乐声音大小
         * @param {number} pVolume
         */
        public static resetBgMusicVolume(pVolume:number):void {
            if (pVolume <= 0) {
                this._bgMusicVolume = 0;
            } else if (pVolume > 1) {
                this._bgMusicVolume = 1;
            } else {
                this._bgMusicVolume = pVolume;
            }
            if (this._bgC) {
                this._bgC.volume = this._bgMusicVolume;
            }
            Storage.setMusicVolume(this._bgMusicVolume);
        }

        /**
         * 重新设置音效声音大小
         * @param {number} pVolume
         */
        public static resetEffectVolume(pVolume:number):void {
            if (pVolume <= 0) {
                this._effectVolume = 0;
            } else if (pVolume > 1) {
                this._effectVolume = 1;
            } else {
                this._effectVolume = pVolume;
            }
            Storage.setEffectVolume(this._effectVolume);
        }

        public static getEffectVolume()
        {
            return this._effectVolume;
        }
        public static getBGMusicVolume()
        {
            return this._bgMusicVolume;
        }

    }
}