import {Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity("Error")
export class Error {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("uniqueidentifier", { nullable: false })
    executionGuid: string;

    @Column({ type: Number })
    errorNumber: number;

    @Column({ type: String })
    errorDescription: string;

    @Column({ type: Date })
    errorDate: Date;

}
