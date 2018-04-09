import {PackageRegistryService} from "../../../src/app/analysis-context/package-registry.service";
import {Package} from "../../../src/app/generated/windup-services";

describe("PackageRegistryService", () => {
    let instance: PackageRegistryService;

    beforeEach(() => {
        instance = new PackageRegistryService();
    });

    let id = 0;

    let createPackage = (name: string, fullName: string, level: number = 0): Package => {
        return {
            id: ++id,
            name: name,
            fullName: fullName,
            countClasses: 1,
            children: [],
            level: level
        };
    };

    describe('mergePackageMetadata', () => {
        it('should merge the same roots into one root', () => {
            let firstPackage: Package = createPackage('root', 'org.jboss.root');
            let secondPackage: Package = createPackage('root', 'org.jboss.root');

            let packages = [ firstPackage, secondPackage ];

            let result = instance.mergePackageRoots(packages);

            expect(result.length).toBe(1);
            expect(result[0].name).toBe('root');
            expect(result[0].fullName).toBe('org.jboss.root');
            expect(result[0].level).toBe(0);
            expect(result[0].children.length).toBe(0);
            expect(result[0].countClasses).toBe(2);
        });

        it('should not merge different roots', () => {
            let firstPackage: Package = createPackage('root', 'org.jboss.root');
            let secondPackage: Package = createPackage('anotherRoot', 'org.jboss.anotherRoot');

            let packages = [ firstPackage, secondPackage ];

            let result = instance.mergePackageRoots(packages);

            expect(result.length).toBe(2);
            expect(result).toContain(firstPackage);
            expect(result).toContain(secondPackage);
        });

        it('should merge same root children', () => {
            let commonChild = createPackage('child', 'org.jboss.root.child', 1);

            let firstPackage: Package = createPackage('root', 'org.jboss.root');
            let secondPackage: Package = createPackage('root', 'org.jboss.root');

            let packages = [ firstPackage, secondPackage ];
            packages.forEach(aPackage => aPackage.children = [commonChild]);

            let result = instance.mergePackageRoots(packages);

            expect(result.length).toBe(1);
            expect(result[0].name).toBe('root');
            expect(result[0].fullName).toBe('org.jboss.root');
            expect(result[0].level).toBe(0);
            expect(result[0].countClasses).toBe(2);

            expect(result[0].children.length).toBe(1);

            let child = result[0].children[0];
            expect(child.name).toBe(commonChild.name);
            expect(child.fullName).toBe(commonChild.fullName);
            expect(child.level).toBe(commonChild.level);
            expect(child.children.length).toBe(0);
            expect(child.countClasses).toBe(commonChild.countClasses * 2);
        });

        it('should add different children', () => {
            let firstPackage: Package = createPackage('root', 'org.jboss.root');
            firstPackage.children = [
                createPackage('firstOneChild', 'org.jboss.root.firstOneChild', 1)
            ];

            let secondPackage: Package = createPackage('root', 'org.jboss.root');
            secondPackage.children = [
                createPackage('secondChild', 'org.jboss.root.secondChild', 1)
            ];

            let packages = [ firstPackage, secondPackage ];

            let result = instance.mergePackageRoots(packages);

            expect(result.length).toBe(1);
            expect(result[0].name).toBe('root');
            expect(result[0].fullName).toBe('org.jboss.root');
            expect(result[0].level).toBe(0);
            expect(result[0].countClasses).toBe(2);

            expect(result[0].children.length).toBe(2);
            expect(result[0].children).toContain(firstPackage.children[0]);
            expect(result[0].children).toContain(secondPackage.children[0]);
        });
    });
});
