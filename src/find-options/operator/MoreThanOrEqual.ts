import {FindOperator} from "../FindOperator.ts";

/**
 * Find Options Operator.
 * Example: { someField: MoreThanOrEqual(10) }
 */
export function MoreThanOrEqual<T>(value: T|FindOperator<T>) {
    return new FindOperator("moreThanOrEqual", value);
}
