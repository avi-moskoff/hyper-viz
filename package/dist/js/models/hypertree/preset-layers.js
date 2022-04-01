"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyperbolic_math_1 = require("../transformation/hyperbolic-math");
const hyperbolic_math_2 = require("../transformation/hyperbolic-math");
const node_layer_1 = require("../../components/layers/node-layer");
const cell_layer_1 = require("../../components/layers/cell-layer");
const background_layer_1 = require("../../components/layers/background-layer");
const symbol_layer_1 = require("../../components/layers/symbol-layer");
const link_layer_1 = require("../../components/layers/link-layer");
const label_layer_1 = require("../../components/layers/label-layer");
const label_force_layer_1 = require("../../components/layers/label-force-layer");
const interaction_layer_1 = require("../../components/layers/interaction-layer");
const interaction_layer_2_1 = require("../../components/layers/interaction-layer-2");
const trace_layer_1 = require("../../components/layers/trace-layer");
const image_layer_1 = require("../../components/layers/image-layer");
const focus_layer_1 = require("../../components/layers/focus-layer");
const stem_layer_1 = require("../../components/layers/stem-layer");
const d3_hypertree_1 = require("../../d3-hypertree");
exports.labeloffsets = {
    centerOffset: (cache) => (d, i, v) => d3_hypertree_1.bboxCenter(d, cache),
    nodeRadiusOffset: (ls) => (d) => hyperbolic_math_1.CptoCk({
        θ: d.cachep.θ,
        r: ls.args.nodeRadius(ls, d) * d.distScale * 1.5
    }),
    labeloffset: (ud) => (d, i, v) => hyperbolic_math_2.CaddC(exports.labeloffsets.nodeRadiusOffset(ud)(d), d3_hypertree_1.bboxOval(d)),
    outwards: undefined,
    outwardsPlusNodeRadius: undefined
};
exports.labeloffsets.outwards = exports.labeloffsets.nodeRadiusOffset;
exports.labeloffsets.outwardsPlusNodeRadius = exports.labeloffsets.labeloffset;
exports.layerSrc = [
    // nodes
    // nodes-leafs
    // nodes-lazy
    // bounds (lambda, P)    
    // wedges
    // weight circle (radius)
    // weight cell (color)
    // interaction-d3
    // interaction-hammer
    (v, ud) => new background_layer_1.BackgroundLayer(v, {}),
    (v, ud) => new cell_layer_1.CellLayer(v, {
        invisible: true,
        hideOnDrag: true,
        clip: '#circle-clip' + ud.args.clipRadius,
        data: () => ud.cache.cells,
        fill: n => undefined,
        stroke: n => undefined,
        strokeWidth: n => undefined,
    }),
    (v, ud) => new focus_layer_1.FocusLayer(v, {
        invisible: true,
        hideOnDrag: true,
        name: 'culling-r',
        r: () => ud.view.hypertree.args.filter.cullingRadius,
        center: () => '0 0'
    }),
    (v, ud) => new focus_layer_1.FocusLayer(v, {
        invisible: true,
        hideOnDrag: true,
        name: 'mouse-r',
        r: () => ud.view.hypertree.args.interaction.mouseRadius,
        center: () => '0 0'
    }),
    (v, ud) => new focus_layer_1.FocusLayer(v, {
        invisible: true,
        hideOnDrag: true,
        name: 'focus-r',
        r: () => ud.cache.focusR,
        center: () => '0 0'
    }),
    (v, ud) => new focus_layer_1.FocusLayer(v, {
        invisible: true,
        hideOnDrag: true,
        name: 'labels-r-𝐖',
        r: () => ud.view.hypertree.args.filter.wikiRadius,
        center: () => '0 0'
    }),
    (v, ud) => new focus_layer_1.FocusLayer(v, {
        invisible: false,
        hideOnDrag: false,
        name: 'λ',
        r: () => ud.args.transformation.state.λ,
        center: () => `${(ud.pinchcenter || { re: 0 }).re} ${(ud.pinchcenter || { im: 0 }).im}`
    }),
    (v, ud) => new focus_layer_1.FocusLayer(v, {
        invisible: false,
        className: 'zerozero-circle',
        name: '(0,0)',
        r: () => .004,
        center: () => '0 0'
    }),
    // CIRCLE STUFF END
    /*
        (v, ud:UnitDisk)=> new NodeLayer(v, {
            invisible:  true,
            hideOnDrag: true,
            name:       'weigths',
            className:  'weigths',
            data:       ()=> ud.cache.weights,
            r:          d=> ud.args.nodeRadius(ud, d),
            transform:  d=> d.transformStrCache
                            + ` scale(${ud.args.nodeScale(d)})`,
        }),
        (v, ud:UnitDisk)=> new NodeLayer(v, {
            invisible:  true,
            hideOnDrag: true,
            name:       'wedges',
            className:  'wedges',
            data:       ()=> ud.cache.weights,
            r:          d=> ud.args.nodeRadius(ud, d),
            transform:  d=> d.transformStrCache
                            + ` scale(${ud.args.nodeScale(d)})`,
        }),
    
    */
    (v, ud) => new node_layer_1.NodeLayer(v, {
        invisible: true,
        hideOnDrag: true,
        name: 'center-node',
        className: 'center-node',
        //clip:       '#node-32-clip', centernode.id
        fill: n => undefined,
        stroke: n => undefined,
        strokeWidth: n => undefined,
        data: () => ud.cache.centerNode ? [ud.cache.centerNode] : [],
        r: d => .1,
        transform: d => d.transformStrCache
            + ` scale(${ud.args.nodeScale(d)})`,
    }),
    // links 
    (v, ud) => new link_layer_1.ArcLayer(v, {
        invisible: false,
        hideOnDrag: false,
        name: 'path-arcs',
        className: 'arc',
        curvature: ud.view.hypertree.args.geometry.linkCurvature,
        data: () => ud.cache.paths,
        nodePos: n => n.cache,
        nodePosStr: n => n.strCache,
        stroke: n => undefined,
        strokeWidth: d => ud.args.linkWidth(d) + (.013 * d.dampedDistScale),
        classed: s => s.classed("hovered-path", d => d.pathes && d.pathes.isPartOfAnyHoverPath)
            .classed("selected-path", d => d.pathes && d.pathes.isPartOfAnySelectionPath)
            .style("stroke", d => d.pathes && d.pathes.finalcolor)
    }),
    (v, ud) => new link_layer_1.ArcLayer(v, {
        invisible: false,
        hideOnDrag: false,
        name: 'link-arcs',
        className: 'arc',
        curvature: ud.view.hypertree.args.geometry.linkCurvature,
        clip: '#circle-clip' + ud.args.clipRadius,
        data: () => ud.cache.links,
        nodePos: n => n.cache,
        nodePosStr: n => n.strCache,
        stroke: n => undefined,
        strokeWidth: d => ud.args.linkWidth(d),
        classed: (s, w, c) => s
            .style("stroke", d => ((d.pathes && d.pathes.isPartOfAnyHoverPath) ? d.pathes && d.pathes.finalcolor : d.pathes && d.pathes.finalcolor) || c(d))
            .classed("hovered", d => d.pathes && d.pathes.isPartOfAnyHoverPath)
            .classed("selected", d => d.pathes && d.pathes.isPartOfAnySelectionPath)
        //.attr("stroke-width", d=> w(d))
    }),
    (v, ud) => new stem_layer_1.StemLayer(v, {
        invisible: false,
        hideOnDrag: false,
        name: 'stem-arc',
        className: 'arc',
        curvature: '+',
        clip: '#circle-clip' + ud.args.clipRadius,
        data: () => [],
        nodePos: n => n.cache,
        nodePosStr: n => n.strCache,
        width: d => ud.args.linkWidth(d) + .001,
        classed: (s, w) => s
            .classed("hovered", d => d.pathes && d.pathes.isPartOfAnyHoverPath)
            .classed("selected", d => d.pathes && d.pathes.isPartOfAnySelectionPath)
            .style("stroke", d => d.pathes && d.pathes.finalcolor)
            .attr("stroke-width", d => w(d)),
        classed2: (s, w) => s
            .classed("hovered-path", d => d.pathes && d.pathes.isPartOfAnyHoverPath)
            .classed("selected-path", d => d.pathes && d.pathes.isPartOfAnySelectionPath)
            .style("stroke", d => d.pathes && d.pathes.finalcolor)
            .attr("stroke-width", d => w(d) +
            (((d.pathes && d.pathes.isPartOfAnySelectionPath) ||
                (d.pathes && d.pathes.isPartOfAnyHoverPath)) ? .015 : 0)),
    }),
    // nodes
    (v, ud) => new node_layer_1.NodeLayer(v, {
        invisible: false,
        hideOnDrag: false,
        name: 'nodes',
        className: 'node',
        data: () => ud.cache.leafOrLazy,
        fill: n => undefined,
        stroke: n => undefined,
        strokeWidth: n => undefined,
        r: d => ud.args.nodeRadius(ud, d),
        transform: d => d.transformStrCache
            + ` scale(${ud.args.nodeScale(d)})`,
    }),
    // IMAGE LABLE SYMBOL EMOJI
    (v, ud) => new symbol_layer_1.SymbolLayer(v, {
        invisible: false,
        hideOnDrag: false,
        name: 'symbols',
        data: () => ud.cache.spezialNodes,
        transform: d => d.transformStrCache
            + ` scale(${d.dampedDistScale})`,
    }),
    (v, ud) => new image_layer_1.ImageLayer(v, {
        name: 'images',
        data: () => ud.cache.images,
        width: .05,
        height: .05,
        imagehref: (d) => d.precalc.imageHref,
        delta: (d) => hyperbolic_math_2.CmulR({ re: -.05, im: -.05 }, d.distScale),
        transform: (d, delta) => ` translate(${d.cache.re} ${d.cache.im})`
            + ` scale(${d.distScale})`
    }),
    (v, ud) => new label_layer_1.LabelLayer(v, {
        //invisible:  true,
        //hideOnDrag: true,
        name: 'emojis',
        className: 'caption',
        data: () => ud.cache.emojis,
        text: (d) => d.precalc.icon,
        delta: exports.labeloffsets.centerOffset('emojislen'),
        //delta:      (d, i, v)=> ({ re:0, im:0 }),        
        color: () => undefined,
        background: undefined,
        transform: (d, delta) => ` translate(${d.cache.re + delta.re} ${d.cache.im + delta.im})`
            + `scale(${d.dampedDistScale * 2})`
    }),
    (v, ud) => new label_layer_1.LabelLayer(v, {
        invisible: false,
        hideOnDrag: false,
        name: 'labels',
        className: 'caption',
        data: () => ud.cache.labels,
        text: (d) => d.precalc.label,
        delta: exports.labeloffsets.labeloffset(ud),
        color: () => undefined,
        background: undefined,
        transform: (d, delta) => ` translate(${d.cache.re + delta.re} ${d.cache.im + delta.im})`
            + d.scaleStrText
    }),
    (v, ud) => new label_layer_1.LabelLayer(v, {
        invisible: true,
        hideOnDrag: true,
        name: 'labels2',
        className: 'caption',
        data: () => ud.cache.labels,
        text: (d) => d.precalc.label,
        delta: exports.labeloffsets.labeloffset(ud),
        color: () => undefined,
        transform: (d, delta) => ` translate(${d.cache.re + delta.re} ${d.cache.im + delta.im})`
            + d.scaleStrText
    }),
    (v, ud) => new label_force_layer_1.LabelForceLayer(v, {
        invisible: true,
        hideOnDrag: true,
        name: 'labels-force',
        className: 'caption caption-label',
        data: () => ud.cache.labels,
        text: (d) => d.precalc.label,
        background: n => !n.parent,
        transform: (d, delta) => ` translate(${d.cache.re + delta.re} ${d.cache.im + delta.im})`
            + d.scaleStrText
    }),
    (v, ud) => new interaction_layer_1.InteractionLayer(v, {
        invisible: true,
        hideOnDrag: true,
        mouseRadius: ud.view.hypertree.args.interaction.mouseRadius,
        onClick: (n, m) => {
            var s = n.ancestors().find(e => true); // obsolete
            //ud.args.hypertree.updatePath('SelectionPath', s) // toggle selection 
            ud.view.hypertree.api.toggleSelection(s); // toggle selection 
            ud.view.hypertree.args.interaction.onNodeSelect(s); // focus splitter
        }
    }),
    (v, ud) => new interaction_layer_2_1.InteractionLayer2(v, {
        mouseRadius: ud.view.hypertree.args.interaction.mouseRadius,
        onClick: (n, m) => {
            var s = n.ancestors().find(e => true); // obsolete
            //ud.args.hypertree.updatePath('SelectionPath', s) // toggle selection 
            ud.view.hypertree.api.toggleSelection(s); // toggle selection 
            ud.view.hypertree.args.interaction.onNodeSelect(s); // focus splitter
        }
    }),
    (v, ud) => new trace_layer_1.TraceLayer(v, {
        invisible: true,
        hideOnDrag: true,
        name: 'traces',
        data: () => ud.view.hypertree.args.objects.traces
    })
];
