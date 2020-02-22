import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity("bar", { schema: "foo" })
export class Bar {

    @PrimaryGeneratedColumn()
    id: string;

}
