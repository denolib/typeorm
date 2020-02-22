import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { Column } from "../../../../src/decorator/columns/Column.ts";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

export class PersonalInfo {
    @Column({ type: String })
    firstName: string;

    @Column({ type: String })
    lastName: string;

    @Column({ type: String })
    address: string;
}

export class UserInfo extends PersonalInfo {
    @Column({ type: String })
    userName: string;
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column(type => UserInfo)
    info: UserInfo;

}
