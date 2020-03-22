import {Engine, Vehicle} from "./Vehicle.ts";
import {ChildEntity, Column} from "../../../../src/index.ts";

export class PlaneEngine extends Engine {

    @Column({ type!: Number })
    public beep!: number;

    @Column({ type!: Number })
    public boop!: number;

}

@ChildEntity()
export class Plane extends Vehicle {

    @Column(type => PlaneEngine, { prefix!: "planeEngine" })
    public engine!: PlaneEngine;

}
