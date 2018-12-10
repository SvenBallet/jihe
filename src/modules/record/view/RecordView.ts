module FL {
    import VerticalLayout = eui.VerticalLayout;

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - RecordView
     * @Description:  //开发版本登录界面
     * @Create: DerekWu on 2017/11/10 10:07
     * @Version: V1.0
     */
    export class RecordView extends BaseView {

        /**标记战绩入口 */
        public static lobbyRecord:boolean = false;

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = RecordViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

        //添加界面的缓动
        //public addTween:Array<any> = [{data:[{scaleX:0.8, scaleY:0.8}, {scaleX:1, scaleY:1}, 200, Game.Ease.backOut]}];

        //关闭按钮
        public closeGroup:eui.Group;
        public closeBtn:eui.Image;

        public noRecord:eui.Group;

        //底部组
        public bottomGroup:eui.Group;
        // 翻页组
        public fanGro:eui.Group;

        public leftGroup:eui.Group;
        public leftBtn:eui.Image;

        public rightGroup:eui.Group;
        public rightBtn:eui.Image;

        public currentPage:eui.Label;
        public totalPage:eui.Label;
        /** 回放码*/
        public replayCode:eui.Label;
        /** 局数*/
        public gameNum:NumberInput;
        /** 回放按钮*/
        public replayBtn:eui.Group;
        /** 邀请*/
        public inviteBtn:GameButton;
        /** 创造战绩*/
        public createBtn:GameButton;

        public recordScroller:eui.Scroller;
        public recordList:eui.List;

        public msg:GetVipRoomListMsgAck;
        public msg2:VipRoomRecordAckMsg2;

        //序号索引倍数，就是当前页数
        public static indexMultiple = 1;
        //每一页的列表条目数
        public static itemLength = 10;

        constructor (msg?:GetVipRoomListMsgAck,msg2?:VipRoomRecordAckMsg2) {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.RecordViewSkin";
            this.msg = msg?msg:null;
            this.msg2 = msg2?msg2:null;
        }

        protected childrenCreated():void {
            let self = this;
            super.childrenCreated();

            self.replayCode.touchEnabled = true;
            self.replayCode.type = egret.TextFieldType.INPUT;

            self.gameNum.text = "1";
            self.gameNum.minValue = 1;
            self.gameNum.maxValue = 16;
            self.gameNum.confirmBtnText = "确定";
            self.gameNum.titleLabelText = "输入局数";

            self.recordScroller.verticalScrollBar.autoVisibility = false;
            let layout = new eui.VerticalLayout();
            layout.gap = 8;
            self.recordList.layout = layout;

            TouchTweenUtil.regTween(self.closeGroup, self.closeBtn);
            TouchTweenUtil.regTween(self.inviteBtn, self.inviteBtn);
            TouchTweenUtil.regTween(self.createBtn, self.createBtn);
            TouchTweenUtil.regTween(self.leftGroup, self.leftBtn);
            TouchTweenUtil.regTween(self.rightGroup, self.rightBtn);
            TouchTweenUtil.regTween(self.replayBtn, self.replayBtn);

            //注册pureMvc
            MvcUtil.regMediator( new RecordViewMediator(self) );

            // 邀请默认不显示
            this.noRecord.visible = false;
            //如果是玩家开房记录
            if(self.msg && self.msg.roomRecords.length > 0){
                self.setRecordList(self.msg);
            }
            //如果是授权代理开房记录
            else if(self.msg2 && self.msg2.roomRecords.length > 0){
                self.setRecordList(self.msg2);

            }
            //如果没有记录
            else{
                self.showNoRecord(true);
                // APPSTORE屏蔽
                if (NativeBridge.IOSMask) {
                    self.inviteBtn.visible = false;
                }
            }
        }
        
        public showNoRecord(bShow:boolean)
        {
            this.noRecord.visible = bShow;
            if(Storage.getItem("clubSearchRecord")){
                this.inviteBtn.visible = !bShow;
                this.createBtn.visible = !bShow;
            }else{
                this.inviteBtn.visible = bShow;
                this.createBtn.visible = bShow;
            }
            this.recordList.visible = !bShow;
            this.fanGro.visible = !bShow;
        }

        public setRecordList(msg)
        {
            egret.log(msg);
            let self = this;
            self.currentPage.text = msg.unused_1 == 0?1:msg.unused_1;
            RecordView.indexMultiple = msg.unused_1 == 0?1:msg.unused_1;
            self.totalPage.text = msg.unused_0 == 0?1:msg.unused_0;
            self.recordList.dataProvider = new eui.ArrayCollection(msg.roomRecords);
            self.recordList.itemRendererSkinName = "skins.RecordItemSkin";
            self.recordList.itemRenderer = RecordViewItem;
        }
    }
}