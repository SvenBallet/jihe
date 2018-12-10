module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubMemberListItemView
     * @Description:  成员列表条目
     * @Create: ArielLiang on 2018/3/12 19:03
     * @Version: V1.0
     */
    // export class ClubMemberListItemView extends eui.Component{

    //     public memberName:eui.Label;
    //     public memberID:eui.Label;
    //     public memberPro:eui.Label;
    //     public joinTime:eui.Label;
    //     public score:eui.Label;
    //     public loginTime:eui.Label;
    //     public mgrBtn:GameButton;

    //     public readonly memberLevelCfg:Array<string> = ["","创建者","管理员","","普通成员"];

    //     public vClubBubbleBtnListView:ClubBubbleBtnListView;

    //     public vClubMember:ClubMember;

    //     private btnStatus:string = "close"; //close or show

    //     constructor(pClubMember:ClubMember){
    //         super();
    //         this.verticalCenter = this.horizontalCenter = 0;
    //         this.skinName = "skins.ClubMemberListItemViewSkin";
    //         this.vClubMember = pClubMember;
    //     }

    //     protected childrenCreated():void {
    //         super.childrenCreated();
    //         let self = this;

    //         self.initView();
    //     }

    //     private initView():void {
    //         let self = this;
    //         if(ClubData.vClub.myState === ClubData.CLUB_TYPE_MEMBER || this.vClubMember.level === ClubData.CLUB_TYPE_CREATOR){
    //             self.mgrBtn.visible = false;
    //         }else{
    //             self.mgrBtn.visible = true;
    //             TouchTweenUtil.regTween(self.mgrBtn, self.mgrBtn);
    //             self.mgrBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.mgrMember, self);
    //         }
    //         self.memberName.text = StringUtil.subStrSupportChinese(self.vClubMember.playerName, 8, "...");
    //         self.memberID.text = ""+self.vClubMember.playerIndex;
    //         self.memberPro.text = self.memberLevelCfg[self.vClubMember.level];
    //         self.score.text = ""+self.vClubMember.score;
    //         self.joinTime.text = StringUtil.formatDate("yyyy-MM-dd",new Date(self.vClubMember.joinTime));
    //         self.loginTime.text = StringUtil.formatDate("yyyy-MM-dd",new Date(self.vClubMember.lastLoginTime));
    //     }


    //     private mgrMember():void {
    //         if(this.btnStatus === "close"){
    //             this.vClubBubbleBtnListView = new ClubBubbleBtnListView();
    //             this.vClubBubbleBtnListView.x = this.mgrBtn.x-230;
    //             this.vClubBubbleBtnListView.y = 0;
    //             this.vClubBubbleBtnListView.memberID = this.vClubMember.memberId;
    //             this.vClubBubbleBtnListView.memberName = this.vClubMember.playerName;
    //             this.vClubBubbleBtnListView.memberLevel = this.vClubMember.level;
    //             this.addChild(this.vClubBubbleBtnListView);
    //             this.btnStatus = "show";
    //         }else{
    //             this.removeChild(this.vClubBubbleBtnListView);
    //             this.btnStatus = "close";
    //         }
    //     }
    // }


    /**@Change by HoyeLee */
    export class ClubMemberListItemView extends eui.ItemRenderer {

        public memberName: eui.Label;
        public memberID: eui.Label;
        public memberPro: eui.Label;
        public joinTime: eui.Label;
        public score: eui.Label;
        public loginTime: eui.Label;
        public mgrBtn: GameButton;

        public readonly memberLevelCfg: Array<string> = ["", "创建者", "管理员", "", "普通成员"];
      
        private btnStatus: string = "close"; //close or show
        public data: ClubMember;

        constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ClubMemberListItemViewSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;
            self.initView();

            //注册按钮缓动
            TouchTweenUtil.regTween(this.mgrBtn, this.mgrBtn);

            //注册监听事件
            self.mgrBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.mgrMember, self);
        }

        private initView(): void {
            if (!this.data) return;
            this.mgrBtn.visible = true;
            switch (ClubData.vClub.myState) {
                case ClubData.CLUB_TYPE_MEMBER:
                    this.mgrBtn.visible = false;
                    break;
                case ClubData.CLUB_TYPE_ADMIN:
                    if (this.data.level != ClubData.CLUB_TYPE_MEMBER) {
                        this.mgrBtn.visible = false;
                    }
                    break;
                case ClubData.CLUB_TYPE_CREATOR:
                    if (this.data.level == ClubData.CLUB_TYPE_CREATOR) {
                        this.mgrBtn.visible = false;
                    }
                    break;

            }
            this.memberName.text = StringUtil.subStrSupportChinese(this.data.playerName, 8, "...");
            this.memberID.text = "" + this.data.playerIndex;
            this.memberPro.text = this.memberLevelCfg[this.data.level];
            this.score.text = "" + this.data.score.toString();
            this.joinTime.text = StringUtil.formatDate("yyyy-MM-dd", new Date(this.data.joinTime));
            this.loginTime.text = StringUtil.formatDate("yyyy-MM-dd", new Date(this.data.lastLoginTime));
        }

        private mgrMember(): void {
            MvcUtil.send(ClubModule.CLUB_SHOW_BUBBLE_VIEW, this.itemIndex);
        }

        protected dataChanged() {
            this.initView();
        }
    }
}