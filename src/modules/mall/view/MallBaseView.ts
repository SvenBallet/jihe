module FL {
    export class MallBaseView extends BaseView{

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = MallBaseViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        //添加界面的缓动
        public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];

        //删除按钮
        public closeGroup:eui.Group;
        public closeBtn:eui.Image;

        //选中按钮源文件初始值
        public _tabSource:string = "tab_chosen_png";

        //金币按钮
        public goldGroup:eui.Group;
        public goldBtn:eui.Image;

        //钻石按钮
        public diamondGroup:eui.Group;
        public diamondBtn:eui.Image;

        //商城名称
        public title:eui.Image;

        //项目添加组
        public itemsGroup:eui.Group;

        //金币商城：2；钻石商城：1
        public viewType:number = 2;

        //登录管理或绑定邀请码
        public getRebateBtn:GameButton;

        public agentLevel:number;

        public codeInput:NumberInput;

        //返回数据
        public readonly msg:RefreshItemBaseACK;


        constructor(msg:RefreshItemBaseACK){
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.MallBaseViewSkin";
            this.msg = msg;
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            //增加子项目列表
            let itemList:Array<ItemBase> = this.msg.baseItemList;
            let mallType:string = egret.localStorage.getItem('mallType');
            mallType === 'gold'? this.viewType = 2 : this.viewType = 1;
            this.addItemList(itemList,this.viewType);

            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.closeGroup, this.closeBtn);
            TouchTweenUtil.regTween(this.getRebateBtn, this.getRebateBtn);

            //水平布局
            let layout = new eui.HorizontalLayout();
            layout.gap = 20;
            this.itemsGroup.layout = layout;

            /** 代理名称&按钮设置*/
            let vPlayerVO:PlayerVO = LobbyData.playerVO;
            self.agentLevel = vPlayerVO.agentLevel;
            if(self.agentLevel === 21 || self.agentLevel === 22 || self.agentLevel === 20){
                self.getRebateBtn.labelDisplay.text = "登录管理";
            }else{
                if(vPlayerVO.parentIndex){
                    self.getRebateBtn.labelDisplay.text = "申请预备代理";
                }else {
                    self.getRebateBtn.labelDisplay.text = "绑定邀请码";
                }
            }

            //注册pureMvc
            MvcUtil.regMediator( new MallBaseViewMediator(self));

        }

        //添加商品项目
        //@params:item数据
        //@params:type商城类型
        public addItemList(items:Array<ItemBase>,type:number){
            let index:number = 1;
            if(type === 1){
                this.goldBtn.source = "";
                this.diamondBtn.source = this._tabSource;
            }else if (type === 2){
                this.diamondBtn.source = "";
                this.goldBtn.source = this._tabSource;
            }
            for(let i:number=0;i<items.length;i++){
                if(items[i].property_3 === type){
                    let iView = new MallGoldView(items[i],index);
                    index>=4?index=4:index++;
                    this.itemsGroup.addChild(iView);
                }
            }

        }

    }
}