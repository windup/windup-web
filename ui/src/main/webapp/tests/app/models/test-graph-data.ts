export class TestGraphData
{
    static BASE_WINDUP_CONFIG = {
        "_id": 256,
        "_mode": "vertex",
        "w:winduptype": ["BaseWindupConfiguration"],
        "fetchRemoteResources": false,
        "csv": false,
        "keepWorkDirs": true,
        "edgeLabel": {
            "direction": "out", //|'in'|'both',
            "vertices": [
                { "_type": "vertex", }, // Normal vertex
                { "_type": "link", "link": "http://localhost/rest/graph/by-id/{id}" } // A link to a vertex
            ]
        },
        "otherEdgeLabel": { }
    };

    static TEST_GRAPH_MODEL_DATA = {
        "_id": 456,
        "_mode": "vertex",
        "w:winduptype": ["TestGenerator"],

        "bar": "bar123", "name": "Blake Ross", "rank": "capitain",

        // -> ship
        "commands": {
            "vertices": [
                { "_id": 123, "w:winduptype": ["TestShip"], "name": "USS Firefox"},
            ]
        },
        // -> colonizedPlanet
        "colonizes": {
            "vertices": [
                { "_id": 213, "w:winduptype": ["TestPlanet"],  "name": "Mars" },
                { "_id": 214, "w:winduptype": ["TestPlanet"],  "name": "Venus" },
                //{ "_mode": "link", "link": "by-id=215" },
            ]
        },
    };
}