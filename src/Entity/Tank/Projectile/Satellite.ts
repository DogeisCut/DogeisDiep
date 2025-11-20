import { StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitionsUtil";
import Barrel from "../Barrel";
import { BarrelBase } from "../TankBody";
import Bullet from "./Bullet";

export default class Satellite extends Bullet {
    constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, orbitPerTick: number, orbitDistance: number, minOrbitDistance: number, maxOrbitDistance: number, maxSiblings: number, siblingIndex: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        this.physicsData.values.sides = 5
        this.styleData.values.flags |= StyleFlags.isStar
    }
}