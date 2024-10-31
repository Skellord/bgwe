import { GameEngine } from '../GameEngine.ts';
import { StateStore } from './StateStore.ts';
import { Card, CardEntity, Deck, DeckEntity, EntitiesConfig, GameObject, Stack, StackEntity } from '../objects';

export class StateController {
    private _gameEngine: GameEngine;
    private _stateStore: StateStore = new StateStore();

    constructor(gameEngine: GameEngine) {
        this._gameEngine = gameEngine;
    }

    private transformDeckToEntity(deck: Deck): DeckEntity {
        return {
            x: deck.instance.x(),
            y: deck.instance.y(),
            w: deck.instance.width(),
            h: deck.instance.height(),
            for: deck.for,
            isFlipped: deck.isFlipped,
            type: 'deck',
            id: deck.id,
            fill: deck.parameters.fill,
            stroke: deck.parameters.stroke,
            strokeWidth: deck.parameters.strokeWidth,
            withCount: deck.parameters.withCount,
            rotation: deck.instance.rotation(),
        };
    }

    private saveDecksToStore() {
        this._gameEngine.entitiesController.decks.forEach(deck => {
            const entity = this.transformDeckToEntity(deck);
            this._stateStore.addEntity(entity);
        });
    }

    //TODO: вынести basic entities отдельно
    private transformCardToEntity(card: Card): CardEntity {
        return {
            x: card.instance.x(),
            y: card.instance.y(),
            w: card.instance.width(),
            h: card.instance.height(),
            id: card.id,
            type: 'card',
            name: card.name,
            isFlipped: card.isFlipped,
            parentId: card.parent?.id,
            fill: card.parameters.fill,
            cornerRadius: card.parameters.cornerRadius,
            indexInDeck: card.indexInDeck ?? undefined,
            stroke: card.parameters.stroke,
            strokeWidth: card.parameters.strokeWidth,
            back: card.back,
            front: card.front,
            rotation: card.instance.rotation(),
        };
    }

    private saveCardsToStore() {
        this._gameEngine.entitiesController.cards.forEach(card => {
            const entity = this.transformCardToEntity(card);
            this._stateStore.addEntity(entity);
        });
    }

    private transformStackToEntity(stack: Stack): StackEntity {
        return {
            x: stack.instance.x(),
            y: stack.instance.y(),
            w: stack.instance.width(),
            h: stack.instance.height(),
            id: stack.id,
            type: 'stack',
            for: stack.for,
            rotation: stack.instance.rotation(),
            stroke: stack.parameters.stroke,
        };
    }

    private saveStacksToStore() {
        this._gameEngine.entitiesController.stacks.forEach(s => {
            const entity = this.transformStackToEntity(s);
            this._stateStore.addEntity(entity);
        });
    }

    // private transformObjectToEntity(entityObject: EntityObject) {
    //     if (entityObject instanceof Card) {
    //         return this.transformCardToEntity(entityObject);
    //     }

    //     if (entityObject instanceof Deck) {
    //         return this.transformDeckToEntity(entityObject);
    //     }

    //     if (entityObject instanceof Stack) {
    //         return this.transformStackToEntity(entityObject);
    //     }
    // }

    saveState() {
        this._stateStore.clearEntities();
        this.saveDecksToStore();
        this.saveCardsToStore();
        this.saveStacksToStore();
    }

    getState(): EntitiesConfig {
        return this._stateStore.entities;
    }

    changeStateByEntityObject(entityObject: GameObject) {
        if (entityObject instanceof Card) {
            const cardEntity = this.transformCardToEntity(entityObject);
            this._stateStore.changeEntity(cardEntity);
            return;
        }

        if (entityObject instanceof Deck) {
            const deckEntity = this.transformDeckToEntity(entityObject);
            this._stateStore.changeEntity(deckEntity);
            return;
        }

        if (entityObject instanceof Stack) {
            const stackEntity = this.transformStackToEntity(entityObject);
            this._stateStore.changeEntity(stackEntity);
            return;
        }
    }
}
