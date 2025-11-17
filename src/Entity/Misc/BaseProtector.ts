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

import ObjectEntity from "../Object";
import Barrel from "../Tank/Barrel";
import TeamBase from "./TeamBase";

import TankBody, { BarrelBase } from "../Tank/TankBody";
import { Color, StyleFlags, PhysicsFlags, InputFlags, Tank, NameFlags } from "../../Const/Enums";
import { BarrelDefinition } from "../../Const/TankDefinitionsUtil";
import { AI, Inputs } from "../AI";
import { CameraEntity } from "../../Native/Camera";
import GameServer from "../../Game";

/**
 * Base drone stats.
 */
const DroneSpawnerDefinition = (count: number): BarrelDefinition => ({
    angle: 0,
    offset: 0,
    size: 95 / 5,
    width: 42 / 5,
    delay: 0,
    reload: 0,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: count,
    canControlDrones: true,
    bullet: {
        type: "baseDrone",
        sizeRatio: 1,
        health: 1000,
        damage: 1,
        speed: 2.7,
        scatterRate: 1,
        lifeLength: -1,
        absorbtionFactor: 1
    }
});

/**
 * Represents all base drones in game.
 */
export default class BaseProtector extends TankBody {
    /** Base reload value for internal calculations. */
    public reloadTime = 15;

    /** The AI that controls how the AC moves. */
    public ai: AI;

    public constructor(game: GameServer, base?: TeamBase) {
        const inputs = new Inputs();
        const camera = new CameraEntity(game);

        camera.setLevel(120);
        camera.sizeFactor = 5

        super(game, camera, inputs);

        this.styleData.values.color = base ? base.styleData.values.color : Color.Neutral;
        this.styleData.flags |= StyleFlags.renderFirst

        this.setTank(Tank.BaseProtector);
        const def = (this.definition = Object.assign({}, this.definition));
        def.speed = camera.cameraData.values.movementSpeed = 0;

        this.physicsData.values.absorbtionFactor = 0;
        this.physicsData.values.flags |= PhysicsFlags.isBase;

        this.ai = new AI(this);
        this.ai.inputs = inputs;
        this.ai.movementSpeed = 0;
        this.ai.targetFilterShapes = true
        this.ai.doAimPrediction = false;

        if (base) {
            this.positionData.values.x = base.positionData.values.x;
            this.positionData.values.y = base.positionData.values.y;

            this.relationsData.values.owner = base;
            this.relationsData.values.team = base.relationsData.values.team;
        }

        this.nameData.values.name = "Base Protector";
        this.nameData.flags |= NameFlags.hiddenName

        this.scoreReward = Infinity; // funny
        camera.cameraData.values.player = this;

        this.setInvulnerability(true);
    }
}
