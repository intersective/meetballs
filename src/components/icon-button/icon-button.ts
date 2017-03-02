import {Component, Input, Output, EventEmitter} from '@angular/core';

/*
 Generated class for the IconButton component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'icon-button',
    templateUrl: 'icon-button.html'
})

export class IconButtonComponent {
    private yesColor = "green";
    private noColor = "gray";
    private _answer;

    @Input()
    set answer(answer: boolean) {
        this._answer = answer;
        this.updateUI(answer);
        this.answerChange.emit(this._answer);
    }

    get answer(){
        return this._answer;
    }

    @Output() answerChange= new EventEmitter();

    constructor() {

    }

    onYes(){
        this.answer = true;
    }

    onNo(){
        this.answer = false;
    }

    updateUI(answer){
        this.yesColor = answer ? "green" : "gray";
        this.noColor = answer ? "gray" : "green";
    }
}


