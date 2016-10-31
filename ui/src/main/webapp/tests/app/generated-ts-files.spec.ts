import {async} from '@angular/core/testing';

import {GraphJSONToModelService, RelationInfo} from '../../app/services/graph/graph-json-to-model.service';
import {DiscriminatorMapping, getParentClass} from '../../app/services/graph/DiscriminatorMapping';
import {TestGraphData} from './models/test-graph-data';

import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';

import {Http} from "@angular/http";
import {FileModel} from "../../app/tsModels/FileModel";

describe('Generated TS Files', () => {


    it ('filemodels - fromJSON() - basic properties', () => {
        let modelObject = new GraphJSONToModelService().fromJSON(TestGraphData.TEST_FILE_MODELS[0], null);
        expect(modelObject).toBeDefined();
        expect(modelObject.vertexId).toEqual(456);
        let model = <FileModel> modelObject;
        console.log("Returned model: " + model);

        expect(model.fileName).toEqual("nonxa");
    });

});
