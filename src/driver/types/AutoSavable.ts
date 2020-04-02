import {Driver} from "../Driver.ts";

export interface AutoSavableOptions {
    /**
     * Enables the autoSave mechanism which either saves to location
     * or calls autoSaveCallback every time a change to the database is made.
     */
    readonly autoSave?: boolean;

    /**
     * A function that gets called on every change instead of the internal autoSave function.
     * autoSave has to be enabled for this to work.
     */
    readonly autoSaveCallback?: Function;
}

export interface AutoSavableDriver extends Driver {
    options: Driver["options"] & AutoSavableOptions;
    autoSave(): Promise<void>;
    save(): Promise<void>;
}
