import {FindOperator} from "../FindOperator";

/**
 * Switch Helper Operator.
 */
export function Switch<T>(condition: number, cases: { [key: number]: T|FindOperator<T> } & { _?: T|FindOperator<T> }): T|FindOperator<T>|undefined;

/**
 * Switch Helper Operator.
 */
export function Switch<T>(condition: string, cases: { [key: string]: T|FindOperator<T> } & { _?: T|FindOperator<T> }): T|FindOperator<T>|undefined;

/**
 * Switch Helper Operator.
 */
export function Switch<T>(condition: string|number, cases: { [key: string]: T|FindOperator<T> } & { _?: T|FindOperator<T> }): T|FindOperator<T>|undefined {

    let hasMatch = false, result: T|FindOperator<T>|undefined = undefined;
    Object.keys(cases).forEach(key => {
        if (condition === key) {
            hasMatch = true;
            result = (cases as any)[key];
        }
    });
    if (!hasMatch && cases._ !== undefined)
        result = cases._;

    return result;
}