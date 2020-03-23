import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ValueTransformer} from "../../../../../src/decorator/options/ValueTransformer.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

class TagTransformer implements ValueTransformer {

    to (value: string[]): string {
        return value.join(", ");
    }

    from (value: string): string[] {
        return value.split(", ");
    }

}

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: String, transformer: new TagTransformer() })
    tags!: string[];

}
