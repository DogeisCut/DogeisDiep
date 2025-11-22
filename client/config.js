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

const BUILD = "6f59094d60f98fafc14371671d3ff31ef4d75d9e";
const CDN = "https://static.diep.io/";
const API_URL = `${window.location.href}api/`;

// may need to start commenting out logs as i run out of space
const CHANGELOG = [
    "Welcome to Dogeis Diep, a diep.io private server created with diepcustom!",
    "There are over 100+ tanks, features and additions for you to play around with,",
    "And more features are being added almost every day! I encourage you to invite your friends!",
    "",
    "You can level up to level 60 but stop growing at level 45,",
    "Level 60 tanks/Tier 5 tanks are available!",
    "Hold K to level up and press O to retry.",
    "",
    "Discord: https://discord.gg/98NwxqJacr",
    "GitHub Repository: https://github.com/DogeisCut/DogeisDiep",
    "",
    "November 22th, 2025",
    "- Added Twirler branch (over 15+ new tanks).",
    "- Added Tricker tank to the Trapper branch.",
    "",
    "November 19th, 2025",
    "- Added auto variants for (almost) every single tier 4 tank.",
    "- Nerfed Trapped Wall health.",
    "- New Spread Shot tank: Splash Shot",
    "- New level 60 \"meta\" tanks for Auto Basic, Sniper, Machine Gun, and Flank Guard",
    "- Darkened Dark Travels... just a tad, enough to not blend in with Smasher guards.",
    "- Obfuscated both the minimap and leaderboard in Dark Travels",
    "",
    "November 18th, 2025",
    "- Introduced the Dark Travels gamemode. Good luck.",
    "",
    "November 16th, 2025 - Evening",
    "- Base protectors no longer modify pushFactor due to strange behavior.",
    "- Animated color support.",
    "- Radience no longer uses two extra entities and functions alone.",
    "- Radience has been renamed back to Shiny. (Though there are multiple levels now)",
    "- Refactored Radiance/Shiny to have multiple levels, adjusted rarities. (Currently no extra visuals)",
    "- Made circle maze walls half as large due to shapes getting stuck and lagging the server.",
    "",
    "November 16th, 2025 - Morning",
    "- Buffed base drone damage (0.5 -> 1.0)",
    "- Nerfed base drone push factor (10 -> 8)",
    "- Fix base drones rendering under the base protectors.",
    "",
    "More in the repository..."
    // Off the screen
    /*
    "November 15th, 2025",
    "- Fixed circle walls on minimap rendering incorrectly sometimes. (Thanks xScripty!)",
    "- Fixed several grammar issues in the changelog and readme.",
    "- Added Crasher Clumps!",
    "- Added unique color for Pentamancer triangles",
    "- Added base protectors",
    "- Replaced shiny variants with \"Radiant\" variants (more radiance levels coming soon)",
    "",
    "November 14th, 2025",
    "- Fixed General's swarm drones not targeting properly",
    "- Buffed Pentamancer, it can now claim all shapes and those shapes can merge into higher shapes.",
    "- New Spike/Landmine tank: Claymore",
    "- New Landmine tank: Booby",
    "- Removed 'Rough' maze walls as they added nothing...",
    "- Circle walls in maze are no longer guaranteed.",
    "- Added Discord server to in-game changelog",
    "- Base drones no longer target shapes",
    "- Added Drone Dominators",
    "",
    "November 13th, 2025 - Evening",
    "- Changed stat names for Workshop to better match weapons.",
    "- Enabled leaderboard in Domination gamemode.",
    "- Clarified that flame launchers do more damage when close in upgrade message.",
    "- Added flame launcher upgrade message to Flame Guard",
    "- Enabled rare alpha shapes around the map",
    "- Added new Circle and 'Rough' maze walls.",
    "- Dominators now award 1,200 score on kill.",
    "",
    "November 13th, 2025 - Morning",
    "- New title menu background! This will be replaced with a custom render at some point.",
    "- New Incinerator tank: Atomizer",
    "- New Flamer tank: Flame Guard",
    "- New Flame Guard tank: Tri flamer",
    "- New Flamer tank: Fumigator",
    "- Flamer can now upgrade from Sniper",
    "- Fixed Flamer branch looking incorrect in upgrades.",
    "- Fixed new Smasher branch tanks.",
    "- Fixed Triple Auto Turrets not scaling with tank.",
    "- Corrected tab title from \"DogeisDiep\" to \"Dogeis Diep\"",
    "",
    "November 12th, 2025",
    "- Hello World!",
    "- TODO: fill in all the changes made the 12th and before",
    "- But as a summary: Added level 60 tanks (except for a few), increased shiny chance,",
    "Added Plane branch, added Flamer branch, allowed players to level up to level 60,",
    "Added Auto Tank, and probably some other stuff."
    */
];

// Only send pings every 500ms
const PING_THROTTLE_MS = 500;

const ASM_CONSTS = {
    1024: "createCanvasCtxWithAlpha",
    3781: "createImage",
    4211: "websocketSend",
    4388: "wipeContext",
    4528: "modulo",
    4551: "wipeSocket",
    4777: "setTextInput",
    4827: "wipeImage",
    4902: "reloadWindowTimeout",
    4968: "existsInWindowObject",
    5011: "empty", // ads
    5093: "empty", // ads
    5124: "empty", // ads
    5443: "empty", // ads
    5506: "empty", // ads
    5563: "empty", // ads
    5827: "getQueries",
    6547: "empty", // ads
    6927: "empty", // ads
    7068: "getLocalStorage",
    7293: "deleteLocalStorage",
    7343: "removeChildNode",
    7449: "checkElementProperty",
    7675: "existsQueryOrIsBlank",
    7886: "empty", // ads
    8008: "setLocalStorage",
    8254: "empty", // ads
    8472: "empty", // ads
    9178: "empty", // ads
    9362: "getGamepad",
    9558: "toggleFullscreen",
    10188: "getCanvasSize",
    10299: "setCursorDefault",
    10363: "setCursorPointer",
    10427: "setCursorText",
    10488: "getTextInput",
    10530: "enableTyping",
    11181: "disableTyping",
    11296: "focusCanvas",
    11444: "setCanvasSize",
    11529: "empty", // anti cheat
    11586: "copyUTF8",
    11637: "alert",
    11884: "saveContext",
    11952: "restoreContext",
    12020: "scaleContextAlpha",
    12063: "empty", // ads
    12501: "empty", // ads
    12976: "empty", // ads
    13247: "empty", // ads
    13331: "empty", // ads
    13414: "setContextFillStyle",
    13493: "setContextTransform",
    13560: "contextFillRect",
    13611: "contextBeginPath",
    13645: "contextClip",
    13674: "contextFill",
    13703: "setContextLineJoinRound",
    13744: "setContextLineJoinBevel",
    13785: "setContextLineJoinMiter",
    13826: "setContextLineWidth",
    13863: "setContextStrokeStyle",
    13939: "setContextTransformBounds",
    14002: "contextStroke",
    14033: "contextRect",
    14072: "getFontsLoaded",
    14174: "setContextFont",
    14240: "measureContextTextWidth",
    14308: "setContextAlpha",
    14347: "contextFillText",
    14402: "contextStrokeText",
    14459: "setContextTextBaselineTop",
    14502: "setContextTextBaselineHanging",
    14549: "setContextTextBaselineMiddle",
    14595: "setContextTextBaselineAlphabetic",
    14645: "setContextTextBaselineIdeographic",
    14696: "setContextTextBaselineBottom",
    15084: "setContextTransformNormalize",
    15137: "contextMoveTo",
    15178: "contextLineTo",
    15215: "contextClosePath",
    15288: "contextArc",
    16282: "copyToKeyboard",
    16505: "setLocation",
    16959: "contextDrawImage",
    24403: "getImage",
    24601: "contextDrawCanvas",
    24706: "setContextLineCapButt",
    24745: "setContextLineCapRound",
    24785: "setContextLineCapSquare",
    25012: "contextStrokeRect",
    25057: "contextDrawFullCanvas",
    25399: "isContextPatternAvailable",
    25462: "createContextPattern",
    25748: "contextGetPixelColor",
    25862: "contextDrawCanvasSourceToPixel",
    25954: "contextFillRectWithPattern",
    26051: "wipePattern",
    26281: "empty", // ?
    26345: "empty", // ?
    26430: "existsQuery",
    26890: "empty", // anti cheat
    26958: "canvasHasSamePropertyAsDocumentBody",
    27065: "existsDocumentBodyProperty",
    27120: "existsDocumentBodyProperty2",
    27166: "existsDivPropertyAndEqualsPropertyOnDocumentBody",
    27326: "empty", // anti cheat
    27575: "empty", // anti cheat
    27656: "empty", // anti cheat
    27778: "acCheckWindow", // anti cheat
    27886: "getDocumentBody",
    27945: "empty", // anti cheat
    28057: "empty", // anti cheat
    28125: "getUserAgent",
    28186: "empty", // anti cheat
    28407: "getQuerySelectorToString",
    28509: "getFillTextToString",
    28632: "getStrokeRectToString",
    28757: "getStrokeTextToString",
    28882: "getScaleToString",
    29002: "getTranslateToString",
    29126: "getFillRectToString",
    29249: "getRotateToString",
    29370: "getGetImageDataToString",
    29518: "empty", // ads
    29633: "contextClearRect",
    29740: "createCanvasCtx",
    29980: "setContextMiterLimit",
    30178: "getWindowLocation",
    30225: "setLoadingStatus",
    30352: "m28nReply",
    30767: "isSSL",
    30836: "createWebSocket",
    31548: "findServerById",
    31923: "invalidPartyId",
    31954: "wipeLocation",
    32047: "getGamepadAxe",
    32156: "getGamepadButtonPressed",
    32290: "pollWebSocketEvent",
    32446: "updateToNewVersion",
    32506: "empty", // pow
    32813: "reloadWindow",
    32840: "getWindowLocationSearch",
    32889: "getWindowReferrer",
    33085: "empty", // fingerprinting
    33169: "empty", // fingerprinting
    33222: "empty", // fingerprinting
    33330: "empty", // fingerprinting
    33425: "empty", // fingerprinting
    33488: "empty", // fingerprinting
    33528: "empty", // fingerprinting
};

const WASM_IMPORTS = {
    "i": "assertFail",
    "q": "mapFile",
    "p": "sysMunmap",
    "b": "abort",
    "d": "asmConstsDII",
    "a": "asmConstsIII",
    "j": "exitLive",
    "m": "exitForce",
    "g": "getNow",
    "n": "memCopyBig",
    "e": "random",
    "f": "resizeHeap",
    "r": "setMainLoop",
    "k": "envGet",
    "l": "envSize",
    "h": "fdWrite",
    "c": "roundF",
    "o": "timeString",
    "memory": "wasmMemory",
    "table": "wasmTable"
};

const WASM_EXPORTS = {
    "s": "wasmCallCtors", // constructors
    "t": "connect", // used to connect to ip, unused
    "u": "hasTank", // does player have a tank
    "v": "setConvar", // sets console var
    "w": "getConvar", // gets console var
    "x": "execute", // execute console cmd
    "y": "printConsoleHelp", // prints console help
    "z": "main", // main function
    "A": "checkWS", // polls ws
    "B": "free", // frees memory
    "C": "videoAdsLoaded", // event for ads loaded, unused
    "D": "videoAdsDone", // event for ad done, unused
    "E": "mouse", // sets mouse pos
    "F": "keyDown", // sets key down
    "G": "keyUp", // sets key up
    "H": "resetKeys", // resets key listeners
    "I": "preventRightClick", // should prevent right click if true
    "J": "flushInputHooks", // flushes all inputs (keys, mouse, gamepad)
    "K": "mouseWheel", // sets mouse wheel delta
    "L": "cp5Idle", // idle mode, unused
    "M": "cp5Destroy", // destroy cp5 obj, unused
    "N": "powResult", // pow result, unused 
    "O": "restReply", // server finder reply 
    "P": "getErrorLocation", // gets pointer for setting error code
    "Q": "malloc", // allocates memory
    "R": "dynCallVI", // dynamic func call (v = void, i = integer as arg, d = double as arg, f = float as arg)
    "S": "dynCallV" // dynamic func call (v = void, i = integer as arg, d = double as arg, f = float as arg)
};

const MOD_CONFIG = {
    "wasmFunctions": {
        "loadGamemodeButtons": 296,
        "loadVectorDone": 22,
        "loadChangelog": 447,
        "loadTankDefinitions": 277,
        "getTankDefinition": 101,
        "findCommand": 496,
        "decodeComponentList": 221,
        "createEntityAtIndex": 114
    },
    "memory": {
        "gamemodeDisabledText": 16420,
        "gamemodeButtons": 113480,
        "changelog": 167328,
        "changelogLoaded": 168632,
        "tankDefinitions": 166572,
        "tankDefinitionsCount": 166576,
        "commandList": 53064,
        "netColorTable": 49584
    },
    "wasmFunctionHookOffset": {
        "gamemodeButtons": 33,
        "changelog": 28
    }
};

const ADDON_MAP = {
    "trapLauncher": 147,
    "auto3": 148,
    "smasher": 149,
    "pronounced": 150,
    "landmine": 151,
    "auto5": 153,
    "autoturret": 154, // Auto Trapper (154) & Auto Gunner (152)
    "autosmasher": 155,
    "spike": 156,
    "launcher": 157, // Skimmer (157) & Rocketeer (158)
    "dombase": 159,
    "dompronounced": 160, // Dom1 (160) & Dom2 (161) 
    "auto7": 161,
    "tripleAutoturret": 162,
    "wings": 163,
    "-50distance": 164,
    "pentagonBody": 165,
    "wraith": 166,
    "tripeAutosmasher": 167,
    "razor": 168,
    "scavenger": 169,
    "ravenger": 170,
    "protectorBase": 171,
    "protectorTurret": 172,
    "crasherGrunt": 173,
    "preDarkGuardian": 174,
    "postDarkGuardian": 175,
    "metaturret": 176,
    "satelliteAntenna": 177,
    "vcrDeco": 178
};



const CUSTOM_ADDONS = {
    // This is a tutorial addon made for showcasing how custom addon renders are to be defined.
    "tutorial": entity => {
        // This if statement isnt totally necessary but might help your IDE recognize the type of "entity" which simplifies development later. It can be removed.
        if(!(entity instanceof $Entity)) return;
        
        /*
        We are currently on the root level meaning we can only access the "entity" the addon is placed upon. This means that "entity" is either a barrel or a tank.
        It is possible to change its data even at the root level.

        Each instance of "$Entity" has the following properties:
        - positionData
            -> Stores data about the entitie's position and angle, if the entity has a parent the x and y coordinates will be relative to the parents position.
        - physicsData
            -> Stores data about the entitie's collision properties (its size, sides, width, if it is a trapezoid).
        - styleData
            -> Stores data about how the entity is rendered, whether or not its visible, its color and so on.
        - barrelData
            -> This field is only defined if the entity actually is a barrel. It only has the shootingAngle property.
        - parent
            -> If this $Entity instance has been created via a createChild call, then this property stores a reference to its creator / parent. (ONLY DIRECT PARENT!)
        - children
            -> If this entity created children via createChild calls, then this property stores references to those children. (ONLY DIRECT CHILDREN!)
        As well as the following methods:
        - clone(source: $Entity)
            -> Clones the sources position, physics, style and barrelData to the current entity.
        - createChild(isBarrel: boolean)
            -> Creates either a regular object entity or a barrel entity and sets its parent as this entity.
        - defaults()
            -> Sets the default values for position, physics, style and barrelData. Check out the default values in "./dma.js".
        
        Each of the "[...]Data" fields has similarly .clone(source: Self) and defaults() methods.
        
        You may not set the properties of $Entity manually. Instead use the "[...]Data" fields or .clone() / .defaults().
        So don't do this: "someEntity.positionData = someOtherEntity.positionData;", but instead do this: "someEntity.positionData.clone(someOtherEntity.positionData);".
        */
    },
    "auto7": entity => {
        if(!(entity instanceof $Entity)) return;
        if (!(entity instanceof $Entity)) return;
                
        const rotator = entity.createChild(false);
        rotator.defaults();
        rotator.physicsData.size = 5;
        rotator.positionData.angle = 0.01;
        rotator.positionData.isAngleAbsolute = true;
        rotator.styleData.isVisible = false;

        const count = 7;
        for(let i = 0; i < count; ++i) {
            const socket = rotator.createChild(false);
            socket.defaults();
            
            socket.positionData.angle = i * Math.PI * 2 / count;
            socket.positionData.x = Math.cos(socket.positionData.angle) * 40;
            socket.positionData.y = Math.sin(socket.positionData.angle) * 40;
            socket.physicsData.size = 25;
            // Color.Barrel
            socket.styleData.color = 1;

            const barrel = socket.createChild(true);
            barrel.defaults();
            barrel.physicsData.size = 55;
            barrel.physicsData.sides = 2;
            barrel.physicsData.width = 0.7 * 42;
            // angle + shootingAngle
            barrel.positionData.angle = 0;
            // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
            barrel.positionData.x = Math.cos(0) * (barrel.physicsData.size / 2 + 0) - Math.sin(0) * 0;
            // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
            barrel.positionData.y = Math.sin(0) * (barrel.physicsData.size / 2 + 0) - Math.cos(0) * 0;
            // Color.Barrel
            barrel.styleData.color = 1;
        }
    },
    "tripleAutoturret": entity => {
        // This if statement isnt totally necessary but might help your IDE recognize the type of "entity" which simplifies development later. It can be removed.
        if (!(entity instanceof $Entity)) return;
        
        const turretCount = 3;
		const rotationOffset = 0.6;

        for (let i = 0; i < turretCount; i++) {
            const angle = (Math.PI * 2 * i) / turretCount;

            const socket = entity.createChild(false);
            socket.defaults();
            
            socket.styleData.showsAboveParent = true;
            socket.positionData.angle = angle;
            socket.positionData.x = Math.cos(socket.positionData.angle) * 40 * rotationOffset;
            socket.positionData.y = Math.sin(socket.positionData.angle) * 40 * rotationOffset;
            socket.physicsData.size = 25 * 0.6;
            socket.styleData.color = 1;

            const barrel = socket.createChild(true);
            barrel.defaults();
            barrel.physicsData.size = 55 * 0.6;
            barrel.physicsData.sides = 2;
            barrel.physicsData.width = 0.7 * 42 * 0.6;
            barrel.positionData.angle = 0;
            barrel.positionData.x = Math.cos(0) * (barrel.physicsData.size / 2 + 0) - Math.sin(0) * 0;
            barrel.positionData.y = Math.sin(0) * (barrel.physicsData.size / 2 + 0) - Math.cos(0) * 0;
            barrel.styleData.color = 1;
        }
    },
    "flameLauncher": entity => {
        if (!(entity instanceof $Entity)) return;

        const rect1 = entity.createChild(false);
        rect1.defaults();
        rect1.styleData.color = 1;
        rect1.styleData.showsAboveParent = true;
        rect1.physicsData.isTrapezoid = true;
        rect1.physicsData.sides = 2;
        rect1.physicsData.width = entity.physicsData.width;
        rect1.physicsData.size = entity.physicsData.width * (20 / 42);
        rect1.positionData.x = (entity.physicsData.size + rect1.physicsData.size) / 2
        rect1.positionData.angle = 3.141592653589793;
    },
    "wings": entity => {
        if (!(entity instanceof $Entity)) return;
        entity.createDecoChild(2,65, 120,28,65,0,false,entity.styleData.color)
        entity.createDecoChild(2,65,-120,28,65,0,false,entity.styleData.color)
    },
    "-50Distance": entity => {
        if (!(entity instanceof $Entity)) return;

        //TODO: this isnt correct somehow... I suspect it has something to do with the half offset barrels have.
        entity.offsetDistance(-50)
    },
    "pentagonBody": entity => {
        if (!(entity instanceof $Entity)) return;

        entity.physicsData.sides = 5;
    },
    "wraith": entity => {
        if (!(entity instanceof $Entity)) return;
        entity.createDecoChild(3,15,0,  undefined,20,0,true, 1)
        entity.createDecoChild(3,15,180,undefined,20,0,true, 1)
    },
    "tripleAutosmasher": entity => {
        // This if statement isnt totally necessary but might help your IDE recognize the type of "entity" which simplifies development later. It can be removed.
        if (!(entity instanceof $Entity)) return;
        
        const turretCount = 3;
		const rotationOffset = 0.6;

        for (let i = 0; i < turretCount; i++) {
            const angle = (Math.PI * 2 * i) / turretCount;

            const socket = entity.createChild(false);
            socket.defaults();
            
            socket.styleData.showsAboveParent = true;
            socket.positionData.angle = angle;
            socket.positionData.x = Math.cos(socket.positionData.angle) * 40 * rotationOffset;
            socket.positionData.y = Math.sin(socket.positionData.angle) * 40 * rotationOffset;
            socket.physicsData.size = 25 * 0.6;
            socket.styleData.color = 1;

            const barrel = socket.createChild(true);
            barrel.defaults();
            barrel.physicsData.size = 55 * 0.6;
            barrel.physicsData.sides = 2;
            barrel.physicsData.width = 0.7 * 42 * 0.6;
            barrel.positionData.angle = 0;
            barrel.positionData.x = Math.cos(0) * (barrel.physicsData.size / 2 + 0) - Math.sin(0) * 0;
            barrel.positionData.y = Math.sin(0) * (barrel.physicsData.size / 2 + 0) - Math.cos(0) * 0;
            barrel.styleData.color = 1;
        }
        entity.createDecoChild(6,25*1.15,0,undefined,0,0,false, 0)
    },
    "razor": entity => {
        if (!(entity instanceof $Entity)) return;
        const numberOfGuards = 8
		const angleStep = (Math.PI * 2) / numberOfGuards;
		for (let i = 0; i < numberOfGuards; i++) {
			const currentAngle = angleStep * i;
            entity.createDecoChild(3,25*1.3,currentAngle*180/Math.PI,undefined,0,0,false, 0)
		}
        
    },
    "scavenger": entity => {
        if (!(entity instanceof $Entity)) return;
        //this probably isnt accurate, might want to modify to use radians for angle and a multiplier for the size
        entity.createDecoChild(5,25*1.3,0,undefined,0,0,false, 0)
    },
    "ravenger": entity => {
        if (!(entity instanceof $Entity)) return;
        entity.createDecoChild(5,25*1.3,0,undefined,0,0,false, 0)
    },
	
    /* Broken */
	"protectorBase": entity => {
		if (!(entity instanceof $Entity)) return
		
		const shieldEntity = entity.createChild(false)
		shieldEntity.defaults()
		
		shieldEntity.physicsData.sides = 8
		shieldEntity.physicsData.size = entity.physicsData.size * 1.3
	},
	
    /* Broken */
	"protectorTurret": entity => {
		if (!(entity instanceof $Entity)) return
		
		const baseGuard = entity.createChild(false)
		baseGuard.defaults()
		baseGuard.physicsData.sides = 8
		baseGuard.physicsData.size = entity.physicsData.size * 0.8
		baseGuard.styleData.showsAboveParent = true
		
		const topperGuard = entity.createChild(false)
		topperGuard.defaults()
		topperGuard.physicsData.sides = 1
		topperGuard.physicsData.size = entity.physicsData.size * 0.7
		topperGuard.styleData.showsAboveParent = true
		topperGuard.styleData.color = entity.styleData.color
	},
	
    /* Broken */
	"crasherGrunt": entity => {
        if (!(entity instanceof $Entity)) return
        
        entity.physicsData.sides = 7
		
		const topper = entity.createChild(false)
		topper.defaults()
		topper.physicsData.sides = 1
		topper.physicsData.size = entity.physicsData.size * 1.2
		topper.styleData.showsAboveParent = true
		
		const turretEntity = entity.createChild(true)
		turretEntity.defaults()
		turretEntity.physicsData.size = 35
		turretEntity.physicsData.width = 42 * 0.7
		turretEntity.styleData.color = 1
		
		turretEntity.positionData.x = (turretEntity.physicsData.size / 2)
	},
	
    /* Broken */
	"preDarkGuardian": entity => {
		if (!(entity instanceof $Entity)) return
		
        entity.physicsData.sides = 10

		const guardEntity = entity.createChild(false)
		guardEntity.defaults()
		guardEntity.physicsData.sides = 10
		guardEntity.physicsData.size = entity.physicsData.size * 1.7
		guardEntity.positionData.isAngleAbsolute = false
	},
	
    /* Broken */
    "postDarkGuardian": entity => {
		if (!(entity instanceof $Entity)) return
		
		const baseGuard = entity.createChild(false)
		baseGuard.defaults()
		baseGuard.physicsData.sides = 1
		baseGuard.physicsData.size = entity.physicsData.size * 1.1
		baseGuard.styleData.showsAboveParent = true
		baseGuard.positionData.isAngleAbsolute = false
		
		const numberOfSideTurrets = 10
		const distanceScale = 1.1
		
		for (let i = 0; i < numberOfSideTurrets; i++) {
			const orbitAngle = (Math.PI * 2 * i) / numberOfSideTurrets
			
			const socketEntity = entity.createChild(false)
			socketEntity.defaults()
			socketEntity.styleData.color = 1
			
			socketEntity.positionData.x = Math.cos(orbitAngle) * entity.physicsData.size * distanceScale
			socketEntity.positionData.y = Math.sin(orbitAngle) * entity.physicsData.size * distanceScale
			
			const decoOuter = socketEntity.createChild(false)
			decoOuter.defaults()
			decoOuter.physicsData.sides = 1
			decoOuter.physicsData.size = 14
			
			const decoInner = socketEntity.createChild(false)
			decoInner.defaults()
			decoInner.physicsData.sides = 1
			decoInner.physicsData.size = 10
			decoInner.styleData.color = entity.styleData.color
			
			const barrelEntity = socketEntity.createChild(true)
			barrelEntity.defaults()
			barrelEntity.physicsData.size = 12
			barrelEntity.physicsData.width = 8 * 0.7
			barrelEntity.positionData.x = barrelEntity.physicsData.size / 2
			barrelEntity.styleData.color = 1
		}
		
		const mainBarrelA = entity.createChild(true)
		mainBarrelA.defaults()
		mainBarrelA.physicsData.size = 105
		mainBarrelA.physicsData.width = 32 * 0.7
		mainBarrelA.positionData.x = mainBarrelA.physicsData.size / 2
		mainBarrelA.styleData.color = entity.styleData.color
		
		const mainBarrelB = entity.createChild(true)
		mainBarrelB.defaults()
		mainBarrelB.physicsData.size = 55
		mainBarrelB.physicsData.width = 42 * 0.7
		mainBarrelB.positionData.x = mainBarrelB.physicsData.size / 2
		mainBarrelB.styleData.color = entity.styleData.color
    },
    
    /* Broken */
    "metaturret": entity => {
		if (!(entity instanceof $Entity)) return
		
		const rotatorEntity = entity.createChild(false)
		rotatorEntity.defaults()
		rotatorEntity.styleData.isVisible = false
        rotatorEntity.positionData.isAngleAbsolute = true
        rotatorEntity.styleData.showsAboveParent = true
		
		const parentBarrels = []
        for (const childEntity of entity.children) {
            if (childEntity.barrelData) parentBarrels.push(childEntity)
        }
		
		for (const original of parentBarrels) {
			const clone = rotatorEntity.createChild(true)
			clone.defaults()
			
			clone.physicsData.size = original.physicsData.size / 2
			clone.physicsData.width = original.physicsData.width / 2
			clone.positionData.angle = original.positionData.angle
			clone.styleData.color = 1
		}
    },

    "vcrDeco": entity => {
        if (!(entity instanceof $Entity)) return
	
        const rotatorEntity = entity.createChild(false)
        rotatorEntity.defaults()
        rotatorEntity.physicsData.sides = 0
        rotatorEntity.styleData.showsAboveParent = true
        rotatorEntity.positionData.absoluteRotation = true
	
        const leftEntity = rotatorEntity.createDecoChild(
            2,
            15,
            0,
            250,
            20,
            0,
            true,
            1
        )
	
        const rightEntity = rotatorEntity.createDecoChild(
            2,
            15,
            180,
            250,
            20,
            0,
            true,
            1
        )
    }
}

function makeSatelliteAntennaAddon(satelliteCount) {
	return entity => {
		if (!(entity instanceof $Entity)) return
		
		const satellites = satelliteCount
		
		const baseEntity = entity.createChild(false)
		baseEntity.defaults()
		baseEntity.styleData.color = 1
		baseEntity.styleData.showsAboveParent = true
		baseEntity.physicsData.sides = 2
		
		baseEntity.physicsData.width = entity.physicsData.width
		baseEntity.physicsData.size = entity.physicsData.size * (2/3)
		baseEntity.positionData.x = (-entity.physicsData.size / 2) + (baseEntity.physicsData.size / 2)
		
		const bulbEntity = entity.createChild(false)
		bulbEntity.defaults()
		bulbEntity.styleData.color = 1
		bulbEntity.styleData.showsAboveParent = true
		bulbEntity.physicsData.sides = satellites
		
		entity.physicsData.width /= 2
		
        bulbEntity.physicsData.size = entity.physicsData.width
        bulbEntity.physicsData.size *= satellites === 2 ? 1.2 : Math.SQRT1_2
		bulbEntity.physicsData.width = entity.physicsData.width / 2
		bulbEntity.positionData.x = entity.physicsData.size / 2
		bulbEntity.positionData.angle = satellites === 4 ? Math.PI / 4 : satellites === 3 ? Math.PI : 0
	}
}


CUSTOM_ADDONS["satelliteAntenna1"] = makeSatelliteAntennaAddon(1)
CUSTOM_ADDONS["satelliteAntenna2"] = makeSatelliteAntennaAddon(2)
CUSTOM_ADDONS["satelliteAntenna3"] = makeSatelliteAntennaAddon(3)
CUSTOM_ADDONS["satelliteAntenna4"] = makeSatelliteAntennaAddon(4)
CUSTOM_ADDONS["satelliteAntenna5"] = makeSatelliteAntennaAddon(5)
CUSTOM_ADDONS["satelliteAntenna6"] = makeSatelliteAntennaAddon(6)
CUSTOM_ADDONS["satelliteAntenna8"] = makeSatelliteAntennaAddon(8)
CUSTOM_ADDONS["satelliteAntenna10"] = makeSatelliteAntennaAddon(10)
CUSTOM_ADDONS["satelliteAntenna12"] = makeSatelliteAntennaAddon(12)

const CUSTOM_COMMANDS = [
    {
        "id": "util_test",
        "description": "Test command to check if custom commands are working, prints 'Hello World' to the console",
        "callback": args => { // array of strings, you need to parse them yourself
            console.log("Hello World");
        }
    }, {
        "id": "util_set_dev_password",
        "usage": "[password]",
        "description": "Sets the dev password (reconnect required)",
        "callback": args => {
            if(!args[0]) return;
            window.localStorage.setItem("password", args[0]);
        }
    }, {
        "id": "util_change_scheduler",
        "usage": "[?scheduler]",
        "description": "Changes the game's frame scheduler (default: requestAnimationFrame)",
        "callback": args => {
            // possible alternative would be setTimeout eg.
            Module.scheduler = typeof window[args[0]] === "function" ? window[args[0]] : window.requestAnimationFrame;
        }
    }, {
        "id": "util_reload_servers",
        "usage": "[?interval]",
        "description": "Sets the interval in which gamemodes are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadServersInterval = -1;
                        case "connect":
                            return Module.reloadServersInterval = -2;
                    }
                }
                return Module.reloadServersInterval = num;
            }
            Game.reloadServers();
        }
    }, {
        "id": "util_reload_tanks",
        "usage": "[?interval]",
        "description": "Sets the interval in which tanks are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadTanksInterval = -1;
                        case "connect":
                            return Module.reloadTanksInterval = -2;
                    }
                }
                return Module.reloadTanksInterval = num;
            }
            Game.reloadTanks();
        }
    }, {
        "id": "util_reload_commands",
        "usage": "[?interval]",
        "description": "Sets the interval in which commands are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadCommandsInterval = -1;
                        case "connect":
                            return Module.reloadCommandsInterval = -2;
                    }
                }
                return Module.reloadCommandsInterval = num;
            }
            Game.reloadCommands();
        }
    }, {
        "id": "util_set_changelog",
        "usage": "[line 1\\n] [line 2] ...",
        "description": "Sets the changelog to the given text, remember to use \\n before and after each line",
        "callback": args => {
            Game.changeChangelog(args.join(' ').split("\\n"));
        }
    }
];

const COMMANDS_LOOKUP = {
    "con_toggle": 52952,
    "game_spawn": 52992,
    "help": 49956,
    "lb_reconnect": 50056,
    "net_replace_color": 50152,
    "net_replace_colors": 50192,
    "ui_replace_colors": 49916
};

const WASM_TABLE = {
    "initial": 687,
    "element": "anyfunc"
};

const INITIAL_MEMORY = 67108864;
const WASM_PAGE_SIZE = 65536; // A WebAssembly page has a constant size of 65,536 bytes, i.e., 64KiB

const DYNAMIC_BASE = 5426112; // start of dynmic memory
const DYNAMIC_TOP_PTR = 183072; // points to start of dynamic memory

const SOCKET_PTR = 104440; // points to the socket struct in memory
const LAST_PING_TIME_OFFSET = 8; // offset containing the last ping time in the socket struct
const TIME_NOW_PTR = 113208; // points to the current time value in memory

const WASM_MEMORY = {
    "initial": INITIAL_MEMORY / WASM_PAGE_SIZE,
    "maximum": INITIAL_MEMORY / WASM_PAGE_SIZE
};

const FIELD_OFFSETS = {
    basic: {
        owner: 20,
        parent: 32
    },
    position: {
        y: 8,
        x: 40,
        angle: 72,
        flags: 104
    },
    collidable: {
        size: 16,
        sides: 48,
        width: 64,
        flags: 104
    },
    renderable: {
        color: 12,
        flags: 20,
        borderWidth: 32,
        opacity: 64
    },
    cannon: {
        shootingAngle: 8,
    }
};

const FLAGS = {
    absoluteRotation: 1 << 0,
    isTrapezoid: 1 << 0,
    isVisible: 1 << 0,
    renderFirst: 1 << 3,
    isStar: 1 << 4,
    isCachable: 1 << 5,
    showsAboveParent: 1 << 6
};
