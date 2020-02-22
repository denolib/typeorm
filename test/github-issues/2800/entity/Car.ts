import {Engine, Vehicle} from "./Vehicle.ts";
import {ChildEntity, Column} from "../../../../src/index.ts";

export class CarEngine extends Engine {

    @Column({ type: Number })
    public horsePower: number;

    @Column({ type: Number })
    public torque: number;

}

@ChildEntity()
export class Car extends Vehicle {

    @Column(type => CarEngine, { prefix: "carEngine" })
    public engine: CarEngine;

}
