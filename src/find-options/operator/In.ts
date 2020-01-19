import {FindOperator} from "../FindOperator.ts";

/**
 * Find Options Operator.
 * Example: { someField: In([...]) }
 */
export function In<T>(value: T[]|FindOperator<T>) {
    return new FindOperator("in", value as any, true, true);
}
