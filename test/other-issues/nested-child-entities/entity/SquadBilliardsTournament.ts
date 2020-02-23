import {ChildEntity} from "../../../../src/index.ts";

import {BilliardsTournament} from "./BilliardsTournament.ts";

@ChildEntity()
export class SquadBilliardsTournament extends BilliardsTournament {
    constructor(squadBilliardsTournament?: {name: string}) {
        super(squadBilliardsTournament);
    }
}
