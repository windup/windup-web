import {Observable} from "rxjs";
import {fetch} from "../../../src/app/components/reports/dependencies/dependencies-report.component";


describe("fetch function", () => {
    beforeEach(() => {

    });

    it('Should fetch properly.', () => {

        let HI = "Hi";
        let obs = Observable.of(HI);
        let result;

        fetch(obs, (res) => { result = res; })
        expect(result).toEqual(HI);
        
        fetch(obs, (res, obs2) => { result = obs2.result; })
        expect(result).toEqual(HI);
    });
});
