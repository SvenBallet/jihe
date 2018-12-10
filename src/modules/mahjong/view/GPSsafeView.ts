module FL {
    export class GPSsafeView extends BaseView {

        public readonly mediatorName: string = GPSsafeViewMediator.NAME;
        public readonly viewLayer: ViewLayerEnum = ViewLayerEnum.POPUP;

        public closeBtn: eui.Image;

        /**下方位置图标*/
        public downGroup: eui.Group;
        public downImg: eui.Image;
        public downHeader: eui.Image;

        /**左方位置图标*/
        public leftGroup: eui.Group;
        public leftImg: eui.Image;
        public leftHeader: eui.Image;

        /**右方位置图标*/
        public rightGroup: eui.Group;
        public rightImg: eui.Image;
        public rightHeader: eui.Image;

        /**上方位置图标*/
        public upGroup: eui.Group;
        public upImg: eui.Image;
        public upHeader: eui.Image;

        /** 两个点的距离描述组 */
        public distance_0_1: eui.Group;
        public distance_0_2: eui.Group;
        public distance_0_3: eui.Group;
        public distance_1_2: eui.Group;
        public distance_1_3: eui.Group;
        public distance_2_3: eui.Group;

        /** 两个点的距离 */
        public dist_0_1: eui.Label;
        public dist_0_2: eui.Label;
        public dist_0_3: eui.Label;
        public dist_1_2: eui.Label;
        public dist_1_3: eui.Label;
        public dist_2_3: eui.Label;

        /** 没有数据提示 */
        public tipLabel: eui.Label;

        /**地球半径*/
        public static readonly EARTH_RADIUS: number = 6378.137;

        /** 方位点图标资源 */
        public static readonly GREEN_ICON: string = "green_png";
        public static readonly RED_ICON: string = "red_png";

        /** 不安全距离 */
        public static readonly INSECURE_DISTANCE: number = 100;

        /**人数*/
        public _person: number = GameConstant.CURRENT_HANDLE.getGameMaxNum();

        /** 四个方位的经纬度 */
        public gpsInfos: Array<object> = [
            { "px": 0, "py": 0 }, //p1 上
            { "px": 0, "py": 0 }, //p2 右
            { "px": 0, "py": 0 }, //p3 下
            { "px": 0, "py": 0 }  //p4 左
        ];

        public readonly msg: UpdatePlayerGPSMsg;


        /** 调停者 */
        private _mediator: GPSsafeViewMediator;


        // private static _only: GPSsafeView;

        // public static getInstance(): GPSsafeView {
        //     if (!this._only) {
        //         this._only = new GPSsafeView();
        //     }
        //     return this._only;
        // }


        public constructor() {
            super();
            this.verticalCenter = this.horizontalCenter = 0;
            this.skinName = "skins.GPSviewSkin";
        }

        protected childrenCreated(): void {
            let self = this;
            super.childrenCreated();

            /**初始化布局*/
            self.initLayout(self._person);

            /**初始化距离值*/
            self.initValue();

            //注册按钮点击缓动
            TouchTweenUtil.regTween(self.closeBtn, self.closeBtn);

            self._mediator = new GPSsafeViewMediator(self);
        }

        protected onAddView(): void {
            MvcUtil.regMediator(this._mediator);
        }

        /**
         * 根据人数初始化布局
         * @param {number} person
         */
        private initLayout(person: number): void {
            let self = this;
            if (person === 2) {
                self.removeChild(self.distance_0_1);
                self.removeChild(self.distance_0_3);
                self.removeChild(self.distance_1_2);
                self.removeChild(self.distance_1_3);
                self.removeChild(self.distance_2_3);
                self.removeChild(self.leftGroup);
                self.removeChild(self.rightGroup);
            } else if (person === 3) {
                self.removeChild(self.distance_0_1);
                self.removeChild(self.distance_0_2);
                self.removeChild(self.distance_0_3);
                self.removeChild(self.upGroup);

            }

        }

        /**
         * 初始化数据
         */
        private initValue(): void {
            let self = this;
            //测试数据
            // self.gpsInfos = [
            //     {"px":0,"py":0},
            //     {"px":39.91667,"py":116.41667},
            //     {"px":22.61667,"py":114.06667},
            //     {"px":22.61663,"py":114.06663}
            // ];

            let upPlayerGps = GameConstant.CURRENT_HANDLE.getPlayerGPS(PZOrientation.UP);
            let rightPlayerGps = GameConstant.CURRENT_HANDLE.getPlayerGPS(PZOrientation.RIGHT);
            let downPlayerGps = GameConstant.CURRENT_HANDLE.getPlayerGPS(PZOrientation.DOWN);
            let leftPlayerGps = GameConstant.CURRENT_HANDLE.getPlayerGPS(PZOrientation.LEFT);

            self.gpsInfos = [
                { "px": upPlayerGps ? upPlayerGps.px : 0, "py": upPlayerGps ? upPlayerGps.py : 0 },
                { "px": rightPlayerGps ? rightPlayerGps.px : 0, "py": rightPlayerGps ? rightPlayerGps.py : 0 },
                { "px": downPlayerGps ? downPlayerGps.px : 0, "py": downPlayerGps ? downPlayerGps.py : 0 },
                { "px": leftPlayerGps ? leftPlayerGps.px : 0, "py": leftPlayerGps ? leftPlayerGps.py : 0 }
            ];

            /**如果GPS已经开启，则没有数据的提示*/
            if (self.isGPSOn(self.gpsInfos[0]) || self.isGPSOn(self.gpsInfos[1]) || self.isGPSOn(self.gpsInfos[2]) || self.isGPSOn(self.gpsInfos[3])) {
                self.removeChild(self.tipLabel);
            }

            if (self._person === 2) {
                self.initColor(0);
                self.initColor(2);
                self.calcDist(0, 2);
            } else if (self._person === 3) {
                self.initColor(1);
                self.initColor(2);
                self.initColor(3);
                self.calcDist(1, 2);
                self.calcDist(1, 3);
                self.calcDist(2, 3);
            } else if (self._person === 4) {
                self.initColor(0);
                self.initColor(1);
                self.initColor(2);
                self.initColor(3);
                self.calcDist(0, 1);
                self.calcDist(0, 2);
                self.calcDist(0, 3);
                self.calcDist(1, 2);
                self.calcDist(1, 3);
                self.calcDist(2, 3);
            }

            /**如果GPS没有开启，则删除显示距离的Label*/
            if (!self.isGPSOn(self.gpsInfos[0]) || !self.isGPSOn(self.gpsInfos[1])) {
                self.distance_0_1.removeChild(self.dist_0_1);
            }
            if (!self.isGPSOn(self.gpsInfos[0]) || !self.isGPSOn(self.gpsInfos[2])) {
                self.distance_0_2.removeChild(self.dist_0_2);
            }
            if (!self.isGPSOn(self.gpsInfos[0]) || !self.isGPSOn(self.gpsInfos[3])) {
                self.distance_0_3.removeChild(self.dist_0_3);
            }
            if (!self.isGPSOn(self.gpsInfos[1]) || !self.isGPSOn(self.gpsInfos[2])) {
                self.distance_1_2.removeChild(self.dist_1_2);
            }
            if (!self.isGPSOn(self.gpsInfos[1]) || !self.isGPSOn(self.gpsInfos[3])) {
                self.distance_1_3.removeChild(self.dist_1_3);
            }
            if (!self.isGPSOn(self.gpsInfos[2]) || !self.isGPSOn(self.gpsInfos[3])) {
                self.distance_2_3.removeChild(self.dist_2_3);
            }

        }

        /**
         *初始化图标颜色
         *@param {number} index
         *@param {} cType
         */
        private initColor(index: number, cType?: any) {
            let self = this;
            if (!cType) {
                cType = GPSsafeView.GREEN_ICON;
            }
            if (self.isGPSOn(self.gpsInfos[index])) {
                // self['img_'+index].source = cType;
                switch (index) {
                    case 0: {
                        self.upImg.source = cType;
                        break;
                    }
                    case 1: {
                        self.rightImg.source = cType;
                        break;
                    }
                    case 2: {
                        self.downImg.source = cType;
                        break;
                    }
                    case 3: {
                        self.leftImg.source = cType;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }

        /**
         *获取2个方位点的距离
         *@param {number} index1
         * @param {number} index2
         */
        private calcDist(index1, index2) {
            let self = this;
            if (self.isTwoGpsOk(self.gpsInfos[index1], self.gpsInfos[index2])) {
                let dist = GPSsafeView.getGPSDistance(self.gpsInfos[index1], self.gpsInfos[index2]);
                if (dist <= GPSsafeView.INSECURE_DISTANCE) {
                    self.initColor(index1, GPSsafeView.RED_ICON);
                    self.initColor(index2, GPSsafeView.RED_ICON);
                }
                // self['distance_'+index1+"_"+index2]['dist_'+index1+"_"+index2].formatDistance(dist);
                if (index1 === 0 && index2 === 1) {
                    self.dist_0_1.text = self.formatDistance(dist);
                } else if (index1 === 0 && index2 === 2) {
                    self.dist_0_2.text = self.formatDistance(dist);
                } else if (index1 === 0 && index2 === 3) {
                    self.dist_0_3.text = self.formatDistance(dist);
                } else if (index1 === 1 && index2 === 2) {
                    self.dist_1_2.text = self.formatDistance(dist);
                } else if (index1 === 1 && index2 === 3) {
                    self.dist_1_3.text = self.formatDistance(dist);
                } else if (index1 === 2 && index2 === 3) {
                    self.dist_2_3.text = self.formatDistance(dist);
                }
            }
        }

        /**
         * 判断gps是否有数据
         * @param {object} msg
         */
        private isGPSOn(msg): boolean {
            return (msg.px + msg.py > 0.1);
        }

        /**
         *转换成弧度制标识
         * @param {number} d
         */
        public static rad(d): number {
            return d * Math.PI / 180.0;
        }


        /**
         * 判断是否2个gps同时有数据
         * @param {}
         */
        private isTwoGpsOk(gps1, gps2): boolean {
            return this.isGPSOn(gps1) && this.isGPSOn(gps2);
        }


        /**
         * 通过经纬度计算2个点的距离（longitude经度，latitude纬度）
         * @param {number} lat1
         * @param {number} lng1
         * @param {number} lat2
         * @param {number} lng2
         */
        public static GetTwoPointDistance(lat1, lng1, lat2, lng2): number {
            let self = this;
            let radLat1 = self.rad(lat1);
            let radLat2 = self.rad(lat2);
            let a = radLat1 - radLat2;
            let b = self.rad(lng1) - self.rad(lng2);
            let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * GPSsafeView.EARTH_RADIUS;
            return s;
        }


        /**
         * 获取2个gps信息的距离
         * @param {px:number,py:number} gps1
         * @param {px:number,py:number} gps2
         */
        public static getGPSDistance(gps1, gps2): number {
            let res = this.GetTwoPointDistance(
                gps1.px,
                gps1.py,
                gps2.px,
                gps2.py
            );

            res = res * 1000;
            return Math.floor(res);
        }


        /**
         * 格式化gps距离显示
         * @param {number} dis
         */
        private formatDistance(dis): string {
            if (!dis) {
                return "0m";
            }
            dis = parseInt(dis);
            if (dis < 1000) {
                return dis + "m";
            } else if (dis < 10000) {
                return dis / 1000 + "km";
            } else {
                return Math.floor(dis / 1000) + "km";
            }
        }

    }
}