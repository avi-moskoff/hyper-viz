import { N } from '../../models/n/n';
import { C } from '../../models/transformation/hyperbolic-math';
import { ILayer } from '../layerstack/layer';
import { ILayerView } from '../layerstack/layer';
import { ILayerArgs } from '../layerstack/layer';
import { D3UpdatePattern } from '../layerstack/d3updatePattern';
export declare type ArcCurvature = '+' | '0' | '-' | 'l';
export interface ArcLayerArgs extends ILayerArgs {
    data: () => any;
    name: string;
    className: string;
    curvature: ArcCurvature;
    nodePos: (n: N) => C;
    nodePosStr: (n: N) => string;
    classed: (s: any, w: any) => void;
    width: any;
    clip?: string;
}
export declare class ArcLayer implements ILayer {
    view: ILayerView;
    args: ArcLayerArgs;
    d3updatePattern: D3UpdatePattern;
    d3updatePattern2: D3UpdatePattern;
    name: string;
    constructor(view: ILayerView, args: ArcLayerArgs);
    update: {
        parent: () => void;
        data: () => void;
        transformation: () => void;
        style: () => void;
    };
    private attach;
    private arcOptions;
    private svgArc;
    private svgArcLine;
}
