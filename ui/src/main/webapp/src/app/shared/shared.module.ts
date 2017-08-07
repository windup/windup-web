import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {BreadCrumbsService} from "./navigation/breadcrumbs.service";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {SchedulerService} from "./scheduler.service";
import {SortingService} from "./sort/sorting.service";
import {CustomSelectComponent} from "./custom-select/custom-select.component";
import {DefaultLayoutComponent} from "./layout/default-layout.component";
import {BreadCrumbsComponent} from "./navigation/breadcrumbs.component";
import {ContextMenuComponent} from "./navigation/context-menu.component";
import {UploadProgressbarComponent} from "./upload/upload-progressbar.component";
import {UploadQueueComponent} from "./upload/upload-queue.component";
import {ConfirmationModalComponent} from "./dialog/confirmation-modal.component";
import {JsTreeAngularWrapperComponent} from "./js-tree-angular-wrapper.component";
import {ModalDialogComponent} from "./dialog/modal-dialog.component";
import {NavbarComponent} from "./navigation/navbar.component";
import {PopoverComponent} from "./popover.component";
import {ProgressBarComponent} from "./progress-bar.component";
import {SearchComponent} from "./search/search.component";
import {SortComponent} from "./sort/sort.component";
import {WizardComponent} from "./wizard/wizard.component";
import {CommonModule} from "@angular/common";
import {LogViewComponent} from "./log-view/log-view.component";
import {SortIndicatorComponent} from "./sort/sort-indicator.component";
import {SortableTableComponent} from "./sort/sortable-table.component";
import {TabContainerComponent} from "./tabs/tab-container.component";
import {TabComponent} from "./tabs/tab.component";
import {DurationPipe} from "./duration.pipe";
import {NotificationComponent} from "./notification.component";
import {RouterModule} from "@angular/router";
import {StatusIconComponent} from "./status-icon.component";
import {ChosenModule} from "./chosen/chosen.module";
import {FileUploadModule, FileUploader} from "ng2-file-upload";
import {SlimLoadingBarModule} from "ng2-slim-loading-bar";
import {MomentModule} from "angular2-moment";
import {CheckboxesComponent} from "./checkboxes.component";
import {WizardLayoutComponent} from "./layout/wizard-layout.component";
import {ContextMenuLinkComponent} from "./navigation/context-menu-link.component";
import {HamburgerMenuComponent} from "./navigation/hamburger-menu.component";
import {NavbarSelectionComponent} from "./navigation/navbar-selection.component";
import {ShortenPipe} from "./text/shorten.pipe";
import {AlternativeUploadQueueComponent} from "./upload/alternative-upload-queue.component";
import {ProjectNameNotExistsValidator} from "./validators/project-name-not-exists.validator";
import {CacheService, getCacheServiceInstance} from "./cache.service";
import {ExpandCollapseComponent} from "./expand-collapse.component";
import {IsRouteActiveDirective} from "./is-route-active.directive";
import {PrettyExecutionStatus} from "./pretty-execution-state.pipe";
import {ReplacePipe} from "./replace.pipe";
import {DialogService} from "./dialog/dialog.service";
import {FileUploaderFactory} from "./upload/file-uploader-factory.service";
import {UploadedItemsListComponent} from "./upload/uploaded-items-list.component";
import {ActiveFiltersListComponent} from "./filter/active-filters-list.component";
import {TextFilterComponent} from "./filter/text-filter.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {AllDataFilteredMessageComponent} from "./all-data-filtered-message.component";
import {DropdownFilterComponent} from "./filter/dropdown-filter.component";
import {WebSocketSubjectFactory} from "./websocket.factory";
import {EventBusService} from "../core/events/event-bus.service";
import {LoadingIndicatorComponent} from "./loading-indicator.component";
import {PaginationComponent} from "./pagination.component";
import {PaginationService} from "./pagination.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([]),
        ChosenModule,
        FileUploadModule,
        MomentModule,
        SlimLoadingBarModule.forRoot(),
    ],
    providers: [
        BreadCrumbsService,
        ConfirmDeactivateGuard,
        SchedulerService,
        SortingService,
        DialogService,
        {
            provide: FileUploader,
            useFactory: createFileUploader
        },
        {
            provide: CacheService,
            useFactory: getCacheServiceInstance
        },
        FileUploaderFactory,
        WebSocketSubjectFactory,
        PaginationService
    ],
    declarations: [
        CustomSelectComponent,
        DefaultLayoutComponent,
        LogViewComponent,
        BreadCrumbsComponent,
        ContextMenuComponent,
        ContextMenuLinkComponent,
        HamburgerMenuComponent,
        NavbarComponent,
        NavbarSelectionComponent,
        SearchComponent,
        SortComponent,
        SortIndicatorComponent,
        SortableTableComponent,
        TabContainerComponent,
        TabComponent,
        WizardComponent,
        UploadProgressbarComponent,
        UploadQueueComponent,
        AlternativeUploadQueueComponent,
        ConfirmationModalComponent,
        DurationPipe,
        JsTreeAngularWrapperComponent,
        ModalDialogComponent,
        PopoverComponent,
        ProgressBarComponent,
        NotificationComponent,
        StatusIconComponent,
        CheckboxesComponent,
        WizardLayoutComponent,
        ExpandCollapseComponent,
        UploadedItemsListComponent,
        TextFilterComponent,
        ActiveFiltersListComponent,
        ToolbarComponent,
        AllDataFilteredMessageComponent,
        DropdownFilterComponent,
        PaginationComponent,

        ShortenPipe,

        IsRouteActiveDirective,
        PrettyExecutionStatus,
        ReplacePipe,

        ProjectNameNotExistsValidator,
        LoadingIndicatorComponent, // Components are not suitable to be put in core module, see it's Javadoc.
    ],
    exports: [
        CustomSelectComponent,
        DefaultLayoutComponent,
        LogViewComponent,
        BreadCrumbsComponent,
        ContextMenuComponent,
        ContextMenuLinkComponent,
        HamburgerMenuComponent,
        NavbarComponent,
        NavbarSelectionComponent,
        SearchComponent,
        SortComponent,
        SortIndicatorComponent,
        SortableTableComponent,
        TabContainerComponent,
        TabComponent,
        WizardComponent,
        UploadProgressbarComponent,
        UploadQueueComponent,
        AlternativeUploadQueueComponent,
        ConfirmationModalComponent,
        DurationPipe,
        JsTreeAngularWrapperComponent,
        ModalDialogComponent,
        PopoverComponent,
        ProgressBarComponent,
        NotificationComponent,
        StatusIconComponent,
        CheckboxesComponent,
        WizardLayoutComponent,
        ExpandCollapseComponent,
        UploadedItemsListComponent,
        TextFilterComponent,
        ActiveFiltersListComponent,
        ToolbarComponent,
        AllDataFilteredMessageComponent,
        DropdownFilterComponent,
        LoadingIndicatorComponent, // Needs to be in exports too, otherwise it would be private fot the module.
        PaginationComponent,

        ProjectNameNotExistsValidator,
        IsRouteActiveDirective,
        PrettyExecutionStatus,

        ShortenPipe,
        ReplacePipe,

        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ChosenModule,
        MomentModule,
        FileUploadModule,
    ]
})
export class SharedModule {

}

export function createFileUploader() {
    return new FileUploader({});
}
