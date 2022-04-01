import { N } from '../n/n';
import { T } from './hyperbolic-math';
import { C } from './hyperbolic-math';
import { Ck } from './hyperbolic-math';
export interface Transformation<OT> {
    state: T;
    isMoving: () => boolean;
    cache: TransformationCache;
    transformPoint: (n: C) => C;
    transformDist: (p: C) => number;
    onDragStart: (m: C) => void;
    onDragEnd: (m: C) => void;
    onDragP: (s: C, e: C) => void;
    onDragθ: (s: C, e: C) => void;
    onDragλ: (l: number) => void;
    maxMouseR: number;
}
export declare class HyperbolicTransformation implements Transformation<N> {
    cache: TransformationCache;
    state: T;
    dST: T;
    maxMouseR: number;
    constructor(tp: T);
    transformPoint: (p: Ck) => Ck;
    transformDist: (p: Ck) => number;
    onDragStart: (m: Ck) => any;
    onDragEnd: (m: Ck) => any;
    isMoving: () => boolean;
    onDragP: (s: Ck, e: Ck) => void;
    onDragθ: (s: Ck, e: Ck) => void;
    onDragλ: (l: number) => number;
}
export declare class PanTransformation implements Transformation<N> {
    cache: TransformationCache;
    state: T;
    dST: T;
    maxMouseR: number;
    constructor(tp: T);
    transformPoint: (p: Ck) => {
        re: number;
        im: number;
    };
    transformDist: (p: Ck) => number;
    onDragStart: (m: Ck) => any;
    onDragEnd: (m: Ck) => any;
    isMoving: () => boolean;
    onDragP: (s: Ck, e: Ck) => Ck;
    onDragθ: (s: Ck, e: Ck) => Ck;
    onDragλ: (l: number) => number;
}
export declare class NegTransformation implements Transformation<N> {
    cache: TransformationCache;
    state: T;
    decorated: Transformation<N>;
    maxMouseR: number;
    constructor(d: Transformation<N>);
    transformPoint: (p: Ck) => Ck;
    transformDist: (p: Ck) => number;
    onDragStart: (m: Ck) => void;
    onDragEnd: (m: Ck) => void;
    isMoving: () => boolean;
    onDragP: (s: Ck, e: Ck) => void;
    onDragθ: (s: Ck, e: Ck) => void;
    onDragλ: (l: number) => void;
}
export declare class TransformationCache {
    N: number;
    focusR: number;
    centerNode: N;
    unculledNodes: N[];
    links: N[];
    leafOrLazy: N[];
    spezialNodes: N[];
    paths: N[];
    weights: N[];
    labels: N[];
    emojis: N[];
    images: N[];
    voronoiDiagram: d3.VoronoiDiagram<N>;
    cells: d3.VoronoiPolygon<N>[];
}
