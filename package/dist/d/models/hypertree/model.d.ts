import { N } from '../n/n';
import { Path } from '../path/path';
import { Trace } from '../trace/trace';
import { LoaderFunction } from '../n/n-loaders';
import { LayoutFunction } from '../n/n-layouts';
import { UnitDiskArgs } from '../unitdisk/unitdisk-model';
import { Hypertree } from '../../components/hypertree/hypertree';
export interface HypertreeArgs {
    langmap?: {} | null;
    dataloader?: LoaderFunction;
    langloader?: (lang: any) => (ok: any) => void;
    dataInitBFS: (ht: Hypertree, n: N) => void;
    langInitBFS: (ht: Hypertree, n: N) => void;
    objects: {
        pathes: Path[];
        selections: N[];
        traces: Trace[];
    };
    layout: {
        type: LayoutFunction;
        weight: (n: N) => number;
        initSize: number;
        rootWedge: {
            orientation: number;
            angle: number;
        };
    };
    filter: {
        type: string;
        cullingRadius: number;
        weightFilter: {
            magic: number;
            weight: (n: any) => number;
            rangeCullingWeight: {
                min: number;
                max: number;
            };
            rangeNodes: {
                min: number;
                max: number;
            };
            alpha: number;
        };
        focusExtension: number;
        maxFocusRadius: number;
        wikiRadius: number;
        maxlabels: number;
    };
    geometry: UnitDiskArgs;
    interaction: {
        mouseRadius: number;
        onNodeSelect: (n: N) => void;
        onNodeHold: () => void;
        onNodeHover: () => void;
        onCenterNodeChange: (n: N, s: string) => void;
        λbounds: [number, number];
        wheelFactor: number;
    };
}
