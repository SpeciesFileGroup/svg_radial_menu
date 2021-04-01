import {__assign,__extends,__spreadArray}from'tslib';var SVG = /** @class */ (function () {
    function SVG(options) {
        this.SVGElement = this.createSVGElement('svg', options);
    }
    SVG.prototype.createSVGElement = function (tag, attr) {
        if (attr === void 0) { attr = {}; }
        var SVGElement = document.createElementNS('http://www.w3.org/2000/svg', tag);
        this.SetSVGAttributes(SVGElement, attr);
        return SVGElement;
    };
    SVG.prototype.SetSVGAttributes = function (SVGElement, attr) {
        for (var key in attr) {
            SVGElement.setAttribute(key, "" + attr[key]);
        }
    };
    SVG.prototype.parseAttributes = function (attributes) {
        var toKebakCase = function (string) { return string.replace(/\B(?:([A-Z])(?=[a-z]))|(?:(?<=[a-z0-9])([A-Z]))/g, '-$1$2').toLowerCase(); };
        return Object.fromEntries(Object.entries(attributes)
            .filter(function (_a) {
            _a[0]; var value = _a[1];
            return value;
        })
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return ([[toKebakCase(key)], value]);
        }));
    };
    SVG.prototype.createSVGCircle = function (cx, cy, r, attr) {
        if (attr === void 0) { attr = {}; }
        var circleElement = this.createSVGElement('circle', attr);
        this.SetSVGAttributes(circleElement, __assign({ cx: cx,
            cy: cy,
            r: r }, attr));
        return circleElement;
    };
    SVG.prototype.createSVGImage = function (x, y, width, height, url) {
        var imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        imageElement.setAttribute('x', x + "px");
        imageElement.setAttribute('y', y + "px");
        imageElement.setAttribute('width', width + "px");
        imageElement.setAttribute('height', height + "px");
        imageElement.setAttribute('href', url);
        return imageElement;
    };
    SVG.prototype.createSVGLink = function (nodeChild, link) {
        var element = document.createElementNS('http://www.w3.org/2000/svg', 'a');
        element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link);
        element.append(nodeChild);
        return element;
    };
    SVG.prototype.createSVGText = function (x, y, text, attr) {
        var _this = this;
        if (attr === void 0) { attr = {}; }
        var stringLines = text.split(' ');
        var lineSize = parseInt("" + attr['font-size'], 10);
        var middlePosition = stringLines.length === 1 ? (lineSize / 2) : (((lineSize / 2) * -stringLines.length)) + (lineSize);
        var tspanLines = stringLines.map(function (line, index) {
            var tspan = _this.createSVGElement('tspan', attr);
            var dy = index ? lineSize : middlePosition;
            tspan.setAttribute('dy', dy + "px");
            tspan.setAttribute('x', x + "px");
            tspan.removeAttribute('y');
            tspan.textContent = line;
            return tspan;
        });
        return this.createSVGGroup(tspanLines, 'text', {
            x: x, y: y,
            dy: 0,
        });
    };
    SVG.prototype.createSVGGroup = function (elements, tag, attr) {
        if (tag === void 0) { tag = 'g'; }
        if (attr === void 0) { attr = {}; }
        var SVGElement = this.createSVGElement(tag, attr);
        elements.forEach(function (element) {
            SVGElement.appendChild(element);
        });
        return SVGElement;
    };
    SVG.prototype.describeArc = function (x, y, radius, spread, startAngle, endAngle) {
        var innerStart = this.polarToCartesian(x, y, radius, endAngle);
        var innerEnd = this.polarToCartesian(x, y, radius, startAngle);
        var outerStart = this.polarToCartesian(x, y, radius + spread, endAngle);
        var outerEnd = this.polarToCartesian(x, y, radius + spread, startAngle);
        var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        var d = [
            'M', outerStart.x, outerStart.y,
            'A', radius + spread, radius + spread, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
            'L', innerEnd.x, innerEnd.y,
            'A', radius, radius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
            'L', outerStart.x, outerStart.y, 'Z'
        ].join(' ');
        return d;
    };
    SVG.prototype.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };
    return SVG;
}());var Segment = /** @class */ (function (_super) {
    __extends(Segment, _super);
    function Segment(slice, x, y, startFrom, radiusStart, radiusSlice, opts) {
        var _this = _super.call(this, opts) || this;
        _this.backgroundColor = '#FFFFFF';
        _this.margin = 0;
        _this.textColor = '#FFFFFF';
        var sliceSize = opts.sliceSize, margin = opts.margin;
        _this.options = opts;
        _this.slice = slice;
        _this._name = slice.name;
        _this.size = slice.size || sliceSize;
        _this.startFrom = startFrom;
        _this.radiusStart = radiusStart;
        _this.radiusEnd = radiusStart + radiusSlice;
        _this.x = x;
        _this.y = y;
        _this.margin = margin || _this.margin;
        _this.SVGAttributes = _this.parseAttributes(slice.svgAttributes || {});
        _this.defaultSVGAttributes = _this.parseAttributes(opts.svgAttributes || {});
        if ((_this.radiusEnd - _this.radiusStart) >= 360) {
            _this.radiusEnd = 359.999;
            _this.margin = 0;
        }
        _this.SVGElement = _this.createSlice(_this.x, _this.y, _this.startFrom, _this.size, _this.radiusStart, _this.radiusEnd, _this.options);
        return _this;
    }
    Segment.prototype.toSVG = function () {
        return this.SVGElement;
    };
    Segment.prototype.createSlice = function (x, y, startFrom, size, radiusStart, radiusEnd, opts) {
        var _a;
        var slice = this.slice;
        var elements = [];
        var middleSlice = (size / 2) + startFrom;
        var middleRadius = (radiusEnd - radiusStart) / 2;
        var distanceCoordinates = this.polarToCartesian(x, y, this.margin, radiusStart + middleRadius);
        var coordinates = this.polarToCartesian(distanceCoordinates.x, distanceCoordinates.y, middleSlice, radiusStart + middleRadius);
        var d = this.describeArc(distanceCoordinates.x, distanceCoordinates.y, startFrom, size, radiusStart, radiusEnd);
        var sliceElement = this.createSVGElement('path', Object.assign({}, this.getAttributes, { d: d }));
        var svgGroup;
        elements.push(sliceElement);
        if (slice.label) {
            var iconSize = (((_a = slice === null || slice === void 0 ? void 0 : slice.icon) === null || _a === void 0 ? void 0 : _a.height) || 0);
            elements.push(this.createSVGText(coordinates.x, (coordinates.y + iconSize / 2), slice.label, Object.assign({}, this.defaultSVGAttributes, this.SVGAttributes, { fill: this.SVGAttributes.color || this.defaultSVGAttributes.color })));
        }
        if (slice.icon) {
            elements.push(this.addIcon(slice.icon, coordinates));
        }
        svgGroup = this.createSVGGroup(elements);
        return slice.link ? this.createSVGLink(svgGroup, slice.link) : svgGroup;
    };
    Object.defineProperty(Segment.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Segment.prototype, "fontSize", {
        get: function () {
            return parseInt("" + (this.getAttributes['font-size'] || 11), 10);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Segment.prototype, "getAttributes", {
        get: function () {
            return Object.assign({}, this.defaultSVGAttributes, this.SVGAttributes);
        },
        enumerable: false,
        configurable: true
    });
    Segment.prototype.addIcon = function (icon, _a) {
        var x = _a.x, y = _a.y;
        var width = icon.width, height = icon.height, url = icon.url;
        var iconCoordinates = {
            x: x - width / 2,
            y: this.slice.label ? y - (height / 2) - (this.getTextSize(this.slice.label)) : y - (height / 2)
        };
        return this.createSVGImage(iconCoordinates.x, iconCoordinates.y, width, height, url);
    };
    Segment.prototype.getTextSize = function (label) {
        var stringLines = label.split(' ').length;
        return (stringLines * this.fontSize) / 2;
    };
    return Segment;
}(SVG));var MiddleButton = /** @class */ (function (_super) {
    __extends(MiddleButton, _super);
    function MiddleButton(middleButton, x, y, opts) {
        var _this = _super.call(this, opts) || this;
        _this.backgroundColor = '#FFFFFF';
        _this.sliceMargin = 4;
        _this.textColor = '#FFFFFF';
        _this.options = opts;
        _this.middleButton = middleButton;
        _this.radius = middleButton.radius || opts.centerSize;
        _this.x = x;
        _this.y = y;
        _this._name = _this.middleButton.name;
        _this.SVGAttributes = _this.parseAttributes(middleButton.svgAttributes || {});
        _this.defaultSVGAttributes = _this.parseAttributes(opts.svgAttributes || {});
        _this.SVGElement = _this.createMiddleButton(_this.x, _this.y, _this.radius, opts);
        return _this;
    }
    MiddleButton.prototype.toSVG = function () {
        return this.SVGElement;
    };
    Object.defineProperty(MiddleButton.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MiddleButton.prototype, "getAttributes", {
        get: function () {
            return Object.assign({}, this.defaultSVGAttributes, this.SVGAttributes);
        },
        enumerable: false,
        configurable: true
    });
    MiddleButton.prototype.createMiddleButton = function (x, y, radius, opts) {
        var middleButton = this.middleButton;
        var elements = [];
        var sliceElement = this.createSVGCircle(x, y, radius, {
            fill: this.SVGAttributes.fill,
            color: this.textColor
        });
        var svgGroup;
        elements.push(sliceElement);
        if (middleButton.label) {
            elements.push(this.createSVGText(x, y, middleButton.label, Object.assign({}, this.defaultSVGAttributes, this.SVGAttributes, { fill: this.SVGAttributes.color })));
        }
        if (middleButton.icon) {
            elements.push(this.addIcon(middleButton.icon, { x: x, y: y }));
        }
        svgGroup = this.createSVGGroup(elements);
        return middleButton.link ? this.createSVGLink(svgGroup, middleButton.link) : svgGroup;
    };
    MiddleButton.prototype.addIcon = function (icon, _a) {
        var x = _a.x, y = _a.y;
        var width = icon.width, height = icon.height, url = icon.url;
        var fontSize = parseInt(this.getAttributes['font-size'].toString(), 10);
        var iconCoordinates = {
            x: x - width / 2,
            y: this.middleButton.label ? y - height - fontSize : y - height / 2
        };
        return this.createSVGImage(iconCoordinates.x, iconCoordinates.y, width, height, url);
    };
    return MiddleButton;
}(SVG));var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.on = function (event, listener) {
        var _this = this;
        if (typeof this.events[event] !== "object") {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return function () { return _this.removeListener(event, listener); };
    };
    EventEmitter.prototype.removeListener = function (event, listener) {
        if (typeof this.events[event] !== 'object') {
            return;
        }
        var idx = this.events[event].indexOf(listener);
        if (idx > -1) {
            this.events[event].splice(idx, 1);
        }
    };
    EventEmitter.prototype.removeAllListeners = function () {
        var _this = this;
        Object.keys(this.events).forEach(function (event) {
            return _this.events[event].splice(0, _this.events[event].length);
        });
    };
    EventEmitter.prototype.emit = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (typeof this.events[event] !== 'object') {
            return;
        }
        __spreadArray([], this.events[event]).forEach(function (listener) { return listener.apply(_this, args); });
    };
    EventEmitter.prototype.once = function (event, listener) {
        var _this = this;
        var remove = this.on(event, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            remove();
            listener.apply(_this, args);
        });
        return remove;
    };
    return EventEmitter;
}());var RadialMenu = /** @class */ (function (_super) {
    __extends(RadialMenu, _super);
    function RadialMenu(element, opts) {
        var _this = _super.call(this) || this;
        _this.SVGSlices = [];
        _this.margin = 0;
        var centerSize = opts.centerSize, width = opts.width, height = opts.height, slices = opts.slices, sliceSize = opts.sliceSize, middleButton = opts.middleButton, margin = opts.margin, css = opts.css;
        _this.SVGObject = new SVG(__assign({ width: width + "px", height: height + "px" }, css || {}));
        _this.SVGElement = _this.SVGObject.SVGElement;
        _this.parentElement = element;
        _this.options = opts;
        _this.width = width;
        _this.height = height;
        _this.slices = slices;
        _this.sliceSize = sliceSize;
        _this.centerSize = centerSize;
        _this.middleButton = middleButton || {};
        _this.margin = margin || _this.margin;
        _this.SVGAttributes = opts.svgAttributes || {};
        _this.generateMenu();
        return _this;
    }
    RadialMenu.prototype.generateMenu = function () {
        var _this = this;
        var middleButton;
        this.drawLevel(this.slices);
        this.SVGSlices.forEach(function (sliceObject) {
            _this.addEvents(sliceObject);
            _this.SVGElement.appendChild(sliceObject.toSVG());
        });
        if (this.middleButton) {
            middleButton = new MiddleButton(this.middleButton, this.width / 2, this.height / 2, this.options);
            this.addEvents(middleButton);
            this.SVGElement.appendChild(middleButton.toSVG());
        }
        this.parentElement.innerHTML = '';
        this.parentElement.appendChild(this.SVGElement);
    };
    RadialMenu.prototype.drawLevel = function (slices, startDistance, radiusStart, endAngle) {
        var _this = this;
        if (startDistance === void 0) { startDistance = this.centerSize; }
        if (radiusStart === void 0) { radiusStart = 0; }
        if (endAngle === void 0) { endAngle = 360; }
        var sliceElements = [];
        var sliceWithSize = slices.filter(function (_a) {
            var radius = _a.radius;
            return radius;
        }).length;
        var slicesRadiusTotal = slices.map(function (_a) {
            var radius = _a.radius;
            return radius || 0;
        })
            .reduce(function (a, b) { return a + b; }, 0);
        var defaultSliceRadius = ((endAngle - slicesRadiusTotal) - radiusStart) / (slices.length - sliceWithSize);
        var centerX = this.width / 2;
        var centerY = this.height / 2;
        slices.forEach(function (slice) {
            var startFrom = startDistance;
            var radius = slice.radius || defaultSliceRadius;
            var children = slice.slices;
            sliceElements.push(new Segment(slice, centerX, centerY, startFrom, radiusStart, radius, _this.options));
            startFrom = startFrom + ((slice === null || slice === void 0 ? void 0 : slice.size) || _this.sliceSize) + _this.margin;
            if (children) {
                _this.drawLevel(children, startFrom, radiusStart, radiusStart + radius);
            }
            radiusStart = radiusStart + radius;
        });
        this.SVGSlices = this.SVGSlices.concat([], sliceElements);
    };
    RadialMenu.prototype.addEvents = function (segmentObject) {
        var _this = this;
        var element = segmentObject.toSVG();
        var name = segmentObject.name;
        element.addEventListener('click', function (event) { _this.emit('click', { event: event, segmentObject: segmentObject, name: name }); });
        element.addEventListener('dbclick', function (event) { _this.emit('dbclick', { event: event, segmentObject: segmentObject, name: name }); });
        element.addEventListener('contextmenu', function (event) { _this.emit('contextmenu', { event: event, segmentObject: segmentObject, name: name }); });
    };
    return RadialMenu;
}(EventEmitter));export default RadialMenu;