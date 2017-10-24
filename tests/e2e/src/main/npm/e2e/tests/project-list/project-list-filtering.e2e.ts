import {ProjectPage} from "../../pages/project.po";
import {CreateProjectWorkflow} from "../../workflows/create-project.wf";
import {browser} from "protractor";
import {CleanupWorkflow} from "../../workflows/cleanup.wf";

describe('Project List Filtering', () => {
    const projectPage = new ProjectPage();

    let newlyCreatedProjects = [];

    beforeAll(() => {
        const date = new Date().getTime().toString();

        newlyCreatedProjects = [
            'This has some matching text in title '  + date,
            'This does not ' + date
        ];

        projectPage.navigateTo();

        const wf = new CreateProjectWorkflow();
        wf.createProject(newlyCreatedProjects[0]);
        wf.createProject(newlyCreatedProjects[1], 'But it has some matching text in description');

        projectPage.navigateTo();
    });

    describe('', () => {

    });

    describe('with matching input', () => {
        let searchText;

        beforeAll(() => {
            searchText = 'some matching text';
            projectPage.search(searchText)
                .then(() => browser.waitForAngular());
        });

        it('should find relevant projects', () => {
            projectPage.getProjectList().then(projects => {
                expect(projects.length).toBe(2);
            });
        });

        it('should filter projects matching title', () => {
            projectPage.getProjectList().then(projects => {
                expect(projects.some(project => project.name.search(new RegExp(searchText, 'i')) != -1));
            });
        });

        it('should filter projects matching description', () => {
            projectPage.getProjectList().then(projects => {
                expect(projects.some(project => project.description.search(new RegExp(searchText, 'i')) != -1));
            });
        });
    });

    describe('with not matching input', () => {
        beforeAll(() => {
            projectPage.search('t*h*i*s*-i*s*-c*o*m*p*l*e*t*e*-n*o*n*s*e*n*s*e*');
        });

        it('should show empty filter message', () => {
            /*projectPage.emptyStateDiv.isPresent().then(isPresent => {
                expect(isPresent).toBeTruthy();
            });*/

            expect(projectPage.emptyStateDiv.isPresent()).toBeTruthy();
        });

        describe('clicking on remove filter', () => {
            beforeAll(() => {
                projectPage.emptyStateRemoveFilter.click();
            });

            it('should remove filter', () => {
                projectPage.searchInput.getText().then(text => {
                    expect(text).toBe('');
                });
            });
        });
    });


    afterAll( (done) => {
        const cleanupWf = new CleanupWorkflow();

        projectPage.getProjectList().then(projects => {
            const chainedPromises = newlyCreatedProjects.map(projectName => cleanupWf.deleteProjectFromList(projectName, projects));

            return Promise.all(chainedPromises);
        }).then(() => done());
    });
});
