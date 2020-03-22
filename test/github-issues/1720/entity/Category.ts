import {AfterLoad, Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    loaded: boolean = false;

    @AfterLoad()
    printMessage() {
        this.loaded = true;
    }

}
