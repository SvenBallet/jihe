module FL {

    /**
     * DragonBones 组名字
     */
    export enum DBGroupName {
        BU_HUA,  //补花
        SHAI_ZI,
        ZHUA_NIAO,  // 抓鸟
        SEND_KISS, //道具飞吻
        SEND_CHEER, //干杯
        THROW_EGG,  //鸡蛋
        SEND_ROSE, //玫瑰
        THROW_SHOES, //拖鞋
        THROW_BOOM,  //炸弹
        CHUN_TIAN, //春天
        FEI_JI = 107, //飞机
        ZHA_DAN = 108, //炸弹（扑克）
    }

    /**
     * 深圳市天天爱科技有限公司 版权所有
     * @Name:  MahjongBase - AnimationUtil
     * @Description:  //龙骨动画的改造
     * @Create: DerekWu on 2017/12/4 17:55
     * @Version: V1.0
     */
    export class DragonBonesUtil {

        /** 龙骨组对应资源Map */
        private static _bdGroupResMap: { [groupName: number]: { groupData: string, textureAtlas: string } };
        /** 已经初始化的配置map */
        private static _initConfMap: { [groupName: number]: boolean } = {};

        /**
         * 初始化龙骨组对应的资源
         */
        private static initDBGroupRes(): void {
            if (!this._bdGroupResMap) {
                let vBDGroupResMap: { [groupName: number]: { groupData: string, textureAtlas: string } } = {};
                vBDGroupResMap[DBGroupName.BU_HUA] = { groupData: "buhua_ske_dbmv", textureAtlas: "buhua_tex_png" };
                vBDGroupResMap[DBGroupName.ZHUA_NIAO] = { groupData: "zhuaniao_ske_dbmv", textureAtlas: "zhuaniao_tex_png" };
                vBDGroupResMap[DBGroupName.SEND_KISS] = { groupData: "feiwen_ske_dbmv", textureAtlas: "feiwen_tex_png" };
                vBDGroupResMap[DBGroupName.SEND_CHEER] = { groupData: "ganbei_ske_dbmv", textureAtlas: "ganbei_tex_png" };
                vBDGroupResMap[DBGroupName.THROW_EGG] = { groupData: "jidan_ske_dbmv", textureAtlas: "jidan_tex_png" };
                vBDGroupResMap[DBGroupName.SEND_ROSE] = { groupData: "meigui_ske_dbmv", textureAtlas: "meigui_tex_png" };
                vBDGroupResMap[DBGroupName.THROW_SHOES] = { groupData: "tuoxie_ske_dbmv", textureAtlas: "tuoxie_tex_png" };
                vBDGroupResMap[DBGroupName.THROW_BOOM] = { groupData: "zhadan_ske_dbmv", textureAtlas: "zhadan_tex_png" };
                vBDGroupResMap[DBGroupName.ZHA_DAN] = { groupData: "rfzhadan_ske_dbmv", textureAtlas: "rfzhadan_tex_png" };
                vBDGroupResMap[DBGroupName.CHUN_TIAN] = { groupData: "chuntian_ske_dbmv", textureAtlas: "chuntian_tex_png" };
                vBDGroupResMap[DBGroupName.FEI_JI] = { groupData: "feiji_ske_dbmv", textureAtlas: "feiji_tex_png" };
                vBDGroupResMap[DBGroupName.SHAI_ZI] = { groupData: "diusaizi_ske_dbmv", textureAtlas: "diusaizi_tex_png" };
                this._bdGroupResMap = vBDGroupResMap;
            }
        }

        /**
         * 构建龙骨影片
         * @param {FL.DBGroupName} groupName
         * @param {string} movieName
         * @returns {dragonBones.Movie}
         */
        public static buildMovie(groupName: DBGroupName, movieName: string = "armatureName"): dragonBones.Movie {
            let self = this;
            if (!self._bdGroupResMap) {
                //初始化组资源
                self.initDBGroupRes();
            }
            if (!self._initConfMap[groupName]) {
                //没有初始化配置则初始化，一个数据只用初始化一份
                let vOneGroupResObj: { groupData: string, textureAtlas: string } = self._bdGroupResMap[groupName];
                dragonBones.addMovieGroup(RES.getRes(vOneGroupResObj.groupData), RES.getRes(vOneGroupResObj.textureAtlas), "FL_" + groupName); // 添加动画数据和贴图
                self._initConfMap[groupName] = true;
            }
            // let vMovie:dragonBones.Movie = dragonBones.buildMovie(movieName, "FL_"+groupName); // 创建 白鹭极速格式 的动画
            return dragonBones.buildMovie(movieName, "FL_" + groupName); // 创建 白鹭极速格式 的动画
        }

        // /**
        //  * 构建龙骨
        //  * @param {string} skeDataRes
        //  * @param {string} texDataRes
        //  * @param {string} texRes
        //  * @param {string} armatureName
        //  * @returns {dragonBones.EgretArmatureDisplay}
        //  */
        // public static buildArmature(skeDataRes:string,texDataRes:string, texRes:string, armatureName:string ="armatureName"):dragonBones.EgretArmatureDisplay {
        // let dragonBonesData = RES.getRes(skeDataRes );
        // let textureData = RES.getRes(texDataRes );
        // let texture = RES.getRes(texRes);
        // this._dbEgretFactory.parseDragonBonesData(dragonBonesData);
        // this._dbEgretFactory.parseTextureAtlasData(textureData, texture);
        // return this._dbEgretFactory.buildArmatureDisplay(armatureName);
        //
        //     dragonBones.addMovieGroup(RES.getRes("movie"), RES.getRes("texture")); // 添加动画数据和贴图
        //     var movie:dragonBones.Movie = dragonBones.buildMovie("DragonBoy"); // 创建 白鹭极速格式 的动画
        //     movie.play("walk"); // 播放动画
        // }

    }

    // namespace demosEgret {
    //     /**
    //      * How to use
    //      * 1. Load data.
    //      * 2. addMovieGroup();
    //      * 3. movie = buildMovie("movieName");
    //      * 4. movie.play("clipName");
    //      * 5. addChild(movie);
    //      */
    //     export class HelloMovie extends BaseTest {
    //         public constructor() {
    //             super();
    //
    //             this._resourceConfigURL = "resource/HelloMovie.res.json";
    //         }
    //         /**
    //          * Init.
    //          */
    //         protected createGameScene(): void {
    //             dragonBones.addMovieGroup(RES.getRes("movie"), RES.getRes("texture"));
    //
    //             const movie = dragonBones.buildMovie("DragonBoy");
    //
    //             // Movie listener.
    //             movie.addEventListener(dragonBones.MovieEvent.START, this._movieHandler, this);
    //             movie.addEventListener(dragonBones.MovieEvent.LOOP_COMPLETE, this._movieHandler, this);
    //             movie.addEventListener(dragonBones.MovieEvent.COMPLETE, this._movieHandler, this);
    //             movie.addEventListener(dragonBones.MovieEvent.FRAME_EVENT, this._movieHandler, this);
    //
    //             movie.play("walk");
    //             this.addChild(movie);
    //
    //             movie.x = this.stage.stageWidth * 0.5;
    //             movie.y = this.stage.stageHeight * 0.5 + 100;
    //         }
    //         /**
    //          * Movie listener.
    //          */
    //         private _movieHandler(event: dragonBones.MovieEvent): void {
    //             console.log("Movie.", event.type, event.clipName, event.name || "");
    //         }
    //     }
    // }
}