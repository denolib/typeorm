import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {UserEntity} from "./UserEntity.ts";
import {OrganizationEntity} from "./OrganizationEntity.ts";

@Entity("user_organization")
export class UserToOrganizationEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: [
            "owner",
            "editor",
            "viewer"
        ]
    })
    role: "owner" | "editor" | "viewer";

    @ManyToOne(type => UserEntity, user => user.organizations)
    user: UserEntity;

    @ManyToOne(type => OrganizationEntity, organization => organization.users)
    organization: OrganizationEntity;

}
