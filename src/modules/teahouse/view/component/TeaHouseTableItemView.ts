module FL {
    /** 茶楼桌子元素数据接口   */
    export interface ITHTableItem {
        // num: number;//人数
        index: number;//桌子序号
        id: any;//桌子ID        
        isBegin?: boolean;//是否开始
        curNum?: number;//当前局数
        totalNum?: number;//总人数
        infos: ITHPlayerInfo[];//牌桌上玩家信息
        curentCount?: number; //当前局数
        totalRound?: number; //总局数
    }

    /** 茶楼桌子元素视图 */
    export class TeaHouseTableItemView extends eui.ItemRenderer {
        public indexLab:eui.Label;
        /** 桌子背景图 */
        private bgImg: eui.Image;
        /** 玩家显示组*/
        private playerGroup: eui.DataGroup;
        /** 桌子状态 */
        private tableState: eui.Label;
        public tableStateImg:eui.Image;
        /** 桌子详情 */
        private tableDetail: eui.Group;
        /** 显示组数据源 */
        private arrCollection: eui.ArrayCollection;

        /** 数据源 */
        public data: ITHTableItem;
        /** 详情 */
        public xiangqingImg:eui.Image;

        constructor() {
            super();
            this.skinName = "skins.TeaHouseTableItemViewSkin";
        }

        protected childrenCreated() {
            let self = this;
            //注册触摸缓动事件
            TouchTweenUtil.regTween(self.xiangqingImg, self.xiangqingImg);

            //注册监听事件
            // self.tableBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showTableDetail, self);
            self.tableDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinTable, self);
            self.bgImg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.joinTable, self);
            self.xiangqingImg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.showTableDetail, self);
        }

        /** 显示桌子详情 */
        private showTableDetail() {
            if (!this.data || !this.data.infos) return;
            // 空桌子不弹出详情
            let flag = true;
            for (let i = 0;i < this.data.infos.length;i ++) {
                if (this.data.infos[i].info) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                PromptUtil.show("此房间目前没有玩家", PromptType.ALERT);
                return
            }
            let tbd: TeaHouseTableDetailView = new TeaHouseTableDetailView();
            let infos = this.data.infos.filter(x => x) || [];
            tbd.initView(infos, this.data.index, this.data);
            MvcUtil.addView(tbd);
        }

        /** 初始化视图 */
        private initView() {
            if (!this.data) return;
            if (!this.arrCollection) this.arrCollection = new eui.ArrayCollection();
            if (this.data.infos.length == 2) {
                // 不要怀疑，天才布局操作,2人场选座位需要修改这里
                let mInfos: ITHPlayerInfo[] = [];
                mInfos.push(null);
                mInfos.push(this.data.infos[1]);
                mInfos.push(this.data.infos[0]);
                this.arrCollection.replaceAll(mInfos);
                this.playerGroup.layout = this.getLayout();
            }
            else {
                this.arrCollection.replaceAll(this.data.infos);
                this.playerGroup.layout = new TableLayout();
            }
            this.playerGroup.dataProvider = this.arrCollection;
            this.playerGroup.itemRenderer = TeaHousePlayerItemView;
            this.indexLab.text = this.data.index + "";
            if (this.data.isBegin || this.data.curentCount > 1) {
                this.tableStateImg.visible = false;
                this.tableState.visible = true;
                let curentCount:number = this.data.curentCount || 1;
                let totalRound:number = this.data.totalRound || 8;
                this.tableState.text = "第" + curentCount + "/" + totalRound + "局";
            }
            else {
                this.tableStateImg.visible = true;
                this.tableState.visible = false;
            }
            this.drawTableIndex();
            this.alterBg();
        }

        /** 根据游戏类型和游戏人数更换桌子背景图 */
        private alterBg() {
            let num = this.data.totalNum;//person number
            let type = EGameType[TeaHouseData.curType];//current game type 
            if (TeaHouseData.curType == EGameType.MAHJONG) {
                type = EGameType[EGameType.MJ];
            }
            let res = "th_table_" + num + "_png";// table background resource
            this.bgImg.source = res;
        }

        /** 绘制桌子序号 */
        private drawTableIndex() {
            this.indexLab.text = this.data.index + "";
        }

        /** 刷新视图 */
        public refreshView(data = this.data) {
            this.data = data;
            this.arrCollection.replaceAll(this.data.infos);
            this.playerGroup.validateNow();
        }

        /** 根据人数获取布局 */
        private getLayout() {
            let tileLayout = new eui.TileLayout();
            tileLayout.requestedColumnCount = 2;
            tileLayout.requestedRowCount = 2;
            tileLayout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_GAP;
            tileLayout.paddingTop = 5;
            tileLayout.verticalAlign = eui.RowAlign.JUSTIFY_USING_GAP;

            return tileLayout;
        }

        /** 
         * 加入牌桌
         */
        private joinTable() {
            if (TeaHouseData.isOff) {
                PromptUtil.show("暂停营业中", PromptType.ERROR);
                return;
            }
            else {
                if (this.data) {
                    let msg = new AccessTeaHouseDeskMsg();
                    msg.deskNum = this.data.index;
                    // 选择位置，-1则为默认位置
                    msg.tablePos = -1;
                    msg.teaHouseId = TeaHouseData.curID;
                    msg.teaHouseLayer = TeaHouseData.curFloor;
                    console.log(msg);
                    ServerUtil.sendMsg(msg);
                }
                else {
                    // 茶楼数据异常，重走进入茶楼逻辑
                    console.warn("desk data error");
                    if (TeaHouseData.curID) {
                        TeaHouseMsgHandle.sendAccessTeaHouseMsg(TeaHouseData.curID);
                    }
                }
            }
        }

        /** 数据改变视图 */
        private changeView() {
            if (!this.data) return;
        }

        protected dataChanged() {
            this.initView();
        }
    }


    let UIComponentClass = "eui.UIComponent";
    /**桌子自定义桌子布局类*/
    export class TableLayout extends eui.LayoutBase{
        public constructor(){
            super();
        }

        public measure():void{
            super.measure();
        }
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (this.target==null)
                return;
            let centerX:number = unscaledWidth/2;
            let count:number = this.target.numElements;
            let maxX:number = 0;
            let maxY:number = 0;
            for (let i:number = 0; i < count; i++){
                let layoutElement:eui.UIComponent = <eui.UIComponent> ( this.target.getVirtualElementAt(i) );
                if ( !egret.is(layoutElement,UIComponentClass) || !layoutElement.includeInLayout ) {
                    continue;
                }

                let elementWidth:number = 96;
                let elementHeight:number = 96;
                let childX:number;
                let childY:number

                if (count == 3) {
                    if (i == 0) {
                    childX = centerX - elementWidth/2;
                        childY = -15;
                    }
                    else if (i == 1) {
                        childX = 0;
                        childY = elementHeight;
                    }
                    else {
                        childX = unscaledWidth-elementWidth;
                        childY = elementHeight;
                    }
                }
                else if (count == 4) {
                    if (i == 0) {
                        childX = 13;
                        childY = 0;
                    }
                    else if (i == 1) {
                        childX = unscaledWidth-elementWidth - 10;
                        childY = 0;
                    }
                    else if (i == 2){
                        childX = 0;
                        childY = elementHeight;
                    }
                    else {
                        childX = unscaledWidth-elementWidth;
                        childY = elementHeight;
                    }
                }
                
                layoutElement.setLayoutBoundsPosition(childX, childY);
                maxX = Math.max(maxX,childX+elementWidth);
                maxY = Math.max(maxY,childY+elementHeight);
            }
            this.target.setContentSize(maxX,maxY);
        }
    }
}