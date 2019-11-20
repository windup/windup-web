
import { sortPackages } from "../../../../src/app/executions/execution-detail.component";
import { Package } from "../../../../src/app/generated/windup-services";

describe('ExecutionDetailComponent', () => {
    it('should be able to add two whole numbers', () => {
        // given
        const packages: Package[] = [{
            id: 1,
            name: '',
            fullName: 'packageB',
            countClasses: 0,
            childs: [],
            level: 0,
            known: true
        }, {
            id: 2,
            name: '',
            fullName: 'packageA',
            countClasses: 0,
            childs: [],
            level: 0,
            known: true
        }, {
            id: 3,
            name: '',
            fullName: 'packageA.subpackage',
            countClasses: 0,
            childs: [],
            level: 0,
            known: true
        }];

        // when
        sortPackages(packages);

        // then
        expect(packages[0].fullName).toEqual('packageA');
        expect(packages[1].fullName).toEqual('packageA.subpackage');
        expect(packages[2].fullName).toEqual('packageB');
    });
});