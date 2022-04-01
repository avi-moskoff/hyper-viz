"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ducd_1 = require("ducd");
const hyperbolic_math_1 = require("../../models/transformation/hyperbolic-math");
const unitdisk_1 = require("../unitdisk/unitdisk");
const unitdisk_2 = require("../unitdisk/unitdisk");
const hypertree_1 = require("./hypertree");
const hypertree_meta_1 = require("../meta/hypertree-meta/hypertree-meta");
/*
k(.58) = 0.8146164741766521  208
k(.92) = 0.39191835884530846 100
k(.98) = 0.1989974874213242  51
k(1)   = 0
*/
const bubbleSvgDef = `<defs>
        <radialGradient id="exampleGradient">            
            <stop offset="0%"   stop-color="rgb(255,255,255)" stop-opacity=".08"/>
            <stop offset="30%"  stop-color="rgb(243,243,243)" stop-opacity=".08"/>
            <stop offset="48%"  stop-color="rgb(224,224,224)" stop-opacity=".08"/>
            <stop offset="58%"  stop-color="rgb(208,208,208)" stop-opacity=".08"/>
            <stop offset="82%"  stop-color="rgb(146,146,146)" stop-opacity=".08"/>
            <stop offset="92%"  stop-color="rgb(100,100,100)" stop-opacity=".08"/>
            <stop offset="98%"  stop-color="rgb( 51, 51, 51)" stop-opacity=".08"/>
            <stop offset="100%" stop-color="rgb(  0,  0,  0)" stop-opacity=".08"/>
        </radialGradient>
    </defs>`;
const btn = (name, icon, classes = '', iconColor = undefined) => `<button id="${name}" class="btn btn-small waves-effect waves-orange pn ${classes}">        
        <i class="material-icons" ${iconColor ? 'style="color:' + iconColor + ';"' : ''}>${icon}</i>
    </button>`;
const maintoobarHTML = `
    <!--
    ${btn('btnundo', 'undo')}
    ${btn('btncommit', 'check')}
    -->            
    <!--
    ${btn('btndownload', 'file_download', 'tool-seperator disabled')}
    ${btn('btnupload', 'cloud_upload', 'disabled')}            
    -->

    ${btn('btnhome', 'home', 'disabled')}
    ${btn('btnquery', 'search')}
    
    
    <!--
    ,530, 470
    ${btn('btncut', 'content_cut')}
    ${btn('btncopy', 'content_copy')}
    ${btn('btnpaste', 'content_paste')}
    ${btn('btnbrowse', 'open_with', 'tool-seperator tool-active')}
    ${btn('btnadd', 'add')}
    ${btn('btnedit', 'border_color')}
    ${btn('btndelte', 'delete')}

    swap
    open
    search from here
    -->`;
const pathtoobarHTML = `
    ${btn('btnnav', 'explore')}
    <!--${btn('btnsize', 'all_out')}-->
    ${btn('btnmeta', 'layers')}
    <!--
    ${btn('btn-path-home', 'grade', 'tool-seperator' /*, '#ffee55'*/)}
    -->
    ${btn('btn-path-center', 'add_circle', 'disabled tool-seperator' /*, '#b5b5b5'*/)}`;
const hypertreehtml = `<div class="unitdisk-nav">
        <div id="path"></div>
        <div id="main-toolbar" class="tool-bar">${maintoobarHTML}</div> 
        <div id="path-toolbar" class="tool-bar path-bar">${pathtoobarHTML}</div>        
        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="-0 0 1000 1000">
            ${bubbleSvgDef}
        </svg>
        <div id="query-input">
            <input id="query" type="text" class="browser-default">
        </div>
        <div id="meta"></div>        
        <div class="preloader"></div>
    </div>`;
class HypertreeEx extends hypertree_1.Hypertree {
    constructor(view, args) {
        super(view, args);
        /*
        * this functions modyfy model/view (this class internal state)
        * and call the according update function(s)
        */
        this.apiex = {
            toggleNav: () => {
                this.args.geometry.decorator = this.args.geometry.decorator === unitdisk_2.UnitDiskNav ? unitdisk_1.UnitDisk : unitdisk_2.UnitDiskNav;
                this.update.view.unitdisk();
                this.update.data();
                this.hypertreeMeta.update.model();
                this.hypertreeMeta.update.layout();
                this.hypertreeMeta.update.transformation();
            },
            toggleMeta: () => {
                this.noHypertreeMeta = this.noHypertreeMeta ? undefined : new hypertree_meta_1.NoHypertreeMeta();
                this.update.view.meta();
                this.hypertreeMeta.update.model();
                this.hypertreeMeta.update.layout();
                this.hypertreeMeta.update.transformation();
            }
        };
        /*
        * this functions assume the model/view (this class internal state)
        * has changes, and call the according ui updates (animatin frames)
        */
        this.requestAnimationFrameDummyDummy = f => f();
        this.update = {
            view: {
                parent: () => this.updateParent(),
                unitdisk: () => { this.updateUnitdiskView(); this.updateMetaView(); },
                meta: () => this.updateMetaView(),
            },
            data: () => {
                this.unitdisk.update.data();
                this.hypertreeMeta.update.transformation();
                this.hypertreeMeta.update.layout();
                this.hypertreeMeta.update.model();
            },
            transformation: () => {
                this.unitdisk.update.transformation();
                this.hypertreeMeta.update.layout();
                this.hypertreeMeta.update.transformation();
            },
            pathes: () => {
                this.unitdisk.update.pathes();
                this.hypertreeMeta.update.transformation();
            },
            centernode: (centerNode) => {
                const pathStr = centerNode
                    .ancestors()
                    .reduce((a, e) => `${e.precalc.label ? ("  " + e.precalc.label + "  ") : ''}${a ? "›" : ""}${a}`, '');
                //this.view_.path.innerText = pathStr // todo: html m frame?
                if (this.args.interaction.onCenterNodeChange)
                    this.args.interaction.onCenterNodeChange(centerNode, pathStr);
                if (centerNode === this.data && !this.view_.btnHome.classList.contains('disabled')) {
                    this.view_.btnHome.classList.add('disabled');
                    //this.view_.btnPathHome.classList.add('disabled')
                }
                if (centerNode !== this.data && this.view_.btnHome.classList.contains('disabled')) {
                    this.view_.btnHome.classList.remove('disabled');
                    //this.view_.btnPathHome.classList.remove('disabled')
                }
                if (!this.isAnimationRunning() && centerNode.data.name !== 'Root') {
                    const find = this.unitdisk.cache.voronoiDiagram.find(0, 0);
                    if (find) {
                        //console.log('found centernode by voro', pathStr, find.data)
                        this.args.interaction.onNodeSelect(find.data);
                    }
                }
            }
        };
        this.api['toggleMeta'] = this.apiex.toggleMeta;
        this.api['toggleNav'] = this.apiex.toggleNav;
    }
    //########################################################################################################
    //##
    //## View Updates
    //##
    //########################################################################################################
    updateParent() {
        this.view_.parent.innerHTML = ''; // actually just remove this.view if present ... do less
        this.view_.html = ducd_1.HTML.parse(hypertreehtml)();
        this.view_.parent.appendChild(this.view_.html);
        this.noHypertreeMeta = new hypertree_meta_1.NoHypertreeMeta();
        this.view_.path = this.view_.html.querySelector('#path');
        this.view_.pathesToolbar = this.view_.html.querySelector('#path-toolbar');
        this.view_.mainToolbar = this.view_.html.querySelector('#main-toolbar');
        this.updateUnitdiskView();
        this.updateMetaView();
    }
    updateMetaView() {
        var metaparent = this.view_.html.querySelector('.unitdisk-nav > #meta');
        metaparent.innerHTML = '';
        this.hypertreeMeta = this.noHypertreeMeta || new this.unitdisk.HypertreeMetaType({
            view: { parent: metaparent },
            model: this
        });
    }
    //########################################################################################################
    //##
    //## Sync blocks for async api functions
    //##
    //########################################################################################################
    resetData() {
        super.resetData();
        this.view_.path.innerText = '';
        this.view_.pathesToolbar.innerHTML = pathtoobarHTML;
        this.view_.mainToolbar.innerHTML = maintoobarHTML;
        this.view_.btnMeta = this.view_.html.querySelector('#btnmeta');
        this.view_.btnNav = this.view_.html.querySelector('#btnnav');
        this.view_.btnHome = this.view_.html.querySelector('#btnhome');
        this.view_.btnQuery = this.view_.html.querySelector('#btnquery');
        this.view_.queryDiv = this.view_.html.querySelector('#query-input');
        this.view_.inputQuery = this.view_.html.querySelector('#query-input > input');
        //this.view_.btnSize     = <HTMLButtonElement>this.view_.html.querySelector('#btnsize')
        this.view_.btnHome.onclick = () => this.api.gotoHome();
        this.view_.btnMeta.onclick = () => this.api['toggleMeta']();
        this.view_.btnNav.onclick = () => this.api['toggleNav']();
        this.view_.btnQuery.onclick = () => {
            this.view_.queryDiv.style.visibility = this.view_.queryDiv.style.visibility === 'visible'
                ? 'hidden'
                : 'visible';
            if (this.view_.queryDiv.style.visibility === 'visible')
                this.view_.inputQuery.focus();
        };
        this.view_.queryDiv = this.view_.html.querySelector('#query-input');
        this.view_.queryDiv.onkeyup = e => {
            event.preventDefault();
            if (e.keyCode === 13) {
                this.api.selectQuery(this.view_.inputQuery.value, undefined);
                this.view_.queryDiv.style.visibility = 'hidden';
            }
        };
        /*this.view_.btnSize.onclick     = ()=> {
            const view = [
                'translate(500,500) scale(480)', // small
                'translate(500,520) scale(490)', // big
                'translate(500,520) scale(620, 490)', // oval
                'translate(500,520) scale(720, 590)', // overlap
                'translate(480,620) scale(800, 800)', // mobile (vertical)
            ]
            const nav = [
                'translate(95,95) scale(70)',
                'translate(95,95) scale(70)',
                'translate(-150,105) scale(70)',
                'translate(-160,95) scale(70)',
                'translate(-150,105) scale(70)'
            ]
            sizeidx = ++sizeidx % 5
            this.unitdisk.api.setTransform(view[sizeidx], nav[sizeidx])
        }
        let sizeidx = 0
        */
    }
    //########################################################################################################
    //##
    //## Path
    //##
    //########################################################################################################
    addPath(pathType, n) {
        const newpath = super.addPath(pathType, n);
        if (pathType === 'Query')
            return;
        // view: btn   ==> update.btntoolbar()    
        const btnElem = ducd_1.HTML.parse(btn(newpath.id, newpath.icon, pathType === 'HoverPath' ? 'disabled' : '', newpath.color))();
        btnElem.onclick = () => {
            this.args.interaction.onNodeSelect(n);
            this.api.goto(hyperbolic_math_1.CmulR({ re: n.layout.z.re, im: n.layout.z.im }, -1), null)
                .then(() => this.drawDetailFrame());
        };
        btnElem.title = `${n.precalc.label}`;
        if (pathType === 'HoverPath') {
            this.view_.pathesToolbar.insertBefore(btnElem, null);
        }
        else {
            this.view_.mainToolbar.appendChild(btnElem);
        }
        return newpath;
    }
    removePath(pathType, n) {
        super.removePath(pathType, n);
        const pathId = this.btnPathId(pathType, n);
        if (pathType === 'HoverPath') {
            const btnElem = this.view_.pathesToolbar.querySelector(`#${pathId}`);
            this.view_.pathesToolbar.removeChild(btnElem);
        }
        else {
            const btnElem = this.view_.mainToolbar.querySelector(`#${pathId}`);
            this.view_.mainToolbar.removeChild(btnElem);
        }
    }
}
exports.HypertreeEx = HypertreeEx;
