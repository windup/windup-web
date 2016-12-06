import {Component, OnInit, ElementRef, AfterViewChecked, AfterViewInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import "prismjs";
import "prismjs/components/prism-abap";
import "prismjs/components/prism-actionscript";
import "prismjs/components/prism-apacheconf";
import "prismjs/components/prism-apl";
import "prismjs/components/prism-applescript";
import "prismjs/components/prism-asciidoc";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-autohotkey";
import "prismjs/components/prism-autoit";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-basic";
import "prismjs/components/prism-batch";
import "prismjs/components/prism-c";
import "prismjs/components/prism-bison";
import "prismjs/components/prism-brainfuck";
import "prismjs/components/prism-bro";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-coffeescript";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-css-extras";
import "prismjs/components/prism-css";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-d";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-eiffel";
import "prismjs/components/prism-elixir";
import "prismjs/components/prism-erlang";
import "prismjs/components/prism-fortran";
import "prismjs/components/prism-fsharp";
import "prismjs/components/prism-gherkin";
import "prismjs/components/prism-git";
import "prismjs/components/prism-glsl";
import "prismjs/components/prism-go";
import "prismjs/components/prism-groovy";
import "prismjs/components/prism-haml";
import "prismjs/components/prism-handlebars";
import "prismjs/components/prism-haskell";
import "prismjs/components/prism-haxe";
import "prismjs/components/prism-http";
import "prismjs/components/prism-icon";
import "prismjs/components/prism-inform7";
import "prismjs/components/prism-ini";
import "prismjs/components/prism-jade";
import "prismjs/components/prism-java";
import "prismjs/components/prism-j";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-julia";
import "prismjs/components/prism-keyman";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-latex";
import "prismjs/components/prism-less";
import "prismjs/components/prism-lolcode";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-makefile";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-matlab";
import "prismjs/components/prism-mel";
import "prismjs/components/prism-mizar";
import "prismjs/components/prism-monkey";
import "prismjs/components/prism-nasm";
import "prismjs/components/prism-nginx";
import "prismjs/components/prism-nim";
import "prismjs/components/prism-nix";
import "prismjs/components/prism-nsis";
import "prismjs/components/prism-ocaml";
import "prismjs/components/prism-oz";
import "prismjs/components/prism-parigp";
import "prismjs/components/prism-parser";
import "prismjs/components/prism-pascal";
import "prismjs/components/prism-perl";
import "prismjs/components/prism-php-extras";
import "prismjs/components/prism-php";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-processing";
import "prismjs/components/prism-prolog";
import "prismjs/components/prism-protobuf";
import "prismjs/components/prism-puppet";
import "prismjs/components/prism-pure";
import "prismjs/components/prism-python";
import "prismjs/components/prism-q";
import "prismjs/components/prism-qore";
import "prismjs/components/prism-rest";
import "prismjs/components/prism-rip";
import "prismjs/components/prism-r";
import "prismjs/components/prism-roboconf";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sas";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-scala";
import "prismjs/components/prism-scheme";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-smalltalk";
import "prismjs/components/prism-smarty";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-stylus";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-tcl";
import "prismjs/components/prism-textile";
import "prismjs/components/prism-twig";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-verilog";
import "prismjs/components/prism-vhdl";
import "prismjs/components/prism-vim";
import "prismjs/components/prism-wiki";
import "prismjs/components/prism-yaml";

// Broken at the moment (2016-12-05, jsightler)
//import "prismjs/components/prism-crystal"
//import "prismjs/components/prism-objectivec"

import "prismjs/plugins/keep-markup/prism-keep-markup";
import {FileModelService} from "../../../services/graph/file-model.service";
import {FileModel} from "../../../generated/tsModels/FileModel";

@Component({
    templateUrl: '/source-report.component.html',
    styleUrls: [ '/source-report.component.css' ]
})
export class SourceReportComponent implements OnInit {
    private execID: number;
    private fileID: number;
    private fileModel: FileModel;
    private fileSource: string;
    fileLines: string[];

    constructor(private route:ActivatedRoute, private fileModelService:FileModelService) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fileID = +params['fileId'];

            this.fileModelService.getFileModel(this.execID, this.fileID)
                .subscribe((fileModel) => {
                    this.fileModel = fileModel;
                });

            this.fileModelService.getSource(this.execID, this.fileID)
                .subscribe((fileSource) => {
                    this.fileSource = fileSource;
                    this.fileLines = fileSource.split(/[\r\n]/).map((line) => line + "\n");
                    this.setupHighlights();
                });
        });
    }

    setupHighlights(): void {
        Prism.hooks.add('after-highlight', function () {
            [].forEach.call(document.querySelectorAll('.has-notes .note-placeholder'), function (placeholder) {
                var id = placeholder.getAttribute('data-note');
                var note = document.getElementById(id);
                placeholder.appendChild(note);
            });
        });

        // Do it after the control has been rendered
        setTimeout(() => {
            Prism.highlightAll(false);
        }, 50);
        console.log("Rendered!");
    }
}