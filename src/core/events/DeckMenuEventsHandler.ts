import { GameEngine } from '../GameEngine.ts';
import { EventBus } from './EventBus.ts';
import { EventTypes } from './types.ts';
import { Deck } from '../entities';
import { MenuEventsHandler } from './MenuEventsHandler.ts';

export class DeckMenuEventsHandler extends MenuEventsHandler {
    private readonly _eventBus: EventBus;
    private _targetDeck: Deck | null = null;

    constructor(gameEngine: GameEngine) {
        super(gameEngine, 'deck-menu');
        this._eventBus = gameEngine.eventBus;
        this.subscribe();
    }

    private subscribe() {
        this._eventBus.subscribe(EventTypes.DeckMenuOpen, eventData => {
            this.showMenu();
            this._targetDeck = eventData.deck;
        });

        this.subscribeToFlip();
    }

    private subscribeToFlip() {
        const flipButton = document.getElementById('deck-flip');
        flipButton?.addEventListener('click', () => {
            this._targetDeck?.flip();
        });
    }
}
