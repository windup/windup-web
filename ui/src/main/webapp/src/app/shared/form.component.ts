import {AbstractControl, NgControl} from "@angular/forms";
import {utils} from "./utils";
import {AbstractComponent} from "./AbstractComponent";

export class FormComponent extends AbstractComponent {
    errorMessages: string[] = [];

    constructor() {
        super();
    }

    /**
     * This works simplifies the process of checking for an error state on the control.
     *
     * It makes sure that the control is not-pristine (don't show errors on fields the user hasn't touched yet)
     * and that the control is already rendered.
     */
    hasError(control: NgControl|AbstractControl, errorName?: string) {
        if (control == null)
            return false;

        if (control.pending)
            return false;

        let touched = control.touched == null ? false : control.touched;
        if (errorName) {
            return control.hasError(errorName) && touched;
        } else {
            return !control.valid && touched;
        }
    }

    handleError(error: any) {
        this.errorMessages = [];
        if (!error) {
            this.errorMessages.push("Server call failed.");
        } else if (error.parameterViolations) {
            error.parameterViolations.forEach(violation => {
                console.warn("Violation: " + JSON.stringify(violation));
                this.errorMessages.push(violation.message);
            });
        } else {
            if (error instanceof ProgressEvent)
                this.errorMessages.push("Server connection failed.");
            else
                this.errorMessages.push(utils.getErrorMessage(error).trim());
        }
    }
}
