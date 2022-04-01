import { N } from '../n/n';
import { UnitDisk } from '../../components/unitdisk/unitdisk';
export declare const labeloffsets: {
    centerOffset: (cache: string) => (d: N, i: any, v: any) => {
        re: number;
        im: number;
    };
    nodeRadiusOffset: (ls: UnitDisk) => (d: N) => {
        re: number;
        im: number;
    };
    labeloffset: (ud: any) => (d: any, i: any, v: any) => {
        re: number;
        im: number;
    };
    outwards: any;
    outwardsPlusNodeRadius: any;
};
export declare const layerSrc: ((v: any, ud: UnitDisk) => any)[];
