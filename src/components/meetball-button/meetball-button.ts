import {Component, EventEmitter, Output, Input} from '@angular/core';

/*
 Generated class for the MeetballButton component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'meetball-button',
    templateUrl: 'meetball-button.html'
})
export class MeetballButtonComponent {
    private colors = ["light","light","light","light","light"];
    private _selectedIndex = 0;

    @Output() selectedIndexChange = new EventEmitter();

    @Input()
    set selectedIndex(value){
        this._selectedIndex = value;
        this.updateUI(value);
        this.selectedIndexChange.emit(this._selectedIndex);
    }
    get selectedIndex(){
        return this._selectedIndex;
    }

    constructor() {
    }

    onClick(index){
        this.selectedIndex = index;
        this.updateUI(index);
    }

    updateUI(index){
        for(let i = 0; i < 5; i++){
                this.colors[i] = "light";
        }

        for(let i = 0; i < 5; i++){
            if(i == index){
                this.colors[i]="danger";
            }
        }
    }
}
