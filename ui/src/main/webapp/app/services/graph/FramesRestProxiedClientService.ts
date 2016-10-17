import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {FrameProxy} from './FrameProxy';

/**
 * Facilitates the data flow between a generic REST endpoint for the graph and the calling methods.
 * The purpose is to make the transfer of the objects as easy as possible.
 * Unlike Rexster, this leverages the Windup Frames support for types.
 */
@Injectable()
export class FramesRestProxiedClientService
{
    private endpointUrl: string;

    constructor (private http: Http) {}

    /**
     * A generic query for adjacent frames.
     * @param initialFrames  A set of frames whose adjacent frames we ask for.
     * @param edgeLabel      The edge label to follow.
     * @param directionOut   The direction to query for.
     * @param query          A query string filtering the returned adjacent frames. The query syntax is TODO.
     * @param idsOnly        Whether we ask for fully materialized frames or frames with vertex IDs only.
     * @param limit          Maximum number of items to return. This implies a need for sorting.
     * @param offset         The offset to start the returned list at. This assumes sorting.
     */
    public queryAdjacent<T extends FrameProxy>(
            initialFrames: FrameProxy | FrameProxy[] | number[],
            edgeLabel: string,
            directionOut: boolean,
            query?: string,
            idsOnly?: boolean,
            limit?: number,
            offset?: number
    ):
        Observable<QueryResults<T>>
        //FrameProxy[]
    {
        var initialIDs: number[];
        if (initialFrames instanceof FrameProxy)
            initialIDs = [(<FrameProxy>initialFrames).getVertexId()];
        else if (initialFrames instanceof Array)
            // string[] of ID's
            initialIDs = (<FrameProxy[]>initialFrames).map((frame) => frame.getVertexId());
        else
            initialIDs = <number[]> initialFrames;

        var url = this.endpointUrl + `/queryAdjacent/${initialIDs.join(",")}/${edgeLabel}`
            + `/${directionOut ? 'out' : 'in'}/${query}/${idsOnly}/${limit}/${offset}`;

        var responseObservable = this.http.put(url, "")
            .map(res => <QueryResults<T>> res.json())
            .catch(this.handleError);

        return responseObservable;

        /*var data: QueryResults;
        var complete = false;
        var timeout = 100;
        responseObservable.subscribe(function(value: QueryResults){data = value}, null, function(){complete = true;});
        while (timeout-- > 0 && !complete) setTimeout(100);
        return data.frames;
        /**/
    }




    /**
     * Adds the adjacent vertex; if there's already one, it is removed.
     * This assumes that the frame already exists and only references it by vertexId. TODO: Support creating the frame.
     */
    public setAdjacent(thisFrame: FrameProxy, adjacentFrame: FrameProxy | number, edgeLabel: string, directionOut: boolean)
    {
        this.requestToAdjacent("set", thisFrame, adjacentFrame, edgeLabel, directionOut);
    }

    /**
     * Adds the adjacent vertex.
     * This assumes that the frame already exists and only references it by vertexId. TODO: Support creating the frame.
     */
    public addAdjacent(thisFrame: FrameProxy, adjacentFrame: FrameProxy | number, edgeLabel: string, directionOut: boolean)
    {
        this.requestToAdjacent("add", thisFrame, adjacentFrame, edgeLabel, directionOut);
    }

    /**
     * Removes the adjacent vertex.
     */
    public removeAdjacent(thisFrame: FrameProxy, adjacentFrame: FrameProxy | number, edgeLabel: string, directionOut: boolean)
    {
        this.requestToAdjacent("remove", thisFrame, adjacentFrame, edgeLabel, directionOut);
    }

    private requestToAdjacent(mode: string, thisFrame: FrameProxy, adjacentFrame: FrameProxy | number, edgeLabel: string, directionOut: boolean)
    {
        var id = FramesRestProxiedClientService.getVertexId(adjacentFrame);
        var body = adjacentFrame instanceof FrameProxy ? JSON.stringify(adjacentFrame) : "";

        if (mode === "remove" && id == null)
            throw new Error("Frame to remove has no ID: " + body);

        var url = this.endpointUrl + `/${mode}Adjacent/${thisFrame.getVertexId()}/${edgeLabel}`
            + `/${directionOut ? 'out' : 'in'}/${id}/`

        return this.http.put(url, body)
            .map(res => res)
            .catch(this.handleError);
    }



    static getVertexId(frameOrId: FrameProxy | number){
        return <number> ((frameOrId instanceof FrameProxy) ? (<FrameProxy>frameOrId).getVertexId() : frameOrId);
    }

    private handleError(error: Response) {
        console.error("Service error: " + error);
        console.error("Service error (json): " + JSON.stringify(error.json()));
        return Observable.throw(error.json());
    }
}


export class QueryResults<T extends FrameProxy>
{
    status: string;
    frames: T[];
}