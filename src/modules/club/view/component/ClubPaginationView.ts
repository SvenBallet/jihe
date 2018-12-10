module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubPaginationView
     * @Description:  俱乐部分页
     * @Create: ArielLiang on 2018/3/7 17:55
     * @Version: V1.0
     */
    export class ClubPaginationView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = "";
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;


        /** 上一页按钮*/
        public leftGroup:eui.Group;
        public leftBtn:eui.Image;
        /** 下一页按钮*/
        public rightGroup:eui.Group;
        public rightBtn:eui.Image;

        /** 第几页*/
        public pageLabel:eui.Label;

        /** 全部页*/
        public totalPage:number;
        /** 当前页*/
        public currentPage:number;


        public constructor(){
            super();
            this.skinName = "skins.ClubPaginationViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.leftGroup, self.leftBtn);
            TouchTweenUtil.regTween(self.rightGroup, self.rightBtn);

            self.leftGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,self.loadPreviousPage,self);
            self.rightGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,self.loadNextPage,self);
        }

        /**
         * 上一页
         * @param {egret.Event} e
         */
        private loadPreviousPage(e:egret.Event):void {
            let currentPage:number = this.currentPage;
            let previousPage:number = currentPage-1<0 ? 0 : currentPage-1;
            if(currentPage == 1){
                return;
            }
            this.currentPage = previousPage;
            this.pageLabel.text = "第" +previousPage+ "页";
        }

        /**
         * 下一页
         * @param {egret.Event} e
         */
        private loadNextPage(e:egret.Event):void {
            let currentPage:number = this.currentPage;
            let totalPage:number = this.totalPage;
            if(currentPage == totalPage){
                return;
            }
            let nextPage:number = currentPage+1> totalPage? totalPage : currentPage+1;
            this.currentPage = nextPage;
            this.pageLabel.text = "第" +nextPage+ "页";
        }
    }
}