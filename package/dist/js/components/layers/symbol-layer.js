"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const d3updatePattern_1 = require("../layerstack/d3updatePattern");
var symbol = d3.symbol().size(.0012);
var d_star = symbol.type(d3['symbolStar'])();
const home = 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z';
class SymbolLayer {
    constructor(view, args) {
        this.update = {
            parent: () => this.attach(),
            data: () => this.d3updatePattern.update.data(),
            transformation: () => this.d3updatePattern.update.transformation(),
            style: () => this.d3updatePattern.update.style()
        };
        this.view = view;
        this.args = args;
        this.name = args.name;
    }
    attach() {
        this.d3updatePattern = new d3updatePattern_1.D3UpdatePattern({
            parent: this.view.parent,
            layer: this,
            data: this.args.data,
            name: this.args.name,
            className: 'node',
            elementType: 'path',
            create: s => s.classed("root", d => !d.parent)
                .classed("lazy", d => d.hasOutChildren)
                .classed("leaf", d => d.parent)
                .classed("exit", d => (!d.children || !d.children.length)
                && d.data && d.data.numLeafs),
            updateColor: s => s.classed("hovered", d => d.pathes && d.pathes.isPartOfAnyHoverPath && d.parent)
                .classed("selected", d => d.pathes && d.pathes.isPartOfAnySelectionPath && d.parent),
            updateTransform: s => s.attr("transform", d => this.args.transform(d))
                .attr("d", d => /*home*/ d_star),
        });
    }
}
exports.SymbolLayer = SymbolLayer;
