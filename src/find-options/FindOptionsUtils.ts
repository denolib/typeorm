import {FindManyOptions, FindOptions} from "./FindOptions";

/**
 * Utilities to work with FindOptions.
 */
export class FindOptionsUtils {

    /**
     * Checks if given object is really instance of FindOneOptions interface.
     */
    static isFindOneOptions(obj: any): obj is FindOptions<any> {
        const possibleOptions: FindOptions<any> = obj;
        return possibleOptions && (
            possibleOptions.select instanceof Object ||
            possibleOptions.where instanceof Object ||
            possibleOptions.relations instanceof Object ||
            possibleOptions.order instanceof Object ||
            possibleOptions.options instanceof Object ||
            possibleOptions.cache instanceof Object ||
            typeof possibleOptions.cache === "boolean" ||
            typeof possibleOptions.cache === "number"
        );
    }

    /**
     * Checks if given object is really instance of FindManyOptions interface.
     */
    static isFindManyOptions(obj: any): obj is FindManyOptions<any> {
        const possibleOptions: FindManyOptions<any> = obj;
        return possibleOptions && (
            this.isFindOneOptions(possibleOptions) ||
            typeof (possibleOptions as FindManyOptions<any>).skip === "number" ||
            typeof (possibleOptions as FindManyOptions<any>).take === "number" ||
            typeof (possibleOptions as FindManyOptions<any>).skip === "string" ||
            typeof (possibleOptions as FindManyOptions<any>).take === "string"
        );
    }

}
