import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SwiperConfigInterface} from "angular2-swiper-wrapper";
import {PracteraApi} from "../../providers/practera-api";
import {CustomLoading} from "../../providers/custom-loading";
import {UserStorage} from "../../providers/user-storage";

/*
 Generated class for the LeaderBoard page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-leader-board',
    templateUrl: 'leader-board.html'
})
export class LeaderBoardPage {

    constructor(public navCtrl: NavController, private customLoading: CustomLoading, private practeraApi: PracteraApi, private userStorage: UserStorage) {}

    private config: SwiperConfigInterface = {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true
    };

    private achievements;
    private selectedIndex = 0;
    private points = 0;

    ionViewDidLoad() {
        this.loadAchievements();
    }

    loadAchievements(){
        this.customLoading.show("Please wait...");
        let achievementObservable = this.practeraApi.getAchievements();

        achievementObservable.subscribe(
            () =>{
                let userAchievementObservable = this.practeraApi.getUserAchievement();

                userAchievementObservable.subscribe(
                    ()=>{
                        this.points = this.userStorage.getAchievementPoints();
                        this.achievements = this.userStorage.getAchievements();
                        this.customLoading.dismiss();
                    },
                    err =>{
                        this.showError(err);
                    }
                )
            },
            err =>{
                this.showError(err);
            }
        );
    }

    onIndexChange(selectedIndex){
        console.log(selectedIndex);
        this.selectedIndex = selectedIndex % this.achievements.length;
    }

    showError(err){
        this.customLoading.dismiss();
        alert(err);
    }
}
