import { BaseEntity, Column, PrimaryGeneratedColumn } from "../../../../src/index.ts";

import { Entity } from "../../../../src/decorator/entity/Entity.ts";

import {DocumentEnum} from "../documentEnum.ts";
import {getEnumValues} from "../enumTools.ts";

@Entity()
export class Bar extends BaseEntity {
  @PrimaryGeneratedColumn() barId: number;

  @Column({
    type: "enum",
    enum: getEnumValues(DocumentEnum),
    array: true,
  })
  documents: DocumentEnum[];
}
