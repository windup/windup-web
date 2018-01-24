import {ProjectListPage} from "../../pages/project-list.po";
import {CreateProjectWorkflow} from "../../workflows/create-project.wf";
import {browser} from "protractor";
import {CleanupWorkflow} from "../../workflows/cleanup.wf";

describe('Project List Filtering', () => {
    const projectPage = new ProjectListPage();

    let newlyCreatedProjects = [];

    beforeAll((done) => {
        const date = new Date().getTime().toString();
        const wf = new CreateProjectWorkflow();

        newlyCreatedProjects = [
            'This has some matching text in title '  + date,
            'This does not ' + date
        ];

        projectPage.navigateTo()
            .then(() => wf.createProject(newlyCreatedProjects[0]))
            .then(() => wf.createProject(newlyCreatedProjects[1], 'But it has some matching text in description'))
            .then(() => projectPage.navigateTo())
            .then(() => done());
    });

    describe('with matching input', () => {
        let searchText;
        let searchRegex;

        beforeAll((done) => {
            searchText = 'some matching text';
            searchRegex = new RegExp(searchText, 'i');
            projectPage.search(searchText)
                .then(() => browser.waitForAngular())
                .then(() => done());
        });

        it('should find relevant projects', (done) => {
            projectPage.getProjectList().then(projects => {
                expect(projects.length).toBe(2);
                done();
            });
        });

        it('should filter projects matching title', (done) => {
            projectPage.getProjectList().then(projects => {
                expect(projects.some(project => {
                    return project.name.search(searchRegex) != -1
                }));
                done();
            });
        });

        it('should filter projects matching description', (done) => {
            projectPage.getProjectList().then(projects => {
                expect(projects.some(project => project.description.search(searchRegex) != -1));
                done();
            });
        });
    });

    describe('with not matching input', () => {
        beforeAll((done) => {
            projectPage.search('t*h*i*s*-i*s*-c*o*m*p*l*e*t*e*-n*o*n*s*e*n*s*e*')
                .then(() => done());
        });

        it('should show empty filter message', () => {
            /*projectPage.emptyStateDiv.isPresent().then(isPresent => {
                expect(isPresent).toBeTruthy();
            });*/

            expect(projectPage.emptyStateDiv.isPresent()).toBeTruthy();
        });

        describe('clicking on remove filter', () => {
            beforeAll((done) => {
                projectPage.emptyStateRemoveFilter.click()
                    .then(() => done());
            });

            it('should remove filter', (done) => {
                projectPage.searchInput.getText().then(text => {
                    expect(text).toBe('');
                    done();
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
