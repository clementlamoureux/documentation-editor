import { Component , Inject} from '@angular/core';
import {ipcRenderer} from '@node/electron';
import {DocumentationEditorStorage} from "./storage.service";

@Component({
    selector: 'documentation-editor',
    templateUrl: '../views/root.html'
})
export class DocumentationEditorComponent {
    public title = 'test';
    storage;

    constructor(storage: DocumentationEditorStorage){
        var self = this;
        this.storage = storage;
        storage.setCurrentFile(storage.currentFile);
        storage.setCurrentPath(storage.currentPath);
        storage.setMdFiles(storage.mdFiles);
        this.askListFiles();
        this.setListener();
        setInterval(function(){
            console.log('test');
        }, 1000);
    }

    askOpenFile(fileName){
        this.send('read-file', fileName);
    };
    message(sender, message){
        var self = this;
        switch(message.type){
            case 'list-files':
                setTimeout(function(){
                    self.storage.setMdFiles(message.data);
                    self.askOpenFile('README.md');
                }, 0);
                break;
            case 'upload-file':
                // $broadcast('upload-file', message);
                break;
            case 'read-file':
                setTimeout(function(){
                    console.log(message);
                    self.storage.setCurrentFile(message.metadata.name);
                    self.storage.setCurrentPath(message.metadata.name.split('/'));
                    self.storage.setFileContent(message.data);
                    self.storage.setEditMode(false);
                }, 0);
                break;
        }
    };

    cancelEditing(){
        this.send('read-file', this.storage.currentFile);
    };
    askListFiles(){
        this.send('list-files');
    };
    saveFile(){
        console.log(this.storage.data.editing);
        // this.send('save-file', this.storage.currentFile, this.storage.data.editing);
    };

    setListener() {
        var self = this;
        ipcRenderer.on('message', function(event, message){
            self.message(event, message);
        });
    }

    send(type?, data?, data2?) {
        ipcRenderer.send(type, data, data2);
    };
}