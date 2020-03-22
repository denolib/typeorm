import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {BeforeInsert} from "../../../../../src/decorator/listeners/BeforeInsert.ts";
import {BeforeUpdate} from "../../../../../src/decorator/listeners/BeforeUpdate.ts";
import {Index} from "../../../../../src/decorator/Index.ts";

@Index(["likes", "favorites"])
export class PostCounter {

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    favorites!: number;

    @Column({ type: Number })
    comments!: number;

    @BeforeInsert()
    beforeInsert() {
        this.likes = 0;
        this.favorites = 0;
        this.comments = 0;
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.likes++;
        this.favorites++;
        this.comments++;
    }

}
