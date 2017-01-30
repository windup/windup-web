import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChosenDropComponent} from "./chosen-drop.component";
import {ChosenSingleComponent} from "./chosen-single.component";
import {ChosenMultipleComponent} from "./chosen-multiple.component";


/**
 * Chosen module based on https://github.com/zouabimourad/ng2-chosen
 * CSS styles are based on jQuery Chosen https://harvesthq.github.io/chosen/ v 1.6.2
 */
@NgModule({
    declarations: [
        ChosenDropComponent,
        ChosenSingleComponent,
        ChosenMultipleComponent
    ],
    exports: [
        ChosenDropComponent,
        ChosenSingleComponent,
        ChosenMultipleComponent
    ],
    imports: [
        BrowserModule,
        FormsModule
    ],
    providers: []
})
export class ChosenModule {

}

