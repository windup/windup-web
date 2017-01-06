import {PersistedProjectModelTraversalModel} from "../../generated/tsModels/PersistedProjectModelTraversalModel";
import {PersistedTraversalChildFileModel} from "../../generated/tsModels/PersistedTraversalChildFileModel";

/**
 * This is a direct port of windup core:
 *   org.jboss.windup.graph.model.comparator.FilePathComparator
 *   https://github.com/windup/windup/blob/59182009d7e8cd9c18e9c188417d9ddcf23aa257/graph/api/src/main/java/org/jboss/windup/graph/model/comparator/FilePathComparator.java
 *
 * @param path1
 * @param path2
 * @returns {number}
 */
export function comparePaths(path1:string, path2:string):number {
    // if they are exactly the same, just short circuit everything
    // and return 0
    if (path1 == path2)
    {
        return 0;
    }

    // split by the path separator (/ or \)
    let pathArray1 = path1.split("/");
    let pathArray2 = path2.split("/");

    if (path1.length != path2.length)
    {
        // if there are differing number of path elements, compare based on number of segments
        return path1.length - path2.length;
    }
    else
    {
        // otherwise, compare each segment
        for (let i = 0; i < path1.length; i++)
        {
            let o1Segment = pathArray1[i];
            let o2Segment = pathArray2[i];

            // if the segments are different, return the results of this comparison
            if (o1Segment != o2Segment)
            {
                return o1Segment.localeCompare(o2Segment);
            }
        }

        // no segments differed, so just return 0 (same path)
        return 0;
    }
}

export function compareTraversals(traversal1:PersistedProjectModelTraversalModel, traversal2:PersistedProjectModelTraversalModel):number {
    return comparePaths(traversal1.path, traversal2.path);
}

export function compareTraversalChildFiles(childFile1:PersistedTraversalChildFileModel, childFile2:PersistedTraversalChildFileModel):number {
    return comparePaths(childFile1.filePath, childFile2.filePath);
}