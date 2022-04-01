"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const hyperbolic_math_1 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_math_2 = require("../../models/transformation/hyperbolic-math");
const hyperbolic_math_3 = require("../../models/transformation/hyperbolic-math");
class InteractionLayer {
    constructor(view, args) {
        this.name = 'interaction';
        this.update = {
            parent: () => this.initMouseStuff(),
            data: () => { },
            transformation: () => { },
            style: () => { }
        };
        this.currMousePosAsArr = () => d3.mouse(this.view.parent.node());
        this.currMousePosAsC = () => hyperbolic_math_2.ArrtoC(this.currMousePosAsArr());
        this.findNodeByCell = () => {
            var m = this.currMousePosAsArr();
            var find = this.view.unitdisk.cache.voronoiDiagram.find(m[0], m[1]);
            return find ? find.data : undefined;
        };
        this.onDragStart = (n, m) => {
            this.ping(m); //#####################
            if (!this.animationTimer)
                this.view.unitdisk.args.transformation.onDragStart(m);
        };
        this.onDragλ = (l) => {
            this.view.unitdisk.args.transformation.onDragλ(l);
            this.view.hypertree.updateLayoutPath_(this.view.unitdisk.args.transformation.cache.centerNode); // hmmm?
            this.view.hypertree.update.transformation();
        };
        this.onDragByNode = (n, s, e) => {
            if (n && n.name == 'θ') {
                this.view.unitdisk.args.transformation.onDragθ(s, e);
                this.view.hypertree.update.transformation();
            }
            else if (n && n.name == 'λ') {
                this.onDragλ(hyperbolic_math_3.πify(hyperbolic_math_1.CktoCp(hyperbolic_math_2.CmulR(e, -1)).θ) / 2 / Math.PI);
            }
            else {
                this.view.unitdisk.args.transformation.onDragP(s, e);
                this.view.hypertree.update.transformation();
                this.ping(e); //#####################            
            }
        };
        this.onDragEnd = (n, s, e) => {
            const ti3 = d3.timer(() => {
                ti3.stop();
                this.view.hypertree.args.objects.traces.length = 0;
                this.view.hypertree.update.transformation();
            }, 2000);
            this.ping(e); //#####################
            var dc = hyperbolic_math_2.CsubC(s, e);
            var dist = Math.sqrt(dc.re * dc.re + dc.im * dc.im);
            if (dist < .006)
                this.onClick(n, e); // sollte on click sein und auch timer berücksichtigen oder?        
            // immer?
            this.view.unitdisk.args.transformation.onDragEnd(e);
            this.view.hypertree.update.transformation();
        };
        this.animationTimer = null;
        this.cancelAnimationTimer = () => {
            this.animationTimer.stop();
            this.animationTimer = null;
        };
        //-----------------------------------------------------------------------------------------
        this.dblClickTimer = null;
        this.cancelClickTimer = () => {
            clearTimeout(this.dblClickTimer);
            this.dblClickTimer = null;
        };
        this.onClick = (n, m) => {
            if (d3.event && d3.event.preventDefault)
                d3.event.preventDefault();
            m = m || this.currMousePosAsC();
            //m = n.cache
            if (!this.dblClickTimer)
                this.dblClickTimer = setTimeout(() => {
                    this.dblClickTimer = null;
                    if (n != this.view.unitdisk.args.transformation.cache.centerNode)
                        this.animateTo(n, m);
                    else
                        this.args.onClick(n, m);
                }, 300);
            else
                this.cancelClickTimer();
        };
        this.onDblClick = (n) => {
            d3.event.preventDefault();
            var m = this.currMousePosAsC();
            this.cancelClickTimer();
            //this.animateTo(n, ArrtoC(d3.mouse(this.args.parent)))
            this.args.onClick(n, m);
        };
        this.view = view;
        this.args = args;
    }
    initMouseStuff() {
        var dragStartPoint = null;
        var dragStartElement = null;
        /*var drag = d3.drag()
            //.filter(()=> console.log(d3.event.type); return true; )
            .on("start", ()=> this.onDragStart(
                dragStartElement = this.findNodeByCell(),
                dragStartPoint = this.currMousePosAsC()
            ))
            .on("end",   ()=> this.onDragEnd(
                dragStartElement,
                dragStartPoint,
                this.currMousePosAsC()
            ))
            .on("drag",  ()=> this.onDragByNode(
                dragStartElement,
                dragStartPoint,
                this.currMousePosAsC()
            ))*/
        let lasttransform = null;
        var zoom = d3.zoom() // zoomevents: start, end, mulitiple, 
            //.scaleExtent([.51, 1.49])      
            .on("zoom", () => {
            console.assert(d3.event);
            /*
            const tid = d3.event.sourceEvent.touches[0].identifier || 'mouse'
            */
            if (d3.event &&
                d3.event.sourceEvent &&
                d3.event.sourceEvent.type === 'wheel') {
                const mΔ = d3.event.sourceEvent.deltaY;
                const λΔ = mΔ / 100 * 2 * Math.PI / 16;
                const oldλp = this.view.unitdisk.args.transformation.state.λ;
                const newλp = oldλp - λΔ;
                const min = .1 * Math.PI;
                const max = .8 * Math.PI * 2;
                //if (newλp.θ >= max) console.log('to big')
                //if (newλp.θ <= min) console.log('to small')
                if (newλp < max && newλp > min)
                    this.onDragλ(newλp);
            }
            //               
            else if (d3.event &&
                d3.event.sourceEvent &&
                d3.event.sourceEvent.type === 'touchmove') {
                // :D                    
                if (d3.event.transform.k !== lasttransform) {
                    lasttransform = d3.event.transform.k;
                    const newλp = d3.event.transform.k + .5;
                    //console.log('touch zoom', newλp.θ)
                    const min = .1 * Math.PI;
                    const max = .8 * Math.PI * 2;
                    //if (newλp.θ >= max) console.log('to big')
                    //if (newλp.θ <= min) console.log('to small')
                    if (newλp.θ < max && newλp.θ > min)
                        this.onDragλ(newλp);
                }
                else {
                    //console.log('touch drag')
                    this.onDragByNode(dragStartElement, dragStartPoint, this.currMousePosAsC());
                }
            }
            //
            else {
                this.onDragByNode(dragStartElement, dragStartPoint, this.currMousePosAsC());
            }
        })
            .on("start", () => {
            //console.log('start')
            this.onDragStart(dragStartElement = this.findNodeByCell(), dragStartPoint = this.currMousePosAsC());
        })
            .on("end", () => {
            //console.log('end')
            this.onDragEnd(dragStartElement, dragStartPoint, this.currMousePosAsC());
        });
        //var transform = d3.zoomTransform(selection.node());
        //var transform = d3.zoomTransform(this); in event sinks
        const htapi = this.view.hypertree.api;
        //const hoverpath = this.view.hypertree.args.objects.pathes.firstornull(e=> type==='HoverPath')[0]
        const hoverpath = this.view.hypertree.args.objects.pathes[0];
        this.view.parent.append('circle')
            .attr("class", "mouse-circle")
            .attr("r", this.args.mouseRadius)
            .on("dblclick", d => this.onDblClick(this.findNodeByCell()))
            //.on("click",     d=> this.onClick(findNodeByCell()))
            .on("mousemove", d => htapi.setPathHead(hoverpath, this.findNodeByCell()))
            .on("mouseout", d => htapi.setPathHead(hoverpath, undefined))
            //.call(drag)
            .call(zoom)
            .on("dblclick.zoom", null);
    }
    //-----------------------------------------------------------------------------------------
    ping(p) {
        /*
        if (this.view.hypertree.args.objects.traces.length === 0)
            this.view.hypertree.args.objects.traces.push({
                id: 'gibt eh nur ans',
                points: []
            })
        this.view.hypertree.args.objects.traces[0].points.push(p)
        */
    }
    animateTo(n, m) {
        if (this.animationTimer)
            return;
        this.onDragStart(n, m);
        var md = hyperbolic_math_1.CktoCp(m), initR = md.r, step = 1, steps = 20;
        this.animationTimer = d3.timer(() => {
            md.r = initR * (1 - hyperbolic_math_3.sigmoid(step++ / steps));
            if (step > steps) {
                this.cancelAnimationTimer();
                this.onDragEnd(n, m, hyperbolic_math_1.CptoCk(md));
            }
            else
                this.onDragByNode(n, m, hyperbolic_math_1.CptoCk(md));
        }, 1);
    }
}
exports.InteractionLayer = InteractionLayer;
