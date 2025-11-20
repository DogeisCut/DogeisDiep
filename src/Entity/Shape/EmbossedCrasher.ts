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

import GameServer from "../../Game";
import LivingEntity from "../Live";
import AbstractShape from "./AbstractShape";

import { Color, PositionFlags } from "../../Const/Enums";
import { AI, AIState, Inputs } from "../AI";
import { shinyRarity, tps } from "../../config";
import AutoTurret from "../Tank/AutoTurret";
import { BarrelBase } from "../Tank/TankBody";
import { CameraEntity } from "../../Native/Camera";
import { GuardObject } from "../Tank/Addons";

/**
 * Crasher entity class.
 */
export default class EmbossedCrasher extends AbstractShape implements BarrelBase {
    /** Controls the artificial intelligence of the crasher */
    public ai: AI;

    /** The max speed the crasher can move when targetting a player.s */
    private targettingSpeed: number;

    public reloadTime = 7;

    public constructor(game: GameServer) {
        super(game);

        this.nameData.values.name = "Embossed Crasher";

        this.positionData.values.flags |= PositionFlags.canMoveThroughWalls;
        this.healthData.values.health = this.healthData.values.maxHealth = 75 / 2;
        this.physicsData.values.size = 45 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.physicsData.values.absorbtionFactor = 0.25;
        this.physicsData.values.pushFactor = 20;

        this.styleData.values.color = Color.Neutral;
        this.damagePerTick = 1.4;
        this.targettingSpeed = 2.4;

        this.ai = new AI(this);
        this.ai.viewRange = 2000;
        this.ai.aimSpeed = (this.ai.movementSpeed = this.targettingSpeed);
        this.ai['_findTargetInterval'] = tps;
        this.inputs = this.ai.inputs;

        const turret = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 55,
            width: 42 * 0.7,
            delay: 0.01,
            reload: 1,
            recoil: 0.3,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 3,
                damage: 0.4,
                speed: 1.8,
                scatterRate: 1,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 1
            }
        }, 25)

        const guard = new GuardObject(this.game, this, 3, 2.4, 0, 0)
        guard.positionData.flags &= ~PositionFlags.absoluteRotation

        this.makeShiny(0, false)

        this.scoreReward = 9_000;
    }

    public get sizeFactor() {
        return this.physicsData.values.size / 50;
    }

    public inputs: Inputs;

    public cameraEntity: CameraEntity = this as unknown as CameraEntity;

    tick(tick: number) {
        this.ai.aimSpeed = 0;
        this.ai.movementSpeed = this.targettingSpeed;
        
        if (this.ai.state === AIState.idle) {
            this.doIdleRotate = true;
        } else {
            this.doIdleRotate = false;
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - this.positionData.values.y, this.ai.inputs.mouse.x - this.positionData.values.x);
            this.velocity.add({
                x: this.ai.inputs.movement.x * this.targettingSpeed,
                y: this.ai.inputs.movement.y * this.targettingSpeed
            });
        }

        this.ai.inputs.movement.set({
            x: 0,
            y: 0
        })

        super.tick(tick);
    }
}
