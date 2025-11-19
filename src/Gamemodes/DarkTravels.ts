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

import GameServer from "../Game";
import ArenaEntity from "../Native/Arena";
import Client from "../Client";

import TeamBase from "../Entity/Misc/TeamBase";
import TankBody from "../Entity/Tank/TankBody";

import { TeamEntity } from "../Entity/Misc/TeamEntity";
import { Color, PhysicsFlags, StyleFlags } from "../Const/Enums";
import ShapeManager from "../Entity/Shape/Manager";
import { VectorAbstract } from "../Physics/Vector";
import MazeWall from "../Entity/Misc/MazeWall";
import ObjectEntity from "../Entity/Object";
import CrasherClump from "../Entity/Shape/CrasherClump";
import Hexagon from "../Entity/Shape/Hexagon";
import Pentagon from "../Entity/Shape/Pentagon";
import Triangle from "../Entity/Shape/Triangle";
import Square from "../Entity/Shape/Square";
import Crasher from "../Entity/Shape/Crasher";
import { create } from "domain";
import CrasherGrunt from "../Entity/Misc/CrasherGrunt";
import TrappedMazeWall from "../Entity/Misc/TrappedMazeWall";
import DarkGuardian from "../Entity/Misc/DarkGuardian";
import LivingEntity from "../Entity/Live";
import EmbossedCrasher from "../Entity/Shape/EmbossedCrasher";


export class DarkBackground extends ObjectEntity {

    public constructor(game: GameServer, x: number, y: number, width: number, height: number) {
        super(game);

        this.setGlobalEntity();

        this.positionData.values.x = x;
        this.positionData.values.y = y;

        this.physicsData.values.width = width;
        this.physicsData.values.size = height;
        this.physicsData.values.sides = 2;
        this.physicsData.values.flags |= PhysicsFlags.noOwnTeamCollision | PhysicsFlags.isBase;
        this.physicsData.values.absorbtionFactor = 0;

        this.styleData.values.opacity = 0.7;
        this.styleData.values.borderWidth = 0;
        this.styleData.values.color = Color.PitchBlack;
        this.styleData.values.flags |= StyleFlags.renderFirst | StyleFlags.hasNoDmgIndicator;

        this.physicsData.values.pushFactor = 0;
    }
}


const arenaSize = 11150;
const baseSize = arenaSize / (3 + 1/3); // 3345

export class DarkTravelsShapeManager extends ShapeManager {
    protected get wantedShapes() {
        return 250;
    }

    protected get fieldShapes() {
        return [
            { weight: 0.1, create: () => new EmbossedCrasher(this.game) },
            { weight: 0.33, create: () => new CrasherGrunt(this.game) },
            { weight: 1, create: () => new Hexagon(this.game, Math.random() <= 0.5) },
            { weight: 1, create: () => new Pentagon(this.game, Math.random() <= 0.5) },
            { weight: 1, create: () => new Triangle(this.game, Math.random() <= 0.5) },
            { weight: 1, create: () => new Square(this.game, Math.random() <= 0.5) }
        ];
    } 

    protected get pentagonNestShapes() {
        return [
            ...this.fieldShapes,
            { weight: 0.4, create: () => new EmbossedCrasher(this.game) }
        ]
    }

    protected get crasherZoneShapes() {
        return [
            ...this.fieldShapes,
            { weight: 0.4, create: () => new EmbossedCrasher(this.game) }
        ]
    }
}

// constss.
const CELL_SIZE = 465;
const GRID_SIZE = 50;
const ARENA_SIZE = CELL_SIZE * GRID_SIZE;
const SEED_AMOUNT = Math.floor(Math.random() * 30) + 40;
const TURN_CHANCE = 0.8;
const BRANCH_CHANCE = 0.1;
const TERMINATION_CHANCE = 0.05;

export default class DarkTravelsArena extends ArenaEntity {
    static override GAMEMODE_ID: string = "darkTravels";

    protected shapes: ShapeManager = new DarkTravelsShapeManager(this);

    /** Stores all the "seed"s */
    private SEEDS: VectorAbstract[] = [];
    /** Stores all the "wall"s, contains cell based coords */
    private WALLS: (VectorAbstract & {width: number, height: number})[] = [];
    /** Rolled out matrix of the grid */
    private MAZE: Uint8Array = new Uint8Array(GRID_SIZE * GRID_SIZE);

    /** Blue Team entity */
    public blueTeam: TeamEntity;
    /** Red Team entity */
    public redTeam: TeamEntity;
    /** Green Team entity */
    public greenTeam: TeamEntity;
    /** Purple Team entity */
    public purpleTeam: TeamEntity;

    /** Maps clients to their teams */
    public playerTeamMap: WeakMap<Client, TeamEntity> = new WeakMap();

    public darkGuardian: DarkGuardian

    public constructor(game: GameServer) {
        super(game);
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        this.allowBoss = false;

        new DarkBackground(game, 0, 0, arenaSize * 4, arenaSize * 4);
        this.blueTeam = new TeamEntity(this.game, Color.TeamBlue)
        this.redTeam = new TeamEntity(this.game, Color.TeamRed)
        this.greenTeam = new TeamEntity(this.game, Color.TeamGreen)
        this.purpleTeam = new TeamEntity(this.game, Color.TeamPurple)

        this._buildMaze();

        this.darkGuardian = this.createDarkGuardian()

    }

    private createDarkGuardian() {
        this.darkGuardian = new DarkGuardian(this.game)
        const originalOnDeath = this.darkGuardian.onDeath
        this.darkGuardian.onDeath = (killer: LivingEntity) => {
            originalOnDeath.call(this.darkGuardian, killer)
            this.startDarkGuardianRespawn()
        }
        return this.darkGuardian // just cause ts complains
    }

    private startDarkGuardianRespawn() {
        setTimeout(() => {
            this.darkGuardian = this.createDarkGuardian()
        }, 10000)
    }

    /** Creates a maze wall from cell coords */
    private _buildWallFromGridCoord(gridX: number, gridY: number, gridW: number, gridH: number) {
        const scaledW = gridW * CELL_SIZE;
        const scaledH = gridH * CELL_SIZE;
        const scaledX = gridX * CELL_SIZE - ARENA_SIZE / 2 + (scaledW / 2);
        const scaledY = gridY * CELL_SIZE - ARENA_SIZE / 2 + (scaledH / 2);
        const wall = gridW == gridH ? new TrappedMazeWall(this.game, scaledX, scaledY, scaledH) : new MazeWall(this.game, scaledX, scaledY, scaledH, scaledW);
        wall.styleData.color = Color.Border
    }
    /** Allows for easier (x, y) based getting of maze cells */
    private _get(x: number, y: number): number {
        return this.MAZE[y * GRID_SIZE + x];
    }
    /** Allows for easier (x, y) based setting of maze cells */
    private _set(x: number, y: number, value: number): number {
        return this.MAZE[y * GRID_SIZE + x] = value;
    }
    /** Converts MAZE grid into an array of set and unset bits for ease of use */
    private _mapValues(): [x: number, y: number, value: number][] {
        const values: [x: number, y: number, value: number][] = Array(this.MAZE.length);
        for (let i = 0; i < this.MAZE.length; ++i) values[i] = [i % GRID_SIZE, Math.floor(i / GRID_SIZE), this.MAZE[i]];
        return values;
    }
    /** Builds the maze */
    protected _buildMaze() {
        // Plant some seeds
        for (let i = 0; i < 10000; i++) {
            // Stop if we exceed our maximum seed amount
            if (this.SEEDS.length >= SEED_AMOUNT) break;
            // Attempt a seed planting
            let seed: VectorAbstract = {
                x: Math.floor((Math.random() * GRID_SIZE) - 1),
                y: Math.floor((Math.random() * GRID_SIZE) - 1),
            };
            // Check if our seed is valid (is 3 GU away from another seed, and is not on the border)
            if (this.SEEDS.some(a => (Math.abs(seed.x - a.x) <= 3 && Math.abs(seed.y - a.y) <= 3))) continue;
            if (seed.x <= 0 || seed.y <= 0 || seed.x >= GRID_SIZE - 1 || seed.y >= GRID_SIZE - 1) continue;
            // Push it to the pending seeds and set its grid to a wall cell
            this.SEEDS.push(seed);
            this._set(seed.x, seed.y, 1);
        }
        const direction: number[][] = [
            [-1, 0], [1, 0], // left and right
            [0, -1], [0, 1], // up and down
        ];
        // Let it grow!
        for (let seed of this.SEEDS) {
            // Select a direction we want to head in
            let dir: number[] = direction[Math.floor(Math.random() * 4)];
            let termination = 1;
            // Now we can start to grow
            while (termination >= TERMINATION_CHANCE) {
                // Choose the next termination chance
                termination = Math.random();
                // Get the direction we're going in
                let [x, y] = dir;
                // Move forward in that direction, and set that grid to a wall cell
                seed.x += x;
                seed.y += y;
                if (seed.x <= 0 || seed.y <= 0 || seed.x >= GRID_SIZE - 1 || seed.y >= GRID_SIZE - 1) break;
                this._set(seed.x, seed.y, 1);
                // Now lets see if we want to branch or turn
                if (Math.random() <= BRANCH_CHANCE) {
                    // If the seeds exceeds 75, then we're going to stop creating branches in order to avoid making a massive maze tumor(s)
                    if (this.SEEDS.length > 75) continue;
                    // Get which side we want the branch to be on (left or right if moving up or down, and up and down if moving left or right)
                    let [ xx, yy ] = direction.filter(a => a.every((b, c) => b !== dir[c]))[Math.floor(Math.random() * 2)];
                    // Create the seed
                    let newSeed = {
                        x: seed.x + xx,
                        y: seed.y + yy,
                    };
                    // Push the seed and set its grid to a maze zone
                    this.SEEDS.push(newSeed);
                    this._set(seed.x, seed.y, 1);
                } else if (Math.random() <= TURN_CHANCE) {
                    // Get which side we want to turn to (left or right if moving up or down, and up and down if moving left or right)
                    dir = direction.filter(a => a.every((b, c) => b !== dir[c]))[Math.floor(Math.random() * 2)];
                }
            }
        }
        // Now lets attempt to add some singular walls around the arena
        for (let i = 0; i < 10; i++) {
            // Attempt to place it 
            let seed = {
                x: Math.floor((Math.random() * GRID_SIZE) - 1),
                y: Math.floor((Math.random() * GRID_SIZE) - 1),
            };
            // Check if our sprinkle is valid (is 3 GU away from another wall, and is not on the border)
            if (this._mapValues().some(([x, y, r]) => r === 1 && (Math.abs(seed.x - x) <= 3 && Math.abs(seed.y - y) <= 3))) continue;
            if (seed.x <= 0 || seed.y <= 0 || seed.x >= GRID_SIZE - 1 || seed.y >= GRID_SIZE - 1) continue;
            // Set its grid to a wall cell
            this._set(seed.x, seed.y, 1);
        }
        // Now it's time to fill in the inaccessible pockets
        // Start at the top left
        let queue: number[][] = [[0, 0]];
        this._set(0, 0, 2);
        let checkedIndices = new Set([0]);
        // Now lets cycle through the whole map
        for (let i = 0; i < 3000 && queue.length > 0; i++) {
            let next = queue.shift();
            if (next == null) break;
            let [x, y] = next;
            // Get what the coordinates of what lies to the side of our cell
            for (let [nx, ny] of [
                [x - 1, y], // left
                [x + 1, y], // right
                [x, y - 1], // top
                [x, y + 1], // bottom
            ]) {
                // If its a wall ignore it
                if (this._get(nx, ny) !== 0) continue;
                let i = ny * GRID_SIZE + nx;
                // Check if we've already checked this cell
                if (checkedIndices.has(i)) continue;
                // Add it to the checked cells if we haven't already
                checkedIndices.add(i);
                // Add it to the next cycle to check
                queue.push([nx, ny]);
                // Set its grid to an accessible cell
                this._set(nx, ny, 2);
            }
        }
        // Cycle through all areas of the map
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                // If we're not a wall, ignore the cell and move on
                if (this._get(x, y) === 2) continue;
                // Define our properties
                let chunk = { x, y, width: 0, height: 1 };
                // Loop through adjacent cells and see how long we should be
                while (this._get(x + chunk.width, y) !== 2) {
                    this._set(x + chunk.width, y, 2);
                    chunk.width++;
                }
                // Now lets see if we need to be t h i c c
                outer: while (true) {
                    // Check the row below to see if we can still make a box
                    for (let i = 0; i < chunk.width; i++)
                        // Stop if we can't
                        if (this._get(x + i, y + chunk.height) === 2) break outer;
                    // If we can, remove the line of cells from the map and increase the height of the block
                    for (let i = 0; i < chunk.width; i++)
                        this._set(x + i, y + chunk.height, 2);
                    chunk.height++;
                }
                this.WALLS.push(chunk);
            }
        }
        // Create the walls!
        for (let {x, y, width, height} of this.WALLS)
            this._buildWallFromGridCoord(x, y, width, height);
    }

    public isValidSpawnLocation(x: number, y: number): boolean {
        // Should never spawn inside walls
        for (let wall of this.WALLS) {
            const wallX = wall.x * CELL_SIZE - ARENA_SIZE / 2;
            const wallY = wall.y * CELL_SIZE - ARENA_SIZE / 2;
            const wallW = wall.width * CELL_SIZE;
            const wallH = wall.height * CELL_SIZE;
            if (
                x >= wallX &&
                x <= wallX + wallW &&
                y >= wallY &&
                y <= wallY + wallH
            ) {
                return false;
            }
        }
        return true;
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        super.spawnPlayer(tank, client)

        //TODO: FFA (white) team who can damage each other and the other teams
        const team = this.playerTeamMap.get(client) || [this.blueTeam, this.redTeam, this.greenTeam, this.purpleTeam][0|Math.random()*4];
        tank.relationsData.values.team = team;
        tank.styleData.values.color = team.teamData.values.teamColor;
        this.playerTeamMap.set(client, team);
    }
}
