import {Entity} from "../../../../src/index.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {OneToMany} from "../../../../src/decorator/relations/OneToMany.ts";
import {Cat} from "./Cat.ts";

@Entity()
export class Dog {

    @PrimaryColumn({ type: String })
    DogID!: string;

    @OneToMany(type => Cat, cat => cat.dog)
    cats!: Cat[];

}
