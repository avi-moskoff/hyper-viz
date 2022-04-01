import { ILayer } from '../layerstack/layer';
import { ILayerView } from '../layerstack/layer';
import { ILayerArgs } from '../layerstack/layer';
import { D3UpdatePattern } from '../layerstack/d3updatePattern';
export interface ImageLayerArgs extends ILayerArgs {
    name: string;
    width: number;
    height: number;
    data: () => any;
    imagehref: any;
    delta: any;
    transform: any;
}
export declare class ImageLayer implements ILayer {
    view: ILayerView;
    args: ImageLayerArgs;
    d3updatePattern: D3UpdatePattern;
    name: string;
    update: {
        parent: () => void;
        data: () => void;
        transformation: () => any;
        style: () => any;
    };
    constructor(view: ILayerView, args: ImageLayerArgs);
    private attach;
}
