import * as util from "../../../util";

import Trap from "./Trap";

export default class InvisiTrap extends Trap {
    public tick(tick: number): void {
        super.tick(tick)
        this.styleData.opacity -= 0.05
        
        this.styleData.opacity = util.constrain(this.styleData.values.opacity, 0, 1);
    }
}