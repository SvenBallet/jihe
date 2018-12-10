module FL {

    export class ActivityKaifangAwardView extends BaseView {

        //调停者名字，删除界面的时候会自动移除
        public readonly mediatorName: string = ActivityKaifangAwardViewMediator.NAME;
        //界面层级，UI框架自动管理
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public getAward:GameButton;
        public createRoom:GameButton;
        public openNum:eui.Label;
        public progress:eui.ProgressBar;

        /** 奖励数据 */
        private _awardList:Array<number> = null;

        /** 当前领取奖励的最小组索引 */
        private _canGetMinGroupIndex:number = null;

        public colorFilter = new egret.ColorMatrixFilter(
            [0.5,0,0,0,0,
            0,0.5,0,0,0,
            0,0,0.5,0,0,
            0,0,0,1,0]);

        private static _only:ActivityKaifangAwardView;

        public static getInstance():ActivityKaifangAwardView {
            if (!this._only) {
                this._only = new ActivityKaifangAwardView();
            }
            return this._only;
        }

        constructor () {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.ActivityKaifangAwardViewSkin";
        }

        protected childrenCreated():void {
            super.childrenCreated();
            let self = this;

            TouchTweenUtil.regTween(this.getAward, this.getAward);
            this.getAward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getKaifangAward, this);

            TouchTweenUtil.regTween(self.createRoom, self.createRoom);
            MvcUtil.regMediator( new ActivityKaifangAwardViewMediator(self) );
        }

        /**
         * 领取奖励成功
         */
        // public getAwardSucc():void {
        //     if (this._canGetMinGroupIndex !== null) {
        //         let itemNum:number = 3; //一组三个
        //         let vStartIndex:number = 1;
        //         this._awardList[vStartIndex+itemNum*this._canGetMinGroupIndex+2] = 0;
        //         this.setData(this._awardList);
        //     }
        // }

        public setData(awardList:Array<number>){
            let dataList:Array<number> = awardList;
            this._awardList = awardList;
            // dataList = [10,3,20,0,7,30,1,12,40,0,20,50,0,30,50,0];  //测试数据
            let listNum:number = 5; //共有五组
            let itemNum:number = 3; //一组三个
            // let i:number=0;

            // if(dataList[3] == dataList[6] == dataList[9] == dataList[12] == dataList[15] == 0){
            //     this.getAward.filters = [this.colorFlilter];
            // }
            // 开房次数
            let openNum:number = dataList[0];
            this.openNum.text = ""+openNum;
            // 奖励的最大开房数量，用来计算进度条
            let vMaxOpenNum:number = 0;

            // for(let k=1;k<=listNum;k++){
            //     let data:Array<number> = [];
            //     for(i;i<itemNum*k;i++){
            //         data.push(dataList[i]);
            //         if(dataList[i] == 1){
            //             TouchTweenUtil.regTween(this.getAward, this.getAward);
            //             this.getAward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getKaifangAward, this);
            //         }
            //         if((i == 1 || i == 4 || i == 7 || i == 10 || i == 13) && openNum >= dataList[i]){
            //             k = k>4?4:k;
            //             let getImg:eui.Image = this["img"+k];
            //             //钻石图标
            //             getImg.source = "diamond"+k+"_light_png";
            //             //进度条
            //             this.progress.value = 20*k;
            //         }
            //     }
            //     this.setState(k,data);
            // }

            // 当前可以领取奖励的最小组索引
            let vCanGetMinGroupIndex:number = null;
            let vStartIndex:number = 1;
            for (let vIndex:number = 0; vIndex < listNum; ++vIndex) {
                let vState:number = 0; // 0=不可领取，1=已经领取，2=可领取
                let vTimes:number = awardList[vStartIndex+vIndex*itemNum];
                let vAwardDataFlag:number = awardList[vStartIndex+vIndex*itemNum+2];
                if (vAwardDataFlag === 1) {
                    vState = 1;
                } else if (vAwardDataFlag === 0 && openNum >= vTimes) {
                    // 可领取
                    vState = 2;
                    if (vCanGetMinGroupIndex === null) {
                        vCanGetMinGroupIndex = vIndex;
                    }
                }
                let vOneAwardObj = {times:vTimes, diamond:awardList[vStartIndex+vIndex*itemNum+1], state:vState};
                this.setState(vIndex + 1, vOneAwardObj);
                if(openNum >= vTimes) {
                    //进度条
                    this.progress.value = 20 * (vIndex + 1);
                }
            }
            // 进度条
            // let vRate:number = Math.floor(openNum / vMaxOpenNum) * 100 + 19;
            // this.progress.value = Math.floor(vRate/20) * 20;
            // 设置组索引
            this._canGetMinGroupIndex = vCanGetMinGroupIndex;
            if (vCanGetMinGroupIndex !== null) {
                this.getAward.filters = null;
                this.getAward.touchEnabled = true;
            } else {
                this.getAward.filters = [this.colorFilter];
                this.getAward.touchEnabled = false;
            }

        }

        // public setState(group:number,value:Array<number>){
        //     let award:number = value[1];
        //     let diamond:number = value[2];
        //
        //     let titleLabel:eui.Label = this["award"+group];
        //     let diamondLabel:eui.Label = this["diamond"+group];
        //
        //     titleLabel.text = "第"+award+"次";
        //     diamondLabel.text = diamond+"钻石";
        // }

        public setState(group: number, awardObj: { times: number, diamond: number, state: number }) {
            let titleLabel: eui.Label = this["award" + group];
            let diamondLabel: eui.Label = this["diamond" + group];
            titleLabel.text = "第" + awardObj.times + "次";
            diamondLabel.text = awardObj.diamond + "钻石";

            // 钻石图标
            let getImg:eui.Image = this["img"+group];
            // 已领取图标
            let getedFlag:eui.Image = this["getedFlag"+group];
            // 图片编号
            let vImageNum:number = group;
            if (vImageNum >= 5) {
                vImageNum = 4;
            }
            // 0=不可领取，1=已经领取，2=可领取
            if (awardObj.state === 0) {
                getImg.source = "diamond"+vImageNum+"_gray_png";
                getedFlag.visible = false;
            } else {
                getImg.source = "diamond"+vImageNum+"_light_png";
                if (awardObj.state === 1) {
                    // 已领取标志
                    getedFlag.visible = true;
                } else {
                    getedFlag.visible = false;
                }
            }
        }

        private getKaifangAward(e:egret.Event):void {
            // let activityId:number = ActivityBaseView.KAIFANG_AWARD;
            let vActivityGetRewardMsg:ActivityGetRewardMsg = new ActivityGetRewardMsg();
            vActivityGetRewardMsg.activityId = ActivityBaseView.KAIFANG_AWARD;
            ServerUtil.sendMsg(vActivityGetRewardMsg, MsgCmdConstant.MSG_ACTIVITY_GET_REWARD_ACK);
        }

    }
}