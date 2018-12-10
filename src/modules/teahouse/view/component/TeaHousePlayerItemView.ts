module FL {
    /** 茶楼玩家信息数据接口 */
    export interface ITHPlayerInfo {
        tableIndex: number;//桌子序号
        info: GamePlayer;//个人信息
    }

    /** 茶楼桌子上玩家信息元素视图 */
    export class TeaHousePlayerItemView extends eui.ItemRenderer {
        /** 人物头像显示组 */
        private avatarGroup: eui.Group;
        private avatarBtn: eui.Image;
        private headImg: eui.Image;
        /** 加入牌桌 */
        private joinTable: eui.Image;
        // private nameLabel: eui.Label;
        public data: ITHPlayerInfo;
        constructor() {
            super();
            this.skinName = "skins.TeaHousePlayerItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.joinTable, self.joinTable);
            //注册点击事件
            self.joinTable.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onJoin, self);
            self.avatarGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinIntoOldTable, self);
            self.initView();
        }

        /** 初始化页面 */
        private initView() {
            if (!this.data) {
                this.avatarGroup.visible = false;
                this.joinTable.visible = false;
                return;
            }
            if (!this.data.info) {
                this.avatarGroup.visible = false;
                // +号显示控制
                this.joinTable.visible = false;
                return;
            }
            this.avatarGroup.visible = true;
            this.joinTable.visible = false;

            // 头像问题处理，避免头像加载时的问题，先移除老的，再添加新的
            let vNewHeadImg: eui.Image = new eui.Image();
            vNewHeadImg.width = this.headImg.width;
            vNewHeadImg.height = this.headImg.height;
            vNewHeadImg.x = this.headImg.x;
            vNewHeadImg.y = this.headImg.y;
            ViewUtil.removeChild(this.avatarGroup, this.headImg);
            this.headImg = vNewHeadImg;
            ViewUtil.addChild(this.avatarGroup, this.headImg);

            //设置头像
            if (GConf.Conf.useWXAuth) {
                if (this.data.info.headImageUrl) GWXAuth.setCircleWXHeadImg(this.headImg, this.data.info.headImageUrl, this.avatarGroup, 48, 46, 40);
                else { 
                    this.headImg.source = "";
                    this.headImg.bitmapData = null;
                }
                // GWXAuth.setRectWXHeadImg(this.headImg, this.data.head);
            }
            // else {
            //     //画一个遮罩
            //     let circle: egret.Shape = new egret.Shape();
            //     circle.graphics.beginFill(0xffffff);
            //     circle.graphics.drawCircle(37, 35.3, 60 / 2);
            //     circle.graphics.endFill();
            //     this.avatarGroup.addChild(circle);
            //     this.headImg.mask = circle;
            //     this.headImg.source = "headIcon_1_jpg";
            // }
            // this.nameLabel.text = this.data.name;
        }

        /** 
         * 加入牌桌
         */
        private onJoin() {
            if (!this.data) return;
            let msg = new AccessTeaHouseDeskMsg();
            msg.deskNum = this.data.tableIndex;
            msg.tablePos = this.itemIndex;
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayer = TeaHouseData.curFloor;
            console.log(msg);
            ServerUtil.sendMsg(msg);
        }

        /** 加入旧的牌桌 */
        private joinIntoOldTable() {
            if (!this.data) return;
            let playerVO: PlayerVO = LobbyData.playerVO;
            if (this.data.info.playerIndex != playerVO.playerIndex) return;
            this.onJoin();
        }

        /** 数据改变 */
        protected dataChanged() {
            this.initView();
        }
    }
}