import {NgControlName} from "@angular/common";

export class FormComponent {
    errorMessages:string[];

    constructor() {
    }

    /**
     * This works simplifies the process of checking for an error state on the control.
     *
     * It makes sure that the control is not-pristine (don't show errors on fields the user hasn't touched yet)
     * and that the control is already rendered.
     */
    hasError(control:NgControlName) {
        let touched = control.touched == null ? false : control.touched;
        return !control.valid && touched;
    }

    handleError(error:any) {
        this.errorMessages = [];
        if (error.parameterViolations) {
            error.parameterViolations.forEach(violation => {
                console.log("Violation: " + JSON.stringify(violation));
                this.errorMessages.push(violation.message);
            });
        } else {
            this.errorMessages.push("Error: " + error);
        }
    }
}