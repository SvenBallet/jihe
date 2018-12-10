module FL {

    export class PlayerInfoItem extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = PlayerInfoItemMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.TOOLTIP_BOTTOM;

        //全屏的透明层
        public baseGroup: eui.Group;
        //玩家信息弹窗组
        public detailGroup: eui.Group;

        //头像区域
        public avatarGroup: eui.Group;
        public headImg: eui.Image;

        public playerName: eui.Label;
        public playerID: eui.Label;
        public playerIP: eui.Label;
        public playerAddress:eui.Label;
        public goldNum: eui.Label;
        public diamondNum: eui.Label;

        //玫瑰
        public roseGroup: eui.Group;
        //鸡蛋
        public eggGroup: eui.Group;
        //亲吻
        public kissGroup: eui.Group;
        //拖鞋
        public shoesGroup: eui.Group;
        //干杯
        public cheerGroup: eui.Group;
        //炸弹
        public boomGroup: eui.Group;

        public contentSroller: eui.Scroller;

        public params: any;

        /** 调停者 */
        private _mediator: PlayerInfoItemMediator;



        private static _only: PlayerInfoItem;

        public static getInstance(): PlayerInfoItem {
            if (!this._only) {
                this._only = new PlayerInfoItem();
            }
            return this._only;
        }

        constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.PlayerInfoItemSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.contentSroller.horizontalScrollBar.autoVisibility = false;

            self._mediator = new PlayerInfoItemMediator(self);

        }

        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        /**
         * 玩家信息显示
         * @param {FL.SimplePlayer} vSimplePlayer
         * @param {Array<number>} location
         */
        public setPlayerInfo(vSimplePlayer: SimplePlayer, location: Array<number>): void {
            let self = this;
            let tablePos: number = vSimplePlayer.tablePos;
            self.playerName.text = vSimplePlayer.playerName;
            self.playerID.text = "ID:" + vSimplePlayer.palyerIndex;
            self.playerIP.text = "IP:" + vSimplePlayer.ip;
            let vTempPZOrientation: PZOrientation = MJGameHandler.getPZOrientation(vSimplePlayer.tablePos);
            let vUpdatePlayerGPSMsg: UpdatePlayerGPSMsg = MJGameHandler.getPlayerGPS(vTempPZOrientation);
            if (vUpdatePlayerGPSMsg) {
                self.playerAddress.text = vUpdatePlayerGPSMsg.paddress;
            }
            // self.goldNum.text = "" + this.getGoldNum(tablePos).gold;
            // self.diamondNum.text = "" + this.getGoldNum(tablePos).diamond;
            self.detailGroup.x = location[0];
            self.detailGroup.y = location[1];
            self.headImg.source = "";
            //设置头像
            if (vSimplePlayer.headImgUrl) {
                // GWXAuth.setCircleWXHeadImg(this.headImg, vSimplePlayer.headImgUrl, this.avatarGroup, 54,52,46);
                GWXAuth.setRectWXHeadImg(self.headImg, vSimplePlayer.headImgUrl);
            }
            else {
                //异步加载头像
                let key = "headIcon_" + vSimplePlayer.headImg + "_jpg";
                if (RES.getRes(key)) {
                    this.headImg.source = key;
                } else {
                    RES.getResAsync(key, (data) => {
                        this.headImg.source = data;
                    }, this)
                }
                // GWXAuth.setCircleWXHeadImg(this.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", this.avatarGroup, 54,52,46);
            }
        }

        /**
        * 玩家信息显示
        * @param {FL.GamePlayer} vGamePlayer
        * @param {Array<number>} location
        */
        public setPlayerInfo2(vGamePlayer: GamePlayer, location: Array<number>): void {
            let self = this;
            let tablePos: number = vGamePlayer.tablePos;
            self.playerName.text = StringUtil.subStrSupportChinese(vGamePlayer.playerName, 26, "...");
            self.playerID.text = "ID:" + vGamePlayer.playerIndex;
            self.playerIP.text = "IP:" + vGamePlayer.ip;
            self.playerAddress.text = vGamePlayer.address;

            let vTempPZOrientation: PZOrientation = GameConstant.CURRENT_HANDLE.getPZOrientation(vGamePlayer.tablePos);
            let vUpdatePlayerGPSMsg: NewUpdateGPSPositionMsgAck = GameConstant.CURRENT_HANDLE.getPlayerGPS(vTempPZOrientation);
            if (vUpdatePlayerGPSMsg) {
                self.playerAddress.text = vUpdatePlayerGPSMsg.paddress;
            }
            self.detailGroup.x = location[0];
            self.detailGroup.y = location[1];
            self.headImg.source = "";
            //设置头像
            if (vGamePlayer.headImageUrl) {
                // GWXAuth.setCircleWXHeadImg(this.headImg, vSimplePlayer.headImgUrl, this.avatarGroup, 54,52,46);
                GWXAuth.setRectWXHeadImg(self.headImg, vGamePlayer.headImageUrl);
            }
            else {
                let key = "headIcon_" + vGamePlayer.headImg + "_jpg";
                if (RES.getRes(key)) {
                    this.headImg.source = key;
                } else {
                    RES.getResAsync(key, (data) => {
                        this.headImg.source = data;
                    }, this)
                }
            //     GWXAuth.setCircleWXHeadImg(this.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", this.avatarGroup, 54,52,46);
            }
        }

        /**
         * 玩家信息金币和分数显示
         * @param {number} tablePos
         * @return {Object} {gold,diamond}
         */
        public getGoldNum(tablePos: number): { gold, diamond } {
            let gold: number = 0, diamond: number = 0;
            if (GameConstant.CURRENT_GAMETYPE == EGameType.MJ) {
                let vGetGameStartMsg: any = GameConstant.CURRENT_HANDLE.getGameStartMsg();
                if (vGetGameStartMsg) {
                    if (tablePos === 0) {
                        gold = vGetGameStartMsg.player0Gold;
                        diamond = vGetGameStartMsg.player0Win;
                    } else if (tablePos === 1) {
                        gold = vGetGameStartMsg.player1Gold;
                        diamond = vGetGameStartMsg.player1Win;
                    } else if (tablePos === 2) {
                        gold = vGetGameStartMsg.player2Gold;
                        diamond = vGetGameStartMsg.player2Win;
                    } else if (tablePos === 3) {
                        gold = vGetGameStartMsg.player3Gold;
                        diamond = vGetGameStartMsg.player3Win;
                    }
                }
            } else if (GameConstant.CURRENT_GAMETYPE == EGameType.RF) {
                let info = RFGameHandle.getGamePlayerInfo(RFGameHandle.getPZOrientation(tablePos));
                gold = info.chip;
                diamond = 0;
                if (tablePos == RFGameHandle.getTablePos(PZOrientation.DOWN)) {
                    //自己的钻石显示出来
                    let vPlayerVO: PlayerVO = LobbyData.playerVO;
                    diamond = vPlayerVO.diamond.getValue();
                    gold = vPlayerVO.gold.getValue();
                }
                // if (tablePos === 0) {
                //     gold = vGetGameStartMsg;
                //     diamond = vGetGameStartMsg.player0Win;
                // } else if (tablePos === 1) {
                //     gold = vGetGameStartMsg.player1Gold;
                //     diamond = vGetGameStartMsg.player1Win;
                // } else if (tablePos === 2) {
                //     gold = vGetGameStartMsg.player2Gold;
                //     diamond = vGetGameStartMsg.player2Win;
                // } else if (tablePos === 3) {
                //     gold = vGetGameStartMsg.player3Gold;
                //     diamond = vGetGameStartMsg.player3Win;
                // }


            }
            return { gold: gold, diamond: diamond }
        }

    }
}