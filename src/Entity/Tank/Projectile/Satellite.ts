import { PhysicsFlags, StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitionsUtil";
import { Entity } from "../../../Native/Entity";
import Barrel from "../Barrel";
import { BarrelBase } from "../TankBody";
import Bullet from "./Bullet";

export default class Satellite extends Bullet {
    public orbitPerTick: number;
    public orbitDistance: number;
    public minOrbitPerTick: number;
    public maxOrbitPerTick: number;
    public minOrbitDistance: number;
    public maxOrbitDistance: number;
    public maxSiblings: number;
    public siblingIndex: number;
    constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, orbitPerTick: number = 0.1, minOrbitPerTick: number = 0.1, maxOrbitPerTick: number = 0.1, orbitDistance: number = 200, minOrbitDistance: number = 100, maxOrbitDistance: number = 400, maxSiblings: number = 0) {
        super(barrel, tank, tankDefinition, shootAngle);

        this.orbitPerTick = orbitPerTick
        this.orbitDistance = orbitDistance
        this.minOrbitPerTick = minOrbitPerTick
        this.maxOrbitPerTick = maxOrbitPerTick
        this.minOrbitDistance = minOrbitDistance
        this.maxOrbitDistance = maxOrbitDistance
        this.maxSiblings = maxSiblings

        if (!barrel.satelliteChildren) barrel.satelliteChildren = new Array(maxSiblings).fill(null)

       const siblingArray = barrel.satelliteChildren
        let foundIndex = -1

        for (let i = 0; i < siblingArray.length; i++) {
            if (siblingArray[i] === null) {
                foundIndex = i
                break
            }
        }

        if (foundIndex === -1) {
            foundIndex = siblingArray.length
            siblingArray.push(null)
        }

        this.siblingIndex = foundIndex
        siblingArray[foundIndex] = this
        
        this.physicsData.values.sides = 1//5
        this.styleData.values.flags |= StyleFlags.isStar

        if (barrel.definition.bullet.lifeLength !== -1) {
            this.lifeLength = 88 * barrel.definition.bullet.lifeLength;
        } else {
            this.lifeLength = Infinity;
        }

        this.velocity.x = 0
        this.velocity.y = 0
    }

    protected tickMixin(tick: number) {
        super.tick(tick);
    }

    public tick(tick: number): void {
        const centerEntity = this.tank.rootParent
        if (!centerEntity) return

        const baseAngle = (2 * Math.PI / Math.max(this.maxSiblings, 1)) * this.siblingIndex

        let orbitPerTick = this.orbitPerTick
        if (this.tank.inputs.attemptingShot()) orbitPerTick = this.maxOrbitPerTick
        if (this.tank.inputs.attemptingRepel()) orbitPerTick = this.minOrbitPerTick
        orbitPerTick *= this.barrelEntity.bulletAccel / 20
        
        this.physicsData.values.flags ^= PhysicsFlags.canEscapeArena;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;

        const orbitAngle = baseAngle + tick * orbitPerTick

        let orbitRadius = this.orbitDistance
        if (this.tank.inputs.attemptingShot()) orbitRadius = this.maxOrbitDistance
        if (this.tank.inputs.attemptingRepel()) orbitRadius = this.minOrbitDistance

        const targetX = centerEntity.positionData.x + Math.cos(orbitAngle) * orbitRadius * centerEntity.physicsData.size / 50
        const targetY = centerEntity.positionData.y + Math.sin(orbitAngle) * orbitRadius * centerEntity.physicsData.size / 50

        this.positionData.x = targetX
        this.positionData.y = targetY
        
        if (!Entity.exists(this.barrelEntity)) this.destroy();
        
        this.tickMixin(tick);
    }

    public destroy(animate=true) {
        if (!animate) this.barrelEntity.satelliteChildren[this.siblingIndex] = null

        super.destroy(animate);
    }
}