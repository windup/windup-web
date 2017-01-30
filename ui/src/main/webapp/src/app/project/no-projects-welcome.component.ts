import {Component, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'wu-no-projects-welcome',
    templateUrl: './no-projects-welcome.component.html'
})
export class NoProjectsWelcomeComponent {
    @Output()
    newProject: EventEmitter<void> = new EventEmitter<void>();

    newProjectClicked() {
        this.newProject.emit();
        return false;
    }
}
