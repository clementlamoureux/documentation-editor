import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DocumentationEditorComponent }   from './app.component';
import {DocumentationEditorStorage} from "./storage.service";
import {WriterDirective} from "./writer.directive";
import {ReaderDirective} from "./reader.directive";

@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ DocumentationEditorComponent, WriterDirective, ReaderDirective],
    bootstrap:    [ DocumentationEditorComponent ],
    providers:    [ DocumentationEditorStorage ]
})
export class DocumentationEditor {

}
