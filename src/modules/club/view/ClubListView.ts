module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubListView
     * @Description:  俱乐部列表
     * @Create: ArielLiang on 2018/3/7 10:21
     * @Version: V1.0
     */
    export class ClubListView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = ClubListViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.BOTTOM_ONLY;


        /** 搜索*/
        public searchBtn:GameButton;
        /** 创建*/
        public createBtn:GameButton;

        /** 滚动区域内容*/
        public clubScroller:eui.Scroller;
        public clubGroup:eui.Group;

        public closeGroup:eui.Image;
        public closeBtn:eui.Image;

        public searchContent:NumberInput;


        public constructor() {
            super();
            this.left = this.right = 20;
            this.top = this.bottom = 10;
            this.skinName = "skins.ClubListViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            self.searchContent.minValue = 0;

            //垂直布局
            let layout = new eui.VerticalLayout();
            this.clubGroup.layout = layout;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.searchBtn, self.searchBtn);
            TouchTweenUtil.regTween(self.createBtn, self.createBtn);

            MvcUtil.regMediator( new ClubListViewMediator(self));
        }

    }
}