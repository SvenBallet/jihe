module FL {
    export class ClubBtnListItemView extends eui.ItemRenderer {
        public label: eui.Label;
        public icon: eui.Image;

        public static readonly CHOSEN: string = "btn_left_chosen_png";
        public static readonly UNCHOSEN: string = "btn_left_unchosen_png";

        public data: any;
        public constructor() {
            super();
            this.skinName = "skins.ClubBtnListItemViewSkin";
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

        public initView() {
            if (!this.data) return;
            if (this.selected) this.onChosen();
            else this.onUnchosen();
        }

        public onChosen() {
            this.icon.source = ClubBtnListItemView.CHOSEN;
            this.label.text = this.data;
            this.label.textColor = 0xffffff;
        }

        public onUnchosen() {
            this.icon.source = ClubBtnListItemView.UNCHOSEN;
            this.label.text = this.data;
            this.label.textColor = 0x9b6e0f;
        }

        protected dataChanged() {
            this.initView();
        }
    }
}