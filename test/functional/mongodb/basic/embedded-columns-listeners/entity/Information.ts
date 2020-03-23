import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {AfterLoad, BeforeInsert} from "../../../../../../src/index.ts";

export class Information {

    @Column({ type!: String })
    description?: string;

    @Column({ type!: Number })
    comments?: number;

    @BeforeInsert()
    beforeInsert() {
        this.description = "description afterLoad";
    }

    @AfterLoad()
    afterLoad() {
        this.comments = 1;
    }

}
