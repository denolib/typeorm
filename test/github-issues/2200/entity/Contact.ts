import {Entity, PrimaryGeneratedColumn, OneToMany} from "../../../../src/index.ts";
import { Booking } from "./Booking.ts";

@Entity()
export class Contact {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Booking, booking => booking.contact)
    bookings: Booking[];
}
