import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import "rxjs/Rx";

import {ProgressBarComponent} from "./progressbar.component";
import {PopoverComponent} from "./popover.component";
import {NavbarComponent} from "./navbar.component";
import {ModalDialogComponent} from "./modal-dialog.component";
import {JsTreeAngularWrapperComponent} from "./js-tree-angular-wrapper.component";
import {ConfirmationModalComponent} from "./confirmation-modal.component";
import {UploadProgressbarComponent} from "./upload/upload-progressbar.component";
import {UploadQueueComponent} from "./upload/upload-queue.component";
import {BreadCrumbsComponent} from "./navigation/breadcrumbs.component";
import {ContextMenuComponent} from "./navigation/context-menu.component";
import {DefaultLayoutComponent} from "./layout/default-layout.component";
import {GroupLayoutComponent} from "./layout/group-layout.component";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {RouterModule} from "@angular/router";
import {NotificationComponent} from "./notification.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([])
    ],
    declarations: [
        ProgressBarComponent,
        PopoverComponent,
        NavbarComponent,
        ModalDialogComponent,
        JsTreeAngularWrapperComponent,
        ConfirmationModalComponent,
        UploadProgressbarComponent,
        UploadQueueComponent,
        BreadCrumbsComponent,
        ContextMenuComponent,
        DefaultLayoutComponent,
        GroupLayoutComponent,
        NotificationComponent
    ],
    providers: [
        ConfirmDeactivateGuard
    ],
    exports: [
        CommonModule,
        FormsModule,
        ProgressBarComponent,
        PopoverComponent,
        NavbarComponent,
        ModalDialogComponent,
        JsTreeAngularWrapperComponent,
        ConfirmationModalComponent,
        UploadProgressbarComponent,
        UploadQueueComponent,
        BreadCrumbsComponent,
        ContextMenuComponent,
        DefaultLayoutComponent,
        GroupLayoutComponent,
        NotificationComponent
    ]
})
export class SharedModule {

}
