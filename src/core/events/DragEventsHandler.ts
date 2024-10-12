import Konva from 'konva';
import { IRect } from 'konva/lib/types';

import { EventBus } from './EventBus.ts';
import { EventTypes } from './types.ts';
import { GameEngine } from '../GameEngine.ts';
import { Deck } from '../entities';

export class DragEventsHandler {
    private _stage: Konva.Stage;
    private _mainLayer: Konva.Layer;
    private _dragLayer: Konva.Layer;
    private _eventBus: EventBus;
    private _decks: Deck[] = [];

    constructor(gameEngine: GameEngine) {
        this._stage = gameEngine.stage;
        this._mainLayer = gameEngine.mainLayer;
        this._dragLayer = gameEngine.dragLayer;
        this._eventBus = gameEngine.eventBus;
        this._decks = gameEngine.entitiesController.decks;
        this.subscribe();
    }

    private subscribe() {
        this._eventBus.subscribe(EventTypes.CardDragStart, eventData => {
            eventData.evt.preventDefault();
            const card = eventData.card;
            card.instance.moveTo(this._dragLayer);

            if (card.deck) {
                card.deck.removeCard(card);
            }
            console.log(this._mainLayer);
            this._mainLayer.draw();
        });

        this._eventBus.subscribe(EventTypes.CardDragEnd, eventData => {
            const card = eventData.card;
            let pos = this._stage.getPointerPosition();

            if (pos) {
                let overlappingDeck;
                for (const deck of this._decks) {
                    if (this.overlaps(pos, deck.instance.getClientRect())) {
                        overlappingDeck = deck;
                        console.log(deck);
                        break;
                    }
                }

                if (overlappingDeck) {
                    if (card.name === overlappingDeck.deckFor) {
                        overlappingDeck.addCard(card);
                    }
                } else {
                    card.instance.moveTo(this._mainLayer);
                }
            }
        });
    }

    private overlaps(pos: { x: number; y: number }, r2: IRect) {
        return r2.x <= pos.x && pos.x <= r2.x + r2.width && r2.y <= pos.y && pos.y <= r2.y + r2.height;
    }
}
