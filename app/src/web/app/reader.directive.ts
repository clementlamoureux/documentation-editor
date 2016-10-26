import { Directive , ElementRef} from '@angular/core';
var markdownit = require('markdown-it');
var markdownitEmoji = require('markdown-it-emoji');
import {DocumentationEditorStorage} from "./storage.service";

@Directive({
    selector: '[reader]',
})
export class ReaderDirective {
    storage;
    md;


    constructor(element: ElementRef, storage: DocumentationEditorStorage){
        var md = markdownit();
        md.use(markdownitEmoji);
        storage._onFileContentChange(function(fileContent){
            element.nativeElement.innerHTML = md.render(fileContent);
        });
    }



}