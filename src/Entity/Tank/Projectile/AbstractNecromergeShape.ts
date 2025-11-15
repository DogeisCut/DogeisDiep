/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/

import Barrel from "../Barrel";
import Drone from "./Drone";

import { Color, PhysicsFlags, Tank } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitionsUtil";
import { AI } from "../../AI";
import { BarrelBase } from "../TankBody";
import LivingEntity from "../../Live";
import AbstractShape from "../../Shape/AbstractShape";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */
export default class AbstractNecromergeShape extends Drone {

    public static mergeResultShape = AbstractShape

    public static mergeResultShapeDrone = AbstractNecromergeShape
    
    public barrel: Barrel;

    public hasMerged: boolean = false

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        const bulletDefinition = barrel.definition.bullet;

        this.barrel = barrel
        
        this.ai = new AI(this);
        this.ai.viewRange = 900;

        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;

        this.minDamageMultiplier = 1;
        this.maxDamageMultiplier = 4;

        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.baseSpeed = 0;
    }

    public static fromShape(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shape: AbstractShape): AbstractNecromergeShape {
        const droneShape = new AbstractNecromergeShape(barrel, tank, tankDefinition, shape.positionData.values.angle);
        droneShape.physicsData.values.sides = shape.physicsData.values.sides;
        droneShape.physicsData.values.size = shape.physicsData.values.size;
        droneShape.positionData.values.x = shape.positionData.values.x;
        droneShape.positionData.values.y = shape.positionData.values.y;
        droneShape.positionData.values.angle = shape.positionData.values.angle;
        
        const shapeDamagePerTick: number = shape['damagePerTick'];

        droneShape.damagePerTick *= shapeDamagePerTick / 2;
        droneShape.healthData.values.maxHealth = (droneShape.healthData.values.health *= (shapeDamagePerTick / 2));
        return droneShape;
    }

    protected static handleNecromergeShape(type: typeof AbstractNecromergeShape, objA: LivingEntity, objB: LivingEntity) {
        if (objA instanceof type && objB instanceof type) {
            if (!objA.hasMerged && !objB.hasMerged) {
                const referenceShape = new type.mergeResultShape(objA.game)
                referenceShape.positionData.x = objA.positionData.values.x
                referenceShape.positionData.y = objA.positionData.values.y
                referenceShape.positionData.angle = objA.positionData.values.angle
                const result = type.mergeResultShapeDrone.fromShape(objA.barrel, objA.getTank(), objA.getTankDefinition(), referenceShape)
                result.positionData.x = objA.positionData.values.x
                result.positionData.y = objA.positionData.values.y
                result.positionData.angle = objA.positionData.values.angle
                referenceShape.destroy(false)
                objA.hasMerged = true
                objB.hasMerged = true
                objA.destroy(false)
                objB.destroy(false)
            }
        }
    }
}