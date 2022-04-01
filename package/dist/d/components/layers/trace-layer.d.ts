import { ILayer } from '../layerstack/layer';
import { ILayerView } from '../layerstack/layer';
import { ILayerArgs } from '../layerstack/layer';
import { D3UpdatePattern } from '../layerstack/d3updatePattern';
export interface TraceLayerArgs extends ILayerArgs {
    name: string;
    data: () => any;
    clip?: string;
}
export declare class TraceLayer implements ILayer {
    view: ILayerView;
    args: TraceLayerArgs;
    d3updatePattern: D3UpdatePattern;
    name: string;
    update: {
        parent: () => void;
        data: () => void;
        transformation: () => any;
        style: () => any;
    };
    constructor(view: ILayerView, args: TraceLayerArgs);
    private attach;
}
