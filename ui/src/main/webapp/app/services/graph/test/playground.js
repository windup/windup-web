var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FrameModel = (function () {
    function FrameModel(vertexId) {
    }
    FrameModel.prototype.getVertexId = function () {
        return this.vertexId;
    };
    FrameModel.prototype.setVertexId = function (id) {
        this.vertexId = id;
    };
    return FrameModel;
}());
var TestGeneratorModel = (function (_super) {
    __extends(TestGeneratorModel, _super);
    function TestGeneratorModel() {
        _super.apply(this, arguments);
    }
    TestGeneratorModel.discriminator = 'TestGenerator';
    TestGeneratorModel.graphPropertyMapping = {
        bar: 'boo',
        name: 'name',
        rank: 'rank',
    };
    TestGeneratorModel.graphRelationMapping = {
        colonizes: 'colonizedPlanet',
        commands: 'ship',
    };
    return TestGeneratorModel;
}(FrameModel));
var TestPlanetModel = (function (_super) {
    __extends(TestPlanetModel, _super);
    function TestPlanetModel() {
        _super.apply(this, arguments);
    }
    TestPlanetModel.discriminator = 'TestPlanet';
    TestPlanetModel.graphPropertyMapping = {
        name: 'name',
    };
    TestPlanetModel.graphRelationMapping = {};
    return TestPlanetModel;
}(FrameModel));
var TestShipModel = (function (_super) {
    __extends(TestShipModel, _super);
    function TestShipModel() {
        _super.apply(this, arguments);
    }
    TestShipModel.discriminator = 'TestShip';
    TestShipModel.graphPropertyMapping = {
        name: 'name',
    };
    TestShipModel.graphRelationMapping = {};
    return TestShipModel;
}(FrameModel));
var DiscriminatorMappingData = (function () {
    function DiscriminatorMappingData() {
    }
    DiscriminatorMappingData.mapping = {
        "TestShip": TestShipModel,
        "TestGenerator": TestGeneratorModel,
        "TestPlanet": TestPlanetModel,
    };
    return DiscriminatorMappingData;
}());
;
var DiscriminatorMapping = (function (_super) {
    __extends(DiscriminatorMapping, _super);
    function DiscriminatorMapping() {
        _super.apply(this, arguments);
    }
    DiscriminatorMapping.getModelClassByDiscriminator = function (discriminator) {
        return this.mapping[discriminator];
        // "this" should be ok with static:
        // https://www.typescriptlang.org/play/#src=class%20Foo%20%7B%20static%20x%20%3D%20%22A%22%3B%20%7D%0D%0Aclass%20Foo2%20extends%20Foo%20%7B%0D%0A%09%0D%0A%09public%20static%20getX()%20%7B%20return%20this.x%3B%20%7D%0D%0A%09%0D%0A%7D%0D%0A%0D%0Aalert(Foo2.getX())%3B
    };
    DiscriminatorMapping.getDiscriminatorByModelClass = function (clazz) {
        return this.mapping[clazz.discriminator];
    };
    DiscriminatorMapping.scan = function () {
        DiscriminatorMapping.mapping = {};
        var props = Object.getOwnPropertyNames(window);
        //for (var key in Object.getOwnPropertyNames(window)){
        for (var i = 0; i < props.length; i++) {
            var key = props[i];
            var val = window[key];
            if (val == null)
                continue;
            // Key: FrameModel Type: function Proto: [object Object] Ctor: function FrameModel(vertexId) { }
            console.log("Key: " + key);
            try {
            console.log(("Key: " + key + ", Type: " + typeof val + ",  ") +
                ("Proto: " + val.prototype + ", ") +
                ("Ctor: " + val.constructor + ", ") +
                ("Ctor.Prototype: " + (val.constructor ? val.constructor.prototype : '-') + ", ") +
                ("Proto.Ctor: " + (val.prototype ? val.prototype.constructor : '-')));
            } catch(e) { console.log("ERROR: " + e.message); }

            var FooCtor = Object.getPrototypeOf(Object.getPrototypeOf(val)).constructor;
            var foo = new FooCtor()

            if (typeof val !== 'function')
                continue;
            if (val.prototype == void 0)
                continue;
            if (val.prototype.constructor !== FrameModel)
                continue;
            console.log("AND THE WINNER IS: " + val.prototype.constructor.name);
            DiscriminatorMapping.mapping[key] = val; // Doesn't work
        }
    };
    return DiscriminatorMapping;
}(DiscriminatorMappingData));
DiscriminatorMapping.scan();
