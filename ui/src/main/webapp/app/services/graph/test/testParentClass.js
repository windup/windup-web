var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FrameModel = (function () {
    function FrameModel() {
        this.id = 1;
    }
    return FrameModel;
}());
var TestPlanetModel = (function (_super) {
    __extends(TestPlanetModel, _super);
    function TestPlanetModel() {
        _super.apply(this, arguments);
    }
    return TestPlanetModel;
}(FrameModel));

var clazz = TestPlanetModel;
var parent = Object.getPrototypeOf(Object.getPrototypeOf(new clazz())).constructor;
alert(parent);
