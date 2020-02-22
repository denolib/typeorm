import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Dummy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String, nullable: true, default: () => "NOW()" })
    UploadDate: string;
}

