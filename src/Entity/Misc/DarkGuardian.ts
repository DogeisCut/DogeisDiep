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

import { ClientBound, Color, NameFlags, Tank } from "../../Const/Enums";
import TankBody from "../Tank/TankBody";
import { CameraEntity } from "../../Native/Camera";
import { AI, AIState, Inputs } from "../AI";
import LivingEntity from "../Live";

const DARK_GUARDIAN_SIZE = 400

export default class DarkGuardian extends TankBody {
    public movementSpeed = 0.3;

    public ai: AI;

    public constructor(game: GameServer) {
        const inputs = new Inputs();
        const camera = new CameraEntity(game);

        camera.setLevel(400);
        camera.sizeFactor = (DARK_GUARDIAN_SIZE / 50);

        super(game, camera, inputs);
        
        this.setTank(Tank.DarkGuardian)
        const def = (this.definition = Object.assign({}, this.definition));

        this.nameData.values.name = "Dark Guardian";
        this.styleData.values.color = Color.Neutral;
        this.relationsData.values.team = this.game.arena;
        
        this.ai = new AI(this);
        this.ai.inputs = inputs;
        this.ai.viewRange = Infinity;
        this.ai.aimSpeed = this.barrels[0].bulletAccel;
        this.ai.targetFilterShapes = true
        
        camera.cameraData.values.player = this;
        
        this.makeShiny(0, false)

        this.scoreReward = 500_000_000
    }

    public onDeath(killer: LivingEntity) {
        let killerName: string;

        if ((killer.nameData && killer.nameData.values.name && !(killer.nameData.values.flags & NameFlags.hiddenName))) {
            killerName = killer.nameData.values.name;
        } else {
            killerName = "an unnamed tank";
        }

        this.game.broadcast()
            .u8(ClientBound.Notification)
            .stringNT(`The ${this.nameData.values.name} has been temporarily banished by ${killerName}!`)
            .u32(0x000000)
            .float(10000)
            .stringNT("").send();
    }

    public tick(tick: number) {
        this.inputs = this.ai.inputs;

        this.relationsData.values.team = this.game.arena //bandaid fix, dont know why the team isnt being set

        if (this.ai.state === AIState.idle) {
            const angle = this.positionData.values.angle + this.ai.passiveRotation;
            const mag = Math.sqrt((this.inputs.mouse.x - this.positionData.values.x) ** 2 + (this.inputs.mouse.y - this.positionData.values.y) ** 2);
            this.inputs.mouse.set({
                x: this.positionData.values.x + Math.cos(angle) * mag,
                y: this.positionData.values.y + Math.sin(angle) * mag
            });
        }

        super.tick(tick);

        this.ai.movementSpeed = this.cameraEntity.cameraData.movementSpeed = this.movementSpeed;
    }

    //public readonly isShapeEntity: boolean = true
}
