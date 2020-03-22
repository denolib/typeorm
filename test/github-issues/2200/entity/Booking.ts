import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "../../../../src/index.ts";
import { Contact } from "./Contact.ts";

@Entity()
export class Booking {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(type => Contact, contact => contact.bookings, { eager!: true })
    @JoinColumn({
      name!: "contact_id",
    })
    contact!: Contact;
}
