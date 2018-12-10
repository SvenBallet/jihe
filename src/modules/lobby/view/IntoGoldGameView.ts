module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - IntoGoldGameView
     * @Description:  //进入金币场游戏
     * @Create: DerekWu on 2017/11/21 10:33
     * @Version: V1.0
     */
    export class IntoGoldGameView extends BaseView {

        public readonly mediatorName: string = IntoGoldGameViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        //添加界面的缓动
        public addTween:Array<any> = [{tweenDict:"openPopup"}];

        /** 开始游戏按钮 */
        public startGameGroup:eui.Group;
        public startGameBtn:GameButton;

        /** 关闭按钮 */
        public closeGroup:eui.Group;
        public closeBtn:eui.Image;

        /** 单选按钮 */
        public wanfaRadioGroup: eui.RadioButtonGroup;
        public zhuanzhuan:eui.RadioButton;
        public chagnsha:eui.RadioButton;
        public hongzhong:eui.RadioButton;
        public jingdianpaodekuai:eui.RadioButton;
        public shiwuzhangpaodekuai:eui.RadioButton;

        constructor(){
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.IntoGoldGameViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;
            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.startGameGroup, self.startGameBtn);
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);

            //创建玩法单选组
            self.wanfaRadioGroup = new eui.RadioButtonGroup();
            self.zhuanzhuan.value = MJRoomID.ZHUAN_ZHUAN_MJ;
            self.zhuanzhuan.group = self.wanfaRadioGroup;
            self.chagnsha.value = MJRoomID.CHANG_SHA_MJ;
            self.chagnsha.group = self.wanfaRadioGroup;
            self.hongzhong.value = MJRoomID.HONG_ZHONG_MJ;
            self.hongzhong.group = self.wanfaRadioGroup;
            self.jingdianpaodekuai.value = MJRoomID.JING_DIAN_PAO_DE_KUAI;
            self.jingdianpaodekuai.group = self.wanfaRadioGroup;
            self.shiwuzhangpaodekuai.value = MJRoomID.SHI_WU_ZHANG_PAO_DE_KUAI;
            self.shiwuzhangpaodekuai.group = self.wanfaRadioGroup;

            //设置选中
            let vCurrValue:number = Storage.getGoldPlayWay();
            if (vCurrValue === MJRoomID.CHANG_SHA_MJ) {
                self.chagnsha.selected = true;
            } else if (vCurrValue === MJRoomID.HONG_ZHONG_MJ) {
                self.hongzhong.selected = true;
            } else if (vCurrValue === MJRoomID.JING_DIAN_PAO_DE_KUAI) {
                self.jingdianpaodekuai.selected = true;
            } else if (vCurrValue === MJRoomID.SHI_WU_ZHANG_PAO_DE_KUAI) {
                self.shiwuzhangpaodekuai.selected = true;
            } else {
                self.zhuanzhuan.selected = true;
                // 默认选中转转麻将
            }

            //注册pureMvc
            MvcUtil.regMediator( new IntoGoldGameViewMediator(self) );
        }


    }
}