module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubProxy
     * @Description:  俱乐部代理
     * @Create: ArielLiang on 2018/3/7 10:21
     * @Version: V1.0
     */
    export class ClubProxy extends puremvc.Proxy {

        /** 代理名 */
        public static readonly NAME: string = "ClubProxy";
        /** 单例 */
        private static _only: ClubProxy;

        private constructor() {
            super(ClubProxy.NAME);
        }

        public static getInstance(): ClubProxy {
            if (!this._only) {
                this._only = new ClubProxy();
            }
            return this._only;
        }

        /**
         * 创建俱乐部返回
         * @param {FL.CreateClubMsgAck} msg
         */
        public exeCreateClubMsgAck(msg: CreateClubMsgAck): void {
            let resCode: number = msg.result;
            if (resCode === 0) {
                PromptUtil.show("创建俱乐部成功", PromptType.SUCCESS);
                MvcUtil.send(ClubModule.CLUB_INTO_CLUB);
            }
            else if (resCode === 0x1) {
                PromptUtil.show("俱乐部名称长度不对", PromptType.ERROR);
            }
            else if (resCode === 0x2) {
                PromptUtil.show("俱乐部公告长度不对", PromptType.ERROR);
            }
            else if (resCode === 0x4) {
                PromptUtil.show("非群主权限", PromptType.ERROR);
            }
            else if (resCode === 0x8) {
                PromptUtil.show("创建俱乐部数量受限", PromptType.ERROR);
            }
            else if (resCode === 0x100) {
                PromptUtil.show("俱乐部名称存在敏感字符", PromptType.ERROR);
            }
            else if (resCode === 0x200) {
                PromptUtil.show("俱乐部公告存在敏感字符", PromptType.ERROR);
            }
            else if (resCode === 0x400) {
                PromptUtil.show("俱乐部名字已存在", PromptType.ERROR);
            } else {
                PromptUtil.show("创建俱乐部失败", PromptType.ERROR);
            }
        }

        /**
         * 查询俱乐部返回
         * @param {FL.SearchClubMsgAck} msg
         */
        public exeSearchClubMsgAck(msg: SearchClubMsgAck): void {
            let page = msg.page;
            let list = msg.result;

            if (list.length === 0) {
                if (msg.unused_0 === 1) {
                    PromptUtil.show("暂无此俱乐部", PromptType.ALERT);

                }
            }
            MvcUtil.send(ClubModule.CLUB_SEARCH_CLUB_LIST, msg);
        }

        /**
         * 申请加入俱乐部返回
         * @param {FL.ApplyClubMsgAck} msg
         */
        public exeApplyClubMsgAck(msg: ApplyClubMsgAck): void {
            let resCode = msg.result;
            if (resCode === 0) {
                PromptUtil.show("提交成功，请等待通过", PromptType.SUCCESS);
            } else if (resCode === 1) {
                PromptUtil.show("已经申请此俱乐部", PromptType.ALERT);
            } else if (resCode === 2) {
                PromptUtil.show("已经加入此俱乐部", PromptType.ALERT);
            } else if (resCode === 4) {
                PromptUtil.show("加入俱乐部数量已满", PromptType.ALERT);
            } else {
                PromptUtil.show("申请错误", PromptType.ERROR);
            }
        }

        /**
         * 钻石操作返回
         * @param {FL.ClubOptDiamondMsgAck} msg
         */
        public exeClubOptDiamondMsgAck(msg: ClubOptDiamondMsgAck): void {
            let resCode = msg.result;
            if (resCode === 0) {
                MvcUtil.send(ClubModule.CLUB_REFRESH_DIAMOND, msg.diamond);
                PromptUtil.show("提交成功", PromptType.SUCCESS);
            } else if (resCode === 2) {
                PromptUtil.show("钻石不足", PromptType.ERROR);
            } else {
                PromptUtil.show("操作失败", PromptType.ERROR);
            }
        }

        /**
         * 成员列表
         * @param {FL.ShowMemberListMsgAck} msg
         */
        public exeShowMemberListMsgAck(msg: ShowMemberListMsgAck): void {
            MvcUtil.send(ClubModule.CLUB_SHOW_MEMBER_LIST, msg);
        }

        /**
         * 成员操作返回
         * @param {FL.OptMemberMsgAck} msg
         */
        public exeOptMemberMsgAck(msg: OptMemberMsgAck): void {
            let resCode = msg.result;
            if (resCode === OptMemberMsgAck.SUCCESS) {
                MvcUtil.send(ClubModule.CLUB_GET_MEMBER_LIST);
                PromptUtil.show("操作成功", PromptType.SUCCESS);
            } else if (resCode === OptMemberMsgAck.CAN_NOT_OPT_SELF) {
                PromptUtil.show("不能操作自己", PromptType.ERROR);
            } else if (resCode === OptMemberMsgAck.ADMIN_MEMBER_LIMIT) {
                PromptUtil.show("管理员数量超出限制", PromptType.ERROR);
            } else if (resCode === OptMemberMsgAck.MEMBER_NOT_FOUND) {
                PromptUtil.show("成员不存在", PromptType.ERROR);
            } else {
                PromptUtil.show("操作失败", PromptType.ERROR);
            }
        }

        /**
         *开房设置返回
         * @param {FL.SetTableSettingsMsgAck} msg
         */
        public exeSetTableSettingsMsgAck(msg: SetTableSettingsMsgAck): void {
            let resCode = msg.result;
            if (resCode === SetTableSettingsMsgAck.SUCCESS) {
                PromptUtil.show("操作成功", PromptType.SUCCESS);
                MvcUtil.addView(ClubBaseView.getInstance());
            } else if (resCode === SetTableSettingsMsgAck.PRIV_ERROR) {
                PromptUtil.show("权限不足", PromptType.ERROR);
            } else {
                PromptUtil.show("操作失败", PromptType.ERROR);
            }
        }

        /**
         *获取开房设置返回
         * @param {FL.GetTableSettingsMsgAck} msg
         */
        public exeGetTableSettingsMsgAck(msg: GetTableSettingsMsgAck): void {
            egret.log(msg);

            let vLobbyCreateGameView = new LobbyCreateGameView();
            MvcUtil.addView(vLobbyCreateGameView);
            let vClubPlanSetting: ClubPlanSetting;
            for (let k=0, settingLeng = msg.settings.length; k<settingLeng; k++){
                vClubPlanSetting = msg.settings[k]?msg.settings[k]:new ClubPlanSetting();
                /** 默认自动开房设置，不能取创建房间的缓存值*/
                vLobbyCreateGameView.autoOpenRoom.selected = vClubPlanSetting.autoKaiFang;
                if(vClubPlanSetting.primaryType === MJGamePlayWay.ZHUANZHUAN){
                    vLobbyCreateGameView.setMJSetting(vClubPlanSetting);
                }else if(vClubPlanSetting.primaryType === ECardGamePlayWay.JING_DIAN_PAO_DE_KUAI || ECardGamePlayWay.SHI_WU_ZHANG_PAO_DE_KUAI){
                    vLobbyCreateGameView.setRFSetting(vClubPlanSetting);
                }
            }


        }

        /**
         * 获取房间列表返回
         * @param {FL.ClubGetInfoMsgAck} msg
         */
        public exeClubGetInfoMsgAck(msg: ClubGetInfoMsgAck): void {
            egret.log(msg);
        }

        /**
         * 排行榜返回
         * @Written: HoyeLee
         */
        public exeShowRankMsgAck(msg: ShowRankMsgAck): void {
            // console.log('yes,show rank back');
            MvcUtil.send(ClubModule.CLUB_SHOW_RANK_LIST, msg);
        }

        /**
         * 日志记录返回
         * @Written: HoyeLee
         */
        public exeClubLogMsgAck(msg: ClubLogMsgAck): void {
            // console.log('yes,show rank back');
            MvcUtil.send(ClubModule.CLUB_SHOW_LOG_LIST, msg);
        }

        /**
         * 公告编辑返回
         * @Written: HoyeLee
         */
        public exeClubModifyMsgAck(msg: ClubModifyMsgAck): void {
            MvcUtil.send(ClubModule.CLUB_NOTICE_MODIFY, msg);
        }

        /**
         * 解散俱乐部返回
         * @Written: HoyeLee
         */
        public exeClubDismissMsgAck(msg: ClubDismissMsgAck): void {
            MvcUtil.send(ClubModule.CLUB_DISMISS_CLUB, msg);
        }

        /**
         * 退出俱乐部返回
         * @Written: HoyeLee
         */
        public exeClubExitMsgAck(msg: ClubExitMsgAck): void {
            MvcUtil.send(ClubModule.CLUB_EXIT_CLUB, msg);
        }

        /**
         * 申请列表返回
         * @Written: HoyeLee
         */
        public exeShowApplyListMsgAck(msg: ShowRankMsgAck): void {
            MvcUtil.send(ClubModule.CLUB_SHOW_APPLY_LIST, msg);
        }

        /**
         * 操作申请列表返回
         * @Written: HoyeLee
         */
        public exeOptApplyListMsgAck(msg: OptApplyListMsgAck): void {
            MvcUtil.send(ClubModule.CLUB_OPT_APPLY_LIST, msg);
        }
    }
}