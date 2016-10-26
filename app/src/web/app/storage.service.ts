import { Injectable } from '@angular/core';

@Injectable()
export class DocumentationEditorStorage {
    currentFile;
    currentPath;
    mdFiles;
    editMode: boolean;
    fileContent: string;
    _fileContentChangeWatchers = [];

    setCurrentFile(currentFile){
        this.currentFile = currentFile;
    }
    setCurrentPath(currentPath){
        this.currentPath = currentPath;
    }
    setMdFiles(mdFiles){
        this.mdFiles = mdFiles;
    }
    setEditMode(editMode: boolean){
        this.editMode = editMode;
    }
    setFileContent(fileContent: string){
        this.fileContent = fileContent;
        this._fileContentChangeWatchers.forEach(function(method){
            method(fileContent);
        });
    }
    _onFileContentChange(method: any){
        this._fileContentChangeWatchers.push(method);
    }
}
