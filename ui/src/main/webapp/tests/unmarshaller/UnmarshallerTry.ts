let foo = "../../app/tsModels/"

import {GraphJSONtoTsModelsService, RelationInfo} from '../../app/services/graph/GraphJSONtoTsModelsService';
//import {TestGeneratorModel, TestShipModel, TestPlanetModel} from '../../app/services/graph/test/models/TestGeneratorModel';
import {WarArchiveModel} from '../../app/tsModels/WarArchiveModel';
import {FrameModel} from '../../app/services/graph/FrameModel';
import {TestGraphData} from '../../app/services/graph/test/TestGraphData';

import {DiscriminatorMapping, getParentClass} from '../../app/services/graph/DiscriminatorMapping';
import {DiscriminatorMappingData} from '../../app/tsModels/DiscriminatorMappingData';

import {UnmarshallerClass} from './UnmarshallerClass';


function getData0() { return TEST_JSON_DATA_0; }
function getData1() { return TEST_JSON_DATA_1; }

function tryUnmarshaller()
{  
    var clazz = DiscriminatorMappingData.getModelClassByDiscriminator("WarArchiveModel");
    console.log("class for WarArchiveModel: " + (<Function>clazz).name);
    let service = new GraphJSONtoTsModelsService(DiscriminatorMappingData);
    
    //let frame : WarArchiveModel = service.fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);
    var frame: WarArchiveModel = (<WarArchiveModel> service.fromJSON(getData0()[0]));
    console.log("Got frame: " + frame + " fileName: " + frame.fileName);
    
    frame = (<WarArchiveModel> service.fromJSON(getData1()[0]));
    console.log("Got frame: " + frame + " fileName: " + frame.fileName);
    for (let i in frame)
        console.log(`${i}: ${frame[i]}`);
    
    
    $(document).ready(function(){ new UnmarshallerClass().fetchSomeData(); });
};










// http://localhost:8080/windup-web-services/rest/graph/by-type/WarArchiveModel
const TEST_JSON_DATA_0 = [{
    "w:winduptype":["FileResource","ArchiveModel:","WarArchiveModel"],
    "_id":3584,"isDirectory":false,
    "fileName":"jee-example-web.war","md5Hash":"e71dfca0743df75c0de70bddc5a2686b",
    "unzippedDirectory":".../archives/jee-example-web.war",
    "filePath":"../archives/jee-example-app-1.0.0.ear/jee-example-web.war","windupGenerated":false,
    "ArchiveModel:archiveName":"jee-example-web.war","sha1Hash":"8a72a375ca7feba49ea5cab492e52e64cee41dc6",
}];

// http://localhost:8080/windup-web-services/rest/graph/by-type/WarArchiveModel?depth=1
const TEST_JSON_DATA_1 = [{
    "w:winduptype": ["FileResource", "ArchiveModel:", "WarArchiveModel"],
    "_id": 3584,
    "fileName": "jee-example-web.war",
    "isDirectory": false,
    "sha1Hash": "8a72a375ca7feba49ea5cab492e52e64cee41dc6",
    "md5Hash": "e71dfca0743df75c0de70bddc5a2686b",
    "parentFile": {
        "vertices": [{
            "w:winduptype": ["FileResource", "ArchiveModel:", "ApplicationArchive", "ApplicationModel", "EarArchiveModel"],
            "fileName": "jee-example-app-1.0.0.ear",
            "md5Hash": "59b5236c7f0a5db5c1a5d8a7926ec2cc",
            "unzippedDirectory": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-app-1.0.0.ear",
            "filePath": "/home/ondra/work/Migration/Windup/test-files/jee-example-app-1.0.0.ear",
            "windupGenerated": false,
            "ArchiveModel:archiveName": "jee-example-app-1.0.0.ear",
            "sha1Hash": "4be802879ed2876eaa3c1b951dc8baee69998e93",
            "_id": 512,
            "isDirectory": false,
            "applicationName": "jee-example-app-1.0.0.ear"
        }, {
            "w:winduptype": ["FileResource"],
            "fileName": "META-INF",
            "filePath": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-web.war/META-INF",
            "windupGenerated": false,
            "_id": 3840,
            "isDirectory": true
        }, {
            "w:winduptype": ["FileResource"],
            "fileName": "WEB-INF",
            "filePath": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-web.war/WEB-INF",
            "windupGenerated": false,
            "_id": 5632,
            "isDirectory": true
        }],
        "direction": "OUT"
    },
    "projectModelToFile": {
        "vertices": [{
            "w:winduptype": ["MavenFacet", "ProjectModel"],
            "mavenIdentifier": "org.windup.example:jee-example-web:1.0.0",
            "groupId": "org.windup.example",
            "name": "JEE Example Web Application",
            "artifactId": "jee-example-web",
            "_id": 65024,
            "version": "1.0.0",
            "specificationVersion": "4.0.0"
        }],
        "direction": "IN"
    },
    "OrganizationModel:organizationModelToArchiveModel": {
        "vertices": [{
            "w:winduptype": ["OrganizationModel"],
            "OrganizationModel:name": "Unknown",
            "_id": 56064
        }],
        "direction": "IN"
    },
    "JarManifestModel:archiveToManifest": {
        "vertices": [{
            "Archiver-Version": "Plexus Archiver",
            "w:winduptype": ["FileResource", "JarManifestModel", "SourceFileModel", "ReportFileModel"],
            "fileName": "MANIFEST.MF",
            "filePath": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-web.war/META-INF/MANIFEST.MF",
            "windupGenerated": false,
            "Created-By": "Apache Maven",
            "Manifest-Version": "1.0",
            "_id": 4096,
            "Built-By": "bradsdavis",
            "Build-Jdk": "1.6.0_45",
            "generateSourceReport": true,
            "isDirectory": false
        }],
        "direction": "OUT"
    },
    "unzippedDirectory": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-web.war",
    "rootFileModel": {
        "vertices": [{
            "w:winduptype": ["MavenFacet", "ProjectModel"],
            "mavenIdentifier": "org.windup.example:jee-example-web:1.0.0",
            "groupId": "org.windup.example",
            "name": "JEE Example Web Application",
            "artifactId": "jee-example-web",
            "_id": 65024,
            "version": "1.0.0",
            "specificationVersion": "4.0.0"
        }],
        "direction": "IN"
    },
    "filePath": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-app-1.0.0.ear/jee-example-web.war",
    "windupGenerated": false,
    "ArchiveModel:archiveName": "jee-example-web.war",
    /*"dependencyGroupToArchive": {
        "vertices": [{
            "dependencySHA1": "8a72a375ca7feba49ea5cab492e52e64cee41dc6",
            "_id": 398080
        }],
        "direction": "IN"
    },
    */
    "parentArchive": {
        "vertices": [{
            "w:winduptype": ["FileResource", "ArchiveModel:", "IgnoredFileModel", "identifiedArchive:", "JarArchiveResource"],
            "fileName": "log4j-1.2.6.jar",
            "md5Hash": "56e4cf9fabcc73bcece4259add1e3588",
            "unzippedDirectory": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/log4j-1.2.6.jar",
            "filePath": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-web.war/WEB-INF/lib/log4j-1.2.6.jar",
            "windupGenerated": false,
            "ArchiveModel:archiveName": "log4j-1.2.6.jar",
            "sha1Hash": "4bf32b10f459a4ecd4df234ae2ccb32b9d9ba9b7",
            "IgnoredByRegex": "3rd Party Archive",
            "_id": 6144,
            "isDirectory": false
        }, {
            "w:winduptype": ["FileResource", "ArchiveModel:", "JarArchiveResource"],
            "fileName": "migration-support-1.0.0.jar",
            "md5Hash": "83bdb0a75e5729cb11ff49ffdb21df16",
            "unzippedDirectory": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/migration-support-1.0.0.jar",
            "filePath": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-web.war/WEB-INF/lib/migration-support-1.0.0.jar",
            "windupGenerated": false,
            "ArchiveModel:archiveName": "migration-support-1.0.0.jar",
            "sha1Hash": "fcd7e575a79694b5068c061e272391969c8ea18c",
            "_id": 12544,
            "isDirectory": false
        }, {
            "w:winduptype": ["FileResource", "ArchiveModel:", "IgnoredFileModel", "identifiedArchive:", "JarArchiveResource"],
            "fileName": "commons-lang-2.5.jar",
            "md5Hash": "ab04c560caea60d3b0050beb57776a32",
            "unzippedDirectory": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/commons-lang-2.5.jar",
            "filePath": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-web.war/WEB-INF/lib/commons-lang-2.5.jar",
            "windupGenerated": false,
            "ArchiveModel:archiveName": "commons-lang-2.5.jar",
            "sha1Hash": "b0236b252e86419eef20c31a44579d2aee2f0a69",
            "IgnoredByRegex": "3rd Party Archive",
            "_id": 27392,
            "isDirectory": false
        }, {
            "w:winduptype": ["FileResource", "ArchiveModel:", "ApplicationArchive", "ApplicationModel", "EarArchiveModel"],
            "fileName": "jee-example-app-1.0.0.ear",
            "md5Hash": "59b5236c7f0a5db5c1a5d8a7926ec2cc",
            "unzippedDirectory": "/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.wRWHLXQIJAvL.report/archives/jee-example-app-1.0.0.ear",
            "filePath": "/home/ondra/work/Migration/Windup/test-files/jee-example-app-1.0.0.ear",
            "windupGenerated": false,
            "ArchiveModel:archiveName": "jee-example-app-1.0.0.ear",
            "sha1Hash": "4be802879ed2876eaa3c1b951dc8baee69998e93",
            "_id": 512,
            "isDirectory": false,
            "applicationName": "jee-example-app-1.0.0.ear"
        }],
        "direction": "OUT"
    },
}];


tryUnmarshaller();
