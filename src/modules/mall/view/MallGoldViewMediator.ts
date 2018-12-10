module FL {

    export class MallGoldViewMediator extends puremvc.Mediator implements puremvc.IMediator {

        public static readonly NAME:string = "MallGoldViewMediator";

        constructor (pView:MallGoldView) {
            super(MallGoldViewMediator.NAME, pView);
            let self = this;
        }

    }
}