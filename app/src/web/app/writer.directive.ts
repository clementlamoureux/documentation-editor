import { Directive , ElementRef} from '@angular/core';
var SimpleMDE = require('simplemde');
import {DocumentationEditorStorage} from "./storage.service";

@Directive({
    selector: '[writer]',
})
export class WriterDirective {
    storage;
    mde;

    constructor(element: ElementRef, storage: DocumentationEditorStorage){
        var self = this;
        this.storage = storage;
        this.mde = new SimpleMDE({ element: element.nativeElement ,
            toolbar: ["bold","italic","strikethrough","heading","heading-smaller","heading-bigger","heading-1","heading-2","heading-3","code","quote","unordered-list","ordered-list","clean-block","link","image","table","horizontal-rule"]
        });
        this.mde.value(storage.fileContent);
        this.mde.codemirror.on("change", function(){
            storage.setFileContent(self.mde.value());
        });
        // self.mde.codemirror.on("paste", function(a, b){
        //     var cursor = self.mde.codemirror.getCursor();
        //     if(b.clipboardData.getData('text').indexOf('/') > -1){
        //         b.preventDefault();
        //         window.send('upload-file', b.clipboardData.getData('text'));
        //         var eventUpload = $rootScope.$on('upload-file', function(event, data){
        //             self.mde.codemirror.setCursor(cursor);
        //             var html = '![alt text](' + JSON.parse(data.data).image + ' "Image")';
        //             self.mde.codemirror.replaceRange(html, cursor);
        //             eventUpload();
        //         });
        //     }
        // });
    }



}