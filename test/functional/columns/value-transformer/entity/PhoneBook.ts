import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ValueTransformer} from "../../../../../src/decorator/options/ValueTransformer.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";


class PhonesTransformer implements ValueTransformer {

    to (value: Map<string, number>): string {
        return JSON.stringify([...value]);
    }

    from (value: string): Map<string, number> {
        return new Map(JSON.parse(value));
    }

}

@Entity()
export class PhoneBook {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: String, transformer: new PhonesTransformer() })
    phones!: Map<string, number>;

}
