import {FindOperator} from "../FindOperator.ts";

/**
 * Find Options Operator.
 * Example: { someField: IsNull() }
 */
export function IsNull() {
    return new FindOperator("isNull", undefined as any, false);
}
