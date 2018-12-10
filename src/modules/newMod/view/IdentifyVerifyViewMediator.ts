module FL {
    /**
     * 身份验证界面调停者
     */
    export class IdentifyVerifyViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        //注册到pureMvc中的名字，不能重复，否则会覆盖
        public static readonly NAME:string = "IdentifyVerifyViewMediator";

        public vView:IdentifyVerifyView = this.viewComponent;

        constructor (pView:IdentifyVerifyView) {
            super(SetViewMediator.NAME, pView);
            let self = this;
            pView.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.closeView, self);
            pView.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.identifyClick, self);
        }
            
        private closeView(e:egret.Event):void {
            MvcUtil.delView(this.viewComponent);
        }

        private identifyClick() {
            let name: string = this.vView.nameEdi.text;
            let id: string = this.vView.numEdi.text;

            let nameLen = name.length;
            if (nameLen > 8 || nameLen < 2) {
                PromptUtil.show("名字长度不正确", PromptType.ERROR);
                return;
            }

            if (!this.verifyName(name)) {
                PromptUtil.show("名字格式不正确", PromptType.ERROR);
                return;
            }

            if (!this.verifyId(id)) {
                PromptUtil.show("身份证格式不正确", PromptType.ERROR);
                return;
            }

            PromptUtil.show("提交验证成功", PromptType.SUCCESS);

            let msg = new PlayerRealNameAuthenticationMsg();
            msg.playerIndex = LobbyData.playerVO.playerIndex + "";
            msg.playerRealName = name;
            msg.playerRealID = id;
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_REAL_NAME_AUTHENTICATION_ACK);
        }

        private verifyName(name: string):boolean {
            if (name.indexOf("·") != -1 || name.indexOf("•") != -1) {
                if (name.match("^[\\u4e00-\\u9fa5]+[·•][\\u4e00-\\u9fa5]+$")) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (name.match("^[\\u4e00-\\u9fa5]+$")) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        private verifyId(idStr: string):boolean {
            if (idStr.length != 18) {
                return false;
            }

            if (!this.isAllNumberOrWithXInEnd(idStr)) {
                return false;
            }

            let nProvince = Number(idStr.substr(0,2));
            if (nProvince < 11 || nProvince > 65) {
                return false;
            }

            if (!this.isBirthDate(idStr.substr(6, 8))) {
                return false;
            }

            if (!this.checkSum(idStr)) {
                return false;
            }

            return true;
        }

        private isAllNumberOrWithXInEnd(str: string):boolean {
            let ret = str.match(/\d+X?/g);
            return ret[0] == str
        }

        private isBirthDate(date: string):boolean {
            let year = Number(date.substr(0, 4));
            let month = Number(date.substr(4, 2));
            let day = Number(date.substr(6, 2));
            if (year < 1900 || year > 2100 || month > 12 || month < 1) {
                return false;
            }

            let monthDays:Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let bLeapYear = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
            bLeapYear && (monthDays[1] = 29);

            if (day > monthDays[month-1] || day < 1) {
                return false;
            }

            return true;
        }

        private checkSum(idStr: string) {
            let wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];
            let vi= [ '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' ]; 
            let nums:Array<number> = [];
            let retStr = idStr.substr(0, 17);
            let sum = 0;
            for (let i = 0;i < retStr.length;i ++) {
                sum = sum + Number(retStr[i])*wi[i];
            }
            
            return vi[sum % 11] == idStr.substr(17, 1);
        }
    }
}