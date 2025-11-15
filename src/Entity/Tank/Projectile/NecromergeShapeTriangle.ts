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
import AbstractNecromergeShape from "./AbstractNecromergeShape";
import Pentagon from "../../Shape/Pentagon";
import PentamancerPentagon from "./NecromergeShapePentagon";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */
export default class NecromergeShapeTriangle extends AbstractNecromergeShape {

    public static mergeResultShape = Pentagon

    public static mergeResultShapeDrone = PentamancerPentagon

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.physicsData.values.sides = 3;
        this.styleData.values.color = tank.relationsData.values.team?.teamData?.values.teamColor || Color.TeamRed
    }

    public static fromShape(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shape: AbstractShape): NecromergeShapeTriangle {
        const droneShape = new NecromergeShapeTriangle(barrel, tank, tankDefinition, shape.positionData.values.angle);
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

    public onCollide(entity1: LivingEntity, entity2: LivingEntity): void {
        super.onCollide(entity1, entity2)
        AbstractNecromergeShape.handleNecromergeShape(NecromergeShapeTriangle, entity1, entity2)
    }
}