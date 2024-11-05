import Konva from 'konva';

import { GameEngine } from '../GameEngine.ts';
import { ObjectsStore } from './ObjectStore.ts';
import { EventBus, InternalEventData, InternalEvents } from '../events/index.ts';
import { EntitiesConfig, Entity } from './types.ts';
import { Deck } from './Deck.ts';
import { Card } from './Card.ts';
import { Text } from './Text.ts';
import { Button } from './Button.ts';
import { Stack } from './Stack.ts';

import { type GameObject } from './index.ts';

export class ObjectsController {
    private _objectStore: ObjectsStore = new ObjectsStore();
    private _mainLayer: Konva.Layer;
    private _dragLayer: Konva.Layer;
    private readonly _eventBus: EventBus;

    constructor(gameEngine: GameEngine) {
        this._mainLayer = gameEngine.mainLayer;
        this._dragLayer = gameEngine.dragLayer;
        this._eventBus = gameEngine.eventBus;
    }

    private renderEntityObject(gameObject: GameObject) {
        if (gameObject instanceof Card && gameObject.parent) return;

        this._mainLayer.add(gameObject);
    }

    private setParent(gameObject: Konva.Group | Konva.Shape, parentId: string) {
        const parent = this._objectStore.getDeckById(parentId) || this._objectStore.getStackById(parentId);

        if (parent) {
            parent.add(gameObject);
        }
    }

    renderEntities() {
        this._objectStore.decks.forEach(this.renderEntityObject.bind(this));
        this._objectStore.stacks.forEach(this.renderEntityObject.bind(this));
        this._objectStore.texts.forEach(this.renderEntityObject.bind(this));
        this._objectStore.buttons.forEach(this.renderEntityObject.bind(this));
        this._objectStore.cards.forEach(this.renderEntityObject.bind(this));
    }

    addEntities(entitiesConfig: EntitiesConfig) {
        if (entitiesConfig.decks) {
            entitiesConfig.decks.forEach(d => {
                const deck = new Deck(d);
                this._objectStore.registerDeck(deck);
            });
        }

        if (entitiesConfig.stacks) {
            entitiesConfig.stacks.forEach(s => {
                const stack = new Stack(s);
                this._objectStore.registerStack(stack);
            });
        }

        if (entitiesConfig.cards) {
            entitiesConfig.cards.forEach(c => {
                const card = new Card(c);

                if (c.parentId) {
                    this.setParent(card, c.parentId);
                }

                this._objectStore.registerCard(card);
            });
        }

        if (entitiesConfig.texts) {
            entitiesConfig.texts.forEach(t => {
                const text = new Text(t, this._eventBus);
                this._objectStore.registerText(text);
            });
        }

        if (entitiesConfig.buttons) {
            entitiesConfig.buttons.forEach(b => {
                const button = new Button(b);
                this._objectStore.registerButton(button);
            });
        }
    }

    // changeEntityObject(entity: Entity) {
    //     if (entity.type === 'card') {
    //         const card = this.cards.find(c => c.id === entity.id);

    //         if (card) {
    //             this._objectStore.removeCard(card);
    //             card.instance.destroy();

    //             const newCard = new Card(entity, this._eventBus);

    //             if (entity.parentId) {
    //                 this.setParent(card, entity.parentId);
    //             }

    //             this._objectStore.registerCard(newCard);
    //             this.renderEntityObject(newCard);
    //         }
    //     }
    // }

    update(data: InternalEventData) {
        if (data.type === InternalEvents.Move) {
            this.move(data.targetId, data.x, data.y, data.currentTargetId);
        }

        if (data.type === InternalEvents.RemoveParent) {
            this.removeParent(data.targetId, data.parentId);
        }

        if ((data.type = InternalEvents.Flip)) {
            this.flip(data.targetId);
        }
    }

    private removeParent(targetId: string, parentId: string) {
        const target = this._objectStore.getById(targetId);
        const parent = this._objectStore.getById(parentId);
        console.log(target, parent);

        if (target && parent) {
            target.moveTo(this._dragLayer);
            //@ts-ignore
            parent.removeCard(target);
        }
    }

    private move(targetId: string, x: number, y: number, parentId?: string) {
        const target = this._objectStore.getById(targetId);
        // const parent = parentId ? this._objectStore.getById(parentId) : null;
        console.log(target);

        if (target) {
            if (parentId) {
                this.setParent(target as Card, parentId);
            } else {
                target.setAttrs({
                    x,
                    y,
                });
            }
        }
    }

    private flip(targetId: string) {
        const target = this._objectStore.getById(targetId);

        if (target) {
            //@ts-ignore
            target?.flip();
        }
    }

    destroyEntities() {
        this._objectStore.clear();
    }

    get cards() {
        return this._objectStore.cards;
    }

    get decks() {
        return this._objectStore.decks;
    }

    get stacks() {
        return this._objectStore.stacks;
    }
}
