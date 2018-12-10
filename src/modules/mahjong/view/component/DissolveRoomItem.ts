module FL {

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - DissolveRoomItem
     * @Description:  //解散房间界面的条目
     * @Create: DerekWu on 2017/12/11 11:55
     * @Version: V1.0
     */
    export class DissolveRoomItem extends eui.Component {

        /** 头像 */
        public headImg:eui.Image;
        /** 玩家名字 */
        public playerName:eui.Label;
        public playerNameStr:string;
        /** 状态 */
        public stateLabel:eui.Label;

        public tablePos:number;
        /** 状态码 */
        private _state:number;

        /**
         * 设置头像和名字
         * @param {string} headImg
         * @param {string} playerName
         */
        public resetItem(headImg:string, playerName:string):void {
            let self = this;
            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(this.headImg, headImg, this, 110,65,46);
                GWXAuth.setRectWXHeadImg(self.headImg, headImg);
            }
            // else {
            //     GWXAuth.setCircleWXHeadImg(this.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", this, 110,65,46);
            // }

            //玩家名字
            self.playerName.text = StringUtil.subStrSupportChinese(playerName, 14, "..");
            self.playerNameStr = playerName;
            //状态重置为 0
            self._state = 0;
        }

        get state(): number {
            return this._state;
        }

        /**
         * 设置状态
         * @param {number} state
         */
        set state(state: number) {
            let self = this;
            if (self._state === 0) {
                self._state = state;
                self.resetStateLabel();
            }
        }

        private resetStateLabel():void {
            let self = this;
            let state = self._state;
            //状态
            if (state === 0x1) {
                self.stateLabel.text = "已同意";
                self.stateLabel.textColor = 0x13A01D;
            } else if (state === 0x2) {
                self.stateLabel.text = "已拒绝";
                self.stateLabel.textColor = 0xF00F28;
            } else {
                self.stateLabel.text = "等待中";
                self.stateLabel.textColor = 0x00927B;
            }
        }

    }

}