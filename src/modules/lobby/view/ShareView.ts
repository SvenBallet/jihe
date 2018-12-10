module FL {

    // export enum ShareViewStateEnum {
    //     HAS_AWARD,  // 有奖励
    //     NO_AWARD_COUNT,  // 没有奖励次数了
    //     NO_AWARD  // 没奖励
    // }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ShareView
     * @Description:  //分享界面
     * @Create: DerekWu on 2018/1/5 18:49
     * @Version: V1.0
     */
    export class ShareView extends BaseView {

        public readonly mediatorName: string = ShareViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //添加界面的缓动
        public addTween:Array<any> = [{tweenDict:"openPopup"}];

        /** 关闭组 */
        public closeGroup:eui.Group;
        /** 关闭按钮 */
        public closeBtn:eui.Image;

        /** 分享给朋友 */
        public shareFriendsBtn:eui.Image;
        /** 分享到朋友圈 */
        public shareCircleOfFriendsBtn:eui.Image;
        public shareXlBtn:eui.Image;

        /** 奖励icon */
        public awardIcon:eui.Image;

        /** 提示信息 */
        public reminderLabel:eui.Label;

        public shareGro:eui.Group;
        public openGro:eui.Group;
        public openFriend:eui.Image;
        public openXLBtn:eui.Image;

        public shareGroTH:eui.Group;
        public shareFriendsBtnTH:eui.Image;
        public teahouseBtn:eui.Image;
        public shareXlBtnTH:eui.Image;

        /** 状态 */
        // public shareViewState:ShareViewStateEnum;
        /** 记录选择类型 */
        public openFlag:SHARE_CHOOSE_TYPE = SHARE_CHOOSE_TYPE.SHARE_CHOOSE_ALL;
        /** 分享朋友圈时的图片 */
        public static shareImg: eui.Image = new eui.Image();
        public static shareCon: eui.Group = new eui.Group();

        // constructor(shareViewState:ShareViewStateEnum) {
        constructor(openFlag:number = SHARE_CHOOSE_TYPE.SHARE_CHOOSE_ALL) {
            super();
            // this.shareViewState = shareViewState;
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ShareViewSkin";
            this.openFlag = openFlag;
            console.log("OPEN FLAG==", this.openFlag);
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动 和 关闭事件
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            //注册pureMvc
            MvcUtil.regMediator( new ShareViewMediator(self) );

            let commonImg: eui.Image = new eui.Image(RES.getRes("share_cir_common_1_jpg"));
            let shareGro: eui.Group = ShareView.shareCon;
            shareGro.y = this.height + 1000;
            this.addChild(shareGro);
            shareGro.addChild(commonImg);
            shareGro.addChild(ShareView.shareImg);
        }
    }

    export enum SHARE_CHOOSE_TYPE {
        /**所有分享渠道，包括朋友圈 */
        SHARE_CHOOSE_ALL,
        /**不包括朋友圈 */
        SHARE_CHOOSE_NO_FRIEND,
        /**选择打开应用 */
        SHARE_CHOOSE_OPEN,
        /**大厅分享朋友圈时变是分享图片 */
        SHARE_LOBBY_IMG,
        /**房间邀请包括茶楼邀请 */
        SHARE_TEAHOUSE_INVITE
    }
}