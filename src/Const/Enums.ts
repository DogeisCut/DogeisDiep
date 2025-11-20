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

import { maxPlayerLevel } from "../config";

/**
 * The IDs for all the team colors, by name.
 */
export const enum Color {
    Border = 0,
    Barrel = 1,
    Tank = 2,
    TeamBlue = 3,
    TeamRed = 4,
    TeamPurple = 5,
    TeamGreen = 6,
    OldShiny = 7,
    EnemySquare = 8,
    EnemyTriangle = 9,
    EnemyPentagon = 10,
    EnemyCrasher = 11,
    Neutral = 12,
    ScoreboardBar = 13,
    Box = 14,
    EnemyTank = 15,
    NecromancerSquare = 16,
    Fallen = 17,
    EnemyHexagon = 18,
    NecromancerPentagon = 19,
    NecromancerTriangle = 20,
    ShinyR = 21,
    ShinyG = 22,
    ShinyB = 23,
    Shiny = 24,
    ShinierR = 25,
    ShinierG = 26,
    ShinierB = 27,
    Shinier = 28,
    PitchBlack = 29,
    ShinyPaleR = 30,
    ShinyPaleG = 31,
    ShinyPaleB = 32,
    ShinyPale = 33,

    kMaxColors = 34
}

/**
 * The hex color codes of each color (by ID), expressed as an int (0x00RRGGBB)
 */
export type ColorValue = number | [number, ...Color[]]

export const ColorsHexCode: Record<Color, ColorValue > = {
    [Color.Border]: 0x555555,
    [Color.Barrel]: 0x999999,
    [Color.Tank]: 0x00B2E1,
    [Color.TeamBlue]: 0x00B2E1,
    [Color.TeamRed]: 0xF14E54,
    [Color.TeamPurple]: 0xBF7FF5,
    [Color.TeamGreen]: 0x00E16E,
    [Color.OldShiny]: 0x8AFF69,
    [Color.EnemySquare]: 0xFFE869,
    [Color.EnemyTriangle]: 0xFC7677,
    [Color.EnemyPentagon]: 0x768DFC,
    [Color.EnemyCrasher]: 0xF177DD,
    [Color.Neutral]: 0xFFE869,
    [Color.ScoreboardBar]: 0x43FF91,
    [Color.Box]: 0xBBBBBB,
    [Color.EnemyTank]: 0xF14E54,
    [Color.NecromancerSquare]: 0xFCC376,
    [Color.Fallen]: 0xC0C0C0,
    [Color.EnemyHexagon]: 0x7ADBBC,
    [Color.NecromancerPentagon]: 0xa276fc,
    [Color.NecromancerTriangle]: 0xF14E54,
    [Color.ShinyR]: 0xCC9999,
    [Color.ShinyG]: 0x99CC99,
    [Color.ShinyB]: 0x9999CC,
    [Color.Shiny]: 0x000000,
    [Color.ShinierR]: 0xDD6666,
    [Color.ShinierG]: 0x66DD66,
    [Color.ShinierB]: 0x6666DD,
    [Color.Shinier]: 0x000000,
    [Color.PitchBlack]: 0x000000,
    [Color.ShinyPaleR]: 0xFF8888,
    [Color.ShinyPaleG]: 0x88FF88,
    [Color.ShinyPaleB]: 0x8888FF,
    [Color.ShinyPale]: 0x000000,
    [Color.kMaxColors]: 0x000000
}

ColorsHexCode[Color.Shiny] = [1, Color.ShinyR, Color.ShinyG, Color.ShinyB]
ColorsHexCode[Color.Shinier] = [1, Color.ShinierR, Color.ShinierG, Color.ShinierB]
ColorsHexCode[Color.ShinyPale] = [1, Color.ShinyPaleR, Color.ShinyPaleG, Color.ShinyPaleB]


export function getResolvedColor(colorValue: ColorValue): number {
	if (Array.isArray(colorValue)) {
		let rate = colorValue[0]
		let list = colorValue.slice(1)
		return getAnimatedColor(rate, ...list)
	}
	return colorValue
}

export function getAnimatedColor(resolutionRateSeconds: number, ...colorIndexList: Color[]): number {
	let currentTimeSeconds = Date.now() / 1000
	let totalCycleTimeSeconds = resolutionRateSeconds * colorIndexList.length
	let timeInCycleSeconds = currentTimeSeconds % totalCycleTimeSeconds
	let currentIndexFloat = timeInCycleSeconds / resolutionRateSeconds
	let currentColorListIndex = Math.floor(currentIndexFloat)
	let nextColorListIndex = (currentColorListIndex + 1) % colorIndexList.length
	let blendAmount = currentIndexFloat - currentColorListIndex

	let currentColorIndex = colorIndexList[currentColorListIndex]
	let nextColorIndex = colorIndexList[nextColorListIndex]

	let currentColorValue = ColorsHexCode[currentColorIndex] as number
	let nextColorValue = ColorsHexCode[nextColorIndex] as number

	let currentRed = (currentColorValue >> 16) & 0xff
	let currentGreen = (currentColorValue >> 8) & 0xff
	let currentBlue = currentColorValue & 0xff

	let nextRed = (nextColorValue >> 16) & 0xff
	let nextGreen = (nextColorValue >> 8) & 0xff
	let nextBlue = nextColorValue & 0xff

	let blendedRed = Math.round(currentRed + (nextRed - currentRed) * blendAmount)
	let blendedGreen = Math.round(currentGreen + (nextGreen - currentGreen) * blendAmount)
	let blendedBlue = Math.round(currentBlue + (nextBlue - currentBlue) * blendAmount)

	return (blendedRed << 16) | (blendedGreen << 8) | blendedBlue
}

/**
 * The IDs for all the tanks, by name.
 */
export const enum Tank {
    Basic             = 0,
    Twin              = 1,
    Triplet           = 2,
    TripleShot        = 3,
    QuadTank          = 4,
    OctoTank          = 5,
    Sniper            = 6,
    MachineGun        = 7,
    FlankGuard        = 8,
    TriAngle          = 9,
    Destroyer         = 10,
    Overseer          = 11,
    Overlord          = 12,
    TwinFlank         = 13,
    PentaShot         = 14,
    Assassin          = 15,
    ArenaCloser       = 16,
    Necromancer       = 17,
    /* Ideas
    - Mancerdrive
    The drones have auto guns!
    */
    TripleTwin        = 18,
    Hunter            = 19,
    Gunner            = 20,
    Stalker           = 21,
    Ranger            = 22,
    Booster           = 23,
    Fighter           = 24,
    Hybrid            = 25,
    Manager           = 26,
    Mothership        = 27,
    /* Ideas
    - Flagship
    Flagship from arras, has minions lol
    */
    Predator          = 28,
    Sprayer           = 29,
    
    Trapper           = 31,
    GunnerTrapper     = 32,
    Overtrapper       = 33,
    MegaTrapper       = 34,
    /* Ideas
    - ????
    launched out at higher velcoity, a whole trapper branch for this would be nice actually
    */
    TriTrapper        = 35,
    Smasher           = 36,
    /* Ideas
    - Hammer
    Big hammer, you can swing it around and it does damage :3
    */
    Landmine          = 38,
    /* Ideas
    - Claymore
    Spike + Landmine
    - Booby
    Goes invisible faster.
    */
    AutoGunner        = 39,
    Auto5             = 40,
    Auto3             = 41,
    SpreadShot        = 42,
    /* Ideas
    - Zone Denier
    Spreadier Spread shot + more barrels
    */
    Streamliner       = 43,
    AutoTrapper       = 44,
    DominatorD        = 45,
    /* Ideas
    - Double Destroyer Dominator
    has two destroyer cannons on a mounted base
    */
    DominatorG        = 46,
    /* Ideas
    - Streamliner Dominator
    self epxlanitory
    */
    DominatorT        = 47,
    /* Ideas
    - Auto Trapper Dominator
    self explanitory
    */
    Battleship        = 48,
    Annihilator       = 49,
    AutoSmasher       = 50,
    /* Ideas
    - Triple Auto Smasher
    obvious
    */
    Spike             = 51,
    /* Ideas
    - Razor
    Spikier Spike
    */
    Factory           = 52,
    ""                = 53, // Used internally by a bunch of stuff.
    Skimmer           = 54,
    /* Ideas
    - Skeeter
    more skimmer bullet cannons (4? 5?)
    - Infestor
    swarm cannons instead of bullet
    */
    Rocketeer         = 55,
    /* Ideas
    - Missile Commander
    faster rockets/double cannon rockets
    - Bazooka
    Bigger rockets
    - RPG
    Exploding rockets
    - Artillery
    machine gun + rocketeer
    */
    Quintuplet        = 56,
    HeptaShot         = 57,
    Auto7             = 58,
    DecaTank          = 59, 
    Vindicator        = 60,
    AutoTank          = 61,
    Overczar          = 62,
    Rationalizer      = 63,
    Obliterator       = 64,
    Compound          = 65,
    Warship           = 66,
    Rocket            = 67,
    Brawler           = 68,
    Hawker            = 69,
    HexaTrapper       = 70,
    Spewer            = 71,
    Eradicator        = 72,
    FullGunnerTrapper = 73,
    Complex           = 74,
    Workshop          = 75,  
    QuadTwin          = 76,
    TripleAutoGunner  = 77,
    TripleAutoTank    = 78,
    TripleAutoTrapper = 79,
    Trapperlord       = 80,
    Flamer            = 81,
    Flamethrower      = 82,
    Incinerator       = 83,
    Plane             = 84,
    /* Ideas
     - Jet
    Adds a second machine gun cannon on the back for extra speed
    - Gunner Plane
    This should be obvious lol
    - Auto Plane
    This should also be obvious.
    */
    FighterJet        = 85,
    /* Ideas
    - Fumigator
    Replaces side barrels with flamers
    - Bomber Plane
    Replaces side barrels with pounder adjacent barrels
    - Supply Dropper
    Replaces side barrels with back facing trapper barrels
    - Supreme Jet
    Adds a second pair of side barrels, like the original concept art.
    */
    President         = 86,
    OmegaTrapper      = 87,
    Pentamancer       = 88,
    /* Ideas:
    Allow Claiming of any shape, shapes can touch and merge into higher tiers (e.g. square + square = triangle)
    */
    Wraith            = 89,
    /* TODO:
    Unique Look
    */
    General           = 90,
    TripleAutoSmasher = 91,
    Razor             = 92,
    Scavenger         = 93,
    Ravenger          = 94,
    FlameGuard        = 95,
    TriFlamer         = 96,
    Atomizer          = 97,
    Fumigator         = 98,
    Booby             = 99,
    Claymore          = 100,
    DominatorDR       = 101,
    BaseProtector     = 102,
    CrasherGrunt      = 103,
    DarkGuardian      = 104,
    AutoRanger        = 105,
    AutoStreamliner   = 106,
    AutoGunnerTrapper = 107,
    AutoBattleship    = 108,
    AutoTripleTwin    = 109,
    AutoAuto5         = 110,
    AutoOctoTank      = 111,
    SplashShot        = 112,
	AutoSpreadShot    = 113,
	AutoPentaShot     = 114,
	AutoTriplet       = 115,
	AutoFlameGuard    = 116,
	AutoFighterJet    = 117,
	AutoFighter       = 118,
	AutoBooster       = 119,
	AutoFumigator     = 120,
	AutoIncinerator   = 121,
	AutoFlamethrower  = 122,
	AutoFactory       = 123,
	AutoOvertrapper   = 124,
	//AutoManager       = 125,
	AutoNecromancer   = 126,
	AutoOverlord      = 127,
	AutoSprayer       = 128,
	AutoRocketeer     = 129,
	AutoSkimmer       = 130,
	AutoAnnihilator   = 131,
	AutoHybrid        = 132,
	AutoMegaTrapper   = 133,
	AutoTriTrapper    = 134,
	AutoPredator      = 135,
	//AutoStalker       = 136

    /* General Ideas 
    - Split
    Two tanks that share one health bar and you can swap between them
    - Station
    orbiting auto cannons around a basic tank/two gunner
    - Arena Opener
    smasher or shooter thingy that spawns a circle of static pentagon things around it
    ocasionally, trapping everything inside
    - Implement post 2019 classes
    - Explosive Bullets Branch (4 pointed star)
        - Firecracker obv
        - One that explodes into traps
        - One that explodes into swarm drones
    */
}

/**
 * The IDs for all the stats, by name.
 */
export const enum Stat {
    MovementSpeed = 0,
    Reload = 1,
    BulletDamage = 2,
    BulletPenetration = 3,
    BulletSpeed = 4,
    BodyDamage = 5,
    MaxHealth = 6,
    HealthRegen = 7
}

/**
 * Total Stat Count
 */
export const StatCount = 8;

/**
 * All the indices available on scoreboard - used for type security
 */
export type ValidScoreboardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Packet headers for the [serverbound packets](https://github.com/ABCxFF/diepindepth/blob/main/protocol/serverbound.md).
 */
export const enum ServerBound {
    Init            = 0x0,
    Input           = 0x1,
    Spawn           = 0x2,
    StatUpgrade     = 0x3,
    TankUpgrade     = 0x4,
    Ping            = 0x5,
    TCPInit         = 0x6,
    ExtensionFound  = 0x7,
    ToRespawn       = 0x8,
    TakeTank        = 0x9
}
/**
 * Packet headers for the [clientbound packets](https://github.com/ABCxFF/diepindepth/blob/main/protocol/clientbound.md).
 */
export const enum ClientBound {
    Update          = 0x0,
    OutdatedClient  = 0x1,
    Compressed      = 0x2,
    Notification    = 0x3,
    ServerInfo      = 0x4,
    Ping            = 0x5,
    PartyCode       = 0x6,
    Accept          = 0x7,
    Achievement     = 0x8,
    InvalidParty    = 0x9,
    PlayerCount     = 0xA,
    ProofOfWork     = 0xB
}

/**
 * Flags sent within the [input packet](https://github.com/ABCxFF/diepindepth/blob/main/protocol/serverbound.md#0x01-input-packet).
 */
export const enum InputFlags {
    leftclick   = 1 << 0,
    up          = 1 << 1,
    left        = 1 << 2,
    down        = 1 << 3,
    right       = 1 << 4,
    godmode     = 1 << 5,
    suicide     = 1 << 6,
    rightclick  = 1 << 7,
    levelup     = 1 << 8,
    gamepad     = 1 << 9,
    switchtank  = 1 << 10,
    adblock     = 1 << 11
}

/**
 * The flag names for the arena field group.
 */
export const enum ArenaFlags {
    noJoining        = 1 << 0,
    showsLeaderArrow = 1 << 1,
    hiddenScores     = 1 << 2,
    gameReadyStart   = 1 << 3,
    canUseCheats     = 1 << 4
}
/**
 * The flag names for the team field group.
 */
export const enum TeamFlags {
    hasMothership = 1 << 0
}
/**
 * The flag names for the camera field group.
 */
export const enum CameraFlags {
    usesCameraCoords      = 1 << 0,
    showingDeathStats     = 1 << 1,
    gameWaitingStart      = 1 << 2
}
/**
 * The flag names for the tsyle field group.
 */
export const enum StyleFlags {
    isVisible          = 1 << 0,
    hasBeenDamaged     = 1 << 1,
    isFlashing         = 1 << 2,
    renderFirst        = 1 << 3,
    isStar             = 1 << 4,
    isCachable         = 1 << 5,
    showsAboveParent   = 1 << 6,
    hasNoDmgIndicator  = 1 << 7
}
/**
 * The flag names for the position field group.
 */
export const enum PositionFlags {
    absoluteRotation    = 1 << 0,
    canMoveThroughWalls = 1 << 1
}
/**
 * The flag names for the physics field group.
 */
export const enum PhysicsFlags {
    isTrapezoid             = 1 << 0,
    showsOnMap              = 1 << 1,
    doChildrenCollision     = 1 << 2,
    noOwnTeamCollision      = 1 << 3,
    isSolidWall             = 1 << 4,
    onlySameOwnerCollision  = 1 << 5,
    isBase                  = 1 << 6,
    _unknown1               = 1 << 7,
    canEscapeArena          = 1 << 8
}
/**
 * The flag names for the barrel field group.
 */
export const enum BarrelFlags {
    hasShot = 1 << 0
}
/**
 * The flag names for the health field group.
 */
export const enum HealthFlags {
    hiddenHealthbar = 1 << 0
}
/**
 * The flag names for the name field group.
 */
export const enum NameFlags {
    hiddenName = 1 << 0,
    highlightedName = 1 << 1
}

/**
 * Credits to CX for discovering this.
 * This is not fully correct but it works up to the decimal (float rounding likely causes this).
 * 
 * `[index: level]->score at level`
 */
export const levelToScoreTable = Array(maxPlayerLevel).fill(0);

for (let i = 1; i < maxPlayerLevel; ++i) {
    levelToScoreTable[i] = levelToScoreTable[i - 1] + (40 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
}

/**
 * Credits to CX for discovering this.
 * This is not fully correct but it works up to the decimal (float rounding likely causes this).
 * 
 * Used for level calculation across the codebase.
 * 
 * `(level)->score at level`
 */
export function levelToScore(level: number): number {
    if (level >= maxPlayerLevel) return levelToScoreTable[maxPlayerLevel - 1];
    if (level <= 0) return 0;

    return levelToScoreTable[level - 1];
}
