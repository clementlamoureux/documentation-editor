"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var SimpleMDE = require('simplemde');
var storage_service_1 = require("./storage.service");
var WriterDirective = (function () {
    function WriterDirective(element, storage) {
        var self = this;
        this.storage = storage;
        this.mde = new SimpleMDE({ element: element.nativeElement,
            toolbar: ["bold", "italic", "strikethrough", "heading", "heading-smaller", "heading-bigger", "heading-1", "heading-2", "heading-3", "code", "quote", "unordered-list", "ordered-list", "clean-block", "link", "image", "table", "horizontal-rule"]
        });
        this.mde.value(storage.fileContent);
        this.mde.codemirror.on("change", function () {
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
    WriterDirective = __decorate([
        core_1.Directive({
            selector: '[writer]',
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, storage_service_1.DocumentationEditorStorage])
    ], WriterDirective);
    return WriterDirective;
}());
exports.WriterDirective = WriterDirective;
//# sourceMappingURL=writer.directive.js.map