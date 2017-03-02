import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SwiperConfigInterface} from "angular2-swiper-wrapper";
import {SheetsuApi} from "../../providers/sheetsu-api";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private sheetsuApi: SheetsuApi) {}

    private config: SwiperConfigInterface = {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true
    };

    private achievements;
    private rankings;
    private selectedIndex = 0;

    ionViewDidLoad() {
        this.loadAchievements();
        this.loadRankings();
    }

    loadAchievements(){
        let observable = this.sheetsuApi.getAchievements(null);
        observable.subscribe(
            data =>{
                this.achievements = data;
            },
            error =>{

            }
        )
    }

    loadRankings(){
        let observable = this.sheetsuApi.getRankings();
        observable.subscribe(
            data =>{
                this.rankings = data;
            },
            error =>{

            }
        )
    }

    onIndexChange(selectedIndex){
        console.log(selectedIndex);
        this.selectedIndex = selectedIndex % this.achievements.length;
    }
}
