import { GameEngine } from '../GameEngine.ts';
import { Deck } from '../objects/index.ts';
import { MenuEventsHandler } from './MenuEventsHandler.ts';

export class DeckMenuEventsHandler extends MenuEventsHandler {
    private _targetDeck: Deck | null = null;

    constructor(gameEngine: GameEngine) {
        super(gameEngine, 'deck-menu');
        this.subscribe();
    }

    private subscribe() {
        this._stage.on('deckcontextmenu', eventData => {
            this._targetDeck = eventData.target as unknown as Deck;
            this.showMenu();
        });

        this.subscribeToFlip();
        this.subscribeToRotate();
        this.subscribeToShuffle();
    }

    private subscribeToFlip() {
        const flipButton = document.getElementById('deck-flip');
        flipButton?.addEventListener('click', () => {
            this._targetDeck?.flip();
        });
    }

    private subscribeToRotate() {
        const rotateButton = document.getElementById('deck-rotate');
        const reverseRotateButton = document.getElementById('deck-rotate-reverse');

        rotateButton?.addEventListener('click', () => {
            this._targetDeck?.rotate(this._rotateAngle);
        });

        reverseRotateButton?.addEventListener('click', () => {
            this._targetDeck?.rotate(-this._rotateAngle);
        });
    }

    private subscribeToShuffle() {
        const shuffleButton = document.getElementById('deck-shuffle');
        shuffleButton?.addEventListener('click', () => {
            this._targetDeck?.shuffle();
        });
    }
}
