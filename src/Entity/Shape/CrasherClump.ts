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
import AbstractShape from "./AbstractShape";

import { Color, StyleFlags } from "../../Const/Enums";
import { shinyRarity } from "../../config";
import LivingEntity from "../Live";
import Crasher from "./Crasher";
import ObjectEntity from "../Object";

export default class CrasherClump extends AbstractShape {
    public constructor(game: GameServer, isShiny=Math.random() < shinyRarity) {
        super(game);
        this.nameData.values.name = "Crasher Clump";
        this.healthData.values.health = this.healthData.values.maxHealth = 180;
        this.physicsData.values.size = 55 * Math.sqrt(3) * Math.SQRT1_2;
        this.physicsData.values.sides = 6;
        this.styleData.values.color = Color.EnemyCrasher;

        this.damagePerTick = 2;
        this.scoreReward = 1000;

        if (isShiny) {
            this.makeRadiant(0)
        }

        const createTriangle = (x: number, y: number, angle: number) => {
            const triangle = new ObjectEntity(this.game)

            triangle.setParent(this)
            triangle.styleData.flags |= StyleFlags.showsAboveParent
            triangle.positionData.x = x
            triangle.positionData.y = y
            triangle.positionData.angle = angle
            triangle.styleData.color = this.styleData.color
            triangle.physicsData.sides = 3
            triangle.physicsData.size = 55 * Math.SQRT1_2;
            if (this.radiance !== null) {
                triangle.makeRadiant(this.radiance, false)
            }
        }

        for (let currentIndex = 0; currentIndex < 3; currentIndex++) {
            const baseAngle = Math.PI / 2
            const placedAngle = baseAngle + (Math.PI * 2 / 3) * currentIndex
            const placedX = Math.cos(placedAngle) * 55
            const placedY = Math.sin(placedAngle) * 55

            createTriangle(placedX, placedY, placedAngle + Math.PI)
        }
    }

    public onDeath(killer: LivingEntity): void {
        const crasherCount = 6
        for (let count = 0; count < crasherCount; count++) {
            const crasher = new Crasher(this.game, true, false)
            if (this.radiance !== null) {
                crasher.makeRadiant(this.radiance)
            }
            const spawnAngle = (Math.PI * 2) / crasherCount * count
            const spawnSpeedMagnitude = 4

            crasher.positionData.x = this.positionData.values.x
            crasher.positionData.y = this.positionData.values.y
            crasher.positionData.angle = spawnAngle

            crasher.velocity.x = Math.cos(spawnAngle) * spawnSpeedMagnitude
            crasher.velocity.y = Math.sin(spawnAngle) * spawnSpeedMagnitude
        }
    }
}
