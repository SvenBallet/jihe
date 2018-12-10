module FL {
    /** 茶楼战绩----公共显示页面 */
    export class TeaHouseLogCommonView extends eui.Component {
        /** 背景图 */
        public bgImg: eui.Image;
        /** 数据显示组 */
        protected scroller: eui.Scroller;
        protected dataGroup: eui.DataGroup;
        /** 显示数据源 */
        protected arrCollection: eui.ArrayCollection;

        /** 回放显示组 */
        public replayGroup: eui.Group;
        public replayCount: FL.NumberInput;
        public replayInput: eui.Label;
        public replayBtnGroup: eui.Group;
        public replayBtn: eui.Image;
        public dayTab:eui.Group;

        /** 数据源 */
        protected data: any;

        constructor() {
            super();
            this.left = this.right = this.top = this.bottom = 0;
            this.skinName = "skins.TeaHouseLogCommonViewSkin";
            this.dataGroup.useVirtualLayout = false;
            this.dayTab.visible = false;
        }

        /** 初始化页面 */
        protected initView() { };

        /** 刷新页面 */
        public refreshView(data = this.data) {
            this.data = data;
            this.dataGroup.dataProvider = this.arrCollection;
            this.scroller.viewport = this.dataGroup;
            this.scroller.viewport.scrollV = 0;
            this.arrCollection.replaceAll(this.data);
            this.dataGroup.validateNow();
        }

        protected isCanReplay(flag: boolean) {
            if (!flag) {
                this.replayGroup.visible = false;
                return;
            }
            //注册缓动事件
            TouchTweenUtil.regTween(this.replayBtnGroup, this.replayBtn);
            this.scroller.bottom = 90;
            //注册监听事件
            this.replayCount.addEventListener(egret.TouchEvent.TOUCH_TAP, this.inputNum, this);
            this.replayBtnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReplay, this);
            this.replayGroup.visible = true;
            this.replayInput.touchEnabled = true;
            this.replayInput.type = egret.TextFieldType.INPUT;
            this.replayGroup.visible = true;
            this.replayCount.text = "1";
            this.replayCount.minValue = 1;
        }

        /**
      * 显示输入数字页面
      */
        private inputNum() {
            if (!this.data) return;
            this.replayCount.confirmBtnText = "确定";
            this.replayCount.titleLabelText = "输入数字";
            let vNumberInputAreaView: NumberInputAreaView = new NumberInputAreaView(this.replayCount, this.data.totalNum, 1);
            MvcUtil.addView(vNumberInputAreaView);
            vNumberInputAreaView.setValue(this.replayCount.text);
        }

        /** 回放 */
        private onReplay() {
            let self = this;
            let replayStr = self.replayInput.text;
            if (replayStr == "") {
                PromptUtil.show("请输入正确的回放码", PromptType.ERROR);
                return;
            }

            if (replayStr.indexOf("[") != -1 && replayStr.indexOf("]") != -1) {
                replayStr = replayStr.split("[")[1].split("]")[0];
            }

            let vGetPlayerGameLogMsg: GetPlayerGameLogMsg = new GetPlayerGameLogMsg();
            let juStr = self.replayCount.text;
            if (Number(juStr) < 10) {
                juStr = "0"+juStr;
            }
            vGetPlayerGameLogMsg.unused_0 = Number(replayStr+juStr);
            console.log(vGetPlayerGameLogMsg);
            ServerUtil.sendMsg(vGetPlayerGameLogMsg);
        }
    }
}