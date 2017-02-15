import {Component, OnInit, Input, OnChanges, SimpleChange} from "@angular/core";
import {DependenciesData, DependencyNode, DependencyEdge} from "./dependencies.service";
import * as d3 from "d3";
import "d3-selection-multi"; // Doesn't work.
import {substringAfterLast} from "../../shared/utils";


type SvgSelection = d3.Selection<SVGElement, {}, HTMLElement, any>;


/**
 * Visualisation of the dependencies as a graph.
 *
 * D3 forceSimulation places the nodes.
 * Most of styling is in CSS. Do not style in the code, use classes.
 * Do not change lamdas and functions. They handle `this` differently.
 *
 * Please leave in the commented code and
 *
 *    DO NOT AUTO-REFORMAT!
 *
 * (unless you want to take over the maintainance of this :) )
 *
 * @see Tech discussion: https://docs.google.com/document/d/124Rqm9bGjzO2bg1VjPg-PnnuR2tzhkpXIazG9Yuy5hQ/edit#
 *
 * @author Ondrej Zizka, zizka@seznam.cz
 */
@Component({
    templateUrl: "dependencies-graph.component.html",
    styleUrls: ["dependencies-graph.component.css"],
    selector: 'wu-dependencies-graph',
})
export class DependenciesGraphComponent implements OnInit, OnChanges {

    // Hack
    //static self: DependenciesGraphComponent;

    // Data
    _dependencies: DependenciesData;
    private jsonData;

    // Selections
    private svg; //: SvgSelection;
    private myEdges;
    private myNodes;
    private myGroups;
    private zoomingGroup;

    // Behaviors
    private simulation;
    private zoom;
    private center: Point;

    constructor() {  }

    @Input()
    set dependencies(dependencies: DependenciesData) {
        console.warn("set dependencies(dependencies: DependenciesData)", dependencies);
        if (dependencies == null)
            return;

        this._dependencies = Object.assign({}, dependencies);
        this._dependencies.edges = <any>this._dependencies.edges.map((edge: DependencyEdge) => {
            return {
                source: "" + edge.from,
                target: "" + edge.to
            };
        });
    }

    ngOnInit(): void {
        //DependenciesGraphComponent.self = this;
        this.initVisualisation();
    }

    // changes: {configuration: SimpleChange, selection: SimpleChange, options: SimpleChange}
    ngOnChanges(changes: {dependencies: SimpleChange}): void {
        if (!changes.dependencies.currentValue || changes.dependencies.currentValue === changes.dependencies.previousValue)
            return;
        this.processNewDependenciesData(changes.dependencies.currentValue);
        this.render(this.jsonData);
    }


    private initVisualisation() {
        console.log("initVisualisation()");
        this.svg = d3.select('svg#dependenciesGraph');
        this.zoomingGroup = d3.select("svg #zoomingGroup");
        this.myEdges = this.svg.selectAll(".myEdge");
        this.myNodes = this.svg.selectAll(".myNode");
        this.myGroups = this.svg.selectAll(".myGroup");

        // Zooming
        this.zoom = d3.zoom();
        this.zoom.scaleExtent([0.4, 3]);
        //this.zoom.extent([[x0, y0], [x1, y1]]); //svg.getBoundingClientRect() // left, top, right, bottom, x, y, width, height
        this.zoom.on("zoom", () => {
            let t = d3.event.transform;
            this.zoomingGroup.attr("transform", t); // Using transform.toString()
            this.svg.selectAll(".myGroup circle").attr("transform", "scale(" + 1/t.k + ")");
            this.svg.selectAll(".myGroup .labelBox").attr("transform", "scale(" + 1/t.k + ")");
            this.svg.selectAll(".myGroup .labelText").attr("transform", "scale(" + 1/t.k + ")");
        });
        this.svg.call(this.zoom)        // Attach the zoom.
            .on("dblclick.zoom", null); // Don't zoom on doubleclick.

        this.simulation = d3.forceSimulation()
            // Pushes the nodes away from each other.
            .force("charge", d3.forceManyBody().strength(-500))
            // This creates kind of hexagonal grid
            .force("collide", d3.forceCollide(20).strength(0.5))
            // Keeps the nodes at some distance using the edges.
            .force("link", d3.forceLink()
                .id((d: DependencyNode) => ""+d.id)
                .strength(0.99)
                .distance(function(link: d3.SimulationLinkDatum<HasState>, i) {
                    return (link.source["state"] == "small") ? 1 : 80;
                })
            )
            // These two pull the nodes to the center.

            .force("x", d3.forceX(this.svg.node().getBoundingClientRect().width  * 0.4)) // The labels would make it look off with 0.5
            .force("y", d3.forceY(this.svg.node().getBoundingClientRect().height * 0.5))
            // This makes the nodes fly more from each other. No way to set strength?
            // Using this instead of x/y needs much stronger "charge".
            //.force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", () => this.onSimulationTick());
    }


    private processNewDependenciesData(depsData: DependenciesData): void {
        console.log("processNewDependenciesData()");
        this.jsonData = depsData;

        // Adjust the height according to count of nodes. If this doesn't work, we could watch the Y positions difference of top and bottom nodes (before zooming).
        let svgHeight = 300 + ((this.jsonData.nodes && this.jsonData.nodes.length) ? Math.ceil( Math.sqrt( this.jsonData.nodes.length )) * 22 : 0);
        this.svg.attr("height", svgHeight);
        this.simulation.force("y").y(svgHeight * 0.5);

        this.jsonData.nodesById = DependenciesGraphComponent.createObjectGraphFromJsonData(this.jsonData);

        this.simulation.nodes(this.jsonData.nodes);               // Register the nodes for the simulation.
        this.simulation.force("link").links(this.jsonData.links); // Register the links for the forceLink force created above.
    }


    /**
     * Main rendering function.
     */
    private render(jsonData) {
        //console.warn("render()")
        // Edges
        this.zoomingGroup.selectAll(".myEdge")
            .data(jsonData.links)
            .enter()
                .append("line")
                .attr("class", "myEdge");

        // Nodes
        this.myGroups =  this.zoomingGroup.selectAll(".myGroup")
            .data(jsonData.nodes, (d) => d.id)
                //.each((x) => console.log("Updating: ", x.id, x.state))
                .classed("small", (d) => d.state == "small")
            .enter()
                //.each((d) => (console.log("Entering: ", d.id, d.state)))
                // Initially centered
                //.each(function(d){ d.x = this.center.x + DependenciesGraphComponent.displacement(); d.y = this.center.y + DependenciesGraphComponent.displacement();})
                .append("g")
                // Dragging.
                .call(d3.drag()
                    .on("start", () => this.dragStarted())
                    .on("drag", () => this.dragMoved())
                    .on("end", () => this.dragEnded())
                )
            ;
        this.myGroups.exit().each((x) => console.log("Exiting: ", x)).remove();
        this.myGroups
            .attr("class", (d) => "myGroup node" + d.id + " type" + d.type + " suffix_" + (d.data ? d.data.fileSuffix : "none"))
            //.classed("isKnown", (d) => -1 === ["jar", "war", "ear"].indexOf(substringAfterLast(d.name, ".")))
            .classed("isKnown", (d) => d.type == "KnownLibrary")
            .on("mouseover", function(d, i, nodes) {
                this.parentNode.appendChild(this); // Move to the front
                d3.select(this).classed("highlighted", true);
                d3.selectAll("#dependencyDetails .node"+d.id).classed("highlighted", true);
                // Keep the app nodes always on top.
                DependenciesGraphComponent.bringAppNodesToFront();
            })
            .on("mouseout", function(d, i, nodes) {
                d3.select(this).classed("highlighted", false);
                d3.selectAll("#dependencyDetails .node"+d.id).classed("highlighted", false);
            })
            .on("click",    (data, index, nodes) => this.showDepDetails(data) )
            .on("dblclick", (data, index, nodes) => this.toggleDepsSize(data) );

        var labelBox = this.myGroups.append("rect");
        function attrs(map) {
            for (var name in map) this.attr(name, map[name]);
            return this;
        }
        labelBox.attrs = attrs;
        labelBox.attrs({x: 7, y: -9, width: 150, height: 18, "class": "labelBox", fill: "white", stroke: "black"});

        var labelText = this.myGroups.append("text").attr("x", 14).attr("y", 5).attr("class", "labelText");
        var text = labelText.text(function (d){return d.name});
        labelBox.style("width", function(d){ var box = this.nextElementSibling.getBBox(); return box.width + 10; });

        this.myGroups.append("circle")
            .attr("class", "myNode");

        DependenciesGraphComponent.bringAppNodesToFront();

        // Make the links contract for d.state = "small"
        this.simulation.force("link").links(jsonData.links);
    }


    /**
     * Creates the object references between the nodes.
     * Only manipulates the data.
     */
    private static createObjectGraphFromJsonData(jsonData){
        var nodesById = new Map<string, ExtendedDependencyNode>();
        for(let i = 0; i < jsonData.nodes.length; i++){
            let node: ExtendedDependencyNode = jsonData.nodes[i];
            (<any>node).id = "" + node.id;
            nodesById.set(""+node.id, node);
            node.in  = [];
            node.out = [];
            if (node.data && node.data.fileName) {
                node.data.fileSuffix = substringAfterLast(node.data.fileName, '.');
            }
        }

        // D3js force code needs .source and .target
        jsonData.links = jsonData.edges.map( function(x) { return { source: ""+x.from, target: ""+x.to }; } );

        for(let i = 0; i < jsonData.links.length; i++){
            let link = jsonData.links[i];
            (<any>link).source = "" + link.source;
            (<any>link).target = "" + link.target;
            try {
                nodesById.get(link.source).out.push(nodesById.get(link.target));
                nodesById.get(link.target).in.push(nodesById.get(link.source));
                //link.source.out.push(link.target);
                //link.target.in.push(link.source);
                // Interesting, link.source is a number and at the same time it's an object. WTF.
                //var source = Object.getOwnPropertyDescriptor(link, "source");
                //var target = Object.getOwnPropertyDescriptor(link, "target");
                //source.out.push(target);
                //target.in.push(source);
            } catch (e){
                console.error("Couldn't link objects: ", link, nodesById, e);
            }
        }
        return nodesById;
    }

    /**
     * Shows the dependency details in a table, when the node is clicked.
     */
    private showDepDetails(dependencyData) {
        var details = [
            { key: "id",       value: dependencyData.id },
            { key: "name",     value: dependencyData.name },
        ];
        if (dependencyData.data) {
            details.push({ key: "fileName", value: dependencyData.data.fileName })
            details.push({ key: "filePath", value: dependencyData.data.filePath })
        }
        d3.select("#dependencyDetails").selectAll("table tbody#traits tr td")
            .data(details, function(d: any) { return d ? d.key : this["id"]; })
            .text(function(d) { return d.value; })
            .exit().text("");

        d3.select("#dependencyDetails").classed("noDependencies", dependencyData.out.length == 0);
        d3.select("#dependencyDetails").classed("noDependees",    dependencyData.in.length == 0);

        function highlightHandler(d, i, nodes) {
            this.zoomingGroup.select(".node" + d.id).classed("highlighted", d3.event.type == "mouseover");
        }

        var tr = d3.select("tbody#dependsOn").selectAll("tr")
            .data(dependencyData.out, function(d: DependencyNode) { return d ? ""+d.id : null; });
        tr.enter()
            .append("tr").attr("class", (d: DependencyNode) => "node" + d.id)
            .append("td").attr("colspan", 2)
            .text(function(d: any) { return d.name; })
            .on("mouseover mouseout", highlightHandler)
        tr.exit().remove();

        var tr = d3.select("tbody#dependencyOf").selectAll("tr")
            .data(dependencyData.in, function(d: DependencyNode) { return d ? ""+d.id : null; });
        tr.enter()
            .append("tr").attr("class", (d: DependencyNode) => "node" + d.id)
            .append("td").attr("colspan", 2)
            .text(function(d: DependencyNode) { return d.name; })
            .on("mouseover mouseout", highlightHandler)
        tr.exit().remove();
    }


    private onSimulationTick() {
        // Position the edges as per their nodes positions.
        this.zoomingGroup.selectAll(".myEdge")
            .attr("x1", function(item) { return item.source.x; })
            .attr("y1", function(item) { return item.source.y; })
            .attr("x2", function(item) { return item.target.x; })
            .attr("y2", function(item) { return item.target.y; });

        // Position the nodes as per their .x and .y set by the force.
        this.zoomingGroup.selectAll(".myGroup")
                .attr("transform", function(d){return "translate("+d.x+","+d.y+")"});
    }

    private setEdgesStroke(node, activeEdgeStroke: number = 1, inactiveEdgeStroke: number = 0) {
        this.myEdges.attr('stroke-opacity', edge => {
            let isActiveEdge = edge.source.id === node.id || edge.target.id === node.id;

            return isActiveEdge ? activeEdgeStroke : inactiveEdgeStroke;
        });
    }

    // Dragging handlers
    private dragStarted() {
        if (!d3.event.active)
            this.simulation.alphaTarget(0.3).restart(); // Keep simulation heated at 0.3
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
    }

    private dragMoved() {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }

    private dragEnded() {
        if (!d3.event.active)
            this.simulation.alphaTarget(0); // Let the simulation freeze after decaying
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }

    private toggleDepsSize(nodeData) {
        var newState = (nodeData.state == "small") ? "large" : "small";
        nodeData.state = newState;
        // 1) Find linked nodes
        var deps = nodeData.out; //window.jsonData.nodesById.get(""+nodeData.id).out;
        // 2) Hide/show the labels
        // 3) Make circles smaller/larger
        // 4) Make the link distance shorter/longer
        for (var i = 0; i < deps.length; i++) {
            deps[i].state = newState;
        }
        this.render(this.jsonData);
    }

    private static bringAppNodesToFront() {
        d3.selectAll(".myGroup.typeApplication").each( function(d, i, nodes) { (<any>this).parentNode.appendChild(this); }); // Perf killer?
    }

    /**
     * Helper for initial nodes displacement.
     */
    private static displacement() {
        var val = Math.random() + 0.5;
        val = val < 1 ? val : -2 + val; // Could be val - Math.floor(val)
        val = 100 * val;  // Distance
        return val;
    }

}

class HasState {
    state: string;
}
class Point {
    constructor(
        public x: number,
        public y: number
    ) {}
}
interface ExtendedDependencyNode extends DependencyNode {
    state: string;
    in: ExtendedDependencyNode[];
    out: ExtendedDependencyNode[];
}
