import {BaseEntity, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "../../../../src/index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    type!: string;

    @Column({ type: String, nullable: true })
    token!: string;

    @Column("simple-json", { default: "{}" })
    values!: Object;

    // TODO(uki00a) This is commented out because deno-sqlite doesn't currently support `datetime('now')`.
    //@CreateDateColumn()
    //createdAt: Date;

    //@UpdateDateColumn()
    //updatedAt: Date;

}
