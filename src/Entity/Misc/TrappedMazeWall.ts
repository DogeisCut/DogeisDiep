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
import ObjectEntity from "../Object";

import { PhysicsFlags, Color, StyleFlags, NameFlags } from "../../Const/Enums";
import AutoTurret from "../Tank/AutoTurret";
import { BarrelBase } from "../Tank/TankBody";
import { CameraEntity } from "../../Native/Camera";
import { AI, AIState, Inputs } from "../AI";
import LivingEntity from "../Live";
import Bullet from "../Tank/Projectile/Bullet";
import { NameGroup } from "../../Native/FieldGroups";
/**
 * Only used for maze walls and nothing else.
 */
export default class TrappedMazeWall extends LivingEntity implements BarrelBase {

    public cameraEntity: CameraEntity = this as unknown as CameraEntity;
    public reloadTime: number = 21;
    public inputs: Inputs;
    public ai: AI
    public turret: AutoTurret
    public disabled: boolean = false
    public nameData: NameGroup = new NameGroup(this);

    public constructor(game: GameServer, x: number, y: number, scale: number) {
        super(game);

        this.setGlobalEntity();

        this.nameData.name = "Trapped Wall"
        this.nameData.flags |= NameFlags.hiddenName

        this.positionData.values.x = x;
        this.positionData.values.y = y;

        this.physicsData.values.width = scale;
        this.physicsData.values.size = scale;
        this.physicsData.values.sides = 2;
        //this.physicsData.values.flags |= PhysicsFlags.isSolidWall;
        this.physicsData.values.pushFactor = 2;
        this.physicsData.values.absorbtionFactor = 0;

        this.relationsData.values.team = this.game.arena;

        this.ai = new AI(this);
        this.ai.viewRange = 2000;
        this.inputs = this.ai.inputs;
        this.ai.movementSpeed = 0;
        this.ai.targetFilterShapes = true
        this.ai.doAimPrediction = false;

        this.styleData.values.borderWidth = 10;
        this.styleData.values.color = Color.Border;
        this.styleData.flags |= StyleFlags.hasNoDmgIndicator
        this.regenPerTick = 0

        //this.damagePerTick = 0

        const starBase = new ObjectEntity(this.game)
        starBase.styleData.flags |= StyleFlags.isStar
        starBase.styleData.flags |= StyleFlags.showsAboveParent
        starBase.physicsData.sides = 4
        starBase.physicsData.size = scale/2 * 0.8
        starBase.styleData.color = this.styleData.color
        starBase.setParent(this)

        const base = new ObjectEntity(this.game)
        base.styleData.flags |= StyleFlags.showsAboveParent
        base.physicsData.sides = 1
        base.physicsData.size = scale/2 * 0.45
        base.styleData.color = this.styleData.color
        base.setParent(this)

        const red = new ObjectEntity(this.game)
        red.styleData.flags |= StyleFlags.showsAboveParent
        red.physicsData.sides = 1
        red.physicsData.size = scale/2 * 0.25
        red.styleData.color = Color.TeamRed
        red.setParent(this)

        this.turret = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 55 / 4,
            width: 42 * 0.7 / 4,
            delay: 0.01,
            reload: 1,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 5,
                damage: 0.9,
                speed: 1.5,
                scatterRate: 1,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 1,
                color: Color.Neutral
            }
        }, 25 / 4)
        this.turret.relationsData.values.team = this.game.arena;
        this.turret.ai.targetFilterShapes = true;
        this.healthData.health = this.healthData.values.maxHealth = 100 + scale
    }
    
    public onDeath(killer: LivingEntity) {
        this.healthData.health = 0.01;
        this.reloadTime = 1000000
        this.turret.styleData.flags &= ~StyleFlags.showsAboveParent
        this.damageReduction = 0.25;
        this.disabled = true
        this.regenPerTick = 1
    }

    // public onCollide(entity1: LivingEntity, entity2: LivingEntity): void {
    //     if (entity1 == this && entity2 instanceof Bullet) {
    //         entity2.destroy()
    //     }
    // }

    public get sizeFactor() {
        return this.physicsData.values.size / 50;
    }

    public tick(tick: number) {
        this.inputs = this.ai.inputs;

        if (this.ai.state === AIState.idle) {
            const angle = this.positionData.values.angle + this.ai.passiveRotation;
            const mag = Math.sqrt((this.inputs.mouse.x - this.positionData.values.x) ** 2 + (this.inputs.mouse.y - this.positionData.values.y) ** 2);
            this.inputs.mouse.set({
                x: this.positionData.values.x + Math.cos(angle) * mag,
                y: this.positionData.values.y + Math.sin(angle) * mag
            });
        }

        if (this.disabled && this.healthData.health >= this.healthData.maxHealth) {
            this.disabled = false
            this.reloadTime = 21
            this.turret.styleData.flags |= StyleFlags.showsAboveParent
            this.damageReduction = 1;
            this.regenPerTick = 0
        }

        super.tick(tick);
    }

    public readonly isShapeEntity: boolean = true
}
