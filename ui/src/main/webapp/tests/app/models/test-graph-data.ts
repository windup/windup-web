export class TestGraphData
{
    static BASE_WINDUP_CONFIG = {
        "_id": 256,
        "_mode": "vertex",
        "w:winduptype": ["BaseWindupConfiguration"],
        "fetchRemoteResources": false,
        "csv": false,
        "keepWorkDirs": true,
        "vertices_out": {
            "edgeLabel": {
                "direction": "OUT", //|'IN'
                "_type": "link",
                "link": "http://localhost/rest/graph/by-id/256" // A link to a set of vertices
            },
        },
        "otherEdgeLabel": { }
    };

    static TEST_GRAPH_MODEL_DATA = {
        "_id": 456,
        "_mode": "vertex",
        "w:winduptype": ["TestGenerator"],

        "bar": "bar123", "name": "Blake Ross", "rank": "capitain",

        "vertices_out": {
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
            "shuttles": {
                "direction": "OUT", //|'IN'
                "_type": "link",
                "link": "http://localhost/rest/graph/by-id/456" // A link to a set of vertices
            },
            "fighter": {
                "direction": "OUT", //|'IN'
                "_type": "link",
                "link": "http://localhost/rest/graph/by-id/456" // A link to a set of vertices
            },
        },
    };
}