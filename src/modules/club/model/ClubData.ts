module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - ClubData
     * @Description:  俱乐部信息
     * @Create: ArielLiang on 2018/3/12 14:00
     * @Version: V1.0
     */
    export class ClubData {

        public static vClub: Club;
        /** 普通成员 */
        public static readonly CLUB_TYPE_MEMBER = 4;
        /** 管理员 */
        public static readonly CLUB_TYPE_ADMIN = 2;
        /** 创建者 */
        public static readonly CLUB_TYPE_CREATOR = 1;
    }
}