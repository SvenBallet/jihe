module FL {

    export class MallCmd extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }

        public execute(notification:puremvc.INotification):void {
            let data:any = notification.getBody();
            switch(notification.getName()) {
                case MallModule.MALL_INTO_MALL:{
                    this.intoMall(data);
                    break;
                }
            }
        }


        /**
         * 进入购物中心
         */
        private intoMall(msg:RefreshItemBaseACK):void {
            //基础界面
            let vMallBaseView:MallBaseView = new MallBaseView(msg);

            //添加界面
            MvcUtil.addView(vMallBaseView);

        }
    }

}