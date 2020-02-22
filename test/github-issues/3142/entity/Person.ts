import {BaseEntity} from "../../../../src/index.ts";
import {Column} from "../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Entity} from "../../../../src/index.ts";
import {Contact} from "./Contact.ts";

@Entity()
export class Person extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(_type => Contact)
    contact: Contact;

    // I added the unique: true just for the sake of the example
    @Column({ type: String, unique: true })
    status: string;
}
