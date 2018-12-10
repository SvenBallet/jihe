module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubCmd
     * @Description:  俱乐部指令
     * @Create: ArielLiang on 2018/3/7 10:21
     * @Version: V1.0
     */

    export class ClubCmd extends puremvc.SimpleCommand implements puremvc.ICommand {
        public constructor() {
            super();
        }

        public execute(notification: puremvc.INotification): void {
            let data: any = notification.getBody();
            switch (notification.getName()) {
                case ClubModule.CLUB_INTO_CLUB: {
                    this.intoClub();
                    break;
                }
                case ClubModule.CLUB_SEARCH_CLUB_LIST: {
                    this.searchClubList(data);
                    break;
                }
                case ClubModule.CLUB_CLIENT_INTO_CLUB_INSIDE: {
                    this.clientIntoClubInside();
                    break;
                }
            }
        }


        /**
         * 进入俱乐部
         */
        private intoClub(): void {
            let vSearchClubMsg: SearchClubMsg = new SearchClubMsg();
            vSearchClubMsg.content = "";
            vSearchClubMsg.page = 0;
            ServerUtil.sendMsg(vSearchClubMsg, MsgCmdConstant.MSG_SEARCH_CLUB_ACK);
        }

        /**
         * 搜索俱乐部列表
         * @param msg
         */
        private searchClubList(msg): void {
            MvcUtil.send(ClubModule.CLUB_SHOW_CLUB_LIST, msg);
        }

        /**
         * 客户端进入俱乐部里面
         */
        private clientIntoClubInside():void {
            MvcUtil.addView(ClubBaseView.getInstance());
        }
    }
}