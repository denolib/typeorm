import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {BeforeInsert} from "../../../../../src/decorator/listeners/BeforeInsert.ts";
import {BeforeUpdate} from "../../../../../src/decorator/listeners/BeforeUpdate.ts";

export class PostCounter {

    @Column({nullable: true, type: Number})
    likes: number;

    @BeforeInsert()
    beforeInsert() {
        this.likes = 0;
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.likes++;
    }

}
