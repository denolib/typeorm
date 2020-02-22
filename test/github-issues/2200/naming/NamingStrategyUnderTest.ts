import { DefaultNamingStrategy } from "../../../../src/naming-strategy/DefaultNamingStrategy.ts";
import { NamingStrategyInterface } from "../../../../src/naming-strategy/NamingStrategyInterface.ts";

export class NamingStrategyUnderTest extends DefaultNamingStrategy implements NamingStrategyInterface {
  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + "__" + propertyPath.replace(".", "_");
}}
