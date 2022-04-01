export declare class LayerStackMeta {
    private view;
    private model;
    private ui;
    constructor({ view, model }: {
        view: any;
        model: any;
    });
    update: {
        parent: () => void;
        data: () => void;
    };
    private updateParent;
}
export declare function LayerInfo_({ parent, onCheckChange, className }: {
    parent: any;
    onCheckChange: any;
    className: any;
}): any;
