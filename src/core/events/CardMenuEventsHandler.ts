import { GameEngine } from '../GameEngine.ts';
import { EventBus } from './EventBus.ts';
import { Card } from '../entities';
import { EventTypes } from './types.ts';
import { MenuEventsHandler } from './MenuEventsHandler.ts';

export class CardMenuEventsHandler extends MenuEventsHandler {
    private readonly _eventBus: EventBus;
    private _targetCard: Card | null = null;

    constructor(gameEngine: GameEngine) {
        super(gameEngine, 'card-menu');
        this._eventBus = gameEngine.eventBus;

        this.subscribe();
    }

    private subscribe() {
        this._eventBus.subscribe(EventTypes.CardMenuOpen, eventData => {
            this._targetCard = eventData.card;
            this.showMenu();
        });

        this.subscribeToRotate();
        this.subscribeToFlip();
    }

    private subscribeToRotate() {
        const rotateButton = document.getElementById('card-rotate');
        const reverseRotateButton = document.getElementById('card-rotate-reverse');

        rotateButton?.addEventListener('click', () => {
            this._targetCard?.rotate(this._rotateAngle);
        });

        reverseRotateButton?.addEventListener('click', () => {
            this._targetCard?.rotate(-this._rotateAngle);
        })
    }
    private subscribeToFlip() {
        const flipButton = document.getElementById('card-flip');
        flipButton?.addEventListener('click', () => {
            this._targetCard?.flip();
        });
    }
}
