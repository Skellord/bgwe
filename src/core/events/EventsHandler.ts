import { GameEngine } from '../GameEngine.ts';
import { DragEventsHandler } from './DragEventsHandler.ts';

export class EventsHandler {
    private readonly _gameEngine: GameEngine;

    constructor(gameEngine: GameEngine) {
        this._gameEngine = gameEngine;
    }

    subscribe() {
        new DragEventsHandler(this._gameEngine);
    }
}