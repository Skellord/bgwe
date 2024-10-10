import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { IRect } from 'konva/lib/types';

import { Card } from '../entities/Card.ts';
import { Deck } from '../entities/Deck.ts';
import { EventTypes } from '../types';

type GameEvent = KonvaEventObject<any> & {
    card: Card;
};

export function subscribeDragEvents(stage: Konva.Stage, mainLayer: Konva.Layer, dragLayer: Konva.Layer, decks: Deck[]) {
    // let draggingElement: Konva.Shape | undefined;
    // let previousShape: Konva.Shape | undefined;

    stage.on(EventTypes.CardDragStart, evt => {
        evt.evt.preventDefault();
        const card = (evt as unknown as GameEvent).card;
        card.instance.moveTo(dragLayer);

        if (card.deck) {
            card.deck.removeCard(card);
        }
        mainLayer.draw();
    });

    stage.on(EventTypes.CardDragEnd, evt => {
        const card = (evt as unknown as GameEvent).card;
        let pos = stage.getPointerPosition();

        if (pos) {
            let overlappingDeck;
            for (const deck of decks) {
                if (overlaps(pos, deck.instance.getClientRect())) {
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
                card.instance.moveTo(mainLayer);
            }
        }
    });

    // stage.on('dragstart', function (evt) {
    //     evt.evt.preventDefault();
    //     draggingElement = evt.target as Konva.Shape;
    //
    //     if (draggingElement.parent?.name() === 'deck') {
    //         stage.fire('removeChild', { evt: evt.evt, target: draggingElement });
    //     } else {
    //         draggingElement.moveTo(secondLayer);
    //     }
    //
    //     mainLayer.draw();
    // });
    //
    // stage.on('dragmove', function (evt) {
    //     let pos = stage.getPointerPosition();
    //     let shape = pos ? mainLayer.getIntersection(pos) : undefined;
    //
    //     if (previousShape && shape) {
    //         if (previousShape !== shape) {
    //             previousShape.fire('dragleave', { evt: evt.evt }, true);
    //             shape.fire('dragenter', { evt: evt.evt }, true);
    //             previousShape = shape;
    //         } else {
    //             previousShape.fire('dragover', { evt: evt.evt }, true);
    //         }
    //     } else if (!previousShape && shape) {
    //         previousShape = shape;
    //         shape.fire('dragenter', { evt: evt.evt }, true);
    //     } else if (previousShape && !shape) {
    //         previousShape.fire('dragleave', { evt: { ...evt.evt, target: draggingElement } });
    //         previousShape = undefined;
    //     }
    // });
    //
    // stage.on('dragend', function (evt) {
    //     let pos = stage.getPointerPosition();
    //     let shape = pos ? mainLayer.getIntersection(pos) : undefined;
    //
    //     if (shape) {
    //         previousShape?.fire('drop', { evt: evt.evt }, true);
    //     } else {
    //         draggingElement?.moveTo(mainLayer);
    //         draggingElement = undefined;
    //     }
    //     previousShape = undefined;
    // });
    //
    // stage.on('drop', function (evt) {
    //     let target: Konva.Shape | undefined;
    //
    //     if (evt.target instanceof Konva.Group) {
    //         target = evt.target as Konva.Shape;
    //     } else {
    //         const ancestors = evt.target.getAncestors();
    //
    //         for (const ancestor of ancestors) {
    //             if (ancestor instanceof Konva.Rect || ancestor instanceof Konva.Group) {
    //                 target = ancestor as Konva.Shape;
    //             }
    //         }
    //     }
    //
    //     if (target) {
    //         if (target.name() === 'deck') {
    //             stage.fire('addChild', { evt: { ...evt, target: draggingElement }, target });
    //         } else {
    //             draggingElement?.moveTo(mainLayer);
    //             draggingElement?.setPosition(target.position());
    //         }
    //     }
    //     draggingElement = undefined;
    // });
}

function overlaps(pos: { x: number; y: number }, r2: IRect) {
    return r2.x <= pos.x && pos.x <= r2.x + r2.width && r2.y <= pos.y && pos.y <= r2.y + r2.height;
}

// function intersectionRect(r1, r2) {
//     if (Konva.Util.haveIntersection(r1, r2)) {
//         const x = Math.max(r1.x, r2.x);
//         const width = Math.min(r1.x + r1.width, r2.x + r2.width) - x;
//         const y = Math.max(r1.y, r2.y);
//         const height = Math.min(r1.y + r2.height, r2.y + r2.height) - y;
//
//         return {
//             x: x,
//             y: y,
//             width: width,
//             height: height,
//         };
//     } else {
//         return {
//             x: 0,
//             y: 0,
//             width: 0,
//             height: 0,
//         };
//     }
// }
