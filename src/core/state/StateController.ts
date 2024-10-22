import { GameEngine } from '../GameEngine.ts';
import { StateStore } from './StateStore.ts';
import { Card, CardEntity, Deck, DeckEntity } from '../entities';

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
            deckFor: deck.deckFor,
            isFlipped: deck.isFlipped,
            type: 'deck',
            id: deck.id,
        }
    }

    private saveDecksToStore() {
        this._gameEngine.entitiesController.decks.forEach(deck => {
            const entity = this.transformDeckToEntity(deck);
            this._stateStore.addEntity(entity);
        })
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
            deckId: card.deck?.id,
            fill: card.instance.children[0]?.getAttr('fill'),
            back: card.back,
            front: card.front,
        }
    }

    private saveCardsToStore() {
        this._gameEngine.entitiesController.cards.forEach(card => {
            const entity = this.transformCardToEntity(card);
            this._stateStore.addEntity(entity);
        })
    }

    saveState() {
        this._stateStore.clearEntities();
        this.saveDecksToStore();
        this.saveCardsToStore();
        console.log(this._stateStore)
    }

    getState() {
        return this._stateStore.entities;
    }
}