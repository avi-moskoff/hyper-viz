export declare class NoHypertreeMeta {
    update: {
        parent: () => void;
        model: () => void;
        lang: () => void;
        layout: () => void;
        transformation: () => void;
    };
}
export declare class HypertreeMeta {
    private view;
    private model;
    private udView;
    private lsView;
    constructor({ view, model }: {
        view: any;
        model: any;
    });
    update: {
        parent: () => void;
        all: () => void;
        model: () => void;
        lang: () => void;
        layout: () => void;
        transformation: () => void;
    };
    private updateParent;
}
export declare class HypertreeMetaNav {
    private view;
    private model;
    private udView;
    private udNav;
    private lsView;
    private lsNav;
    private lsNavParam;
    constructor({ view, model }: {
        view: any;
        model: any;
    });
    update: {
        parent: () => void;
        model: () => void;
        lang: () => void;
        layout: () => void;
        transformation: () => void;
    };
    htmlCarUd: string;
    htmlCarLs: string;
    private updateParent;
}
