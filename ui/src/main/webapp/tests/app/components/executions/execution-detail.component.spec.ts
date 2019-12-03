
import { sortPackagesByFullName } from "../../../../src/app/executions/execution-detail.component";
import { sortRulesPathsByPriority } from "../../../../src/app/executions/execution-detail.component";
import { sortLabelsPathsByPriority } from "../../../../src/app/executions/execution-detail.component";
import { Package, RulesPath, LabelsPath } from "../../../../src/app/generated/windup-services";

describe('ExecutionDetailComponent', () => {
    it('should order packages by fullName', () => {
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
        sortPackagesByFullName(packages);

        // then
        expect(packages[0].fullName).toEqual('packageA');
        expect(packages[1].fullName).toEqual('packageA.subpackage');
        expect(packages[2].fullName).toEqual('packageB');
    });

    it('should order rulesPath by rulesPathType, scopeType, and registrationType', () => {
        // given
        const rulesPath: RulesPath[] = [{
            id: 1,
            version: null,
            path: null,
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            rulesPathType: 'SYSTEM_PROVIDED',
            registrationType: 'PATH',
            scopeType: 'GLOBAL'
        },
        {
            id: 2,
            version: null,
            path: null,
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            rulesPathType: 'SYSTEM_PROVIDED',
            registrationType: 'UPLOADED',
            scopeType: 'GLOBAL' // this value shoudl not affect the sorting since every SYSTEM_PROVIDED should be GLOBAL
        }, {
            id: 3,
            version: null,
            path: null,
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            rulesPathType: 'USER_PROVIDED',
            registrationType: 'PATH',
            scopeType: 'GLOBAL'
        }, {
            id: 4,
            version: null,
            path: null,
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            rulesPathType: 'USER_PROVIDED',
            registrationType: 'PATH',
            scopeType: 'PROJECT'
        }, {
            id: 5,
            version: null,
            path: 'packageB',
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            rulesPathType: 'USER_PROVIDED',
            registrationType: 'UPLOADED',
            scopeType: 'PROJECT'
        }, {
            id: 6,
            version: null,
            path: 'packageA',
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            rulesPathType: 'USER_PROVIDED',
            registrationType: 'UPLOADED',
            scopeType: 'PROJECT'
        }];

        // when
        sortRulesPathsByPriority(rulesPath);

        // then
        expect(rulesPath[0].id).toEqual(6);
        expect(rulesPath[1].id).toEqual(5);
        expect(rulesPath[2].id).toEqual(4);
        expect(rulesPath[3].id).toEqual(3);
        expect(rulesPath[4].id).toEqual(2);
        expect(rulesPath[5].id).toEqual(1);
    });

    it('should order labelsPath by labelsPathType, scopeType, and registrationType', () => {
        // given
        const labelsPath: LabelsPath[] = [{
            id: 1,
            version: null,
            path: null,
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            labelsPathType: 'SYSTEM_PROVIDED',
            registrationType: 'PATH',
            scopeType: 'GLOBAL'
        },
        {
            id: 2,
            version: null,
            path: null,
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            labelsPathType: 'SYSTEM_PROVIDED',
            registrationType: 'UPLOADED',
            scopeType: 'GLOBAL' // this value shoudl not affect the sorting since every SYSTEM_PROVIDED should be GLOBAL
        }, {
            id: 3,
            version: null,
            path: null,
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            labelsPathType: 'USER_PROVIDED',
            registrationType: 'PATH',
            scopeType: 'GLOBAL'
        }, {
            id: 4,
            version: null,
            path: null,
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            labelsPathType: 'USER_PROVIDED',
            registrationType: 'PATH',
            scopeType: 'PROJECT'
        }, {
            id: 5,
            version: null,
            path: 'packageB',
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            labelsPathType: 'USER_PROVIDED',
            registrationType: 'UPLOADED',
            scopeType: 'PROJECT'
        }, {
            id: 6,
            version: null,
            path: 'packageA',
            scanRecursively: null,
            shortPath: null,
            loadError: null,
            labelsPathType: 'USER_PROVIDED',
            registrationType: 'UPLOADED',
            scopeType: 'PROJECT'
        }];

        // when
        sortLabelsPathsByPriority(labelsPath);

        // then
        expect(labelsPath[0].id).toEqual(6);
        expect(labelsPath[1].id).toEqual(5);
        expect(labelsPath[2].id).toEqual(4);
        expect(labelsPath[3].id).toEqual(3);
        expect(labelsPath[4].id).toEqual(2);
        expect(labelsPath[5].id).toEqual(1);
    });
});
