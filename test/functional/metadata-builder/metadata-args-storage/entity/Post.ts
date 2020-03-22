import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ContentModule} from "./ContentModule.ts";

@Entity()
export class Post extends ContentModule {

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    text!: string;

}
