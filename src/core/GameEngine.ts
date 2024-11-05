import Konva from 'konva';

import { EntitiesConfig, ObjectsController } from './objects';
import { Rules, RulesController } from './rules';
import { EventBus, EventsController, InternalEvents } from './events';
import { StateController } from './state';
import { NetworkAdapter } from '../network';
import { UIManager } from './ui/UIManager.ts';

export interface EngineConfig {
    name: string;
    version: string;
    entities: EntitiesConfig;
    rules?: Rules;
    width?: number;
    height?: number;
    background?: string;
    containerName?: string;
    settings?: {
        rotateAngle?: number;
    };
}

export class GameEngine {
    private _eventsController: EventsController;
    private _stateController: StateController;
    private readonly _objectsController: ObjectsController;
    private _rulesController: RulesController;
    private _config: EngineConfig;
    private _eventBus: EventBus = new EventBus();
    private _networkAdapter?: NetworkAdapter;
    private _uiManager: UIManager;
    mainLayer: Konva.Layer = new Konva.Layer();
    dragLayer: Konva.Layer = new Konva.Layer();
    stage: Konva.Stage;

    constructor(config: EngineConfig, networkAdapter?: NetworkAdapter) {
        this._config = config;

        this.stage = new Konva.Stage({
            container: config.containerName ?? 'container',
            width: config.width ?? window.innerWidth,
            height: config.height ?? window.innerHeight,
        });

        this._eventsController = new EventsController(this);
        this._objectsController = new ObjectsController(this);
        this._stateController = new StateController(this);
        this._rulesController = new RulesController(this);
        this._uiManager = new UIManager(this);
        this._networkAdapter = networkAdapter;
        this._networkAdapter?.setOnUpdateCb(this.onUpdate.bind(this));
        this._networkAdapter?.setSyncDataCb(this.syncState.bind(this));
    }

    init() {
        this._objectsController.addEntities(this._config.entities);
        this.stage.add(this.mainLayer);
        this.stage.add(this.dragLayer);
        this._objectsController.renderEntities();
        this._eventsController.subscribe();

        if (this._config.rules?.params) {
            this._rulesController.registerParameters(this._config.rules.params);
        }

        if (this._config.rules?.actions) {
            this._rulesController.registerActions(this._config.rules.actions);
            this._rulesController.activateActions();
        }

        this._eventBus.subscribeInternals(eventData => {
            this._networkAdapter?.sendData(eventData);
            this.syncState();
        });
    }

    private syncState(state?: any) {
        if (state) {
            // this._stateController
            this.reinitEntities(state);
            this._stateController.saveState();
        } else {
            this._stateController.saveState();
            this._networkAdapter?.syncState(this._stateController.getState());
        }
    }

    private reinitEntities(entitiesConfig: EntitiesConfig) {
        this._eventBus.unsubscribeAll();
        this._objectsController.destroyEntities();
        this.mainLayer.destroyChildren();
        this.mainLayer.draw();
        this.dragLayer.destroyChildren();
        this.dragLayer.draw();
        this._objectsController.addEntities(entitiesConfig);
        this._eventsController.subscribe();
        this._objectsController.renderEntities();

        this._eventBus.subscribeInternals(eventData => {
            this._networkAdapter?.sendData(eventData);
            this.syncState();
        });
    }

    private onUpdate(data: any) {
        this._objectsController.update(data);
        this._stateController.saveState();
    }

    get entitiesController() {
        return this._objectsController;
    }

    get eventBus() {
        return this._eventBus;
    }

    get config() {
        return this._config;
    }

    get uiManager() {
        return this._uiManager;
    }

    saveState() {
        this._stateController.saveState();
    }

    getState() {
        return this._stateController.getState();
    }
}
