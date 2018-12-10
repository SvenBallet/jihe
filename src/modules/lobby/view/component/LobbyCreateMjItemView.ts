module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - LobbyCreateMjItemView
     * @Description:  麻将创建房间
     * @Create: ArielLiang on 2018/4/12 10:13
     * @Version: V1.0
     */
    export class LobbyCreateMjItemView extends eui.Component {

        //人数单选按钮组
        public personNumGroup: eui.RadioButtonGroup;
        public twoPerson: eui.RadioButton;
        public threePerson: eui.RadioButton;
        public fourPerson: eui.RadioButton;

        //局数按钮组
        public gameGroup: eui.RadioButtonGroup;
        public fourGames: eui.RadioButton;
        public eightGames: eui.RadioButton;
        public sixteenGames: eui.RadioButton;

        //局数对应消耗的钻石数
        public diamondNumFourGames: eui.Label;
        public diamondNumEightGames: eui.Label;
        public diamondNumSixteenGames: eui.Label;

        //二人局消耗钻石的方案
        public schemaTwo: Array<string> = ['7', '11', '18'];
        //三人局消耗钻石的方案
        public schemaThree: Array<string> = ['11', '16', '27'];
        //四人局消耗钻石的方案
        public schemaFour: Array<string> = ['15', '22', '37'];
        //房费均摊消耗钻石的方案
        public schemaAverage: Array<string> = ['3', '5', '9'];

        //房费均摊
        public averageBill: eui.CheckBox;

        /** 单例 */
        private static _only: LobbyCreateMjItemView;

        public static getInstance(): LobbyCreateMjItemView {
            if (!this._only) {
                this._only = new LobbyCreateMjItemView();
            }
            return this._only;
        }

        private constructor() {
            super();
            this.skinName = "skins.LobbyCreateMjItemSkin";
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let self = this;

            self.initView();

            // self.personNumGroup.addEventListener(egret.Event.CHANGE, self.changeDiamondNum, self);

            self.averageBill.visible = false;
            // self.averageBill.addEventListener(egret.Event.CHANGE, self.changeDiamondNum, self);

        }

        public initView(): void {
            let self = this;
            self.personNumGroup = new eui.RadioButtonGroup();
            self.twoPerson.group = self.personNumGroup;
            self.threePerson.group = self.personNumGroup;
            self.fourPerson.group = self.personNumGroup;

            self.twoPerson.value = 2;
            self.threePerson.value = 3;
            self.fourPerson.value = 4;

            self.gameGroup = new eui.RadioButtonGroup();
            self.fourGames.group = self.gameGroup;
            self.eightGames.group = self.gameGroup;
            self.sixteenGames.group = self.gameGroup;
            self.fourGames.value = 4;
            self.eightGames.value = 8;
            self.sixteenGames.value = 16;

            self.fourGames.visible = false;
            self.diamondNumFourGames.visible = false;
            self.fourGames.touchEnabled = false;
            self.sixteenGames.x = self.eightGames.x;
            self.diamondNumSixteenGames.x = self.diamondNumEightGames.x + 16;
            self.eightGames.x = self.fourGames.x;
            self.diamondNumEightGames.x = self.diamondNumFourGames.x;


            //默认四人，八局
            self.personNumGroup.selectedValue = Storage.getItem("createPersonNum") ? Storage.getItem("createPersonNum") : "" + self.fourPerson.value; //value为0需要转换成string
            let gameGroupValue = Storage.getItem("createGameNum") ? Storage.getItem("createGameNum") : self.eightGames.value;
            if (gameGroupValue == 4) {
                gameGroupValue = 8;
            }
            if (gameGroupValue != 8 && gameGroupValue != 16) {
                gameGroupValue = 8;
            }
            self.gameGroup.selectedValue = gameGroupValue;

            self.getDiamondSchema();
            /**
             * 是否代开房
             */
            // if(Storage.getItem("agentRoomNum") || egret.localStorage.getItem("agentRoomType")){
            //     self.averageBill.selected = false;
            //     self.averageBill.visible = false;
            // }else{
            //     self.averageBill.selected = JSON.parse(Storage.getItem("createAverageBill"))?JSON.parse(Storage.getItem("createAverageBill")):false;
            // }
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
            let pNum: number = parseInt(self.personNumGroup.selectedValue);
            // let averageBill:number = self.averageBill.selected?1:0;
            // let schemaAverage0 = 0, schemaAverage1 = 0, schemaAverage2 = 0;
            // if (pNum === 4) {
            //     self.diamondNumFourGames.text = "(" + self.schemaFour[0] + "钻)";
            //     self.diamondNumEightGames.text = "(" + self.schemaFour[1] + "钻)";
            //     self.diamondNumSixteenGames.text = "(" + self.schemaFour[2] + "钻)";
            //     // schemaAverage0 = Math.ceil(parseInt(self.schemaFour[0])/4);
            //     // schemaAverage1 = Math.ceil(parseInt(self.schemaFour[1])/4);
            //     // schemaAverage2 = Math.ceil(parseInt(self.schemaFour[2])/4);
            // } else if (pNum === 3) {
            //     self.diamondNumFourGames.text = "(" + self.schemaThree[0] + "钻)";
            //     self.diamondNumEightGames.text = "(" + self.schemaThree[1] + "钻)";
            //     self.diamondNumSixteenGames.text = "(" + self.schemaThree[2] + "钻)";
            //     // schemaAverage0 = Math.ceil(parseInt(self.schemaThree[0])/3);
            //     // schemaAverage1 = Math.ceil(parseInt(self.schemaThree[1])/3);
            //     // schemaAverage2 = Math.ceil(parseInt(self.schemaThree[2])/3);
            // } else if (pNum === 2) {
            //     self.diamondNumFourGames.text = "(" + self.schemaTwo[0] + "钻)";
            //     self.diamondNumEightGames.text = "(" + self.schemaTwo[1] + "钻)";
            //     self.diamondNumSixteenGames.text = "(" + self.schemaTwo[2] + "钻)";
            //     // schemaAverage0 = Math.ceil(parseInt(self.schemaTwo[0])/2);
            //     // schemaAverage1 = Math.ceil(parseInt(self.schemaTwo[1])/2);
            //     // schemaAverage2 = Math.ceil(parseInt(self.schemaTwo[2])/2);
            // }
            // if(averageBill === 1){
            //     // self.diamondNumFourGames.text = "("+self.schemaAverage[0]+"钻)";
            //     // self.diamondNumEightGames.text = "("+self.schemaAverage[1]+"钻)";
            //     // self.diamondNumSixteenGames.text = "("+self.schemaAverage[2]+"钻)";
            //     self.diamondNumFourGames.text = "("+schemaAverage0+"钻)";
            //     self.diamondNumEightGames.text = "("+schemaAverage1+"钻)";
            //     self.diamondNumSixteenGames.text = "("+schemaAverage2+"钻)";
            // }
        }

        public getDiamondSchema(): void {
            let self = this;
            let diamondCost: Array<number> = LobbyData.mahjongNeedDiamond;
            //局数
            for (let i: number = 0; i < diamondCost.length; i++) {
                let num: number = diamondCost[i];

                if (i % 2 == 0) {
                    if (i == 0)
                        this.fourGames.label = num + "局";
                    else if (i == 2)
                        this.eightGames.label = num + "局";
                    else
                        this.sixteenGames.label = num + "局";
                } else {
                    if (i == 1)
                        self.schemaFour[0] = "" + num;
                    else if (i == 3)
                        self.schemaFour[1] = "" + num;
                    else
                        self.schemaFour[2] = "" + num;
                }
            }

            for (let i: number = 0; i < 3; i++) {
                self.schemaThree[i] = "" + Math.ceil(parseInt(self.schemaFour[i]) / 4 * 3);
                self.schemaTwo[i] = "" + Math.ceil(parseInt(self.schemaFour[i]) / 4 * 2);
                self.schemaAverage[i] = "" + Math.ceil(parseInt(self.schemaFour[i]) / 4);
            }

            self.diamondNumEightGames.text = "(" + self.schemaFour[1] + "钻)";
            self.diamondNumSixteenGames.text = "(" + self.schemaFour[2] + "钻)";
        }

    }
}