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

import { Color, PhysicsFlags, StyleFlags } from "../../Const/Enums";
import { barrelAddonId } from "../../Const/TankDefinitionsUtil";
import GameServer from "../../Game";
import ObjectEntity from "../Object";
import Barrel from "./Barrel";

/**
 * Abstract class to represent a barrel's addon in game.
 * 
 * For more information on an addon, see Addons.ts - BarrelAddons are the same thing except they are applied on the barrel after it is made.
 * 
 * Read [addons.md on diepindepth](https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md) 
 * for more details and examples.
 */

export class BarrelAddon {
    /** The current game server */
    protected game: GameServer; 
    /** Helps the class determine size  */
    protected owner: Barrel;

    public constructor(owner: Barrel) {
        this.owner = owner;
        this.game = owner.game;
    }
}

/**
 * Entity attached to the edge of a trapper barrel
 */
export class TrapLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags.doChildrenCollision;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

/** Trap launcher - added onto traps */
export class TrapLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: TrapLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new TrapLauncher(owner);
    }
}


export class FlameLauncher extends ObjectEntity {
    public barrelEntity: Barrel;

    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags.doChildrenCollision;
        this.styleData.values.color = Color.Barrel;
        this.positionData.angle = 3.141592653589793
        this.styleData.flags ^= StyleFlags.showsAboveParent

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

export class FlameLauncherAddon extends BarrelAddon {
    public launcherEntity: FlameLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new FlameLauncher(owner);
    }
}

export class SatelliteAntennaAddon extends BarrelAddon {
    public constructor(owner: Barrel) {
        super(owner);

        const base = new ObjectEntity(owner.game)
        base.setParent(owner);
        base.relationsData.values.team = owner;
        base.styleData.values.color = Color.Barrel;
        base.physicsData.sides = 2;
        base.styleData.flags |= StyleFlags.showsAboveParent
        const baseTick = base.tick
        base.tick = function(tick: number) {
            baseTick.call(base, tick)
            this.physicsData.width = owner.physicsData.values.width
            this.physicsData.size = owner.physicsData.values.size * 2/3
            this.positionData.x = (-owner.physicsData.values.size / 2) + (owner.physicsData.values.size * 2/3) / 2

        }

        const bulb = new ObjectEntity(owner.game)
        bulb.setParent(owner);
        bulb.relationsData.values.team = owner;
        bulb.styleData.values.color = Color.Barrel;
        bulb.physicsData.sides = 1;
        bulb.styleData.flags |= StyleFlags.showsAboveParent
        const bulbTick = bulb.tick
        bulb.tick = function(tick: number) {
            bulbTick.call(bulb, tick)
            owner.physicsData.values.width /= 2
            this.physicsData.size = owner.physicsData.width
            this.positionData.x = owner.physicsData.values.size/2
        }
    }
}

/**
 * All barrel addons in the game by their ID.
 */
export const BarrelAddonById: Record<barrelAddonId, typeof BarrelAddon | null> = {
    trapLauncher: TrapLauncherAddon,
    flameLauncher: FlameLauncherAddon,
    "-50Distance": null,
    satelliteAntenna: SatelliteAntennaAddon
}