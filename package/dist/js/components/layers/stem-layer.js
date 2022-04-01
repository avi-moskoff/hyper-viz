"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyperbolic_math_1 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_math_2 = require("../../models/transformation/hyperbolic-math");
const d3updatePattern_1 = require("../layerstack/d3updatePattern");
class StemLayer {
    constructor(view, args) {
        this.update = {
            parent: () => this.attach(),
            data: () => {
                this.d3updatePattern.update.data();
                this.d3updatePattern2.update.data();
            },
            transformation: () => {
                this.d3updatePattern.update.transformation();
                this.d3updatePattern2.update.transformation();
            },
            style: () => {
                this.d3updatePattern.update.style();
                this.d3updatePattern2.update.style();
            }
        };
        this.arcOptions = {
            '+': this.svgArc('1', '0'),
            '-': this.svgArc('0', '1'),
            '0': this.svgArcLine,
        };
        this.view = view;
        this.args = args;
        this.name = args.name;
    }
    attach() {
        const straincurvature = '-'; // this.args.curvature
        this.d3updatePattern = new d3updatePattern_1.D3UpdatePattern({
            parent: this.view.parent,
            layer: this,
            clip: this.args.clip,
            data: () => this.view.hypertree.data ? [this.view.hypertree.data] : [],
            name: 'stem-link',
            className: this.args.className,
            elementType: straincurvature === 'l' ? 'line' : 'path',
            create: s => { },
            updateColor: s => this.args.classed(s, this.args.width),
            updateTransform: s => {
                if (straincurvature === 'l')
                    s.attr('x1', d => this.args.nodePos(d).re)
                        .attr('y1', d => this.args.nodePos(d).im)
                        .attr('x2', d => this.args.nodePos(d).re)
                        .attr('y2', d => 1)
                        .attr("stroke-width", d => this.args.width(d) + .01)
                        .attr("stroke-linecap", d => "round");
                else
                    s.attr("d", d => this.arcOptions[this.args.curvature](d))
                        .attr("stroke-width", d => this.args.width(d) + .015)
                        .attr("stroke-linecap", d => "round");
            },
        });
        this.d3updatePattern2 = new d3updatePattern_1.D3UpdatePattern({
            parent: this.view.parent,
            layer: this,
            clip: this.args.clip,
            data: () => this.view.hypertree.data ? [this.view.hypertree.data] : [],
            name: 'stem-path',
            className: this.args.className,
            elementType: straincurvature === 'l' ? 'line' : 'path',
            create: s => { },
            updateColor: s => this.args.classed2(s, this.args.width),
            updateTransform: s => {
                if (straincurvature === 'l')
                    s.attr('x1', d => this.args.nodePos(d).re)
                        .attr('y1', d => this.args.nodePos(d).im)
                        .attr('x2', d => this.args.nodePos(d).re)
                        .attr('y2', d => 1)
                        .attr("stroke-width", d => this.args.width(d) + .01)
                        .attr("stroke-linecap", d => "round");
                else
                    s.attr("d", d => this.arcOptions[this.args.curvature](d))
                        .attr("stroke-width", d => this.args.width(d) + .015)
                        .attr("stroke-linecap", d => "round");
            },
        });
    }
    svgArc(a, b) {
        var $this = this;
        return function (d) {
            var arcP1 = $this.args.nodePos(d);
            var arcP2 = d.parent
                ? $this.args.nodePos(d.parent)
                : { re: arcP1.re, im: 1 };
            console.assert(arcP1);
            console.assert(arcP2);
            var arcC = hyperbolic_math_2.arcCenter(arcP1, arcP2);
            var r = hyperbolic_math_1.CktoCp(hyperbolic_math_1.CsubC(arcP2, arcC.c)).r;
            if (isNaN(r) || r > 1000)
                r = 0;
            var f = arcC.d > 0 ? a : b;
            var s = $this.args.nodePosStr(d);
            var e = d.parent
                ? $this.args.nodePosStr(d.parent)
                : `${arcP1.re} 1`;
            return `M ${s} A ${r} ${r}, 0, 0, ${f}, ${e}`;
        };
    }
    svgArcLine(d) {
        var s = this.args.nodePosStr(d);
        var e = this.args.nodePosStr(d.parent);
        return `M ${s} L ${e}`;
    }
}
exports.StemLayer = StemLayer;
