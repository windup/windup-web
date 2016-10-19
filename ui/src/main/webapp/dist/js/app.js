webpackJsonp([1],{

/***/ 109:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__control_value_accessor__ = __webpack_require__(32);
/* unused harmony export CHECKBOX_VALUE_ACCESSOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return CheckboxControlValueAccessor; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


var CHECKBOX_VALUE_ACCESSOR = {
    provide: __WEBPACK_IMPORTED_MODULE_1__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return CheckboxControlValueAccessor; }),
    multi: true
};
/**
 * The accessor for writing a value and listening to changes on a checkbox input element.
 *
 *  ### Example
 *  ```
 *  <input type="checkbox" name="rememberLogin" ngModel>
 *  ```
 *
 *  @stable
 */
var CheckboxControlValueAccessor = (function () {
    function CheckboxControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    CheckboxControlValueAccessor.prototype.writeValue = function (value) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'checked', value);
    };
    CheckboxControlValueAccessor.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    CheckboxControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    CheckboxControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    CheckboxControlValueAccessor.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
                    host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
                    providers: [CHECKBOX_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    CheckboxControlValueAccessor.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    ];
    return CheckboxControlValueAccessor;
}());
//# sourceMappingURL=checkbox_value_accessor.js.map

/***/ },

/***/ 110:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__control_value_accessor__ = __webpack_require__(32);
/* unused harmony export DEFAULT_VALUE_ACCESSOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DefaultValueAccessor; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */



var DEFAULT_VALUE_ACCESSOR = {
    provide: __WEBPACK_IMPORTED_MODULE_2__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return DefaultValueAccessor; }),
    multi: true
};
/**
 * The default accessor for writing a value and listening to changes that is used by the
 * {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName} directives.
 *
 *  ### Example
 *  ```
 *  <input type="text" name="searchQuery" ngModel>
 *  ```
 *
 *  @stable
 */
var DefaultValueAccessor = (function () {
    function DefaultValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    DefaultValueAccessor.prototype.writeValue = function (value) {
        var normalizedValue = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["b" /* isBlank */])(value) ? '' : value;
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    };
    DefaultValueAccessor.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    DefaultValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    DefaultValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    DefaultValueAccessor.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: 'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
                    // TODO: vsavkin replace the above selector with the one below it once
                    // https://github.com/angular/angular/issues/3011 is implemented
                    // selector: '[ngControl],[ngModel],[ngFormControl]',
                    host: { '(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                    providers: [DEFAULT_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    DefaultValueAccessor.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    ];
    return DefaultValueAccessor;
}());
//# sourceMappingURL=default_value_accessor.js.map

/***/ },

/***/ 111:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__abstract_form_group_directive__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_form__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__template_driven_errors__ = __webpack_require__(285);
/* unused harmony export modelGroupProvider */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgModelGroup; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






var modelGroupProvider = {
    provide: __WEBPACK_IMPORTED_MODULE_3__control_container__["a" /* ControlContainer */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return NgModelGroup; })
};
/**
 * @whatItDoes Creates and binds a {@link FormGroup} instance to a DOM element.
 *
 * @howToUse
 *
 * This directive can only be used as a child of {@link NgForm} (or in other words,
 * within `<form>` tags).
 *
 * Use this directive if you'd like to create a sub-group within a form. This can
 * come in handy if you want to validate a sub-group of your form separately from
 * the rest of your form, or if some values in your domain model make more sense to
 * consume together in a nested object.
 *
 * Pass in the name you'd like this sub-group to have and it will become the key
 * for the sub-group in the form's full value. You can also export the directive into
 * a local template variable using `ngModelGroup` (ex: `#myGroup="ngModelGroup"`).
 *
 * {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
 *
 * * **npm package**: `@angular/forms`
 *
 * * **NgModule**: `FormsModule`
 *
 * @stable
 */
var NgModelGroup = (function (_super) {
    __extends(NgModelGroup, _super);
    function NgModelGroup(parent, validators, asyncValidators) {
        _super.call(this);
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    /** @internal */
    NgModelGroup.prototype._checkParentType = function () {
        if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof __WEBPACK_IMPORTED_MODULE_4__ng_form__["a" /* NgForm */])) {
            __WEBPACK_IMPORTED_MODULE_5__template_driven_errors__["a" /* TemplateDrivenErrors */].modelGroupParentException();
        }
    };
    NgModelGroup.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup' },] },
    ];
    /** @nocollapse */
    NgModelGroup.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_3__control_container__["a" /* ControlContainer */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Host"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__validators__["b" /* NG_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__validators__["c" /* NG_ASYNC_VALIDATORS */],] },] },
    ];
    NgModelGroup.propDecorators = {
        'name': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['ngModelGroup',] },],
    };
    return NgModelGroup;
}(__WEBPACK_IMPORTED_MODULE_2__abstract_form_group_directive__["a" /* AbstractFormGroupDirective */]));
//# sourceMappingURL=ng_model_group.js.map

/***/ },

/***/ 112:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__error_examples__ = __webpack_require__(284);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ReactiveErrors; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

var ReactiveErrors = (function () {
    function ReactiveErrors() {
    }
    ReactiveErrors.controlParentException = function () {
        throw new Error("formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].formControlName);
    };
    ReactiveErrors.ngModelGroupException = function () {
        throw new Error("formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents\n       that also have a \"form\" prefix: formGroupName, formArrayName, or formGroup.\n\n       Option 1:  Update the parent to be formGroupName (reactive form strategy)\n\n        " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].formGroupName + "\n\n        Option 2: Use ngModel instead of formControlName (template-driven strategy)\n\n        " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].ngModelGroup);
    };
    ReactiveErrors.missingFormException = function () {
        throw new Error("formGroup expects a FormGroup instance. Please pass one in.\n\n       Example:\n\n       " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].formControlName);
    };
    ReactiveErrors.groupParentException = function () {
        throw new Error("formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup\n      directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].formGroupName);
    };
    ReactiveErrors.arrayParentException = function () {
        throw new Error("formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n        Example:\n\n        " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].formArrayName);
    };
    ReactiveErrors.disabledAttrWarning = function () {
        console.warn("\n      It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true\n      when you set up this control in your component class, the disabled attribute will actually be set in the DOM for\n      you. We recommend using this approach to avoid 'changed after checked' errors.\n       \n      Example: \n      form = new FormGroup({\n        first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),\n        last: new FormControl('Drew', Validators.required)\n      });\n    ");
    };
    return ReactiveErrors;
}());
//# sourceMappingURL=reactive_errors.js.map

/***/ },

/***/ 113:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__control_value_accessor__ = __webpack_require__(32);
/* unused harmony export SELECT_VALUE_ACCESSOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return SelectControlValueAccessor; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return NgSelectOption; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */




var SELECT_VALUE_ACCESSOR = {
    provide: __WEBPACK_IMPORTED_MODULE_3__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return SelectControlValueAccessor; }),
    multi: true
};
function _buildValueString(id, value) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["b" /* isBlank */])(id))
        return "" + value;
    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["g" /* isPrimitive */])(value))
        value = 'Object';
    return __WEBPACK_IMPORTED_MODULE_2__facade_lang__["h" /* StringWrapper */].slice(id + ": " + value, 0, 50);
}
function _extractId(valueString) {
    return valueString.split(':')[0];
}
/**
 * @whatItDoes Writes values and listens to changes on a select element.
 *
 * Used by {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName}
 * to keep the view synced with the {@link FormControl} model.
 *
 * @howToUse
 *
 * If you have imported the {@link FormsModule} or the {@link ReactiveFormsModule}, this
 * value accessor will be active on any select control that has a form directive. You do
 * **not** need to add a special selector to activate it.
 *
 * ### How to use select controls with form directives
 *
 * To use a select in a template-driven form, simply add an `ngModel` and a `name`
 * attribute to the main `<select>` tag.
 *
 * If your option values are simple strings, you can bind to the normal `value` property
 * on the option.  If your option values happen to be objects (and you'd like to save the
 * selection in your form as an object), use `ngValue` instead:
 *
 * {@example forms/ts/selectControl/select_control_example.ts region='Component'}
 *
 * In reactive forms, you'll also want to add your form directive (`formControlName` or
 * `formControl`) on the main `<select>` tag. Like in the former example, you have the
 * choice of binding to the  `value` or `ngValue` property on the select's options.
 *
 * {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
 *
 * Note: We listen to the 'change' event because 'input' events aren't fired
 * for selects in Firefox and IE:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1024350
 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4660045/
 *
 * * **npm package**: `@angular/forms`
 *
 * @stable
 */
var SelectControlValueAccessor = (function () {
    function SelectControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    SelectControlValueAccessor.prototype.writeValue = function (value) {
        this.value = value;
        var valueString = _buildValueString(this._getOptionId(value), value);
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', valueString);
    };
    SelectControlValueAccessor.prototype.registerOnChange = function (fn) {
        var _this = this;
        this.onChange = function (valueString) {
            _this.value = valueString;
            fn(_this._getOptionValue(valueString));
        };
    };
    SelectControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    SelectControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    /** @internal */
    SelectControlValueAccessor.prototype._registerOption = function () { return (this._idCounter++).toString(); };
    /** @internal */
    SelectControlValueAccessor.prototype._getOptionId = function (value) {
        for (var _i = 0, _a = __WEBPACK_IMPORTED_MODULE_1__facade_collection__["c" /* MapWrapper */].keys(this._optionMap); _i < _a.length; _i++) {
            var id = _a[_i];
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["i" /* looseIdentical */])(this._optionMap.get(id), value))
                return id;
        }
        return null;
    };
    /** @internal */
    SelectControlValueAccessor.prototype._getOptionValue = function (valueString) {
        var value = this._optionMap.get(_extractId(valueString));
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(value) ? value : valueString;
    };
    SelectControlValueAccessor.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
                    host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                    providers: [SELECT_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    SelectControlValueAccessor.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    ];
    return SelectControlValueAccessor;
}());
/**
 * @whatItDoes Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @howToUse
 *
 * See docs for {@link SelectControlValueAccessor} for usage examples.
 *
 * @stable
 */
var NgSelectOption = (function () {
    function NgSelectOption(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(this._select))
            this.id = this._select._registerOption();
    }
    Object.defineProperty(NgSelectOption.prototype, "ngValue", {
        set: function (value) {
            if (this._select == null)
                return;
            this._select._optionMap.set(this.id, value);
            this._setElementValue(_buildValueString(this.id, value));
            this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgSelectOption.prototype, "value", {
        set: function (value) {
            this._setElementValue(value);
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(this._select))
                this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    NgSelectOption.prototype._setElementValue = function (value) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
    };
    NgSelectOption.prototype.ngOnDestroy = function () {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(this._select)) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    };
    NgSelectOption.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: 'option' },] },
    ];
    /** @nocollapse */
    NgSelectOption.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: SelectControlValueAccessor, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Host"] },] },
    ];
    NgSelectOption.propDecorators = {
        'ngValue': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['ngValue',] },],
        'value': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['value',] },],
    };
    return NgSelectOption;
}());
//# sourceMappingURL=select_control_value_accessor.js.map

/***/ },

/***/ 114:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__control_value_accessor__ = __webpack_require__(32);
/* unused harmony export SELECT_MULTIPLE_VALUE_ACCESSOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return SelectMultipleControlValueAccessor; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return NgSelectMultipleOption; });
/* unused harmony export SELECT_DIRECTIVES */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */




var SELECT_MULTIPLE_VALUE_ACCESSOR = {
    provide: __WEBPACK_IMPORTED_MODULE_3__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return SelectMultipleControlValueAccessor; }),
    multi: true
};
function _buildValueString(id, value) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["b" /* isBlank */])(id))
        return "" + value;
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["f" /* isString */])(value))
        value = "'" + value + "'";
    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["g" /* isPrimitive */])(value))
        value = 'Object';
    return __WEBPACK_IMPORTED_MODULE_2__facade_lang__["h" /* StringWrapper */].slice(id + ": " + value, 0, 50);
}
function _extractId(valueString) {
    return valueString.split(':')[0];
}
/** Mock interface for HTMLCollection */
var HTMLCollection = (function () {
    function HTMLCollection() {
    }
    return HTMLCollection;
}());
/**
 * The accessor for writing a value and listening to changes on a select element.
 *
 * @stable
 */
var SelectMultipleControlValueAccessor = (function () {
    function SelectMultipleControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    SelectMultipleControlValueAccessor.prototype.writeValue = function (value) {
        var _this = this;
        this.value = value;
        if (value == null)
            return;
        var values = value;
        // convert values to ids
        var ids = values.map(function (v) { return _this._getOptionId(v); });
        this._optionMap.forEach(function (opt, o) { opt._setSelected(ids.indexOf(o.toString()) > -1); });
    };
    SelectMultipleControlValueAccessor.prototype.registerOnChange = function (fn) {
        var _this = this;
        this.onChange = function (_) {
            var selected = [];
            if (_.hasOwnProperty('selectedOptions')) {
                var options = _.selectedOptions;
                for (var i = 0; i < options.length; i++) {
                    var opt = options.item(i);
                    var val = _this._getOptionValue(opt.value);
                    selected.push(val);
                }
            }
            else {
                var options = _.options;
                for (var i = 0; i < options.length; i++) {
                    var opt = options.item(i);
                    if (opt.selected) {
                        var val = _this._getOptionValue(opt.value);
                        selected.push(val);
                    }
                }
            }
            fn(selected);
        };
    };
    SelectMultipleControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    SelectMultipleControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    /** @internal */
    SelectMultipleControlValueAccessor.prototype._registerOption = function (value) {
        var id = (this._idCounter++).toString();
        this._optionMap.set(id, value);
        return id;
    };
    /** @internal */
    SelectMultipleControlValueAccessor.prototype._getOptionId = function (value) {
        for (var _i = 0, _a = __WEBPACK_IMPORTED_MODULE_1__facade_collection__["c" /* MapWrapper */].keys(this._optionMap); _i < _a.length; _i++) {
            var id = _a[_i];
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["i" /* looseIdentical */])(this._optionMap.get(id)._value, value))
                return id;
        }
        return null;
    };
    /** @internal */
    SelectMultipleControlValueAccessor.prototype._getOptionValue = function (valueString) {
        var opt = this._optionMap.get(_extractId(valueString));
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(opt) ? opt._value : valueString;
    };
    SelectMultipleControlValueAccessor.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
                    host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
                    providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    SelectMultipleControlValueAccessor.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    ];
    return SelectMultipleControlValueAccessor;
}());
/**
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * ### Example
 *
 * ```
 * <select multiple name="city" ngModel>
 *   <option *ngFor="let c of cities" [value]="c"></option>
 * </select>
 * ```
 */
var NgSelectMultipleOption = (function () {
    function NgSelectMultipleOption(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(this._select)) {
            this.id = this._select._registerOption(this);
        }
    }
    Object.defineProperty(NgSelectMultipleOption.prototype, "ngValue", {
        set: function (value) {
            if (this._select == null)
                return;
            this._value = value;
            this._setElementValue(_buildValueString(this.id, value));
            this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgSelectMultipleOption.prototype, "value", {
        set: function (value) {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(this._select)) {
                this._value = value;
                this._setElementValue(_buildValueString(this.id, value));
                this._select.writeValue(this._select.value);
            }
            else {
                this._setElementValue(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    NgSelectMultipleOption.prototype._setElementValue = function (value) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
    };
    /** @internal */
    NgSelectMultipleOption.prototype._setSelected = function (selected) {
        this._renderer.setElementProperty(this._element.nativeElement, 'selected', selected);
    };
    NgSelectMultipleOption.prototype.ngOnDestroy = function () {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(this._select)) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    };
    NgSelectMultipleOption.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: 'option' },] },
    ];
    /** @nocollapse */
    NgSelectMultipleOption.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: SelectMultipleControlValueAccessor, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Host"] },] },
    ];
    NgSelectMultipleOption.propDecorators = {
        'ngValue': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['ngValue',] },],
        'value': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['value',] },],
    };
    return NgSelectMultipleOption;
}());
var SELECT_DIRECTIVES = [SelectMultipleControlValueAccessor, NgSelectMultipleOption];
//# sourceMappingURL=select_multiple_control_value_accessor.js.map

/***/ },

/***/ 115:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_observable_fromPromise__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_observable_fromPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_observable_fromPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__directives_shared__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facade_async__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__private_import_core__ = __webpack_require__(287);
/* unused harmony export VALID */
/* unused harmony export INVALID */
/* unused harmony export PENDING */
/* unused harmony export DISABLED */
/* unused harmony export isControl */
/* harmony export (binding) */ __webpack_require__.d(exports, "d", function() { return AbstractControl; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return FormControl; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FormGroup; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return FormArray; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






/**
 * Indicates that a FormControl is valid, i.e. that no errors exist in the input value.
 */
var VALID = 'VALID';
/**
 * Indicates that a FormControl is invalid, i.e. that an error exists in the input value.
 */
var INVALID = 'INVALID';
/**
 * Indicates that a FormControl is pending, i.e. that async validation is occurring and
 * errors are not yet available for the input value.
 */
var PENDING = 'PENDING';
/**
 * Indicates that a FormControl is disabled, i.e. that the control is exempt from ancestor
 * calculations of validity or value.
 */
var DISABLED = 'DISABLED';
function isControl(control) {
    return control instanceof AbstractControl;
}
function _find(control, path, delimiter) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["b" /* isBlank */])(path))
        return null;
    if (!(path instanceof Array)) {
        path = path.split(delimiter);
    }
    if (path instanceof Array && __WEBPACK_IMPORTED_MODULE_3__facade_collection__["b" /* ListWrapper */].isEmpty(path))
        return null;
    return path.reduce(function (v, name) {
        if (v instanceof FormGroup) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(v.controls[name]) ? v.controls[name] : null;
        }
        else if (v instanceof FormArray) {
            var index = name;
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(v.at(index)) ? v.at(index) : null;
        }
        else {
            return null;
        }
    }, control);
}
function toObservable(r) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__private_import_core__["a" /* isPromise */])(r) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_rxjs_observable_fromPromise__["fromPromise"])(r) : r;
}
function coerceToValidator(validator) {
    return Array.isArray(validator) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__directives_shared__["b" /* composeValidators */])(validator) : validator;
}
function coerceToAsyncValidator(asyncValidator) {
    return Array.isArray(asyncValidator) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__directives_shared__["c" /* composeAsyncValidators */])(asyncValidator) : asyncValidator;
}
/**
 * @whatItDoes This is the base class for {@link FormControl}, {@link FormGroup}, and
 * {@link FormArray}.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * @stable
 */
var AbstractControl = (function () {
    function AbstractControl(validator, asyncValidator) {
        this.validator = validator;
        this.asyncValidator = asyncValidator;
        /** @internal */
        this._onCollectionChange = function () { };
        this._pristine = true;
        this._touched = false;
        /** @internal */
        this._onDisabledChange = [];
    }
    Object.defineProperty(AbstractControl.prototype, "value", {
        /**
         * The value of the control.
         */
        get: function () { return this._value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "status", {
        /**
         * The validation status of the control. There are four possible
         * validation statuses:
         *
         * * **VALID**:  control has passed all validation checks
         * * **INVALID**: control has failed at least one validation check
         * * **PENDING**: control is in the midst of conducting a validation check
         * * **DISABLED**: control is exempt from validation checks
         *
         * These statuses are mutually exclusive, so a control cannot be
         * both valid AND invalid or invalid AND disabled.
         */
        get: function () { return this._status; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "valid", {
        /**
         * A control is `valid` when its `status === VALID`.
         *
         * In order to have this status, the control must have passed all its
         * validation checks.
         */
        get: function () { return this._status === VALID; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "invalid", {
        /**
         * A control is `invalid` when its `status === INVALID`.
         *
         * In order to have this status, the control must have failed
         * at least one of its validation checks.
         */
        get: function () { return this._status === INVALID; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "pending", {
        /**
         * A control is `pending` when its `status === PENDING`.
         *
         * In order to have this status, the control must be in the
         * middle of conducting a validation check.
         */
        get: function () { return this._status == PENDING; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "disabled", {
        /**
         * A control is `disabled` when its `status === DISABLED`.
         *
         * Disabled controls are exempt from validation checks and
         * are not included in the aggregate value of their ancestor
         * controls.
         */
        get: function () { return this._status === DISABLED; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "enabled", {
        /**
         * A control is `enabled` as long as its `status !== DISABLED`.
         *
         * In other words, it has a status of `VALID`, `INVALID`, or
         * `PENDING`.
         */
        get: function () { return this._status !== DISABLED; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "errors", {
        /**
         * Returns any errors generated by failing validation. If there
         * are no errors, it will return null.
         */
        get: function () { return this._errors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "pristine", {
        /**
         * A control is `pristine` if the user has not yet changed
         * the value in the UI.
         *
         * Note that programmatic changes to a control's value will
         * *not* mark it dirty.
         */
        get: function () { return this._pristine; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "dirty", {
        /**
         * A control is `dirty` if the user has changed the value
         * in the UI.
         *
         * Note that programmatic changes to a control's value will
         * *not* mark it dirty.
         */
        get: function () { return !this.pristine; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "touched", {
        /**
        * A control is marked `touched` once the user has triggered
        * a `blur` event on it.
        */
        get: function () { return this._touched; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "untouched", {
        /**
         * A control is `untouched` if the user has not yet triggered
         * a `blur` event on it.
         */
        get: function () { return !this._touched; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "valueChanges", {
        /**
         * Emits an event every time the value of the control changes, in
         * the UI or programmatically.
         */
        get: function () { return this._valueChanges; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "statusChanges", {
        /**
         * Emits an event every time the validation status of the control
         * is re-calculated.
         */
        get: function () { return this._statusChanges; },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this will overwrite any existing sync validators.
     */
    AbstractControl.prototype.setValidators = function (newValidator) {
        this.validator = coerceToValidator(newValidator);
    };
    /**
     * Sets the async validators that are active on this control. Calling this
     * will overwrite any existing async validators.
     */
    AbstractControl.prototype.setAsyncValidators = function (newValidator) {
        this.asyncValidator = coerceToAsyncValidator(newValidator);
    };
    /**
     * Empties out the sync validator list.
     */
    AbstractControl.prototype.clearValidators = function () { this.validator = null; };
    /**
     * Empties out the async validator list.
     */
    AbstractControl.prototype.clearAsyncValidators = function () { this.asyncValidator = null; };
    /**
     * Marks the control as `touched`.
     *
     * This will also mark all direct ancestors as `touched` to maintain
     * the model.
     */
    AbstractControl.prototype.markAsTouched = function (_a) {
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        onlySelf = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["k" /* normalizeBool */])(onlySelf);
        this._touched = true;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent.markAsTouched({ onlySelf: onlySelf });
        }
    };
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, it will also mark all children as `untouched`
     * to maintain the model, and re-calculate the `touched` status of all parent
     * controls.
     */
    AbstractControl.prototype.markAsUntouched = function (_a) {
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._touched = false;
        this._forEachChild(function (control) { control.markAsUntouched({ onlySelf: true }); });
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent._updateTouched({ onlySelf: onlySelf });
        }
    };
    /**
     * Marks the control as `dirty`.
     *
     * This will also mark all direct ancestors as `dirty` to maintain
     * the model.
     */
    AbstractControl.prototype.markAsDirty = function (_a) {
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        onlySelf = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["k" /* normalizeBool */])(onlySelf);
        this._pristine = false;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent.markAsDirty({ onlySelf: onlySelf });
        }
    };
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, it will also mark all children as `pristine`
     * to maintain the model, and re-calculate the `pristine` status of all parent
     * controls.
     */
    AbstractControl.prototype.markAsPristine = function (_a) {
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._pristine = true;
        this._forEachChild(function (control) { control.markAsPristine({ onlySelf: true }); });
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent._updatePristine({ onlySelf: onlySelf });
        }
    };
    /**
     * Marks the control as `pending`.
     */
    AbstractControl.prototype.markAsPending = function (_a) {
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        onlySelf = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["k" /* normalizeBool */])(onlySelf);
        this._status = PENDING;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent.markAsPending({ onlySelf: onlySelf });
        }
    };
    /**
     * Disables the control. This means the control will be exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children will be disabled to maintain the model.
     */
    AbstractControl.prototype.disable = function (_a) {
        var _b = _a === void 0 ? {} : _a, onlySelf = _b.onlySelf, emitEvent = _b.emitEvent;
        emitEvent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(emitEvent) ? emitEvent : true;
        this._status = DISABLED;
        this._errors = null;
        this._forEachChild(function (control) { control.disable({ onlySelf: true }); });
        this._updateValue();
        if (emitEvent) {
            this._valueChanges.emit(this._value);
            this._statusChanges.emit(this._status);
        }
        this._updateAncestors(onlySelf);
        this._onDisabledChange.forEach(function (changeFn) { return changeFn(true); });
    };
    /**
     * Enables the control. This means the control will be included in validation checks and
     * the aggregate value of its parent. Its status is re-calculated based on its value and
     * its validators.
     *
     * If the control has children, all children will be enabled.
     */
    AbstractControl.prototype.enable = function (_a) {
        var _b = _a === void 0 ? {} : _a, onlySelf = _b.onlySelf, emitEvent = _b.emitEvent;
        this._status = VALID;
        this._forEachChild(function (control) { control.enable({ onlySelf: true }); });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: emitEvent });
        this._updateAncestors(onlySelf);
        this._onDisabledChange.forEach(function (changeFn) { return changeFn(false); });
    };
    AbstractControl.prototype._updateAncestors = function (onlySelf) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent.updateValueAndValidity();
            this._parent._updatePristine();
            this._parent._updateTouched();
        }
    };
    AbstractControl.prototype.setParent = function (parent) { this._parent = parent; };
    /**
     * Re-calculates the value and validation status of the control.
     *
     * By default, it will also update the value and validity of its ancestors.
     */
    AbstractControl.prototype.updateValueAndValidity = function (_a) {
        var _b = _a === void 0 ? {} : _a, onlySelf = _b.onlySelf, emitEvent = _b.emitEvent;
        onlySelf = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["k" /* normalizeBool */])(onlySelf);
        emitEvent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(emitEvent) ? emitEvent : true;
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
            this._errors = this._runValidator();
            this._status = this._calculateStatus();
            if (this._status === VALID || this._status === PENDING) {
                this._runAsyncValidator(emitEvent);
            }
        }
        if (emitEvent) {
            this._valueChanges.emit(this._value);
            this._statusChanges.emit(this._status);
        }
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent.updateValueAndValidity({ onlySelf: onlySelf, emitEvent: emitEvent });
        }
    };
    /** @internal */
    AbstractControl.prototype._updateTreeValidity = function (_a) {
        var emitEvent = (_a === void 0 ? { emitEvent: true } : _a).emitEvent;
        this._forEachChild(function (ctrl) { return ctrl._updateTreeValidity({ emitEvent: emitEvent }); });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: emitEvent });
    };
    AbstractControl.prototype._setInitialStatus = function () { this._status = this._allControlsDisabled() ? DISABLED : VALID; };
    AbstractControl.prototype._runValidator = function () {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this.validator) ? this.validator(this) : null;
    };
    AbstractControl.prototype._runAsyncValidator = function (emitEvent) {
        var _this = this;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this.asyncValidator)) {
            this._status = PENDING;
            this._cancelExistingSubscription();
            var obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription = obs.subscribe({ next: function (res) { return _this.setErrors(res, { emitEvent: emitEvent }); } });
        }
    };
    AbstractControl.prototype._cancelExistingSubscription = function () {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._asyncValidationSubscription)) {
            this._asyncValidationSubscription.unsubscribe();
        }
    };
    /**
     * Sets errors on a form control.
     *
     * This is used when validations are run manually by the user, rather than automatically.
     *
     * Calling `setErrors` will also update the validity of the parent control.
     *
     * ### Example
     *
     * ```
     * const login = new FormControl("someLogin");
     * login.setErrors({
     *   "notUnique": true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({"notUnique": true});
     *
     * login.setValue("someOtherLogin");
     *
     * expect(login.valid).toEqual(true);
     * ```
     */
    AbstractControl.prototype.setErrors = function (errors, _a) {
        var emitEvent = (_a === void 0 ? {} : _a).emitEvent;
        emitEvent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(emitEvent) ? emitEvent : true;
        this._errors = errors;
        this._updateControlsErrors(emitEvent);
    };
    /**
     * Retrieves a child control given the control's name or path.
     *
     * Paths can be passed in as an array or a string delimited by a dot.
     *
     * To get a control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     */
    AbstractControl.prototype.get = function (path) { return _find(this, path, '.'); };
    /**
     * Returns true if the control with the given path has the error specified. Otherwise
     * returns null or undefined.
     *
     * If no path is given, it checks for the error on the present control.
     */
    AbstractControl.prototype.getError = function (errorCode, path) {
        if (path === void 0) { path = null; }
        var control = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(path) && !__WEBPACK_IMPORTED_MODULE_3__facade_collection__["b" /* ListWrapper */].isEmpty(path) ? this.get(path) : this;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(control) && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(control._errors)) {
            return __WEBPACK_IMPORTED_MODULE_3__facade_collection__["a" /* StringMapWrapper */].get(control._errors, errorCode);
        }
        else {
            return null;
        }
    };
    /**
     * Returns true if the control with the given path has the error specified. Otherwise
     * returns false.
     *
     * If no path is given, it checks for the error on the present control.
     */
    AbstractControl.prototype.hasError = function (errorCode, path) {
        if (path === void 0) { path = null; }
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this.getError(errorCode, path));
    };
    Object.defineProperty(AbstractControl.prototype, "root", {
        /**
         * Retrieves the top-level ancestor of this control.
         */
        get: function () {
            var x = this;
            while (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(x._parent)) {
                x = x._parent;
            }
            return x;
        },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    AbstractControl.prototype._updateControlsErrors = function (emitEvent) {
        this._status = this._calculateStatus();
        if (emitEvent) {
            this._statusChanges.emit(this._status);
        }
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent)) {
            this._parent._updateControlsErrors(emitEvent);
        }
    };
    /** @internal */
    AbstractControl.prototype._initObservables = function () {
        this._valueChanges = new __WEBPACK_IMPORTED_MODULE_2__facade_async__["a" /* EventEmitter */]();
        this._statusChanges = new __WEBPACK_IMPORTED_MODULE_2__facade_async__["a" /* EventEmitter */]();
    };
    AbstractControl.prototype._calculateStatus = function () {
        if (this._allControlsDisabled())
            return DISABLED;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._errors))
            return INVALID;
        if (this._anyControlsHaveStatus(PENDING))
            return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
            return INVALID;
        return VALID;
    };
    /** @internal */
    AbstractControl.prototype._anyControlsHaveStatus = function (status) {
        return this._anyControls(function (control) { return control.status == status; });
    };
    /** @internal */
    AbstractControl.prototype._anyControlsDirty = function () {
        return this._anyControls(function (control) { return control.dirty; });
    };
    /** @internal */
    AbstractControl.prototype._anyControlsTouched = function () {
        return this._anyControls(function (control) { return control.touched; });
    };
    /** @internal */
    AbstractControl.prototype._updatePristine = function (_a) {
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._pristine = !this._anyControlsDirty();
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent._updatePristine({ onlySelf: onlySelf });
        }
    };
    /** @internal */
    AbstractControl.prototype._updateTouched = function (_a) {
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._touched = this._anyControlsTouched();
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(this._parent) && !onlySelf) {
            this._parent._updateTouched({ onlySelf: onlySelf });
        }
    };
    /** @internal */
    AbstractControl.prototype._isBoxedValue = function (formState) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["l" /* isStringMap */])(formState) && Object.keys(formState).length === 2 && 'value' in formState &&
            'disabled' in formState;
    };
    /** @internal */
    AbstractControl.prototype._registerOnCollectionChange = function (fn) { this._onCollectionChange = fn; };
    return AbstractControl;
}());
/**
 * @whatItDoes Tracks the value and validation status of an individual form control.
 *
 * It is one of the three fundamental building blocks of Angular forms, along with
 * {@link FormGroup} and {@link FormArray}.
 *
 * @howToUse
 *
 * When instantiating a {@link FormControl}, you can pass in an initial value as the
 * first argument. Example:
 *
 * ```ts
 * const ctrl = new FormControl('some value');
 * console.log(ctrl.value);     // 'some value'
 *```
 *
 * You can also initialize the control with a form state object on instantiation,
 * which includes both the value and whether or not the control is disabled.
 *
 * ```ts
 * const ctrl = new FormControl({value: 'n/a', disabled: true});
 * console.log(ctrl.value);     // 'n/a'
 * console.log(ctrl.status);   // 'DISABLED'
 * ```
 *
 * To include a sync validator (or an array of sync validators) with the control,
 * pass it in as the second argument. Async validators are also supported, but
 * have to be passed in separately as the third arg.
 *
 * ```ts
 * const ctrl = new FormControl('', Validators.required);
 * console.log(ctrl.value);     // ''
 * console.log(ctrl.status);   // 'INVALID'
 * ```
 *
 * See its superclass, {@link AbstractControl}, for more properties and methods.
 *
 * * **npm package**: `@angular/forms`
 *
 * @stable
 */
var FormControl = (function (_super) {
    __extends(FormControl, _super);
    function FormControl(formState, validator, asyncValidator) {
        if (formState === void 0) { formState = null; }
        if (validator === void 0) { validator = null; }
        if (asyncValidator === void 0) { asyncValidator = null; }
        _super.call(this, coerceToValidator(validator), coerceToAsyncValidator(asyncValidator));
        /** @internal */
        this._onChange = [];
        this._applyFormState(formState);
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this._initObservables();
    }
    /**
     * Set the value of the form control to `value`.
     *
     * If `onlySelf` is `true`, this change will only affect the validation of this `FormControl`
     * and not its parent component. This defaults to false.
     *
     * If `emitEvent` is `true`, this
     * change will cause a `valueChanges` event on the `FormControl` to be emitted. This defaults
     * to true (as it falls through to `updateValueAndValidity`).
     *
     * If `emitModelToViewChange` is `true`, the view will be notified about the new value
     * via an `onChange` event. This is the default behavior if `emitModelToViewChange` is not
     * specified.
     *
     * If `emitViewToModelChange` is `true`, an ngModelChange event will be fired to update the
     * model.  This is the default behavior if `emitViewToModelChange` is not specified.
     */
    FormControl.prototype.setValue = function (value, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, onlySelf = _b.onlySelf, emitEvent = _b.emitEvent, emitModelToViewChange = _b.emitModelToViewChange, emitViewToModelChange = _b.emitViewToModelChange;
        emitModelToViewChange = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(emitModelToViewChange) ? emitModelToViewChange : true;
        emitViewToModelChange = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__facade_lang__["a" /* isPresent */])(emitViewToModelChange) ? emitViewToModelChange : true;
        this._value = value;
        if (this._onChange.length && emitModelToViewChange) {
            this._onChange.forEach(function (changeFn) { return changeFn(_this._value, emitViewToModelChange); });
        }
        this.updateValueAndValidity({ onlySelf: onlySelf, emitEvent: emitEvent });
    };
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {@link FormControl.setValue} at this level.
     * It exists for symmetry with {@link FormGroup.patchValue} on `FormGroups` and `FormArrays`,
     * where it does behave differently.
     */
    FormControl.prototype.patchValue = function (value, options) {
        if (options === void 0) { options = {}; }
        this.setValue(value, options);
    };
    /**
     * Resets the form control. This means by default:
     *
     * * it is marked as `pristine`
     * * it is marked as `untouched`
     * * value is set to null
     *
     * You can also reset to a specific form state by passing through a standalone
     * value or a form state object that contains both a value and a disabled state
     * (these are the only two properties that cannot be calculated).
     *
     * Ex:
     *
     * ```ts
     * this.control.reset('Nancy');
     *
     * console.log(this.control.value);  // 'Nancy'
     * ```
     *
     * OR
     *
     * ```
     * this.control.reset({value: 'Nancy', disabled: true});
     *
     * console.log(this.control.value);  // 'Nancy'
     * console.log(this.control.status);  // 'DISABLED'
     * ```
     */
    FormControl.prototype.reset = function (formState, _a) {
        if (formState === void 0) { formState = null; }
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._applyFormState(formState);
        this.markAsPristine({ onlySelf: onlySelf });
        this.markAsUntouched({ onlySelf: onlySelf });
        this.setValue(this._value, { onlySelf: onlySelf });
    };
    /**
     * @internal
     */
    FormControl.prototype._updateValue = function () { };
    /**
     * @internal
     */
    FormControl.prototype._anyControls = function (condition) { return false; };
    /**
     * @internal
     */
    FormControl.prototype._allControlsDisabled = function () { return this.disabled; };
    /**
     * Register a listener for change events.
     */
    FormControl.prototype.registerOnChange = function (fn) { this._onChange.push(fn); };
    /**
     * @internal
     */
    FormControl.prototype._clearChangeFns = function () {
        this._onChange = [];
        this._onDisabledChange = [];
        this._onCollectionChange = function () { };
    };
    /**
     * Register a listener for disabled events.
     */
    FormControl.prototype.registerOnDisabledChange = function (fn) {
        this._onDisabledChange.push(fn);
    };
    /**
     * @internal
     */
    FormControl.prototype._forEachChild = function (cb) { };
    FormControl.prototype._applyFormState = function (formState) {
        if (this._isBoxedValue(formState)) {
            this._value = formState.value;
            formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                this.enable({ onlySelf: true, emitEvent: false });
        }
        else {
            this._value = formState;
        }
    };
    return FormControl;
}(AbstractControl));
/**
 * @whatItDoes Tracks the value and validity state of a group of {@link FormControl}
 * instances.
 *
 * A `FormGroup` aggregates the values of each child {@link FormControl} into one object,
 * with each control name as the key.  It calculates its status by reducing the statuses
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with {@link FormControl} and {@link FormArray}.
 *
 * @howToUse
 *
 * When instantiating a {@link FormGroup}, pass in a collection of child controls as the first
 * argument. The key for each child will be the name under which it is registered.
 *
 * ### Example
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * You can also include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ### Example
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * * **npm package**: `@angular/forms`
 *
 * @stable
 */
var FormGroup = (function (_super) {
    __extends(FormGroup, _super);
    function FormGroup(controls, validator, asyncValidator) {
        if (validator === void 0) { validator = null; }
        if (asyncValidator === void 0) { asyncValidator = null; }
        _super.call(this, validator, asyncValidator);
        this.controls = controls;
        this._initObservables();
        this._setUpControls();
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update value or validity of the control, so for
     * most cases you'll want to use {@link FormGroup.addControl} instead.
     */
    FormGroup.prototype.registerControl = function (name, control) {
        if (this.controls[name])
            return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
    };
    /**
     * Add a control to this group.
     */
    FormGroup.prototype.addControl = function (name, control) {
        this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Remove a control from this group.
     */
    FormGroup.prototype.removeControl = function (name) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(function () { });
        delete (this.controls[name]);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Replace an existing control.
     */
    FormGroup.prototype.setControl = function (name, control) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(function () { });
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * It will return false for disabled controls. If you'd like to check for
     * existence in the group only, use {@link AbstractControl.get} instead.
     */
    FormGroup.prototype.contains = function (controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    };
    /**
     *  Sets the value of the {@link FormGroup}. It accepts an object that matches
     *  the structure of the group, with control names as keys.
     *
     * This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     *  ### Example
     *
     *  ```
     *  const form = new FormGroup({
     *     first: new FormControl(),
     *     last: new FormControl()
     *  });
     *  console.log(form.value);   // {first: null, last: null}
     *
     *  form.setValue({first: 'Nancy', last: 'Drew'});
     *  console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     *
     *  ```
     */
    FormGroup.prototype.setValue = function (value, _a) {
        var _this = this;
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._checkAllValuesPresent(value);
        __WEBPACK_IMPORTED_MODULE_3__facade_collection__["a" /* StringMapWrapper */].forEach(value, function (newValue, name) {
            _this._throwIfControlMissing(name);
            _this.controls[name].setValue(newValue, { onlySelf: true });
        });
        this.updateValueAndValidity({ onlySelf: onlySelf });
    };
    /**
     *  Patches the value of the {@link FormGroup}. It accepts an object with control
     *  names as keys, and will do its best to match the values to the correct controls
     *  in the group.
     *
     *  It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     *  ### Example
     *
     *  ```
     *  const form = new FormGroup({
     *     first: new FormControl(),
     *     last: new FormControl()
     *  });
     *  console.log(form.value);   // {first: null, last: null}
     *
     *  form.patchValue({first: 'Nancy'});
     *  console.log(form.value);   // {first: 'Nancy', last: null}
     *
     *  ```
     */
    FormGroup.prototype.patchValue = function (value, _a) {
        var _this = this;
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        __WEBPACK_IMPORTED_MODULE_3__facade_collection__["a" /* StringMapWrapper */].forEach(value, function (newValue, name) {
            if (_this.controls[name]) {
                _this.controls[name].patchValue(newValue, { onlySelf: true });
            }
        });
        this.updateValueAndValidity({ onlySelf: onlySelf });
    };
    /**
     * Resets the {@link FormGroup}. This means by default:
     *
     * * The group and all descendants are marked `pristine`
     * * The group and all descendants are marked `untouched`
     * * The value of all descendants will be null or null maps
     *
     * You can also reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * can be a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * ### Example
     *
     * ```ts
     * this.form.reset({first: 'name', last; 'last name'});
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * - OR -
     *
     * ```
     * this.form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * console.log(this.form.get('first').status);  // 'DISABLED'
     * ```
     */
    FormGroup.prototype.reset = function (value, _a) {
        if (value === void 0) { value = {}; }
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._forEachChild(function (control, name) {
            control.reset(value[name], { onlySelf: true });
        });
        this.updateValueAndValidity({ onlySelf: onlySelf });
        this._updatePristine({ onlySelf: onlySelf });
        this._updateTouched({ onlySelf: onlySelf });
    };
    /**
     * The aggregate value of the {@link FormGroup}, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the group.
     */
    FormGroup.prototype.getRawValue = function () {
        return this._reduceChildren({}, function (acc, control, name) {
            acc[name] = control.value;
            return acc;
        });
    };
    /** @internal */
    FormGroup.prototype._throwIfControlMissing = function (name) {
        if (!Object.keys(this.controls).length) {
            throw new Error("\n        There are no form controls registered with this group yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
        }
        if (!this.controls[name]) {
            throw new Error("Cannot find form control with name: " + name + ".");
        }
    };
    /** @internal */
    FormGroup.prototype._forEachChild = function (cb) {
        __WEBPACK_IMPORTED_MODULE_3__facade_collection__["a" /* StringMapWrapper */].forEach(this.controls, cb);
    };
    /** @internal */
    FormGroup.prototype._setUpControls = function () {
        var _this = this;
        this._forEachChild(function (control) {
            control.setParent(_this);
            control._registerOnCollectionChange(_this._onCollectionChange);
        });
    };
    /** @internal */
    FormGroup.prototype._updateValue = function () { this._value = this._reduceValue(); };
    /** @internal */
    FormGroup.prototype._anyControls = function (condition) {
        var _this = this;
        var res = false;
        this._forEachChild(function (control, name) {
            res = res || (_this.contains(name) && condition(control));
        });
        return res;
    };
    /** @internal */
    FormGroup.prototype._reduceValue = function () {
        var _this = this;
        return this._reduceChildren({}, function (acc, control, name) {
            if (control.enabled || _this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        });
    };
    /** @internal */
    FormGroup.prototype._reduceChildren = function (initValue, fn) {
        var res = initValue;
        this._forEachChild(function (control, name) { res = fn(res, control, name); });
        return res;
    };
    /** @internal */
    FormGroup.prototype._allControlsDisabled = function () {
        for (var _i = 0, _a = Object.keys(this.controls); _i < _a.length; _i++) {
            var controlName = _a[_i];
            if (this.controls[controlName].enabled) {
                return false;
            }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    };
    /** @internal */
    FormGroup.prototype._checkAllValuesPresent = function (value) {
        this._forEachChild(function (control, name) {
            if (value[name] === undefined) {
                throw new Error("Must supply a value for form control with name: '" + name + "'.");
            }
        });
    };
    return FormGroup;
}(AbstractControl));
/**
 * @whatItDoes Tracks the value and validity state of an array of {@link FormControl}
 * instances.
 *
 * A `FormArray` aggregates the values of each child {@link FormControl} into an array.
 * It calculates its status by reducing the statuses of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with {@link FormControl} and {@link FormGroup}.
 *
 * @howToUse
 *
 * When instantiating a {@link FormArray}, pass in an array of child controls as the first
 * argument.
 *
 * ### Example
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy', Validators.minLength(2)),
 *   new FormControl('Drew'),
 * ]);
 *
 * console.log(arr.value);   // ['Nancy', 'Drew']
 * console.log(arr.status);  // 'VALID'
 * ```
 *
 * You can also include array-level validators as the second arg, or array-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ### Adding or removing controls
 *
 * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that will result in strange and unexpected behavior such
 * as broken change detection.
 *
 * * **npm package**: `@angular/forms`
 *
 * @stable
 */
var FormArray = (function (_super) {
    __extends(FormArray, _super);
    function FormArray(controls, validator, asyncValidator) {
        if (validator === void 0) { validator = null; }
        if (asyncValidator === void 0) { asyncValidator = null; }
        _super.call(this, validator, asyncValidator);
        this.controls = controls;
        this._initObservables();
        this._setUpControls();
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    /**
     * Get the {@link AbstractControl} at the given `index` in the array.
     */
    FormArray.prototype.at = function (index) { return this.controls[index]; };
    /**
     * Insert a new {@link AbstractControl} at the end of the array.
     */
    FormArray.prototype.push = function (control) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Insert a new {@link AbstractControl} at the given `index` in the array.
     */
    FormArray.prototype.insert = function (index, control) {
        __WEBPACK_IMPORTED_MODULE_3__facade_collection__["b" /* ListWrapper */].insert(this.controls, index, control);
        this._registerControl(control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Remove the control at the given `index` in the array.
     */
    FormArray.prototype.removeAt = function (index) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(function () { });
        __WEBPACK_IMPORTED_MODULE_3__facade_collection__["b" /* ListWrapper */].removeAt(this.controls, index);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Replace an existing control.
     */
    FormArray.prototype.setControl = function (index, control) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(function () { });
        __WEBPACK_IMPORTED_MODULE_3__facade_collection__["b" /* ListWrapper */].removeAt(this.controls, index);
        if (control) {
            __WEBPACK_IMPORTED_MODULE_3__facade_collection__["b" /* ListWrapper */].insert(this.controls, index, control);
            this._registerControl(control);
        }
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    Object.defineProperty(FormArray.prototype, "length", {
        /**
         * Length of the control array.
         */
        get: function () { return this.controls.length; },
        enumerable: true,
        configurable: true
    });
    /**
     *  Sets the value of the {@link FormArray}. It accepts an array that matches
     *  the structure of the control.
     *
     * This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     *  ### Example
     *
     *  ```
     *  const arr = new FormArray([
     *     new FormControl(),
     *     new FormControl()
     *  ]);
     *  console.log(arr.value);   // [null, null]
     *
     *  arr.setValue(['Nancy', 'Drew']);
     *  console.log(arr.value);   // ['Nancy', 'Drew']
     *  ```
     */
    FormArray.prototype.setValue = function (value, _a) {
        var _this = this;
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._checkAllValuesPresent(value);
        value.forEach(function (newValue, index) {
            _this._throwIfControlMissing(index);
            _this.at(index).setValue(newValue, { onlySelf: true });
        });
        this.updateValueAndValidity({ onlySelf: onlySelf });
    };
    /**
     *  Patches the value of the {@link FormArray}. It accepts an array that matches the
     *  structure of the control, and will do its best to match the values to the correct
     *  controls in the group.
     *
     *  It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     *  ### Example
     *
     *  ```
     *  const arr = new FormArray([
     *     new FormControl(),
     *     new FormControl()
     *  ]);
     *  console.log(arr.value);   // [null, null]
     *
     *  arr.patchValue(['Nancy']);
     *  console.log(arr.value);   // ['Nancy', null]
     *  ```
     */
    FormArray.prototype.patchValue = function (value, _a) {
        var _this = this;
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        value.forEach(function (newValue, index) {
            if (_this.at(index)) {
                _this.at(index).patchValue(newValue, { onlySelf: true });
            }
        });
        this.updateValueAndValidity({ onlySelf: onlySelf });
    };
    /**
     * Resets the {@link FormArray}. This means by default:
     *
     * * The array and all descendants are marked `pristine`
     * * The array and all descendants are marked `untouched`
     * * The value of all descendants will be null or null maps
     *
     * You can also reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state can be a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * ### Example
     *
     * ```ts
     * this.arr.reset(['name', 'last name']);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * ```
     *
     * - OR -
     *
     * ```
     * this.arr.reset([
     *   {value: 'name', disabled: true},
     *   'last'
     * ]);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * console.log(this.arr.get(0).status);  // 'DISABLED'
     * ```
     */
    FormArray.prototype.reset = function (value, _a) {
        if (value === void 0) { value = []; }
        var onlySelf = (_a === void 0 ? {} : _a).onlySelf;
        this._forEachChild(function (control, index) {
            control.reset(value[index], { onlySelf: true });
        });
        this.updateValueAndValidity({ onlySelf: onlySelf });
        this._updatePristine({ onlySelf: onlySelf });
        this._updateTouched({ onlySelf: onlySelf });
    };
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the array.
     */
    FormArray.prototype.getRawValue = function () { return this.controls.map(function (control) { return control.value; }); };
    /** @internal */
    FormArray.prototype._throwIfControlMissing = function (index) {
        if (!this.controls.length) {
            throw new Error("\n        There are no form controls registered with this array yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
        }
        if (!this.at(index)) {
            throw new Error("Cannot find form control at index " + index);
        }
    };
    /** @internal */
    FormArray.prototype._forEachChild = function (cb) {
        this.controls.forEach(function (control, index) { cb(control, index); });
    };
    /** @internal */
    FormArray.prototype._updateValue = function () {
        var _this = this;
        this._value = this.controls.filter(function (control) { return control.enabled || _this.disabled; })
            .map(function (control) { return control.value; });
    };
    /** @internal */
    FormArray.prototype._anyControls = function (condition) {
        return this.controls.some(function (control) { return control.enabled && condition(control); });
    };
    /** @internal */
    FormArray.prototype._setUpControls = function () {
        var _this = this;
        this._forEachChild(function (control) { return _this._registerControl(control); });
    };
    /** @internal */
    FormArray.prototype._checkAllValuesPresent = function (value) {
        this._forEachChild(function (control, i) {
            if (value[i] === undefined) {
                throw new Error("Must supply a value for form control at index: " + i + ".");
            }
        });
    };
    /** @internal */
    FormArray.prototype._allControlsDisabled = function () {
        for (var _i = 0, _a = this.controls; _i < _a.length; _i++) {
            var control = _a[_i];
            if (control.enabled)
                return false;
        }
        return this.controls.length > 0 || this.disabled;
    };
    FormArray.prototype._registerControl = function (control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
    };
    return FormArray;
}(AbstractControl));
//# sourceMappingURL=model.js.map

/***/ },

/***/ 123:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var ConfigurationService = (function (_super) {
    __extends(ConfigurationService, _super);
    function ConfigurationService(_http) {
        _super.call(this);
        this._http = _http;
        this.GET_URL = "/configuration";
        this.SAVE_URL = "/configuration";
        this.GET_CUSTOM_RULESETS_URL = "/configuration/custom-rulesets";
    }
    ConfigurationService.prototype.save = function (configuration) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = JSON.stringify(configuration);
        return this._http.put(constants_1.Constants.REST_BASE + this.SAVE_URL, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ConfigurationService.prototype.get = function () {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_URL, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ConfigurationService.prototype.getCustomRulesetPaths = function () {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_CUSTOM_RULESETS_URL, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ConfigurationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], ConfigurationService);
    return ConfigurationService;
    var _a;
}(abtract_service_1.AbstractService));
exports.ConfigurationService = ConfigurationService;


/***/ },

/***/ 124:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var FileService = (function (_super) {
    __extends(FileService, _super);
    function FileService(_http) {
        _super.call(this);
        this._http = _http;
        this.PATH_EXISTS_URL = "/file/pathExists";
    }
    FileService.prototype.pathExists = function (path) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return this._http.post(constants_1.Constants.REST_BASE + this.PATH_EXISTS_URL, path, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    FileService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], FileService);
    return FileService;
    var _a;
}(abtract_service_1.AbstractService));
exports.FileService = FileService;


/***/ },

/***/ 125:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var ng2_file_upload_1 = __webpack_require__(127);
var Observable_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var keycloak_service_1 = __webpack_require__(67);
var RegisteredApplicationService = (function (_super) {
    __extends(RegisteredApplicationService, _super);
    function RegisteredApplicationService(_http, _keycloakService, _multipartUploader) {
        _super.call(this);
        this._http = _http;
        this._keycloakService = _keycloakService;
        this._multipartUploader = _multipartUploader;
        this.GET_APPLICATIONS_URL = "/registeredApplications/list";
        this.UNREGISTER_URL = "/registeredApplications/unregister";
        this.UPDATE_APPLICATION_URL = "/registeredApplications/update-application";
        this.REGISTERED_APPLICATIONS_URL = '/registeredApplications';
        this.REGISTER_PATH_URL = "/registeredApplications/register-path/";
        this.REGISTER_DIRECTORY_URL = '/registeredApplications/register-directory-path';
        this.UPLOAD_URL = '/file';
        this._multipartUploader.setOptions({
            url: constants_1.Constants.REST_BASE + this.UPLOAD_URL + '/multipart',
            disableMultipart: false
        });
    }
    RegisteredApplicationService.prototype.updateTitle = function (application) {
        var path = application.inputPath;
        // remove trailing slash if present
        if (path.endsWith("/") || path.endsWith("\\")) {
            path = path.substring(0, path.length - 1);
        }
        if (path.lastIndexOf("/") != -1) {
            application.title = path.substring(path.lastIndexOf("/") + 1);
        }
        else if (path.lastIndexOf("\\") != -1) {
            application.title = path.substring(path.lastIndexOf("\\") + 1);
        }
        application.inputPath = path;
    };
    RegisteredApplicationService.prototype.registerByPath = function (applicationGroupId, path) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var application = {};
        application.inputPath = path;
        this.updateTitle(application);
        var body = JSON.stringify(application);
        var url = constants_1.Constants.REST_BASE + this.REGISTER_PATH_URL + applicationGroupId;
        return this._http.post(url, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    RegisteredApplicationService.prototype.registerApplicationInDirectoryByPath = function (applicationGroupId, path) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = path;
        var url = constants_1.Constants.REST_BASE + this.REGISTER_DIRECTORY_URL + "/" + applicationGroupId;
        return this._http.post(url, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    RegisteredApplicationService.prototype.registerApplication = function (applicationGroupId) {
        var _this = this;
        return this._keycloakService
            .getToken()
            .flatMap(function (token, index) {
            _this._multipartUploader.setOptions({
                authToken: 'Bearer ' + token,
                method: 'POST'
            });
            var responses = [];
            var errors = [];
            var promise = new Promise(function (resolve, reject) {
                _this._multipartUploader.onCompleteItem = function (item, response, status, headers) {
                    if (status == 200) {
                        responses.push(JSON.parse(response));
                    }
                    else {
                        errors.push(JSON.parse(response));
                    }
                };
                _this._multipartUploader.onCompleteAll = function () {
                    resolve(responses);
                };
                _this._multipartUploader.onErrorItem = function (item, response, status, headers) {
                    reject(JSON.parse(response));
                };
            });
            _this._multipartUploader.uploadAll();
            return Observable_1.Observable.fromPromise(promise);
        });
    };
    RegisteredApplicationService.prototype.getMultipartUploader = function () {
        return this._multipartUploader;
    };
    ;
    RegisteredApplicationService.prototype.getApplications = function () {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_APPLICATIONS_URL, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    RegisteredApplicationService.prototype.get = function (id) {
        var url = (constants_1.Constants.REST_BASE + this.REGISTERED_APPLICATIONS_URL) + "/" + id;
        return this._http.get(url)
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    RegisteredApplicationService.prototype.update = function (application) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var options = new http_1.RequestOptions({ headers: headers });
        this.updateTitle(application);
        var body = JSON.stringify(application);
        var url = constants_1.Constants.REST_BASE + this.UPDATE_APPLICATION_URL;
        return this._http.put(url, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    RegisteredApplicationService.prototype.updateByUpload = function (application) {
        var _this = this;
        return this._keycloakService
            .getToken()
            .flatMap(function (token, index) {
            _this._multipartUploader.setOptions({
                authToken: 'Bearer ' + token,
                method: 'PUT'
            });
            var responses = [];
            var errors = [];
            var promise = new Promise(function (resolve, reject) {
                _this._multipartUploader.onCompleteItem = function (item, response, status, headers) {
                    if (status == 200) {
                        responses.push(JSON.parse(response));
                    }
                    else {
                        errors.push(JSON.parse(response));
                    }
                };
                _this._multipartUploader.onCompleteAll = function () {
                    resolve(responses);
                };
                _this._multipartUploader.onErrorItem = function (item, response, status, headers) {
                    reject(JSON.parse(response));
                };
            });
            _this._multipartUploader.uploadAll();
            return Observable_1.Observable.fromPromise(promise);
        });
    };
    RegisteredApplicationService.prototype.unregister = function (application) {
        var url = (constants_1.Constants.REST_BASE + this.UNREGISTER_URL) + "/" + application.id;
        return this._http.delete(url)
            .catch(this.handleError);
    };
    RegisteredApplicationService.prototype.deleteApplication = function (application) {
        var url = (constants_1.Constants.REST_BASE + this.REGISTERED_APPLICATIONS_URL) + "/" + application.id;
        return this._http.delete(url)
            .catch(this.handleError);
    };
    RegisteredApplicationService.REGISTERED_APPLICATION_SERVICE_NAME = "/registeredApplications/";
    RegisteredApplicationService.REGISTER_APPLICATION_URL = "/registeredApplications/appGroup/";
    RegisteredApplicationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object, (typeof (_b = typeof keycloak_service_1.KeycloakService !== 'undefined' && keycloak_service_1.KeycloakService) === 'function' && _b) || Object, (typeof (_c = typeof ng2_file_upload_1.FileUploader !== 'undefined' && ng2_file_upload_1.FileUploader) === 'function' && _c) || Object])
    ], RegisteredApplicationService);
    return RegisteredApplicationService;
    var _a, _b, _c;
}(abtract_service_1.AbstractService));
exports.RegisteredApplicationService = RegisteredApplicationService;


/***/ },

/***/ 127:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(333));
__export(__webpack_require__(331));
__export(__webpack_require__(210));
var file_upload_module_1 = __webpack_require__(532);
exports.FileUploadModule = file_upload_module_1.FileUploadModule;


/***/ },

/***/ 187:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__facade_lang__ = __webpack_require__(21);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AbstractControlDirective; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Base class for control directives.
 *
 * Only used internally in the forms module.
 *
 * @stable
 */
var AbstractControlDirective = (function () {
    function AbstractControlDirective() {
    }
    Object.defineProperty(AbstractControlDirective.prototype, "control", {
        get: function () { throw new Error('unimplemented'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "value", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.value : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "valid", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.valid : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "invalid", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.invalid : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "pending", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.pending : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "errors", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.errors : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "pristine", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.pristine : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "dirty", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.dirty : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "touched", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.touched : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "untouched", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.untouched : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "disabled", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.disabled : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "enabled", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.enabled : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "statusChanges", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.statusChanges : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "valueChanges", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control) ? this.control.valueChanges : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlDirective.prototype, "path", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    AbstractControlDirective.prototype.reset = function (value) {
        if (value === void 0) { value = undefined; }
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__facade_lang__["a" /* isPresent */])(this.control))
            this.control.reset(value);
    };
    return AbstractControlDirective;
}());
//# sourceMappingURL=abstract_control_directive.js.map

/***/ },

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ng_control__ = __webpack_require__(50);
/* unused harmony export AbstractControlStatus */
/* unused harmony export ngControlStatusHost */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgControlStatus; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return NgControlStatusGroup; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




var AbstractControlStatus = (function () {
    function AbstractControlStatus(cd) {
        this._cd = cd;
    }
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassUntouched", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this._cd.control) ? this._cd.control.untouched : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassTouched", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this._cd.control) ? this._cd.control.touched : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPristine", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this._cd.control) ? this._cd.control.pristine : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassDirty", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this._cd.control) ? this._cd.control.dirty : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassValid", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this._cd.control) ? this._cd.control.valid : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassInvalid", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this._cd.control) ? this._cd.control.invalid : false;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractControlStatus;
}());
var ngControlStatusHost = {
    '[class.ng-untouched]': 'ngClassUntouched',
    '[class.ng-touched]': 'ngClassTouched',
    '[class.ng-pristine]': 'ngClassPristine',
    '[class.ng-dirty]': 'ngClassDirty',
    '[class.ng-valid]': 'ngClassValid',
    '[class.ng-invalid]': 'ngClassInvalid'
};
/**
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @stable
 */
var NgControlStatus = (function (_super) {
    __extends(NgControlStatus, _super);
    function NgControlStatus(cd) {
        _super.call(this, cd);
    }
    NgControlStatus.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost },] },
    ];
    /** @nocollapse */
    NgControlStatus.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_3__ng_control__["a" /* NgControl */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] },] },
    ];
    return NgControlStatus;
}(AbstractControlStatus));
/**
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @stable
 */
var NgControlStatusGroup = (function (_super) {
    __extends(NgControlStatusGroup, _super);
    function NgControlStatusGroup(cd) {
        _super.call(this, cd);
    }
    NgControlStatusGroup.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                    host: ngControlStatusHost
                },] },
    ];
    /** @nocollapse */
    NgControlStatusGroup.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_2__control_container__["a" /* ControlContainer */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] },] },
    ];
    return NgControlStatusGroup;
}(AbstractControlStatus));
//# sourceMappingURL=ng_control_status.js.map

/***/ },

/***/ 189:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_async__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__abstract_form_group_directive__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__control_value_accessor__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ng_control__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ng_form__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ng_model_group__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__shared__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__template_driven_errors__ = __webpack_require__(285);
/* unused harmony export formControlBinding */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgModel; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};












var formControlBinding = {
    provide: __WEBPACK_IMPORTED_MODULE_7__ng_control__["a" /* NgControl */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return NgModel; })
};
var resolvedPromise = Promise.resolve(null);
/**
 * @whatItDoes Creates a {@link FormControl} instance from a domain model and binds it
 * to a form control element.
 *
 * The {@link FormControl} instance will track the value, user interaction, and
 * validation status of the control and keep the view synced with the model. If used
 * within a parent form, the directive will also register itself with the form as a child
 * control.
 *
 * @howToUse
 *
 * This directive can be used by itself or as part of a larger form. All you need is the
 * `ngModel` selector to activate it.
 *
 * It accepts a domain model as an optional {@link @Input}. If you have a one-way binding
 * to `ngModel` with `[]` syntax, changing the value of the domain model in the component
 * class will set the value in the view. If you have a two-way binding with `[()]` syntax
 * (also known as 'banana-box syntax'), the value in the UI will always be synced back to
 * the domain model in your class as well.
 *
 * If you wish to inspect the properties of the associated {@link FormControl} (like
 * validity state), you can also export the directive into a local template variable using
 * `ngModel` as the key (ex: `#myVar="ngModel"`). You can then access the control using the
 * directive's `control` property, but most properties you'll need (like `valid` and `dirty`)
 * will fall through to the control anyway, so you can access them directly. You can see a
 * full list of properties directly available in {@link AbstractControlDirective}.
 *
 * The following is an example of a simple standalone control using `ngModel`:
 *
 * {@example forms/ts/simpleNgModel/simple_ng_model_example.ts region='Component'}
 *
 * When using the `ngModel` within `<form>` tags, you'll also need to supply a `name` attribute
 * so that the control can be registered with the parent form under that name.
 *
 * It's worth noting that in the context of a parent form, you often can skip one-way or
 * two-way binding because the parent form will sync the value for you. You can access
 * its properties by exporting it into a local template variable using `ngForm` (ex:
 * `#f="ngForm"`). Then you can pass it where it needs to go on submit.
 *
 * If you do need to populate initial values into your form, using a one-way binding for
 * `ngModel` tends to be sufficient as long as you use the exported form's value rather
 * than the domain model's value on submit.
 *
 * Take a look at an example of using `ngModel` within a form:
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * To see `ngModel` examples with different form control types, see:
 *
 * * Radio buttons: {@link RadioControlValueAccessor}
 * * Selects: {@link SelectControlValueAccessor}
 *
 * **npm package**: `@angular/forms`
 *
 * **NgModule**: `FormsModule`
 *
 *  @stable
 */
var NgModel = (function (_super) {
    __extends(NgModel, _super);
    function NgModel(parent, validators, asyncValidators, valueAccessors) {
        _super.call(this);
        /** @internal */
        this._control = new __WEBPACK_IMPORTED_MODULE_2__model__["b" /* FormControl */]();
        /** @internal */
        this._registered = false;
        this.update = new __WEBPACK_IMPORTED_MODULE_1__facade_async__["a" /* EventEmitter */]();
        this._parent = parent;
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
        this.valueAccessor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__shared__["f" /* selectValueAccessor */])(this, valueAccessors);
    }
    NgModel.prototype.ngOnChanges = function (changes) {
        this._checkForErrors();
        if (!this._registered)
            this._setUpControl();
        if ('isDisabled' in changes) {
            this._updateDisabled(changes);
        }
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__shared__["g" /* isPropertyUpdated */])(changes, this.viewModel)) {
            this._updateValue(this.model);
            this.viewModel = this.model;
        }
    };
    NgModel.prototype.ngOnDestroy = function () { this.formDirective && this.formDirective.removeControl(this); };
    Object.defineProperty(NgModel.prototype, "control", {
        get: function () { return this._control; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgModel.prototype, "path", {
        get: function () {
            return this._parent ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__shared__["a" /* controlPath */])(this.name, this._parent) : [this.name];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgModel.prototype, "formDirective", {
        get: function () { return this._parent ? this._parent.formDirective : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgModel.prototype, "validator", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__shared__["b" /* composeValidators */])(this._rawValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgModel.prototype, "asyncValidator", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__shared__["c" /* composeAsyncValidators */])(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    NgModel.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    };
    NgModel.prototype._setUpControl = function () {
        this._isStandalone() ? this._setUpStandalone() :
            this.formDirective.addControl(this);
        this._registered = true;
    };
    NgModel.prototype._isStandalone = function () {
        return !this._parent || (this.options && this.options.standalone);
    };
    NgModel.prototype._setUpStandalone = function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__shared__["d" /* setUpControl */])(this._control, this);
        this._control.updateValueAndValidity({ emitEvent: false });
    };
    NgModel.prototype._checkForErrors = function () {
        if (!this._isStandalone()) {
            this._checkParentType();
        }
        this._checkName();
    };
    NgModel.prototype._checkParentType = function () {
        if (!(this._parent instanceof __WEBPACK_IMPORTED_MODULE_9__ng_model_group__["a" /* NgModelGroup */]) &&
            this._parent instanceof __WEBPACK_IMPORTED_MODULE_4__abstract_form_group_directive__["a" /* AbstractFormGroupDirective */]) {
            __WEBPACK_IMPORTED_MODULE_11__template_driven_errors__["a" /* TemplateDrivenErrors */].formGroupNameException();
        }
        else if (!(this._parent instanceof __WEBPACK_IMPORTED_MODULE_9__ng_model_group__["a" /* NgModelGroup */]) && !(this._parent instanceof __WEBPACK_IMPORTED_MODULE_8__ng_form__["a" /* NgForm */])) {
            __WEBPACK_IMPORTED_MODULE_11__template_driven_errors__["a" /* TemplateDrivenErrors */].modelParentException();
        }
    };
    NgModel.prototype._checkName = function () {
        if (this.options && this.options.name)
            this.name = this.options.name;
        if (!this._isStandalone() && !this.name) {
            __WEBPACK_IMPORTED_MODULE_11__template_driven_errors__["a" /* TemplateDrivenErrors */].missingNameException();
        }
    };
    NgModel.prototype._updateValue = function (value) {
        var _this = this;
        resolvedPromise.then(function () { _this.control.setValue(value, { emitViewToModelChange: false }); });
    };
    NgModel.prototype._updateDisabled = function (changes) {
        var _this = this;
        var disabledValue = changes['isDisabled'].currentValue;
        var isDisabled = disabledValue === '' || (disabledValue && disabledValue !== 'false');
        resolvedPromise.then(function () {
            if (isDisabled && !_this.control.disabled) {
                _this.control.disable();
            }
            else if (!isDisabled && _this.control.disabled) {
                _this.control.enable();
            }
        });
    };
    NgModel.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[ngModel]:not([formControlName]):not([formControl])',
                    providers: [formControlBinding],
                    exportAs: 'ngModel'
                },] },
    ];
    /** @nocollapse */
    NgModel.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_5__control_container__["a" /* ControlContainer */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Host"] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_3__validators__["b" /* NG_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_3__validators__["c" /* NG_ASYNC_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_6__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],] },] },
    ];
    NgModel.propDecorators = {
        'name': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'isDisabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['disabled',] },],
        'model': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['ngModel',] },],
        'options': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['ngModelOptions',] },],
        'update': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ['ngModelChange',] },],
    };
    return NgModel;
}(__WEBPACK_IMPORTED_MODULE_7__ng_control__["a" /* NgControl */]));
//# sourceMappingURL=ng_model.js.map

/***/ },

/***/ 190:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__control_value_accessor__ = __webpack_require__(32);
/* unused harmony export NUMBER_VALUE_ACCESSOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NumberValueAccessor; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */



var NUMBER_VALUE_ACCESSOR = {
    provide: __WEBPACK_IMPORTED_MODULE_2__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return NumberValueAccessor; }),
    multi: true
};
/**
 * The accessor for writing a number value and listening to changes that is used by the
 * {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName} directives.
 *
 *  ### Example
 *  ```
 *  <input type="number" [(ngModel)]="age">
 *  ```
 */
var NumberValueAccessor = (function () {
    function NumberValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    NumberValueAccessor.prototype.writeValue = function (value) {
        // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
        var normalizedValue = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["b" /* isBlank */])(value) ? '' : value;
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    };
    NumberValueAccessor.prototype.registerOnChange = function (fn) {
        this.onChange = function (value) { fn(value == '' ? null : parseFloat(value)); };
    };
    NumberValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    NumberValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    NumberValueAccessor.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
                    host: {
                        '(change)': 'onChange($event.target.value)',
                        '(input)': 'onChange($event.target.value)',
                        '(blur)': 'onTouched()'
                    },
                    providers: [NUMBER_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    NumberValueAccessor.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    ];
    return NumberValueAccessor;
}());
//# sourceMappingURL=number_value_accessor.js.map

/***/ },

/***/ 191:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_async__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__control_value_accessor__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_control__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__reactive_errors__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared__ = __webpack_require__(46);
/* unused harmony export formControlBinding */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FormControlDirective; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};







var formControlBinding = {
    provide: __WEBPACK_IMPORTED_MODULE_4__ng_control__["a" /* NgControl */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return FormControlDirective; })
};
/**
 * @whatItDoes Syncs a standalone {@link FormControl} instance to a form control element.
 *
 * In other words, this directive ensures that any values written to the {@link FormControl}
 * instance programmatically will be written to the DOM element (model -> view). Conversely,
 * any values written to the DOM element through user input will be reflected in the
 * {@link FormControl} instance (view -> model).
 *
 * @howToUse
 *
 * Use this directive if you'd like to create and manage a {@link FormControl} instance directly.
 * Simply create a {@link FormControl}, save it to your component class, and pass it into the
 * {@link FormControlDirective}.
 *
 * This directive is designed to be used as a standalone control.  Unlike {@link FormControlName},
 * it does not require that your {@link FormControl} instance be part of any parent
 * {@link FormGroup}, and it won't be registered to any {@link FormGroupDirective} that
 * exists above it.
 *
 * **Get the value**: the `value` property is always synced and available on the
 * {@link FormControl} instance. See a full list of available properties in
 * {@link AbstractControl}.
 *
 * **Set the value**: You can pass in an initial value when instantiating the {@link FormControl},
 * or you can set it programmatically later using {@link AbstractControl.setValue} or
 * {@link AbstractControl.patchValue}.
 *
 * **Listen to value**: If you want to listen to changes in the value of the control, you can
 * subscribe to the {@link AbstractControl.valueChanges} event.  You can also listen to
 * {@link AbstractControl.statusChanges} to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * * **npm package**: `@angular/forms`
 *
 * * **NgModule**: `ReactiveFormsModule`
 *
 *  @stable
 */
var FormControlDirective = (function (_super) {
    __extends(FormControlDirective, _super);
    function FormControlDirective(validators, asyncValidators, valueAccessors) {
        _super.call(this);
        this.update = new __WEBPACK_IMPORTED_MODULE_1__facade_async__["a" /* EventEmitter */]();
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
        this.valueAccessor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__shared__["f" /* selectValueAccessor */])(this, valueAccessors);
    }
    Object.defineProperty(FormControlDirective.prototype, "isDisabled", {
        set: function (isDisabled) { __WEBPACK_IMPORTED_MODULE_5__reactive_errors__["a" /* ReactiveErrors */].disabledAttrWarning(); },
        enumerable: true,
        configurable: true
    });
    FormControlDirective.prototype.ngOnChanges = function (changes) {
        if (this._isControlChanged(changes)) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__shared__["d" /* setUpControl */])(this.form, this);
            if (this.control.disabled && this.valueAccessor.setDisabledState) {
                this.valueAccessor.setDisabledState(true);
            }
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__shared__["g" /* isPropertyUpdated */])(changes, this.viewModel)) {
            this.form.setValue(this.model);
            this.viewModel = this.model;
        }
    };
    Object.defineProperty(FormControlDirective.prototype, "path", {
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "validator", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__shared__["b" /* composeValidators */])(this._rawValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "asyncValidator", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__shared__["c" /* composeAsyncValidators */])(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlDirective.prototype, "control", {
        get: function () { return this.form; },
        enumerable: true,
        configurable: true
    });
    FormControlDirective.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    };
    FormControlDirective.prototype._isControlChanged = function (changes) {
        return changes.hasOwnProperty('form');
    };
    FormControlDirective.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: '[formControl]', providers: [formControlBinding], exportAs: 'ngForm' },] },
    ];
    /** @nocollapse */
    FormControlDirective.ctorParameters = [
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__validators__["b" /* NG_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__validators__["c" /* NG_ASYNC_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_3__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],] },] },
    ];
    FormControlDirective.propDecorators = {
        'form': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['formControl',] },],
        'model': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['ngModel',] },],
        'update': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ['ngModelChange',] },],
        'isDisabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['disabled',] },],
    };
    return FormControlDirective;
}(__WEBPACK_IMPORTED_MODULE_4__ng_control__["a" /* NgControl */]));
//# sourceMappingURL=form_control_directive.js.map

/***/ },

/***/ 192:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_async__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__abstract_form_group_directive__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__control_value_accessor__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ng_control__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__reactive_errors__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__shared__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__form_group_directive__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__form_group_name__ = __webpack_require__(79);
/* unused harmony export controlNameBinding */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FormControlName; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};











var controlNameBinding = {
    provide: __WEBPACK_IMPORTED_MODULE_6__ng_control__["a" /* NgControl */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return FormControlName; })
};
/**
 * @whatItDoes  Syncs a {@link FormControl} in an existing {@link FormGroup} to a form control
 * element by name.
 *
 * In other words, this directive ensures that any values written to the {@link FormControl}
 * instance programmatically will be written to the DOM element (model -> view). Conversely,
 * any values written to the DOM element through user input will be reflected in the
 * {@link FormControl} instance (view -> model).
 *
 * @howToUse
 *
 * This directive is designed to be used with a parent {@link FormGroupDirective} (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the {@link FormControl} instance you want to
 * link, and will look for a {@link FormControl} registered with that name in the
 * closest {@link FormGroup} or {@link FormArray} above it.
 *
 * **Access the control**: You can access the {@link FormControl} associated with
 * this directive by using the {@link AbstractControl.get} method.
 * Ex: `this.form.get('first');`
 *
 * **Get value**: the `value` property is always synced and available on the {@link FormControl}.
 * See a full list of available properties in {@link AbstractControl}.
 *
 *  **Set value**: You can set an initial value for the control when instantiating the
 *  {@link FormControl}, or you can set it programmatically later using
 *  {@link AbstractControl.setValue} or {@link AbstractControl.patchValue}.
 *
 * **Listen to value**: If you want to listen to changes in the value of the control, you can
 * subscribe to the {@link AbstractControl.valueChanges} event.  You can also listen to
 * {@link AbstractControl.statusChanges} to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * In this example, we create form controls for first name and last name.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: {@link RadioControlValueAccessor}
 * * Selects: {@link SelectControlValueAccessor}
 *
 * **npm package**: `@angular/forms`
 *
 * **NgModule**: {@link ReactiveFormsModule}
 *
 *  @stable
 */
var FormControlName = (function (_super) {
    __extends(FormControlName, _super);
    function FormControlName(parent, validators, asyncValidators, valueAccessors) {
        _super.call(this);
        this._added = false;
        this.update = new __WEBPACK_IMPORTED_MODULE_1__facade_async__["a" /* EventEmitter */]();
        this._parent = parent;
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
        this.valueAccessor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__shared__["f" /* selectValueAccessor */])(this, valueAccessors);
    }
    Object.defineProperty(FormControlName.prototype, "isDisabled", {
        set: function (isDisabled) { __WEBPACK_IMPORTED_MODULE_7__reactive_errors__["a" /* ReactiveErrors */].disabledAttrWarning(); },
        enumerable: true,
        configurable: true
    });
    FormControlName.prototype.ngOnChanges = function (changes) {
        if (!this._added)
            this._setUpControl();
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__shared__["g" /* isPropertyUpdated */])(changes, this.viewModel)) {
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    };
    FormControlName.prototype.ngOnDestroy = function () {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
    };
    FormControlName.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    };
    Object.defineProperty(FormControlName.prototype, "path", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__shared__["a" /* controlPath */])(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "formDirective", {
        get: function () { return this._parent ? this._parent.formDirective : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "validator", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__shared__["b" /* composeValidators */])(this._rawValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "asyncValidator", {
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__shared__["c" /* composeAsyncValidators */])(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "control", {
        get: function () { return this._control; },
        enumerable: true,
        configurable: true
    });
    FormControlName.prototype._checkParentType = function () {
        if (!(this._parent instanceof __WEBPACK_IMPORTED_MODULE_10__form_group_name__["a" /* FormGroupName */]) &&
            this._parent instanceof __WEBPACK_IMPORTED_MODULE_3__abstract_form_group_directive__["a" /* AbstractFormGroupDirective */]) {
            __WEBPACK_IMPORTED_MODULE_7__reactive_errors__["a" /* ReactiveErrors */].ngModelGroupException();
        }
        else if (!(this._parent instanceof __WEBPACK_IMPORTED_MODULE_10__form_group_name__["a" /* FormGroupName */]) && !(this._parent instanceof __WEBPACK_IMPORTED_MODULE_9__form_group_directive__["a" /* FormGroupDirective */]) &&
            !(this._parent instanceof __WEBPACK_IMPORTED_MODULE_10__form_group_name__["b" /* FormArrayName */])) {
            __WEBPACK_IMPORTED_MODULE_7__reactive_errors__["a" /* ReactiveErrors */].controlParentException();
        }
    };
    FormControlName.prototype._setUpControl = function () {
        this._checkParentType();
        this._control = this.formDirective.addControl(this);
        if (this.control.disabled && this.valueAccessor.setDisabledState) {
            this.valueAccessor.setDisabledState(true);
        }
        this._added = true;
    };
    FormControlName.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: '[formControlName]', providers: [controlNameBinding] },] },
    ];
    /** @nocollapse */
    FormControlName.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_4__control_container__["a" /* ControlContainer */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Host"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__validators__["b" /* NG_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__validators__["c" /* NG_ASYNC_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_5__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],] },] },
    ];
    FormControlName.propDecorators = {
        'name': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['formControlName',] },],
        'model': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['ngModel',] },],
        'update': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ['ngModelChange',] },],
        'isDisabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['disabled',] },],
    };
    return FormControlName;
}(__WEBPACK_IMPORTED_MODULE_6__ng_control__["a" /* NgControl */]));
//# sourceMappingURL=form_control_name.js.map

/***/ },

/***/ 193:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__validators__ = __webpack_require__(33);
/* unused harmony export REQUIRED_VALIDATOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return RequiredValidator; });
/* unused harmony export MIN_LENGTH_VALIDATOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return MinLengthValidator; });
/* unused harmony export MAX_LENGTH_VALIDATOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return MaxLengthValidator; });
/* unused harmony export PATTERN_VALIDATOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "d", function() { return PatternValidator; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */



var REQUIRED_VALIDATOR = {
    provide: __WEBPACK_IMPORTED_MODULE_2__validators__["b" /* NG_VALIDATORS */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return RequiredValidator; }),
    multi: true
};
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the {@link NG_VALIDATORS} binding.
 *
 * ### Example
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @stable
 */
var RequiredValidator = (function () {
    function RequiredValidator() {
    }
    Object.defineProperty(RequiredValidator.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) {
            this._required = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(value) && "" + value !== 'false';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    RequiredValidator.prototype.validate = function (c) {
        return this.required ? __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].required(c) : null;
    };
    RequiredValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    RequiredValidator.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[required][formControlName],[required][formControl],[required][ngModel]',
                    providers: [REQUIRED_VALIDATOR],
                    host: { '[attr.required]': 'required? "" : null' }
                },] },
    ];
    /** @nocollapse */
    RequiredValidator.ctorParameters = [];
    RequiredValidator.propDecorators = {
        'required': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return RequiredValidator;
}());
/**
 * Provider which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
var MIN_LENGTH_VALIDATOR = {
    provide: __WEBPACK_IMPORTED_MODULE_2__validators__["b" /* NG_VALIDATORS */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return MinLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the {@link MinLengthValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 * @stable
 */
var MinLengthValidator = (function () {
    function MinLengthValidator() {
    }
    MinLengthValidator.prototype._createValidator = function () {
        this._validator = __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].minLength(parseInt(this.minlength, 10));
    };
    MinLengthValidator.prototype.ngOnChanges = function (changes) {
        if (changes['minlength']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MinLengthValidator.prototype.validate = function (c) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this.minlength) ? this._validator(c) : null;
    };
    MinLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MinLengthValidator.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                    providers: [MIN_LENGTH_VALIDATOR],
                    host: { '[attr.minlength]': 'minlength? minlength : null' }
                },] },
    ];
    /** @nocollapse */
    MinLengthValidator.ctorParameters = [];
    MinLengthValidator.propDecorators = {
        'minlength': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return MinLengthValidator;
}());
/**
 * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
var MAX_LENGTH_VALIDATOR = {
    provide: __WEBPACK_IMPORTED_MODULE_2__validators__["b" /* NG_VALIDATORS */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return MaxLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the {@link MaxLengthValidator} for any `formControlName,
 * `formControl`,
 * or control with `ngModel` that also has a `maxlength` attribute.
 *
 * @stable
 */
var MaxLengthValidator = (function () {
    function MaxLengthValidator() {
    }
    MaxLengthValidator.prototype._createValidator = function () {
        this._validator = __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].maxLength(parseInt(this.maxlength, 10));
    };
    MaxLengthValidator.prototype.ngOnChanges = function (changes) {
        if (changes['maxlength']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MaxLengthValidator.prototype.validate = function (c) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this.maxlength) ? this._validator(c) : null;
    };
    MaxLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MaxLengthValidator.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                    providers: [MAX_LENGTH_VALIDATOR],
                    host: { '[attr.maxlength]': 'maxlength? maxlength : null' }
                },] },
    ];
    /** @nocollapse */
    MaxLengthValidator.ctorParameters = [];
    MaxLengthValidator.propDecorators = {
        'maxlength': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return MaxLengthValidator;
}());
var PATTERN_VALIDATOR = {
    provide: __WEBPACK_IMPORTED_MODULE_2__validators__["b" /* NG_VALIDATORS */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return PatternValidator; }),
    multi: true
};
/**
 * A Directive that adds the `pattern` validator to any controls marked with the
 * `pattern` attribute, via the {@link NG_VALIDATORS} binding. Uses attribute value
 * as the regex to validate Control value against.  Follows pattern attribute
 * semantics; i.e. regex must match entire Control value.
 *
 * ### Example
 *
 * ```
 * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
 * ```
 * @stable
 */
var PatternValidator = (function () {
    function PatternValidator() {
    }
    PatternValidator.prototype._createValidator = function () { this._validator = __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].pattern(this.pattern); };
    PatternValidator.prototype.ngOnChanges = function (changes) {
        if (changes['pattern']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    PatternValidator.prototype.validate = function (c) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(this.pattern) ? this._validator(c) : null;
    };
    PatternValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    PatternValidator.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                    providers: [PATTERN_VALIDATOR],
                    host: { '[attr.pattern]': 'pattern? pattern : null' }
                },] },
    ];
    /** @nocollapse */
    PatternValidator.ctorParameters = [];
    PatternValidator.propDecorators = {
        'pattern': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return PatternValidator;
}());
//# sourceMappingURL=validators.js.map

/***/ },

/***/ 205:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var forms_1 = __webpack_require__(74);
var router_1 = __webpack_require__(30);
var registeredapplication_service_1 = __webpack_require__(125);
var file_exists_validator_1 = __webpack_require__(208);
var file_service_1 = __webpack_require__(124);
var applicationgroup_service_1 = __webpack_require__(62);
var formcomponent_component_1 = __webpack_require__(82);
var constants_1 = __webpack_require__(23);
var RegisterApplicationFormComponent = (function (_super) {
    __extends(RegisterApplicationFormComponent, _super);
    function RegisterApplicationFormComponent(_router, _activatedRoute, _fileService, _registeredApplicationService, _applicationGroupService, _formBuilder) {
        _super.call(this);
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this._fileService = _fileService;
        this._registeredApplicationService = _registeredApplicationService;
        this._applicationGroupService = _applicationGroupService;
        this._formBuilder = _formBuilder;
        this.loading = true;
        this.mode = "UPLOADED";
        this.isMultiple = true;
        this.isDirectory = false;
        this.labels = {
            heading: 'Register Application',
            submitButton: 'Register'
        };
        this.multipartUploader = _registeredApplicationService.getMultipartUploader();
    }
    RegisterApplicationFormComponent.prototype.modeChanged = function (newMode) {
        this.mode = newMode;
    };
    RegisterApplicationFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.registrationForm = this._formBuilder.group({
            inputPath: ["", forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)]), file_exists_validator_1.FileExistsValidator.create(this._fileService)],
            isDirectory: []
        });
        this._activatedRoute.params.subscribe(function (params) {
            var id = parseInt(params["groupID"]);
            if (!isNaN(id)) {
                _this.loading = true;
                _this._applicationGroupService.get(id).subscribe(function (group) {
                    _this.applicationGroup = group;
                    _this.loading = false;
                    _this.multipartUploader.setOptions({
                        url: constants_1.Constants.REST_BASE + registeredapplication_service_1.RegisteredApplicationService.REGISTER_APPLICATION_URL + group.id,
                        method: 'POST',
                        disableMultipart: false
                    });
                });
            }
            else {
                _this.loading = false;
            }
        });
    };
    RegisterApplicationFormComponent.prototype.registerByPath = function () {
        var _this = this;
        console.log("Registering path: " + this.fileInputPath);
        if (this.isDirectory) {
            this._registeredApplicationService.registerApplicationInDirectoryByPath(this.applicationGroup.id, this.fileInputPath)
                .subscribe(function (application) { return _this.rerouteToApplicationList(); }, function (error) { return _this.handleError(error); });
        }
        else {
            this._registeredApplicationService.registerByPath(this.applicationGroup.id, this.fileInputPath).subscribe(function (application) { return _this.rerouteToApplicationList(); }, function (error) { return _this.handleError(error); });
        }
    };
    RegisterApplicationFormComponent.prototype.register = function () {
        var _this = this;
        if (this.mode == "PATH") {
            this.registerByPath();
        }
        else {
            if (this.multipartUploader.getNotUploadedItems().length > 0) {
                this._registeredApplicationService.registerApplication(this.applicationGroup.id).subscribe(function (application) { return _this.rerouteToApplicationList(); }, function (error) { return _this.handleError(error); });
            }
            else {
                this.handleError("Please select file first");
            }
            return false;
        }
    };
    RegisterApplicationFormComponent.prototype.rerouteToApplicationList = function () {
        this.multipartUploader.clearQueue();
        if (this.applicationGroup != null)
            this._router.navigate(['/group-list', { projectID: this.applicationGroup.migrationProject.id }]);
        else
            this._router.navigate(['/application-list']);
    };
    RegisterApplicationFormComponent.prototype.cancelRegistration = function () {
        this.rerouteToApplicationList();
    };
    RegisterApplicationFormComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(327)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object, (typeof (_c = typeof file_service_1.FileService !== 'undefined' && file_service_1.FileService) === 'function' && _c) || Object, (typeof (_d = typeof registeredapplication_service_1.RegisteredApplicationService !== 'undefined' && registeredapplication_service_1.RegisteredApplicationService) === 'function' && _d) || Object, (typeof (_e = typeof applicationgroup_service_1.ApplicationGroupService !== 'undefined' && applicationgroup_service_1.ApplicationGroupService) === 'function' && _e) || Object, (typeof (_f = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _f) || Object])
    ], RegisterApplicationFormComponent);
    return RegisterApplicationFormComponent;
    var _a, _b, _c, _d, _e, _f;
}(formcomponent_component_1.FormComponent));
exports.RegisterApplicationFormComponent = RegisterApplicationFormComponent;


/***/ },

/***/ 206:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var ConfigurationOptionsService = (function (_super) {
    __extends(ConfigurationOptionsService, _super);
    function ConfigurationOptionsService(_http) {
        _super.call(this);
        this._http = _http;
        this.GET_CONFIGURATION_OPTIONS_URL = "/configuration-options";
        this.VALIDATE_OPTION_URL = this.GET_CONFIGURATION_OPTIONS_URL + "/validate-option";
    }
    ConfigurationOptionsService.prototype.validate = function (option) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = JSON.stringify(option);
        return this._http.post(constants_1.Constants.REST_BASE + this.VALIDATE_OPTION_URL, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ConfigurationOptionsService.prototype.getAll = function () {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_CONFIGURATION_OPTIONS_URL, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ConfigurationOptionsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], ConfigurationOptionsService);
    return ConfigurationOptionsService;
    var _a;
}(abtract_service_1.AbstractService));
exports.ConfigurationOptionsService = ConfigurationOptionsService;


/***/ },

/***/ 207:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var notification_1 = __webpack_require__(324);
var Subject_1 = __webpack_require__(8);
var NotificationService = (function () {
    function NotificationService() {
        this._notifications = new Subject_1.Subject();
    }
    NotificationService.prototype.error = function (message) {
        this._notifications.next(new notification_1.Notification(message, notification_1.NotificationLevel.ERROR));
    };
    NotificationService.prototype.warning = function (message) {
        this._notifications.next(new notification_1.Notification(message, notification_1.NotificationLevel.ERROR));
    };
    NotificationService.prototype.info = function (message) {
        this._notifications.next(new notification_1.Notification(message, notification_1.NotificationLevel.ERROR));
    };
    NotificationService.prototype.notice = function (message) {
        this._notifications.next(new notification_1.Notification(message, notification_1.NotificationLevel.ERROR));
    };
    NotificationService.prototype.success = function (message) {
        this._notifications.next(new notification_1.Notification(message, notification_1.NotificationLevel.ERROR));
    };
    NotificationService.prototype.notification = function (notification) {
        this._notifications.next(notification);
    };
    Object.defineProperty(NotificationService.prototype, "notifications", {
        get: function () {
            return this._notifications.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    NotificationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], NotificationService);
    return NotificationService;
}());
exports.NotificationService = NotificationService;


/***/ },

/***/ 208:
/***/ function(module, exports) {

"use strict";
"use strict";
var FileExistsValidator = (function () {
    function FileExistsValidator() {
    }
    FileExistsValidator.create = function (fileService) {
        return function (c) {
            return new Promise(function (resolve) {
                fileService.pathExists(c.value).subscribe(function (result) {
                    if (result)
                        resolve(null);
                    else
                        resolve({ fileExists: false });
                });
            });
        };
    };
    ;
    return FileExistsValidator;
}());
exports.FileExistsValidator = FileExistsValidator;


/***/ },

/***/ 209:
/***/ function(module, exports) {

"use strict";
// Generated using typescript-generator version 1.10.212 on 2016-10-14 14:03:09.
"use strict";


/***/ },

/***/ 21:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* unused harmony export scheduleMicroTask */
/* unused harmony export global */
/* unused harmony export getTypeNameForDebugging */
/* unused harmony export Math */
/* unused harmony export Date */
/* harmony export (immutable) */ exports["a"] = isPresent;
/* harmony export (immutable) */ exports["b"] = isBlank;
/* unused harmony export isBoolean */
/* unused harmony export isNumber */
/* harmony export (immutable) */ exports["f"] = isString;
/* unused harmony export isFunction */
/* unused harmony export isType */
/* harmony export (immutable) */ exports["l"] = isStringMap;
/* unused harmony export isStrictStringMap */
/* harmony export (immutable) */ exports["c"] = isArray;
/* unused harmony export isDate */
/* unused harmony export noop */
/* unused harmony export stringify */
/* unused harmony export serializeEnum */
/* unused harmony export deserializeEnum */
/* unused harmony export resolveEnumToken */
/* harmony export (binding) */ __webpack_require__.d(exports, "h", function() { return StringWrapper; });
/* unused harmony export StringJoiner */
/* unused harmony export NumberWrapper */
/* unused harmony export RegExp */
/* unused harmony export FunctionWrapper */
/* harmony export (immutable) */ exports["i"] = looseIdentical;
/* unused harmony export getMapKey */
/* unused harmony export normalizeBlank */
/* harmony export (immutable) */ exports["k"] = normalizeBool;
/* harmony export (immutable) */ exports["d"] = isJsObject;
/* unused harmony export print */
/* unused harmony export warn */
/* unused harmony export Json */
/* unused harmony export DateWrapper */
/* unused harmony export setValueOnPath */
/* harmony export (immutable) */ exports["e"] = getSymbolIterator;
/* unused harmony export evalExpression */
/* harmony export (immutable) */ exports["g"] = isPrimitive;
/* harmony export (immutable) */ exports["j"] = hasConstructor;
/* unused harmony export escape */
/* unused harmony export escapeRegExp */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var globalScope;
if (typeof window === 'undefined') {
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        // TODO: Replace any with WorkerGlobalScope from lib.webworker.d.ts #3492
        globalScope = self;
    }
    else {
        globalScope = global;
    }
}
else {
    globalScope = window;
}
function scheduleMicroTask(fn) {
    Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
}
// Need to declare a new variable for global here since TypeScript
// exports the original value of the symbol.
var _global = globalScope;

function getTypeNameForDebugging(type) {
    if (type['name']) {
        return type['name'];
    }
    return typeof type;
}
var Math = _global.Math;
var Date = _global.Date;
// TODO: remove calls to assert in production environment
// Note: Can't just export this and import in in other files
// as `assert` is a reserved keyword in Dart
_global.assert = function assert(condition) {
    // TODO: to be fixed properly via #2830, noop for now
};
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
function isBlank(obj) {
    return obj === undefined || obj === null;
}
function isBoolean(obj) {
    return typeof obj === 'boolean';
}
function isNumber(obj) {
    return typeof obj === 'number';
}
function isString(obj) {
    return typeof obj === 'string';
}
function isFunction(obj) {
    return typeof obj === 'function';
}
function isType(obj) {
    return isFunction(obj);
}
function isStringMap(obj) {
    return typeof obj === 'object' && obj !== null;
}
var STRING_MAP_PROTO = Object.getPrototypeOf({});
function isStrictStringMap(obj) {
    return isStringMap(obj) && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}
function isArray(obj) {
    return Array.isArray(obj);
}
function isDate(obj) {
    return obj instanceof Date && !isNaN(obj.valueOf());
}
function noop() { }
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token === undefined || token === null) {
        return '' + token;
    }
    if (token.overriddenName) {
        return token.overriddenName;
    }
    if (token.name) {
        return token.name;
    }
    var res = token.toString();
    var newLineIndex = res.indexOf('\n');
    return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}
// serialize / deserialize enum exist only for consistency with dart API
// enums in typescript don't need to be serialized
function serializeEnum(val) {
    return val;
}
function deserializeEnum(val, values) {
    return val;
}
function resolveEnumToken(enumValue, val) {
    return enumValue[val];
}
var StringWrapper = (function () {
    function StringWrapper() {
    }
    StringWrapper.fromCharCode = function (code) { return String.fromCharCode(code); };
    StringWrapper.charCodeAt = function (s, index) { return s.charCodeAt(index); };
    StringWrapper.split = function (s, regExp) { return s.split(regExp); };
    StringWrapper.equals = function (s, s2) { return s === s2; };
    StringWrapper.stripLeft = function (s, charVal) {
        if (s && s.length) {
            var pos = 0;
            for (var i = 0; i < s.length; i++) {
                if (s[i] != charVal)
                    break;
                pos++;
            }
            s = s.substring(pos);
        }
        return s;
    };
    StringWrapper.stripRight = function (s, charVal) {
        if (s && s.length) {
            var pos = s.length;
            for (var i = s.length - 1; i >= 0; i--) {
                if (s[i] != charVal)
                    break;
                pos--;
            }
            s = s.substring(0, pos);
        }
        return s;
    };
    StringWrapper.replace = function (s, from, replace) {
        return s.replace(from, replace);
    };
    StringWrapper.replaceAll = function (s, from, replace) {
        return s.replace(from, replace);
    };
    StringWrapper.slice = function (s, from, to) {
        if (from === void 0) { from = 0; }
        if (to === void 0) { to = null; }
        return s.slice(from, to === null ? undefined : to);
    };
    StringWrapper.replaceAllMapped = function (s, from, cb) {
        return s.replace(from, function () {
            var matches = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                matches[_i - 0] = arguments[_i];
            }
            // Remove offset & string from the result array
            matches.splice(-2, 2);
            // The callback receives match, p1, ..., pn
            return cb(matches);
        });
    };
    StringWrapper.contains = function (s, substr) { return s.indexOf(substr) != -1; };
    StringWrapper.compare = function (a, b) {
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    };
    return StringWrapper;
}());
var StringJoiner = (function () {
    function StringJoiner(parts) {
        if (parts === void 0) { parts = []; }
        this.parts = parts;
    }
    StringJoiner.prototype.add = function (part) { this.parts.push(part); };
    StringJoiner.prototype.toString = function () { return this.parts.join(''); };
    return StringJoiner;
}());
var NumberWrapper = (function () {
    function NumberWrapper() {
    }
    NumberWrapper.toFixed = function (n, fractionDigits) { return n.toFixed(fractionDigits); };
    NumberWrapper.equal = function (a, b) { return a === b; };
    NumberWrapper.parseIntAutoRadix = function (text) {
        var result = parseInt(text);
        if (isNaN(result)) {
            throw new Error('Invalid integer literal when parsing ' + text);
        }
        return result;
    };
    NumberWrapper.parseInt = function (text, radix) {
        if (radix == 10) {
            if (/^(\-|\+)?[0-9]+$/.test(text)) {
                return parseInt(text, radix);
            }
        }
        else if (radix == 16) {
            if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
                return parseInt(text, radix);
            }
        }
        else {
            var result = parseInt(text, radix);
            if (!isNaN(result)) {
                return result;
            }
        }
        throw new Error('Invalid integer literal when parsing ' + text + ' in base ' + radix);
    };
    Object.defineProperty(NumberWrapper, "NaN", {
        get: function () { return NaN; },
        enumerable: true,
        configurable: true
    });
    NumberWrapper.isNumeric = function (value) { return !isNaN(value - parseFloat(value)); };
    NumberWrapper.isNaN = function (value) { return isNaN(value); };
    NumberWrapper.isInteger = function (value) { return Number.isInteger(value); };
    return NumberWrapper;
}());
var RegExp = _global.RegExp;
var FunctionWrapper = (function () {
    function FunctionWrapper() {
    }
    FunctionWrapper.apply = function (fn, posArgs) { return fn.apply(null, posArgs); };
    FunctionWrapper.bind = function (fn, scope) { return fn.bind(scope); };
    return FunctionWrapper;
}());
// JS has NaN !== NaN
function looseIdentical(a, b) {
    return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}
// JS considers NaN is the same as NaN for map Key (while NaN !== NaN otherwise)
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
function getMapKey(value) {
    return value;
}
function normalizeBlank(obj) {
    return isBlank(obj) ? null : obj;
}
function normalizeBool(obj) {
    return isBlank(obj) ? false : obj;
}
function isJsObject(o) {
    return o !== null && (typeof o === 'function' || typeof o === 'object');
}
function print(obj) {
    console.log(obj);
}
function warn(obj) {
    console.warn(obj);
}
// Can't be all uppercase as our transpiler would think it is a special directive...
var Json = (function () {
    function Json() {
    }
    Json.parse = function (s) { return _global.JSON.parse(s); };
    Json.stringify = function (data) {
        // Dart doesn't take 3 arguments
        return _global.JSON.stringify(data, null, 2);
    };
    return Json;
}());
var DateWrapper = (function () {
    function DateWrapper() {
    }
    DateWrapper.create = function (year, month, day, hour, minutes, seconds, milliseconds) {
        if (month === void 0) { month = 1; }
        if (day === void 0) { day = 1; }
        if (hour === void 0) { hour = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        if (milliseconds === void 0) { milliseconds = 0; }
        return new Date(year, month - 1, day, hour, minutes, seconds, milliseconds);
    };
    DateWrapper.fromISOString = function (str) { return new Date(str); };
    DateWrapper.fromMillis = function (ms) { return new Date(ms); };
    DateWrapper.toMillis = function (date) { return date.getTime(); };
    DateWrapper.now = function () { return new Date(); };
    DateWrapper.toJson = function (date) { return date.toJSON(); };
    return DateWrapper;
}());
function setValueOnPath(global, path, value) {
    var parts = path.split('.');
    var obj = global;
    while (parts.length > 1) {
        var name = parts.shift();
        if (obj.hasOwnProperty(name) && isPresent(obj[name])) {
            obj = obj[name];
        }
        else {
            obj = obj[name] = {};
        }
    }
    if (obj === undefined || obj === null) {
        obj = {};
    }
    obj[parts.shift()] = value;
}
var _symbolIterator = null;
function getSymbolIterator() {
    if (isBlank(_symbolIterator)) {
        if (isPresent(globalScope.Symbol) && isPresent(Symbol.iterator)) {
            _symbolIterator = Symbol.iterator;
        }
        else {
            // es6-shim specific logic
            var keys = Object.getOwnPropertyNames(Map.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (key !== 'entries' && key !== 'size' &&
                    Map.prototype[key] === Map.prototype['entries']) {
                    _symbolIterator = key;
                }
            }
        }
    }
    return _symbolIterator;
}
function evalExpression(sourceUrl, expr, declarations, vars) {
    var fnBody = declarations + "\nreturn " + expr + "\n//# sourceURL=" + sourceUrl;
    var fnArgNames = [];
    var fnArgValues = [];
    for (var argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
    }
    return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
}
function isPrimitive(obj) {
    return !isJsObject(obj);
}
function hasConstructor(value, type) {
    return value.constructor === type;
}
function escape(s) {
    return _global.encodeURI(s);
}
function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
//# sourceMappingURL=lang.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)))

/***/ },

/***/ 210:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var file_like_object_class_1 = __webpack_require__(332);
var file_item_class_1 = __webpack_require__(530);
var file_type_class_1 = __webpack_require__(531);
function isFile(value) {
    return (File && value instanceof File);
}
var FileUploader = (function () {
    function FileUploader(options) {
        this.isUploading = false;
        this.queue = [];
        this.progress = 0;
        this._nextIndex = 0;
        this.options = {
            autoUpload: false,
            isHTML5: true,
            filters: [],
            removeAfterUpload: false,
            disableMultipart: false
        };
        this.setOptions(options);
    }
    FileUploader.prototype.setOptions = function (options) {
        this.options = Object.assign(this.options, options);
        this.authToken = options.authToken;
        this.autoUpload = options.autoUpload;
        this.options.filters.unshift({ name: 'queueLimit', fn: this._queueLimitFilter });
        if (this.options.maxFileSize) {
            this.options.filters.unshift({ name: 'fileSize', fn: this._fileSizeFilter });
        }
        if (this.options.allowedFileType) {
            this.options.filters.unshift({ name: 'fileType', fn: this._fileTypeFilter });
        }
        if (this.options.allowedMimeType) {
            this.options.filters.unshift({ name: 'mimeType', fn: this._mimeTypeFilter });
        }
        // this.options.filters.unshift({name: 'folder', fn: this._folderFilter});
    };
    FileUploader.prototype.addToQueue = function (files, options, filters) {
        var _this = this;
        var list = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            list.push(file);
        }
        var arrayOfFilters = this._getFilters(filters);
        var count = this.queue.length;
        var addedFileItems = [];
        list.map(function (some) {
            if (!options) {
                options = _this.options;
            }
            var temp = new file_like_object_class_1.FileLikeObject(some);
            if (_this._isValidFile(temp, arrayOfFilters, options)) {
                var fileItem = new file_item_class_1.FileItem(_this, some, options);
                addedFileItems.push(fileItem);
                _this.queue.push(fileItem);
                _this._onAfterAddingFile(fileItem);
            }
            else {
                var filter = arrayOfFilters[_this._failFilterIndex];
                _this._onWhenAddingFileFailed(temp, filter, options);
            }
        });
        if (this.queue.length !== count) {
            this._onAfterAddingAll(addedFileItems);
            this.progress = this._getTotalProgress();
        }
        this._render();
        if (this.options.autoUpload) {
            this.uploadAll();
        }
    };
    FileUploader.prototype.removeFromQueue = function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        if (item.isUploading) {
            item.cancel();
        }
        this.queue.splice(index, 1);
        this.progress = this._getTotalProgress();
    };
    FileUploader.prototype.clearQueue = function () {
        while (this.queue.length) {
            this.queue[0].remove();
        }
        this.progress = 0;
    };
    FileUploader.prototype.uploadItem = function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        var transport = this.options.isHTML5 ? '_xhrTransport' : '_iframeTransport';
        item._prepareToUploading();
        if (this.isUploading) {
            return;
        }
        this.isUploading = true;
        this[transport](item);
    };
    FileUploader.prototype.cancelItem = function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        var prop = this.options.isHTML5 ? item._xhr : item._form;
        if (item && item.isUploading) {
            prop.abort();
        }
    };
    FileUploader.prototype.uploadAll = function () {
        var items = this.getNotUploadedItems().filter(function (item) { return !item.isUploading; });
        if (!items.length) {
            return;
        }
        items.map(function (item) { return item._prepareToUploading(); });
        items[0].upload();
    };
    FileUploader.prototype.cancelAll = function () {
        var items = this.getNotUploadedItems();
        items.map(function (item) { return item.cancel(); });
    };
    FileUploader.prototype.isFile = function (value) {
        return isFile(value);
    };
    FileUploader.prototype.isFileLikeObject = function (value) {
        return value instanceof file_like_object_class_1.FileLikeObject;
    };
    FileUploader.prototype.getIndexOfItem = function (value) {
        return typeof value === 'number' ? value : this.queue.indexOf(value);
    };
    FileUploader.prototype.getNotUploadedItems = function () {
        return this.queue.filter(function (item) { return !item.isUploaded; });
    };
    FileUploader.prototype.getReadyItems = function () {
        return this.queue
            .filter(function (item) { return (item.isReady && !item.isUploading); })
            .sort(function (item1, item2) { return item1.index - item2.index; });
    };
    FileUploader.prototype.destroy = function () {
        return void 0;
        /*forEach(this._directives, (key) => {
         forEach(this._directives[key], (object) => {
         object.destroy();
         });
         });*/
    };
    FileUploader.prototype.onAfterAddingAll = function (fileItems) {
        return { fileItems: fileItems };
    };
    FileUploader.prototype.onBuildItemForm = function (fileItem, form) {
        return { fileItem: fileItem, form: form };
    };
    FileUploader.prototype.onAfterAddingFile = function (fileItem) {
        return { fileItem: fileItem };
    };
    FileUploader.prototype.onWhenAddingFileFailed = function (item, filter, options) {
        return { item: item, filter: filter, options: options };
    };
    FileUploader.prototype.onBeforeUploadItem = function (fileItem) {
        return { fileItem: fileItem };
    };
    FileUploader.prototype.onProgressItem = function (fileItem, progress) {
        return { fileItem: fileItem, progress: progress };
    };
    FileUploader.prototype.onProgressAll = function (progress) {
        return { progress: progress };
    };
    FileUploader.prototype.onSuccessItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onErrorItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCancelItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCompleteItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCompleteAll = function () {
        return void 0;
    };
    FileUploader.prototype._mimeTypeFilter = function (item) {
        return !(this.options.allowedMimeType && this.options.allowedMimeType.indexOf(item.type) === -1);
    };
    FileUploader.prototype._fileSizeFilter = function (item) {
        return !(this.options.maxFileSize && item.size > this.options.maxFileSize);
    };
    FileUploader.prototype._fileTypeFilter = function (item) {
        return !(this.options.allowedFileType &&
            this.options.allowedFileType.indexOf(file_type_class_1.FileType.getMimeClass(item)) === -1);
    };
    FileUploader.prototype._onErrorItem = function (item, response, status, headers) {
        item._onError(response, status, headers);
        this.onErrorItem(item, response, status, headers);
    };
    FileUploader.prototype._onCompleteItem = function (item, response, status, headers) {
        item._onComplete(response, status, headers);
        this.onCompleteItem(item, response, status, headers);
        var nextItem = this.getReadyItems()[0];
        this.isUploading = false;
        if (nextItem) {
            nextItem.upload();
            return;
        }
        this.onCompleteAll();
        this.progress = this._getTotalProgress();
        this._render();
    };
    FileUploader.prototype._headersGetter = function (parsedHeaders) {
        return function (name) {
            if (name) {
                return parsedHeaders[name.toLowerCase()] || void 0;
            }
            return parsedHeaders;
        };
    };
    FileUploader.prototype._xhrTransport = function (item) {
        var _this = this;
        var xhr = item._xhr = new XMLHttpRequest();
        var sendable;
        this._onBeforeUploadItem(item);
        // todo
        /*item.formData.map(obj => {
         obj.map((value, key) => {
         form.append(key, value);
         });
         });*/
        if (typeof item._file.size !== 'number') {
            throw new TypeError('The file specified is no longer valid');
        }
        if (!this.options.disableMultipart) {
            sendable = new FormData();
            this._onBuildItemForm(item, sendable);
            sendable.append(item.alias, item._file, item.file.name);
        }
        else {
            sendable = item._file;
        }
        xhr.upload.onprogress = function (event) {
            var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
            _this._onProgressItem(item, progress);
        };
        xhr.onload = function () {
            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
            var response = _this._transformResponse(xhr.response, headers);
            var gist = _this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
            var method = '_on' + gist + 'Item';
            _this[method](item, response, xhr.status, headers);
            _this._onCompleteItem(item, response, xhr.status, headers);
        };
        xhr.onerror = function () {
            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
            var response = _this._transformResponse(xhr.response, headers);
            _this._onErrorItem(item, response, xhr.status, headers);
            _this._onCompleteItem(item, response, xhr.status, headers);
        };
        xhr.onabort = function () {
            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
            var response = _this._transformResponse(xhr.response, headers);
            _this._onCancelItem(item, response, xhr.status, headers);
            _this._onCompleteItem(item, response, xhr.status, headers);
        };
        xhr.open(item.method, item.url, true);
        xhr.withCredentials = item.withCredentials;
        // todo
        /*item.headers.map((value, name) => {
         xhr.setRequestHeader(name, value);
         });*/
        if (this.options.headers) {
            for (var _i = 0, _a = this.options.headers; _i < _a.length; _i++) {
                var header = _a[_i];
                xhr.setRequestHeader(header.name, header.value);
            }
        }
        if (this.authToken) {
            xhr.setRequestHeader('Authorization', this.authToken);
        }
        xhr.send(sendable);
        this._render();
    };
    FileUploader.prototype._getTotalProgress = function (value) {
        if (value === void 0) { value = 0; }
        if (this.options.removeAfterUpload) {
            return value;
        }
        var notUploaded = this.getNotUploadedItems().length;
        var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
        var ratio = 100 / this.queue.length;
        var current = value * ratio / 100;
        return Math.round(uploaded * ratio + current);
    };
    FileUploader.prototype._getFilters = function (filters) {
        if (!filters) {
            return this.options.filters;
        }
        if (Array.isArray(filters)) {
            return filters;
        }
        if (typeof filters === 'string') {
            var names_1 = filters.match(/[^\s,]+/g);
            return this.options.filters
                .filter(function (filter) { return names_1.indexOf(filter.name) !== -1; });
        }
        return this.options.filters;
    };
    FileUploader.prototype._render = function () {
        return void 0;
        // todo: ?
    };
    // private _folderFilter(item:FileItem):boolean {
    //   return !!(item.size || item.type);
    // }
    FileUploader.prototype._queueLimitFilter = function () {
        return this.options.queueLimit === undefined || this.queue.length < this.options.queueLimit;
    };
    FileUploader.prototype._isValidFile = function (file, filters, options) {
        var _this = this;
        this._failFilterIndex = -1;
        return !filters.length ? true : filters.every(function (filter) {
            _this._failFilterIndex++;
            return filter.fn.call(_this, file, options);
        });
    };
    FileUploader.prototype._isSuccessCode = function (status) {
        return (status >= 200 && status < 300) || status === 304;
    };
    /* tslint:disable */
    FileUploader.prototype._transformResponse = function (response, headers) {
        // todo: ?
        /*var headersGetter = this._headersGetter(headers);
         forEach($http.defaults.transformResponse, (transformFn) => {
         response = transformFn(response, headersGetter);
         });*/
        return response;
    };
    /* tslint:enable */
    FileUploader.prototype._parseHeaders = function (headers) {
        var parsed = {};
        var key;
        var val;
        var i;
        if (!headers) {
            return parsed;
        }
        headers.split('\n').map(function (line) {
            i = line.indexOf(':');
            key = line.slice(0, i).trim().toLowerCase();
            val = line.slice(i + 1).trim();
            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        });
        return parsed;
    };
    /*private _iframeTransport(item:FileItem) {
     // todo: implement it later
     }*/
    FileUploader.prototype._onWhenAddingFileFailed = function (item, filter, options) {
        this.onWhenAddingFileFailed(item, filter, options);
    };
    FileUploader.prototype._onAfterAddingFile = function (item) {
        this.onAfterAddingFile(item);
    };
    FileUploader.prototype._onAfterAddingAll = function (items) {
        this.onAfterAddingAll(items);
    };
    FileUploader.prototype._onBeforeUploadItem = function (item) {
        item._onBeforeUpload();
        this.onBeforeUploadItem(item);
    };
    FileUploader.prototype._onBuildItemForm = function (item, form) {
        item._onBuildForm(form);
        this.onBuildItemForm(item, form);
    };
    FileUploader.prototype._onProgressItem = function (item, progress) {
        var total = this._getTotalProgress(progress);
        this.progress = total;
        item._onProgress(progress);
        this.onProgressItem(item, progress);
        this.onProgressAll(total);
        this._render();
    };
    /* tslint:disable */
    FileUploader.prototype._onSuccessItem = function (item, response, status, headers) {
        item._onSuccess(response, status, headers);
        this.onSuccessItem(item, response, status, headers);
    };
    /* tslint:enable */
    FileUploader.prototype._onCancelItem = function (item, response, status, headers) {
        item._onCancel(response, status, headers);
        this.onCancelItem(item, response, status, headers);
    };
    return FileUploader;
}());
exports.FileUploader = FileUploader;


/***/ },

/***/ 23:
/***/ function(module, exports) {

"use strict";
"use strict";
var Constants = (function () {
    function Constants() {
    }
    Constants.SERVER = 'http://localhost:8080';
    Constants.REST_SERVER = 'http://localhost:8082';
    Constants.SERVER_BASE = '/';
    Constants.REST_BASE = Constants.REST_SERVER + "/windup-web-services/rest";
    Constants.STATIC_REPORTS_BASE = "/windup-web-services/staticReport";
    Constants.UNAUTHENTICATED_PAGE = "/not_loggedin.html";
    Constants.AUTH_REDIRECT_URL = Constants.SERVER + '/index.html';
    return Constants;
}());
exports.Constants = Constants;


/***/ },

/***/ 284:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FormErrorExamples; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var FormErrorExamples = {
    formControlName: "\n    <div [formGroup]=\"myGroup\">\n      <input formControlName=\"firstName\">\n    </div>\n\n    In your class:\n\n    this.myGroup = new FormGroup({\n       firstName: new FormControl()\n    });",
    formGroupName: "\n    <div [formGroup]=\"myGroup\">\n       <div formGroupName=\"person\">\n          <input formControlName=\"firstName\">\n       </div>\n    </div>\n\n    In your class:\n\n    this.myGroup = new FormGroup({\n       person: new FormGroup({ firstName: new FormControl() })\n    });",
    formArrayName: "\n    <div [formGroup]=\"myGroup\">\n      <div formArrayName=\"cities\">\n        <div *ngFor=\"let city of cityArray.controls; let i=index\">\n          <input [formControlName]=\"i\">\n        </div>\n      </div>\n    </div>\n\n    In your class:\n\n    this.cityArray = new FormArray([new FormControl('SF')]);\n    this.myGroup = new FormGroup({\n      cities: this.cityArray\n    });",
    ngModelGroup: "\n    <form>\n       <div ngModelGroup=\"person\">\n          <input [(ngModel)]=\"person.name\" name=\"firstName\">\n       </div>\n    </form>",
    ngModelWithFormGroup: "\n    <div [formGroup]=\"myGroup\">\n       <input formControlName=\"firstName\">\n       <input [(ngModel)]=\"showMoreControls\" [ngModelOptions]=\"{standalone: true}\">\n    </div>\n  "
};
//# sourceMappingURL=error_examples.js.map

/***/ },

/***/ 285:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__error_examples__ = __webpack_require__(284);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return TemplateDrivenErrors; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

var TemplateDrivenErrors = (function () {
    function TemplateDrivenErrors() {
    }
    TemplateDrivenErrors.modelParentException = function () {
        throw new Error("\n      ngModel cannot be used to register form controls with a parent formGroup directive.  Try using\n      formGroup's partner directive \"formControlName\" instead.  Example:\n\n      " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].formControlName + "\n\n      Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:\n\n      Example:\n\n      " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].ngModelWithFormGroup);
    };
    TemplateDrivenErrors.formGroupNameException = function () {
        throw new Error("\n      ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.\n\n      Option 1: Use formControlName instead of ngModel (reactive strategy):\n\n      " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].formGroupName + "\n\n      Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):\n\n      " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].ngModelGroup);
    };
    TemplateDrivenErrors.missingNameException = function () {
        throw new Error("If ngModel is used within a form tag, either the name attribute must be set or the form\n      control must be defined as 'standalone' in ngModelOptions.\n\n      Example 1: <input [(ngModel)]=\"person.firstName\" name=\"first\">\n      Example 2: <input [(ngModel)]=\"person.firstName\" [ngModelOptions]=\"{standalone: true}\">");
    };
    TemplateDrivenErrors.modelGroupParentException = function () {
        throw new Error("\n      ngModelGroup cannot be used with a parent formGroup directive.\n\n      Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):\n\n      " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].formGroupName + "\n\n      Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):\n\n      " + __WEBPACK_IMPORTED_MODULE_0__error_examples__["a" /* FormErrorExamples */].ngModelGroup);
    };
    return TemplateDrivenErrors;
}());
//# sourceMappingURL=template_driven_errors.js.map

/***/ },

/***/ 286:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model__ = __webpack_require__(115);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FormBuilder; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */




/**
 * @whatItDoes Creates an {@link AbstractControl} from a user-specified configuration.
 *
 * It is essentially syntactic sugar that shortens the `new FormGroup()`,
 * `new FormControl()`, and `new FormArray()` boilerplate that can build up in larger
 * forms.
 *
 * @howToUse
 *
 * To use, inject `FormBuilder` into your component class. You can then call its methods
 * directly.
 *
 * {@example forms/ts/formBuilder/form_builder_example.ts region='Component'}
 *
 *  * **npm package**: `@angular/forms`
 *
 *  * **NgModule**: {@link ReactiveFormsModule}
 *
 * @stable
 */
var FormBuilder = (function () {
    function FormBuilder() {
    }
    /**
     * Construct a new {@link FormGroup} with the given map of configuration.
     * Valid keys for the `extra` parameter map are `validator` and `asyncValidator`.
     *
     * See the {@link FormGroup} constructor for more details.
     */
    FormBuilder.prototype.group = function (controlsConfig, extra) {
        if (extra === void 0) { extra = null; }
        var controls = this._reduceControls(controlsConfig);
        var validator = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(extra) ? __WEBPACK_IMPORTED_MODULE_1__facade_collection__["a" /* StringMapWrapper */].get(extra, 'validator') : null;
        var asyncValidator = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["a" /* isPresent */])(extra) ? __WEBPACK_IMPORTED_MODULE_1__facade_collection__["a" /* StringMapWrapper */].get(extra, 'asyncValidator') : null;
        return new __WEBPACK_IMPORTED_MODULE_3__model__["a" /* FormGroup */](controls, validator, asyncValidator);
    };
    /**
     * Construct a new {@link FormControl} with the given `formState`,`validator`, and
     * `asyncValidator`.
     *
     * `formState` can either be a standalone value for the form control or an object
     * that contains both a value and a disabled status.
     *
     */
    FormBuilder.prototype.control = function (formState, validator, asyncValidator) {
        if (validator === void 0) { validator = null; }
        if (asyncValidator === void 0) { asyncValidator = null; }
        return new __WEBPACK_IMPORTED_MODULE_3__model__["b" /* FormControl */](formState, validator, asyncValidator);
    };
    /**
     * Construct a {@link FormArray} from the given `controlsConfig` array of
     * configuration, with the given optional `validator` and `asyncValidator`.
     */
    FormBuilder.prototype.array = function (controlsConfig, validator, asyncValidator) {
        var _this = this;
        if (validator === void 0) { validator = null; }
        if (asyncValidator === void 0) { asyncValidator = null; }
        var controls = controlsConfig.map(function (c) { return _this._createControl(c); });
        return new __WEBPACK_IMPORTED_MODULE_3__model__["c" /* FormArray */](controls, validator, asyncValidator);
    };
    /** @internal */
    FormBuilder.prototype._reduceControls = function (controlsConfig) {
        var _this = this;
        var controls = {};
        __WEBPACK_IMPORTED_MODULE_1__facade_collection__["a" /* StringMapWrapper */].forEach(controlsConfig, function (controlConfig, controlName) {
            controls[controlName] = _this._createControl(controlConfig);
        });
        return controls;
    };
    /** @internal */
    FormBuilder.prototype._createControl = function (controlConfig) {
        if (controlConfig instanceof __WEBPACK_IMPORTED_MODULE_3__model__["b" /* FormControl */] || controlConfig instanceof __WEBPACK_IMPORTED_MODULE_3__model__["a" /* FormGroup */] ||
            controlConfig instanceof __WEBPACK_IMPORTED_MODULE_3__model__["c" /* FormArray */]) {
            return controlConfig;
        }
        else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__facade_lang__["c" /* isArray */])(controlConfig)) {
            var value = controlConfig[0];
            var validator = controlConfig.length > 1 ? controlConfig[1] : null;
            var asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else {
            return this.control(controlConfig);
        }
    };
    FormBuilder.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    FormBuilder.ctorParameters = [];
    return FormBuilder;
}());
//# sourceMappingURL=form_builder.js.map

/***/ },

/***/ 287:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return isPromise; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

var isPromise = __WEBPACK_IMPORTED_MODULE_0__angular_core__["__core_private__"].isPromise;
//# sourceMappingURL=private_import_core.js.map

/***/ },

/***/ 310:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {"use strict";
var core_1 = __webpack_require__(1);
var formcomponent_component_1 = __webpack_require__(82);
var forms_1 = __webpack_require__(74);
var file_exists_validator_1 = __webpack_require__(208);
var file_service_1 = __webpack_require__(124);
var configuration_service_1 = __webpack_require__(123);
var windup_services_1 = __webpack_require__(209);
var AddRulesPathModalComponent = (function (_super) {
    __extends(AddRulesPathModalComponent, _super);
    function AddRulesPathModalComponent(_formBuilder, _fileService, _configurationService) {
        _super.call(this);
        this._formBuilder = _formBuilder;
        this._fileService = _fileService;
        this._configurationService = _configurationService;
        this.configurationSaved = new core_1.EventEmitter();
        this.inputPath = "";
    }
    AddRulesPathModalComponent.prototype.ngOnInit = function () {
        this.addRulesPathForm = this._formBuilder.group({
            inputPathControl: ["", forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)]), file_exists_validator_1.FileExistsValidator.create(this._fileService)]
        });
    };
    AddRulesPathModalComponent.prototype.show = function () {
        this.errorMessages = [];
        if (this.addRulesPathForm)
            this.addRulesPathForm.reset();
        $('#addRulesPathModal').modal('show');
    };
    AddRulesPathModalComponent.prototype.hide = function () {
        $('#addRulesPathModal').modal('hide');
    };
    AddRulesPathModalComponent.prototype.addPath = function () {
        var _this = this;
        var newConfiguration = JSON.parse(JSON.stringify(this.configuration));
        var newPath = {};
        newPath.path = this.inputPath;
        newPath.rulesPathType = "USER_PROVIDED";
        newConfiguration.rulesPaths.push(newPath);
        this._configurationService.save(newConfiguration).subscribe(function (configuration) {
            _this.configuration = configuration;
            _this.configurationSaved.emit({
                configuration: _this.configuration
            });
            _this.hide();
        }, function (error) { return _this.handleError(error); });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof windup_services_1.Configuration !== 'undefined' && windup_services_1.Configuration) === 'function' && _a) || Object)
    ], AddRulesPathModalComponent.prototype, "configuration", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AddRulesPathModalComponent.prototype, "configurationSaved", void 0);
    AddRulesPathModalComponent = __decorate([
        core_1.Component({
            selector: 'add-rules-path-modal',
            template: __webpack_require__(510)
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _b) || Object, (typeof (_c = typeof file_service_1.FileService !== 'undefined' && file_service_1.FileService) === 'function' && _c) || Object, (typeof (_d = typeof configuration_service_1.ConfigurationService !== 'undefined' && configuration_service_1.ConfigurationService) === 'function' && _d) || Object])
    ], AddRulesPathModalComponent);
    return AddRulesPathModalComponent;
    var _a, _b, _c, _d;
}(formcomponent_component_1.FormComponent));
exports.AddRulesPathModalComponent = AddRulesPathModalComponent;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ },

/***/ 311:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var forms_1 = __webpack_require__(74);
var router_1 = __webpack_require__(30);
var formcomponent_component_1 = __webpack_require__(82);
var applicationgroup_service_1 = __webpack_require__(62);
var migrationpath_service_1 = __webpack_require__(323);
var analysiscontext_service_1 = __webpack_require__(322);
var configuration_options_service_1 = __webpack_require__(206);
var AnalysisContextFormComponent = (function (_super) {
    __extends(AnalysisContextFormComponent, _super);
    function AnalysisContextFormComponent(_router, _activatedRoute, _applicationGroupService, _migrationPathService, _analysisContextService, _configurationOptionsService) {
        _super.call(this);
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this._applicationGroupService = _applicationGroupService;
        this._migrationPathService = _migrationPathService;
        this._analysisContextService = _analysisContextService;
        this._configurationOptionsService = _configurationOptionsService;
        this.loading = true;
        this.applicationGroup = null;
        this.analysisContext = {};
        this.configurationOptions = [];
        this._dirty = null;
        this.analysisContext.migrationPath = {};
        this.packages = [{ prefix: "" }];
        this.excludePackages = [{ prefix: "" }];
    }
    Object.defineProperty(AnalysisContextFormComponent.prototype, "migrationPaths", {
        get: function () {
            if (this._migrationPathsObservable == null) {
                this._migrationPathsObservable = this._migrationPathService.getAll();
            }
            return this._migrationPathsObservable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalysisContextFormComponent.prototype, "dirty", {
        get: function () {
            if (this._dirty != null) {
                console.log("Returning locally set dirty: " + this._dirty);
                return this._dirty;
            }
            return this.analysisContextForm.dirty;
        },
        enumerable: true,
        configurable: true
    });
    AnalysisContextFormComponent.prototype.advancedOptionsChanged = function (advancedOptions) {
        console.log("1Advanced options changed... dirty: " + this.dirty);
        this._dirty = true;
        console.log("2Advanced options changed... dirty: " + this.dirty);
    };
    AnalysisContextFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._activatedRoute.params.subscribe(function (params) {
            var id = parseInt(params["groupID"]);
            if (!isNaN(id)) {
                _this.loading = true;
                _this._configurationOptionsService.getAll().subscribe(function (options) {
                    _this.configurationOptions = options;
                });
                _this._applicationGroupService.get(id).subscribe(function (group) {
                    _this.applicationGroup = group;
                    _this.analysisContext = group.analysisContext;
                    console.log("Loaded analysis context: " + JSON.stringify(_this.analysisContext));
                    if (_this.analysisContext == null) {
                        _this.analysisContext = {};
                        _this.analysisContext.migrationPath = {};
                        _this.analysisContext.advancedOptions = [];
                        _this.packages = [{ prefix: "" }];
                        _this.excludePackages = [{ prefix: "" }];
                        _this.analysisContext.rulesPaths = [];
                    }
                    else {
                        // for migration path, store the id only
                        _this.analysisContext.migrationPath = { id: _this.analysisContext.migrationPath.id };
                        if (_this.analysisContext.packages == null || _this.analysisContext.packages.length == 0)
                            _this.packages = [{ prefix: "" }];
                        else
                            _this.packages = _this.analysisContext.packages.map(function (it) { return { prefix: it }; });
                        if (_this.analysisContext.excludePackages == null || _this.analysisContext.excludePackages.length == 0)
                            _this.excludePackages = [{ prefix: "" }];
                        else
                            _this.excludePackages = _this.analysisContext.excludePackages.map(function (it) { return { prefix: it }; });
                        if (_this.analysisContext.rulesPaths == null)
                            _this.analysisContext.rulesPaths = [];
                    }
                    // Just use the ID here
                    _this.analysisContext.applicationGroup = { id: group.id };
                    _this.loading = false;
                });
            }
            else {
                _this.loading = false;
                _this.errorMessages.push("groupID parameter was not specified!");
            }
        });
    };
    AnalysisContextFormComponent.prototype.addScanPackage = function () {
        this.packages.push({ prefix: "" });
    };
    AnalysisContextFormComponent.prototype.removeScanPackage = function (index) {
        this.packages.splice(index, 1);
    };
    AnalysisContextFormComponent.prototype.addExcludePackage = function () {
        this.excludePackages.push({ prefix: "" });
    };
    AnalysisContextFormComponent.prototype.removeExcludePackage = function (index) {
        this.excludePackages.splice(index, 1);
    };
    AnalysisContextFormComponent.prototype.save = function () {
        var _this = this;
        this.analysisContext.packages = this.packages.filter(function (it) { return it.prefix != null && it.prefix.trim() != ""; }).map(function (it) { return it.prefix; });
        this.analysisContext.excludePackages = this.excludePackages.filter(function (it) { return it.prefix != null && it.prefix.trim() != ""; }).map(function (it) { return it.prefix; });
        console.log("Should save with packages: " + JSON.stringify(this.analysisContext.packages) + " filtered from: " + JSON.stringify(this.packages) + " Rules paths: " + JSON.stringify(this.analysisContext.rulesPaths));
        if (this.analysisContext.id != null) {
            console.log("Updating analysis context: " + this.analysisContext.migrationPath.id);
            this._analysisContextService.update(this.analysisContext).subscribe(function (migrationProject) {
                _this._dirty = false;
                _this.routeToGroupList();
            }, function (error) { return _this.handleError(error); });
        }
        else {
            console.log("Creating analysis context: " + this.analysisContext.migrationPath.id);
            this._analysisContextService.create(this.analysisContext).subscribe(function (migrationProject) {
                _this._dirty = false;
                _this.routeToGroupList();
            }, function (error) { return _this.handleError(error); });
        }
    };
    AnalysisContextFormComponent.prototype.rulesPathsChanged = function (rulesPaths) {
        this.analysisContext.rulesPaths = rulesPaths;
    };
    AnalysisContextFormComponent.prototype.viewAdvancedOptions = function (advancedOptionsModal) {
        advancedOptionsModal.show();
        return false;
    };
    AnalysisContextFormComponent.prototype.cancel = function () {
        this.routeToGroupList();
    };
    AnalysisContextFormComponent.prototype.routeToGroupList = function () {
        this._router.navigate(['/group-list', { projectID: this.applicationGroup.migrationProject.id }]);
    };
    __decorate([
        core_1.ViewChild(forms_1.NgForm), 
        __metadata('design:type', (typeof (_a = typeof forms_1.NgForm !== 'undefined' && forms_1.NgForm) === 'function' && _a) || Object)
    ], AnalysisContextFormComponent.prototype, "analysisContextForm", void 0);
    AnalysisContextFormComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(511)
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object, (typeof (_c = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _c) || Object, (typeof (_d = typeof applicationgroup_service_1.ApplicationGroupService !== 'undefined' && applicationgroup_service_1.ApplicationGroupService) === 'function' && _d) || Object, (typeof (_e = typeof migrationpath_service_1.MigrationPathService !== 'undefined' && migrationpath_service_1.MigrationPathService) === 'function' && _e) || Object, (typeof (_f = typeof analysiscontext_service_1.AnalysisContextService !== 'undefined' && analysiscontext_service_1.AnalysisContextService) === 'function' && _f) || Object, (typeof (_g = typeof configuration_options_service_1.ConfigurationOptionsService !== 'undefined' && configuration_options_service_1.ConfigurationOptionsService) === 'function' && _g) || Object])
    ], AnalysisContextFormComponent);
    return AnalysisContextFormComponent;
    var _a, _b, _c, _d, _e, _f, _g;
}(formcomponent_component_1.FormComponent));
exports.AnalysisContextFormComponent = AnalysisContextFormComponent;


/***/ },

/***/ 312:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var router_1 = __webpack_require__(30);
var applicationgroup_service_1 = __webpack_require__(62);
var migrationproject_service_1 = __webpack_require__(83);
var formcomponent_component_1 = __webpack_require__(82);
var ApplicationGroupForm = (function (_super) {
    __extends(ApplicationGroupForm, _super);
    function ApplicationGroupForm(_router, _activatedRoute, _migrationProjectService, _applicationGroupService) {
        _super.call(this);
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this._migrationProjectService = _migrationProjectService;
        this._applicationGroupService = _applicationGroupService;
        this.model = {};
        this.editMode = false;
        this.loadingProject = false;
        this.loadingGroup = false;
    }
    Object.defineProperty(ApplicationGroupForm.prototype, "loading", {
        get: function () {
            return this.loadingProject || this.loadingGroup;
        },
        enumerable: true,
        configurable: true
    });
    ApplicationGroupForm.prototype.ngOnInit = function () {
        var _this = this;
        this._activatedRoute.params.subscribe(function (params) {
            var projectID = parseInt(params["projectID"]);
            if (!isNaN(projectID)) {
                _this.loadingProject = true;
                _this._migrationProjectService.get(projectID).subscribe(function (model) { _this.project = model; _this.loadingProject = false; }, function (error) { return _this.handleError(error); });
            }
            var groupID = parseInt(params["groupID"]);
            if (!isNaN(groupID)) {
                _this.editMode = true;
                _this.loadingGroup = true;
                _this._applicationGroupService.get(groupID).subscribe(function (model) {
                    _this.model = model;
                    if (_this.project == null)
                        _this.project = _this.model.migrationProject;
                    _this.loadingGroup = false;
                }, function (error) { return _this.handleError(error); });
            }
        });
    };
    ApplicationGroupForm.prototype.save = function () {
        var _this = this;
        if (this.editMode) {
            console.log("Updating group: " + this.model.title);
            this.model.migrationProject = {};
            this.model.migrationProject.id = this.project.id;
            this._applicationGroupService.update(this.model).subscribe(function (migrationProject) { return _this.rerouteToGroupList(); }, function (error) { return _this.handleError(error); });
        }
        else {
            console.log("Creating group: " + this.model.title);
            this.model.migrationProject = this.project;
            this._applicationGroupService.create(this.model).subscribe(function (migrationProject) { return _this.rerouteToGroupList(); }, function (error) { return _this.handleError(error); });
        }
    };
    ApplicationGroupForm.prototype.rerouteToGroupList = function () {
        this._router.navigate(['/group-list', { projectID: this.project.id }]);
    };
    ApplicationGroupForm.prototype.cancel = function () {
        this.rerouteToGroupList();
    };
    ApplicationGroupForm = __decorate([
        core_1.Component({
            selector: 'create-group-form',
            template: __webpack_require__(513),
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object, (typeof (_c = typeof migrationproject_service_1.MigrationProjectService !== 'undefined' && migrationproject_service_1.MigrationProjectService) === 'function' && _c) || Object, (typeof (_d = typeof applicationgroup_service_1.ApplicationGroupService !== 'undefined' && applicationgroup_service_1.ApplicationGroupService) === 'function' && _d) || Object])
    ], ApplicationGroupForm);
    return ApplicationGroupForm;
    var _a, _b, _c, _d;
}(formcomponent_component_1.FormComponent));
exports.ApplicationGroupForm = ApplicationGroupForm;


/***/ },

/***/ 313:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var configuration_service_1 = __webpack_require__(123);
var rule_service_1 = __webpack_require__(325);
var rules_modal_component_1 = __webpack_require__(320);
var add_rules_path_modal_component_1 = __webpack_require__(310);
var ConfigurationComponent = (function () {
    function ConfigurationComponent(_configurationService, _ruleService) {
        this._configurationService = _configurationService;
        this._ruleService = _ruleService;
        this.ruleProvidersByPath = new Map();
    }
    ConfigurationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._configurationService.get().subscribe(function (configuration) {
            _this.configuration = configuration;
            _this.loadProviders();
        }, function (error) { return _this.errorMessage = error; });
    };
    ConfigurationComponent.prototype.loadProviders = function () {
        var _this = this;
        if (!this.configuration || this.configuration.rulesPaths == null)
            return;
        this.configuration.rulesPaths.forEach(function (rulesPath) {
            _this._ruleService.getByRulesPath(rulesPath).subscribe(function (ruleProviders) { return _this.ruleProvidersByPath.set(rulesPath, ruleProviders); }, function (error) { return _this.errorMessage = error; });
        });
    };
    ConfigurationComponent.prototype.hasFileBasedProviders = function (rulesPath) {
        var _this = this;
        var providers = this.ruleProvidersByPath.get(rulesPath);
        if (!providers)
            return false;
        var foundRules = false;
        providers.forEach(function (provider) {
            if (_this.isFileBasedProvider(provider))
                foundRules = true;
        });
        return foundRules;
    };
    ConfigurationComponent.prototype.isFileBasedProvider = function (provider) {
        switch (provider.ruleProviderType) {
            case "GROOVY":
            case "XML":
                return true;
            default:
                return false;
        }
    };
    ConfigurationComponent.prototype.displayRules = function (provider, event) {
        event.preventDefault();
        this.rulesModalComponent.ruleProviderEntity = provider;
        this.rulesModalComponent.show();
    };
    ConfigurationComponent.prototype.displayAddRulesPathForm = function () {
        this.addRulesModalComponent.show();
    };
    ConfigurationComponent.prototype.configurationUpdated = function (event) {
        this.configuration = event.configuration;
        this.loadProviders();
    };
    ConfigurationComponent.prototype.removeRulesPath = function (rulesPath) {
        var _this = this;
        var newConfiguration = JSON.parse(JSON.stringify(this.configuration));
        newConfiguration.rulesPaths.splice(newConfiguration.rulesPaths.indexOf(rulesPath), 1);
        this._configurationService.save(newConfiguration).subscribe(function (configuration) {
            _this.configuration = configuration;
            _this.loadProviders();
        }, function (error) { return console.log("Error: " + error); });
    };
    __decorate([
        core_1.ViewChild(rules_modal_component_1.RulesModalComponent), 
        __metadata('design:type', (typeof (_a = typeof rules_modal_component_1.RulesModalComponent !== 'undefined' && rules_modal_component_1.RulesModalComponent) === 'function' && _a) || Object)
    ], ConfigurationComponent.prototype, "rulesModalComponent", void 0);
    __decorate([
        core_1.ViewChild(add_rules_path_modal_component_1.AddRulesPathModalComponent), 
        __metadata('design:type', (typeof (_b = typeof add_rules_path_modal_component_1.AddRulesPathModalComponent !== 'undefined' && add_rules_path_modal_component_1.AddRulesPathModalComponent) === 'function' && _b) || Object)
    ], ConfigurationComponent.prototype, "addRulesModalComponent", void 0);
    ConfigurationComponent = __decorate([
        core_1.Component({
            selector: 'application-list',
            template: __webpack_require__(515)
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof configuration_service_1.ConfigurationService !== 'undefined' && configuration_service_1.ConfigurationService) === 'function' && _c) || Object, (typeof (_d = typeof rule_service_1.RuleService !== 'undefined' && rule_service_1.RuleService) === 'function' && _d) || Object])
    ], ConfigurationComponent);
    return ConfigurationComponent;
    var _a, _b, _c, _d;
}());
exports.ConfigurationComponent = ConfigurationComponent;


/***/ },

/***/ 314:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var forms_1 = __webpack_require__(74);
var router_1 = __webpack_require__(30);
var registeredapplication_service_1 = __webpack_require__(125);
var file_exists_validator_1 = __webpack_require__(208);
var file_service_1 = __webpack_require__(124);
var applicationgroup_service_1 = __webpack_require__(62);
var constants_1 = __webpack_require__(23);
var registerapplicationform_component_1 = __webpack_require__(205);
var EditApplicationFormComponent = (function (_super) {
    __extends(EditApplicationFormComponent, _super);
    function EditApplicationFormComponent(_router, _activatedRoute, _fileService, _registeredApplicationService, _applicationGroupService, _formBuilder) {
        _super.call(this, _router, _activatedRoute, _fileService, _registeredApplicationService, _applicationGroupService, _formBuilder);
        this.loading = true;
        this.multipartUploader = _registeredApplicationService.getMultipartUploader();
    }
    EditApplicationFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isMultiple = false;
        this.labels = {
            heading: 'Update application',
            submitButton: 'Update'
        };
        this.registrationForm = this._formBuilder.group({
            inputPath: ["", forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(4)]), file_exists_validator_1.FileExistsValidator.create(this._fileService)]
        });
        this._activatedRoute.params.subscribe(function (params) {
            if (params.hasOwnProperty('id') && !isNaN(params['id'])) {
                var id = parseInt(params["id"]);
                _this.loading = true;
                _this._registeredApplicationService.get(id).subscribe(function (application) {
                    _this.application = application;
                    _this.mode = application.registrationType;
                    _this.fileInputPath = application.inputPath;
                    _this.applicationGroup = application.applicationGroup;
                    _this.loading = false;
                    _this.multipartUploader.setOptions({
                        url: constants_1.Constants.REST_BASE + registeredapplication_service_1.RegisteredApplicationService.REGISTERED_APPLICATION_SERVICE_NAME + application.id,
                        disableMultipart: false,
                        method: 'PUT'
                    });
                });
            }
            else {
                _this.loading = false;
            }
        });
    };
    EditApplicationFormComponent.prototype.register = function () {
        var _this = this;
        if (this.mode == "PATH") {
            this.application.inputPath = this.fileInputPath;
            this._registeredApplicationService.update(this.application).subscribe(function (application) { return _this.rerouteToApplicationList(); }, function (error) { return _this.handleError(error); });
        }
        else {
            if (this.multipartUploader.getNotUploadedItems().length > 0) {
                this._registeredApplicationService.updateByUpload(this.application).subscribe(function (application) { return _this.rerouteToApplicationList(); }, function (error) { return _this.handleError(error); });
            }
            else {
                this.handleError("Please select file first");
            }
        }
        return false;
    };
    EditApplicationFormComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(327)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object, (typeof (_c = typeof file_service_1.FileService !== 'undefined' && file_service_1.FileService) === 'function' && _c) || Object, (typeof (_d = typeof registeredapplication_service_1.RegisteredApplicationService !== 'undefined' && registeredapplication_service_1.RegisteredApplicationService) === 'function' && _d) || Object, (typeof (_e = typeof applicationgroup_service_1.ApplicationGroupService !== 'undefined' && applicationgroup_service_1.ApplicationGroupService) === 'function' && _e) || Object, (typeof (_f = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _f) || Object])
    ], EditApplicationFormComponent);
    return EditApplicationFormComponent;
    var _a, _b, _c, _d, _e, _f;
}(registerapplicationform_component_1.RegisterApplicationFormComponent));
exports.EditApplicationFormComponent = EditApplicationFormComponent;


/***/ },

/***/ 315:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var router_1 = __webpack_require__(30);
var applicationgroup_service_1 = __webpack_require__(62);
var windup_service_1 = __webpack_require__(326);
var constants_1 = __webpack_require__(23);
var registeredapplication_service_1 = __webpack_require__(125);
var notification_service_1 = __webpack_require__(207);
var migrationproject_service_1 = __webpack_require__(83);
var GroupListComponent = (function () {
    function GroupListComponent(_activatedRoute, _router, _applicationGroupService, _windupService, _registeredApplicationsService, _notificationService, _migrationProjectService) {
        this._activatedRoute = _activatedRoute;
        this._router = _router;
        this._applicationGroupService = _applicationGroupService;
        this._windupService = _windupService;
        this._registeredApplicationsService = _registeredApplicationsService;
        this._notificationService = _notificationService;
        this._migrationProjectService = _migrationProjectService;
        this.processingStatus = new Map();
    }
    GroupListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._activatedRoute.params.subscribe(function (params) {
            _this.projectID = parseInt(params["projectID"]);
            _this._migrationProjectService.get(_this.projectID)
                .subscribe(function (project) {
                console.log('success');
            }, function (error) {
                _this._notificationService.error(_this.getErrorMessage(error.error));
                _this._router.navigate(['']);
            });
            _this.getGroups();
        });
        this.processMonitoringInterval = setInterval(function () {
            _this.processingStatus.forEach(function (previousExecution, groupID, map) {
                if (previousExecution.state == "STARTED" || previousExecution.state == "QUEUED") {
                    _this._windupService.getStatusGroup(previousExecution.id).subscribe(function (execution) {
                        _this.processingStatus.set(groupID, execution);
                        _this.errorMessage = "";
                    }, function (error) { return _this.errorMessage = error; });
                }
            });
            _this.getGroups();
        }, 30000);
    };
    GroupListComponent.prototype.getErrorMessage = function (error) {
        if (error instanceof ProgressEvent) {
            return "ERROR: Server disconnected";
        }
        else if (typeof error == 'string') {
            return error;
        }
        else if (typeof error == 'object' && error.hasOwnProperty('message')) {
            return error.message;
        }
        else {
            return 'Unknown error';
        }
    };
    GroupListComponent.prototype.ngOnDestroy = function () {
        if (this.processMonitoringInterval)
            clearInterval(this.processMonitoringInterval);
    };
    GroupListComponent.prototype.getGroups = function () {
        var _this = this;
        return this._applicationGroupService.getByProjectID(this.projectID).subscribe(function (groups) { return _this.groupsLoaded(groups); }, function (error) {
            if (error instanceof ProgressEvent) {
                _this.errorMessage = "ERROR: Server disconnected";
            }
            else {
                _this._notificationService.error(_this.getErrorMessage(error));
                _this._router.navigate(['']);
            }
        });
    };
    GroupListComponent.prototype.groupsLoaded = function (groups) {
        var _this = this;
        this.errorMessage = "";
        this.groups = groups;
        // On the first run, check for any existing executions
        if (this.processingStatus.size == 0) {
            groups.forEach(function (group) {
                group.executions.forEach(function (execution) {
                    console.log("group and status == " + group.title + " id: " + group.title + " status: " + execution.state);
                    var previousExecution = _this.processingStatus.get(group.id);
                    if (previousExecution == null || execution.state == "STARTED" || execution.timeStarted > previousExecution.timeStarted)
                        _this.processingStatus.set(group.id, execution);
                });
            });
        }
    };
    GroupListComponent.prototype.status = function (group) {
        var status = this.processingStatus.get(group.id);
        if (status == null) {
            status = {};
            status.currentTask = "...";
        }
        return status;
    };
    GroupListComponent.prototype.runWindup = function (event, group) {
        var _this = this;
        event.preventDefault();
        this._windupService.executeWindupGroup(group.id).subscribe(function (execution) {
            console.log("Execution started for group: " + JSON.stringify(execution));
            _this.processingStatus.set(group.id, execution);
        }, function (error) { return _this.errorMessage = error; });
    };
    GroupListComponent.prototype.groupReportURL = function (group) {
        var execution = this.processingStatus.get(group.id);
        if (execution == null || execution.applicationListRelativePath == null || execution.state != "COMPLETED")
            return null;
        return constants_1.Constants.STATIC_REPORTS_BASE + "/" + execution.applicationListRelativePath;
    };
    GroupListComponent.prototype.reportURL = function (app) {
        return constants_1.Constants.STATIC_REPORTS_BASE + "/" + app.reportIndexPath;
    };
    GroupListComponent.prototype.createGroup = function () {
        this._router.navigate(['/application-group-form', { projectID: this.projectID }]);
    };
    GroupListComponent.prototype.editGroup = function (applicationGroup, event) {
        event.preventDefault();
        this._router.navigate(['/application-group-form', { projectID: this.projectID, groupID: applicationGroup.id }]);
    };
    GroupListComponent.prototype.registerApplication = function (applicationGroup) {
        this._router.navigate(['/register-application', { groupID: applicationGroup.id }]);
    };
    GroupListComponent.prototype.editApplication = function (application) {
        this._router.navigate(['/edit-application', application.id]);
    };
    GroupListComponent.prototype.deleteApplication = function (application) {
        var _this = this;
        if (application.registrationType == "PATH") {
            this._registeredApplicationsService.unregister(application)
                .subscribe(function (result) {
                console.log(result);
                _this.getGroups();
            });
        }
        else {
            this._registeredApplicationsService.deleteApplication(application)
                .subscribe(function (result) {
                console.log(result);
                _this.getGroups();
            });
        }
    };
    GroupListComponent = __decorate([
        core_1.Component({
            selector: 'application-list',
            template: __webpack_require__(517)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object, (typeof (_c = typeof applicationgroup_service_1.ApplicationGroupService !== 'undefined' && applicationgroup_service_1.ApplicationGroupService) === 'function' && _c) || Object, (typeof (_d = typeof windup_service_1.WindupService !== 'undefined' && windup_service_1.WindupService) === 'function' && _d) || Object, (typeof (_e = typeof registeredapplication_service_1.RegisteredApplicationService !== 'undefined' && registeredapplication_service_1.RegisteredApplicationService) === 'function' && _e) || Object, (typeof (_f = typeof notification_service_1.NotificationService !== 'undefined' && notification_service_1.NotificationService) === 'function' && _f) || Object, (typeof (_g = typeof migrationproject_service_1.MigrationProjectService !== 'undefined' && migrationproject_service_1.MigrationProjectService) === 'function' && _g) || Object])
    ], GroupListComponent);
    return GroupListComponent;
    var _a, _b, _c, _d, _e, _f, _g;
}());
exports.GroupListComponent = GroupListComponent;


/***/ },

/***/ 316:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var router_1 = __webpack_require__(30);
var migrationproject_service_1 = __webpack_require__(83);
var formcomponent_component_1 = __webpack_require__(82);
var MigrationProjectFormComponent = (function (_super) {
    __extends(MigrationProjectFormComponent, _super);
    function MigrationProjectFormComponent(_router, _activatedRoute, _migrationProjectService) {
        _super.call(this);
        this._router = _router;
        this._activatedRoute = _activatedRoute;
        this._migrationProjectService = _migrationProjectService;
        this.model = {};
        this.editMode = false;
        this.loading = false;
    }
    MigrationProjectFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._activatedRoute.params.subscribe(function (params) {
            var id = parseInt(params["projectID"]);
            if (!isNaN(id)) {
                _this.editMode = true;
                _this.loading = true;
                _this._migrationProjectService.get(id).subscribe(function (model) {
                    _this.model = model;
                    _this.loading = false;
                }, function (error) { return _this.handleError(error); });
            }
        });
    };
    MigrationProjectFormComponent.prototype.save = function () {
        var _this = this;
        if (this.editMode) {
            console.log("Updating migration project: " + this.model.title);
            this._migrationProjectService.update(this.model).subscribe(function (migrationProject) { return _this.rerouteToProjectList(); }, function (error) { return _this.handleError(error); });
        }
        else {
            console.log("Creating migration project: " + this.model.title);
            this._migrationProjectService.create(this.model).subscribe(function (migrationProject) { return _this.rerouteToProjectList(); }, function (error) { return _this.handleError(error); });
        }
    };
    MigrationProjectFormComponent.prototype.rerouteToProjectList = function () {
        this._router.navigate(['/project-list']);
    };
    MigrationProjectFormComponent.prototype.cancel = function () {
        this.rerouteToProjectList();
    };
    MigrationProjectFormComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(518)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object, (typeof (_c = typeof migrationproject_service_1.MigrationProjectService !== 'undefined' && migrationproject_service_1.MigrationProjectService) === 'function' && _c) || Object])
    ], MigrationProjectFormComponent);
    return MigrationProjectFormComponent;
    var _a, _b, _c;
}(formcomponent_component_1.FormComponent));
exports.MigrationProjectFormComponent = MigrationProjectFormComponent;


/***/ },

/***/ 317:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {"use strict";
var core_1 = __webpack_require__(1);
var modalID = 0;
var ModalDialogComponent = (function () {
    function ModalDialogComponent() {
        this.id = "modal-" + modalID++;
    }
    ModalDialogComponent.prototype.show = function () {
        $("#" + this.id).modal('show');
    };
    ModalDialogComponent.prototype.hide = function () {
        $("#" + this.id).modal('hide');
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ModalDialogComponent.prototype, "id", void 0);
    ModalDialogComponent = __decorate([
        core_1.Component({
            selector: 'modal-dialog',
            template: "\n    <div id=\"{{id}}\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" [attr.aria-labelledby]=\"title\" aria-hidden=\"true\">\n        <div class=\"modal-dialog modal-lg\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                        <span class=\"pficon pficon-close\"></span>\n                    </button>\n                    <h4 class=\"modal-title\">\n                        <ng-content select=\"[header]\"></ng-content>\n                    </h4>\n                </div>\n                <div class=\"modal-body\">\n                    <ng-content select=\"[body]\"></ng-content>\n                </div>\n                <div class=\"modal-footer\">\n                    <ng-content select=\"[footer]\"></ng-content>\n                </div>\n            </div>\n        </div>\n    </div>\n"
        }), 
        __metadata('design:paramtypes', [])
    ], ModalDialogComponent);
    return ModalDialogComponent;
}());
exports.ModalDialogComponent = ModalDialogComponent;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ },

/***/ 318:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var router_1 = __webpack_require__(30);
var migrationproject_service_1 = __webpack_require__(83);
var ProjectListComponent = (function () {
    function ProjectListComponent(_router, _migrationProjectService) {
        this._router = _router;
        this._migrationProjectService = _migrationProjectService;
    }
    ProjectListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getMigrationProjects();
        this._refreshIntervalID = setInterval(function () { return _this.getMigrationProjects(); }, 30000);
    };
    ProjectListComponent.prototype.ngOnDestroy = function () {
        if (this._refreshIntervalID)
            clearInterval(this._refreshIntervalID);
    };
    ProjectListComponent.prototype.getMigrationProjects = function () {
        var _this = this;
        return this._migrationProjectService.getAll().subscribe(function (applications) { return _this.projectsLoaded(applications); }, function (error) {
            if (error instanceof ProgressEvent)
                _this.errorMessage = "ERROR: Server disconnected";
            else
                _this.errorMessage = error;
        });
    };
    ProjectListComponent.prototype.projectsLoaded = function (projects) {
        this.errorMessage = "";
        this.projects = projects;
    };
    ProjectListComponent.prototype.createMigrationProject = function () {
        this._router.navigate(['/migration-project-form']);
    };
    ProjectListComponent.prototype.editProject = function (project, event) {
        event.preventDefault();
        this._router.navigate(['/migration-project-form', { projectID: project.id }]);
    };
    ProjectListComponent.prototype.viewProject = function (project, event) {
        event.preventDefault();
        console.log(JSON.stringify(project));
        this._router.navigate(['/group-list', { projectID: project.id }]);
    };
    ProjectListComponent = __decorate([
        core_1.Component({
            selector: 'application-list',
            template: __webpack_require__(521)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof migrationproject_service_1.MigrationProjectService !== 'undefined' && migrationproject_service_1.MigrationProjectService) === 'function' && _b) || Object])
    ], ProjectListComponent);
    return ProjectListComponent;
    var _a, _b;
}());
exports.ProjectListComponent = ProjectListComponent;


/***/ },

/***/ 319:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var TechnologiesReport = (function () {
    function TechnologiesReport() {
    }
    TechnologiesReport = __decorate([
        core_1.Component({
            selector: 'wu-technologies-report',
            template: __webpack_require__(522)
        }), 
        __metadata('design:paramtypes', [])
    ], TechnologiesReport);
    return TechnologiesReport;
}());
exports.TechnologiesReport = TechnologiesReport;


/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NG_VALUE_ACCESSOR; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Used to provide a {@link ControlValueAccessor} for form controls.
 *
 * See {@link DefaultValueAccessor} for how to implement one.
 * @stable
 */
var NG_VALUE_ACCESSOR = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('NgValueAccessor');
//# sourceMappingURL=control_value_accessor.js.map

/***/ },

/***/ 320:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {"use strict";
var core_1 = __webpack_require__(1);
var windup_services_1 = __webpack_require__(209);
var RulesModalComponent = (function () {
    function RulesModalComponent() {
        this.ruleProviderEntity = {};
    }
    RulesModalComponent.prototype.show = function () {
        $('#rulesModal').modal();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof windup_services_1.RuleProviderEntity !== 'undefined' && windup_services_1.RuleProviderEntity) === 'function' && _a) || Object)
    ], RulesModalComponent.prototype, "ruleProviderEntity", void 0);
    RulesModalComponent = __decorate([
        core_1.Component({
            selector: 'rules-modal',
            template: __webpack_require__(523)
        }), 
        __metadata('design:paramtypes', [])
    ], RulesModalComponent);
    return RulesModalComponent;
    var _a;
}());
exports.RulesModalComponent = RulesModalComponent;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ },

/***/ 321:
/***/ function(module, exports) {

"use strict";
"use strict";
var ConfirmDeactivateGuard = (function () {
    function ConfirmDeactivateGuard() {
    }
    ConfirmDeactivateGuard.prototype.canDeactivate = function (target, route, state) {
        console.log("Can deactivate with target: " + target + " dirty? " + target.dirty);
        if (target.dirty) {
            return window.confirm('Leaving the form will revert any changes. Do you want to continue?');
        }
        return true;
    };
    return ConfirmDeactivateGuard;
}());
exports.ConfirmDeactivateGuard = ConfirmDeactivateGuard;


/***/ },

/***/ 322:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var AnalysisContextService = (function (_super) {
    __extends(AnalysisContextService, _super);
    function AnalysisContextService(_http) {
        _super.call(this);
        this._http = _http;
        this.GET_URL = "/analysis-context/get";
        this.CREATE_URL = "/analysis-context/create";
        this.UPDATE_URL = "/analysis-context/update";
    }
    AnalysisContextService.prototype.create = function (analysisContext) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = JSON.stringify(analysisContext);
        return this._http.put(constants_1.Constants.REST_BASE + this.CREATE_URL, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    AnalysisContextService.prototype.update = function (analysisContext) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = JSON.stringify(analysisContext);
        return this._http.put(constants_1.Constants.REST_BASE + this.UPDATE_URL, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    AnalysisContextService.prototype.get = function (id) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_URL + "/" + id, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    AnalysisContextService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], AnalysisContextService);
    return AnalysisContextService;
    var _a;
}(abtract_service_1.AbstractService));
exports.AnalysisContextService = AnalysisContextService;


/***/ },

/***/ 323:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var MigrationPathService = (function (_super) {
    __extends(MigrationPathService, _super);
    function MigrationPathService(_http) {
        _super.call(this);
        this._http = _http;
        this.GET_ALL_URL = "/migration-paths";
    }
    MigrationPathService.prototype.getAll = function () {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_ALL_URL, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    MigrationPathService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], MigrationPathService);
    return MigrationPathService;
    var _a;
}(abtract_service_1.AbstractService));
exports.MigrationPathService = MigrationPathService;


/***/ },

/***/ 324:
/***/ function(module, exports) {

"use strict";
"use strict";
(function (NotificationLevel) {
    NotificationLevel[NotificationLevel["WARNING"] = 0] = "WARNING";
    NotificationLevel[NotificationLevel["INFO"] = 1] = "INFO";
    NotificationLevel[NotificationLevel["ERROR"] = 2] = "ERROR";
    NotificationLevel[NotificationLevel["SUCCESS"] = 3] = "SUCCESS"; //= 'success'
})(exports.NotificationLevel || (exports.NotificationLevel = {}));
var NotificationLevel = exports.NotificationLevel;
var Notification = (function () {
    function Notification(_message, _level) {
        this._message = _message;
        this._level = _level;
    }
    Object.defineProperty(Notification.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Notification.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: true,
        configurable: true
    });
    return Notification;
}());
exports.Notification = Notification;


/***/ },

/***/ 325:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var RuleService = (function (_super) {
    __extends(RuleService, _super);
    function RuleService(_http) {
        _super.call(this);
        this._http = _http;
        this.GET_ALL_RULE_PROVIDERS_URL = "/rules/allProviders";
        this.GET_RULE_PROVIDERS_BY_RULES_PATH_URL = "/rules/by-rules-path/";
    }
    RuleService.prototype.getAll = function () {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_ALL_RULE_PROVIDERS_URL, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    RuleService.prototype.getByRulesPath = function (rulesPath) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        var url = constants_1.Constants.REST_BASE + this.GET_RULE_PROVIDERS_BY_RULES_PATH_URL + rulesPath.id;
        return this._http.get(url, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    RuleService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], RuleService);
    return RuleService;
    var _a;
}(abtract_service_1.AbstractService));
exports.RuleService = RuleService;


/***/ },

/***/ 326:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var WindupService = (function (_super) {
    __extends(WindupService, _super);
    function WindupService(_http) {
        _super.call(this);
        this._http = _http;
        this.EXECUTE_GROUP_PATH = "/windup/executeGroup";
        this.GET_STATUS_GROUP_PATH = "/windup/statusGroup/";
    }
    WindupService.prototype.getStatusGroup = function (executionID) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        var url = constants_1.Constants.REST_BASE + this.GET_STATUS_GROUP_PATH + executionID;
        return this._http.get(url, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    WindupService.prototype.executeWindupGroup = function (groupID) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        var body = JSON.stringify(groupID);
        return this._http.post(constants_1.Constants.REST_BASE + this.EXECUTE_GROUP_PATH, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    WindupService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], WindupService);
    return WindupService;
    var _a;
}(abtract_service_1.AbstractService));
exports.WindupService = WindupService;


/***/ },

/***/ 327:
/***/ function(module, exports) {

module.exports = "<h1>{{labels.heading}}</h1>\n<form [formGroup]=\"registrationForm\" (ngSubmit)=\"register()\"  class=\"form-horizontal\" ng2FileDrop [uploader]=\"multipartUploader\">\n    <div *ngFor=\"let errorMessage of errorMessages\" class=\"row form-errors alert alert-danger\">\n        <div class=\"col-md-2\">&nbsp;</div>\n        <div class=\"col-md-10\">\n            <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n            {{errorMessage}}\n        </div>\n    </div>\n\n    <div [ngSwitch]=\"mode\">\n        <div class=\"form-group\">\n            <label class=\"col-md-2 control-label\" for=\"fileUpload\">Mode</label>\n            <div class=\"col-md-6\">\n                <select [ngModel]=\"mode\" (change)=\"modeChanged($event.target.value)\" [ngModelOptions]=\"{standalone: true}\">\n                    <option value=\"UPLOADED\">Upload</option>\n                    <option value=\"PATH\">Register Server Path</option>\n                </select>\n            </div>\n        </div>\n        <div *ngSwitchCase=\"'PATH'\" class=\"form-group\" [ngClass]=\"{'has-error': hasError(registrationForm.get('inputPath'))}\">\n            <label class=\"col-md-2 control-label\" for=\"fileUpload\">Upload Application</label>\n            <div class=\"col-md-6\">\n                <input\n                        [(ngModel)]=\"fileInputPath\"\n                        formControlName=\"inputPath\"\n                        type=\"text\"\n                        id=\"textInput\"\n                        class=\"form-control\">\n                <span [class.hidden]=\"!hasError(registrationForm.get('inputPath'))\" class=\"help-block\">\n                    The input path must exist on the server.\n                </span>\n            </div>\n        </div>\n        <div class=\"form-group\"  *ngIf=\"isMultiple && mode === 'PATH'\">\n            <div class=\"col-sm-offset-2 col-sm-10\">\n                <div class=\"checkbox\">\n                    <label>\n                        <input\n                                [(ngModel)]=\"isDirectory\"\n                                formControlName=\"isDirectory\"\n                                type=\"checkbox\">\n                        Create new applications from files in directory\n                    </label>\n                </div>\n            </div>\n        </div>\n        <div *ngSwitchCase=\"'UPLOADED'\" class=\"form-group\" [ngClass]=\"{'has-error': hasError(registrationForm.get('fileUpload'))}\">\n            <label class=\"col-md-2 control-label\" for=\"fileUpload\">Upload Application</label>\n            <div class=\"col-md-6\">\n                <input id=\"fileUpload\" type=\"file\" [attr.multiple]=\"isMultiple ? true : null\" ng2FileSelect [uploader]=\"multipartUploader\" class=\"form-control\" name=\"files\" />\n                <div ng2FileDrop [uploader]=\"multipartUploader\" style=\"border: dotted 3px lightgray;\" class=\"well\">\n                    <strong>Drop files here</strong>\n                </div>\n            </div>\n        </div>\n\n        <div *ngSwitchCase=\"'UPLOADED'\"  class=\"col-md-6 col-md-offset-2\">\n            <app-upload-queue *ngIf=\"isMultiple\" [uploader]=\"multipartUploader\"></app-upload-queue>\n            <app-upload-progressbar [uploader]=\"multipartUploader\"></app-upload-progressbar>\n        </div>\n\n        <div class=\"form-group\">\n            <div class=\"col-md-10 col-md-offset-2\">\n                <button class=\"btn btn-primary\" type=\"submit\">{{labels.submitButton}}</button>\n                <button (click)=\"cancelRegistration()\" type=\"button\" class=\"btn btn-default\">Cancel</button>\n            </div>\n        </div>\n    </div>\n</form>\n";

/***/ },

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_toPromise__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__private_import_core__ = __webpack_require__(287);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return NG_VALIDATORS; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return NG_ASYNC_VALIDATORS; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Validators; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */





/**
 * Providers for validators to be used for {@link FormControl}s in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * ### Example
 *
 * {@example core/forms/ts/ng_validators/ng_validators.ts region='ng_validators'}
 * @stable
 */
var NG_VALIDATORS = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('NgValidators');
/**
 * Providers for asynchronous validators to be used for {@link FormControl}s
 * in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * See {@link NG_VALIDATORS} for more details.
 *
 * @stable
 */
var NG_ASYNC_VALIDATORS = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('NgAsyncValidators');
/**
 * Provides a set of validators used by form controls.
 *
 * A validator is a function that processes a {@link FormControl} or collection of
 * controls and returns a map of errors. A null map means that validation has passed.
 *
 * ### Example
 *
 * ```typescript
 * var loginControl = new FormControl("", Validators.required)
 * ```
 *
 * @stable
 */
var Validators = (function () {
    function Validators() {
    }
    /**
     * Validator that requires controls to have a non-empty value.
     */
    Validators.required = function (control) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["b" /* isBlank */])(control.value) || (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["f" /* isString */])(control.value) && control.value == '') ?
            { 'required': true } :
            null;
    };
    /**
     * Validator that requires controls to have a value of a minimum length.
     */
    Validators.minLength = function (minLength) {
        return function (control) {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["a" /* isPresent */])(Validators.required(control)))
                return null;
            var v = control.value;
            return v.length < minLength ?
                { 'minlength': { 'requiredLength': minLength, 'actualLength': v.length } } :
                null;
        };
    };
    /**
     * Validator that requires controls to have a value of a maximum length.
     */
    Validators.maxLength = function (maxLength) {
        return function (control) {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["a" /* isPresent */])(Validators.required(control)))
                return null;
            var v = control.value;
            return v.length > maxLength ?
                { 'maxlength': { 'requiredLength': maxLength, 'actualLength': v.length } } :
                null;
        };
    };
    /**
     * Validator that requires a control to match a regex to its value.
     */
    Validators.pattern = function (pattern) {
        return function (control) {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["a" /* isPresent */])(Validators.required(control)))
                return null;
            var regex = new RegExp("^" + pattern + "$");
            var v = control.value;
            return regex.test(v) ? null :
                { 'pattern': { 'requiredPattern': "^" + pattern + "$", 'actualValue': v } };
        };
    };
    /**
     * No-op validator.
     */
    Validators.nullValidator = function (c) { return null; };
    /**
     * Compose multiple validators into a single function that returns the union
     * of the individual error maps.
     */
    Validators.compose = function (validators) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["b" /* isBlank */])(validators))
            return null;
        var presentValidators = validators.filter(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["a" /* isPresent */]);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            return _mergeErrors(_executeValidators(control, presentValidators));
        };
    };
    Validators.composeAsync = function (validators) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["b" /* isBlank */])(validators))
            return null;
        var presentValidators = validators.filter(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["a" /* isPresent */]);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            var promises = _executeAsyncValidators(control, presentValidators).map(_convertToPromise);
            return Promise.all(promises).then(_mergeErrors);
        };
    };
    return Validators;
}());
function _convertToPromise(obj) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__private_import_core__["a" /* isPromise */])(obj) ? obj : __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_toPromise__["toPromise"].call(obj);
}
function _executeValidators(control, validators) {
    return validators.map(function (v) { return v(control); });
}
function _executeAsyncValidators(control, validators) {
    return validators.map(function (v) { return v(control); });
}
function _mergeErrors(arrayOfErrors) {
    var res = arrayOfErrors.reduce(function (res, errors) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["a" /* isPresent */])(errors) ? __WEBPACK_IMPORTED_MODULE_2__facade_collection__["a" /* StringMapWrapper */].merge(res, errors) : res;
    }, {});
    return __WEBPACK_IMPORTED_MODULE_2__facade_collection__["a" /* StringMapWrapper */].isEmpty(res) ? null : res;
}
//# sourceMappingURL=validators.js.map

/***/ },

/***/ 331:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(1);
var file_uploader_class_1 = __webpack_require__(210);
var FileDropDirective = (function () {
    function FileDropDirective(element) {
        this.fileOver = new core_1.EventEmitter();
        this.onFileDrop = new core_1.EventEmitter();
        this.element = element;
    }
    FileDropDirective.prototype.getOptions = function () {
        return this.uploader.options;
    };
    FileDropDirective.prototype.getFilters = function () {
        return {};
    };
    FileDropDirective.prototype.onDrop = function (event) {
        var transfer = this._getTransfer(event);
        if (!transfer) {
            return;
        }
        var options = this.getOptions();
        var filters = this.getFilters();
        this._preventAndStop(event);
        this.uploader.addToQueue(transfer.files, options, filters);
        this.fileOver.emit(false);
        this.onFileDrop.emit(transfer.files);
    };
    FileDropDirective.prototype.onDragOver = function (event) {
        var transfer = this._getTransfer(event);
        if (!this._haveFiles(transfer.types)) {
            return;
        }
        transfer.dropEffect = 'copy';
        this._preventAndStop(event);
        this.fileOver.emit(true);
    };
    FileDropDirective.prototype.onDragLeave = function (event) {
        if (event.currentTarget === this.element[0]) {
            return;
        }
        this._preventAndStop(event);
        this.fileOver.emit(false);
    };
    FileDropDirective.prototype._getTransfer = function (event) {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
    };
    FileDropDirective.prototype._preventAndStop = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    FileDropDirective.prototype._haveFiles = function (types) {
        if (!types) {
            return false;
        }
        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        }
        else if (types.contains) {
            return types.contains('Files');
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', file_uploader_class_1.FileUploader)
    ], FileDropDirective.prototype, "uploader", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], FileDropDirective.prototype, "fileOver", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], FileDropDirective.prototype, "onFileDrop", void 0);
    __decorate([
        core_1.HostListener('drop', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], FileDropDirective.prototype, "onDrop", null);
    __decorate([
        core_1.HostListener('dragover', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], FileDropDirective.prototype, "onDragOver", null);
    __decorate([
        core_1.HostListener('dragleave', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', Object)
    ], FileDropDirective.prototype, "onDragLeave", null);
    FileDropDirective = __decorate([
        core_1.Directive({ selector: '[ng2FileDrop]' }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], FileDropDirective);
    return FileDropDirective;
}());
exports.FileDropDirective = FileDropDirective;


/***/ },

/***/ 332:
/***/ function(module, exports) {

"use strict";
"use strict";
function isElement(node) {
    return !!(node && (node.nodeName || node.prop && node.attr && node.find));
}
var FileLikeObject = (function () {
    function FileLikeObject(fileOrInput) {
        var isInput = isElement(fileOrInput);
        var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
        var postfix = typeof fakePathOrObject === 'string' ? 'FakePath' : 'Object';
        var method = '_createFrom' + postfix;
        this[method](fakePathOrObject);
    }
    FileLikeObject.prototype._createFromFakePath = function (path) {
        this.lastModifiedDate = void 0;
        this.size = void 0;
        this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
    };
    FileLikeObject.prototype._createFromObject = function (object) {
        // this.lastModifiedDate = copy(object.lastModifiedDate);
        this.size = object.size;
        this.type = object.type;
        this.name = object.name;
    };
    return FileLikeObject;
}());
exports.FileLikeObject = FileLikeObject;


/***/ },

/***/ 333:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(1);
var file_uploader_class_1 = __webpack_require__(210);
// todo: filters
var FileSelectDirective = (function () {
    function FileSelectDirective(element) {
        this.element = element;
    }
    FileSelectDirective.prototype.getOptions = function () {
        return this.uploader.options;
    };
    FileSelectDirective.prototype.getFilters = function () {
        return void 0;
    };
    FileSelectDirective.prototype.isEmptyAfterSelection = function () {
        return !!this.element.nativeElement.attributes.multiple;
    };
    FileSelectDirective.prototype.onChange = function () {
        // let files = this.uploader.isHTML5 ? this.element.nativeElement[0].files : this.element.nativeElement[0];
        var files = this.element.nativeElement.files;
        var options = this.getOptions();
        var filters = this.getFilters();
        // if(!this.uploader.isHTML5) this.destroy();
        this.uploader.addToQueue(files, options, filters);
        if (this.isEmptyAfterSelection()) {
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', file_uploader_class_1.FileUploader)
    ], FileSelectDirective.prototype, "uploader", void 0);
    __decorate([
        core_1.HostListener('change'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', Object)
    ], FileSelectDirective.prototype, "onChange", null);
    FileSelectDirective = __decorate([
        core_1.Directive({ selector: '[ng2FileSelect]' }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], FileSelectDirective);
    return FileSelectDirective;
}());
exports.FileSelectDirective = FileSelectDirective;


/***/ },

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var Observable_1 = __webpack_require__(0);
var AbstractService = (function () {
    function AbstractService() {
    }
    AbstractService.prototype.handleError = function (error) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error("Service error: (" + typeof error + ") " + error);
        var json;
        try {
            json = error.json();
            console.error("Service error - JSON: " + JSON.stringify(json));
        }
        catch (ex) {
            console.error("Service error - can't JSON: " + ex.message);
        }
        return Observable_1.Observable.throw(json);
    };
    AbstractService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], AbstractService);
    return AbstractService;
}());
exports.AbstractService = AbstractService;


/***/ },

/***/ 370:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var platform_browser_1 = __webpack_require__(90);
var http_1 = __webpack_require__(25);
var forms_1 = __webpack_require__(74);
__webpack_require__(224);
var ng2_file_upload_1 = __webpack_require__(127);
var app_component_1 = __webpack_require__(496);
var app_routing_1 = __webpack_require__(494);
var projectlist_component_1 = __webpack_require__(318);
var analysiscontextform_component_1 = __webpack_require__(311);
var applicationgroupform_component_1 = __webpack_require__(312);
var grouplist_component_1 = __webpack_require__(315);
var migrationprojectform_component_1 = __webpack_require__(316);
var registerapplicationform_component_1 = __webpack_require__(205);
var progressbar_component_1 = __webpack_require__(503);
var navbar_component_1 = __webpack_require__(500);
var breadcrumbs_component_1 = __webpack_require__(497);
var configuration_service_1 = __webpack_require__(123);
var analysiscontext_service_1 = __webpack_require__(322);
var applicationgroup_service_1 = __webpack_require__(62);
var file_service_1 = __webpack_require__(124);
var migrationpath_service_1 = __webpack_require__(323);
var migrationproject_service_1 = __webpack_require__(83);
var registeredapplication_service_1 = __webpack_require__(125);
var windup_service_1 = __webpack_require__(326);
var rule_service_1 = __webpack_require__(325);
var configuration_component_1 = __webpack_require__(313);
var technology_component_1 = __webpack_require__(504);
var rules_modal_component_1 = __webpack_require__(320);
var add_rules_path_modal_component_1 = __webpack_require__(310);
var confirmation_modal_component_1 = __webpack_require__(498);
var custom_rule_selection_component_1 = __webpack_require__(499);
var keycloak_service_1 = __webpack_require__(67);
var windup_http_service_1 = __webpack_require__(508);
var edit_application_form_component_1 = __webpack_require__(314);
var upload_queue_component_1 = __webpack_require__(506);
var upload_progressbar_component_1 = __webpack_require__(505);
var analysis_context_advanced_options_modal_component_1 = __webpack_require__(495);
var configuration_options_service_1 = __webpack_require__(206);
var modal_dialog_component_1 = __webpack_require__(317);
var notification_service_1 = __webpack_require__(207);
var notification_component_1 = __webpack_require__(501);
var confirm_deactivate_guard_1 = __webpack_require__(321);
var popover_component_1 = __webpack_require__(502);
var technologies_report_1 = __webpack_require__(319);
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                http_1.HttpModule,
                app_routing_1.routing
            ],
            declarations: [
                // pages
                app_component_1.AppComponent,
                analysiscontextform_component_1.AnalysisContextFormComponent,
                applicationgroupform_component_1.ApplicationGroupForm,
                configuration_component_1.ConfigurationComponent,
                grouplist_component_1.GroupListComponent,
                migrationprojectform_component_1.MigrationProjectFormComponent,
                projectlist_component_1.ProjectListComponent,
                registerapplicationform_component_1.RegisterApplicationFormComponent,
                edit_application_form_component_1.EditApplicationFormComponent,
                // Reports
                technologies_report_1.TechnologiesReport,
                // Components
                add_rules_path_modal_component_1.AddRulesPathModalComponent,
                analysis_context_advanced_options_modal_component_1.AnalysisContextAdvancedOptionsModalComponent,
                breadcrumbs_component_1.BreadCrumbsComponent,
                confirmation_modal_component_1.ConfirmationModalComponent,
                modal_dialog_component_1.ModalDialogComponent,
                navbar_component_1.NavbarComponent,
                progressbar_component_1.ProgressBarComponent,
                rules_modal_component_1.RulesModalComponent,
                technology_component_1.TechnologyComponent,
                ng2_file_upload_1.FileSelectDirective,
                ng2_file_upload_1.FileDropDirective,
                upload_queue_component_1.UploadQueueComponent,
                upload_progressbar_component_1.UploadProgressbarComponent,
                custom_rule_selection_component_1.CustomRuleSelectionComponent,
                notification_component_1.NotificationComponent,
                popover_component_1.PopoverComponent
            ],
            providers: [
                app_routing_1.appRoutingProviders,
                keycloak_service_1.KeycloakService,
                analysiscontext_service_1.AnalysisContextService,
                applicationgroup_service_1.ApplicationGroupService,
                configuration_service_1.ConfigurationService,
                configuration_options_service_1.ConfigurationOptionsService,
                confirm_deactivate_guard_1.ConfirmDeactivateGuard,
                file_service_1.FileService,
                migrationpath_service_1.MigrationPathService,
                migrationproject_service_1.MigrationProjectService,
                registeredapplication_service_1.RegisteredApplicationService,
                rule_service_1.RuleService,
                windup_service_1.WindupService,
                notification_service_1.NotificationService,
                {
                    provide: http_1.Http,
                    useFactory: function (backend, defaultOptions, keycloakService) {
                        return new windup_http_service_1.WindupHttpService(backend, defaultOptions, keycloakService);
                    },
                    deps: [http_1.XHRBackend, http_1.RequestOptions, keycloak_service_1.KeycloakService]
                },
                {
                    provide: ng2_file_upload_1.FileUploader,
                    useValue: new ng2_file_upload_1.FileUploader({})
                }
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ },

/***/ 375:
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ 377:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "keycloak.json";

/***/ },

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_control_directive__ = __webpack_require__(187);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ControlContainer; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * A directive that contains multiple {@link NgControl}s.
 *
 * Only used by the forms module.
 *
 * @stable
 */
var ControlContainer = (function (_super) {
    __extends(ControlContainer, _super);
    function ControlContainer() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ControlContainer.prototype, "formDirective", {
        /**
         * Get the form to which this container belongs.
         */
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlContainer.prototype, "path", {
        /**
         * Get the path to this container.
         */
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    return ControlContainer;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_control_directive__["a" /* AbstractControlDirective */]));
//# sourceMappingURL=control_container.js.map

/***/ },

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lang__ = __webpack_require__(21);
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return MapWrapper; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return StringMapWrapper; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return ListWrapper; });
/* unused harmony export isListLikeIterable */
/* unused harmony export areIterablesEqual */
/* unused harmony export iterateListLike */
/* unused harmony export SetWrapper */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// Safari and Internet Explorer do not support the iterable parameter to the
// Map constructor.  We work around that by manually adding the items.
var createMapFromPairs = (function () {
    try {
        if (new Map([[1, 2]]).size === 1) {
            return function createMapFromPairs(pairs) { return new Map(pairs); };
        }
    }
    catch (e) {
    }
    return function createMapAndPopulateFromPairs(pairs) {
        var map = new Map();
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            map.set(pair[0], pair[1]);
        }
        return map;
    };
})();
var createMapFromMap = (function () {
    try {
        if (new Map(new Map())) {
            return function createMapFromMap(m) { return new Map(m); };
        }
    }
    catch (e) {
    }
    return function createMapAndPopulateFromMap(m) {
        var map = new Map();
        m.forEach(function (v, k) { map.set(k, v); });
        return map;
    };
})();
var _clearValues = (function () {
    if ((new Map()).keys().next) {
        return function _clearValues(m) {
            var keyIterator = m.keys();
            var k;
            while (!((k = keyIterator.next()).done)) {
                m.set(k.value, null);
            }
        };
    }
    else {
        return function _clearValuesWithForeEach(m) {
            m.forEach(function (v, k) { m.set(k, null); });
        };
    }
})();
// Safari doesn't implement MapIterator.next(), which is used is Traceur's polyfill of Array.from
// TODO(mlaval): remove the work around once we have a working polyfill of Array.from
var _arrayFromMap = (function () {
    try {
        if ((new Map()).values().next) {
            return function createArrayFromMap(m, getValues) {
                return getValues ? Array.from(m.values()) : Array.from(m.keys());
            };
        }
    }
    catch (e) {
    }
    return function createArrayFromMapWithForeach(m, getValues) {
        var res = new Array(m.size), i = 0;
        m.forEach(function (v, k) {
            res[i] = getValues ? v : k;
            i++;
        });
        return res;
    };
})();
var MapWrapper = (function () {
    function MapWrapper() {
    }
    MapWrapper.createFromStringMap = function (stringMap) {
        var result = new Map();
        for (var prop in stringMap) {
            result.set(prop, stringMap[prop]);
        }
        return result;
    };
    MapWrapper.toStringMap = function (m) {
        var r = {};
        m.forEach(function (v, k) { return r[k] = v; });
        return r;
    };
    MapWrapper.createFromPairs = function (pairs) { return createMapFromPairs(pairs); };
    MapWrapper.iterable = function (m) { return m; };
    MapWrapper.keys = function (m) { return _arrayFromMap(m, false); };
    MapWrapper.values = function (m) { return _arrayFromMap(m, true); };
    return MapWrapper;
}());
/**
 * Wraps Javascript Objects
 */
var StringMapWrapper = (function () {
    function StringMapWrapper() {
    }
    StringMapWrapper.get = function (map, key) {
        return map.hasOwnProperty(key) ? map[key] : undefined;
    };
    StringMapWrapper.set = function (map, key, value) { map[key] = value; };
    StringMapWrapper.keys = function (map) { return Object.keys(map); };
    StringMapWrapper.values = function (map) {
        return Object.keys(map).map(function (k) { return map[k]; });
    };
    StringMapWrapper.isEmpty = function (map) {
        for (var prop in map) {
            return false;
        }
        return true;
    };
    StringMapWrapper.forEach = function (map, callback) {
        for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
            var k = _a[_i];
            callback(map[k], k);
        }
    };
    StringMapWrapper.merge = function (m1, m2) {
        var m = {};
        for (var _i = 0, _a = Object.keys(m1); _i < _a.length; _i++) {
            var k = _a[_i];
            m[k] = m1[k];
        }
        for (var _b = 0, _c = Object.keys(m2); _b < _c.length; _b++) {
            var k = _c[_b];
            m[k] = m2[k];
        }
        return m;
    };
    StringMapWrapper.equals = function (m1, m2) {
        var k1 = Object.keys(m1);
        var k2 = Object.keys(m2);
        if (k1.length != k2.length) {
            return false;
        }
        for (var i = 0; i < k1.length; i++) {
            var key = k1[i];
            if (m1[key] !== m2[key]) {
                return false;
            }
        }
        return true;
    };
    return StringMapWrapper;
}());
var ListWrapper = (function () {
    function ListWrapper() {
    }
    // JS has no way to express a statically fixed size list, but dart does so we
    // keep both methods.
    ListWrapper.createFixedSize = function (size) { return new Array(size); };
    ListWrapper.createGrowableSize = function (size) { return new Array(size); };
    ListWrapper.clone = function (array) { return array.slice(0); };
    ListWrapper.forEachWithIndex = function (array, fn) {
        for (var i = 0; i < array.length; i++) {
            fn(array[i], i);
        }
    };
    ListWrapper.first = function (array) {
        if (!array)
            return null;
        return array[0];
    };
    ListWrapper.last = function (array) {
        if (!array || array.length == 0)
            return null;
        return array[array.length - 1];
    };
    ListWrapper.indexOf = function (array, value, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        return array.indexOf(value, startIndex);
    };
    ListWrapper.contains = function (list, el) { return list.indexOf(el) !== -1; };
    ListWrapper.reversed = function (array) {
        var a = ListWrapper.clone(array);
        return a.reverse();
    };
    ListWrapper.concat = function (a, b) { return a.concat(b); };
    ListWrapper.insert = function (list, index, value) { list.splice(index, 0, value); };
    ListWrapper.removeAt = function (list, index) {
        var res = list[index];
        list.splice(index, 1);
        return res;
    };
    ListWrapper.removeAll = function (list, items) {
        for (var i = 0; i < items.length; ++i) {
            var index = list.indexOf(items[i]);
            list.splice(index, 1);
        }
    };
    ListWrapper.remove = function (list, el) {
        var index = list.indexOf(el);
        if (index > -1) {
            list.splice(index, 1);
            return true;
        }
        return false;
    };
    ListWrapper.clear = function (list) { list.length = 0; };
    ListWrapper.isEmpty = function (list) { return list.length == 0; };
    ListWrapper.fill = function (list, value, start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = null; }
        list.fill(value, start, end === null ? list.length : end);
    };
    ListWrapper.equals = function (a, b) {
        if (a.length != b.length)
            return false;
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    };
    ListWrapper.slice = function (l, from, to) {
        if (from === void 0) { from = 0; }
        if (to === void 0) { to = null; }
        return l.slice(from, to === null ? undefined : to);
    };
    ListWrapper.splice = function (l, from, length) { return l.splice(from, length); };
    ListWrapper.sort = function (l, compareFn) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["a" /* isPresent */])(compareFn)) {
            l.sort(compareFn);
        }
        else {
            l.sort();
        }
    };
    ListWrapper.toString = function (l) { return l.toString(); };
    ListWrapper.toJSON = function (l) { return JSON.stringify(l); };
    ListWrapper.maximum = function (list, predicate) {
        if (list.length == 0) {
            return null;
        }
        var solution = null;
        var maxValue = -Infinity;
        for (var index = 0; index < list.length; index++) {
            var candidate = list[index];
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["b" /* isBlank */])(candidate)) {
                continue;
            }
            var candidateValue = predicate(candidate);
            if (candidateValue > maxValue) {
                solution = candidate;
                maxValue = candidateValue;
            }
        }
        return solution;
    };
    ListWrapper.flatten = function (list) {
        var target = [];
        _flattenArray(list, target);
        return target;
    };
    ListWrapper.addAll = function (list, source) {
        for (var i = 0; i < source.length; i++) {
            list.push(source[i]);
        }
    };
    return ListWrapper;
}());
function _flattenArray(source, target) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["a" /* isPresent */])(source)) {
        for (var i = 0; i < source.length; i++) {
            var item = source[i];
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["c" /* isArray */])(item)) {
                _flattenArray(item, target);
            }
            else {
                target.push(item);
            }
        }
    }
    return target;
}
function isListLikeIterable(obj) {
    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["d" /* isJsObject */])(obj))
        return false;
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["c" /* isArray */])(obj) ||
        (!(obj instanceof Map) &&
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["e" /* getSymbolIterator */])() in obj); // JS Iterable have a Symbol.iterator prop
}
function areIterablesEqual(a, b, comparator) {
    var iterator1 = a[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["e" /* getSymbolIterator */])()]();
    var iterator2 = b[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["e" /* getSymbolIterator */])()]();
    while (true) {
        var item1 = iterator1.next();
        var item2 = iterator2.next();
        if (item1.done && item2.done)
            return true;
        if (item1.done || item2.done)
            return false;
        if (!comparator(item1.value, item2.value))
            return false;
    }
}
function iterateListLike(obj, fn) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["c" /* isArray */])(obj)) {
        for (var i = 0; i < obj.length; i++) {
            fn(obj[i]);
        }
    }
    else {
        var iterator = obj[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lang__["e" /* getSymbolIterator */])()]();
        var item;
        while (!((item = iterator.next()).done)) {
            fn(item.value);
        }
    }
}
// Safari and Internet Explorer do not support the iterable parameter to the
// Set constructor.  We work around that by manually adding the items.
var createSetFromList = (function () {
    var test = new Set([1, 2, 3]);
    if (test.size === 3) {
        return function createSetFromList(lst) { return new Set(lst); };
    }
    else {
        return function createSetAndPopulateFromList(lst) {
            var res = new Set(lst);
            if (res.size !== lst.length) {
                for (var i = 0; i < lst.length; i++) {
                    res.add(lst[i]);
                }
            }
            return res;
        };
    }
})();
var SetWrapper = (function () {
    function SetWrapper() {
    }
    SetWrapper.createFromList = function (lst) { return createSetFromList(lst); };
    SetWrapper.has = function (s, key) { return s.has(key); };
    SetWrapper.delete = function (m, k) { m.delete(k); };
    return SetWrapper;
}());
//# sourceMappingURL=collection.js.map

/***/ },

/***/ 46:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__checkbox_value_accessor__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__default_value_accessor__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__normalize_validator__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__number_value_accessor__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__radio_control_value_accessor__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__select_control_value_accessor__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__select_multiple_control_value_accessor__ = __webpack_require__(114);
/* harmony export (immutable) */ exports["a"] = controlPath;
/* harmony export (immutable) */ exports["d"] = setUpControl;
/* harmony export (immutable) */ exports["h"] = cleanUpControl;
/* harmony export (immutable) */ exports["e"] = setUpFormContainer;
/* harmony export (immutable) */ exports["b"] = composeValidators;
/* harmony export (immutable) */ exports["c"] = composeAsyncValidators;
/* harmony export (immutable) */ exports["g"] = isPropertyUpdated;
/* unused harmony export isBuiltInAccessor */
/* harmony export (immutable) */ exports["f"] = selectValueAccessor;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */










function controlPath(name, parent) {
    var p = __WEBPACK_IMPORTED_MODULE_0__facade_collection__["b" /* ListWrapper */].clone(parent.path);
    p.push(name);
    return p;
}
function setUpControl(control, dir) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["b" /* isBlank */])(control))
        _throwError(dir, 'Cannot find control with');
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["b" /* isBlank */])(dir.valueAccessor))
        _throwError(dir, 'No value accessor for form control with');
    control.validator = __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].compose([control.validator, dir.validator]);
    control.asyncValidator = __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].composeAsync([control.asyncValidator, dir.asyncValidator]);
    dir.valueAccessor.writeValue(control.value);
    // view -> model
    dir.valueAccessor.registerOnChange(function (newValue) {
        dir.viewToModelUpdate(newValue);
        control.markAsDirty();
        control.setValue(newValue, { emitModelToViewChange: false });
    });
    // touched
    dir.valueAccessor.registerOnTouched(function () { return control.markAsTouched(); });
    control.registerOnChange(function (newValue, emitModelEvent) {
        // control -> view
        dir.valueAccessor.writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    });
    if (dir.valueAccessor.setDisabledState) {
        control.registerOnDisabledChange(function (isDisabled) { dir.valueAccessor.setDisabledState(isDisabled); });
    }
    // re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    dir._rawValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(function () { return control.updateValueAndValidity(); });
    });
    dir._rawAsyncValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(function () { return control.updateValueAndValidity(); });
    });
}
function cleanUpControl(control, dir) {
    dir.valueAccessor.registerOnChange(function () { return _noControlError(dir); });
    dir.valueAccessor.registerOnTouched(function () { return _noControlError(dir); });
    dir._rawValidators.forEach(function (validator) { return validator.registerOnValidatorChange(null); });
    dir._rawAsyncValidators.forEach(function (validator) { return validator.registerOnValidatorChange(null); });
    if (control)
        control._clearChangeFns();
}
function setUpFormContainer(control, dir) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["b" /* isBlank */])(control))
        _throwError(dir, 'Cannot find control with');
    control.validator = __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].compose([control.validator, dir.validator]);
    control.asyncValidator = __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].composeAsync([control.asyncValidator, dir.asyncValidator]);
}
function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
function _throwError(dir, message) {
    var messageEnd;
    if (dir.path.length > 1) {
        messageEnd = "path: '" + dir.path.join(' -> ') + "'";
    }
    else if (dir.path[0]) {
        messageEnd = "name: '" + dir.path + "'";
    }
    else {
        messageEnd = 'unspecified name attribute';
    }
    throw new Error(message + " " + messageEnd);
}
function composeValidators(validators) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(validators) ? __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].compose(validators.map(__WEBPACK_IMPORTED_MODULE_5__normalize_validator__["a" /* normalizeValidator */])) : null;
}
function composeAsyncValidators(validators) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(validators) ? __WEBPACK_IMPORTED_MODULE_2__validators__["a" /* Validators */].composeAsync(validators.map(__WEBPACK_IMPORTED_MODULE_5__normalize_validator__["b" /* normalizeAsyncValidator */])) :
        null;
}
function isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model'))
        return false;
    var change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["i" /* looseIdentical */])(viewModel, change.currentValue);
}
function isBuiltInAccessor(valueAccessor) {
    return (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["j" /* hasConstructor */])(valueAccessor, __WEBPACK_IMPORTED_MODULE_3__checkbox_value_accessor__["a" /* CheckboxControlValueAccessor */]) ||
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["j" /* hasConstructor */])(valueAccessor, __WEBPACK_IMPORTED_MODULE_6__number_value_accessor__["a" /* NumberValueAccessor */]) ||
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["j" /* hasConstructor */])(valueAccessor, __WEBPACK_IMPORTED_MODULE_8__select_control_value_accessor__["a" /* SelectControlValueAccessor */]) ||
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["j" /* hasConstructor */])(valueAccessor, __WEBPACK_IMPORTED_MODULE_9__select_multiple_control_value_accessor__["a" /* SelectMultipleControlValueAccessor */]) ||
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["j" /* hasConstructor */])(valueAccessor, __WEBPACK_IMPORTED_MODULE_7__radio_control_value_accessor__["a" /* RadioControlValueAccessor */]));
}
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
function selectValueAccessor(dir, valueAccessors) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["b" /* isBlank */])(valueAccessors))
        return null;
    var defaultAccessor;
    var builtinAccessor;
    var customAccessor;
    valueAccessors.forEach(function (v) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["j" /* hasConstructor */])(v, __WEBPACK_IMPORTED_MODULE_4__default_value_accessor__["a" /* DefaultValueAccessor */])) {
            defaultAccessor = v;
        }
        else if (isBuiltInAccessor(v)) {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(builtinAccessor))
                _throwError(dir, 'More than one built-in value accessor matches form control with');
            builtinAccessor = v;
        }
        else {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(customAccessor))
                _throwError(dir, 'More than one custom value accessor matches form control with');
            customAccessor = v;
        }
    });
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(customAccessor))
        return customAccessor;
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(builtinAccessor))
        return builtinAccessor;
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__facade_lang__["a" /* isPresent */])(defaultAccessor))
        return defaultAccessor;
    _throwError(dir, 'No valid value accessor for form control with');
    return null;
}
//# sourceMappingURL=shared.js.map

/***/ },

/***/ 462:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__directives_checkbox_value_accessor__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directives_default_value_accessor__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__directives_ng_control_status__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__directives_ng_form__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__directives_ng_model__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__directives_ng_model_group__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__directives_number_value_accessor__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__directives_radio_control_value_accessor__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__directives_reactive_directives_form_control_directive__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__directives_reactive_directives_form_control_name__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__directives_reactive_directives_form_group_directive__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__directives_reactive_directives_form_group_name__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__directives_select_control_value_accessor__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__directives_select_multiple_control_value_accessor__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__directives_validators__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__directives_ng_control__ = __webpack_require__(50);
/* unused harmony export SHARED_FORM_DIRECTIVES */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return TEMPLATE_DRIVEN_DIRECTIVES; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return REACTIVE_DRIVEN_DIRECTIVES; });
/* unused harmony export FORM_DIRECTIVES */
/* unused harmony export REACTIVE_FORM_DIRECTIVES */
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return InternalFormsSharedModule; });
/* unused harmony reexport CheckboxControlValueAccessor */
/* unused harmony reexport DefaultValueAccessor */
/* unused harmony reexport NgControl */
/* unused harmony reexport NgControlStatus */
/* unused harmony reexport NgControlStatusGroup */
/* unused harmony reexport NgForm */
/* unused harmony reexport NgModel */
/* unused harmony reexport NgModelGroup */
/* unused harmony reexport NumberValueAccessor */
/* unused harmony reexport RadioControlValueAccessor */
/* unused harmony reexport FormControlDirective */
/* unused harmony reexport FormControlName */
/* unused harmony reexport FormGroupDirective */
/* unused harmony reexport FormArrayName */
/* unused harmony reexport FormGroupName */
/* unused harmony reexport NgSelectOption */
/* unused harmony reexport SelectControlValueAccessor */
/* unused harmony reexport NgSelectMultipleOption */
/* unused harmony reexport SelectMultipleControlValueAccessor */
/* unused harmony reexport MaxLengthValidator */
/* unused harmony reexport MinLengthValidator */
/* unused harmony reexport PatternValidator */
/* unused harmony reexport RequiredValidator */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
































var SHARED_FORM_DIRECTIVES = [
    __WEBPACK_IMPORTED_MODULE_13__directives_select_control_value_accessor__["b" /* NgSelectOption */], __WEBPACK_IMPORTED_MODULE_14__directives_select_multiple_control_value_accessor__["b" /* NgSelectMultipleOption */], __WEBPACK_IMPORTED_MODULE_2__directives_default_value_accessor__["a" /* DefaultValueAccessor */], __WEBPACK_IMPORTED_MODULE_7__directives_number_value_accessor__["a" /* NumberValueAccessor */],
    __WEBPACK_IMPORTED_MODULE_1__directives_checkbox_value_accessor__["a" /* CheckboxControlValueAccessor */], __WEBPACK_IMPORTED_MODULE_13__directives_select_control_value_accessor__["a" /* SelectControlValueAccessor */], __WEBPACK_IMPORTED_MODULE_14__directives_select_multiple_control_value_accessor__["a" /* SelectMultipleControlValueAccessor */],
    __WEBPACK_IMPORTED_MODULE_8__directives_radio_control_value_accessor__["a" /* RadioControlValueAccessor */], __WEBPACK_IMPORTED_MODULE_3__directives_ng_control_status__["a" /* NgControlStatus */], __WEBPACK_IMPORTED_MODULE_3__directives_ng_control_status__["b" /* NgControlStatusGroup */], __WEBPACK_IMPORTED_MODULE_15__directives_validators__["a" /* RequiredValidator */],
    __WEBPACK_IMPORTED_MODULE_15__directives_validators__["b" /* MinLengthValidator */], __WEBPACK_IMPORTED_MODULE_15__directives_validators__["c" /* MaxLengthValidator */], __WEBPACK_IMPORTED_MODULE_15__directives_validators__["d" /* PatternValidator */]
];
var TEMPLATE_DRIVEN_DIRECTIVES = [__WEBPACK_IMPORTED_MODULE_5__directives_ng_model__["a" /* NgModel */], __WEBPACK_IMPORTED_MODULE_6__directives_ng_model_group__["a" /* NgModelGroup */], __WEBPACK_IMPORTED_MODULE_4__directives_ng_form__["a" /* NgForm */]];
var REACTIVE_DRIVEN_DIRECTIVES = [__WEBPACK_IMPORTED_MODULE_9__directives_reactive_directives_form_control_directive__["a" /* FormControlDirective */], __WEBPACK_IMPORTED_MODULE_11__directives_reactive_directives_form_group_directive__["a" /* FormGroupDirective */], __WEBPACK_IMPORTED_MODULE_10__directives_reactive_directives_form_control_name__["a" /* FormControlName */], __WEBPACK_IMPORTED_MODULE_12__directives_reactive_directives_form_group_name__["a" /* FormGroupName */], __WEBPACK_IMPORTED_MODULE_12__directives_reactive_directives_form_group_name__["b" /* FormArrayName */]];
/**
 *
 * A list of all the form directives used as part of a `@Component` annotation.
 *
 *  This is a shorthand for importing them each individually.
 *
 * ### Example
 *
 * ```typescript
 * @Component({
 *   selector: 'my-app',
 *   directives: [FORM_DIRECTIVES]
 * })
 * class MyApp {}
 * ```
 * @stable
 */
var FORM_DIRECTIVES = [TEMPLATE_DRIVEN_DIRECTIVES, SHARED_FORM_DIRECTIVES];
/**
 * @stable
 */
var REACTIVE_FORM_DIRECTIVES = [REACTIVE_DRIVEN_DIRECTIVES, SHARED_FORM_DIRECTIVES];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
var InternalFormsSharedModule = (function () {
    function InternalFormsSharedModule() {
    }
    InternalFormsSharedModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{ declarations: SHARED_FORM_DIRECTIVES, exports: SHARED_FORM_DIRECTIVES },] },
    ];
    /** @nocollapse */
    InternalFormsSharedModule.ctorParameters = [];
    return InternalFormsSharedModule;
}());
//# sourceMappingURL=directives.js.map

/***/ },

/***/ 463:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = normalizeValidator;
/* harmony export (immutable) */ exports["b"] = normalizeAsyncValidator;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function normalizeValidator(validator) {
    if (validator.validate !== undefined) {
        return function (c) { return validator.validate(c); };
    }
    else {
        return validator;
    }
}
function normalizeAsyncValidator(validator) {
    if (validator.validate !== undefined) {
        return function (c) { return validator.validate(c); };
    }
    else {
        return validator;
    }
}
//# sourceMappingURL=normalize_validator.js.map

/***/ },

/***/ 464:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__directives__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directives_radio_control_value_accessor__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__form_builder__ = __webpack_require__(286);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FormsModule; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return ReactiveFormsModule; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */




/**
 * The ng module for forms.
 * @stable
 */
var FormsModule = (function () {
    function FormsModule() {
    }
    FormsModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    declarations: __WEBPACK_IMPORTED_MODULE_1__directives__["a" /* TEMPLATE_DRIVEN_DIRECTIVES */],
                    providers: [__WEBPACK_IMPORTED_MODULE_2__directives_radio_control_value_accessor__["b" /* RadioControlRegistry */]],
                    exports: [__WEBPACK_IMPORTED_MODULE_1__directives__["b" /* InternalFormsSharedModule */], __WEBPACK_IMPORTED_MODULE_1__directives__["a" /* TEMPLATE_DRIVEN_DIRECTIVES */]]
                },] },
    ];
    /** @nocollapse */
    FormsModule.ctorParameters = [];
    return FormsModule;
}());
/**
 * The ng module for reactive forms.
 * @stable
 */
var ReactiveFormsModule = (function () {
    function ReactiveFormsModule() {
    }
    ReactiveFormsModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    declarations: [__WEBPACK_IMPORTED_MODULE_1__directives__["c" /* REACTIVE_DRIVEN_DIRECTIVES */]],
                    providers: [__WEBPACK_IMPORTED_MODULE_3__form_builder__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_2__directives_radio_control_value_accessor__["b" /* RadioControlRegistry */]],
                    exports: [__WEBPACK_IMPORTED_MODULE_1__directives__["b" /* InternalFormsSharedModule */], __WEBPACK_IMPORTED_MODULE_1__directives__["c" /* REACTIVE_DRIVEN_DIRECTIVES */]]
                },] },
    ];
    /** @nocollapse */
    ReactiveFormsModule.ctorParameters = [];
    return ReactiveFormsModule;
}());
//# sourceMappingURL=form_providers.js.map

/***/ },

/***/ 465:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directives_abstract_control_directive__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__directives_abstract_form_group_directive__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directives_checkbox_value_accessor__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__directives_control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__directives_control_value_accessor__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__directives_default_value_accessor__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__directives_ng_control__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__directives_ng_control_status__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__directives_ng_form__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__directives_ng_model__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__directives_ng_model_group__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__directives_radio_control_value_accessor__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__directives_reactive_directives_form_control_directive__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__directives_reactive_directives_form_control_name__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__directives_reactive_directives_form_group_directive__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__directives_reactive_directives_form_group_name__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__directives_select_control_value_accessor__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__directives_select_multiple_control_value_accessor__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__directives_validators__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__form_builder__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__model__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__form_providers__ = __webpack_require__(464);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__directives_abstract_control_directive__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__directives_abstract_form_group_directive__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__directives_checkbox_value_accessor__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "d", function() { return __WEBPACK_IMPORTED_MODULE_3__directives_control_container__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "e", function() { return __WEBPACK_IMPORTED_MODULE_4__directives_control_value_accessor__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "f", function() { return __WEBPACK_IMPORTED_MODULE_5__directives_default_value_accessor__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "g", function() { return __WEBPACK_IMPORTED_MODULE_6__directives_ng_control__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "h", function() { return __WEBPACK_IMPORTED_MODULE_7__directives_ng_control_status__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "i", function() { return __WEBPACK_IMPORTED_MODULE_7__directives_ng_control_status__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "j", function() { return __WEBPACK_IMPORTED_MODULE_8__directives_ng_form__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "k", function() { return __WEBPACK_IMPORTED_MODULE_9__directives_ng_model__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "l", function() { return __WEBPACK_IMPORTED_MODULE_10__directives_ng_model_group__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "m", function() { return __WEBPACK_IMPORTED_MODULE_11__directives_radio_control_value_accessor__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "n", function() { return __WEBPACK_IMPORTED_MODULE_12__directives_reactive_directives_form_control_directive__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "o", function() { return __WEBPACK_IMPORTED_MODULE_13__directives_reactive_directives_form_control_name__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "p", function() { return __WEBPACK_IMPORTED_MODULE_14__directives_reactive_directives_form_group_directive__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "q", function() { return __WEBPACK_IMPORTED_MODULE_15__directives_reactive_directives_form_group_name__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "r", function() { return __WEBPACK_IMPORTED_MODULE_15__directives_reactive_directives_form_group_name__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "s", function() { return __WEBPACK_IMPORTED_MODULE_16__directives_select_control_value_accessor__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "t", function() { return __WEBPACK_IMPORTED_MODULE_16__directives_select_control_value_accessor__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "u", function() { return __WEBPACK_IMPORTED_MODULE_17__directives_select_multiple_control_value_accessor__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "v", function() { return __WEBPACK_IMPORTED_MODULE_18__directives_validators__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "w", function() { return __WEBPACK_IMPORTED_MODULE_18__directives_validators__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "x", function() { return __WEBPACK_IMPORTED_MODULE_18__directives_validators__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "y", function() { return __WEBPACK_IMPORTED_MODULE_18__directives_validators__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "z", function() { return __WEBPACK_IMPORTED_MODULE_19__form_builder__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "A", function() { return __WEBPACK_IMPORTED_MODULE_20__model__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "B", function() { return __WEBPACK_IMPORTED_MODULE_20__model__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "C", function() { return __WEBPACK_IMPORTED_MODULE_20__model__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "D", function() { return __WEBPACK_IMPORTED_MODULE_20__model__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "E", function() { return __WEBPACK_IMPORTED_MODULE_21__validators__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "F", function() { return __WEBPACK_IMPORTED_MODULE_21__validators__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "G", function() { return __WEBPACK_IMPORTED_MODULE_21__validators__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "H", function() { return __WEBPACK_IMPORTED_MODULE_22__form_providers__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "I", function() { return __WEBPACK_IMPORTED_MODULE_22__form_providers__["b"]; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * This module is used for handling user input, by defining and building a {@link FormGroup} that
 * consists of {@link FormControl} objects, and mapping them onto the DOM. {@link FormControl}
 * objects can then be used to read information from the form DOM elements.
 *
 * Forms providers are not included in default providers; you must import these providers
 * explicitly.
 */
























//# sourceMappingURL=forms.js.map

/***/ },

/***/ 494:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(30);
var projectlist_component_1 = __webpack_require__(318);
var grouplist_component_1 = __webpack_require__(315);
var registerapplicationform_component_1 = __webpack_require__(205);
var migrationprojectform_component_1 = __webpack_require__(316);
var applicationgroupform_component_1 = __webpack_require__(312);
var analysiscontextform_component_1 = __webpack_require__(311);
var configuration_component_1 = __webpack_require__(313);
var edit_application_form_component_1 = __webpack_require__(314);
var confirm_deactivate_guard_1 = __webpack_require__(321);
var technologies_report_1 = __webpack_require__(319);
var appRoutes = [
    { path: "", redirectTo: "/project-list", pathMatch: "full" },
    { path: "configuration", component: configuration_component_1.ConfigurationComponent, data: { displayName: "Windup Configuration" } },
    { path: "project-list", component: projectlist_component_1.ProjectListComponent, data: { displayName: "Project List" } },
    { path: "group-list", component: grouplist_component_1.GroupListComponent, data: { displayName: "Group List" } },
    { path: "register-application", component: registerapplicationform_component_1.RegisterApplicationFormComponent, data: { displayName: "Application Registration" } },
    { path: "edit-application/:id", component: edit_application_form_component_1.EditApplicationFormComponent, data: { displayName: "Update application" } },
    { path: "migration-project-form", component: migrationprojectform_component_1.MigrationProjectFormComponent, data: { displayName: "Edit Project" } },
    { path: "application-group-form", component: applicationgroupform_component_1.ApplicationGroupForm, data: { displayName: "Edit Application Group" } },
    { path: "analysis-context-form", component: analysiscontextform_component_1.AnalysisContextFormComponent, data: { displayName: "Edit Analysis Context" }, canDeactivate: [confirm_deactivate_guard_1.ConfirmDeactivateGuard] },
    // Reports
    { path: "technology-report", component: technologies_report_1.TechnologiesReport, data: { displayName: "Technology Report" } }
];
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);


/***/ },

/***/ 495:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var modal_dialog_component_1 = __webpack_require__(317);
var configuration_options_service_1 = __webpack_require__(206);
var AnalysisContextAdvancedOptionsModalComponent = (function () {
    function AnalysisContextAdvancedOptionsModalComponent(_configurationOptionsService) {
        this._configurationOptionsService = _configurationOptionsService;
        this.configurationOptions = [];
        this.selectedOptions = [];
        this.advancedOptionsChanged = new core_1.EventEmitter();
        this.resetCurrentOption();
    }
    Object.defineProperty(AnalysisContextAdvancedOptionsModalComponent.prototype, "currentSelectedOptionDefinition", {
        get: function () {
            var _this = this;
            return this.configurationOptions.find(function (option) {
                return _this.newOption.name == option.name;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalysisContextAdvancedOptionsModalComponent.prototype, "currentOptionType", {
        get: function () {
            if (this.newOption.name == null)
                return null;
            var configurationOption = this.currentSelectedOptionDefinition;
            switch (configurationOption.type) {
                case "java.io.File":
                case "java.lang.String":
                    return configurationOption.uitype == "SELECT_MANY" ? "select" : "text";
                case "java.lang.Boolean":
                    return "checkbox";
                default:
                    return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    AnalysisContextAdvancedOptionsModalComponent.prototype.resetCurrentOption = function () {
        this.newOption = null;
    };
    Object.defineProperty(AnalysisContextAdvancedOptionsModalComponent.prototype, "availableOptions", {
        get: function () {
            var _this = this;
            if (this.configurationOptions == null)
                return [];
            return this.configurationOptions.filter(function (option) {
                if (_this.selectedOptions == null)
                    return true;
                if (option.uitype == "MANY" || option.uitype == "SELECT_MANY")
                    return true;
                return _this.selectedOptions.find(function (selectedOption) {
                    return selectedOption.name == option.name;
                }) == null;
            });
        },
        enumerable: true,
        configurable: true
    });
    AnalysisContextAdvancedOptionsModalComponent.prototype.removeAdvancedOption = function (index) {
        this.selectedOptions.splice(index, 1);
        this.advancedOptionsChanged.emit(this.selectedOptions);
        return false;
    };
    AnalysisContextAdvancedOptionsModalComponent.prototype.startAddNew = function () {
        this.newOption = {};
        this.newOption.value = "";
    };
    AnalysisContextAdvancedOptionsModalComponent.prototype.addAdvancedOption = function () {
        var _this = this;
        this.newOptionError = "";
        // Only accept null for a checkbox (with a checkbox "null" == false).
        if (this.currentOptionType != 'checkbox' && (this.newOption.value == null || this.newOption.value == "")) {
            this.newOptionError = "Value must be specified";
            return;
        }
        this._configurationOptionsService.validate(this.newOption)
            .subscribe(function (validationResult) {
            if (validationResult.level != "SUCCESS") {
                // handle validation error
                _this.newOptionError = validationResult.message;
                return;
            }
            if (_this.selectedOptions == null)
                _this.selectedOptions = [];
            if (_this.currentOptionType == "checkbox" && !_this.newOption.value)
                _this.newOption.value = "false";
            _this.selectedOptions.push(_this.newOption);
            _this.advancedOptionsChanged.emit(_this.selectedOptions);
            _this.resetCurrentOption();
        }, function (error) {
            _this.newOptionError = "Error validating option";
        });
    };
    AnalysisContextAdvancedOptionsModalComponent.prototype.newOptionTypeChanged = function () {
        if (this.newOption)
            this.newOption.value = "";
    };
    AnalysisContextAdvancedOptionsModalComponent.prototype.show = function () {
        this.modalDialog.show();
    };
    AnalysisContextAdvancedOptionsModalComponent.prototype.hide = function () {
        this.modalDialog.hide();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], AnalysisContextAdvancedOptionsModalComponent.prototype, "configurationOptions", void 0);
    __decorate([
        core_1.Input(),
        core_1.Output(), 
        __metadata('design:type', Array)
    ], AnalysisContextAdvancedOptionsModalComponent.prototype, "selectedOptions", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], AnalysisContextAdvancedOptionsModalComponent.prototype, "advancedOptionsChanged", void 0);
    __decorate([
        core_1.ViewChild(modal_dialog_component_1.ModalDialogComponent), 
        __metadata('design:type', (typeof (_b = typeof modal_dialog_component_1.ModalDialogComponent !== 'undefined' && modal_dialog_component_1.ModalDialogComponent) === 'function' && _b) || Object)
    ], AnalysisContextAdvancedOptionsModalComponent.prototype, "modalDialog", void 0);
    AnalysisContextAdvancedOptionsModalComponent = __decorate([
        core_1.Component({
            selector: 'analysis-context-advanced-options',
            template: "\n    <modal-dialog>\n        <div header>\n            Advanced Options\n        </div>\n        <div body>\n            <form class=\"form-horizontal\">\n                \n                <table class=\"datatable table table-striped table-bordered\">\n                    <thead>\n                        <tr>\n                            <th width=\"33%\">Option</th>\n                            <th width=\"50%\">Value</th>\n                            <th width=\"17%\">Actions</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr *ngFor=\"let selectedOption of selectedOptions; let i = index;\">\n                            <td>\n                                {{selectedOption.name}}\n                            </td>\n                            <td>\n                                {{selectedOption.value}}\n                            </td>\n                            <td>\n                                <button (click)=\"removeAdvancedOption(i)\" class=\"btn-warning\" href=\"#\">Delete</button>\n                            </td>\n                        </tr>\n                        <tr *ngIf=\"newOption\">\n                            <td class=\"input-group\">\n                                <select class=\"form-control\" name=\"newOptionTypeSelection\" [(ngModel)]=\"newOption.name\" (change)=\"newOptionTypeChanged()\">\n                                    <option *ngFor=\"let option of availableOptions\" value=\"{{option.name}}\">{{option.name}}</option>\n                                </select>\n                                <w-popover class=\"input-group-addon\" *ngIf=\"currentSelectedOptionDefinition?.description\" [content]=\"currentSelectedOptionDefinition?.description\"></w-popover>\n                            </td>\n                            <td [class.bg-danger]=\"newOptionError\" align=\"right\">\n                                <span class=\"text-danger\">{{newOptionError}}</span>\n                                <div [ngSwitch]=\"currentOptionType\">\n                                    <input *ngSwitchCase=\"'text'\" type=\"text\" name=\"currentOptionInput\" class=\"form-control\" [(ngModel)]=\"newOption.value\">\n                                    <input *ngSwitchCase=\"'checkbox'\" type=\"checkbox\" class=\"form-control\" name=\"currentOptionInput\" [(ngModel)]=\"newOption.value\">\n                                    <select *ngSwitchCase=\"'select'\" class=\"form-control\" name=\"newOptionSelect\" [(ngModel)]=\"newOption.value\">\n                                        <option *ngFor=\"let option of currentSelectedOptionDefinition.availableValues\" value=\"{{option}}\">{{option}}</option>\n                                    </select>\n                                </div>\n                            </td>\n                            <td>\n                                <button (click)=\"addAdvancedOption()\">Add</button>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n                <button *ngIf=\"!newOption\" (click)=\"startAddNew()\">Add New Option</button>\n                \n            </form>\n        </div>\n        <div footer>\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"hide()\">Done</button>\n        </div>\n    </modal-dialog>\n"
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof configuration_options_service_1.ConfigurationOptionsService !== 'undefined' && configuration_options_service_1.ConfigurationOptionsService) === 'function' && _c) || Object])
    ], AnalysisContextAdvancedOptionsModalComponent);
    return AnalysisContextAdvancedOptionsModalComponent;
    var _a, _b, _c;
}());
exports.AnalysisContextAdvancedOptionsModalComponent = AnalysisContextAdvancedOptionsModalComponent;


/***/ },

/***/ 496:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
__webpack_require__(507);
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'windup-app',
            template: __webpack_require__(512)
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;


/***/ },

/***/ 497:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var router_1 = __webpack_require__(30);
var BreadCrumbsComponent = (function () {
    function BreadCrumbsComponent(_router) {
        this._router = _router;
        this.breadcrumbsCollection = [];
        this._router.events.subscribe(function (routeData) {
            // TODO - Reimplement with new router and current design document
            //
            //console.log("Routing data: " + routeData);
            //let instructions = [];
            //this._router.recognize(routeData.instruction.urlPath).then(instruction => {
            //    instructions.push(instruction);
            //
            //    while (instruction.child) {
            //        instruction = instruction.child;
            //
            //        instructions.push(instruction);
            //    }
            //    this.breadcrumbsCollection = instructions
            //        .map((inst, index) => {
            //            return {
            //                displayName: inst.component.routeData.get('displayName')
            //            }
            //        });
            //});
        });
    }
    BreadCrumbsComponent = __decorate([
        core_1.Component({
            selector: 'breadcrumbs',
            template: __webpack_require__(514),
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object])
    ], BreadCrumbsComponent);
    return BreadCrumbsComponent;
    var _a;
}());
exports.BreadCrumbsComponent = BreadCrumbsComponent;


/***/ },

/***/ 498:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {"use strict";
var core_1 = __webpack_require__(1);
var ConfirmationModalComponent = (function () {
    function ConfirmationModalComponent() {
        this.confirmed = new core_1.EventEmitter();
        this.cancelled = new core_1.EventEmitter();
    }
    ConfirmationModalComponent.prototype.show = function (event) {
        event.preventDefault();
        $('#' + this.id).modal('show');
    };
    ConfirmationModalComponent.prototype.hide = function (event) {
        event.preventDefault();
        $('#' + this.id).modal('hide');
    };
    ConfirmationModalComponent.prototype.yes = function (event) {
        this.confirmed.emit({});
        this.hide(event);
    };
    ConfirmationModalComponent.prototype.no = function (event) {
        this.cancelled.emit({});
        this.hide(event);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ConfirmationModalComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ConfirmationModalComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ConfirmationModalComponent.prototype, "body", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ConfirmationModalComponent.prototype, "confirmed", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ConfirmationModalComponent.prototype, "cancelled", void 0);
    ConfirmationModalComponent = __decorate([
        core_1.Component({
            selector: 'confirmation-modal',
            template: "\n    <div id=\"{{id}}\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" [attr.aria-labelledby]=\"title\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-lg\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    <span class=\"pficon pficon-close\"></span>\n                </button>\n                <h4 class=\"modal-title\">\n                    {{title}}\n                </h4>\n            </div>\n            <div class=\"modal-body\">\n                {{body}}\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"no($event)\">No</button>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"yes($event)\">Yes</button>\n            </div>\n        </div>\n    </div>\n</div>\n"
        }), 
        __metadata('design:paramtypes', [])
    ], ConfirmationModalComponent);
    return ConfirmationModalComponent;
}());
exports.ConfirmationModalComponent = ConfirmationModalComponent;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ },

/***/ 499:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var configuration_service_1 = __webpack_require__(123);
var CustomRuleSelectionComponent = (function () {
    function CustomRuleSelectionComponent(_configurationService) {
        this._configurationService = _configurationService;
        this.selectedRulePathsChanged = new core_1.EventEmitter();
        this.rulesPaths = [];
    }
    Object.defineProperty(CustomRuleSelectionComponent.prototype, "selectedRulePaths", {
        get: function () {
            return this._selectedRulePaths;
        },
        set: function (paths) {
            this._selectedRulePaths = paths;
            if (this.selectedRulePaths != null)
                this._selectedRuleIDs = this.selectedRulePaths.map(function (rulesPath) { return rulesPath.id; });
            else
                this._selectedRuleIDs = [];
            this.selectedRulePathsChanged.emit(this._selectedRulePaths);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomRuleSelectionComponent.prototype, "selectedRuleIDs", {
        get: function () {
            return this._selectedRuleIDs;
        },
        set: function (ids) {
            this.selectedRulePaths = this.rulesPaths.filter(function (value) {
                return ids.indexOf(value.id) != -1;
            });
        },
        enumerable: true,
        configurable: true
    });
    CustomRuleSelectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._configurationService.getCustomRulesetPaths().subscribe(function (rulesPaths) {
            _this.rulesPaths = rulesPaths;
        }, function (err) { console.log(err); });
    };
    CustomRuleSelectionComponent.prototype.clearSelection = function () {
        this.selectedRulePaths = [];
        return false;
    };
    CustomRuleSelectionComponent.prototype.selectAll = function () {
        this.selectedRulePaths = this.rulesPaths;
        return false;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], CustomRuleSelectionComponent.prototype, "selectedRulePathsChanged", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], CustomRuleSelectionComponent.prototype, "selectedRulePaths", null);
    CustomRuleSelectionComponent = __decorate([
        core_1.Component({
            selector: 'custom-rule-selection',
            template: __webpack_require__(516)
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof configuration_service_1.ConfigurationService !== 'undefined' && configuration_service_1.ConfigurationService) === 'function' && _b) || Object])
    ], CustomRuleSelectionComponent);
    return CustomRuleSelectionComponent;
    var _a, _b;
}());
exports.CustomRuleSelectionComponent = CustomRuleSelectionComponent;


/***/ },

/***/ 50:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__abstract_control_directive__ = __webpack_require__(187);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgControl; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

function unimplemented() {
    throw new Error('unimplemented');
}
/**
 * A base class that all control directive extend.
 * It binds a {@link FormControl} object to a DOM element.
 *
 * Used internally by Angular forms.
 *
 * @stable
 */
var NgControl = (function (_super) {
    __extends(NgControl, _super);
    function NgControl() {
        _super.apply(this, arguments);
        /** @internal */
        this._parent = null;
        this.name = null;
        this.valueAccessor = null;
        /** @internal */
        this._rawValidators = [];
        /** @internal */
        this._rawAsyncValidators = [];
    }
    Object.defineProperty(NgControl.prototype, "validator", {
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControl.prototype, "asyncValidator", {
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    return NgControl;
}(__WEBPACK_IMPORTED_MODULE_0__abstract_control_directive__["a" /* AbstractControlDirective */]));
//# sourceMappingURL=ng_control.js.map

/***/ },

/***/ 500:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var router_1 = __webpack_require__(30);
var keycloak_service_1 = __webpack_require__(67);
var NavbarComponent = (function () {
    function NavbarComponent(_keycloak, _router) {
        this._keycloak = _keycloak;
        this._router = _router;
    }
    Object.defineProperty(NavbarComponent.prototype, "username", {
        get: function () {
            return this._keycloak.username;
        },
        enumerable: true,
        configurable: true
    });
    NavbarComponent.prototype.logout = function (event) {
        event.preventDefault();
        this._keycloak.logout();
    };
    NavbarComponent.prototype.isActive = function (link) {
        if (link == null)
            return false;
        var linkAttribute = link.attributes.getNamedItem("routerLink");
        if (linkAttribute == null)
            return false;
        return linkAttribute.value == this._router.url;
    };
    NavbarComponent = __decorate([
        core_1.Component({
            selector: 'navbar',
            template: __webpack_require__(519)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof keycloak_service_1.KeycloakService !== 'undefined' && keycloak_service_1.KeycloakService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object])
    ], NavbarComponent);
    return NavbarComponent;
    var _a, _b;
}());
exports.NavbarComponent = NavbarComponent;


/***/ },

/***/ 501:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var notification_service_1 = __webpack_require__(207);
var notification_1 = __webpack_require__(324);
var NotificationComponent = (function () {
    function NotificationComponent(_notificationService) {
        this._notificationService = _notificationService;
        this.displayedNotifications = 3;
        this.autoCloseNotifications = true;
        this.closeTimeout = 30;
        this.notificationsStack = [];
    }
    NotificationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this._notificationService.notifications.subscribe(function (notification) { return _this.onNotification(notification); });
    };
    NotificationComponent.prototype.onNotification = function (notification) {
        var _this = this;
        if (this.notificationsStack.length === this.displayedNotifications) {
            this.notificationsStack.pop();
        }
        this.notificationsStack.push(notification);
        if (this.autoCloseNotifications) {
            setTimeout(function () { return _this.closeNotification(notification); }, this.closeTimeout * 1000);
        }
    };
    NotificationComponent.prototype.closeNotification = function (notification) {
        var index = this.notificationsStack.indexOf(notification);
        if (index !== -1) {
            this.notificationsStack.splice(index, 1);
        }
    };
    NotificationComponent.prototype.getClass = function (notification) {
        switch (notification.level) {
            default:
            case notification_1.NotificationLevel.INFO:
                return 'alert-info';
            case notification_1.NotificationLevel.SUCCESS:
                return 'alert-success';
            case notification_1.NotificationLevel.ERROR:
                return 'alert-danger';
            case notification_1.NotificationLevel.WARNING:
                return 'alert-warning';
        }
    };
    NotificationComponent.prototype.getIcon = function (notification) {
        switch (notification.level) {
            default:
            case notification_1.NotificationLevel.INFO:
                return 'pficon-info';
            case notification_1.NotificationLevel.SUCCESS:
                return 'pficon-ok';
            case notification_1.NotificationLevel.ERROR:
                return 'pficon-error-circle-o';
            case notification_1.NotificationLevel.WARNING:
                return 'pficon-warning-triangle-o';
        }
    };
    NotificationComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NotificationComponent.prototype, "displayedNotifications", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], NotificationComponent.prototype, "autoCloseNotifications", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NotificationComponent.prototype, "closeTimeout", void 0);
    NotificationComponent = __decorate([
        core_1.Component({
            selector: 'ap-notification',
            template: __webpack_require__(520)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof notification_service_1.NotificationService !== 'undefined' && notification_service_1.NotificationService) === 'function' && _a) || Object])
    ], NotificationComponent);
    return NotificationComponent;
    var _a;
}());
exports.NotificationComponent = NotificationComponent;


/***/ },

/***/ 502:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {"use strict";
var core_1 = __webpack_require__(1);
var PopoverComponent = (function () {
    function PopoverComponent() {
        this.content = "";
    }
    PopoverComponent.prototype.ngAfterViewInit = function () {
        console.log("Popover element: " + this.popoverElement.nativeElement);
        $(this.popoverElement.nativeElement).popover();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PopoverComponent.prototype, "content", void 0);
    __decorate([
        core_1.ViewChild("popoverElement"), 
        __metadata('design:type', (typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object)
    ], PopoverComponent.prototype, "popoverElement", void 0);
    PopoverComponent = __decorate([
        core_1.Component({
            selector: "w-popover",
            template: "<a   #popoverElement\n                    tabindex=\"0\" \n                    role=\"button\" \n                    data-toggle=\"popover\" \n                    data-trigger=\"focus\" \n                    data-html=\"true\"\n                    data-placement=\"top\"\n                    [attr.data-content]=\"content\"\n                    class=\"fa fa-info-circle\">\n                </a>"
        }), 
        __metadata('design:paramtypes', [])
    ], PopoverComponent);
    return PopoverComponent;
    var _a;
}());
exports.PopoverComponent = PopoverComponent;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ },

/***/ 503:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var core_2 = __webpack_require__(1);
var ProgressBarComponent = (function () {
    function ProgressBarComponent() {
    }
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], ProgressBarComponent.prototype, "taskName", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Number)
    ], ProgressBarComponent.prototype, "minValue", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Number)
    ], ProgressBarComponent.prototype, "maxValue", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Number)
    ], ProgressBarComponent.prototype, "currentValue", void 0);
    ProgressBarComponent = __decorate([
        core_1.Component({
            selector: 'progress-bar',
            template: "\n        <div class=\"progress-description\">\n            <div class=\"spinner spinner-xs spinner-inline\"></div> <strong>Task:</strong> {{taskName ? taskName : \"Starting...\"}}\n        </div>\n        <div class=\"progress progress-label-top-right\">\n            <div\n                    class=\"progress-bar\" role=\"progressbar\"\n                    aria-valuemin=\"0\"\n                    [attr.aria-valuenow]=\"currentValue\"\n                    [attr.aria-valuemax]=\"maxValue\"\n                    [style.width]=\"(currentValue/maxValue)*100 + '%'\">\n                <span>\n                    {{currentValue ? currentValue : \"?\"}}/{{maxValue ? maxValue : \"?\"}}\n                </span>\n            </div>\n        </div>"
        }), 
        __metadata('design:paramtypes', [])
    ], ProgressBarComponent);
    return ProgressBarComponent;
}());
exports.ProgressBarComponent = ProgressBarComponent;


/***/ },

/***/ 504:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var core_2 = __webpack_require__(1);
var windup_services_1 = __webpack_require__(209);
var TechnologyComponent = (function () {
    function TechnologyComponent() {
    }
    Object.defineProperty(TechnologyComponent.prototype, "versionRangeSuffix", {
        get: function () {
            if (this.technology.versionRange)
                return ":" + this.technology.versionRange;
            else
                return "";
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_2.Input(), 
        __metadata('design:type', (typeof (_a = typeof windup_services_1.Technology !== 'undefined' && windup_services_1.Technology) === 'function' && _a) || Object)
    ], TechnologyComponent.prototype, "technology", void 0);
    TechnologyComponent = __decorate([
        core_1.Component({
            selector: 'technology',
            template: "{{technology.name}}{{versionRangeSuffix}}"
        }), 
        __metadata('design:paramtypes', [])
    ], TechnologyComponent);
    return TechnologyComponent;
    var _a;
}());
exports.TechnologyComponent = TechnologyComponent;


/***/ },

/***/ 505:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var ng2_file_upload_1 = __webpack_require__(127);
var UploadProgressbarComponent = (function () {
    function UploadProgressbarComponent() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof ng2_file_upload_1.FileUploader !== 'undefined' && ng2_file_upload_1.FileUploader) === 'function' && _a) || Object)
    ], UploadProgressbarComponent.prototype, "uploader", void 0);
    UploadProgressbarComponent = __decorate([
        core_1.Component({
            selector: 'app-upload-progressbar',
            template: __webpack_require__(524)
        }), 
        __metadata('design:paramtypes', [])
    ], UploadProgressbarComponent);
    return UploadProgressbarComponent;
    var _a;
}());
exports.UploadProgressbarComponent = UploadProgressbarComponent;


/***/ },

/***/ 506:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var ng2_file_upload_1 = __webpack_require__(127);
var UploadQueueComponent = (function () {
    function UploadQueueComponent(_ngZone) {
        this._ngZone = _ngZone;
        this.progress = {};
    }
    UploadQueueComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.uploader.onProgressItem = function (item, progress) {
            _this._ngZone.run(function () { return _this.progress[item.file.name] = progress; });
        };
    };
    UploadQueueComponent.prototype.getProgress = function (item) {
        if (!this.progress.hasOwnProperty(item.file.name)) {
            this.progress[item.file.name] = 0;
        }
        return this.progress[item.file.name];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof ng2_file_upload_1.FileUploader !== 'undefined' && ng2_file_upload_1.FileUploader) === 'function' && _a) || Object)
    ], UploadQueueComponent.prototype, "uploader", void 0);
    UploadQueueComponent = __decorate([
        core_1.Component({
            selector: 'app-upload-queue',
            template: __webpack_require__(525)
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.NgZone !== 'undefined' && core_1.NgZone) === 'function' && _b) || Object])
    ], UploadQueueComponent);
    return UploadQueueComponent;
    var _a, _b;
}());
exports.UploadQueueComponent = UploadQueueComponent;


/***/ },

/***/ 507:
/***/ function(module, exports, __webpack_require__) {

"use strict";
// import 'rxjs/Rx'; // adds ALL RxJS statics & operators to Observable
"use strict";
// See node_module/rxjs/Rxjs.js
// Import just the rxjs statics and operators we need for THIS app.
// Statics
__webpack_require__(334);
// Operators
__webpack_require__(335);
__webpack_require__(336);
__webpack_require__(337);
__webpack_require__(338);
__webpack_require__(339);
__webpack_require__(340);


/***/ },

/***/ 508:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var keycloak_service_1 = __webpack_require__(67);
var Observable_1 = __webpack_require__(0);
var WindupHttpService = (function (_super) {
    __extends(WindupHttpService, _super);
    function WindupHttpService(_backend, _defaultOptions, _keycloakService) {
        _super.call(this, _backend, _defaultOptions);
        this._keycloakService = _keycloakService;
    }
    WindupHttpService.prototype.setToken = function (options) {
        if (options == null || keycloak_service_1.KeycloakService.auth == null || keycloak_service_1.KeycloakService.auth.authz == null || keycloak_service_1.KeycloakService.auth.authz.token == null) {
            console.log("Need a token, but no token is available, not setting bearer token.");
            return;
        }
        if (!options.hasOwnProperty('headers')) {
            options.headers = new http_1.Headers();
        }
        if (!options.headers.has('Authorization')) {
            options.headers.set('Authorization', 'Bearer ' + keycloak_service_1.KeycloakService.auth.authz.token);
        }
    };
    WindupHttpService.prototype.configureRequest = function (f, url, options, body) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var tokenObservable = this._keycloakService.getToken();
        var tokenUpdateObservable = Observable_1.Observable.create(function (observer) {
            if (options == null) {
                var headers = new http_1.Headers();
                options = new http_1.RequestOptions({ headers: headers });
            }
            _this.setToken(options);
            observer.next();
            observer.complete();
        });
        var requestObservable = Observable_1.Observable.create(function (observer) {
            var result;
            if (body) {
                result = f.apply(_this, [url, body, options]);
            }
            else {
                result = f.apply(_this, [url, options]);
            }
            result.subscribe(function (response) { return observer.next(response); }, function (error) { return observer.error(error); }, function (complete) { return observer.complete(); });
        });
        return Observable_1.Observable
            .merge(tokenObservable, tokenUpdateObservable, requestObservable, 1)
            .filter(function (response) { return response instanceof http_1.Response; });
    };
    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    WindupHttpService.prototype.request = function (url, options) {
        return this.configureRequest(_super.prototype.request, url, options);
    };
    /**
     * Performs a request with `get` http method.
     */
    WindupHttpService.prototype.get = function (url, options) {
        return this.configureRequest(_super.prototype.get, url, options);
    };
    /**
     * Performs a request with `post` http method.
     */
    WindupHttpService.prototype.post = function (url, body, options) {
        return this.configureRequest(_super.prototype.post, url, options, body);
    };
    /**
     * Performs a request with `put` http method.
     */
    WindupHttpService.prototype.put = function (url, body, options) {
        return this.configureRequest(_super.prototype.put, url, options, body);
    };
    /**
     * Performs a request with `delete` http method.
     */
    WindupHttpService.prototype.delete = function (url, options) {
        return this.configureRequest(_super.prototype.delete, url, options);
    };
    /**
     * Performs a request with `patch` http method.
     */
    WindupHttpService.prototype.patch = function (url, body, options) {
        return this.configureRequest(_super.prototype.patch, url, options, body);
    };
    /**
     * Performs a request with `head` http method.
     */
    WindupHttpService.prototype.head = function (url, options) {
        return this.configureRequest(_super.prototype.head, url, options);
    };
    /**
     * Performs a request with `options` http method.
     */
    WindupHttpService.prototype.options = function (url, options) {
        return this.configureRequest(_super.prototype.options, url, options);
    };
    WindupHttpService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.ConnectionBackend !== 'undefined' && http_1.ConnectionBackend) === 'function' && _a) || Object, (typeof (_b = typeof http_1.RequestOptions !== 'undefined' && http_1.RequestOptions) === 'function' && _b) || Object, (typeof (_c = typeof keycloak_service_1.KeycloakService !== 'undefined' && keycloak_service_1.KeycloakService) === 'function' && _c) || Object])
    ], WindupHttpService);
    return WindupHttpService;
    var _a, _b, _c;
}(http_1.Http));
exports.WindupHttpService = WindupHttpService;


/***/ },

/***/ 510:
/***/ function(module, exports) {

module.exports = "<div class=\"modal fade\" id=\"addRulesPathModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"Add Rules Path\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-lg\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    <span class=\"pficon pficon-close\"></span>\n                </button>\n                <h4 class=\"modal-title\" id=\"myModalLabel\">\n                    Add Rules Path\n                </h4>\n            </div>\n            <div class=\"modal-body\">\n                <form [formGroup]=\"addRulesPathForm\">\n                    <div *ngFor=\"let errorMessage of errorMessages\" class=\"row form-errors alert alert-danger\">\n                        <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n                        {{errorMessage}}\n                    </div>\n                    <div class=\"form-group\" [ngClass]=\"{'has-error': hasError(addRulesPathForm.get('inputPathControl'))}\">\n                        <label class=\"control-label\" for=\"addRulesPathInput\">Rules Path (file or directory):</label>\n                        <input\n                                [(ngModel)]=\"inputPath\"\n                                formControlName=\"inputPathControl\"\n                                type=\"text\"\n                                id=\"addRulesPathInput\"\n                                class=\"form-control\">\n                        <span [class.hidden]=\"!hasError(addRulesPathForm.get('inputPathControl'))\" class=\"help-block\">\n                            The path must exist on the server.\n                        </span>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"addPath()\">Add</button>\n            </div>\n        </div>\n    </div>\n</div>";

/***/ },

/***/ 511:
/***/ function(module, exports) {

module.exports = "<h1>\n    Analysis Context\n</h1>\n<form #analysisContextForm=\"ngForm\" (ngSubmit)=\"save()\"  class=\"form-horizontal\">\n    <div *ngFor=\"let errorMessage of errorMessages\" class=\"row form-errors alert alert-danger\">\n        <div class=\"col-md-2\">&nbsp;</div>\n        <div class=\"col-md-10\">\n            <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n            {{errorMessage}}\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"form-group\">\n            <label class=\"col-md-2 control-label\" for=\"migrationPath\">Migration Path</label>\n            <div class=\"col-md-6\">\n                <select\n                        #migrationPath=\"ngModel\"\n                        name=\"migrationPath\"\n                        [(ngModel)]=\"analysisContext.migrationPath.id\"\n                        ngControl=\"migrationPath\"\n                        [ngClass]=\"{'has-error': hasError(migrationPath)}\"\n                        required\n                        id=\"migrationPath\"\n                        class=\"form-control\"\n                >\n                    <option *ngFor=\"let migrationPath of migrationPaths | async\" [value]=\"migrationPath.id\">{{migrationPath.name}}</option>\n                </select>\n                <span [class.hidden]=\"!hasError(migrationPath)\" class=\"help-block\">\n                    A migration path must be specified.\n                </span>\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-md-2 control-label\" for=\"includePackageID\">Include Packages</label>\n            <div class=\"col-md-4\">\n                <div *ngFor=\"let includePackage of packages; let i = index;\" class=\"input-group\">\n                    <input #includePackageControl=\"ngModel\"\n                        name=\"includePackagesInput_{{i}}\"\n                        [(ngModel)]=\"includePackage.prefix\"\n                        ngControl=\"includePackageControl\"\n                        maxlength=\"200\"\n                        type=\"text\"\n                        id=\"includePackageID\"\n                        class=\"form-control\">\n                    <span *ngIf=\"i != (packages.length - 1)\" class=\"input-group-btn\">\n                        <button *ngIf=\"packages.length > 1\" (click)=\"removeScanPackage(i)\" class=\"btn \" type=\"button\">-</button>\n                    </span>\n                    <span *ngIf=\"i == (packages.length - 1)\" class=\"input-group-btn\">\n                        <button *ngIf=\"packages.length > 1\" (click)=\"removeScanPackage(i)\" class=\"btn \" type=\"button\">-</button>\n                        <button (click)=\"addScanPackage()\" class=\"btn \" type=\"button\">+</button>\n                    </span>\n                </div>\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label class=\"col-md-2 control-label\" for=\"excludePackageID\">Exclude Package</label>\n            <div class=\"col-md-3\">\n                <div *ngFor=\"let excludePackage of excludePackages; let i = index;\" class=\"input-group\">\n                    <input #excludePackageControl=\"ngModel\"\n                           name=\"excludePackagesInput_{{i}}\"\n                           [(ngModel)]=\"excludePackage.prefix\"\n                           ngControl=\"excludePackageControl\"\n                           maxlength=\"200\"\n                           type=\"text\"\n                           id=\"excludePackageID\"\n                           class=\"form-control\">\n                    <span *ngIf=\"i != (excludePackages.length - 1)\" class=\"input-group-btn\">\n                        <button *ngIf=\"excludePackages.length > 1\" (click)=\"removeExcludePackage(i)\" class=\"btn \" type=\"button\">-</button>\n                    </span>\n                    <span *ngIf=\"i == (excludePackages.length - 1)\" class=\"input-group-btn\">\n                        <button *ngIf=\"excludePackages.length > 1\" (click)=\"removeExcludePackage(i)\" class=\"btn \" type=\"button\">-</button>\n                        <button (click)=\"addExcludePackage()\" class=\"btn \" type=\"button\">+</button>\n                    </span>\n                </div>\n            </div>\n        </div>\n        <custom-rule-selection [selectedRulePaths]=\"analysisContext.rulesPaths\" (selectedRulePathsChanged)=\"rulesPathsChanged($event)\"></custom-rule-selection>\n        <div class=\"form-group\">\n            <label class=\"col-md-2 control-label\" for=\"excludePackageID\">Advanced Options</label>\n            <div class=\"col-md-3\">\n                <button class=\"btn btn-default\" (click)=\"viewAdvancedOptions(advancedOptionsModal)\">View Advanced Options</button>\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <div class=\"col-md-10 col-md-offset-2\">\n                <button [disabled]=\"!analysisContextForm.form.valid\" class=\"btn btn-primary\" type=\"submit\">Save</button>\n                <button [disabled]=\"loading\" (click)=\"cancel()\" type=\"button\" class=\"btn btn-default\">Cancel</button>\n            </div>\n        </div>\n\n    </div>\n</form>\n\n<analysis-context-advanced-options [(selectedOptions)]=\"analysisContext.advancedOptions\" (advancedOptionsChanged)=\"advancedOptionsChanged($event)\" [configurationOptions]=\"configurationOptions\" #advancedOptionsModal></analysis-context-advanced-options>";

/***/ },

/***/ 512:
/***/ function(module, exports) {

module.exports = "<navbar></navbar>\n<div class=\"container-fluid\">\n    <!-- breadcrumbs></breadcrumbs -->\n    <ap-notification></ap-notification>\n    <!-- Routed views go here -->\n    <router-outlet></router-outlet>\n</div><!-- /container -->\n";

/***/ },

/***/ 513:
/***/ function(module, exports) {

module.exports = "<h1>\n    Create Application Group\n</h1>\n<form #applicationGroupForm=\"ngForm\" (ngSubmit)=\"save()\" class=\"form-horizontal\">\n    <div *ngFor=\"let errorMessage of errorMessages\" class=\"row form-errors alert alert-danger\">\n        <div class=\"col-md-2\">&nbsp;</div>\n        <div class=\"col-md-10\">\n            <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n            {{errorMessage}}\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"form-group\">\n            <label class=\"col-md-2 control-label\" for=\"idGroupTitle\">Group Title</label>\n            <div class=\"col-md-6\">\n                <input  #titleControl=\"ngModel\"\n                        name=\"groupTitle\"\n                        [(ngModel)]=\"model.title\"\n                        [disabled]=\"loadingGroup\"\n                        required\n                        minlength=\"4\"\n                        maxlength=\"128\"\n                        type=\"text\"\n                        id=\"idGroupTitle\"\n                        class=\"form-control\">\n            </div>\n            <span [class.hidden]=\"!hasError(titleControl)\" class=\"help-block\">\n                The title must be greater than 3 characters long and fewer than 128 characters.\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <div class=\"col-md-10 col-md-offset-2\">\n                <button class=\"btn btn-primary\" type=\"submit\" [disabled]=\"!applicationGroupForm.form.valid || loading\">Save</button>\n                <button (click)=\"cancel()\" type=\"button\" class=\"btn btn-default\">Cancel</button>\n            </div>\n        </div>\n    </div>\n</form>";

/***/ },

/***/ 514:
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\n    <!--\n        jsightler (2016/08/16) - Commenting out until we reimplement this based on the mockups.\n    -->\n    <!-- <li><a routerLink=\"/project-list\">Home</a></li>\n\n    <li *ngFor=\"let route of breadcrumbsCollection\">\n        {{ route.displayName }}\n    </li>\n -->\n</ol>";

/***/ },

/***/ 515:
/***/ function(module, exports) {

module.exports = "<h1>\n    Windup Configuration\n\n    <button class=\"btn btn-primary\" (click)=\"displayAddRulesPathForm()\">\n        <span class=\"glyphicon glyphicon-plus\"></span>\n        Register Custom Rule Path\n    </button>\n</h1>\n\n<template [ngIf]=\"configuration != null && configuration.rulesPaths != null && configuration.rulesPaths.length > 0\">\n    <div class=\"panel-group\">\n        <div *ngFor=\"let rulePath of configuration.rulesPaths\" id=\"rulePathPanel_{{rulePath.id}}\" class=\"panel panel-default\">\n            <div class=\"panel-heading\">\n                <h2 class=\"panel-title\">\n                    <a class=\"collapsed\" data-toggle=\"collapse\" [attr.data-parent]=\"'#rulePathPanel_' + rulePath.id\" href=\"#collapse_{{rulePath.id}}\">\n                        Rules: {{rulePath.rulesPathType == \"SYSTEM_PROVIDED\" ? \"&lt;System Rules&gt;\" : rulePath.path}}\n                    </a>\n                </h2>\n            </div>\n\n            <div id=\"collapse_{{rulePath.id}}\" class=\"panel-body panel-collapse collapse\">\n                <a (click)=\"removeRulesConfirmationModal.show($event)\" *ngIf=\"rulePath.rulesPathType != 'SYSTEM_PROVIDED'\" href=\"#\">\n                    <span class=\"glyphicon glyphicon-trash\"></span>\n                    Unregister Rules\n                </a>\n\n                <confirmation-modal\n                        #removeRulesConfirmationModal\n                        id=\"deleteRulesConfirmation_{{rulePath.id}}\"\n                        title=\"Unregister Rules?\"\n                        body=\"Unregister rules from Windup?\"\n                        (confirmed)=\"removeRulesPath(rulePath)\"\n                >\n                </confirmation-modal>\n\n                <div *ngIf=\"!hasFileBasedProviders(rulePath)\">\n                    <h3>This path contains no rules!</h3>\n                </div>\n\n                <div *ngIf=\"rulePath.loadError\">\n                    <h3>{{rulePath.loadError}}</h3>\n                </div>\n\n                <table class=\"datatable table table-striped table-bordered\" *ngIf=\"hasFileBasedProviders(rulePath)\">\n                    <thead>\n                    <tr>\n                        <th>Provider ID</th>\n                        <th>Provider Location</th>\n                        <th>Sources</th>\n                        <th>Targets</th>\n                        <th>Rule Count</th>\n                        <th>Details</th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <template ngFor let-ruleProvider [ngForOf]=\"ruleProvidersByPath.get(rulePath)\">\n                        <tr *ngIf=\"isFileBasedProvider(ruleProvider)\">\n                            <td>\n                                {{ruleProvider.providerID}}\n                            </td>\n                            <td>\n                                {{ruleProvider.origin}}\n                            </td>\n                            <td>\n                                <div *ngFor=\"let source of ruleProvider.sources\">\n                                    <technology [technology]=\"source\"></technology>\n                                </div>\n                            </td>\n                            <td>\n                                <div *ngFor=\"let target of ruleProvider.targets\">\n                                    <technology [technology]=\"target\"></technology>\n                                </div>\n                            </td>\n                            <td>\n                                {{ruleProvider.rules ? ruleProvider.rules.length : 0}}\n                            </td>\n                            <td>\n                                <a href=\"#\" (click)=\"displayRules(ruleProvider, $event)\">Rules</a>\n                            </td>\n                        </tr>\n                    </template>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</template>\n\n<rules-modal></rules-modal>\n<add-rules-path-modal [configuration]=\"configuration\" (configurationSaved)=\"configurationUpdated($event)\"></add-rules-path-modal>";

/***/ },

/***/ 516:
/***/ function(module, exports) {

module.exports = "<div class=\"form-group\">\n    <label class=\"col-md-2 control-label\" for=\"customRulesetPaths\">Custom Ruleset selection</label>\n    <div class=\"col-md-6\">\n        <button (click)=\"selectAll()\">Select all</button>\n        <button (click)=\"clearSelection()\">Clear all</button>\n        <select multiple\n                name=\"customRulesetPaths\"\n                [(ngModel)]=\"selectedRuleIDs\"\n                id=\"customRulesetPaths\"\n                class=\"form-control\"\n                >\n            <option *ngFor=\"let ruleset of rulesPaths\" [ngValue]=\"ruleset.id\">\n                {{ruleset.path}}\n            </option>\n        </select>\n    </div>\n</div>\n";

/***/ },

/***/ 517:
/***/ function(module, exports) {

module.exports = "<h1>\n    Groups\n    <button (click)=\"createGroup()\" class=\"btn btn-primary\" type=\"button\">Create Group</button>\n</h1>\n<h3 *ngIf=\"errorMessage != null\">{{errorMessage}}</h3>\n\n<div *ngFor=\"let group of groups\" class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">\n            {{group.title}}\n            <a *ngIf=\"!group.readOnly\" href=\"#\" (click)=\"editGroup(group, $event)\">\n                <span class=\"glyphicon glyphicon-pencil\"></span>\n            </a>\n        </h3>\n        <a [routerLink]=\"['/analysis-context-form', { groupID: group.id }]\">Edit Analysis Configuration</a>\n        <span *ngIf=\"groupReportURL(group) != null\">\n            |\n            <a target=\"_blank\" href=\"{{groupReportURL(group)}}\">\n                View Report\n            </a>\n        </span>\n        <span *ngIf=\"group.applications.length > 0\">\n            |\n            <a (click)=\"runWindup($event, group)\" href=\"#\">Run Windup</a>\n        </span>\n\n        <div>\n            <div *ngIf=\"status(group).state == 'STARTED'\">\n                <progress-bar\n                        [taskName]=\"status(group).currentTask\"\n                        [currentValue]=\"status(group).workCompleted\"\n                        [minValue]=\"0\"\n                        [maxValue]=\"status(group).totalWork\"></progress-bar>\n            </div>\n        </div>\n\n    </div>\n    <div class=\"panel-body\">\n        <table class=\"datatable table table-striped table-bordered\">\n            <thead>\n                <tr>\n                    <th>Application</th>\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr *ngFor=\"let app of group.applications\">\n                    <td>\n                        {{app.title}}\n                    </td>\n                    <td>\n                        <a *ngIf=\"app.reportIndexPath != null\" class=\"btn btn-default btn-md\" target=\"_blank\" href=\"{{reportURL(app)}}\">\n                            <span class=\"glyphicon glyphicon-file\"></span>\n                            View Report\n                        </a>\n                        <button class=\"btn btn-default\" (click)=\"editApplication(app)\">\n                            Edit\n                        </button>\n                        <button class=\"btn btn-danger\" (click)=\"deleteApplication(app)\">\n                            {{app.registrationType == \"UPLOADED\" ? \"Delete\" : \"Remove\"}}\n                        </button>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n        <button (click)=\"registerApplication(group)\" class=\"btn btn-primary\" type=\"button\">Register Application</button>\n    </div>\n</div>\n";

/***/ },

/***/ 518:
/***/ function(module, exports) {

module.exports = "<h1>\n    Create Migration Project\n</h1>\n<form #projectForm=\"ngForm\" (ngSubmit)=\"save()\" class=\"form-horizontal\">\n    <div *ngFor=\"let errorMessage of errorMessages\" class=\"row form-errors alert alert-danger\">\n        <div class=\"col-md-2\">&nbsp;</div>\n        <div class=\"col-md-10\">\n            <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n            {{errorMessage}}\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"form-group\">\n            <label class=\"col-md-2 control-label\" for=\"idProjectTitle\">Migration Project Title</label>\n            <div class=\"col-md-6\">\n                <input #projectTitleControl=\"ngModel\"\n                       name=\"projectTitle\"\n                       [(ngModel)]=\"model.title\"\n                       [disabled]=\"loading\"\n                       required\n                       minlength=\"4\"\n                       maxlength=\"128\"\n                       type=\"text\"\n                       id=\"idProjectTitle\"\n                       class=\"form-control\">\n            </div>\n            <span [class.hidden]=\"!hasError(projectTitleControl)\" class=\"help-block\">\n                The title must be greater than 3 characters long and fewer than 128 characters.\n            </span>\n        </div>\n        <div class=\"form-group\">\n            <div class=\"col-md-10 col-md-offset-2\">\n                <button class=\"btn btn-primary\" type=\"submit\" [disabled]=\"!projectForm.form.valid || loading\">Save</button>\n                <button (click)=\"cancel()\" type=\"button\" class=\"btn btn-default\">Cancel</button>\n            </div>\n        </div>\n    </div>\n</form>";

/***/ },

/***/ 519:
/***/ function(module, exports) {

module.exports = "<nav class=\"navbar navbar-default navbar-pf\" role=\"navigation\">\n    <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse-1\">\n            <span class=\"sr-only\">Toggle navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" routerLink=\"/project-list\" href=\"#\">\n            Windup 3.0\n        </a>\n    </div>\n    <div class=\"collapse navbar-collapse navbar-collapse-1\">\n        <ul class=\"nav navbar-nav navbar-utility\">\n            <li [class.active]=\"isActive(settingsLink)\">\n                <a #settingsLink routerLink=\"/configuration\">Settings</a>\n            </li>\n            <li class=\"dropdown\">\n                <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n                    <span class=\"pficon pficon-user\"></span>\n                    {{username}} <b class=\"caret\"></b>\n                </a>\n                <ul class=\"dropdown-menu\">\n                    <li>\n                        <a (click)=\"logout($event)\" href=\"#\">Logout</a>\n                    </li>\n                </ul>\n            </li>\n        </ul>\n        <ul class=\"nav navbar-nav navbar-primary\">\n            <li [class.active]=\"isActive(projectListLink)\">\n                <a #projectListLink routerLink=\"/project-list\">Home</a>\n            </li>\n        </ul>\n    </div>\n</nav>";

/***/ },

/***/ 520:
/***/ function(module, exports) {

module.exports = "<div [ngClass]=\"getClass(notification)\" class=\"alert alert-dismissable\" *ngFor=\"let notification of notificationsStack\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\" (click)=\"closeNotification(notification)\">\n        <span class=\"pficon pficon-close\"></span>\n    </button>\n    <span [ngClass]=\"getIcon(notification)\" class=\"pficon\"></span>\n    <strong>Error: </strong> {{notification.message}}.\n</div>\n";

/***/ },

/***/ 521:
/***/ function(module, exports) {

module.exports = "<h1>\n    Project List\n    <button (click)=\"createMigrationProject()\" class=\"btn btn-primary\" type=\"button\">Create Migration Project</button>\n</h1>\n<h3 *ngIf=\"errorMessage != null\">{{errorMessage}}</h3>\n<table class=\"datatable table table-striped table-bordered\">\n    <thead>\n    <tr>\n        <th>Project</th>\n        <th>Actions</th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let project of projects\">\n        <td class=\"col-md-1\">\n            <a href=\"#\" (click)=\"viewProject(project, $event)\">{{project.title}}</a>\n        </td>\n        <td class=\"col-md-1\">\n            <a href=\"#\" (click)=\"editProject(project, $event)\">Edit</a>\n        </td>\n    </tr>\n    </tbody>\n</table>\n<script>\n    // Initialize Datatables\n    $(document).ready(function () {\n        $('.datatable').dataTable();\n    });\n</script>\n";

/***/ },

/***/ 522:
/***/ function(module, exports) {

module.exports = "<style>\n    .technologyItems {\n        font-size: 0;\n        width: 100%;\n    }\n\n    .technologyItem {\n        font-size: small;\n        font-weight: bold;\n        padding-left: 2em;\n        padding-right: 2em;\n        margin: auto;\n        border-top: solid 1px;\n        border-bottom: 3px solid #734d00;\n        display: inline-block;\n    }\n\n    .technologies-table {\n        margin-top: 10px;\n    }\n</style>\n\n<div class=\"container-fluid\">\n    <h1>\n        Technologies &gt;\n        All Projects &gt;\n        <select class=\"form-input\">\n            <option value=\"foo1\">Group 1</option>\n            <option value=\"foo1\">Group 2</option>\n        </select>\n    </h1>\n    <div class=\"technologyItems\">\n        <div class=\"technologyItem col-lg-2\">Java xx%</div>\n        <div class=\"technologyItem col-lg-2\">JavaScript xx%</div>\n        <div class=\"technologyItem col-lg-2\">FreeMarker xx%</div>\n        <div class=\"technologyItem col-lg-2\">HTML xx%</div>\n        <div class=\"technologyItem col-lg-2\">CSS xx%</div>\n        <div class=\"technologyItem col-lg-2\">Other xx%</div>\n    </div>\n</div>\n\n<div class=\"container-fluid container-cards-pf\">\n    <div class=\"row row-cards-pf\">\n        <div class=\"col-xs-12 col-sm-6 col-md-4 col-lg-4\">\n            <div class=\"card-pf card-pf-view card-pf-view-select card-pf-view-single-select\">\n                <div class=\"card-pf-body\">\n                    <div class=\"card-pf-top-element\">\n                        <h2>Services (exposed/consumed)</h2>\n                    </div>\n                    <div class=\"card-pf-items text-center\">\n                        <table class=\"datatable table table-striped table-bordered technologies-table\">\n                            <thead>\n                                <tr>\n                                    <th>EJB</th>\n                                    <th>Amount</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td>Stateless</td>\n                                    <td>55</td>\n                                </tr>\n                                <tr>\n                                    <td>Stateful</td>\n                                    <td>380</td>\n                                </tr>\n                                <tr>\n                                    <td>Message Driven</td>\n                                    <td>1</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                        <table class=\"datatable table table-striped table-bordered technologies-table\">\n                            <thead>\n                                <tr>\n                                    <th>HTTP</th>\n                                    <th>Amount</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td>JAX-RS Services</td>\n                                    <td>2</td>\n                                </tr>\n                                <tr>\n                                    <td>JAX-WS Services</td>\n                                    <td>43</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                        <table class=\"datatable table table-striped table-bordered technologies-table\">\n                            <thead>\n                                <tr>\n                                    <th>Other</th>\n                                    <th>Amount</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td>Persistence units</td>\n                                    <td>4</td>\n                                </tr>\n                                <tr>\n                                    <td>JPA Named Queries</td>\n                                    <td>32</td>\n                                </tr>\n                                <tr>\n                                    <td>JPA Entities</td>\n                                    <td>4</td>\n                                </tr>\n                                <tr>\n                                    <td>JPA Entities</td>\n                                    <td>4</td>\n                                </tr>\n                                <tr>\n                                    <td>RMI</td>\n                                    <td>23</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                </div>\n                <div class=\"card-pf-view-checkbox\">\n                    <input type=\"checkbox\">\n                </div>\n            </div>\n        </div>\n        <div class=\"col-xs-12 col-sm-6 col-md-4 col-lg-4\">\n            <div class=\"card-pf card-pf-view card-pf-view-select card-pf-view-single-select\">\n                <div class=\"card-pf-body\">\n                    <div class=\"card-pf-top-element\">\n                        <h2>Server resources - Java EE</h2>\n                    </div>\n                    <div class=\"card-pf-items text-center\">\n                        <table class=\"datatable table table-striped table-bordered technologies-table\">\n                            <thead>\n                                <tr>\n                                    <th>Database</th>\n                                    <th>Amount</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td>JDBC datasources</td>\n                                    <td>5</td>\n                                </tr>\n                                <tr>\n                                    <td>XA JDBC datasources</td>\n                                    <td>3</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                        <table class=\"datatable table table-striped table-bordered technologies-table\">\n                            <thead>\n                                <tr>\n                                    <th>Messaging</th>\n                                    <th>Amount</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td>JMS Queues</td>\n                                    <td>3</td>\n                                </tr>\n                                <tr>\n                                    <td>JMS Topics</td>\n                                    <td>4</td>\n                                </tr>\n                                <tr>\n                                    <td>JMS Connection Factories</td>\n                                    <td>1</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                        <table class=\"datatable table table-striped table-bordered technologies-table\">\n                            <thead>\n                                <tr>\n                                    <th>Other</th>\n                                    <th>Amount</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td>Security Realms</td>\n                                    <td>0</td>\n                                </tr>\n                                <tr>\n                                    <td>Other JNDI entries</td>\n                                    <td>13</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-xs-12 col-sm-6 col-md-4 col-lg-4\">\n            <div class=\"card-pf card-pf-view card-pf-view-select card-pf-view-single-select\">\n                <div class=\"card-pf-body\">\n                    <div class=\"card-pf-top-element\">\n                        <h2>Miscellaneous Data</h2>\n                    </div>\n                    <div class=\"card-pf-items text-center\">\n                        <table class=\"datatable table table-striped table-bordered technologies-table\">\n                            <thead>\n                                <tr>\n                                    <th>Sizing</th>\n                                    <th>Classes</th>\n                                    <th>Embedded</th>\n                                    <th>Size</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td>Self-written</td>\n                                    <td>340</td>\n                                    <td>23 jars</td>\n                                    <td>3.5MB</td>\n                                </tr>\n                                <tr>\n                                    <td>Total</td>\n                                    <td>5342</td>\n                                    <td>50 jars</td>\n                                    <td>20MB</td>\n                                </tr>\n                            </tbody>\n                        </table>\n\n                        <div class=\"majorIncludedTechnologies\">\n\n                        </div>\n\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ },

/***/ 523:
/***/ function(module, exports) {

module.exports = "<div class=\"modal fade\" id=\"rulesModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"Rules List\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-lg\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n                    <span class=\"pficon pficon-close\"></span>\n                </button>\n                <h4 class=\"modal-title\" id=\"myModalLabel\">\n                    Rules for: {{ruleProviderEntity.providerID}}\n                </h4>\n            </div>\n            <div class=\"modal-body\">\n                <table class=\"datatable table table-striped table-bordered\">\n                    <thead>\n                    <tr>\n                        <th>Rule ID</th>\n                        <th>Contents</th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                        <tr *ngFor=\"let ruleEntity of ruleProviderEntity.rules\">\n                            <td>\n                                {{ruleEntity.ruleID}}\n                            </td>\n                            <td>\n                                {{ruleEntity.ruleContents}}\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>";

/***/ },

/***/ 524:
/***/ function(module, exports) {

module.exports = "<h2>Upload progress</h2>\n<div class=\"progress\">\n    <div class=\"progress-bar\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n         [attr.aria-valuenow]=\"uploader.progress\"\n         [ngStyle]=\"{ 'width': uploader.progress + '%' }\"\n    >\n        {{ uploader.progress }}%\n    </div>\n</div>\n";

/***/ },

/***/ 525:
/***/ function(module, exports) {

module.exports = "<h2>Files queue</h2>\n<table class=\"table\">\n    <thead>\n        <tr>\n            <th>Name</th>\n            <th>Size</th>\n            <th>Progress</th>\n            <th>Status</th>\n            <th>Actions</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr *ngFor=\"let item of uploader.queue\">\n            <td>{{ item?.file?.name }}</td>\n            <td>{{ item?.file?.size / 1024 / 1024 | number:'.2' }} MB</td>\n            <td>{{ getProgress(item) }}%</td>\n            <td class=\"text-center\">\n                <span *ngIf=\"item.isSuccess\"><i class=\"glyphicon glyphicon-ok\"></i></span>\n                <span *ngIf=\"item.isCancel\"><i class=\"glyphicon glyphicon-ban-circle\"></i></span>\n                <span *ngIf=\"item.isError\"><i class=\"glyphicon glyphicon-remove\"></i></span>\n            </td>\n            <td>\n                <button type=\"button\" class=\"btn btn-warning btn-xs\"\n                        (click)=\"item.cancel()\" [disabled]=\"!item.isUploading\">\n                    <span class=\"glyphicon glyphicon-ban-circle\"></span> Cancel\n                </button>\n                <button type=\"button\" class=\"btn btn-danger btn-xs\"\n                        (click)=\"item.remove()\">\n                    <span class=\"glyphicon glyphicon-trash\"></span> Remove\n                </button>\n            </td>\n        </tr>\n    </tbody>\n</table>\n";

/***/ },

/***/ 530:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var file_like_object_class_1 = __webpack_require__(332);
var FileItem = (function () {
    function FileItem(uploader, some, options) {
        this.url = '/';
        this.headers = [];
        this.withCredentials = true;
        this.formData = [];
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = false;
        this.progress = 0;
        this.index = void 0;
        this.uploader = uploader;
        this.some = some;
        this.options = options;
        this.file = new file_like_object_class_1.FileLikeObject(some);
        this._file = some;
        if (uploader.options) {
            this.method = uploader.options.method || 'POST';
            this.alias = uploader.options.itemAlias || 'file';
        }
        this.url = uploader.options.url;
    }
    FileItem.prototype.upload = function () {
        try {
            this.uploader.uploadItem(this);
        }
        catch (e) {
            this.uploader._onCompleteItem(this, '', 0, {});
            this.uploader._onErrorItem(this, '', 0, {});
        }
    };
    FileItem.prototype.cancel = function () {
        this.uploader.cancelItem(this);
    };
    FileItem.prototype.remove = function () {
        this.uploader.removeFromQueue(this);
    };
    FileItem.prototype.onBeforeUpload = function () {
        return void 0;
    };
    FileItem.prototype.onBuildForm = function (form) {
        return { form: form };
    };
    FileItem.prototype.onProgress = function (progress) {
        return { progress: progress };
    };
    FileItem.prototype.onSuccess = function (response, status, headers) {
        return { response: response, status: status, headers: headers };
    };
    FileItem.prototype.onError = function (response, status, headers) {
        return { response: response, status: status, headers: headers };
    };
    FileItem.prototype.onCancel = function (response, status, headers) {
        return { response: response, status: status, headers: headers };
    };
    FileItem.prototype.onComplete = function (response, status, headers) {
        return { response: response, status: status, headers: headers };
    };
    FileItem.prototype._onBeforeUpload = function () {
        this.isReady = true;
        this.isUploading = true;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = false;
        this.progress = 0;
        this.onBeforeUpload();
    };
    FileItem.prototype._onBuildForm = function (form) {
        this.onBuildForm(form);
    };
    FileItem.prototype._onProgress = function (progress) {
        this.progress = progress;
        this.onProgress(progress);
    };
    FileItem.prototype._onSuccess = function (response, status, headers) {
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = true;
        this.isSuccess = true;
        this.isCancel = false;
        this.isError = false;
        this.progress = 100;
        this.index = void 0;
        this.onSuccess(response, status, headers);
    };
    FileItem.prototype._onError = function (response, status, headers) {
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = true;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = true;
        this.progress = 0;
        this.index = void 0;
        this.onError(response, status, headers);
    };
    FileItem.prototype._onCancel = function (response, status, headers) {
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = true;
        this.isError = false;
        this.progress = 0;
        this.index = void 0;
        this.onCancel(response, status, headers);
    };
    FileItem.prototype._onComplete = function (response, status, headers) {
        this.onComplete(response, status, headers);
        if (this.uploader.options.removeAfterUpload) {
            this.remove();
        }
    };
    FileItem.prototype._prepareToUploading = function () {
        this.index = this.index || ++this.uploader._nextIndex;
        this.isReady = true;
    };
    return FileItem;
}());
exports.FileItem = FileItem;


/***/ },

/***/ 531:
/***/ function(module, exports) {

"use strict";
"use strict";
var FileType = (function () {
    function FileType() {
    }
    FileType.getMimeClass = function (file) {
        var mimeClass = 'application';
        if (this.mime_psd.indexOf(file.type) !== -1) {
            mimeClass = 'image';
        }
        else if (file.type.match('image.*')) {
            mimeClass = 'image';
        }
        else if (file.type.match('video.*')) {
            mimeClass = 'video';
        }
        else if (file.type.match('audio.*')) {
            mimeClass = 'audio';
        }
        else if (file.type === 'application/pdf') {
            mimeClass = 'pdf';
        }
        else if (this.mime_compress.indexOf(file.type) !== -1) {
            mimeClass = 'compress';
        }
        else if (this.mime_doc.indexOf(file.type) !== -1) {
            mimeClass = 'doc';
        }
        else if (this.mime_xsl.indexOf(file.type) !== -1) {
            mimeClass = 'xls';
        }
        else if (this.mime_ppt.indexOf(file.type) !== -1) {
            mimeClass = 'ppt';
        }
        if (mimeClass === 'application') {
            mimeClass = this.fileTypeDetection(file.name);
        }
        return mimeClass;
    };
    FileType.fileTypeDetection = function (inputFilename) {
        var types = {
            'jpg': 'image',
            'jpeg': 'image',
            'tif': 'image',
            'psd': 'image',
            'bmp': 'image',
            'png': 'image',
            'nef': 'image',
            'tiff': 'image',
            'cr2': 'image',
            'dwg': 'image',
            'cdr': 'image',
            'ai': 'image',
            'indd': 'image',
            'pin': 'image',
            'cdp': 'image',
            'skp': 'image',
            'stp': 'image',
            '3dm': 'image',
            'mp3': 'audio',
            'wav': 'audio',
            'wma': 'audio',
            'mod': 'audio',
            'm4a': 'audio',
            'compress': 'compress',
            'rar': 'compress',
            '7z': 'compress',
            'lz': 'compress',
            'z01': 'compress',
            'pdf': 'pdf',
            'xls': 'xls',
            'xlsx': 'xls',
            'ods': 'xls',
            'mp4': 'video',
            'avi': 'video',
            'wmv': 'video',
            'mpg': 'video',
            'mts': 'video',
            'flv': 'video',
            '3gp': 'video',
            'vob': 'video',
            'm4v': 'video',
            'mpeg': 'video',
            'm2ts': 'video',
            'mov': 'video',
            'doc': 'doc',
            'docx': 'doc',
            'eps': 'doc',
            'txt': 'doc',
            'odt': 'doc',
            'rtf': 'doc',
            'ppt': 'ppt',
            'pptx': 'ppt',
            'pps': 'ppt',
            'ppsx': 'ppt',
            'odp': 'ppt'
        };
        var chunks = inputFilename.split('.');
        if (chunks.length < 2) {
            return 'application';
        }
        var extension = chunks[chunks.length - 1].toLowerCase();
        if (types[extension] === undefined) {
            return 'application';
        }
        else {
            return types[extension];
        }
    };
    /*  MS office  */
    FileType.mime_doc = [
        'application/msword',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        'application/vnd.ms-word.document.macroEnabled.12',
        'application/vnd.ms-word.template.macroEnabled.12'
    ];
    FileType.mime_xsl = [
        'application/vnd.ms-excel',
        'application/vnd.ms-excel',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.ms-excel.template.macroEnabled.12',
        'application/vnd.ms-excel.addin.macroEnabled.12',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
    ];
    FileType.mime_ppt = [
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.template',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/vnd.ms-powerpoint.addin.macroEnabled.12',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
    ];
    /* PSD */
    FileType.mime_psd = [
        'image/photoshop',
        'image/x-photoshop',
        'image/psd',
        'application/photoshop',
        'application/psd',
        'zz-application/zz-winassoc-psd'
    ];
    /* Compressed files */
    FileType.mime_compress = [
        'application/x-gtar',
        'application/x-gcompress',
        'application/compress',
        'application/x-tar',
        'application/x-rar-compressed',
        'application/octet-stream'
    ];
    return FileType;
}());
exports.FileType = FileType;


/***/ },

/***/ 532:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var common_1 = __webpack_require__(53);
var core_1 = __webpack_require__(1);
var file_drop_directive_1 = __webpack_require__(331);
var file_select_directive_1 = __webpack_require__(333);
var FileUploadModule = (function () {
    function FileUploadModule() {
    }
    FileUploadModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [file_drop_directive_1.FileDropDirective, file_select_directive_1.FileSelectDirective],
            exports: [file_drop_directive_1.FileDropDirective, file_select_directive_1.FileSelectDirective]
        }), 
        __metadata('design:paramtypes', [])
    ], FileUploadModule);
    return FileUploadModule;
}());
exports.FileUploadModule = FileUploadModule;


/***/ },

/***/ 58:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return EventEmitter; });
/* unused harmony reexport Observable */
/* unused harmony reexport Subject */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * Use by directives and components to emit custom Events.
 *
 * ### Examples
 *
 * In the following example, `Zippy` alternatively emits `open` and `close` events when its
 * title gets clicked:
 *
 * ```
 * @Component({
 *   selector: 'zippy',
 *   template: `
 *   <div class="zippy">
 *     <div (click)="toggle()">Toggle</div>
 *     <div [hidden]="!visible">
 *       <ng-content></ng-content>
 *     </div>
 *  </div>`})
 * export class Zippy {
 *   visible: boolean = true;
 *   @Output() open: EventEmitter<any> = new EventEmitter();
 *   @Output() close: EventEmitter<any> = new EventEmitter();
 *
 *   toggle() {
 *     this.visible = !this.visible;
 *     if (this.visible) {
 *       this.open.emit(null);
 *     } else {
 *       this.close.emit(null);
 *     }
 *   }
 * }
 * ```
 *
 * The events payload can be accessed by the parameter `$event` on the components output event
 * handler:
 *
 * ```
 * <zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>
 * ```
 *
 * Uses Rx.Observable but provides an adapter to make it work as specified here:
 * https://github.com/jhusain/observable-spec
 *
 * Once a reference implementation of the spec is available, switch to it.
 * @stable
 */
var EventEmitter = (function (_super) {
    __extends(EventEmitter, _super);
    /**
     * Creates an instance of [EventEmitter], which depending on [isAsync],
     * delivers events synchronously or asynchronously.
     */
    function EventEmitter(isAsync) {
        if (isAsync === void 0) { isAsync = false; }
        _super.call(this);
        this.__isAsync = isAsync;
    }
    EventEmitter.prototype.emit = function (value) { _super.prototype.next.call(this, value); };
    EventEmitter.prototype.subscribe = function (generatorOrNext, error, complete) {
        var schedulerFn;
        var errorFn = function (err) { return null; };
        var completeFn = function () { return null; };
        if (generatorOrNext && typeof generatorOrNext === 'object') {
            schedulerFn = this.__isAsync ? function (value /** TODO #9100 */) {
                setTimeout(function () { return generatorOrNext.next(value); });
            } : function (value /** TODO #9100 */) { generatorOrNext.next(value); };
            if (generatorOrNext.error) {
                errorFn = this.__isAsync ? function (err) { setTimeout(function () { return generatorOrNext.error(err); }); } :
                    function (err) { generatorOrNext.error(err); };
            }
            if (generatorOrNext.complete) {
                completeFn = this.__isAsync ? function () { setTimeout(function () { return generatorOrNext.complete(); }); } :
                    function () { generatorOrNext.complete(); };
            }
        }
        else {
            schedulerFn = this.__isAsync ? function (value /** TODO #9100 */) {
                setTimeout(function () { return generatorOrNext(value); });
            } : function (value /** TODO #9100 */) { generatorOrNext(value); };
            if (error) {
                errorFn =
                    this.__isAsync ? function (err) { setTimeout(function () { return error(err); }); } : function (err) { error(err); };
            }
            if (complete) {
                completeFn =
                    this.__isAsync ? function () { setTimeout(function () { return complete(); }); } : function () { complete(); };
            }
        }
        return _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
    };
    return EventEmitter;
}(__WEBPACK_IMPORTED_MODULE_0_rxjs_Subject__["Subject"]));
//# sourceMappingURL=async.js.map

/***/ },

/***/ 62:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var ApplicationGroupService = (function (_super) {
    __extends(ApplicationGroupService, _super);
    function ApplicationGroupService(_http) {
        _super.call(this);
        this._http = _http;
        this.GET_ALL_URL = "/applicationGroups/list";
        this.GET_BY_PROJECT_URL = "/applicationGroups/by-project/";
        this.GET_BY_ID_URL = "/applicationGroups/get";
        this.CREATE_URL = "/applicationGroups/create";
        this.UPDATE_URL = "/applicationGroups/update";
    }
    ApplicationGroupService.prototype.create = function (applicationGroup) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = JSON.stringify(applicationGroup);
        return this._http.put(constants_1.Constants.REST_BASE + this.CREATE_URL, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ApplicationGroupService.prototype.update = function (applicationGroup) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = JSON.stringify(applicationGroup);
        return this._http.put(constants_1.Constants.REST_BASE + this.UPDATE_URL, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ApplicationGroupService.prototype.get = function (id) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_BY_ID_URL + "/" + id, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ApplicationGroupService.prototype.getByProjectID = function (projectID) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_BY_PROJECT_URL + projectID, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ApplicationGroupService.prototype.getAll = function () {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_ALL_URL, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ApplicationGroupService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], ApplicationGroupService);
    return ApplicationGroupService;
    var _a;
}(abtract_service_1.AbstractService));
exports.ApplicationGroupService = ApplicationGroupService;


/***/ },

/***/ 67:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var constants_1 = __webpack_require__(23);
var Observable_1 = __webpack_require__(0);
var KeycloakService = (function () {
    function KeycloakService() {
    }
    Object.defineProperty(KeycloakService.prototype, "username", {
        get: function () {
            if (KeycloakService.auth.authz)
                return KeycloakService.auth.authz.tokenParsed.name;
        },
        enumerable: true,
        configurable: true
    });
    KeycloakService.init = function () {
        return KeycloakService.initWithKeycloakJSONPath('keycloak.json');
    };
    KeycloakService.initWithKeycloakJSONPath = function (path) {
        var keycloakAuth = new Keycloak(path);
        KeycloakService.auth.loggedIn = false;
        return new Promise(function (resolve, reject) {
            keycloakAuth.init({ onLoad: 'login-required' })
                .success(function (auth) {
                if (!auth) {
                    console.log('window.location.href');
                    //window.location.href = Constants.UNAUTHENTICATED_PAGE;
                    return;
                }
                KeycloakService.auth.loggedIn = true;
                KeycloakService.auth.authz = keycloakAuth;
                KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/windup/tokens/logout?redirect_uri=" + constants_1.Constants.AUTH_REDIRECT_URL;
                resolve(null);
            })
                .error(function () {
                reject(null);
            });
        });
    };
    KeycloakService.prototype.logout = function () {
        console.log('*** LOGOUT');
        KeycloakService.auth.authz.logout();
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;
    };
    KeycloakService.prototype.getToken = function () {
        var promise = new Promise(function (resolve, reject) {
            if (KeycloakService.auth.authz.token) {
                KeycloakService.auth.authz.updateToken(5).success(function () {
                    var token = KeycloakService.auth.authz.token;
                    resolve(token);
                })
                    .error(function () {
                    reject('Failed to refresh token');
                });
            }
        });
        return Observable_1.Observable.fromPromise(promise);
    };
    KeycloakService.auth = {};
    KeycloakService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], KeycloakService);
    return KeycloakService;
}());
exports.KeycloakService = KeycloakService;


/***/ },

/***/ 74:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_forms__ = __webpack_require__(465);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "AbstractControlDirective", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "AbstractFormGroupDirective", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "CheckboxControlValueAccessor", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "ControlContainer", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NG_VALUE_ACCESSOR", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "DefaultValueAccessor", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgControl", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgControlStatus", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["h"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgControlStatusGroup", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["i"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgForm", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["j"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgModel", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["k"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgModelGroup", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["l"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "RadioControlValueAccessor", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["m"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormControlDirective", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["n"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormControlName", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["o"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormGroupDirective", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["p"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormArrayName", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["q"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormGroupName", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["r"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgSelectOption", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["s"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "SelectControlValueAccessor", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["t"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "SelectMultipleControlValueAccessor", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["u"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "MaxLengthValidator", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["v"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "MinLengthValidator", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["w"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "PatternValidator", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["x"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "RequiredValidator", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["y"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormBuilder", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["z"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "AbstractControl", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["A"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormArray", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["B"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormControl", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["C"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormGroup", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["D"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NG_ASYNC_VALIDATORS", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["E"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NG_VALIDATORS", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["F"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Validators", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["G"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FormsModule", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["H"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "ReactiveFormsModule", function() { return __WEBPACK_IMPORTED_MODULE_0__src_forms__["I"]; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the forms package.
 */

//# sourceMappingURL=index.js.map

/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared__ = __webpack_require__(46);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AbstractFormGroupDirective; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * This is a base class for code shared between {@link NgModelGroup} and {@link FormGroupName}.
 *
 * @stable
 */
var AbstractFormGroupDirective = (function (_super) {
    __extends(AbstractFormGroupDirective, _super);
    function AbstractFormGroupDirective() {
        _super.apply(this, arguments);
    }
    AbstractFormGroupDirective.prototype.ngOnInit = function () {
        this._checkParentType();
        this.formDirective.addFormGroup(this);
    };
    AbstractFormGroupDirective.prototype.ngOnDestroy = function () {
        if (this.formDirective) {
            this.formDirective.removeFormGroup(this);
        }
    };
    Object.defineProperty(AbstractFormGroupDirective.prototype, "control", {
        /**
         * Get the {@link FormGroup} backing this binding.
         */
        get: function () { return this.formDirective.getFormGroup(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractFormGroupDirective.prototype, "path", {
        /**
         * Get the path to this control group.
         */
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shared__["a" /* controlPath */])(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractFormGroupDirective.prototype, "formDirective", {
        /**
         * Get the {@link Form} to which this group belongs.
         */
        get: function () { return this._parent ? this._parent.formDirective : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractFormGroupDirective.prototype, "validator", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shared__["b" /* composeValidators */])(this._validators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractFormGroupDirective.prototype, "asyncValidator", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shared__["c" /* composeAsyncValidators */])(this._asyncValidators); },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    AbstractFormGroupDirective.prototype._checkParentType = function () { };
    return AbstractFormGroupDirective;
}(__WEBPACK_IMPORTED_MODULE_0__control_container__["a" /* ControlContainer */]));
//# sourceMappingURL=abstract_form_group_directive.js.map

/***/ },

/***/ 76:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_async__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shared__ = __webpack_require__(46);
/* unused harmony export formDirectiveProvider */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgForm; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};








var formDirectiveProvider = {
    provide: __WEBPACK_IMPORTED_MODULE_6__control_container__["a" /* ControlContainer */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return NgForm; })
};
var resolvedPromise = Promise.resolve(null);
/**
 * @whatItDoes Creates a top-level {@link FormGroup} instance and binds it to a form
 * to track aggregate form value and validation status.
 *
 * @howToUse
 *
 * As soon as you import the `FormsModule`, this directive becomes active by default on
 * all `<form>` tags.  You don't need to add a special selector.
 *
 * You can export the directive into a local template variable using `ngForm` as the key
 * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
 * {@link FormGroup} instance are duplicated on the directive itself, so a reference to it
 * will give you access to the aggregate value and validity status of the form, as well as
 * user interaction properties like `dirty` and `touched`.
 *
 * To register child controls with the form, you'll want to use {@link NgModel} with a
 * `name` attribute.  You can also use {@link NgModelGroup} if you'd like to create
 * sub-groups within the form.
 *
 * You can listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission.
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * * **npm package**: `@angular/forms`
 *
 * * **NgModule**: `FormsModule`
 *
 *  @stable
 */
var NgForm = (function (_super) {
    __extends(NgForm, _super);
    function NgForm(validators, asyncValidators) {
        _super.call(this);
        this._submitted = false;
        this.ngSubmit = new __WEBPACK_IMPORTED_MODULE_1__facade_async__["a" /* EventEmitter */]();
        this.form =
            new __WEBPACK_IMPORTED_MODULE_4__model__["a" /* FormGroup */]({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["b" /* composeValidators */])(validators), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["c" /* composeAsyncValidators */])(asyncValidators));
    }
    Object.defineProperty(NgForm.prototype, "submitted", {
        get: function () { return this._submitted; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgForm.prototype, "formDirective", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgForm.prototype, "control", {
        get: function () { return this.form; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgForm.prototype, "path", {
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgForm.prototype, "controls", {
        get: function () { return this.form.controls; },
        enumerable: true,
        configurable: true
    });
    NgForm.prototype.addControl = function (dir) {
        var _this = this;
        resolvedPromise.then(function () {
            var container = _this._findContainer(dir.path);
            dir._control = container.registerControl(dir.name, dir.control);
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["d" /* setUpControl */])(dir.control, dir);
            dir.control.updateValueAndValidity({ emitEvent: false });
        });
    };
    NgForm.prototype.getControl = function (dir) { return this.form.get(dir.path); };
    NgForm.prototype.removeControl = function (dir) {
        var _this = this;
        resolvedPromise.then(function () {
            var container = _this._findContainer(dir.path);
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["a" /* isPresent */])(container)) {
                container.removeControl(dir.name);
            }
        });
    };
    NgForm.prototype.addFormGroup = function (dir) {
        var _this = this;
        resolvedPromise.then(function () {
            var container = _this._findContainer(dir.path);
            var group = new __WEBPACK_IMPORTED_MODULE_4__model__["a" /* FormGroup */]({});
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["e" /* setUpFormContainer */])(group, dir);
            container.registerControl(dir.name, group);
            group.updateValueAndValidity({ emitEvent: false });
        });
    };
    NgForm.prototype.removeFormGroup = function (dir) {
        var _this = this;
        resolvedPromise.then(function () {
            var container = _this._findContainer(dir.path);
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["a" /* isPresent */])(container)) {
                container.removeControl(dir.name);
            }
        });
    };
    NgForm.prototype.getFormGroup = function (dir) { return this.form.get(dir.path); };
    NgForm.prototype.updateModel = function (dir, value) {
        var _this = this;
        resolvedPromise.then(function () {
            var ctrl = _this.form.get(dir.path);
            ctrl.setValue(value);
        });
    };
    NgForm.prototype.setValue = function (value) { this.control.setValue(value); };
    NgForm.prototype.onSubmit = function () {
        this._submitted = true;
        this.ngSubmit.emit(null);
        return false;
    };
    NgForm.prototype.onReset = function () { this.resetForm(); };
    NgForm.prototype.resetForm = function (value) {
        if (value === void 0) { value = undefined; }
        this.form.reset(value);
        this._submitted = false;
    };
    /** @internal */
    NgForm.prototype._findContainer = function (path) {
        path.pop();
        return __WEBPACK_IMPORTED_MODULE_2__facade_collection__["b" /* ListWrapper */].isEmpty(path) ? this.form : this.form.get(path);
    };
    NgForm.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: 'form:not([ngNoForm]):not([formGroup]),ngForm,[ngForm]',
                    providers: [formDirectiveProvider],
                    host: { '(submit)': 'onSubmit()', '(reset)': 'onReset()' },
                    outputs: ['ngSubmit'],
                    exportAs: 'ngForm'
                },] },
    ];
    /** @nocollapse */
    NgForm.ctorParameters = [
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_5__validators__["b" /* NG_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_5__validators__["c" /* NG_ASYNC_VALIDATORS */],] },] },
    ];
    return NgForm;
}(__WEBPACK_IMPORTED_MODULE_6__control_container__["a" /* ControlContainer */]));
//# sourceMappingURL=ng_form.js.map

/***/ },

/***/ 77:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__control_value_accessor__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ng_control__ = __webpack_require__(50);
/* unused harmony export RADIO_VALUE_ACCESSOR */
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return RadioControlRegistry; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return RadioControlValueAccessor; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */




var RADIO_VALUE_ACCESSOR = {
    provide: __WEBPACK_IMPORTED_MODULE_2__control_value_accessor__["a" /* NG_VALUE_ACCESSOR */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return RadioControlValueAccessor; }),
    multi: true
};
/**
 * Internal class used by Angular to uncheck radio buttons with the matching name.
 */
var RadioControlRegistry = (function () {
    function RadioControlRegistry() {
        this._accessors = [];
    }
    RadioControlRegistry.prototype.add = function (control, accessor) {
        this._accessors.push([control, accessor]);
    };
    RadioControlRegistry.prototype.remove = function (accessor) {
        var indexToRemove = -1;
        for (var i = 0; i < this._accessors.length; ++i) {
            if (this._accessors[i][1] === accessor) {
                indexToRemove = i;
            }
        }
        __WEBPACK_IMPORTED_MODULE_1__facade_collection__["b" /* ListWrapper */].removeAt(this._accessors, indexToRemove);
    };
    RadioControlRegistry.prototype.select = function (accessor) {
        var _this = this;
        this._accessors.forEach(function (c) {
            if (_this._isSameGroup(c, accessor) && c[1] !== accessor) {
                c[1].fireUncheck(accessor.value);
            }
        });
    };
    RadioControlRegistry.prototype._isSameGroup = function (controlPair, accessor) {
        if (!controlPair[0].control)
            return false;
        return controlPair[0]._parent === accessor._control._parent &&
            controlPair[1].name === accessor.name;
    };
    RadioControlRegistry.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    RadioControlRegistry.ctorParameters = [];
    return RadioControlRegistry;
}());
/**
 * @whatItDoes  Writes radio control values and listens to radio control changes.
 *
 * Used by {@link NgModel}, {@link FormControlDirective}, and {@link FormControlName}
 * to keep the view synced with the {@link FormControl} model.
 *
 * @howToUse
 *
 * If you have imported the {@link FormsModule} or the {@link ReactiveFormsModule}, this
 * value accessor will be active on any radio control that has a form directive. You do
 * **not** need to add a special selector to activate it.
 *
 * ### How to use radio buttons with form directives
 *
 * To use radio buttons in a template-driven form, you'll want to ensure that radio buttons
 * in the same group have the same `name` attribute.  Radio buttons with different `name`
 * attributes do not affect each other.
 *
 * {@example forms/ts/radioButtons/radio_button_example.ts region='TemplateDriven'}
 *
 * When using radio buttons in a reactive form, radio buttons in the same group should have the
 * same `formControlName`. You can also add a `name` attribute, but it's optional.
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 *  * **npm package**: `@angular/forms`
 *
 *  @stable
 */
var RadioControlValueAccessor = (function () {
    function RadioControlValueAccessor(_renderer, _elementRef, _registry, _injector) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._registry = _registry;
        this._injector = _injector;
        this.onChange = function () { };
        this.onTouched = function () { };
    }
    RadioControlValueAccessor.prototype.ngOnInit = function () {
        this._control = this._injector.get(__WEBPACK_IMPORTED_MODULE_3__ng_control__["a" /* NgControl */]);
        this._checkName();
        this._registry.add(this._control, this);
    };
    RadioControlValueAccessor.prototype.ngOnDestroy = function () { this._registry.remove(this); };
    RadioControlValueAccessor.prototype.writeValue = function (value) {
        this._state = value === this.value;
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'checked', this._state);
    };
    RadioControlValueAccessor.prototype.registerOnChange = function (fn) {
        var _this = this;
        this._fn = fn;
        this.onChange = function () {
            fn(_this.value);
            _this._registry.select(_this);
        };
    };
    RadioControlValueAccessor.prototype.fireUncheck = function (value) { this.writeValue(value); };
    RadioControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    RadioControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    RadioControlValueAccessor.prototype._checkName = function () {
        if (this.name && this.formControlName && this.name !== this.formControlName) {
            this._throwNameError();
        }
        if (!this.name && this.formControlName)
            this.name = this.formControlName;
    };
    RadioControlValueAccessor.prototype._throwNameError = function () {
        throw new Error("\n      If you define both a name and a formControlName attribute on your radio button, their values\n      must match. Ex: <input type=\"radio\" formControlName=\"food\" name=\"food\">\n    ");
    };
    RadioControlValueAccessor.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
                    host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
                    providers: [RADIO_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    RadioControlValueAccessor.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: RadioControlRegistry, },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"], },
    ];
    RadioControlValueAccessor.propDecorators = {
        'name': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'formControlName': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'value': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return RadioControlValueAccessor;
}());
//# sourceMappingURL=radio_control_value_accessor.js.map

/***/ },

/***/ 78:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facade_async__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facade_collection__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__facade_lang__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__reactive_errors__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shared__ = __webpack_require__(46);
/* unused harmony export formDirectiveProvider */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FormGroupDirective; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};








var formDirectiveProvider = {
    provide: __WEBPACK_IMPORTED_MODULE_5__control_container__["a" /* ControlContainer */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return FormGroupDirective; })
};
/**
 * @whatItDoes Binds an existing {@link FormGroup} to a DOM element.
 *
 * @howToUse
 *
 * This directive accepts an existing {@link FormGroup} instance. It will then use this
 * {@link FormGroup} instance to match any child {@link FormControl}, {@link FormGroup},
 * and {@link FormArray} instances to child {@link FormControlName}, {@link FormGroupName},
 * and {@link FormArrayName} directives.
 *
 * **Set value**: You can set the form's initial value when instantiating the
 * {@link FormGroup}, or you can set it programmatically later using the {@link FormGroup}'s
 * {@link AbstractControl.setValue} or {@link AbstractControl.patchValue} methods.
 *
 * **Listen to value**: If you want to listen to changes in the value of the form, you can subscribe
 * to the {@link FormGroup}'s {@link AbstractControl.valueChanges} event.  You can also listen to
 * its {@link AbstractControl.statusChanges} event to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * In this example, we create form controls for first name and last name.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * **npm package**: `@angular/forms`
 *
 * **NgModule**: {@link ReactiveFormsModule}
 *
 *  @stable
 */
var FormGroupDirective = (function (_super) {
    __extends(FormGroupDirective, _super);
    function FormGroupDirective(_validators, _asyncValidators) {
        _super.call(this);
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        this._submitted = false;
        this.directives = [];
        this.form = null;
        this.ngSubmit = new __WEBPACK_IMPORTED_MODULE_1__facade_async__["a" /* EventEmitter */]();
    }
    FormGroupDirective.prototype.ngOnChanges = function (changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
        }
    };
    Object.defineProperty(FormGroupDirective.prototype, "submitted", {
        get: function () { return this._submitted; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormGroupDirective.prototype, "formDirective", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormGroupDirective.prototype, "control", {
        get: function () { return this.form; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormGroupDirective.prototype, "path", {
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    FormGroupDirective.prototype.addControl = function (dir) {
        var ctrl = this.form.get(dir.path);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["d" /* setUpControl */])(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    };
    FormGroupDirective.prototype.getControl = function (dir) { return this.form.get(dir.path); };
    FormGroupDirective.prototype.removeControl = function (dir) { __WEBPACK_IMPORTED_MODULE_2__facade_collection__["b" /* ListWrapper */].remove(this.directives, dir); };
    FormGroupDirective.prototype.addFormGroup = function (dir) {
        var ctrl = this.form.get(dir.path);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["e" /* setUpFormContainer */])(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    };
    FormGroupDirective.prototype.removeFormGroup = function (dir) { };
    FormGroupDirective.prototype.getFormGroup = function (dir) { return this.form.get(dir.path); };
    FormGroupDirective.prototype.addFormArray = function (dir) {
        var ctrl = this.form.get(dir.path);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["e" /* setUpFormContainer */])(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    };
    FormGroupDirective.prototype.removeFormArray = function (dir) { };
    FormGroupDirective.prototype.getFormArray = function (dir) { return this.form.get(dir.path); };
    FormGroupDirective.prototype.updateModel = function (dir, value) {
        var ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
    };
    FormGroupDirective.prototype.onSubmit = function () {
        this._submitted = true;
        this.ngSubmit.emit(null);
        return false;
    };
    FormGroupDirective.prototype.onReset = function () { this.resetForm(); };
    FormGroupDirective.prototype.resetForm = function (value) {
        if (value === void 0) { value = undefined; }
        this.form.reset(value);
        this._submitted = false;
    };
    /** @internal */
    FormGroupDirective.prototype._updateDomValue = function () {
        var _this = this;
        this.directives.forEach(function (dir) {
            var newCtrl = _this.form.get(dir.path);
            if (dir._control !== newCtrl) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["h" /* cleanUpControl */])(dir._control, dir);
                if (newCtrl)
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["d" /* setUpControl */])(newCtrl, dir);
                dir._control = newCtrl;
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    };
    FormGroupDirective.prototype._updateRegistrations = function () {
        var _this = this;
        this.form._registerOnCollectionChange(function () { return _this._updateDomValue(); });
        if (this._oldForm)
            this._oldForm._registerOnCollectionChange(function () { });
        this._oldForm = this.form;
    };
    FormGroupDirective.prototype._updateValidators = function () {
        var sync = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["b" /* composeValidators */])(this._validators);
        this.form.validator = __WEBPACK_IMPORTED_MODULE_4__validators__["a" /* Validators */].compose([this.form.validator, sync]);
        var async = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__shared__["c" /* composeAsyncValidators */])(this._asyncValidators);
        this.form.asyncValidator = __WEBPACK_IMPORTED_MODULE_4__validators__["a" /* Validators */].composeAsync([this.form.asyncValidator, async]);
    };
    FormGroupDirective.prototype._checkFormPresent = function () {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__facade_lang__["b" /* isBlank */])(this.form)) {
            __WEBPACK_IMPORTED_MODULE_6__reactive_errors__["a" /* ReactiveErrors */].missingFormException();
        }
    };
    FormGroupDirective.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[formGroup]',
                    providers: [formDirectiveProvider],
                    host: { '(submit)': 'onSubmit()', '(reset)': 'onReset()' },
                    exportAs: 'ngForm'
                },] },
    ];
    /** @nocollapse */
    FormGroupDirective.ctorParameters = [
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_4__validators__["b" /* NG_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_4__validators__["c" /* NG_ASYNC_VALIDATORS */],] },] },
    ];
    FormGroupDirective.propDecorators = {
        'form': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['formGroup',] },],
        'ngSubmit': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
    };
    return FormGroupDirective;
}(__WEBPACK_IMPORTED_MODULE_5__control_container__["a" /* ControlContainer */]));
//# sourceMappingURL=form_group_directive.js.map

/***/ },

/***/ 79:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__validators__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__abstract_form_group_directive__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__control_container__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__reactive_errors__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__form_group_directive__ = __webpack_require__(78);
/* unused harmony export formGroupNameProvider */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FormGroupName; });
/* unused harmony export formArrayNameProvider */
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return FormArrayName; });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};







var formGroupNameProvider = {
    provide: __WEBPACK_IMPORTED_MODULE_3__control_container__["a" /* ControlContainer */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return FormGroupName; })
};
/**
 * @whatItDoes Syncs a nested {@link FormGroup} to a DOM element.
 *
 * @howToUse
 *
 * This directive can only be used with a parent {@link FormGroupDirective} (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the nested {@link FormGroup} you want to link, and
 * will look for a {@link FormGroup} registered with that name in the parent
 * {@link FormGroup} instance you passed into {@link FormGroupDirective}.
 *
 * Nested form groups can come in handy when you want to validate a sub-group of a
 * form separately from the rest or when you'd like to group the values of certain
 * controls into their own nested object.
 *
 * **Access the group**: You can access the associated {@link FormGroup} using the
 * {@link AbstractControl.get} method. Ex: `this.form.get('name')`.
 *
 * You can also access individual controls within the group using dot syntax.
 * Ex: `this.form.get('name.first')`
 *
 * **Get the value**: the `value` property is always synced and available on the
 * {@link FormGroup}. See a full list of available properties in {@link AbstractControl}.
 *
 * **Set the value**: You can set an initial value for each child control when instantiating
 * the {@link FormGroup}, or you can set it programmatically later using
 * {@link AbstractControl.setValue} or {@link AbstractControl.patchValue}.
 *
 * **Listen to value**: If you want to listen to changes in the value of the group, you can
 * subscribe to the {@link AbstractControl.valueChanges} event.  You can also listen to
 * {@link AbstractControl.statusChanges} to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * {@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
 *
 * * **npm package**: `@angular/forms`
 *
 * * **NgModule**: `ReactiveFormsModule`
 *
 * @stable
 */
var FormGroupName = (function (_super) {
    __extends(FormGroupName, _super);
    function FormGroupName(parent, validators, asyncValidators) {
        _super.call(this);
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    /** @internal */
    FormGroupName.prototype._checkParentType = function () {
        if (_hasInvalidParent(this._parent)) {
            __WEBPACK_IMPORTED_MODULE_4__reactive_errors__["a" /* ReactiveErrors */].groupParentException();
        }
    };
    FormGroupName.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] },] },
    ];
    /** @nocollapse */
    FormGroupName.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_3__control_container__["a" /* ControlContainer */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Host"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__validators__["b" /* NG_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__validators__["c" /* NG_ASYNC_VALIDATORS */],] },] },
    ];
    FormGroupName.propDecorators = {
        'name': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['formGroupName',] },],
    };
    return FormGroupName;
}(__WEBPACK_IMPORTED_MODULE_2__abstract_form_group_directive__["a" /* AbstractFormGroupDirective */]));
var formArrayNameProvider = {
    provide: __WEBPACK_IMPORTED_MODULE_3__control_container__["a" /* ControlContainer */],
    useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return FormArrayName; })
};
/**
 * @whatItDoes Syncs a nested {@link FormArray} to a DOM element.
 *
 * @howToUse
 *
 * This directive is designed to be used with a parent {@link FormGroupDirective} (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the nested {@link FormArray} you want to link, and
 * will look for a {@link FormArray} registered with that name in the parent
 * {@link FormGroup} instance you passed into {@link FormGroupDirective}.
 *
 * Nested form arrays can come in handy when you have a group of form controls but
 * you're not sure how many there will be. Form arrays allow you to create new
 * form controls dynamically.
 *
 * **Access the array**: You can access the associated {@link FormArray} using the
 * {@link AbstractControl.get} method on the parent {@link FormGroup}.
 * Ex: `this.form.get('cities')`.
 *
 * **Get the value**: the `value` property is always synced and available on the
 * {@link FormArray}. See a full list of available properties in {@link AbstractControl}.
 *
 * **Set the value**: You can set an initial value for each child control when instantiating
 * the {@link FormArray}, or you can set the value programmatically later using the
 * {@link FormArray}'s {@link AbstractControl.setValue} or {@link AbstractControl.patchValue}
 * methods.
 *
 * **Listen to value**: If you want to listen to changes in the value of the array, you can
 * subscribe to the {@link FormArray}'s {@link AbstractControl.valueChanges} event.  You can also
 * listen to its {@link AbstractControl.statusChanges} event to be notified when the validation
 * status is re-calculated.
 *
 * **Add new controls**: You can add new controls to the {@link FormArray} dynamically by
 * calling its {@link FormArray.push} method.
 *  Ex: `this.form.get('cities').push(new FormControl());`
 *
 * ### Example
 *
 * {@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
 *
 * * **npm package**: `@angular/forms`
 *
 * * **NgModule**: `ReactiveFormsModule`
 *
 * @stable
 */
var FormArrayName = (function (_super) {
    __extends(FormArrayName, _super);
    function FormArrayName(parent, validators, asyncValidators) {
        _super.call(this);
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    FormArrayName.prototype.ngOnInit = function () {
        this._checkParentType();
        this.formDirective.addFormArray(this);
    };
    FormArrayName.prototype.ngOnDestroy = function () {
        if (this.formDirective) {
            this.formDirective.removeFormArray(this);
        }
    };
    Object.defineProperty(FormArrayName.prototype, "control", {
        get: function () { return this.formDirective.getFormArray(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormArrayName.prototype, "formDirective", {
        get: function () {
            return this._parent ? this._parent.formDirective : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormArrayName.prototype, "path", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__shared__["a" /* controlPath */])(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormArrayName.prototype, "validator", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__shared__["b" /* composeValidators */])(this._validators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormArrayName.prototype, "asyncValidator", {
        get: function () { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__shared__["c" /* composeAsyncValidators */])(this._asyncValidators); },
        enumerable: true,
        configurable: true
    });
    FormArrayName.prototype._checkParentType = function () {
        if (_hasInvalidParent(this._parent)) {
            __WEBPACK_IMPORTED_MODULE_4__reactive_errors__["a" /* ReactiveErrors */].arrayParentException();
        }
    };
    FormArrayName.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] },] },
    ];
    /** @nocollapse */
    FormArrayName.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_3__control_container__["a" /* ControlContainer */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Host"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__validators__["b" /* NG_VALIDATORS */],] },] },
        { type: Array, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Self"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__validators__["c" /* NG_ASYNC_VALIDATORS */],] },] },
    ];
    FormArrayName.propDecorators = {
        'name': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['formArrayName',] },],
    };
    return FormArrayName;
}(__WEBPACK_IMPORTED_MODULE_3__control_container__["a" /* ControlContainer */]));
function _hasInvalidParent(parent) {
    return !(parent instanceof FormGroupName) && !(parent instanceof __WEBPACK_IMPORTED_MODULE_6__form_group_directive__["a" /* FormGroupDirective */]) &&
        !(parent instanceof FormArrayName);
}
//# sourceMappingURL=form_group_name.js.map

/***/ },

/***/ 803:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {"use strict";
var platform_browser_dynamic_1 = __webpack_require__(138);
var core_1 = __webpack_require__(1);
var keycloak_service_1 = __webpack_require__(67);
var app_module_1 = __webpack_require__(370);
__webpack_require__(377);
__webpack_require__(375);
if (process.env.ENV === 'production') {
    core_1.enableProdMode();
}
keycloak_service_1.KeycloakService.init().then(function (success) {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule).then(function (app) {
        // this is just here to make some data easier to retrieve from tests
        window["app"] = app;
        window["MainNgZone"] = app.injector.get(core_1.NgZone);
        if (window["windupAppInitialized"] != null)
            window["windupAppInitialized"](app, window["MainNgZone"]);
    })
        .catch(function (err) {
        console.log(err);
        if (window["windupAppInitialized"] != null)
            window["windupAppInitialized"]();
    });
}).catch(function (error) {
    console.log('reload');
    // window.location.reload();
});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(68)))

/***/ },

/***/ 82:
/***/ function(module, exports) {

"use strict";
"use strict";
var FormComponent = (function () {
    function FormComponent() {
    }
    /**
     * This works simplifies the process of checking for an error state on the control.
     *
     * It makes sure that the control is not-pristine (don't show errors on fields the user hasn't touched yet)
     * and that the control is already rendered.
     */
    FormComponent.prototype.hasError = function (control) {
        if (control == null)
            return false;
        var touched = control.touched == null ? false : control.touched;
        return !control.valid && touched;
    };
    FormComponent.prototype.handleError = function (error) {
        var _this = this;
        this.errorMessages = [];
        if (!error) {
            this.errorMessages.push("Server call failed!");
        }
        else if (error.parameterViolations) {
            error.parameterViolations.forEach(function (violation) {
                console.log("Violation: " + JSON.stringify(violation));
                _this.errorMessages.push(violation.message);
            });
        }
        else {
            if (error instanceof ProgressEvent)
                this.errorMessages.push("Server connection failed!");
            else
                this.errorMessages.push("Error: " + error);
        }
    };
    return FormComponent;
}());
exports.FormComponent = FormComponent;


/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(1);
var http_1 = __webpack_require__(25);
var constants_1 = __webpack_require__(23);
var abtract_service_1 = __webpack_require__(34);
var MigrationProjectService = (function (_super) {
    __extends(MigrationProjectService, _super);
    function MigrationProjectService(_http) {
        _super.call(this);
        this._http = _http;
        this.GET_MIGRATION_PROJECTS_URL = "/migrationProjects/list";
        this.GET_MIGRATION_PROJECT_URL = "/migrationProjects/get";
        this.CREATE_MIGRATION_PROJECT_URL = "/migrationProjects/create";
        this.UPDATE_MIGRATION_PROJECT_URL = "/migrationProjects/update";
    }
    MigrationProjectService.prototype.create = function (migrationProject) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = JSON.stringify(migrationProject);
        return this._http.put(constants_1.Constants.REST_BASE + this.CREATE_MIGRATION_PROJECT_URL, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    MigrationProjectService.prototype.update = function (migrationProject) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var body = JSON.stringify(migrationProject);
        return this._http.put(constants_1.Constants.REST_BASE + this.UPDATE_MIGRATION_PROJECT_URL, body, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    MigrationProjectService.prototype.get = function (id) {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_MIGRATION_PROJECT_URL + "/" + id, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    MigrationProjectService.prototype.getAll = function () {
        var headers = new http_1.Headers();
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.get(constants_1.Constants.REST_BASE + this.GET_MIGRATION_PROJECTS_URL, options)
            .map(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    MigrationProjectService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], MigrationProjectService);
    return MigrationProjectService;
    var _a;
}(abtract_service_1.AbstractService));
exports.MigrationProjectService = MigrationProjectService;


/***/ }

},[803]);
//# sourceMappingURL=app.js.map