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

import ArenaEntity from "../../Native/Arena";
import GameServer from "../../Game";

import Crasher from "./Crasher";
import Hexagon from "./Hexagon";
import Pentagon from "./Pentagon";
import Triangle from "./Triangle";
import Square from "./Square";
import AbstractShape from "./AbstractShape";

function pickWeightedRandomShape(shapes: { weight: number, create: () => AbstractShape }[]): AbstractShape {
	let totalWeight = 0;
	for (const entry of shapes) totalWeight += entry.weight;
	let choice = Math.random() * totalWeight;
	for (const entry of shapes) {
		choice -= entry.weight;
		if (choice <= 0) return entry.create();
	}
	return shapes[shapes.length - 1].create();
}

export default class ShapeManager {
	protected game: GameServer;
	protected arena: ArenaEntity;
	protected shapes: AbstractShape[] = [];

	protected fieldShapes: { weight: number, create: () => AbstractShape }[] = [];
	protected pentagonNestShapes: { weight: number, create: () => AbstractShape }[] = [];
	protected crasherZoneShapes: { weight: number, create: () => AbstractShape }[] = [];

	public constructor(arena: ArenaEntity) {
		this.arena = arena;
		this.game = arena.game;

        this.fieldShapes = [
            { weight: 1, create: () => new Hexagon(this.game, Math.random() <= 0.011) },
            { weight: 3, create: () => new Pentagon(this.game, Math.random() <= 0.009) },
            { weight: 16, create: () => new Triangle(this.game, Math.random() <= 0.007) },
            { weight: 70, create: () => new Square(this.game, Math.random() <= 0.005) }
        ];

        this.pentagonNestShapes = [
            { weight: 0.1, create: () => new Hexagon(this.game, Math.random() <= 0.06) },
			{ weight: 1, create: () => new Pentagon(this.game, Math.random() <= 0.05) },
		];

		this.crasherZoneShapes = [
			{ weight: 1, create: () => new Crasher(this.game, Math.random() < 0.2) }
		];
	}

	protected spawnShape(): AbstractShape {
		let shape: AbstractShape;
		const { x, y } = this.arena.findSpawnLocation();
		const rightX = this.arena.arenaData.values.rightX;
		const leftX = this.arena.arenaData.values.leftX;

		if (Math.max(x, y) < rightX / 10 && Math.min(x, y) > leftX / 10) {
			shape = pickWeightedRandomShape(this.pentagonNestShapes);
		} else if (Math.max(x, y) < rightX / 5 && Math.min(x, y) > leftX / 5) {
			shape = pickWeightedRandomShape(this.crasherZoneShapes);
		} else {
			shape = pickWeightedRandomShape(this.fieldShapes);
		}

		shape.positionData.values.x = x;
		shape.positionData.values.y = y;
		shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
		shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;

		return shape;
	}

	public killAll() {
		for (let i = 0; i < this.shapes.length; ++i) this.shapes[i]?.delete();
	}

	protected get wantedShapes() {
		return 1000;
	}

	public tick() {
		for (let i = this.wantedShapes; i-- > 0;) {
			const shape = this.shapes[i];
			if (!shape || shape.hash === 0) this.shapes[i] = this.spawnShape();
		}
	}
}