import { ILayer } from '../layerstack/layer';
import { ILayerView } from '../layerstack/layer';
import { ILayerArgs } from '../layerstack/layer';
import { D3UpdatePattern } from '../layerstack/d3updatePattern';
export interface SymbolLayerArgs extends ILayerArgs {
    name: string;
    data: () => any;
    transform: any;
    clip?: string;
}
export declare class SymbolLayer implements ILayer {
    view: ILayerView;
    args: SymbolLayerArgs;
    d3updatePattern: D3UpdatePattern;
    name: string;
    update: {
        parent: () => void;
        data: () => void;
        transformation: () => any;
        style: () => any;
    };
    constructor(view: ILayerView, args: SymbolLayerArgs);
    private attach;
}
