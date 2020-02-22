import {Entity, OneToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {UserToOrganizationEntity} from "./UserToOrganizationEntity.ts";

@Entity("user")
export class UserEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @OneToMany(type => UserToOrganizationEntity, userToOrganization => userToOrganization.user)
    organizations: UserToOrganizationEntity[];

}
