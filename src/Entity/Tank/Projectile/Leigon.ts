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

import { InputFlags, PhysicsFlags } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitionsUtil";
import { AIState, Inputs } from "../../AI";
import { BarrelBase } from "../TankBody";
import { CameraEntity } from "../../../Native/Camera";

/**
 * Barrel definition for the factory leigon's barrel.
 */
const leigonBarrelDefinition: BarrelDefinition = {
    "angle": Math.PI,
    "offset": 0,
    "size": 75,
    "width": 50,
    "delay": 0,
    "reload": 1.2,
    "recoil": 1,
    "isTrapezoid": true,
    "trapezoidDirection": 3.141592653589793,
    "addon": null,
    "droneCount": 4294967295,
    "canControlDrones": true,
    "bullet": {
        "type": "swarm",
        "sizeRatio": 0.7,
        "health": 0.4,
        "damage": 0.15,
        "speed": 1,
        "scatterRate": 1,
        "lifeLength": 1,
        "absorbtionFactor": 1
    }
};

/**
 * The drone class represents the leigon (projectile) entity in diep.
 */
export default class Leigon extends Drone implements BarrelBase {
    /** The leigon's barrel */
    private leigonBarrel: Barrel;
    /** The camera entity (used as team) of the leigon. */
    public cameraEntity: CameraEntity;
    /** The reload time of the leigon's barrel. */
    public reloadTime = 1;
    /** The inputs for when to shoot or not. */
    public inputs = new Inputs();

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        this.cameraEntity = tank.cameraEntity;

        this.leigonBarrel = new Barrel(this, leigonBarrelDefinition);
    }

    public get sizeFactor() {
        return this.physicsData.values.size / 50;
    }

    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
        this.reloadTime = this.tank.reloadTime;

        const usingAI = !this.canControlDrones || !this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel();

        if (usingAI && this.ai.state === AIState.idle) {
        } else {
            this.inputs.flags |= InputFlags.leftclick;
        }

        super.tickMixin(tick);
    }
}
