import {Shim} from "../shim.ts";

@Shim.Entity()
export class Photo {

    @Shim.PrimaryGeneratedColumn()
    id!: number;

    @Shim.Column({ type: String })
    url!: string;

    user!: any;

}
