import Konva from 'konva';
import { IRect } from 'konva/lib/types';

import { GameEngine } from '../GameEngine.ts';
import { Deck, Stack } from '../objects/index.ts';

const draggingAllowedNames = ['card'];

export class DragEventsHandler {
    private _stage: Konva.Stage;
    private readonly _mainLayer: Konva.Layer;
    private readonly _dragLayer: Konva.Layer;
    private readonly _entities: Array<Deck | Stack> = [];

    constructor(gameEngine: GameEngine) {
        this._stage = gameEngine.stage;
        this._mainLayer = gameEngine.mainLayer;
        this._dragLayer = gameEngine.dragLayer;
        this._entities = [...gameEngine.entitiesController.decks, ...gameEngine.entitiesController.stacks];
        this.subscribe();
    }

    private subscribe() {
        this._stage.on('dragstart', eventData => {
            const { target } = eventData;

            if (!draggingAllowedNames.some(name => target.name().startsWith(name))) return;

            const parent = target.getParent();

            if (parent) {
                if ('removeCard' in parent) {
                    //@ts-ignore
                    parent.removeCard(target);
                }
            }

            target.moveTo(this._dragLayer);
        });

        this._stage.on('dragend', eventData => {
            const { target } = eventData;
            if (target instanceof Konva.Stage) return;
            let pos = this._stage.getPointerPosition();
            let overlappingEntity;
            const [_, name] = target.name().split('_');

            if (pos) {
                for (const entity of this._entities) {
                    if (this.overlaps(pos, entity.getClientRect())) {
                        overlappingEntity = entity;
                        break;
                    }
                }

                if (overlappingEntity) {
                    if (name === overlappingEntity.for) {
                        //@ts-ignore
                        overlappingEntity.addCard(target as Konva.Group);
                    }
                } else {
                    target.moveTo(this._mainLayer);
                }
            }
        });
    }

    private overlaps(pos: { x: number; y: number }, r2: IRect) {
        return r2.x <= pos.x && pos.x <= r2.x + r2.width && r2.y <= pos.y && pos.y <= r2.y + r2.height;
    }
}
