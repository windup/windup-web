import {HttpModule} from '@angular/http';

import {TestBed, async, inject} from '@angular/core/testing';

import 'rxjs/Rx';

import {Constants} from '../../app/constants';

import {FileService} from "../../app/services/file.service";


describe("File Service", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpModule],
                providers: [Constants, FileService]
            }
        );
        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('file exists call', async(inject([FileService], (service:FileService) => {
        return service.pathExists("src/main/java").toPromise()
            .then(result => {
                expect(result).toEqual(true);
            }, error => {
                expect(false).toBeTruthy("Service call failed due to: " + error);
            });
    })));
});
