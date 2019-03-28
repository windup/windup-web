import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../shared/abtract.service";
import {Constants} from "../../constants";
import {
    ApplicationDetailsDTO,
    ClassificationReducedDTO,
    FileReducedDTO,
    HintReducedDTO,
    ProjectTraversalReducedDTO,
    ReportFilter,
    TagReducedDTO
} from "../../generated/windup-services";
import {Cached} from "../../shared/cache.service";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ApplicationDetailsService extends AbstractService {

    constructor(private _http: HttpClient) {
        super();
    }

    @Cached('applicationDetails', null, true)
    getApplicationDetailsData(executionId: number, filter?: ReportFilter): Observable<ApplicationDetailsFullDTO> {
        let url = `${Constants.GRAPH_REST_BASE}/graph/application-details/${executionId}`;

        let serializedFilter = this.serializeFilter(filter);

        return <any>this._http.post<ApplicationDetailsDTO>(url, serializedFilter, this.JSON_OPTIONS)
            .pipe(
                map((res:ApplicationDetailsDTO) => {
                    res.traversals = res.traversals.map(traversal => {
                        return this.mapTraversal(res, traversal);
                    });
                    return res;
                })
            );
    }

    private mapTraversal(applicationDetails: ApplicationDetailsDTO, traversal: ProjectTraversalReducedDTO): ProjectTraversalFullDTO {
        let newTraversal = <ProjectTraversalFullDTO>traversal;

        newTraversal.files = traversal.files.map(file => {
            let newFile = <FileFullDTO>file;
            newFile.hints = file.hintIDs.map(hintID => {
                let hint = <HintFullDTO>applicationDetails.hints[hintID];
                hint.id = hintID;
                hint.titleString = applicationDetails.stringCache.byID[hint.title];
                hint.javaFQCNString = applicationDetails.stringCache.byID[hint.javaFQCN];
                hint.tags = this.mapTags(applicationDetails, hint.tags);
                return hint;
            });
            newFile.classifications = file.classificationIDs.map(classificationID => {
                let classification = <ClassificationFullDTO>applicationDetails.classifications[classificationID];
                classification.id = classificationID;
                classification.tags = this.mapTags(applicationDetails, classification.tags);
                classification.titleString = applicationDetails.stringCache.byID[classification.title];
                return classification;
            });
            newFile.tags = this.mapTags(applicationDetails, newFile.tags);
            return newFile;
        });

        newTraversal.children.map(childTraversal => {
            return this.mapTraversal(applicationDetails, childTraversal);
        });

        return newTraversal;
    }

    private mapTags(details: ApplicationDetailsDTO, reducedTags: TagReducedDTO[]): TagFullDTO[] {
        return reducedTags.map(reducedTag => {
            let fullTag = <TagFullDTO>reducedTag;
            fullTag.nameString = details.stringCache.byID[reducedTag.name];
            fullTag.levelString = details.stringCache.byID[reducedTag.level];
            return fullTag;
        });
    }
}

export interface TagFullDTO extends TagReducedDTO {
    nameString: string;
    levelString: string;
}

export interface HintFullDTO extends HintReducedDTO {
    id: number;
    titleString: string;
    javaFQCNString: string;
    tags: TagFullDTO[];
}

export interface ClassificationFullDTO extends ClassificationReducedDTO {
    id: number;
    titleString: string;
    tags: TagFullDTO[];
}

export interface FileFullDTO extends FileReducedDTO {
    hints: HintFullDTO[];
    classifications: ClassificationFullDTO[];
    tags: TagFullDTO[];
}

export interface ProjectTraversalFullDTO extends ProjectTraversalReducedDTO {
    files: FileFullDTO[];
    children: ProjectTraversalFullDTO[];
}

export interface ApplicationDetailsFullDTO {
    traversals: ProjectTraversalFullDTO[];
}
