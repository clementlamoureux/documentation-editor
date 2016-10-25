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
var DestinationEditorComponent = (function () {
    function DestinationEditorComponent() {
        this.title = 'test';
        this.data = { editing: '', editMode: false };
        var self = this;
        this.askListFiles();
        this.setListener();
        setInterval(function () {
            console.log('test');
        }, 1000);
    }
    DestinationEditorComponent.prototype.askOpenFile = function (fileName) {
        this.send('read-file', fileName);
    };
    ;
    DestinationEditorComponent.prototype.message = function (sender, message) {
        var self = this;
        switch (message.type) {
            case 'list-files':
                setTimeout(function () {
                    self.mdFiles = message.data;
                    self.askOpenFile('README.md');
                }, 0);
                break;
            case 'upload-file':
                // $broadcast('upload-file', message);
                break;
            case 'read-file':
                setTimeout(function () {
                    console.log(message);
                    self.currentFile = message.metadata.name;
                    self.currentPath = message.metadata.name.split('/');
                    self.data.editing = message.data;
                    self.data.editMode = false;
                }, 0);
                break;
        }
    };
    ;
    DestinationEditorComponent.prototype.cancelEditing = function () {
        this.send('read-file', this.currentFile);
    };
    ;
    DestinationEditorComponent.prototype.askListFiles = function () {
        this.send('list-files');
    };
    ;
    DestinationEditorComponent.prototype.saveFile = function () {
        this.send('save-file', this.currentFile, this.data.editing);
    };
    ;
    DestinationEditorComponent.prototype.setListener = function () {
        var self = this;
        electron_1.ipcRenderer.on('message', function (event, message) {
            self.message(event, message);
        });
    };
    DestinationEditorComponent.prototype.send = function (type, data, data2) {
        electron_1.ipcRenderer.send(type, data, data2);
    };
    ;
    DestinationEditorComponent = __decorate([
        core_1.Component({
            selector: 'documentation-editor',
            templateUrl: '../views/root.html'
        }), 
        __metadata('design:paramtypes', [])
    ], DestinationEditorComponent);
    return DestinationEditorComponent;
}());
exports.DestinationEditorComponent = DestinationEditorComponent;
//# sourceMappingURL=app.component.js.map