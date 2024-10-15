import Konva from 'konva';

import { EntitiesController, Entity } from './entities';
import { Rules, RulesController } from './rules';
import { EventBus, EventsController } from './events';
import { StateController } from './state';
import { NetworkAdapter } from '../network/Network.ts';

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
    private _networkAdapter?: NetworkAdapter;
    mainLayer: Konva.Layer = new Konva.Layer();
    dragLayer: Konva.Layer = new Konva.Layer();
    stage: Konva.Stage;

    constructor(config: EngineConfig, networkAdapter?: NetworkAdapter) {
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
        this._networkAdapter = networkAdapter;

        this._networkAdapter?.setOnUpdateCb(this.onUpdate.bind(this))
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

        this._eventBus.subscribe('_change', eventData => {
            console.log('change')
            this._stateController.saveState();
            const e = this._stateController.getState();
            this?._networkAdapter?.sendData(e);
        });
    }

    reinitEntities(entities: Entity[]) {
        this._eventBus.unsubscribeAll();
        this._entitiesController.destroyEntities();
        this.mainLayer.destroyChildren();
        this.mainLayer.draw();
        this.dragLayer.destroyChildren()
        this.dragLayer.draw();

        entities.forEach(e => {
            this._entitiesController.addEntity(e);
        });

        this._eventsController.subscribe();
        this._entitiesController.renderEntities();

        this._eventBus.subscribe('_change', eventData => {
            console.log('change')
            this._stateController.saveState();
            const e = this._stateController.getState();
            this?._networkAdapter?.sendData(e);
        });
    }

    private onUpdate(data: any) {
        console.log('onupdate', data)
        if (data.state) {
            this.reinitEntities(data.state);
        }
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

    getState() {
        return this._stateController.getState();
    }

    receiveData(data: any) {
        console.log(data);
        this.reinitEntities(data.state)
    }
}
