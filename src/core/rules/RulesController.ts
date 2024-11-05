import Konva from 'konva';

import { GameEngine } from '../GameEngine.ts';
import { ParamsStore } from './ParamsStore.ts';
import { Action, GameParameters } from './types.ts';
import { ActionsStore } from './ActionsStore.ts';

export class RulesController {
    private _stage: Konva.Stage;
    private readonly _paramsStore: ParamsStore;
    private _actionsStore: ActionsStore = new ActionsStore();

    constructor(gameEngine: GameEngine) {
        this._paramsStore = new ParamsStore(gameEngine.eventBus);
        this._stage = gameEngine.stage;
    }

    registerParameters(params: GameParameters) {
        for (const parameter in params) {
            this._paramsStore.addParameter({
                [parameter]: params[parameter],
            });
        }
    }

    registerActions(actions: Action[]) {
        this._actionsStore.addActions(actions);
    }

    activateActions() {
        this._actionsStore.actions.forEach(a => {
            //TODO: сделать валидацию на таргет ид
            this._stage.on(a.on, eventData => {
                a.handler({ ...eventData, paramsStore: this.paramsStore });
            });
        });
    }

    get paramsStore() {
        return this._paramsStore;
    }
}
