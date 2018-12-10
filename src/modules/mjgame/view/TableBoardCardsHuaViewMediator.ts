module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - TableBoardCardsHuaViewMediator
     * @Description:  //所有玩家的花牌显示界面 调停者
     * @Create: DerekWu on 2017/11/24 17:21
     * @Version: V1.0
     */
    export class TableBoardCardsHuaViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "TableBoardCardsHuaViewMediator";

        /** 花牌显示操作类 */
        private readonly _upHuaGroupHandle:HuaGroupHandle;
        private readonly _downHuaGroupHandle:HuaGroupHandle;
        private readonly _leftHuaGroupHandle:HuaGroupHandle;
        private readonly _rightHuaGroupHandle:HuaGroupHandle;

        constructor (pView:TableBoardCardsHuaView) {
            super(TableBoardCardsHuaViewMediator.NAME, pView);
            this._upHuaGroupHandle = new HuaGroupHandle(PZOrientation.UP, pView.upHuaGroup);
            this._downHuaGroupHandle = new HuaGroupHandle(PZOrientation.DOWN, pView.downHuaGroup);
            this._leftHuaGroupHandle = new HuaGroupHandle(PZOrientation.LEFT, pView.leftHuaGroup);
            this._rightHuaGroupHandle = new HuaGroupHandle(PZOrientation.RIGHT, pView.rightHuaGroup);
        }

        /**
         * 注册之后调用
         */
        // public onRegister():void {
        //     egret.log("--TableBoardCardsHuaViewMediator--onRegister");
        // }

        /**
         * 移除之后调用
         */
        // public onRemove():void {
        //     egret.log("--TableBoardCardsHuaViewMediator--onRemove");
        // }

        /**
         * 感兴趣的通知指令
         * @returns {Array<any>}
         */
        public listNotificationInterests():Array<any> {
            return [
                MJGameModule.MJGAME_BU_HUA
            ];
        }

        /**
         * 处理通知
         * @param {puremvc.INotification} pNotification
         */
        public handleNotification(pNotification:puremvc.INotification):void{
            let data:any = pNotification.getBody();
            switch(pNotification.getName()) {
                case MJGameModule.MJGAME_BU_HUA:{
                    this.buHua(data);
                    break;
                }
            }
        }

        /**
         * 开始游戏，重置显示
         */
        public startGame():void {
            let self = this;
            self._upHuaGroupHandle.resetView(MJGameHandler.getPlayerCardDown(PZOrientation.UP));
            self._downHuaGroupHandle.resetView(MJGameHandler.getPlayerCardDown(PZOrientation.DOWN));
            self._leftHuaGroupHandle.resetView(MJGameHandler.getPlayerCardDown(PZOrientation.LEFT));
            self._rightHuaGroupHandle.resetView(MJGameHandler.getPlayerCardDown(PZOrientation.RIGHT));
        }

        /**
         * 补花
         * @param {FL.PlayerTableOperationMsg} msg
         */
        public buHua(buhuaObj:{tablePos:number, isMyAutoBuhua:boolean, huaCardArray:Array<number>}):void {
            // egret.log("##  PlayerTableOperationMsg pos="+msg.player_table_pos+"  cardValue="+msg.card_value);
            //获得牌桌方向
            let vPZOrientation:PZOrientation = MJGameHandler.getPZOrientation(buhuaObj.tablePos);

            // 特效和声音已经改放到 TableBoardEffectViewMediator
            // 非自动补花就要播放补花声音，如果是我自己自动补花，这判断是否已经有补花了，有了就不播放补花声音，没有就播放补花身影
            // if (!buhuaObj.isMyAutoBuhua || (buhuaObj.isMyAutoBuhua && MJGameHandler.getMyBuhuaNum() === 0)) {
            //     //播放补花动画 和 声音
            //
            //     MJGameSoundHandler.buhua(vPZOrientation);
            // }

            let vHuaGroupHandle:HuaGroupHandle = this.getHuaGroupHandle(vPZOrientation);
            let vHuaCardArray:Array<number> = buhuaObj.huaCardArray, vIndex:number = 0, vLength:number = vHuaCardArray.length;
            for (; vIndex < vLength; ++vIndex) {
                vHuaGroupHandle.addOneHuaCard(vHuaCardArray[vIndex]);
            }
        }

        /**
         * 获得花显示组操作对象
         * @param {FL.PZOrientation} pzOrientation
         * @returns {FL.HuaGroupHandle}
         */
        private getHuaGroupHandle(pzOrientation:PZOrientation):HuaGroupHandle {
            if (pzOrientation === PZOrientation.UP) {
                return this._upHuaGroupHandle;
            } else if (pzOrientation === PZOrientation.DOWN) {
                return this._downHuaGroupHandle;
            } else if (pzOrientation === PZOrientation.LEFT) {
                return this._leftHuaGroupHandle;
            } else if (pzOrientation === PZOrientation.RIGHT) {
                return this._rightHuaGroupHandle;
            }
        }
    }



}