"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3updatePattern_1 = require("../layerstack/d3updatePattern");
const hyperbolic_math_1 = require("../../models/transformation/hyperbolic-math");
class ImageLayer {
    constructor(view, args) {
        this.update = {
            parent: () => this.attach(),
            data: () => this.d3updatePattern.update.data(),
            transformation: () => this.d3updatePattern.update.transformation(),
            style: () => this.d3updatePattern.update.style()
        };
        this.view = view;
        this.args = args;
        this.args.width = this.args.width || .05;
        this.args.height = this.args.height || .05;
        this.name = args.name;
    }
    attach() {
        this.d3updatePattern = new d3updatePattern_1.D3UpdatePattern({
            parent: this.view.parent,
            layer: this,
            data: this.args.data,
            name: this.args.name,
            className: 'node',
            elementType: 'image',
            create: s => s.attr('xlink:href', d => this.args.imagehref(d))
                .attr('width', this.args.width)
                .attr('height', this.args.height),
            updateColor: s => { },
            updateTransform: s => s.attr("transform", (d, i, v) => {
                //const delta = this.args.delta(d, i, v)
                const delta = hyperbolic_math_1.CmulR({ re: -this.args.width, im: -this.args.height }, d.distScale / 2);
                return ` translate(${delta.re} ${delta.im})`
                    + this.args.transform(d, delta);
            })
        });
    }
}
exports.ImageLayer = ImageLayer;
