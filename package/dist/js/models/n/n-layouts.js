"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3_hierarchy_1 = require("d3-hierarchy");
const hyperbolic_math_1 = require("../transformation/hyperbolic-math");
const hyperbolic_math_2 = require("../transformation/hyperbolic-math");
const hyperbolic_math_3 = require("../transformation/hyperbolic-math");
const hyperbolic_math_4 = require("../transformation/hyperbolic-math");
const hyperbolic_math_5 = require("../transformation/hyperbolic-math");
const hyperbolic_math_6 = require("../transformation/hyperbolic-math");
const hyperbolic_math_7 = require("../transformation/hyperbolic-math");
const π = Math.PI;
const unitVectors = [{ re: 1, im: 0 }, { re: 0, im: 1 }, { re: -1, im: 0 }, { re: 0, im: -1 }];
function setZ(container, z) {
    console.assert(z, "set Z to null!");
    if (!z)
        return;
    z = hyperbolic_math_7.maxR(z, .99999999);
    container.layout = container.layout || {};
    container.layout.z = z;
    container.layout.zStrCache = `${z.re} ${z.im}`;
    container.layout.zp = hyperbolic_math_2.CktoCp(z);
}
exports.setZ = setZ;
function layoutUnitVectors(root) {
    const some = [{ re: 0, im: 0 }].concat(unitVectors);
    let i = 0;
    hyperbolic_math_6.dfs(root, n => {
        const a = i % some.length;
        setZ(n, {
            re: some[a].re * .99,
            im: some[a].im * .99
        });
        i++;
    });
    return root;
}
exports.layoutUnitVectors = layoutUnitVectors;
function layoutUnitLines(root, λ, noRecursion = false) {
    //root.z = { re:0, im:0 }
    setZ(root, { re: 0, im: 0 });
    if (root.children)
        for (let i = 0; i < root.children.length; i++)
            layoutPath(root.children[i], unitVectors[i], root.children[i].height);
    function layoutPath(pathBegin, target, depth = 30) {
        let i = 0;
        const pa = 1 / depth;
        const rt = r => pa + r * (1 - pa);
        hyperbolic_math_6.dfs(pathBegin, n => {
            const r = i / depth;
            setZ(n, {
                re: rt(r) * target.re,
                im: rt(r) * target.im
            });
            i++;
        });
    }
    return root;
}
exports.layoutUnitLines = layoutUnitLines;
function layoutSpiral(root) {
    const flatNodes = hyperbolic_math_6.dfsFlat(root);
    const nrN = flatNodes.length;
    const nrRounds = Math.floor(nrN / 24);
    for (let i = 0; i < nrN; i++) {
        const a = i / nrN * 2 * Math.PI * (nrRounds + 1);
        const r = Math.pow(2, i / nrN) - 1;
        setZ(flatNodes[i], {
            re: r * Math.cos(a),
            im: r * Math.sin(a)
        });
    }
    return root;
}
exports.layoutSpiral = layoutSpiral;
function layoutBuchheim(root) {
    root = d3_hierarchy_1.tree().size([2 * Math.PI, 0.9])(root);
    hyperbolic_math_6.dfs(root, n => {
        const a = n.x - Math.PI / 2;
        setZ(n, {
            re: n.y * Math.cos(a),
            im: n.y * Math.sin(a)
        });
    });
    return root;
}
exports.layoutBuchheim = layoutBuchheim;
function layoutLamping(n, wedge = { p: { re: 0, im: 0 }, m: { re: 0, im: 1 }, α: Math.PI }) {
    console.log('--------------------------------------------------------', n.depth);
    console.log(wedge.p, wedge.m, wedge.α);
    setZ(n, wedge.p);
    if (n.children) {
        for (let i = 0; i < n.children.length; i++) {
            const cα = wedge.α / n.children.length * (i + 1);
            console.assert(isFinite(cα));
            console.log('cα', cα);
            const s = .1;
            const it = ((1 - s * s) * Math.sin(cα)) / (2 * s);
            console.log('it', it);
            const d = (Math.sqrt(Math.pow(it, 2) + 1) - it) * .5;
            console.assert(isFinite(d));
            console.log('d', d);
            const p1 = hyperbolic_math_1.makeT(wedge.p, hyperbolic_math_1.one);
            const np = hyperbolic_math_5.h2e(p1, hyperbolic_math_3.CmulR(wedge.m, d));
            console.log('np', np);
            const npp1 = hyperbolic_math_1.makeT(hyperbolic_math_3.Cneg(np), hyperbolic_math_1.one);
            const nd1 = hyperbolic_math_1.makeT({ re: -d, im: 0 }, hyperbolic_math_1.one);
            const nm = hyperbolic_math_5.h2e(npp1, hyperbolic_math_5.h2e(p1, wedge.m));
            console.log('nm', nm);
            const nα = hyperbolic_math_4.Clog(hyperbolic_math_5.h2e(nd1, hyperbolic_math_4.Cpow(cα))).im;
            console.assert(isFinite(nα));
            layoutLamping(n.children[i], { p: np, m: nm, α: nα });
        }
    }
    return n;
}
exports.layoutLamping = layoutLamping;
function wedgeTranslate(w, P) {
    const t = hyperbolic_math_1.makeT(P, hyperbolic_math_1.one);
    const pα = { re: Math.cos(w.α), im: Math.sin(w.α) };
    const pΩ = { re: Math.cos(w.Ω), im: Math.sin(w.Ω) };
    w.α = hyperbolic_math_2.CktoCp(hyperbolic_math_5.h2e(t, pα)).θ;
    w.Ω = hyperbolic_math_2.CktoCp(hyperbolic_math_5.h2e(t, pΩ)).θ;
}
function r2g(r) {
    return r / π * 360;
}
function layoutBergé(n, λ, noRecursion = false) {
    let count = 0;
    function layoutNode(n) {
        const wedge = { Ω: n.layout.wedge.Ω, α: n.layout.wedge.α };
        const L = n.layout.wedge.L;
        //if (L !== 1)
        //    console.log(L)
        if (n.parent) {
            const angleWidth = hyperbolic_math_6.πify(wedge.Ω - wedge.α);
            const bisectionAngle = wedge.α + (angleWidth / 2.0);
            let deflen = 1;
            if (!n.parent.parent)
                deflen = .5;
            const nz1 = hyperbolic_math_2.CptoCk({ θ: bisectionAngle, r: λ * (deflen + L || 1) });
            setZ(n, hyperbolic_math_5.h2e(hyperbolic_math_1.makeT(n.parent.layout.z, hyperbolic_math_1.one), nz1));
            wedgeTranslate(wedge, n.parent.layout.z);
            wedgeTranslate(wedge, hyperbolic_math_3.Cneg(n.layout.z));
        }
        let angleWidth = hyperbolic_math_6.πify(wedge.Ω - wedge.α);
        /*
        if (angleWidth > 2*π)
        {
            const anglediff = angleWidth - 2 * π
            wedge.α = πify(wedge.α + anglediff / 2.0)
            wedge.Ω = πify(wedge.Ω - anglediff / 2.0)
            angleWidth = 2 * π
            console.assert('angleWidth > 2*π')
        }*/
        let currentAngle = wedge.α;
        const cl = n.children || [];
        const cllen = cl.length;
        let linecount = 0;
        let liner = 0;
        let resetCount = 0;
        let anglesum = 0;
        //const parentWeight = n.precalc.layoutWeight
        const parentWeight = (n.children || []).reduce((a, ccn) => a + ccn.precalc.layoutWeight, 0);
        cl.forEach((cn, i) => {
            const nlen = (n.children || []).length;
            const cnlen = (cn.children || []).length;
            //const angleWeight = (Math.log10(n.value  || cllen || 1))
            //                  / (Math.log10(cn.value || 1))
            //const angleWeight = (cn.precalc.layoutWeight || 1) / ( n.precalc.layoutWeight || cllen || 1)            
            // verhältniss von parent weight zu child weight
            // sum(c=> c.eight) != parent weight
            // d.h. dieser wert liegt nicht zwischen 0 und 1
            // 
            // angleWeight wird aber zu alglesum addiert, 
            // angleWeights der children müssen in summe 1 ergeben
            // da angleWidth die ganze wegde ist
            const angleWeight = cn.precalc.layoutWeight / parentWeight;
            //const angleWeight = .99 / nlen
            anglesum += angleWeight;
            //const angleWeight = 1 / cllen
            const angleOffset = angleWidth * angleWeight;
            // current angle iterated through wegde borders (as hyperbolic angle)
            const α = currentAngle;
            currentAngle += angleOffset;
            const Ω = hyperbolic_math_6.πify(currentAngle);
            const cL = liner;
            const w = { α, Ω, L: cL };
            cn.layout = cn.layout || { wedge: w };
            cn.layout.wedge = w;
            linecount++;
            if (cn.height === 0)
                liner += .1;
            const rowcount = cllen / Math.log(cllen) / 2;
            if (linecount >= rowcount) {
                linecount = 0;
                liner = 0;
                resetCount++;
            }
        });
        //console.log(anglesum)
        if (!noRecursion)
            for (let cn of n.children || [])
                layoutNode(cn);
        count++;
    }
    layoutNode(n);
    //console.log('layouted nodes ', count, λ)
}
exports.layoutBergé = layoutBergé;
/*
    let currentAngle = wedge.α
    const cl = n.children || []
    const cllen = cl.length
    let linecount = 0
    let liner = 0
    let resetCount = 0
    cl.forEach((cn,i)=>
    {
        const cnlen = (cn.children || []).length
        const angleWeight = (cn.value||1) / (n.value||cllen||1)
        //const angleWeight = 1 / cllen
        const angleOffset = angleWidth * angleWeight
        const α  = currentAngle
        currentAngle += angleOffset
        const Ω  = πify(currentAngle)
        
        const cL = liner
        const w = { α, Ω, L:cL }
        cn.layout = cn.layout || { wedge:w }
        cn.layout.wedge = w

        linecount++
        if (cn.height === 0)
            liner += .1

        const rowcount = cllen / Math.log(cllen) / 2
    
        if (linecount >= rowcount)
        {
            linecount = 0
            liner = 0
            resetCount++
        }
    })
*/
