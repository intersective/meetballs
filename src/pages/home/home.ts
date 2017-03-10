import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EventListPage} from "../event-list/event-list";
import {UserStorage} from "../../providers/user-storage";
import {CustomLoading} from "../../providers/custom-loading";
import {PracteraApi} from "../../providers/practera-api";
import {FormBuilder, Validators} from "@angular/forms";
import {EmailValidator} from "../../utility/EmailValidator";

declare var _paq: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    private email;
    private password;
    private loginForm;
    private emailBorderColor;
    private passwordBorderColor;
    private errorMessage;

    constructor(public navCtrl: NavController, private prateraApi: PracteraApi, private userStorage: UserStorage,
                private customLoading: CustomLoading, public formBuilder: FormBuilder) {
        this.loginForm = formBuilder.group({
            email: ['', [EmailValidator.isValid, Validators.required]],
            password: ['', [Validators.required, Validators.minLength(7)]]
        });
    }

    ionViewDidLoad(){
        let currentUser = this.userStorage.getPracteraUser();
        if(currentUser != null){
            this.navCtrl.push(EventListPage);
        }
    }

    ionViewWillEnter(){
        this.errorMessage = null;

        this.emailBorderColor = "grey";
        this.passwordBorderColor = "grey";
    }

    doPracteraLogin(){
        if(!this.loginForm.valid){
            return;
        }

        this.customLoading.show("Please wait...");
        let observer = this.prateraApi.logIn(this.email, this.password);

        observer.subscribe(
            () =>{
                let infoObserver = this.prateraApi.getUserInfo();
                infoObserver.subscribe(()=>{
                    this.customLoading.dismiss();
                    this.navCtrl.push(EventListPage);
                }, err=>{
                    this.showError(err);
                });
            },
            err =>{
                this.showError(err);
            }
        );
    }

    showError(err){
        this.customLoading.dismiss();
        this.errorMessage = err._body;
        this.emailBorderColor = "#cc0013";
        this.passwordBorderColor = "#cc0013";
    }

    onEmailUpdate(){
        this.emailBorderColor = this.loginForm.controls.email.valid ? "#00cc13" : "#cc0013";
    }

    onPasswordUpdate(){
        this.passwordBorderColor = this.loginForm.controls.password.valid ? "#00cc13" : "#cc0013";
    }

    onFocus(){
        this.errorMessage = null;
    }
}

