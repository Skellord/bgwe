import Konva from 'konva';

import { Card, Deck, Text } from './entities';
import { Entity } from './types';
import { ActionsProvider, GameParamsProvider, Rules } from './rules';
import { EventBus, EventsHandler } from './events';
import { Button } from './entities/Button.ts';

export interface EngineConfig {
    name: string;
    version: string;
    entities: Entity[];
    rules?: Rules;
}

export class GameEngine {
    private _cards: Card[] = [];
    private _decks: Deck[] = [];
    private _paramsProvider: GameParamsProvider;
    private _actionsProvider!: ActionsProvider;
    private _eventsHandler: EventsHandler;
    eventBus: EventBus;
    mainLayer: Konva.Layer;
    dragLayer: Konva.Layer;
    stage: Konva.Stage;

    constructor() {
        this.stage = new Konva.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight,
        });

        this.mainLayer = new Konva.Layer();
        this.dragLayer = new Konva.Layer();
        this.eventBus = new EventBus();
        this._paramsProvider = new GameParamsProvider(this.eventBus);
        this._eventsHandler = new EventsHandler(this);
    }

    registerDeck(deck: Deck) {
        this._decks.push(deck);
    }

    removeDeck(deck: Deck) {
        this._decks = this._decks.filter(d => d.id !== deck.id);
    }

    init(config: EngineConfig) {
        config.entities.forEach(entity => {
            this.createEntity(entity, this.mainLayer);
        });

        this.stage.add(this.mainLayer);
        this.stage.add(this.dragLayer);
        this._eventsHandler.subscribe();
        this._actionsProvider = new ActionsProvider(this);

        if (config.rules?.actions) {
            this._actionsProvider.registerAndActivateActions(config.rules.actions);
        }

        if (config.rules?.params) {
            for (const parameter in config.rules.params) {
                this._paramsProvider.addParameter({
                    [parameter]: config.rules.params[parameter],
                });
            }
        }
    }

    private createEntity(entity: Entity, mainLayer: Konva.Layer) {
        if (entity.type === 'card') {
            const card = new Card(entity, this.eventBus);
            mainLayer.add(card.instance);
        } else if (entity.type === 'deck') {
            const deck = new Deck(entity);
            this.registerDeck(deck);
            mainLayer.add(deck.instance);
        } else if (entity.type === 'text') {
            const text = new Text(entity, this.eventBus);

            if (entity.listeningParam) {
                text.subscribeParamChanging(entity.listeningParam);
            }

            mainLayer.add(text.instance);
        } else if (entity.type === 'button') {
            const button = new Button(entity, this.eventBus);
            mainLayer.add(button.instance);
        }
    }

    get decks() {
        return this._decks;
    }

    get paramsProvider() {
        return this._paramsProvider;
    }
}
