"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ducd_1 = require("ducd");
const unitdisk_meta_1 = require("../unitdisk-meta/unitdisk-meta");
const layerstack_meta_1 = require("../layerstack-meta/layerstack-meta");
class NoHypertreeMeta {
    constructor() {
        this.update = {
            parent: () => { },
            model: () => { },
            lang: () => { },
            layout: () => { },
            transformation: () => { }
        };
    }
}
exports.NoHypertreeMeta = NoHypertreeMeta;
class HypertreeMeta {
    constructor({ view, model }) {
        this.update = {
            parent: () => this.updateParent(),
            all: () => {
                // TODO:
            },
            model: () => {
                this.udView.update.model();
                this.lsView.update.data();
            },
            lang: () => {
                this.udView.update.lang();
            },
            layout: () => {
                this.udView.update.layout();
                this.lsView.update.data();
            },
            transformation: () => {
                this.udView.update.transformation();
                this.lsView.update.data();
            }
        };
        this.view = view;
        this.model = model;
        this.updateParent();
    }
    updateParent() {
        this.udView = new unitdisk_meta_1.UnitdiskMeta({
            view: { parent: this.view.parent, className: 'data', hypertree: this.model },
            model: this.model.unitdisk
        });
        this.lsView = new layerstack_meta_1.LayerStackMeta({
            view: { parent: this.view.parent, className: 'data', hypertree: this.model },
            model: this.model.unitdisk
        });
    }
}
exports.HypertreeMeta = HypertreeMeta;
class HypertreeMetaNav {
    constructor({ view, model }) {
        this.update = {
            parent: () => this.updateParent(),
            model: () => {
                this.udView.update.model();
                this.udNav.update.model();
                this.lsView.update.data();
                this.lsNav.update.data();
                this.lsNavParam.update.data();
            },
            lang: () => {
                this.udView.update.lang();
                this.udNav.update.lang();
            },
            layout: () => {
                this.udView.update.layout();
                this.udNav.update.layout();
                this.lsView.update.data();
                this.lsNav.update.data();
                this.lsNavParam.update.data();
            },
            transformation: () => {
                this.udView.update.transformation();
                this.udNav.update.transformation();
                this.lsView.update.data();
                this.lsNav.update.data();
                this.lsNavParam.update.data();
            }
        };
        this.htmlCarUd = `
        <div class="left carousel carousel-slider" data-indicators="true">
            <div id="meta-ud-data" class="carousel-item"></div>
            <div id="meta-ud-nav" class="carousel-item"></div>            
        </div>`;
        this.htmlCarLs = `
        <div class="right carousel carousel-slider" data-indicators="true">
            <div id="meta-ls-data" class="carousel-item"></div>
            <div id="meta-ls-bg" class="carousel-item"></div>
            <div id="meta-ls-nav" class="carousel-item"></div>
        </div>`;
        this.view = view;
        this.model = model;
        this.updateParent();
    }
    updateParent() {
        //this.view_.parent.innerHTML = '' // actually just remove this.view if present ... do less
        this.view.html = ducd_1.HTML.parse(this.htmlCarUd)();
        this.view.parent.appendChild(this.view.html);
        this.view.html2 = ducd_1.HTML.parse(this.htmlCarLs)();
        this.view.parent.appendChild(this.view.html2);
        M.Carousel.init(document.querySelectorAll('.carousel'), {
            fullWidth: true,
            noWrap: true
        });
        const navUnitDisk = this.model.unitdisk;
        this.udView = new unitdisk_meta_1.UnitdiskMeta({
            view: { parent: this.view.html.querySelector('#meta-ud-data'), className: 'data', hypertree: this.model },
            model: navUnitDisk.mainView
        });
        this.udNav = new unitdisk_meta_1.UnitdiskMeta({
            view: { parent: this.view.html.querySelector('#meta-ud-nav'), className: 'nav', hypertree: this.model },
            model: navUnitDisk.navParameter
        });
        this.lsView = new layerstack_meta_1.LayerStackMeta({
            view: { parent: this.view.html2.querySelector('#meta-ls-data'), className: 'data', hypertree: this.model },
            model: navUnitDisk.mainView
        });
        this.lsNav = new layerstack_meta_1.LayerStackMeta({
            view: { parent: this.view.html2.querySelector('#meta-ls-bg'), className: 'navBg', hypertree: this.model },
            model: navUnitDisk.navBackground
        });
        this.lsNavParam = new layerstack_meta_1.LayerStackMeta({
            view: { parent: this.view.html2.querySelector('#meta-ls-nav'), className: 'nav', hypertree: this.model },
            model: this.model.unitdisk.navParameter
        });
    }
}
exports.HypertreeMetaNav = HypertreeMetaNav;
