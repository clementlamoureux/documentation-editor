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
var electron_1 = require('@node/electron');
var storage_service_1 = require("./storage.service");
var DocumentationEditorComponent = (function () {
    function DocumentationEditorComponent(storage) {
        this.title = 'test';
        var self = this;
        this.storage = storage;
        storage.setCurrentFile(storage.currentFile);
        storage.setCurrentPath(storage.currentPath);
        storage.setMdFiles(storage.mdFiles);
        this.askListFiles();
        this.setListener();
        setInterval(function () {
            console.log('test');
        }, 1000);
    }
    DocumentationEditorComponent.prototype.askOpenFile = function (fileName) {
        this.send('read-file', fileName);
    };
    ;
    DocumentationEditorComponent.prototype.message = function (sender, message) {
        var self = this;
        switch (message.type) {
            case 'list-files':
                setTimeout(function () {
                    self.storage.setMdFiles(message.data);
                    self.askOpenFile('README.md');
                }, 0);
                break;
            case 'upload-file':
                // $broadcast('upload-file', message);
                break;
            case 'read-file':
                setTimeout(function () {
                    console.log(message);
                    self.storage.setCurrentFile(message.metadata.name);
                    self.storage.setCurrentPath(message.metadata.name.split('/'));
                    self.storage.setFileContent(message.data);
                    self.storage.setEditMode(false);
                }, 0);
                break;
        }
    };
    ;
    DocumentationEditorComponent.prototype.cancelEditing = function () {
        this.send('read-file', this.storage.currentFile);
    };
    ;
    DocumentationEditorComponent.prototype.askListFiles = function () {
        this.send('list-files');
    };
    ;
    DocumentationEditorComponent.prototype.saveFile = function () {
        console.log(this.storage.data.editing);
        // this.send('save-file', this.storage.currentFile, this.storage.data.editing);
    };
    ;
    DocumentationEditorComponent.prototype.setListener = function () {
        var self = this;
        electron_1.ipcRenderer.on('message', function (event, message) {
            self.message(event, message);
        });
    };
    DocumentationEditorComponent.prototype.send = function (type, data, data2) {
        electron_1.ipcRenderer.send(type, data, data2);
    };
    ;
    DocumentationEditorComponent = __decorate([
        core_1.Component({
            selector: 'documentation-editor',
            templateUrl: '../views/root.html'
        }), 
        __metadata('design:paramtypes', [storage_service_1.DocumentationEditorStorage])
    ], DocumentationEditorComponent);
    return DocumentationEditorComponent;
}());
exports.DocumentationEditorComponent = DocumentationEditorComponent;
//# sourceMappingURL=app.component.js.map