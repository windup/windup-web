import {async} from '@angular/core/testing';

import {GraphJSONToModelService} from '../../src/app/services/graph/graph-json-to-model.service';
//import {DiscriminatorMapping, getParentClass} from '../../app/services/graph/DiscriminatorMapping';
import {DiscriminatorMappingTestData} from './models/discriminator-mapping-test-data';
import {TestGraphData} from './models/test-graph-data';

import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';

import {HttpClient} from "@angular/common/http";
import {FileModel} from "../../src/app/generated/tsModels/FileModel";

describe('Generated TS Files', () => {

    it ('filemodels - fromJSON()', () => {
        let http = <HttpClient>{
            get(url: string) {
                return Observable.create(function(observer) {
                    let value: any = [ TestGraphData.TEST_FILE_MODELS[0] ];
                    observer.next(value);
                    observer.complete();
                });
            }
        };

        let modelObject = new GraphJSONToModelService(http, DiscriminatorMappingTestData).fromJSON(TestGraphData.TEST_FILE_MODELS[1]);
        expect(modelObject).toBeDefined();
        expect(modelObject.vertexId).toEqual(16640);
        let model = <FileModel> modelObject;

        expect(model.fileName).toEqual("NonXAResource.class");
        model.parentFileInternal.toPromise()
            .then((parentFile:FileModel) => {
                expect(parentFile.fileName).toEqual("nonxa");
            });
    });

});
