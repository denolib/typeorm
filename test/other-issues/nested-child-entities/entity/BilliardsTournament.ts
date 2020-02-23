import {ChildEntity} from "../../../../src/index.ts";

import {Tournament} from "./Tournament.ts";

@ChildEntity() // Causes Error of duplicated column in generated sql
export class BilliardsTournament extends Tournament {
    constructor(billiardsTournament?: {name: string}) {
        super(billiardsTournament);
    }
}
