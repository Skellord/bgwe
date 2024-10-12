import Konva from 'konva';

import { EntitiesController, Entity } from './entities';
import { Rules, RulesController } from './rules';
import { EventBus, EventsController } from './events';
import { StateController } from './state';

export interface EngineConfig {
    name: string;
    version: string;
    entities: Entity[];
    rules?: Rules;
}

export class GameEngine {
    private _eventsController: EventsController;
    private _stateController: StateController;
    private readonly _entitiesController: EntitiesController;
    private _rulesController: RulesController;
    private _config: EngineConfig;
    private _eventBus: EventBus = new EventBus();
    mainLayer: Konva.Layer = new Konva.Layer();
    dragLayer: Konva.Layer = new Konva.Layer();
    stage: Konva.Stage;

    constructor(config: EngineConfig) {
        this._config = config;
        this.stage = new Konva.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight,
        });

        this._eventsController = new EventsController(this);
        this._entitiesController = new EntitiesController(this);
        this._stateController = new StateController(this);
        this._rulesController = new RulesController(this);
    }

    init() {
        this._config.entities.forEach(e => {
            this._entitiesController.addEntity(e);
        });

        this.stage.add(this.mainLayer);
        this.stage.add(this.dragLayer);
        this._entitiesController.renderEntities();
        this._eventsController.subscribe();

        if (this._config.rules?.params) {
            this._rulesController.registerParameters(this._config.rules.params);
        }

        if (this._config.rules?.actions) {
            this._rulesController.registerActions(this._config.rules.actions);
            this._rulesController.activateActions();
        }
    }

    private reinitEntities(entities: Entity[]) {
        this._eventBus.unsubscribeAll();
        this._entitiesController.destroyEntities();
        this.mainLayer.destroyChildren();
        this.mainLayer.draw();
        this.dragLayer.destroyChildren()
        this.dragLayer.draw();
        this._eventsController = new EventsController(this);

        entities.forEach(e => {
            this._entitiesController.addEntity(e);
        });

        this._eventsController.subscribe();
        this._entitiesController.renderEntities();
    }

    get entitiesController() {
        return this._entitiesController;
    }

    get eventBus() {
        return this._eventBus;
    }

    saveState() {
        this._stateController.saveState();
    }

    loadState() {
        const entities = this._stateController.getState();
        console.log(entities)
        this.reinitEntities(entities);
        console.log(this);
    }
}
