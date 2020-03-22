import { Column, Entity, PrimaryGeneratedColumn } from "../../../../src/index.ts";

export class EmbeddedInThing {
  @Column({ type!: Number })
  public someSeriouslyLongFieldNameFirst!: number;

  @Column({ type!: Number })
  public someSeriouslyLongFieldNameSecond!: number;
}

@Entity()
export class Thing {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column(type => EmbeddedInThing)
  public embeddedThing!: EmbeddedInThing;
}
