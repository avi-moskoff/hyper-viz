export declare class UnitdiskMeta {
    private view;
    private model;
    private ui;
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
