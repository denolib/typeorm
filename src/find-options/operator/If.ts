import {FindOperator} from "../FindOperator";

/**
 * If Helper Operator.
 */
export function If<T>(condition: boolean, value1: T|FindOperator<T>, value2?: T|FindOperator<T>): FindOperator<T|FindOperator<T>>|undefined {
    if (condition === true) {
        if (value1 instanceof FindOperator)
            return value1;

        return new FindOperator("equal", value1);
    } else {
        if (value2 instanceof FindOperator)
            return value2;
        if (value2 === undefined)
            return undefined;

        return new FindOperator("equal", value2);
    }
}