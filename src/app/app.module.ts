import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {EventListPage} from "../pages/event-list/event-list";
import {UserStorage} from "../providers/user-storage";
import {SheetsuApi} from "../providers/sheetsu-api";
import {EventParentComponent} from "../components/event-parent/event-parent";
import {EventChildComponent} from "../components/event-child/event-child";
import {FeedbackPage} from "../pages/feedback/feedback";
import {ResultPage} from "../pages/result/result";
import {CustomIconsModule} from "ionic2-custom-icons";
import {IconButtonComponent} from "../components/icon-button/icon-button";
import {MeetballButtonComponent} from "../components/meetball-button/meetball-button";
import {ChartsModule} from "ng2-charts";
import {MeetballAvatarComponent} from "../components/meetball-avatar/meetball-avatar";
import {DataProcessor} from "../providers/data-processor";
import {CustomLoading} from "../providers/custom-loading";
import {LeaderBoardPage} from "../pages/leader-board/leader-board";
import { SwiperModule } from 'angular2-swiper-wrapper';
import { SwiperConfigInterface } from 'angular2-swiper-wrapper';
import {PracteraApi} from "../providers/practera-api";

const SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto',
    keyboardControl: true
};

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        EventListPage,
        FeedbackPage,
        ResultPage,
        LeaderBoardPage,
        EventParentComponent,
        EventChildComponent,
        IconButtonComponent,
        MeetballButtonComponent,
        MeetballAvatarComponent
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        CustomIconsModule,
        ChartsModule,
        SwiperModule.forRoot(SWIPER_CONFIG)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        EventListPage,
        FeedbackPage,
        ResultPage,
        LeaderBoardPage,
        EventParentComponent,
        EventChildComponent,
        IconButtonComponent,
        MeetballButtonComponent,
        MeetballAvatarComponent
    ],
    providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, UserStorage, SheetsuApi, DataProcessor, CustomLoading, PracteraApi]
})
export class AppModule {}
