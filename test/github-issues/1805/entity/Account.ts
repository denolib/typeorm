import {BaseEntity, Entity, PrimaryColumn} from "../../../../src/index.ts";

@Entity("accounts")
export class Account extends BaseEntity {

    @PrimaryColumn("bigint")
    id: string;

}
