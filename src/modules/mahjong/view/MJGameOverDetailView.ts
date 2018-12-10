module FL {
    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - MJGameOverDetailView
     * @Description:  // 游戏结束详细界面
     * @Create: DerekWu on 2018/3/13 10:40
     * @Version: V1.0
     */
    // export class MJGameOverDetailView extends BaseView {

    //     /** 调停者名字，删除界面的时候会自动移除，为空则没有调停者 */
    //     public readonly mediatorName: string = "";
    //     /** 界面层级，UI框架自动管理 */
    //     public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP_ONLY;

    //     /** 关闭按钮组 */
    //     public closeBtnGroup: eui.Group;
    //     public closeBtn: eui.Group;

    //     /** 胡的牌图片，使用bottom组 */
    //     public huCard: eui.Image;

    //     /** 玩法描述 */
    //     public wanfaDesc: eui.Label;

    //     /** 第一个明细列表 */
    //     public firstDetailItem:FL.MJGameOverDetailItem;

    //     /** 所有玩家的详细明细组，里面水平自动布局 */
    //     public detailItemGroup: eui.Group;

    //     /** 游戏结束消息 */
    //     private readonly _gameOverMsg:PlayerGameOverMsgAck;

    //     constructor(pGameOverMsg:PlayerGameOverMsgAck) {
    //         super();
    //         this._gameOverMsg = pGameOverMsg;
    //         this.verticalCenter = this.horizontalCenter = 0;
    //         this.skinName = "skins.MJGameOverDetailViewSkin";
    //         //不可触摸
    //         this.touchEnabled = false;
    //     }

    //     protected childrenCreated():void {
    //         super.childrenCreated();
    //         let self = this;
    //         // 注册按钮点击缓动
    //         TouchTweenUtil.regTween(self.closeBtnGroup, self.closeBtn);

    //         // 监听按钮点击事件
    //         self.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.close, self);

    //         // 初始化界面显示
    //         this.init();
    //     }

    //     /**
    //      * 初始化
    //      */
    //     private init(): void {
    //         let self = this;
    //         // 设置胡的牌图片
    //         self.huCard.source = MJGameHandler.getCardResName(PZOrientation.UP, MJGameHandler.getHuCard(self._gameOverMsg));
    //         // 设置详细描述
    //         self.wanfaDesc.text = MJGameHandler.getGameOverDetailWanfaDesc();

    //         // 增加玩家结算明细
    //         let players:Array<SimplePlayer> = self._gameOverMsg.players;
    //         // 明细
    //         let vScoreDetail:GameOverScoreDetail = self._gameOverMsg.scoreDetail;
    //         // 设置平胡什么的
    //         self.firstDetailItem.huText.text = vScoreDetail.huDesc;

    //         for (let vIndex:number = 0; vIndex < players.length; ++vIndex) {
    //             let vSimplePlayer: SimplePlayer = players[vIndex];
    //             let vDetailItem: MJGameOverDetailItem = new MJGameOverDetailItem();
    //             vDetailItem.skinName = "skins.MJGameOverDetailItemSkin";
    //             vDetailItem.playerIndex.text = ""+vSimplePlayer.palyerIndex; // ID
    //             vDetailItem.playerName.text = StringUtil.subStrSupportChinese(vSimplePlayer.playerName, 12, "."); // 名字
    //             vDetailItem.zhuangXian.text = vScoreDetail.zhuangXianDesc[vIndex]; // 庄闲
    //             vDetailItem.huText.text = "" + vScoreDetail.huBaseScore[vIndex]; // 胡分数
    //             vDetailItem.niaoNum.text = "" + vScoreDetail.baseItems[0].values[vIndex]; // 中鸟数量
    //             vDetailItem.niaoScore.text = "" + vScoreDetail.countScoreItems[0].values[vIndex]; // 中鸟计分
    //             vDetailItem.gangScore.text = "" + vScoreDetail.countScoreItems[1].values[vIndex]; // 杠计分
    //             //设置分数
    //             // let vScoreText:string;
    //             // if (vSimplePlayer.gold > 0) {
    //             //     vScoreText = "+"+vSimplePlayer.gold;
    //             // } else {
    //             //     vScoreText = ""+vSimplePlayer.gold;
    //             // }
    //             vDetailItem.totailScore.text = ""+vSimplePlayer.gold; // 总结算

    //             // 添加显示
    //             self.detailItemGroup.addChild(vDetailItem);
    //         }
    //     }

    //     /**
    //      * 关闭界面
    //      */
    //     private close(): void {
    //         MvcUtil.delView(this);
    //     }

    // }
}