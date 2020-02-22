import {Shim} from "../shim.ts";
import {Photo} from "./Photo.ts";

// NOTE: The relations in here make no sense, we just care for the types.
// In real applications, this would of course not work!

@Shim.Entity()
export class User {

    @Shim.PrimaryGeneratedColumn()
    id: number;

    @Shim.Column({ type: String })
    name: string;

    @Shim.Column({ type: Date })
    someDate: Date;

    @Shim.OneToOne(() => Photo)
    @Shim.JoinColumn()
    oneToOnePhoto: Photo;

    @Shim.OneToMany(() => Photo, (photo: Photo) => photo.user)
    oneToManyPhotos: Photo[];

    @Shim.ManyToOne(() => Photo)
    @Shim.JoinColumn()
    manyToOnePhoto: Photo;

    @Shim.ManyToMany(() => Photo)
    @Shim.JoinColumn()
    manyToManyPhotos: Photo[];

    @Shim.TreeParent()
    treeParentPhoto: Photo;

}
