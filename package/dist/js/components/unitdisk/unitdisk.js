"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const n_loaders_1 = require("../../models/n/n-loaders");
const hyperbolic_math_1 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_math_2 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_math_3 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_transformation_1 = require("../../models/transformation/hyperbolic-transformation");
const hyperbolic_transformation_2 = require("../../models/transformation/hyperbolic-transformation");
const layerstack_1 = require("../layerstack/layerstack");
const hypertree_meta_1 = require("../meta/hypertree-meta/hypertree-meta");
const hypertree_meta_2 = require("../meta/hypertree-meta/hypertree-meta");
const layers_background_1 = require("./layers-background");
const layers_background_2 = require("./layers-background");
const layers_parameter_1 = require("./layers-parameter");
//----------------------------------------------------------------------------------------
class UnitDisk {
    constructor(view, args) {
        this.HypertreeMetaType = hypertree_meta_1.HypertreeMeta;
        this.api = {
            setTransform: (t, tn) => this.mainsvg.attr('transform', t)
        };
        this.update = {
            parent: () => this.updateParent(),
            cache: () => this.args.cacheUpdate(this, this.cache),
            data: () => this.update.layout(),
            layout: () => {
                this.args.cacheUpdate(this, this.cache);
                this.layerStack.update.data();
            },
            transformation: () => {
                this.args.cacheUpdate(this, this.cache);
                this.layerStack.update.data();
            },
            pathes: () => {
                this.args.cacheUpdate(this, this.cache);
                this.layerStack.update.pathes();
                //this.layerStack.update.transformation()            
            }
        };
        this.view = view;
        this.args = args;
        this.cache = args.transformation.cache;
        this.update.parent();
    }
    updateParent() {
        console.log('UPDATEING UNITDISK PARENT');
        this.mainsvg = d3.select(this.view.parent).append('g')
            .attr('class', this.view.className)
            .attr('transform', this.view.position);
        this.mainsvg.append('clipPath')
            .attr('id', 'circle-clip' + this.args.clipRadius)
            .append('circle')
            .attr('r', this.args.clipRadius);
        this.voronoiLayout = d3.voronoi()
            .x(d => { console.assert(typeof d.cache.re === 'number'); return d.cache.re; })
            .y(d => { console.assert(typeof d.cache.re === 'number'); return d.cache.im; })
            //.x(d=> d.cache.re)
            //.y(d=> d.cache.im)
            .extent([[-2, -2], [2, 2]]);
        this.layerStack = new layerstack_1.LayerStack({
            parent: this.mainsvg,
            unitdisk: this
        });
    }
}
exports.UnitDisk = UnitDisk;
//----------------------------------------------------------------------------------------
class UnitDiskNav {
    constructor(view, args) {
        this.HypertreeMetaType = hypertree_meta_2.HypertreeMetaNav;
        this.api = {
            setTransform: (t, tn) => {
                this.mainView.api.setTransform(t, null);
                this.navBackground.api.setTransform(tn, null);
                this.navParameter.api.setTransform(tn, null);
            }
        };
        this.update = {
            data: () => {
                // TODO: wenns h bei jeden des gleiche ist dann getter
                this.navBackground.args.data = this.args.data;
                this.mainView.args.data = this.args.data;
                this.update.layout();
            },
            cache: () => {
                this.mainView.update.cache();
                this.navParameter.update.cache();
            },
            layout: () => {
                this.mainView.update.cache();
                this.navParameter.update.cache();
                this.navBackground.layerStack.update.data();
                this.mainView.layerStack.update.data();
                this.navParameter.layerStack.update.data();
            },
            transformation: () => {
                this.mainView.update.cache();
                this.navParameter.update.cache();
                this.mainView.layerStack.update.data();
                this.navParameter.layerStack.update.data();
                this.navBackground.layerStack.update.pathes();
            },
            pathes: () => {
                this.mainView.update.cache();
                this.mainView.layerStack.update.data();
                this.navBackground.layerStack.update.pathes();
                this.navParameter.layerStack.update.data(); // wegen node hover
            }
        };
        this.view = view;
        this.args = args;
        this.mainView = new UnitDisk(view, args);
        this.cache = this.mainView.cache;
        this.layerStack = this.mainView.layerStack;
        this.navBackground = new UnitDisk({
            parent: view.parent,
            className: 'nav-background-disc',
            position: 'translate(95,95) scale(70)',
            hypertree: view.hypertree
        }, {
            data: args.data,
            decorator: null,
            cacheUpdate: null,
            transformation: args.transformation,
            transform: (n) => n.layout.z,
            nodeRadius: () => layers_background_2.navBgNodeR,
            nodeScale: args.nodeScale,
            nodeFilter: args.nodeFilter,
            linkWidth: args.linkWidth,
            linkCurvature: args.linkCurvature,
            layers: layers_background_1.navBackgroundLayers,
            layerOptions: {},
            offsetEmoji: args.offsetLabels,
            offsetLabels: args.offsetLabels,
            clipRadius: 1,
            captionBackground: args.captionBackground,
            captionFont: args.captionFont,
            captionHeight: args.captionHeight,
        });
        var navTransformation = new hyperbolic_transformation_2.NegTransformation(new hyperbolic_transformation_1.PanTransformation(args.transformation.state));
        //var ncount = 1        
        this.navParameter = new UnitDisk({
            parent: view.parent,
            className: 'nav-parameter-disc',
            position: 'translate(95,95) scale(70)',
            hypertree: view.hypertree
        }, {
            data: n_loaders_1.navdata(),
            decorator: null,
            layers: layers_parameter_1.navParameterLayers,
            layerOptions: {},
            cacheUpdate: (ud, cache) => {
                var t0 = performance.now();
                cache.unculledNodes = hyperbolic_math_3.dfsFlat(ud.args.data);
                function setCacheZ(n, v) {
                    n.cache = v;
                    n.cachep = hyperbolic_math_1.CktoCp(n.cache);
                    n.strCache = n.cache.re + ' ' + n.cache.im;
                    n.scaleStrText = ` scale(1)`;
                    n.transformStrCache = ` translate(${n.strCache})`;
                }
                const spr = 1.08;
                setCacheZ(cache.unculledNodes[0], hyperbolic_math_2.CmulR(args.transformation.state.P, -1));
                setCacheZ(cache.unculledNodes[1], hyperbolic_math_2.CmulR(args.transformation.state.θ, -spr));
                setCacheZ(cache.unculledNodes[2], hyperbolic_math_1.CptoCk({ θ: args.transformation.state.λ * 2 * Math.PI, r: -spr }));
                cache.voronoiDiagram = ud.voronoiLayout(cache.unculledNodes);
                cache.cells = cache.voronoiDiagram.polygons();
                ud.cacheMeta = { minWeight: [0], Δ: [performance.now() - t0] };
            },
            transformation: navTransformation,
            transform: (n) => hyperbolic_math_2.CmulR(n, -1),
            //caption:            (n:N)=> undefined,
            nodeRadius: () => .16,
            nodeScale: () => 1,
            nodeFilter: () => true,
            linkWidth: args.linkWidth,
            linkCurvature: args.linkCurvature,
            offsetEmoji: args.offsetLabels,
            offsetLabels: args.offsetLabels,
            clipRadius: 1.7,
            captionBackground: args.captionBackground,
            captionFont: args.captionFont,
            captionHeight: args.captionHeight
        });
    }
    get voronoiLayout() {
        return this.mainView.voronoiLayout;
    }
}
exports.UnitDiskNav = UnitDiskNav;
