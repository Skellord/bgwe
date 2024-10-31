import Konva from 'konva';

import { GameEngine } from '../GameEngine.ts';
import { EntitiesStore } from './EntitiesStore.ts';
import { EventBus } from '../events';
import { EntitiesConfig, Entity } from './types.ts';
import { Deck } from './Deck.ts';
import { Card } from './Card.ts';
import { Text } from './Text.ts';
import { Button } from './Button.ts';
import { Stack } from './Stack.ts';
import { type EntityObject } from './index.ts';

export class EntitiesController {
    private _entitiesStore: EntitiesStore = new EntitiesStore();
    private _mainLayer: Konva.Layer;
    private readonly _eventBus: EventBus;

    constructor(gameEngine: GameEngine) {
        this._mainLayer = gameEngine.mainLayer;
        this._eventBus = gameEngine.eventBus;
    }

    private renderEntityObject(entityObject: EntityObject) {
        if (entityObject instanceof Card && entityObject.parent) return;

        this._mainLayer.add(entityObject.instance);
    }

    private setParent(card: Card, parentId: string) {
        const parent = this._entitiesStore.getDeckById(parentId) || this._entitiesStore.getStackById(parentId);

        if (parent) {
            parent.addCard(card);
        }
    }

    renderEntities() {
        this._entitiesStore.decks.forEach(this.renderEntityObject.bind(this));
        this._entitiesStore.stacks.forEach(this.renderEntityObject.bind(this));
        this._entitiesStore.texts.forEach(this.renderEntityObject.bind(this));
        this._entitiesStore.buttons.forEach(this.renderEntityObject.bind(this));
        this._entitiesStore.cards.forEach(this.renderEntityObject.bind(this));
    }

    addEntities(entitiesConfig: EntitiesConfig) {
        if (entitiesConfig.decks) {
            entitiesConfig.decks.forEach(d => {
                const deck = new Deck(d, this._eventBus);
                this._entitiesStore.registerDeck(deck);
            });
        }

        if (entitiesConfig.stacks) {
            entitiesConfig.stacks.forEach(s => {
                const stack = new Stack(s);
                this._entitiesStore.registerStack(stack);
            });
        }

        if (entitiesConfig.cards) {
            entitiesConfig.cards.forEach(c => {
                const card = new Card(c, this._eventBus);

                if (c.parentId) {
                    this.setParent(card, c.parentId);
                }

                this._entitiesStore.registerCard(card);
            });
        }

        if (entitiesConfig.texts) {
            entitiesConfig.texts.forEach(t => {
                const text = new Text(t, this._eventBus);
                this._entitiesStore.registerText(text);
            });
        }

        if (entitiesConfig.buttons) {
            entitiesConfig.buttons.forEach(b => {
                const button = new Button(b, this._eventBus);
                this._entitiesStore.registerButton(button);
            });
        }
    }

    changeEntityObject(entity: Entity) {
        if (entity.type === 'card') {
            const card = this.cards.find(c => c.id === entity.id);

            if (card) {
                this._entitiesStore.removeCard(card);
                card.instance.destroy();

                const newCard = new Card(entity, this._eventBus);

                if (entity.parentId) {
                    this.setParent(card, entity.parentId);
                }

                this._entitiesStore.registerCard(newCard);
                this.renderEntityObject(newCard);
            }
        }
    }

    destroyEntities() {
        this._entitiesStore.clear();
    }

    get cards() {
        return this._entitiesStore.cards;
    }

    get decks() {
        return this._entitiesStore.decks;
    }

    get stacks() {
        return this._entitiesStore.stacks;
    }
}
