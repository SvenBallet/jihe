module Game {

	/**
	 * 游戏驱动
	 */
	export class GameDrive extends egret.EventDispatcher {

		//单例
		private static _only:GameDrive;

		/** 是否启动 */
		private _isStart:boolean = false;

		/** egret 显示舞台，用来注册帧事件 */
        private _egretStage:egret.Stage;

		/** ai_logic事件，执行ai逻辑事件 */
        private _aiLogicEvent: egret.Event;

		/**上次逻辑处理的时间 */
		// private _lastTime:number;
		private constructor() {
			super();
		}

		public static getInstance():GameDrive {
			if (!this._only) {
				this._only = new GameDrive();
			}
			return this._only;
		}

		/**
		 * 启动 
		 */
		public start():void {
			let self = this;
			if (!self._isStart) {
				//设置显示对象
            	self._egretStage = egret.MainContext.instance.stage;
				//egret.Event.ENTER_FRAME事件  
            	self._egretStage.addEventListener(egret.Event.ENTER_FRAME, self.enterFrame, self, false, -2147483648); //优先级最低，最后处理,最高优先级 2147483647

				self._isStart = true;
				// egret.log("GameDrive started");

				this.initEvent();
			}
		}

		/**
         * 初始化事件
         */
        private initEvent() {
            let self = this;
            //ai_logic事件，执行ai逻辑事件
            self._aiLogicEvent = new egret.Event(GameEvent.AI_LOGIC);
        }

		/**
         * 帧结束
         */
        private enterFrame():void {
            egret.callLater(this.exeLogic, this);
        }

		/**
		 * 处理逻辑 
		 */
		private exeLogic():void {

			// egret.log("exeLogic"); 

			//设置时间
            let tempDateTime = egret.getTimer();

			// 处理异步队列
            AsyncQueue.$process();

			//处理心跳
            Ticker.$ticker(tempDateTime);

			//龙骨动画推进
			// if(!this._lastTime)
			// 	this._lastTime = tempDateTime
			// var deltaTime = this._lastTime - tempDateTime
			// // dragonBones.WorldClock.clock.advanceTime(deltaTime);
			// this._lastTime = tempDateTime;

			//处理服务器返回消息，服务端消息改为同步处理 
            // ServerCmd.$exeServerCmd();

			//派发ai逻辑事件，使用事件来处理的原因是，事件有优先级
            this.dispatchEvent(this._aiLogicEvent); 

			//后续处理异步逻辑
            AsyncLogic.$exeAsyncLogic();

			//2D渲染前调用
			BeforeRender.$exeLogic();

		}

	}
}