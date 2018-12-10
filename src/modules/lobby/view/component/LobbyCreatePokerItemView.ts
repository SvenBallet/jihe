module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyCreatePokerItemView
     * @Description:  扑克创建房间
     * @Create: ArielLiang on 2018/4/12 10:33
     * @Version: V1.0
     */
    export class LobbyCreatePokerItemView extends eui.Component {
        //人数单选按钮组
        public personNumGroup: eui.RadioButtonGroup;
        public twoPerson: eui.RadioButton;
        public threePerson: eui.RadioButton;

        //局数按钮组
        public gameGroup: eui.RadioButtonGroup;
        public tenGames: eui.RadioButton;
        public twentyGames: eui.RadioButton;

        //局数对应消耗的钻石数
        public diamondNumTenGames: eui.Label;
        public diamondNumTwentyGames: eui.Label;

        //二人局消耗钻石的方案
        public schemaTwo: Array<string> = ['7', '11'];
        //三人局消耗钻石的方案
        public schemaThree: Array<string> = ['11', '16'];
        //房费均摊消耗钻石的方案
        public schemaAverage: Array<string> = ['3', '5'];

        //房费均摊
        public averageBill: eui.CheckBox;

        /** 单例 */
        private static _only: LobbyCreatePokerItemView;

        public playerNum: BindAttr<number> = new BindAttr<number>(0, true);

        public static getInstance(): LobbyCreatePokerItemView {
            if (!this._only) {
                this._only = new LobbyCreatePokerItemView();
            }
            return this._only;
        }

        private constructor() {
            super();
            this.skinName = "skins.LobbyCreatePokerItemSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.initView();

            self.personNumGroup.addEventListener(egret.Event.CHANGE, self.changeDiamondNum, self);

            self.averageBill.visible = false;
            // self.averageBill.addEventListener(egret.Event.CHANGE, self.changeDiamondNum, self);

        }

        public initView(): void {
            let self = this;
            self.personNumGroup = new eui.RadioButtonGroup();
            self.twoPerson.group = self.personNumGroup;
            self.threePerson.group = self.personNumGroup;

            self.twoPerson.value = 2;
            self.threePerson.value = 3;

            self.gameGroup = new eui.RadioButtonGroup();
            self.tenGames.group = self.gameGroup;
            self.twentyGames.group = self.gameGroup;
            self.tenGames.value = 10;
            self.twentyGames.value = 20;

            //默认三人，十局
            self.personNumGroup.selectedValue = Storage.getItem("createPokerPersonNum") ? Storage.getItem("createPokerPersonNum") : "" + self.threePerson.value; //value为0需要转换成string
            self.gameGroup.selectedValue = Storage.getItem("createPokerGameNum") ? Storage.getItem("createPokerGameNum") : self.tenGames.value;
            if (self.gameGroup.selectedValue != self.tenGames.value && self.gameGroup.selectedValue != self.twentyGames.value) {
                self.gameGroup.selectedValue = self.tenGames.value;
            }
            /**
             * 是否代开房
             */
            // if (Storage.getItem("agentRoomNum") || egret.localStorage.getItem("agentRoomType")) {
            //     self.averageBill.selected = false;
            //     self.averageBill.visible = false;
            // } else {
            //     self.averageBill.selected = JSON.parse(Storage.getItem("createPokerAverageBill")) ? JSON.parse(Storage.getItem("createPokerAverageBill")) : false;
            // }
            self.playerNum.value = self.personNumGroup.selectedValue;

            self.getDiamondSchema();
            // self.changeDiamondNum();
        }

        /**
         * 设置当前页面显示
         */
        public setViewShow(params: IRulesSetViewShowParams) {
            this.personNumGroup.selectedValue = params.playerNum;
            this.gameGroup.selectedValue = params.countNum;
            // this.changeDiamondNum();
        }

        /**
         * 切换人数修改需要消耗的钻石数
         */
        public changeDiamondNum(): void {
            let self = this;
            self.validateNow();
            let pNum: number = self.personNumGroup.selectedValue;
            self.playerNum.value = pNum;
            
            // let averageBill: number = self.averageBill.selected ? 1 : 0;
            // let schemaAverage0 = 0, schemaAverage1 = 0;
            // if (pNum === 3) {
            //     self.diamondNumTenGames.text = "(" + self.schemaThree[0] + "钻)";
            //     self.diamondNumTwentyGames.text = "(" + self.schemaThree[1] + "钻)";
            //     // schemaAverage0 = Math.ceil(parseInt(self.schemaThree[0])/3);
            //     // schemaAverage1 = Math.ceil(parseInt(self.schemaThree[1])/3);
            // } else if (pNum === 2) {
            //     self.diamondNumTenGames.text = "(" + self.schemaTwo[0] + "钻)";
            //     self.diamondNumTwentyGames.text = "(" + self.schemaTwo[1] + "钻)";
            //     // schemaAverage0 = Math.ceil(parseInt(self.schemaTwo[0])/2);
            //     // schemaAverage1 = Math.ceil(parseInt(self.schemaTwo[1])/2);
            // }
            // if (averageBill === 1) {
            //     self.diamondNumTenGames.text = "(" + schemaAverage0 + "钻)";
            //     self.diamondNumTwentyGames.text = "(" +schemaAverage1 + "钻)";
            // }
        }

        public getDiamondSchema(): void {
            let self = this;
            let diamondCost: Array<number> = LobbyData.pokerNeedDiamond;
            //局数
            for (let i: number = 0; i < diamondCost.length; i++) {
                let num: number = diamondCost[i];

                if (i % 2 == 0) {
                    if (i == 0)
                        this.tenGames.label = num + "局";
                    else if (i == 2)
                        this.twentyGames.label = num + "局";
                } else {
                    if (i == 1)
                        self.schemaThree[0] = "" + num;
                    else
                        self.schemaThree[1] = "" + num;
                }
            }

            for (let i: number = 0; i < 2; i++) {
                self.schemaThree[i] = "" + Math.ceil(parseInt(self.schemaThree[i]) / 3 * 3);
                self.schemaTwo[i] = "" + Math.ceil(parseInt(self.schemaThree[i]) / 3 * 2);
                self.schemaAverage[i] = "" + Math.ceil(parseInt(self.schemaThree[i]) / 3);
            }

            self.diamondNumTenGames.text = "(" + self.schemaThree[0] + "钻)";
            self.diamondNumTwentyGames.text = "(" + self.schemaThree[1] + "钻)";
        }
    }
}