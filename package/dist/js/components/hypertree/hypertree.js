"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const ducd_1 = require("ducd");
const ducd_2 = require("ducd");
const ducd_3 = require("ducd");
const n_layouts_1 = require("../../models/n/n-layouts");
const hyperbolic_math_1 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_math_2 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_math_3 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_math_4 = require("../../models/transformation/hyperbolic-math");
const preset_base_1 = require("../../models/hypertree/preset-base");
const ducd_4 = require("ducd");
let globelhtid = 0;
const π = Math.PI;
const htmlpreloader = `
    <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    </div>`;
const bubbleSvgDef_old = `<defs>
        <radialGradient id="exampleGradient">            
            <stop offset="58%"  stop-color="rgb(255,255,255)" stop-opacity=".08"/>            
            <stop offset="92%"  stop-color="rgb( 96, 96, 96)" stop-opacity=".08"/>
            <stop offset="98%"  stop-color="rgb( 36, 36, 36)" stop-opacity=".08"/>
            <stop offset="100%" stop-color="rgb(  0,  0,  0)" stop-opacity=".08"/>
        </radialGradient>
    </defs>`;
const grad = [255, 96, 36, 0];
const bubbleSvgDef = `<defs>
        <radialGradient id="exampleGradient">            
            <stop offset="58%"  stop-color="rgb(${grad[0]},${grad[0]},${grad[0]})" stop-opacity=".15"/>            
            <stop offset="92%"  stop-color="rgb(${grad[1]},${grad[1]},${grad[1]})" stop-opacity=".15"/>
            <stop offset="98%"  stop-color="rgb(${grad[2]},${grad[2]},${grad[2]})" stop-opacity=".15"/>
            <stop offset="100%" stop-color="rgb(${grad[3]},${grad[3]},${grad[3]})" stop-opacity=".15"/>
        </radialGradient>
    </defs>`;
const hypertreehtml = `<div class="unitdisk-nav">        
        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="-0 0 1000 1000">
            ${bubbleSvgDef}
        </svg>
        <div class="preloader"></div>
    </div>`;
class Hypertree {
    constructor(view, args) {
        this.log = [];
        this.isInitializing = false;
        this.lastCenterNode = undefined;
        /*
        * this functions modyfy model/view (this class internal state)
        * and call the according update function(s)
        */
        this.api = {
            setModel: (model) => new Promise((ok, err) => {
                //model = mergeDeep_(presets[model.baseCfg], model)
                this.isInitializing = true;
                const base = preset_base_1.presets.modelBase();
                console.group("set model: merging ", model, ' into ', base);
                //this.args = mergeDeep(model, base)
                this.args = ducd_4.mergeDeep(base, model);
                console.log('merge result: ', this.args);
                // wenn parent updatedated hat wraum ist da nich eine alte transformations in der disk            
                this.update.view.parent();
                this.api.setDataloader(ok, err, this.args.dataloader); // resetData is hier drin 🤔 
                this.api.setLangloader(ok, err, this.args.langloader);
                console.groupEnd();
            }),
            setLangloader: (ok, err, ll) => {
                console.group("langloader initiate");
                this.args.langloader = ll;
                this.args.langloader((langMap, t1, dl) => {
                    console.group("langloader", langMap && Object.keys(langMap).length || 0);
                    this.langMap = langMap || {};
                    this.updateLang_(dl);
                    //requestAnimationFrame(()=> this.update.data())
                    this.update.data();
                    console.groupEnd();
                    if (this.data) {
                        this.isInitializing = false;
                        ok();
                    }
                });
                console.groupEnd();
            },
            setDataloader: (ok, err, dl) => {
                console.group("dataloader initiate");
                this.args.dataloader = dl;
                const t0 = performance.now();
                this.resetData();
                this.args.dataloader((d3h, t1, dl) => {
                    console.group("dataloader");
                    this.initData(d3h, t0, t1, dl);
                    console.groupEnd();
                    if (this.langMap) {
                        this.isInitializing = false;
                        ok();
                    }
                });
                console.groupEnd();
            },
            toggleSelection: (n) => {
                this.toggleSelection(n);
                if (this.args.objects.pathes.length > 10 + 1) {
                    const toremove = this.args.objects.selections[0];
                    this.args.objects.selections = this.args.objects.selections.filter(e => e !== toremove);
                    this.removePath('SelectionPath', toremove);
                }
                this.update.pathes();
            },
            //addPath: (pathid, node:N)=> { this.addPath(pathid, node) },
            //removePath: (pathid, node:N)=> { this.removePath(pathid, node) },
            setPathHead: (pathType, n) => {
                if (!this.isInitializing && !this.isAnimationRunning()) {
                    this.setPathHead(pathType, n);
                    this.update.pathes();
                }
            },
            selectQuery: (query, prop) => {
                const lq = query ? query.toLowerCase() : null;
                this.data.each(n => {
                    n.pathes.partof = [];
                    n.pathes.headof = undefined;
                    n.pathes.labelcolor = undefined;
                    n.pathes.finalcolor = undefined;
                    n.pathes.isPartOfAnyQuery = false;
                });
                console.log('QUERY:', lq);
                this.args.objects.pathes = [];
                this.data.each(n => {
                    if (n.data) {
                        if (n.data.name.toLowerCase().includes(lq))
                            this.addPath('Query', n);
                        if (n.precalc && n.precalc.label)
                            if (n.precalc.label.toLowerCase().includes(lq))
                                this.addPath('Query', n);
                    }
                });
                this.update.pathes();
            },
            gotoHome: () => new Promise((ok, err) => this.animateTo(ok, err, { re: 0, im: 0 }, null)),
            gotoNode: (n) => new Promise((ok, err) => this.animateTo(ok, err, hyperbolic_math_3.CmulR({ re: n.layout.z.re, im: n.layout.z.im }, -1), null)),
            goto: (p, l) => new Promise((ok, err) => this.animateTo(ok, err, p, l)),
            gotoλ: (l) => new Promise((ok, err) => this.animateToλ(ok, err, l))
        };
        /*
        * this functions assume the model/view (this class internal state)
        * has changes, and call the according ui updates (animatin frames)
        */
        this.update = {
            view: {
                parent: () => this.updateParent(),
                unitdisk: () => this.updateUnitdiskView(),
            },
            data: () => this.unitdisk.update.data(),
            transformation: () => this.unitdisk.update.transformation(),
            pathes: () => this.unitdisk.update.pathes(),
            centernode: (centerNode) => {
                if (this.lastCenterNode && this.lastCenterNode.mergeId == centerNode.mergeId)
                    return;
                this.lastCenterNode = centerNode;
                const pathStr = centerNode
                    .ancestors()
                    .reduce((a, e) => `${e.precalc.label ? ("  " + e.precalc.label + "  ") : ''}${a ? "›" : ""}${a}`, '');
                //this.view_.path.innerText = pathStr // todo: html m frame?
                if (this.args.interaction.onCenterNodeChange)
                    this.args.interaction.onCenterNodeChange(centerNode, pathStr);
            }
        };
        //########################################################################################################
        //##
        //## internal functions, calles by ...?
        //##
        //########################################################################################################
        this.virtualCanvas = undefined;
        this.virtualCanvasContext = undefined;
        //########################################################################################################
        //##
        //## Path
        //##
        //########################################################################################################
        this.btnPathId = (pathType, n) => `btn-path-${pathType}` + (pathType === 'SelectionPath' ? `-${n.mergeId}` : '');
        console.group("hypertree constructor");
        this.view_ = view;
        this.initPromise = this.api.setModel(args);
        console.groupEnd();
    }
    //########################################################################################################
    //##
    //## View Updates
    //##
    //########################################################################################################
    updateParent() {
        console.log("_updateParent");
        this.view_.parent.innerHTML = ''; // actually just remove this.view if present ... do less
        this.view_.html = ducd_1.HTML.parse(hypertreehtml)();
        this.view_.parent.appendChild(this.view_.html);
        this.updateUnitdiskView();
    }
    updateUnitdiskView() {
        console.log("_updateUnitdiskView");
        var udparent = this.view_.html.querySelector('.unitdisk-nav > svg');
        udparent.innerHTML = bubbleSvgDef;
        this.unitdisk = new this.args.geometry.decorator({
            parent: udparent,
            className: 'unitDisc',
            position: 'translate(500,500) scale(480)',
            hypertree: this,
        }, {
            data: null,
            decorator: null,
            transformation: this.args.geometry.transformation,
            transform: (n) => this.unitdisk.args.transformation.transformPoint(n.layout.z),
            layers: this.args.geometry.layers,
            layerOptions: this.args.geometry.layerOptions,
            cacheUpdate: this.args.geometry.cacheUpdate,
            clipRadius: this.args.geometry.clipRadius,
            nodeRadius: this.args.geometry.nodeRadius,
            nodeScale: this.args.geometry.nodeScale,
            nodeFilter: this.args.geometry.nodeFilter,
            linkWidth: this.args.geometry.linkWidth,
            linkCurvature: this.args.geometry.linkCurvature,
            offsetEmoji: this.args.geometry.offsetLabels,
            offsetLabels: this.args.geometry.offsetLabels,
            captionBackground: this.args.geometry.captionBackground,
            captionFont: this.args.geometry.captionFont,
            captionHeight: this.args.geometry.captionHeight,
        });
    }
    //########################################################################################################
    //##
    //## Sync blocks for async api functions
    //##
    //########################################################################################################
    resetData() {
        console.log("_resetData");
        this.view_.html.querySelector('.preloader').innerHTML = htmlpreloader;
        this.unitdisk.args.data = undefined;
        this.data = undefined;
        this.langMap = undefined;
        this.args.geometry.transformation.state.λ = .001;
        this.args.geometry.transformation.state.P.re = 0;
        this.args.geometry.transformation.state.P.im = 0;
        this.args.filter.weightFilter.magic = 20;
        this.args.geometry.transformation.cache.centerNode = undefined;
        //this.args.geometry.transformation.cache.hoverNode = undefined
        this.args.objects.selections = [];
        this.args.objects.pathes = [];
        this.args.objects.traces = [];
        requestAnimationFrame(() => this.update.data());
    }
    initData(d3h, t0, t1, dl) {
        console.log("_initData");
        var t2 = performance.now();
        var ncount = 1;
        globelhtid++;
        this.data = d3
            .hierarchy(d3h)
            .each((n) => {
            n.globelhtid = globelhtid;
            n.mergeId = ncount++;
            n.data = n.data || {};
            n.precalc = {};
            n.pathes = {};
            n.layout = null;
            n.layoutReference = null;
        });
        this.unitdisk.args.data = this.data;
        this.args.geometry.transformation.cache.N = this.data.descendants().length;
        // layout initiialisation
        const startAngle = this.args.layout.rootWedge.orientation;
        const defAngleWidth = this.args.layout.rootWedge.angle;
        this.data.layout = {
            wedge: {
                α: hyperbolic_math_1.πify(startAngle - defAngleWidth / 2),
                Ω: hyperbolic_math_1.πify(startAngle + defAngleWidth / 2)
            }
        };
        n_layouts_1.setZ(this.data, { re: 0, im: 0 });
        // PRECALC:
        var t3 = performance.now();
        this.updateWeights_();
        // cells können true initialisert werden        
        this.data.each(n => n.precalc.clickable = true);
        // dataInitBFS:
        // - emoji*
        // - img*
        this.data.each(n => this.args.dataInitBFS(this, n));
        this.modelMeta = {
            Δ: [t1 - t0, t2 - t1, t3 - t2, performance.now() - t3],
            filesize: dl,
            nodecount: ncount - 1
        };
        // von rest trennen, da lang alleine benötigt wird
        // langInitBFS:
        // - lang
        // - wiki*
        // - labelslen automatisch
        // - clickable=selectable*
        // - cell* default = clickable? oder true?
        this.updateLang_();
        // hmm, wird niergens mitgemessen :(
        this.findInitλ_();
        this.view_.html.querySelector('.preloader').innerHTML = '';
    }
    updateWeights_() {
        console.log("_updateWeights");
        // sum dinger
        this.sum(this.data, this.args.layout.weight, 'layoutWeight');
        this.sum(this.data, this.args.filter.weightFilter.weight, 'cullingWeight');
        this.sum(this.data, this.args.layout.weight, 'visWeight');
        //this.sum(this.data, this.args.geometry.weight[0], (n, s)=> n.visprop[0] = s)
        // node dinger
        // for arc width and node radius in some cases, not flexible enough
        this.data.each(n => n.precalc.weightScale = (Math.log2(n.precalc.visWeight) || 1)
            / (Math.log2(this.data.precalc.visWeight || this.data.children.length) || 1));
    }
    sum(data, value, target) {
        data.eachAfter(node => {
            let sum = +value(node) || 0;
            const children = node.children;
            var i = children && children.length;
            while (--i >= 0)
                sum += children[i].precalc[target];
            node.precalc[target] = sum;
        });
    }
    updateLang_(dl = 0) {
        console.log("_updateLang");
        const t0 = performance.now();
        if (this.data) {
            this.data.each(n => this.args.langInitBFS(this, n));
            this.updateLabelLen_();
        }
        if (dl || !this.langMeta)
            this.langMeta = {
                Δ: [performance.now() - t0],
                map: this.langMap,
                filesize: dl
            };
    }
    findInitλ_() {
        console.groupCollapsed('_findInitλ');
        for (let i = 0; i < 50; i++) {
            const progress01 = i / 50;
            const λ = .02 + hyperbolic_math_4.sigmoid(progress01) * .75;
            //console.log('#'+progress01, λ)
            this.args.geometry.transformation.state.λ = λ;
            this.updateLayoutPath_(this.data);
            this.unitdisk.args.cacheUpdate(this.unitdisk, this.unitdisk.cache);
            const unculledNodes = this.args.geometry.transformation.cache.unculledNodes;
            const maxR = unculledNodes.reduce((max, n) => Math.max(max, n.layout.zp.r), 0);
            if (maxR > (this.args.layout.initSize || .95)) {
                console.info('MaxR at abort', maxR);
                break;
            }
        }
        this.data.each((n) => n.layoutReference = ducd_2.clone(n.layout));
        console.groupEnd();
        console.info('auto λ = ', this.args.geometry.transformation.state.λ);
    }
    updateLabelLen_() {
        console.log("_updateLabelLen");
        var canvas = this.virtualCanvas
            || (this.virtualCanvas = document.createElement("canvas"));
        var context = this.virtualCanvasContext
            || (this.virtualCanvasContext = canvas.getContext("2d"));
        context.font = this.args.geometry.captionFont;
        //context.textBaseLine = 'middle'
        //context.textAlign = 'center' 
        const updateLabelLen_ = (txtprop, lenprop) => {
            this.data.each(n => {
                if (n.precalc[txtprop]) {
                    const metrics = context.measureText(n.precalc[txtprop]);
                    n.precalc[lenprop] = metrics.width / 200 / window.devicePixelRatio;
                    console.assert(typeof n.precalc[lenprop] === 'number');
                }
                else
                    n.precalc[lenprop] = undefined;
            });
        };
        updateLabelLen_('label', 'labels-forcelen');
        updateLabelLen_('label', 'labelslen');
        updateLabelLen_('label2', 'labels2len');
        updateLabelLen_('icon', 'emojislen');
    }
    updateLayoutPath_(preservingnode) {
        const t = this.args.geometry.transformation;
        //console.log("_updateLayoutPath_", t.state.λ)        
        console.assert(preservingnode);
        const t0 = performance.now();
        preservingnode.ancestors().reverse().forEach(n => this.args.layout.type(n, t.state.λ, true));
        t.state.P = hyperbolic_math_3.CmulR(preservingnode.layout.z, -1); // set preserving node back to .... zero? no, orig pos?
        this.layoutMeta = { Δ: performance.now() - t0 };
    }
    addIfNotInSafe(arr, newE, side = 'unshift') {
        if (!arr)
            return [newE];
        if (!arr.includes(newE))
            arr[side](newE);
        return arr;
    }
    toggleSelection(n) {
        if (this.args.objects.selections.includes(n)) {
            //const nidx = this.args.objects.selections.indexOf(n)
            //delete this.args.objects.selections[nidx]
            this.args.objects.selections = this.args.objects.selections.filter(e => e !== n);
            this.removePath('SelectionPath', n);
        }
        else {
            this.args.objects.selections.push(n);
            this.addPath('SelectionPath', n);
        }
    }
    // es kann nur einen pro id geben, gibt es bereits einen wird dieser entfernt 
    // (praktisch für hover)
    setPathHead(path, n) {
        const pt = path ? path.type : 'HoverPath';
        const oldPathId = this.btnPathId(pt, n);
        const oldPath = this.args.objects.pathes.find(e => e.id === oldPathId);
        if (oldPath)
            this.removePath(pt, oldPath.head);
        if (n)
            this.addPath(pt, n);
    }
    addPath(pathType, n) {
        const plidx = ducd_2.stringhash(n.precalc.label);
        const color = ({
            'HoverPath': 'none',
            'Query': ducd_3.googlePalette(15)
        })[pathType] || ducd_3.googlePalette(plidx) || ducd_3.googlePalette(1);
        const newpath = {
            type: pathType,
            id: this.btnPathId(pathType, n),
            icon: ({ 'HoverPath': 'mouse' })[pathType] || 'place',
            head: n,
            headName: n.precalc.label,
            ancestors: n.ancestors(),
            color: color,
        };
        // model mod
        this.args.objects.pathes.push(newpath);
        n.pathes.headof = newpath;
        if (pathType !== 'HoverPath')
            n.pathes.finalcolor = n.pathes.labelcolor = newpath.color;
        // model mod: node context        
        n.ancestors().forEach((pn) => {
            pn.pathes.partof = this.addIfNotInSafe(pn.pathes.partof, newpath, pathType === 'HoverPath' ? 'push' : 'unshift');
            if (pathType !== 'HoverPath')
                pn.pathes.finalcolor = newpath.color;
            pn.pathes[`isPartOfAny${pathType}`] = true;
        });
        return newpath;
    }
    removePath(pathType, n) {
        const pathId = this.btnPathId(pathType, n);
        // model mod
        this.args.objects.pathes = this.args.objects.pathes.filter(e => e.id !== pathId);
        n.pathes.headof = undefined;
        if (pathType !== 'HoverPath')
            n.pathes.labelcolor = undefined;
        // model mod: node context        
        n.ancestors().forEach((pn) => {
            pn.pathes.partof = pn.pathes.partof.filter(e => e.id !== pathId);
            pn.pathes.finalcolor = pn.pathes.partof.length > 0
                ? pn.pathes.partof[0].color
                : undefined;
            if (pn.pathes.finalcolor === 'none')
                pn.pathes.finalcolor = undefined;
            const nodeFlagName = `isPartOfAny${pathType}`;
            pn.pathes[nodeFlagName] = pn.pathes.partof.some(e => e.type === pathType);
        });
    }
    //########################################################################################################
    //##
    //## Animation frames ans animations
    //##
    //########################################################################################################
    drawDetailFrame() {
        this.update.data();
    }
    animateUp(ok, err) {
        const newλ = this.args.geometry.transformation.state.λ;
        this.args.geometry.transformation.state.λ = .001;
        this.animateToλ(ok, err, newλ);
    }
    animateToλ(ok, err, newλ) {
        const initλ = this.args.geometry.transformation.state.λ;
        const way = initλ - newλ;
        new Animation({
            name: 'animateToλ',
            hypertree: this,
            duration: 750,
            resolve: ok,
            reject: err,
            frame: (progress01) => {
                const waydone01 = 1 - hyperbolic_math_4.sigmoid(progress01);
                console.assert(waydone01 >= 0 && waydone01 <= 1);
                const waydone = way * waydone01;
                const λ = newλ + waydone;
                this.args.geometry.transformation.state.λ = λ;
                this.updateLayoutPath_(this.args.geometry.transformation.cache.centerNode);
                this.update.transformation();
            }
        });
    }
    animateTo(resolve, reject, newP, newλ) {
        const initTS = ducd_2.clone(this.args.geometry.transformation.state);
        const way = hyperbolic_math_3.CsubC(initTS.P, newP);
        new Animation({
            name: 'animateTo',
            resolve: resolve,
            reject: reject,
            hypertree: this,
            duration: 750,
            frame: (progress01) => {
                const waydone01 = 1 - hyperbolic_math_4.sigmoid(progress01);
                console.assert(waydone01 >= 0 && waydone01 <= 1);
                const waydone = hyperbolic_math_3.CmulR(way, waydone01);
                const animP = hyperbolic_math_3.CaddC(newP, waydone);
                hyperbolic_math_2.CassignC(this.args.geometry.transformation.state.P, animP);
                this.update.transformation();
            }
        });
    }
    isAnimationRunning() {
        const view = this.unitdisk && this.unitdisk.isDraging;
        const nav = this.unitdisk && this.unitdisk.isDraging;
        const lowdetail = this.transition ? this.transition.lowdetail : false;
        return view || nav || lowdetail;
    }
}
exports.Hypertree = Hypertree;
/*
class TransitionModel {
    public hypertree : Hypertree
    public type : 'animation' | 'interaction' | 'script'
    public frames : Frame[] = []
    public lowdetail = true
    public currentframe : Frame
    public beginTime
    public endTime
}*/
class Transition {
    constructor(hypertree) {
        this.frames = [];
        this.lowdetail = true;
        this.hypertree = hypertree;
    }
    begin() {
        this.beginTime = performance.now();
    }
    end() {
        this.currentframe = undefined;
        this.hypertree.transition = undefined;
        console.groupEnd();
    }
}
exports.Transition = Transition;
class Frame {
    constructor(nr) {
        this.nr = nr;
        this.created = performance.now();
    }
}
exports.Frame = Frame;
class Animation extends Transition {
    constructor(args) {
        super(args.hypertree);
        if (args.hypertree.transition) {
            console.warn("Animaiion collision");
            return;
        }
        console.group('Transition: ' + args.name);
        args.hypertree.transition = this;
        this.hypertree.log.push(this.hypertree.transition);
        const frame = () => {
            //console.group("Frame")            
            this.currentframe = new Frame(0);
            this.frames.push(this.currentframe);
            const now = performance.now();
            if (!this.beginTime) {
                this.begin();
                this.endTime = now + args.duration;
            }
            const done = now - this.beginTime;
            const p01 = done / args.duration;
            if (now > this.endTime) {
                args.frame(1);
                this.end();
                console.log('resolve by: time (maybe jump at end)');
                args.resolve();
            }
            else {
                args.frame(p01);
                requestAnimationFrame(() => frame());
            }
            this.currentframe = undefined;
            //console.groupEnd()
            console.debug('frame end');
        };
        requestAnimationFrame(() => frame());
    }
}
