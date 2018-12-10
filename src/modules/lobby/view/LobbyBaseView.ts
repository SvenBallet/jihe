module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyBaseViewSkin
     * @Description:  //大厅基础界面，包含左边公告区和底部公告区
     * @Create: DerekWu on 2017/11/10 20:04
     * @Version: V1.0
     */
    export class LobbyBaseView extends BaseView {

        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;

        //添加界面的缓动
        // public addTween:Array<any> = [
        //     {target:"leftNoticeGroup", data:[{left:-260}, {left:15}, 1000, Game.Ease.quintOut]},
        //     {target:"bottomGroup", data:[{bottom:-65}, {bottom:0}, 1000, Game.Ease.quintOut]}
        //     ];

        //背景图片，在childrenCreated 中替换
        public bgImg: eui.Image;

        //左侧公告
        public leftNoticeGroup: eui.Group;
        public leftNoticeImg: eui.Image;

        //底部区域
        public bottomGroup: eui.Group;
        public bottomNoticeLabel: eui.Label;

        //分享
        public shareGroup: eui.Group;
        public shareBtn: eui.Image;
        public rewardImg:eui.Image;

        //对战记录
        public recordGroup: eui.Group;
        public recordBtn: eui.Image;

        //商城
        public mallGroup: eui.Group;
        public mallBtn: eui.Image;

        //活动按钮
        public activityGroup: eui.Group;
        public activityBtn: eui.Image;

        //创建游戏
        public createGroup: eui.Group;
        public createBtn: eui.Image;
        //加入游戏
        public joinGroup: eui.Group;
        public joinBtn: eui.Image;
        //金币场
        public goldGroup: eui.Group;
        public goldBtn: eui.Image;
        //俱乐部
        public clubGroup: eui.Group;
        public clubBtn: eui.Image;

        public elseGroup: eui.Group;

        //测试
        public testGroup: eui.Group;
        public testBtn: eui.Image;

        /** 单例 */
        private static _only: LobbyBaseView;

        /** 调停者 */
        private _mediator: LobbyBaseViewMediator;

        public static getInstance(): LobbyBaseView {
            if (!this._only) {
                this._only = new LobbyBaseView();
            }
            return this._only;
        }

        constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.LobbyBaseViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;


            //底部通知
            // let msgTitle:string = LobbyData.noticeTitle;
            // self.bottomNoticeLabel.text = msgTitle;

            TouchTweenUtil.regTween(self.shareGroup, self.shareBtn);
            TouchTweenUtil.regTween(self.activityGroup, this.activityBtn);
            TouchTweenUtil.regTween(self.mallGroup, self.mallBtn);
            TouchTweenUtil.regTween(self.recordGroup, self.recordBtn);
            TouchTweenUtil.regTween(self.clubGroup, self.clubBtn);
            TouchTweenUtil.regTween(self.goldGroup, self.goldBtn);
            TouchTweenUtil.regTween(self.joinGroup, self.joinBtn);
            TouchTweenUtil.regTween(self.createGroup, self.createBtn);
            TouchTweenUtil.regTween(self.testGroup, self.testGroup);


            //调停者
            self._mediator = new LobbyBaseViewMediator(self);

            // APPSTORE屏蔽
            if (NativeBridge.IOSMask) {
                self.clubGroup.parent && self.clubGroup.parent.removeChild(self.clubGroup);
                self.elseGroup.horizontalCenter = 0;

                self.shareGroup.parent && self.shareGroup.parent.removeChild(self.shareGroup);
            }
        }

        /** 添加到界面以后框架自动调用 */
        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

    }
}