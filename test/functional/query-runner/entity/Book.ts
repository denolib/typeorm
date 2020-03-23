import { PrimaryColumn } from "../../../../src/decorator/columns/PrimaryColumn.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Book {

    @PrimaryColumn({ type: String })
    ean!: string;

}

@Entity({ withoutRowid!: true })
export class Book2 {

    @PrimaryColumn({ type: String })
    ean!: string;

}

