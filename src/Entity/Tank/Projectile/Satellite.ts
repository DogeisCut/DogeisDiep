import { PhysicsFlags, PositionFlags, StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitionsUtil";
import { Entity } from "../../../Native/Entity";
import Barrel from "../Barrel";
import { BarrelBase } from "../TankBody";
import Bullet from "./Bullet";

const SATELLITE_TARGET_FOLLOW_SPEED = 0.5

export default class Satellite extends Bullet {
    public orbitPerTick: number;
    public orbitDistance: number;
    public minOrbitPerTick: number;
    public maxOrbitPerTick: number;
    public minOrbitDistance: number;
    public maxOrbitDistance: number;
    public maxSiblings: number;
    public orbitOffset: number;
    public extraRoom: number;
    public siblingIndex: number;
    constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, orbitPerTick: number = 0.1, minOrbitPerTick: number = 0.1, maxOrbitPerTick: number = 0.1, orbitDistance: number = 200, minOrbitDistance: number = 100, maxOrbitDistance: number = 400, maxSiblings: number = 0, orbitOffset: number = 0, extraRoom: number = 0) {
        super(barrel, tank, tankDefinition, shootAngle);

        this.styleData.zIndex = barrel.rootParent.styleData.zIndex * 2

        this.orbitPerTick = orbitPerTick
        this.orbitDistance = orbitDistance
        this.minOrbitPerTick = minOrbitPerTick
        this.maxOrbitPerTick = maxOrbitPerTick
        this.minOrbitDistance = minOrbitDistance
        this.maxOrbitDistance = maxOrbitDistance
        this.maxSiblings = maxSiblings
        this.extraRoom = extraRoom
        this.orbitOffset = orbitOffset

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
        
        this.physicsData.values.sides = 1

        this.physicsData.values.flags |= PhysicsFlags.canEscapeArena;
        this.positionData.values.flags |= PositionFlags.canMoveThroughWalls;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;

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

        const baseAngle = (2 * Math.PI / Math.max(this.maxSiblings + this.extraRoom, 1)) * this.siblingIndex

        let orbitPerTick = this.orbitPerTick
        if (this.tank.inputs.attemptingShot()) orbitPerTick = this.maxOrbitPerTick
        if (this.tank.inputs.attemptingRepel()) orbitPerTick = this.minOrbitPerTick
        orbitPerTick *= this.barrelEntity.bulletAccel / 20

        const orbitAngle = this.orbitOffset + baseAngle + tick * orbitPerTick

        let orbitRadius = this.orbitDistance
        if (this.tank.inputs.attemptingShot()) orbitRadius = this.maxOrbitDistance
        if (this.tank.inputs.attemptingRepel()) orbitRadius = this.minOrbitDistance

        const targetX = centerEntity.positionData.x + Math.cos(orbitAngle) * orbitRadius * centerEntity.physicsData.size / 50
        const targetY = centerEntity.positionData.y + Math.sin(orbitAngle) * orbitRadius * centerEntity.physicsData.size / 50

        const desiredVelocityX = (targetX - this.positionData.x) * SATELLITE_TARGET_FOLLOW_SPEED
        const desiredVelocityY = (targetY - this.positionData.y) * SATELLITE_TARGET_FOLLOW_SPEED

        this.velocity.x *= 0.75
        this.velocity.y *= 0.75

        this.velocity.x += desiredVelocityX
        this.velocity.y += desiredVelocityY

        
        if (!Entity.exists(this.barrelEntity)) this.destroy();
        
        this.tickMixin(tick);
    }

    public destroy(animate=true) {
        if (!animate) this.barrelEntity.satelliteChildren[this.siblingIndex] = null

        super.destroy(animate);
    }
}