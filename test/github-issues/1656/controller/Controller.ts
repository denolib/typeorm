import {Repository, Transaction, TransactionRepository} from "../../../../src/index.ts";
import {A} from "../entity/A.ts";
import {B} from "../entity/B.ts";
import {C} from "../entity/C.ts";

export class Controller {

    @Transaction("mysql")
    async t(a: A, b: B, c: C,
            /*@TransactionRepository(A)*/ aRepository?: Repository<A>,
            /*@TransactionRepository(B)*/ bRepository?: Repository<B>,
            /*@TransactionRepository(C)*/ cRepository?: Repository<C>) {
        if (aRepository && bRepository && cRepository) {
            return [aRepository.metadata.tableName, bRepository.metadata.tableName, cRepository.metadata.tableName];
        }
        throw new Error();
    }
}
