import {Entity, OneToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {UserToOrganizationEntity} from "./UserToOrganizationEntity.ts";

@Entity("organizations")
export class OrganizationEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @OneToMany(type => UserToOrganizationEntity, userToOrganization => userToOrganization.organization)
    users: UserToOrganizationEntity[];

}
