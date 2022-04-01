import { HypertreeArgs } from '../../models/hypertree/model';
import { N } from '../../models/n/n';
import { Path } from '../../models/path/path';
import { IUnitDisk } from '../unitdisk/unitdisk';
import { Hypertree } from './hypertree';
import { HypertreeMeta } from '../meta/hypertree-meta/hypertree-meta';
export declare class HypertreeEx extends Hypertree {
    view_: {
        parent: HTMLElement;
        html?: HTMLElement;
        unitdisk?: IUnitDisk;
        path?: HTMLElement;
        pathesToolbar?: HTMLElement;
        mainToolbar?: HTMLElement;
        btnHome?: HTMLElement;
        btnMeta?: HTMLElement;
        btnNav?: HTMLElement;
        btnSize?: HTMLElement;
        btnQuery: HTMLElement;
        queryDiv: HTMLElement;
        inputQuery: HTMLInputElement;
        hypertreeMeta?: HypertreeMeta;
    };
    noHypertreeMeta: any;
    hypertreeMeta: HypertreeMeta;
    constructor(view: {
        parent: HTMLElement;
    }, args: HypertreeArgs);
    apiex: {
        toggleNav: () => void;
        toggleMeta: () => void;
    };
    requestAnimationFrameDummyDummy: (f: any) => any;
    update: {
        view: {
            parent: () => void;
            unitdisk: () => void;
            meta: () => void;
        };
        data: () => void;
        transformation: () => void;
        pathes: () => void;
        centernode: (centerNode: any) => void;
    };
    protected updateParent(): void;
    private updateMetaView;
    protected resetData(): void;
    protected addPath(pathType: string, n: N): Path;
    protected removePath(pathType: string, n: N): void;
}
