import { GameEngine } from '../GameEngine.ts';
import { EventBus } from './EventBus.ts';
import { Card } from '../objects';
import { InternalEvents } from './types.ts';
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
        this._stage.on('cardcontextmenu', eventData => {
            this._targetCard = eventData.target as unknown as Card;
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
        });
    }

    private subscribeToFlip() {
        const flipButton = document.getElementById('card-flip');
        flipButton?.addEventListener('click', () => {
            this._targetCard?.flip();

            this._eventBus.fireInternal(InternalEvents.Flip, {
                type: InternalEvents.Flip,
                targetId: this._targetCard?.id() as string,
            });
        });
    }
}
