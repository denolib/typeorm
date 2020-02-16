import { Column, Entity, PrimaryColumn } from "../../../../../src/index.ts";

class FriendStats {
    @Column({ default: 0, type: Number })
    count: number;

    @Column({ default: 0, type: Number })
    sent: number;

    @Column({ default: 0 , type: Number})
    received: number;
}

@Entity()
export class UserWithEmbededEntity {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column(type => FriendStats)
    friend: FriendStats;
}
