import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DestinationEditorComponent }   from './app.component';
import {RouterModule} from "@angular/router";
@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ DestinationEditorComponent ],
    bootstrap:    [ DestinationEditorComponent ]
})
export class DestinationEditor {

}
