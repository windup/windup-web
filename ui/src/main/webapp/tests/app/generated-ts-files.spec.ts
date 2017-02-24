import {async} from '@angular/core/testing';

import {GraphJSONToModelService} from '../../src/app/services/graph/graph-json-to-model.service';
//import {DiscriminatorMapping, getParentClass} from '../../app/services/graph/DiscriminatorMapping';
import {DiscriminatorMappingTestData} from './models/discriminator-mapping-test-data';
import {TestGraphData} from './models/test-graph-data';

import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';

import {Http} from "@angular/http";
import {FileModel} from "../../src/app/generated/tsModels/FileModel";

describe('Generated TS Files', () => {

    it ('filemodels - fromJSON()', () => {
        let http = <Http>{
            get(url:string) {
                console.log("Should call get to: " + url + " now");
                return Observable.create(function(observer) {
                    let value: any = [ TestGraphData.TEST_FILE_MODELS[0] ];
                    observer.next(value);
                    observer.complete();
                });
            }
        };

        let modelObject = new GraphJSONToModelService(http, DiscriminatorMappingTestData).fromJSON(TestGraphData.TEST_FILE_MODELS[1], http);
        expect(modelObject).toBeDefined();
        expect(modelObject.vertexId).toEqual(16640);
        let model = <FileModel> modelObject;
        console.log("Returned model: " + model);

        expect(model.fileName).toEqual("NonXAResource.class");
        model.parentFile.toPromise()
            .then((parentFile:FileModel) => {
                expect(parentFile.fileName).toEqual("nonxa");
            });
    });

});
