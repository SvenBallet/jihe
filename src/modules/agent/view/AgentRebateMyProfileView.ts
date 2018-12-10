module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - AgentRebateMyProfileView
     * @Description:  我的资料 （返利后台）
     * @Create: ArielLiang on 2018/3/14 16:37
     * @Version: V1.0
     */
    export class AgentRebateMyProfileView extends BaseView{

        public readonly mediatorName: string = "";
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        //按钮组
        public getRebateBtn:GameButton;

        //昵称
        public nickname:eui.TextInput;
        //ID
        public playerID:eui.TextInput;
        //钻石
        public diamondNum:eui.TextInput;
        //团队人数
        public memberNum:eui.TextInput;
        //返现金额
        public rebateLabel:eui.Label;
        public rebate:eui.TextInput;

        /** 代理等级*/
        public levelLabel:eui.Label;

        /** 邀请码*/
        public codeGroup:eui.Group;
        public inviteCode:eui.Label;
        public shareBtn:GameButton;

        public codeInput:NumberInput;

        public detailGroup:eui.Group;

        //头像组
        public avatarGroup:eui.Group;
        public avatarImg:eui.Image;

        public agentLevel;

        public vPlayerVO:PlayerVO;


        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.AgentRebateMyProfileViewSkin";

        }
        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            self.vPlayerVO = LobbyData.playerVO;

            self.initView();
            //注册按钮点击缓动
            TouchTweenUtil.regTween(this.getRebateBtn, this.getRebateBtn);

            self.getRebateBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.exeBtn, self);

            // APPSTORE屏蔽
            if (NativeBridge.IOSMask) {
                self.shareBtn.visible = false;
            }
        }

        /**
         * 初始化界面
         */
        private initView():void{
            let self = this;
            //初始化数据

            self.agentLevel = self.vPlayerVO.agentLevel;
            self.nickname.text = self.vPlayerVO.playerName;
            self.playerID.text = "" +self.vPlayerVO.playerIndex;
            //设置头像
            if (GConf.Conf.useWXAuth) {
                // GWXAuth.setCircleWXHeadImg(this.avatarImg, self.vPlayerVO.headImageUrl, this.avatarGroup, 54,52,46);
                GWXAuth.setRectWXHeadImg(this.avatarImg, self.vPlayerVO.headImageUrl);
            }
        }


        /**
         * 改变界面显示
         * @param {FL.RequestAgentInfoAck} msg
         */
        public setValues(msg:RequestAgentInfoAck):void {
            let self = this;
            self.diamondNum.text ="" + self.vPlayerVO.diamond.value;
            self.memberNum.text = ""+msg.allXiajiNum;
            self.inviteCode.text = ""+self.vPlayerVO.inviteCode;
            /** 代理名称&按钮设置*/
            if(self.agentLevel === 21 ){
                self.detailGroup.visible = true;
                self.levelLabel.text = "代理";
                self.rebateLabel.text = "返现金额";
                self.rebate.text = ""+msg.rebate;
                self.getRebateBtn.labelDisplay.text = "点击领钱";
                self.showCodeGroup(true);
            }else if(self.agentLevel === 22 || self.agentLevel === 20){
                self.detailGroup.visible = true;
                if(self.agentLevel === 20){
                    self.levelLabel.text = "运营商";
                }else{
                    self.levelLabel.text = "预备代理";
                }
                self.rebate.text = ""+msg.allPayNum;
                self.rebateLabel.text = "下级充值总额";
                self.getRebateBtn.labelDisplay.text = "登录管理";
                self.showCodeGroup(true);
            }else{
                if(this.vPlayerVO.parentIndex){
                    self.levelLabel.text = "玩家";
                    self.getRebateBtn.labelDisplay.text = "申请预备代理";
                }else {
                    self.levelLabel.text = "游客";
                    self.getRebateBtn.labelDisplay.text = "绑定邀请码";
                }
                self.detailGroup.visible = false;
                self.showCodeGroup(false);
            }
        }

        /**
         * 请求代理信息
         */
        public getAgentInfo():void{
            let vRequestAgentInfo:RequestAgentInfo  = new RequestAgentInfo();
            ServerUtil.sendMsg(vRequestAgentInfo, MsgCmdConstant.MSG_AGENT_INFO_ACK);
        }

        /**
         * 显示邀请码组件
         */
        private showCodeGroup(isShow:boolean):void{
            if(isShow){
                this.codeGroup.visible = true;
                TouchTweenUtil.regTween(this.shareBtn, this.shareBtn);
                this.shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareInviteCode, this);
            }else{
                this.codeGroup.visible = false;
            }
        }

        /**
         * 主按钮执行
         */
        public exeBtn():void{
            let self = this;
            if(self.agentLevel === 22 || self.agentLevel === 21 || self.agentLevel === 20 || this.vPlayerVO.parentIndex){
                MvcUtil.send(AgentModule.AGENT_GET_MGR_SYSTEM_TICKET);
            }else{
                self.codeInput = new NumberInput();
                self.codeInput.titleLabelText = "输入邀请码";
                self.codeInput.confirmBtnText = "绑定";
                let vNumberInputAreaView:NumberInputAreaView = new NumberInputAreaView(self.codeInput,999999,100000,new MyCallBack(self.confirmInput,self));
                MvcUtil.addView(vNumberInputAreaView);
            }

        }
        /**
         * 确认输入邀请码
         */
        private confirmInput():void{
            let params = {opType:0,inviteCode:this.codeInput.text};
            MvcUtil.send(AgentModule.AGENT_SEND_BIND_CODE,params);
        }

        /**
         * 分享邀请码
         */
        private shareInviteCode():void{
            MvcUtil.send(AgentModule.AGENT_SHARE_INVITE_CODE);
        }

    }
}