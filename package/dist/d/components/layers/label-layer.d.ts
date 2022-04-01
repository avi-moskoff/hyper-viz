import { ILayer } from '../layerstack/layer';
import { ILayerView } from '../layerstack/layer';
import { ILayerArgs } from '../layerstack/layer';
import { D3UpdatePattern } from '../layerstack/d3updatePattern';
export interface LabelLayerArgs extends ILayerArgs {
    name: string;
    className: string;
    invisible?: boolean;
    hideOnDrag?: boolean;
    data: () => any;
    delta: any;
    transform: any;
    text: any;
    clip?: string;
}
export declare class LabelLayer implements ILayer {
    view: ILayerView;
    args: LabelLayerArgs;
    d3updatePattern: D3UpdatePattern;
    d3updatePattern2: D3UpdatePattern;
    name: string;
    simulation: any;
    update: {
        parent: () => void;
        data: () => void;
        transformation: () => void;
        style: () => void;
    };
    constructor(view: ILayerView, args: LabelLayerArgs);
    private attach;
}
export declare var bboxCenter: (d: any, cacheId?: string) => {
    re: number;
    im: number;
};
export declare var bboxOval: (d: any, cacheId?: string, θn?: any) => {
    re: number;
    im: number;
};
