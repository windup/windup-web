import {RegisteredApplicationModel} from "../../app/models/registered.application.model";

describe('registered application model tests', () => {
    it ('has input path', () => {
        let model = new RegisteredApplicationModel();
        model.inputPath = "testpath";
        expect(model.inputPath).toEqual("testpath");
    });
});
