import {Entity} from "../../../../src/index.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Dog} from "./Dog.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

@Entity()
export class Cat {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // dogDogID: string; // Need to do this to allow the Foreign Key to work

    @ManyToOne(type => Dog, dog => dog.cats)
    dog: Dog;

}
