import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {LoadingController} from "ionic-angular";

@Injectable()
export class CustomLoading {
    private loading;

    constructor(public http: Http, private loadingCtrl: LoadingController) {
    }


    public show(text?){
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `
                <div class="container">
                    <div class="square one"> </div>
                    <div class="square two"> </div>
                    <div class="square three"> </div>
                    <div class="text">` + (text == null ? "" : text) + `</div>	
                </div>
                `,
            cssClass: ".square .one .two .three .loading-wrapper"
        });

        this.loading.onDidDismiss(() => {
            console.log('Dismissed loading');
        });

        this.loading.present();
    }

    public dismiss(){
        this.loading.dismiss();
    }
}
