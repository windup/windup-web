import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";


@Injectable()
export class BreadCrumbsService {

    breadCrumbsSubject: Subject<BreadCrumbLink[]>;
    breadCrumbsObservable: Observable<BreadCrumbLink[]>;

    breadCrumbLinks: BreadCrumbLink[] = [];

    constructor() {
        this.breadCrumbsSubject = new Subject<BreadCrumbLink[]>();
        this.breadCrumbsObservable = this.breadCrumbsSubject.asObservable();
    }



    public get breadcrumbs(): Observable<BreadCrumbLink[]> {
        return this.breadCrumbsObservable;
    }

    public addLink(link: BreadCrumbLink): void {
        this.breadCrumbLinks.push(link);
        this.breadCrumbsSubject.next(this.breadCrumbLinks);
    }
}

export interface BreadCrumbLink {
    name: string;
    route: any[];
}
