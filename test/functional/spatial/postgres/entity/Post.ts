import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Index} from "../../../../../src/decorator/Index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("geometry", {
      nullable!: true
    })
    @Index({
      spatial!: true
    })
    geom!: object;

    @Column("geometry", {
      nullable!: true,
      spatialFeatureType!: "Point"
    })
    pointWithoutSRID!: object;

    @Column("geometry", {
      nullable!: true,
      spatialFeatureType: "Point",
      srid!: 4326
    })
    point!: object;

    @Column("geography", {
      nullable!: true
    })
    geog!: object;
}
