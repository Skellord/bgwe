import { GameEngine } from '../GameEngine.ts';
import { DragEventsHandler } from './DragEventsHandler.ts';
import { DeckMenuEventsHandler } from './DeckMenuEventsHandler.ts';
import { CardMenuEventsHandler } from './CardMenuEventsHandler.ts';

export class EventsController {
    private readonly _gameEngine: GameEngine;

    constructor(gameEngine: GameEngine) {
        this._gameEngine = gameEngine;
    }

    subscribe() {
        new DragEventsHandler(this._gameEngine);
        new DeckMenuEventsHandler(this._gameEngine);
        new CardMenuEventsHandler(this._gameEngine);
    }
}