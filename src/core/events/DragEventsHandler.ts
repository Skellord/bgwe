import Konva from 'konva';
import { IRect } from 'konva/lib/types';

import { EventBus } from './EventBus.ts';
import { EventTypes } from './types.ts';
import { GameEngine } from '../GameEngine.ts';
import { Deck, Stack } from '../entities';

export class DragEventsHandler {
    private _stage: Konva.Stage;
    private readonly _mainLayer: Konva.Layer;
    private readonly _dragLayer: Konva.Layer;
    private _eventBus: EventBus;
    private readonly _entities: Array<Deck | Stack> = [];

    constructor(gameEngine: GameEngine) {
        this._stage = gameEngine.stage;
        this._mainLayer = gameEngine.mainLayer;
        this._dragLayer = gameEngine.dragLayer;
        this._eventBus = gameEngine.eventBus;
        this._entities = [...gameEngine.entitiesController.decks, ...gameEngine.entitiesController.stacks];
        this.subscribe();
    }

    private subscribe() {
        this._eventBus.subscribe(EventTypes.CardDragStart, eventData => {
            eventData.evt.preventDefault();
            const card = eventData.card;
            card.instance.moveTo(this._dragLayer);

            if (card.parent) {
                card.parent.removeCard(card);
            }

            this._mainLayer.draw();
        });

        this._eventBus.subscribe(EventTypes.CardDragEnd, eventData => {
            const card = eventData.card;
            let pos = this._stage.getPointerPosition();

            if (pos) {
                let overlappingEntity;
                for (const entity of this._entities) {
                    if (this.overlaps(pos, entity.instance.getClientRect())) {
                        overlappingEntity = entity;
                        break;
                    }
                }

                if (overlappingEntity) {
                    if (card.name === overlappingEntity.for) {
                        overlappingEntity.addCard(card);
                    }
                } else {
                    card.instance.moveTo(this._mainLayer);
                }
            }

            this._eventBus.fire('_change', {
                target: card,
            });
        });
    }

    private overlaps(pos: { x: number; y: number }, r2: IRect) {
        return r2.x <= pos.x && pos.x <= r2.x + r2.width && r2.y <= pos.y && pos.y <= r2.y + r2.height;
    }
}
