import { N } from './n';
export declare type LayoutFunction = (root: N, t?: number, noRecursion?: boolean) => void;
export declare function setZ(container: any, z: any): void;
export declare function layoutUnitVectors(root: any): any;
export declare function layoutUnitLines(root: N, λ: number, noRecursion?: boolean): N;
export declare function layoutSpiral(root: any): any;
export declare function layoutBuchheim(root: any): any;
export declare function layoutLamping(n: any, wedge?: {
    p: {
        re: number;
        im: number;
    };
    m: {
        re: number;
        im: number;
    };
    α: number;
}): any;
export declare function layoutBergé(n: N, λ: number, noRecursion?: boolean): void;
