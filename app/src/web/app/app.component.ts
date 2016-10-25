import { Component } from '@angular/core';
import {ipcRenderer} from '@node/electron';


@Component({
    selector: 'documentation-editor',
    templateUrl: '../views/root.html'
})
export class DestinationEditorComponent {
    title = 'test';
    currentFile;
    currentPath;
    mdFiles;
    data = { editing: '', editMode: false};

    constructor(){
        var self = this;
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
                    self.mdFiles = message.data;
                    self.askOpenFile('README.md');
                }, 0);
                break;
            case 'upload-file':
                // $broadcast('upload-file', message);
                break;
            case 'read-file':
                setTimeout(function(){
                    console.log(message);
                    self.currentFile = message.metadata.name;
                    self.currentPath = message.metadata.name.split('/');
                    self.data.editing = message.data;
                    self.data.editMode = false;
                }, 0);
                break;
        }
    };

    cancelEditing(){
        this.send('read-file', this.currentFile);
    };
    askListFiles(){
        this.send('list-files');
    };
    saveFile(){
        this.send('save-file', this.currentFile, this.data.editing);
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