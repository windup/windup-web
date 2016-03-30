import {Control} from "angular2/common";
import {FileService} from "../services/file.service";

export class FileExistsValidator {

    static fileExists(fileService:FileService) {
        return function (c:Control):{[key: string]: any} {
            return new Promise(resolve => {
                fileService.pathExists(c.value).subscribe(result => {
                    if (result)
                        resolve(null);
                    else
                        resolve({fileExists: false});
                });
            });
        };
    };
}