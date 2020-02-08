import {DefaultNamingStrategy} from "../../../../src/naming-strategy/DefaultNamingStrategy.ts";
import {NamingStrategyInterface} from "../../../../src/naming-strategy/NamingStrategyInterface.ts";

export class SecondCustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

    tableName(className: string, customName: string): string {
        return customName ? customName.toLowerCase() : className.toLowerCase();
    }

}
