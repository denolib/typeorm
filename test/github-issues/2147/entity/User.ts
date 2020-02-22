
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "../../../../src/index.ts";

@Entity()
@Unique(["clientId", "key"])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: Number })
    public key: number;

    @Column({type: Number, name: "client_id"})
    public clientId: number;

    @Column({type: Number})
    public name: string;

    @Column({ type: Number, name: "updated_by"})
    public updatedById: number;

    @ManyToOne(type => User)
    @JoinColumn([{name: "client_id", referencedColumnName: "clientId"}, { name: "updated_by", referencedColumnName: "key"}])
    public updatedBy: Promise<User>;

}
