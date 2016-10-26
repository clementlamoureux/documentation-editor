import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {DocumentationEditor} from "./app.module";
const platform = platformBrowserDynamic();
platform.bootstrapModule(DocumentationEditor);