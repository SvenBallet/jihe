module FL {
    /** 茶楼管理---基础设置页面 */
    export class TeaHouseMgrSettingView extends eui.Component {
        /** 确定按钮 */
        private comfirmGroup: eui.Group;
        private confirmBtn: GameButton;

        /** 茶楼名字 */
        private teaHouseName: eui.Label;
        /** 茶楼公告 */
        private teaHouseNotice: eui.Label;
        /** 战绩重置时间 */
        private resetTime: eui.Label;
        /** 同IP禁止同桌 */
        private sameIPCheck: eui.CheckBox;
        private sameIP: eui.ToggleSwitch;

        /** 茶楼审核 */
        private verifyCheck: eui.CheckBox;
        private verify: eui.ToggleSwitch;

        /** 防封群（禁止分享） */
        private shareCheck: eui.CheckBox;
        private share: eui.ToggleSwitch;

        /** 禁止坏表情 */
        private emoticonCheck: eui.CheckBox;
        private emoticon: eui.ToggleSwitch;


        constructor() {
            super();
            this.top = this.bottom = this.left = this.right = 0;
            this.skinName = "skins.TeaHouseMgrSettingViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册缓动事件
            TouchTweenUtil.regTween(self.comfirmGroup, self.confirmBtn);
            //注册监听事件
            self.comfirmGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, self.confirmSetting, self);
            self.initView();
        }

        /** 
         * 确认设置
         */
        private confirmSetting() {
            let msg = new TeaHouseBasicSettingMsg();
            msg.alikeIpForbindDeskmate = (this.sameIP.selected) ? TeaHouse.A_LIKE_IP_FOR_BIND_DESKMATE_ON : TeaHouse.A_LIKE_IP_FOR_BIND_DESKMATE_OFF;
            msg.checkTeaHouse = (this.verify.selected) ? TeaHouse.CHECK_TEAHOUSE_ON : TeaHouse.CHECK_TEAHOUSE_OFF;
            msg.forbidShare = (this.share.selected) ? TeaHouse.FORBID_SHARE_ON : TeaHouse.FORBID_SHARE_OFF;
            msg.recordResetTime = parseInt((this.resetTime.text));
            msg.teaHouseId = TeaHouseData.curID;
            msg.teaHouseLayerId = TeaHouseData.curFloor;
            msg.teahouseLayerName = this.teaHouseName.text;
            msg.layerNotice = this.teaHouseNotice.text;
            console.log(msg);
            ServerUtil.sendMsg(msg, MsgCmdConstant.MSG_TEAHOUSE_BASIC_SETTING_ACK);
        }

        /** 初始化页面 */
        private initView() {
            /** 将label转换为可输入文本 */
            this.resetTime.touchEnabled = true;
            this.resetTime.type = egret.TextFieldType.INPUT;

            this.teaHouseName.touchEnabled = true;
            this.teaHouseName.type = egret.TextFieldType.INPUT;

            this.teaHouseNotice.touchEnabled = true;
            this.teaHouseNotice.multiline = true;
            this.teaHouseNotice.type = egret.TextFieldType.INPUT;

            /** 根据存储数据处理成对应页面数据 */
            let info = TeaHouseData.teaHouseInfo;
            let settings = <ITHMgrSettings>{};
            settings.sameIP = info.sameIP || false;
            settings.verify = info.verify || false;
            settings.share = info.share || false;
            settings.emoicon = info.emoicon || false;
            settings.resetTime = info.resetTime || 0;

            /** 根据数据处理页面对应信息 */
            this.sameIP.selected = settings.sameIP;
            this.verify.selected = settings.verify;
            this.share.selected = settings.share;
            this.emoticon.selected = settings.emoicon;
            this.resetTime.text = "" + settings.resetTime;
            this.teaHouseName.text = TeaHouseData.teaHouseInfo.name;
            this.teaHouseNotice.text = TeaHouseData.teaHouseInfo.notice;
        }
    }
}