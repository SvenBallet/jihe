module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - PZHeadAreaView
     * @Description:  //牌桌头像区域界面
     * @Create: DerekWu on 2017/11/16 19:14
     * @Version: V1.0
     */
    export class PZHeadAreaView extends eui.Component {

        /** 头像icon背景 */
        public headIconBg: eui.Image;
        /** 头像icon */
        public headIcon: eui.Image;
        /** 离线标记 */
        public offlineFlag: eui.Image;
        /** 距离过近标记*/
        public closeDistanceFlag: eui.Image;
        /** 玩家长名字 12个汉字+..*/
        public playerLongName: eui.Label;
        /** 已选择的人数模式文字 */
        public selectedPlayerNumPattern: eui.Label;
        /** ok标识 */
        public okIcon: eui.Image;
        /** gps标识 */
        public gpsIcon: eui.Image;
        /** 玩家信息组 */
        public playerInfoGroup: eui.Group;
        /** 玩家短名字 6个汉字+.. */
        public playerShortName: eui.Label;
        /** 玩家分数 */
        public playerScore: eui.Label;
        /** 房主标识 */
        public roomOwnerIcon: eui.Image;
        /** 庄家标识 */
        public zhuangIcon: eui.Image;
        /** 坐和拉Icon */
        public zuoAndLaIcon: eui.Image;
        /** 跑和下码Icon */
        public paoAndXiaMaIcon: eui.Image;
        /** 飘分Icon*/
        public piaoIcon: eui.Image;
        /** 听牌标识 */
        public tingIcon: eui.Image;

        /** 是否在打牌中 */
        private _isStartGame: boolean;

        /** 牌桌方向 */
        private _pzOrientation: PZOrientation;
        /**语音动画 */
        public talkAniMod: FL.TalkAni;
        /** GPS是否已经开启*/
        public isGpsOn: boolean = false;

        public timeoutGro:eui.Group;
        public darkImg:eui.Image;
        public lightImg:eui.Image;

        /**
         * 初始化
         * @param {FL.PZOrientation} orientation 方向
         */
        public init(orientation: PZOrientation): void {
            let self = this;
            //移除缓动
            Game.Tween.removeTweens(self);
            //设置头像Icon 为默认
            self.headIcon.source = "";
            this.clearHeadImg();
            self.headIcon["head_icon_url"] = "";  // 起到防止重复设置的作用
            self.closeDistanceFlag.touchEnabled = false;

            self._pzOrientation = orientation;

            //设置位置 和 变动玩家信息组位置
            // if (orientation === PZOrientation.UP) {
            //     self.top = 100;
            //     self.horizontalCenter = 0;
            //     self.playerInfoGroup.x = 116;
            //     self.playerInfoGroup.y = 110;
            // } else if (orientation === PZOrientation.DOWN) {
            //     self.bottom = 50;
            //     self.horizontalCenter = 0;
            //     self.playerInfoGroup.x = 275;
            //     self.playerInfoGroup.y = 26;
            // } else if (orientation === PZOrientation.LEFT) {
            //     self.left = 61;
            //     self.verticalCenter = 18;
            //     self.playerInfoGroup.x = 138
            //     self.playerInfoGroup.y = 110;
            // } else if (orientation === PZOrientation.RIGHT) {
            //     self.right = 61;
            //     self.verticalCenter = 18;
            //     self.playerInfoGroup.x = 138;
            //     self.playerInfoGroup.y = 110;
            // }
            let props = RFGameViewPropsHandle.getInfoProps(self._pzOrientation, GameConstant.CURRENT_GAMETYPE);
            if (props) RFGameViewPropsHandle.addPropsToObj(self, props.init);
            if (props) RFGameViewPropsHandle.addPropsToObj(self.playerInfoGroup, props.initInfo);

            // 初始化语音动画位置
            self.setTalkAniPos(orientation);

            //删除所有非头像显示对象
            self.removeAllNoHead();

            //不在打牌中
            self._isStartGame = false;

            if(GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG){
                let vpiaoValue: number = MahjongHandler.getPlayerPiaoFenInfo(this._pzOrientation);
                if (vpiaoValue) {
                    this.setPiaoFen(this._pzOrientation, vpiaoValue);
                }
            }

            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this.timeoutGro.visible = false;
        }

        private onRemove() {
            egret.Tween.removeTweens(this.lightImg);
        }

        /**
         * 删除所有非头像显示对象
         */
        private removeAllNoHead(): void {
            let self = this;
            ViewUtil.removeChild(self, self.selectedPlayerNumPattern);
            ViewUtil.removeChild(self, self.playerLongName);
            ViewUtil.removeChild(self, self.playerInfoGroup);
            ViewUtil.removeChild(self, self.okIcon);
            ViewUtil.removeChild(self, self.gpsIcon);
            ViewUtil.removeChild(self, self.roomOwnerIcon);
            ViewUtil.removeChild(self, self.zhuangIcon);
            ViewUtil.removeChild(self, self.zuoAndLaIcon);
            ViewUtil.removeChild(self, self.paoAndXiaMaIcon);
            ViewUtil.removeChild(self, self.piaoIcon);
            ViewUtil.removeChild(self, self.tingIcon);
            ViewUtil.removeChild(self, self.offlineFlag);
            ViewUtil.removeChild(self, self.closeDistanceFlag);
        }

        /**
         * 开始打牌
         */
        public startGame(orientation: PZOrientation): void {
            let self = this;
            self._pzOrientation = orientation;
            //设置在打牌中
            self._isStartGame = true;
            //开始移动头像，先清除非头像的元素，在开始缓动，最后显示玩家信息组
            self.removeAllNoHead();

            // 设置离线标记和名字
            let vGamePlayer : GamePlayer = GameConstant.CURRENT_HANDLE.getGamePlayerInfo(self._pzOrientation);
            self.setOfflineAndLeaveFlagAndNameByGamePlayer(vGamePlayer);

            //是否缓动，断线重连没有缓动
            // let vIsNeedTween:boolean = true;
            //先判断是都断线重连
            let vIsOfflineRecover: boolean = GameConstant.CURRENT_HANDLE.isOfflineRecover();
            // let type: EGameType = GameConstant.CURRENT_GAMETYPE;
            let _props: IInfoProps = RFGameViewPropsHandle.getInfoProps(self._pzOrientation, GameConstant.CURRENT_GAMETYPE);
            let vEndProps: IPosProps = _props.end;
            if (_props.endInReplay && GameConstant.CURRENT_HANDLE.isReplay()) {
                vEndProps = _props.endInReplay;
            }
            if (!vIsOfflineRecover) {
                let vCurrTween: Game.Tween = Game.Tween.get(self);
                let vTweenTimes: number = 200;

                vCurrTween.to(vEndProps, vTweenTimes);

                // TWEEN失效
                let showTimer = new Game.Timer(vTweenTimes+100); // 延时一点避免先回调了
                showTimer.once(egret.TimerEvent.TIMER, ()=>{
                    self.x = vEndProps.x;
                    self.y = vEndProps.y;
                    self.addPlayerInfoGroup();
                    showTimer.stop();
                }, self)
                showTimer.start();
            } else {
                RFGameViewPropsHandle.addPropsToObj(self, vEndProps);

                self.addPlayerInfoGroup();
            }

        }

        /**
         * 添加玩家信息组，缓动后回调
         */
        private addPlayerInfoGroup(): void {
            let self = this;
            // let vPlayerInfoGroupIndex:number = self.getChildIndex(self.playerInfoGroup);
            // if (vPlayerInfoGroupIndex === -1) self.addChild(self.playerInfoGroup);

            ViewUtil.addChildBefore(self, self.playerInfoGroup, self.playerLongName);
            if (GameConstant.CURRENT_GAMETYPE == EGameType.MJ) {
                let vPlayerZuoLaPaoInfo: PlayerZuoLaPaoInfo = MJGameHandler.getPlayerZuoLaPaoInfo(this._pzOrientation);
                if (vPlayerZuoLaPaoInfo) {
                    this.setZuoLaPao(this._pzOrientation, vPlayerZuoLaPaoInfo);
                }
                let vXiaMaValue: number = MJGameHandler.getPlayerXiaMaInfo(this._pzOrientation);
                if (vXiaMaValue === 1 || vXiaMaValue === 0) {
                    this.setXiaMa(this._pzOrientation, vXiaMaValue);
                }
                if (MJGameHandler.isTing(this._pzOrientation)) {
                    this.setTingIcon(true, false);
                }
            } else if (GameConstant.CURRENT_GAMETYPE == EGameType.RF) {
                // if (this._pzOrientation == PZOrientation.DOWN || this._pzOrientation == PZOrientation.UP) {
                //     // self.playerInfoGroup.x = 160;
                //     // self.playerInfoGroup.y = 110;
                //     self.playerInfoGroup.x = 138;
                //     self.playerInfoGroup.y = 110;
                // }
            }else if(GameConstant.CURRENT_GAMETYPE == EGameType.MAHJONG){
                let vpiaoValue: number = MahjongHandler.getPlayerPiaoFenInfo(this._pzOrientation);
                if (vpiaoValue) {
                    this.setPiaoFen(this._pzOrientation, vpiaoValue);
                }
            }

            //

        }

        /**
         * 设置玩家名字
         * @param {string} playerName
         */
        public setPlayerName(playerName: string, nameColor: number): void {
            let self = this;
            let vShortName: string = StringUtil.subStrSupportChinese(playerName, 8, ".."); //截断名字 12 + ..
            let vLongName: string = StringUtil.subStrSupportChinese(playerName, 24, ".."); //截断名字 24 + ..
            self.playerLongName.text = vLongName;
            self.playerLongName.textColor = nameColor;
            self.playerShortName.text = vShortName;
            self.playerShortName.textColor = nameColor;
            if (!self._isStartGame) {
                // let vPlayerLongNameIndex:number = self.getChildIndex(self.playerLongName);
                // if (vPlayerLongNameIndex === -1) self.addChild(self.playerLongName);
                ViewUtil.addChild(self, self.playerLongName);
            }
        }

        /**
         * 设置已选择的玩家人数模式
         */
        public setSelectedPlayerNumPattern(): void {
            let self = this;
            ViewUtil.removeChild(self, self.selectedPlayerNumPattern);
            let vGamePlayer: GamePlayer = MahjongHandler.getGamePlayerInfo(self._pzOrientation);
            if (!vGamePlayer) return; // 没有玩家则返回
            if (MahjongHandler.getGameState() === EGameState.WAITING_START) {
                let vSelectedPlayerNumPattern: number = vGamePlayer.selectedPlayerNumPattern;
                let vNewIntoGameTableMsgAck: NewIntoGameTableMsgAck = GameConstant.CURRENT_HANDLE.getNewIntoGameTableMsgAck();
                if (vNewIntoGameTableMsgAck.canSelectPlayerNumPatterns.indexOf(vSelectedPlayerNumPattern) !== -1 && vNewIntoGameTableMsgAck.currPlayCount === 1) {
                    let vSelectedPlayerNumPatternText: string = this.genSelectedPlayerNumPatternText(vSelectedPlayerNumPattern);
                    self.selectedPlayerNumPattern.text = vSelectedPlayerNumPatternText;
                    // 人数
                    let vPlayerNum: number = MahjongHandler.getGamePlayerArray().length;
                    if (vPlayerNum <= vSelectedPlayerNumPattern) {
                        ViewUtil.addChild(self, self.selectedPlayerNumPattern);
                    }
                }
            }
        }

        private genSelectedPlayerNumPatternText(pSelectedPlayerNumPattern: number): string {
            let vPlayerNum: string = "";
            if (pSelectedPlayerNumPattern === 2) {
                vPlayerNum = "二";
            } else if (pSelectedPlayerNumPattern === 3) {
                vPlayerNum = "三";
            }
            return "申请"+vPlayerNum+"人模式";
        }


        // 最后设置回调ID
        private _lastSetIconCallBackID:number = 0;

        /**
         * 设置玩家头像
         * @param {string} playerHeadImg
         * @param {number} headImg //头像索引
         */
        public setPlayerHeadImg(playerHeadImg?: string, headImg?: number): void {
            let self = this;
            if (playerHeadImg) {
                let vCurrHeadImgUrl: string = this.headIcon["head_icon_url"];
                if (playerHeadImg === vCurrHeadImgUrl) {
                    return;
                }
                self.headIcon["head_icon_url"] = playerHeadImg;  // 起到防止重复设置的作用
                this.clearHeadImg();
                // GWXAuth.setCircleWXHeadImg(this.headIcon, playerHeadImg, this, 215,52,46);
                if (!playerHeadImg || playerHeadImg.indexOf("/") == -1) {
                    return;
                }
                let vTempSetIconID: number = self.headIcon["temp_set_icon_id"];
                if (!vTempSetIconID) {
                    vTempSetIconID = 1;
                }
                vTempSetIconID++;
                self.headIcon["temp_set_icon_id"] = vTempSetIconID;
                let vIsCanSetCall: MyCallBack = new MyCallBack(function(pPlayerHeadImg:number, pTempSetIconID:number) {
                    egret.log("# playerHeadImg = " + playerHeadImg);
                    egret.log("# vTempSetIconID = " + pTempSetIconID);
                    if (this._lastSetIconCallBackID > pTempSetIconID) {
                        // 后加载先回调了则不处理
                        return false; // 不能设值
                    }
                    this._lastSetIconCallBackID = pTempSetIconID;
                    if (self.headIcon["temp_set_icon_id"] > pTempSetIconID) {
                        // this.clearHeadImg();
                        return false; // 不能设值
                    }
                    if (self.headIcon["head_icon_url"] !== pPlayerHeadImg) {
                        // this.clearHeadImg();
                        return false; // 不能设值
                    }
                    return true; // 可以设值
                }, this, playerHeadImg, vTempSetIconID);
                GWXAuth.setRectWXHeadImg(this.headIcon, playerHeadImg, vIsCanSetCall);
            } else {
                this.clearHeadImg();
                // this.headIcon.source = "avatar_png";
                //异步加载头像
                let key = "headIcon_" + headImg + "_jpg";
                // egret.log(key);
                if (RES.getRes(key)) {
                    this.headIcon.source = key;
                } else {
                    RES.getResAsync(key, (data) => {
                        egret.log(data);
                        this.headIcon.source = data;
                    }, this)
                }
                // this.headIcon.source = "headIcon_" + headImg + "_jpg";
            }
        }

        /**
         * 设置玩家分数 或者 金币
         * @param {number} chip
         * @param {number} zhongTuScore
         * @param {number} scoreChipRate
         */
        public setPlayerScoreOrGold(chip: number, zhongTuScore: number, scoreChipRate:number): void {
            // if (isGold) {
            //     this.playerScore.text = "金币:" + value;
            // } else {
            //     this.playerScore.text = "分数:" + value;
            // }
            let vValue:number = chip + (zhongTuScore * scoreChipRate);
            this.playerScore.text = "" + vValue;
        }

        /**
         * 设置OK标识
         * @param {boolean} isView
         */
        public setOkIcon(isView: boolean): void {
            let self = this;
            if (isView) {
                // let vIndex:number = self.getChildIndex(self.okIcon);
                // if (vIndex === -1) self.addChild(self.okIcon);
                ViewUtil.addChildBefore(self, self.okIcon, self.playerInfoGroup, self.playerLongName);
            } else {
                // self.removeChild(self.okIcon);
                ViewUtil.removeChild(self, self.okIcon);
            }
        }

        /**
         * 设置Gps标识
         * @param {boolean} isView
         */
        public setGpsIcon(isView: boolean): void {
            let self = this;
            if (isView) {
                // let vIndex:number = self.getChildIndex(self.gpsIcon);
                // if (vIndex === -1) self.addChild(self.gpsIcon);
                ViewUtil.addChildBefore(self, self.gpsIcon, self.playerInfoGroup, self.playerLongName);
            } else {
                // self.removeChild(self.gpsIcon);
                ViewUtil.removeChild(self, self.gpsIcon);
            }
        }


        /**
         * 设置房主标识
         * @param {boolean} isView
         */
        public setRoomOwnerIcon(isView: boolean): void {
            let self = this;
            if (isView) {
                // let vIndex:number = self.getChildIndex(self.roomOwnerIcon);
                // if (vIndex === -1) self.addChild(self.roomOwnerIcon);
                ViewUtil.addChildBefore(self, self.roomOwnerIcon, self.playerInfoGroup, self.playerLongName);
            } else {
                // self.removeChild(self.roomOwnerIcon);
                ViewUtil.removeChild(self, self.roomOwnerIcon);
            }
        }

        /**
         * 设置庄家标识
         * @param {boolean} isView
         */
        public setZhuangIcon(isView: boolean): void {
            let self = this;
            if (isView) {
                // let vIndex:number = self.getChildIndex(self.zhuangIcon);
                // if (vIndex === -1) self.addChild(self.zhuangIcon);
                ViewUtil.addChildBefore(self, self.zhuangIcon, self.playerInfoGroup, self.playerLongName);
            } else {
                // self.removeChild(self.zhuangIcon);
                ViewUtil.removeChild(self, self.zhuangIcon);
            }
        }

        /**
         * 设置听牌标识
         * @param {boolean} isView
         * @param {boolean} isTween
         */
        public setTingIcon(isView: boolean, isTween: boolean = true): void {
            let self = this;
            if (isView) {
                let vTingIcon: eui.Image = self.tingIcon;
                Game.Tween.removeTweens(vTingIcon);
                if (isTween) {
                    //初始化值
                    vTingIcon.scaleX = 2.5, vTingIcon.scaleY = 2.5, vTingIcon.alpha = 0.33;
                    //缓动
                    Game.Tween.get(vTingIcon).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
                } else {
                    //初始化值
                    vTingIcon.scaleX = 1, vTingIcon.scaleY = 1, vTingIcon.alpha = 1;
                }
                ViewUtil.addChild(self, self.tingIcon);
            } else {
                ViewUtil.removeChild(self, self.tingIcon);
            }
        }

        /**
         * 设置离线标记
         * @param {boolean} isView
         */
        // public setOfflineFlag(isView: boolean): void {
        //     let self = this;
        //     if (isView) {
        //         ViewUtil.removeChild(self, self.closeDistanceFlag);
        //         ViewUtil.addChildAfter(self, self.offlineFlag, self.headIcon);
        //     } else {
        //         ViewUtil.removeChild(self, self.offlineFlag);
        //     }
        // }

        /**
         * 设置离线标记和名字
         * @param {FL.GamePlayer} pGamePlayer
         */
        public setOfflineAndLeaveFlagAndNameByGamePlayer(pGamePlayer: GamePlayer): void {
            // 名字颜色
            let vNameColor: number = 0xFFFFFF;
            let vOfflineFlag: number = 0;
            if (pGamePlayer.isLinkBreken) {
                vNameColor = 0xAFAEAE;
                vOfflineFlag = 2;
            } else if (pGamePlayer.tableState === 0 || pGamePlayer.tableState === 4) {
                vOfflineFlag = 1;
                vNameColor = 0xAFAEAE;
            }
            // 设置是否离线等标记
            this.setOfflineAndLeaveFlag(vOfflineFlag);
            // 设置名字
            this.setPlayerName(pGamePlayer.playerName, vNameColor);
            // 设置已选择的玩家人数模式
            this.setSelectedPlayerNumPattern();
        }

        /**
         * 设置离线标记
         * @param {boolean} flag (0=无标记，1=暂时离开，2=离线中)
         */
        public setOfflineAndLeaveFlag(flag: number = 0): void {
            let self = this;
            if (flag === 2 || flag === 1) {
                let vResName:string = "play_offline_png";
                if (flag === 1) {
                    vResName = "play_leave_png";
                }
                self.offlineFlag.source = vResName;
                if (self.closeDistanceFlag.parent) {
                    ViewUtil.addChildAfter(self, self.offlineFlag, self.closeDistanceFlag);
                } else {
                    ViewUtil.addChildAfter(self, self.offlineFlag, self.headIcon);
                }
            } else {
                ViewUtil.removeChild(self, self.offlineFlag);
            }

        }

        /**
         * 距离过近标记显示设置
         * @param {boolean} isView
         */
        public setCloseDistanceFlag(isView: boolean) {
            let self = this;
            if (isView) {
                ViewUtil.addChildAfter(self, self.closeDistanceFlag, self.headIcon);
            } else {
                ViewUtil.removeChild(self, self.closeDistanceFlag);
            }
        }

        /**
         * 设置坐拉跑
         * @param {FL.PZOrientation} pPZOrientation
         * @param {FL.PlayerZuoLaPaoInfo} pPlayerZuoLaPaoInfo
         */
        public setZuoLaPao(pPZOrientation: PZOrientation, pPlayerZuoLaPaoInfo: PlayerZuoLaPaoInfo): void {
            let self = this;
            ViewUtil.removeChild(self, self.zuoAndLaIcon);
            ViewUtil.removeChild(self, self.paoAndXiaMaIcon);

            // 坐和拉
            if (pPlayerZuoLaPaoInfo.zuoNumber >= 0) {
                self.zuoAndLaIcon.source = "zuo" + pPlayerZuoLaPaoInfo.zuoNumber + "_png";
            } else if (pPlayerZuoLaPaoInfo.laNumber >= 0) {
                self.zuoAndLaIcon.source = "la" + pPlayerZuoLaPaoInfo.laNumber + "_png";
            }
            // 跑
            self.paoAndXiaMaIcon.source = "pao" + pPlayerZuoLaPaoInfo.paoNumber + "_png";

            // 设置位置
            if (MJGameHandler.getGameState() === EGameState.WAITING_START) {
                self.zuoAndLaIcon.x = 162, self.zuoAndLaIcon.y = -34;
                self.paoAndXiaMaIcon.x = 222, self.paoAndXiaMaIcon.y = -34;
            } else {
                if (pPZOrientation !== PZOrientation.DOWN) {
                    self.zuoAndLaIcon.x = 162, self.zuoAndLaIcon.y = 180;
                    self.paoAndXiaMaIcon.x = 222, self.paoAndXiaMaIcon.y = 180;
                } else {
                    self.zuoAndLaIcon.x = 162, self.zuoAndLaIcon.y = -34;
                    self.paoAndXiaMaIcon.x = 222, self.paoAndXiaMaIcon.y = -34;
                }
            }
            ViewUtil.addChildBefore(self, self.zuoAndLaIcon, self.playerInfoGroup, self.playerLongName);
            ViewUtil.addChildBefore(self, self.paoAndXiaMaIcon, self.playerInfoGroup, self.playerLongName);
        }

        /**
         * 设置下码
         * @param {FL.PZOrientation} pPZOrientation
         * @param {number} pXiaMaValue
         */
        public setXiaMa(pPZOrientation: PZOrientation, pXiaMaValue: number): void {
            let self = this;
            ViewUtil.removeChild(self, self.zuoAndLaIcon);
            ViewUtil.removeChild(self, self.paoAndXiaMaIcon);
            // 下码
            self.paoAndXiaMaIcon.source = "xia" + pXiaMaValue + "_png";

            // 设置位置
            if (MJGameHandler.getGameState() === EGameState.WAITING_START) {
                self.paoAndXiaMaIcon.x = 192, self.paoAndXiaMaIcon.y = -34;
            } else {
                if (pPZOrientation !== PZOrientation.DOWN) {
                    self.paoAndXiaMaIcon.x = 192, self.paoAndXiaMaIcon.y = 180;
                } else {
                    self.paoAndXiaMaIcon.x = 192, self.paoAndXiaMaIcon.y = -34;
                }
            }
            ViewUtil.addChildBefore(self, self.paoAndXiaMaIcon, self.playerInfoGroup, self.playerLongName);
        }


        /**
         * 设置飘分
         * @param {FL.PZOrientation} pPZOrientation
         * @param {number} piaoValue
         */
        public setPiaoFen(pPZOrientation: PZOrientation, piaoValue: number) {
            let self = this;
            ViewUtil.removeChild(self, self.piaoIcon);

            if(piaoValue === undefined || piaoValue === 0 || piaoValue === -1){
                self.piaoIcon.source = "";
            }else{
                self.piaoIcon.source = "xz_score_" + piaoValue + "_png";
            }

            // 设置位置
            if (MahjongHandler.getGameState() === EGameState.WAITING_START) {
                self.piaoIcon.x = 138, self.piaoIcon.y = 0;
            }
            // else {
            //     if (pPZOrientation !== PZOrientation.DOWN) {
            //         self.piaoIcon.x = 132, self.piaoIcon.y = 0;
            //     } else {
            //         self.piaoIcon.x = 132, self.piaoIcon.y = 0;
            //     }
            // }
            ViewUtil.addChildBefore(self, self.piaoIcon, self.playerInfoGroup, self.playerLongName);
        }

        /**
         * 设置语音动画位置
         */
        private setTalkAniPos(orientation: PZOrientation) {
            let resultX: number = 0;
            let resultS: number = 0;
            if (orientation == PZOrientation.RIGHT) {
                resultX = 66;
                resultS = 1;
            }
            else {
                resultX = 368;
                resultS = -1;
            }
            this.talkAniMod.scaleX = resultS;
            this.talkAniMod.x = resultX;
        }

        /**
         * 播放语音动画
         */
        public showTalkAni() {
            // this.talkAniMod.showPlay();
            let point: egret.Point = this.talkAniMod.localToGlobal(0, 0);
            if (point.x > (egret.MainContext.instance.stage.width-200)) {
                this.setTalkAniPos(PZOrientation.RIGHT);
            }
            // let info = RFGameViewPropsHandle.getInfoProps(this._pzOrientation, GameConstant.CURRENT_GAMETYPE);
            point = this.talkAniMod.localToGlobal(0, 0);
            let scale = this.talkAniMod.scaleX;

            let param = {
                scaleX: scale,
                x: point.x,
                y: point.y
            }
            MvcUtil.send(CommonModule.COMMON_SHOW_TALK_ANI_REALY, param);
        }

        /**
         * 隐藏语音动画
         */
        public hideTalkAni() {
            // this.talkAniMod.hide();
            MvcUtil.send(CommonModule.COMMON_HIDE_TALK_ANI_REALY);
        }

        /** 从显示列表移除时清除头像*/
        public clearHeadImg() {
            this.headIcon.source = null;
            this.headIcon.bitmapData = null;
        }


        private circle: CoolingQueueMcForCircle;
        private curLeng: number = 0;
        private allLeng: number = 0;
        /** 开始倒计时 */
        public showTimeOut(curLeng: number = 0, allLeng: number = 200) {
            this.timeoutGro.visible = true;
            this.curLeng = curLeng;
            this.allLeng = allLeng;
            this.lightImg.alpha = 1;
            this.lightImg.source = "head_circle_light_png";
            if (!this.circle) {
                this.circle = new CoolingQueueMcForCircle(this.lightImg, 102);
            }
        }

        /** 隐藏倒计时 */
        public hideTimeOut() {
            this.timeoutGro.visible = false;
            egret.Tween.removeTweens(this.lightImg);
        }

        public circleBlink(red: boolean = false) {
            egret.Tween.removeTweens(this.lightImg);
            this.lightImg.source = "head_circle_warn_png";
            egret.Tween.get(this.lightImg, {loop: true})
            .set({alpha: 1})
            .to({alpha: 0}, 700)
            .to({alpha: 1}, 700);
        }

        public circleBlinkQuick() {
            egret.Tween.removeTweens(this.lightImg);
            this.lightImg.source = "head_circle_warn_png";
            egret.Tween.get(this.lightImg, {loop: true})
            .set({alpha: 1})
            .to({alpha: 0}, 400)
            .to({alpha: 1}, 400);
        }

        public updateTimer() {
            this.curLeng += 1;
            this.circle.setProgress(this.curLeng, this.allLeng);
            if (this.curLeng >= this.allLeng) {
                RFGameTableBaseView.getInstance().stopTickerTimerCircle();
            }
            if (this.curLeng + 2.5*10 == this.allLeng) {
                this.circleBlinkQuick();
            }
            if (this.curLeng == this.allLeng || this.allLeng == 0) {
                this.circleBlink();
            }
        }
    }

}