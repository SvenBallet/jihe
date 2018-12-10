module Game {
    /**
     * 
     * @Name:  Game - Tween
     * @Description:  //重写egret.Tween
     * @Create: DerekWu on 2017/3/23 19:43
     * @Version: V1.0
     */
    export class Tween extends egret.EventDispatcher {
        /**
         * 不做特殊处理
         * @constant {number} egret.Tween.NONE
         * @private
         */
        private static NONE = 0;
        /**
         * 循环
         * @constant {number} egret.Tween.LOOP
         * @private
         */
        private static LOOP = 1;
        /**
         * 倒序
         * @constant {number} egret.Tween.REVERSE
         * @private
         */
        private static REVERSE = 2;

        /**
         * @private
         */
        private static _tweens: Tween[] = [];
        /**
         * @private
         */
        private static IGNORE = {};
        /**
         * @private
         */
        private static _plugins = {};
        /**
         * @private
         */
        private static _inited = false;

        /**
         * @private
         */
        private _target: any = null;
        /**
         * @private
         */
        private _useTicks: boolean = false;
        /**
         * @private
         */
        private ignoreGlobalPause: boolean = false;
        /**
         * @private
         */
        private loop: boolean = false;
        /**
         * @private
         */
        private pluginData = null;
        /**
         * @private
         */
        private _curQueueProps;
        /**
         * @private
         */
        private _initQueueProps;
        /**
         * @private
         */
        private _steps: any[] = null;
        /**
         * @private
         */
        private paused: boolean = false;
        /**
         * @private
         */
        private duration: number = 0;
        /**
         * @private
         */
        private _prevPos: number = -1;
        /**
         * @private
         */
        private position: number = null;
        /**
         * @private
         */
        private _prevPosition: number = 0;
        /**
         * @private
         */
        private _stepPosition: number = 0;
        /**
         * @private
         */
        private passive: boolean = false;

        /**
         * Activate an object and add a Tween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * Not recommended, you can use Tween.removeTweens(target) instead.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 激活一个对象，对其添加 Tween 动画
         * @param target {any} 要激活 Tween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false。
         * 不建议使用，可使用 Tween.removeTweens(target) 代替。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static get(target: any, props?: { loop?: boolean, onChange?: Function, onChangeObj?: any }, pluginData: any = null, override: boolean = false): Tween {
            if (override) {
                Tween.removeTweens(target);
            }
            return new Tween(target, props, pluginData);
        }

        /**
         * Delete all Tween animations from an object
         * @param target The object whose Tween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除一个对象上的全部 Tween 动画
         * @param target  需要移除 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static removeTweens(target: any): void {
            if (!target.Game_tween_count) {
                return;
            }
            let tweens: Tween[] = Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.Game_tween_count = 0;
        }

        /**
         * 删除一个缓动
         * @param pTween
         */
        public static removeOneTween(pTween:Tween):void {
            let vIndex:number = Tween._tweens.indexOf(pTween);
            if (vIndex !== -1) {
                Tween._tweens.splice(vIndex, 1);
                pTween._target.Game_tween_count--;
            }
        }

        /**
         * Pause all Tween animations of a certain object
         * @param target The object whose Tween to be paused
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停某个对象的所有 Tween
         * @param target 要暂停 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static pauseTweens(target: any): void {
            if (!target.Game_tween_count) {
                return;
            }
            let tweens: Tween[] = Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                }
            }
        }

        /**
         * Resume playing all easing of a certain object
         * @param target The object whose Tween to be resumed
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 继续播放某个对象的所有缓动
         * @param target 要继续播放 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static resumeTweens(target: any): void {
            if (!target.Game_tween_count) {
                return;
            }
            let tweens: Tween[] = Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = false;
                }
            }
        }

        /**
         * @private
         *
         * @param delta
         * @param paused
         */
        private static tick(timeStamp: number, paused = false): boolean {
            let delta = timeStamp - Tween._lastTime;
            Tween._lastTime = timeStamp;

            let tweens: Tween[] = Tween._tweens.concat();
            for (let i = tweens.length - 1; i >= 0; i--) {
                let tween: Tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.$tick(tween._useTicks ? 1 : delta);
            }

            return false;
        }

        private static _lastTime: number = 0;
        /**
         * @private
         *
         * @param tween
         * @param value
         */
        private static _register(tween: Tween, value: boolean): void {
            let target: any = tween._target;
            let tweens: Tween[] = Tween._tweens;
            if (value) {
                if (target) {
                    target.Game_tween_count = target.Game_tween_count > 0 ? target.Game_tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!Tween._inited) {
                    Tween._lastTime = egret.getTimer();
                    Ticker.$startTick(Tween.tick, null);
                    Tween._inited = true;
                }
            } else {
                if (target) {
                    target.Game_tween_count--;
                }
                let i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        }

        /**
         * Delete all Tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除所有 Tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static removeAllTweens(): void {
            let tweens: Tween[] = Tween._tweens;
            for (let i = 0, l = tweens.length; i < l; i++) {
                let tween: Tween = tweens[i];
                tween.paused = true;
                tween._target.Game_tween_count = 0;
            }
            tweens.length = 0;
        }

        /**
         * 创建一个 egret.Tween 对象
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(target: any, props: any, pluginData: any) {
            super();
            this.initialize(target, props, pluginData);
        }

        /**
         * @private
         *
         * @param target
         * @param props
         * @param pluginData
         */
        private initialize(target:any, props: any, pluginData: any): void {
            let self = this;
            self._target = target;
            if (props) {
                self._useTicks = props.useTicks;
                self.ignoreGlobalPause = props.ignoreGlobalPause;
                self.loop = props.loop;
                props.onChange && self.addEventListener("change", props.onChange, props.onChangeObj);
                if (props.override) {
                    Tween.removeTweens(target);
                }
            }

            self.pluginData = pluginData || {};
            self._curQueueProps = {};
            self._initQueueProps = {};
            self._steps = [];
            if (props && props.paused) {
                self.paused = true;
            }
            else {
                Tween._register(self, true);
            }
            if (props && props.position != null) {
                self.setPosition(props.position, Tween.NONE);
            }
        }

        /**
         * @private
         *
         * @param value
         * @param actionsMode
         * @returns
         */
        public setPosition(value: number, actionsMode: number = 1): boolean {
            if (value < 0) {
                value = 0;
            }

            //正常化位置
            let t: number = value;
            let end: boolean = false;
            let self = this;
            if (t >= self.duration) {
                if (self.loop) {
                    var newTime = t % self.duration;
                    if (t > 0 && newTime === 0) {
                        t = self.duration;
                    } else {
                        t = newTime;
                    }
                }
                else {
                    t = self.duration;
                    end = true;
                }
            }
            if (t == self._prevPos) {
                return end;
            }

            if (end) {
                self.setPaused(true);
            }

            let prevPos = self._prevPos;
            self.position = self._prevPos = t;
            self._prevPosition = value;

            if (self._target) {
                if (self._steps.length > 0) {
                    // 找到新的tween
                    let l = self._steps.length;
                    let stepIndex = -1;
                    for (let i = 0; i < l; i++) {
                        if (self._steps[i].type == "step") {
                            stepIndex = i;
                            if (self._steps[i].t <= t && self._steps[i].t + self._steps[i].d >= t) {
                                break;
                            }
                        }
                    }
                    for (let i = 0; i < l; i++) {
                        if (self._steps[i].type == "action") {
                            //执行actions
                            if (actionsMode != 0) {
                                if (self._useTicks) {
                                    self._runAction(self._steps[i], t, t);
                                }
                                else if (actionsMode == 1 && t < prevPos) {
                                    if (prevPos != self.duration) {
                                        self._runAction(self._steps[i], prevPos, self.duration);
                                    }
                                    self._runAction(self._steps[i], 0, t, true);
                                }
                                else {
                                    self._runAction(self._steps[i], prevPos, t);
                                }
                            }
                        }
                        else if (self._steps[i].type == "step") {
                            if (stepIndex == i) {
                                let step = self._steps[stepIndex];
                                self._updateTargetProps(step, Math.min((self._stepPosition = t - step.t) / step.d, 1));
                            }
                        }
                    }
                }
            }

            // self.dispatchEventWith("change");
            return end;
        }

        /**
         * @private
         *
         * @param startPos
         * @param endPos
         * @param includeStart
         */
        private _runAction(action: any, startPos: number, endPos: number, includeStart: boolean = false) {
            let sPos: number = startPos;
            let ePos: number = endPos;
            if (startPos > endPos) {
                //把所有的倒置
                sPos = endPos;
                ePos = startPos;
            }
            let pos = action.t;
            if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                action.f.apply(action.o, action.p);
            }
        }

        /**
         * @private
         *
         * @param step
         * @param ratio
         */
        private _updateTargetProps(step: any, ratio: number) {
            let p0, p1, v, v0, v1, arr, self = this;
            if (!step && ratio == 1) {
                self.passive = false;
                p0 = p1 = self._curQueueProps;
            } else {
                self.passive = !!step.v;
                //不更新props.
                if (self.passive) {
                    return;
                }
                //使用ease
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }

            for (let n in self._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = self._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                } else {
                    v = v0 + (v1 - v0) * ratio;
                }

                let ignore = false;
                if (arr = Tween._plugins[n]) {
                    for (let i = 0, l = arr.length; i < l; i++) {
                        let v2 = arr[i].tween(self, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    self._target[n] = v;
                }
            }

        }

        /**
         * Whether setting is paused
         * @param value {boolean} Whether to pause
         * @returns Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置是否暂停
         * @param value {boolean} 是否暂停
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public setPaused(value: boolean): Tween {
            let self = this;
            self.paused = value;
            Tween._register(self, !value);
            return self;
        }

        /**
         * @private
         *
         * @param props
         * @returns
         */
        private _cloneProps(props: any): any {
            let o = {};
            for (let n in props) {
                o[n] = props[n];
            }
            return o;
        }

        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _addStep(o): Tween {
            let self = this;
            if (o.d > 0) {
                o.type = "step";
                self._steps.push(o);
                o.t = self.duration;
                self.duration += o.d;
            }
            return self;
        }

        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _appendQueueProps(o): any {
            let arr, oldValue, i, l, injectProps, self = this;
            for (let n in o) {
                if (self._initQueueProps[n] === undefined) {
                    oldValue = self._target[n];
                    //设置plugins
                    if (arr = Tween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(self, n, oldValue);
                        }
                    }
                    self._initQueueProps[n] = self._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                } else {
                    oldValue = self._curQueueProps[n];
                }
            }

            for (let n in o) {
                oldValue = self._curQueueProps[n];
                if (arr = Tween._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(self, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                self._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                self._appendQueueProps(injectProps);
            }
            return self._curQueueProps;
        }

        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _addAction(o): Tween {
            let self = this;
            o.t = self.duration;
            o.type = "action";
            self._steps.push(o);
            return self;
        }

        /**
         * @private
         *
         * @param props
         * @param o
         */
        private _set(props: any, o): void {
            for (let n in props) {
                o[n] = props[n];
            }
        }

        /**
         * Wait the specified milliseconds before the execution of the next animation
         * @param duration {number} Waiting time, in milliseconds
         * @param passive {boolean} Whether properties are updated during the waiting time
         * @returns Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 等待指定毫秒后执行下一个动画
         * @param duration {number} 要等待的时间，以毫秒为单位
         * @param passive {boolean} 等待期间属性是否会更新
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public wait(duration: number, passive?: boolean): Tween {
            if (duration == null || duration <= 0) {
                return this;
            }
            let self = this;
            let o = self._cloneProps(self._curQueueProps);
            return self._addStep({ d: duration, p0: o, p1: o, v: passive });
        }

        /**
         * Modify the property of the specified object to a specified value
         * @param props {Object} Property set of an object
         * @param duration {number} Duration
         * @param ease {egret.Ease} Easing algorithm
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.Ease} 缓动算法
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */

        public to(props: any, duration?: number, ease: Function = undefined) {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            let self = this;
            self._addStep({ d: duration || 0, p0: self._cloneProps(self._curQueueProps), e: ease, p1: self._cloneProps(self._appendQueueProps(props)) });
            //加入一步set，防止游戏极其卡顿时候，to后面的call取到的属性值不对
            return self.set(props);
        }

        /**
         * Execute callback function
         * @param callback {Function} Callback method
         * @param thisObj {any} this action scope of the callback method
         * @param params {any[]} Parameter of the callback method
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @example
         * <pre>
         *  egret.Tween.get(display).call(function (a:number, b:string) {
         *      console.log("a: " + a); // the first parameter passed 233
         *      console.log("b: " + b); // the second parameter passed “hello”
         *  }, this, [233, "hello"]);
         * </pre>
         * @language en_US
         */
        /**
         * 执行回调函数
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {any[]} 回调方法参数
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @example
         * <pre>
         *  egret.Tween.get(display).call(function (a:number, b:string) {
         *      console.log("a: " + a); //对应传入的第一个参数 233
         *      console.log("b: " + b); //对应传入的第二个参数 “hello”
         *  }, this, [233, "hello"]);
         * </pre>
         * @language zh_CN
         */
        public call(callback: Function, thisObj: any = undefined, params: any[] = undefined): Tween {
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        }

        /**
         * Now modify the properties of the specified object to the specified value
         * @param props {Object} Property set of an object
         * @param target The object whose Tween to be resumed
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * 立即将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param target 要继续播放 Tween 的对象
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        public set(props: any, target = null): Tween {
            let self = this;
            //更新当前数据，保证缓动流畅性
            self._appendQueueProps(props);
            return self._addAction({ f: self._set, o: self, p: [props, target ? target : self._target] });
        }

        /**
         * Execute
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 执行
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public play(tween?: Tween): Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [false]);
        }

        /**
         * Pause
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public pause(tween?: Tween): Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [true]);
        }

        /**
         * @method egret.Tween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        public $tick(delta: number): void {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        }
    }
}