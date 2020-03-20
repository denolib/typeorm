import {getMetadataArgsStorage} from "../../index.ts";
import {TransactionRepositoryMetadataArgs} from "../../metadata-args/TransactionRepositoryMetadataArgs.ts";
import {CannotReflectMethodParameterTypeError} from "../../error/CannotReflectMethodParameterTypeError.ts";

/**
 * Injects transaction's repository into the method wrapped with @Transaction decorator.
 */
export function TransactionRepository(entityType?: Function): ParameterDecorator {
    return (object: Object, methodName: string | symbol, index: number) => {

         throw new CannotReflectMethodParameterTypeError(object.constructor, methodName as string);
    };
}
