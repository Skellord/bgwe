import { GameEngine } from '../GameEngine.ts';
import { EventBus } from './EventBus.ts';
import { Card } from '../entities';
import { EventTypes } from './types.ts';
import { MenuEventsHandler } from './MenuEventsHandler.ts';

export class CardMenuEventsHandler extends MenuEventsHandler {
    private readonly _eventBus: EventBus;
    private _targetCard: Card | null = null;
    private _rotateAngle: number = 90;

    constructor(gameEngine: GameEngine) {
        super(gameEngine, 'card-menu');
        this._eventBus = gameEngine.eventBus;

        if (gameEngine.config.settings?.rotateAngle) {
            this._rotateAngle = gameEngine.config.settings.rotateAngle;
        }

        this.subscribe();
    }

    private subscribe() {
        this._eventBus.subscribe(EventTypes.CardMenuOpen, eventData => {
            this._targetCard = eventData.card;
            this.showMenu();
        });

        this.subscribeToRotate();
    }

    private subscribeToRotate() {
        const rotateButton = document.getElementById('card-rotate');
        rotateButton?.addEventListener('click', () => {
            this._targetCard?.instance.rotate(this._rotateAngle);
        });
    }
}
