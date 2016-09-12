import {FramesRestClientService} from './FramesRestClientService';
import {FrameModel} from './FrameModel';

/**
 * Provides methods to handle basic CRUD operations form the Frame models' getters, setters, adders and removers.
 */
export class FrameProxy extends FrameModel
{
    //@Inject
    private graphClient: FramesRestClientService;

    private set(item: FrameProxy, edgeLabel?: string, directionOut?: boolean)
    {
        this.graphClient.setAdjacent(this, item, edgeLabel, directionOut);
    }

    private add(item: FrameProxy, edgeLabel?: string, directionOut?: boolean)
    {
        this.graphClient.addAdjacent(this, item, edgeLabel, directionOut);
    }

    private remove(item: FrameProxy, edgeLabel?: string, directionOut?: boolean)
    {
        this.graphClient.removeAdjacent(this, item, edgeLabel, directionOut);
    }

    private queryAdjacent(edgeLabel: string, directionOut: boolean, query?: string)
    {
        this.graphClient.queryAdjacent(this, edgeLabel, directionOut, query);
    }
}
