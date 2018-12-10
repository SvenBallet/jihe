module FL {
    /** 大厅茶楼列表项数据接口 */
    export interface ILobbyTHListItem {
        name?: string;//茶楼名字
        id?: any;//茶楼id
        creatorName?: string;//茶楼老板名字
        creatorID?: any;//茶楼老板ID
        headImageUrl?: string;//茶楼老板头像
    }
    /** 
     * 大厅茶楼列表项视图
     */
    export class LobbyTeaHouseListItemView extends eui.ItemRenderer {
        /** 头像组 */
        private avatarGroup: eui.Group;
        /** 茶楼老板头像 */
        private headImg: eui.Image;
        /** 茶楼名字与ID */
        private thNameID: eui.Label;
        /** 茶楼老板名字 */
        private thCreatorName: eui.Label;

        /** 数据源 */
        public data: ILobbyTHListItem;
        constructor() {
            super();
            this.skinName = "skins.LobbyTeaHouseListItemViewSkin"
        }

        protected childrenCreated() {
            let self = this;
            self.initView();
            //注册监听事件
            self.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinTeaHouse, self);
        }

        /** 初始化视图 */
        private initView() {
            if (!this.data) return;
            this.thNameID.text = StringUtil.subStrSupportChinese(this.data.name, 10, "..") + "(" + this.data.id + ")";
            this.thCreatorName.text = "老板:" + StringUtil.subStrSupportChinese(this.data.creatorName, 10, "..");
            if (GConf.Conf.useWXAuth) {
                if (this.data.headImageUrl) GWXAuth.setCircleWXHeadImg(this.headImg, this.data.headImageUrl, this.avatarGroup, 57, 55.3, 66 / 2);
                // GWXAuth.setRectWXHeadImg(self.headImg, vPlayerVO.headImageUrl);
            }
            // else {
            //     //画一个遮罩
            //     let circle: egret.Shape = new egret.Shape();
            //     circle.graphics.beginFill(0xffffff);
            //     circle.graphics.drawCircle(57, 55.3, 66 / 2);
            //     circle.graphics.endFill();
            //     this.avatarGroup.addChild(circle);
            //     this.headImg.mask = circle;
            //     this.headImg.source = "headIcon_1_jpg";
            //     // GWXAuth.setCircleWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0", self, 0, 0, 72 / 2);
            //     // GWXAuth.setRectWXHeadImg(self.headImg, "http://wx.qlogo.cn/mmopen/vi_32/UmK17f9nicVrMhSQAbft5KOfKdIiaSFUHiaOTpxVum5JZ8G5zibHzzLkTJBicEuibL44kmuc8X0NpUrfgqrFKBh5jM9Q/0");
            // }
        }

        /** 加入茶楼 */
        private joinTeaHouse(): void {
            let self = this;
            let vAccessTHMsg = new AccessTeaHouseMsg();
            vAccessTHMsg.teaHouseId = this.data.id;
            ServerUtil.sendMsg(vAccessTHMsg, MsgCmdConstant.MSG_ACCESS_TEAHOUSE_ACK);
        }

        protected dataChanged() {
            this.initView();
        }
    }
}