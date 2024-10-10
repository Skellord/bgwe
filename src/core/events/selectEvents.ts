import Konva from 'konva';

export function subscribeSelectEvents(stage: Konva.Stage, mainLayer: Konva.Layer) {
    const selector = new Konva.Transformer({
        name: 'selector',
        resizeEnabled: false,
        rotateEnabled: false,
    });

    const selectionRect = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
        visible: false,
        listening: false,
    });

    selector.on('dragend', () => {
        let pos = stage.getPointerPosition();
        let shape = pos ? mainLayer.getIntersection(pos) : undefined;

        if (shape) {
            let target: Konva.Shape | undefined;

            if (shape instanceof Konva.Group) {
                target = shape;
            } else {
                const ancestors = shape.getAncestors();

                for (const ancestor of ancestors) {
                    if (ancestor instanceof Konva.Rect || ancestor instanceof Konva.Group) {
                        target = ancestor as Konva.Shape;
                    }
                }
            }

            if (target) {
                selector.nodes().forEach(node => {
                    node.setPosition(target.position());
                })
            }
        }
    });

    mainLayer.add(selector, selectionRect);

    let x1: number, y1: number, x2, y2;
    let selecting = false;

    stage.on('mousedown touchstart', (evt) => {
        if (evt.target !== stage) {
            return;
        }

        evt.evt.preventDefault();

        x1 = stage.getPointerPosition()?.x ?? 0;
        y1 = stage.getPointerPosition()?.y ?? 0;
        x2 = stage.getPointerPosition()?.x ?? 0;
        y2 = stage.getPointerPosition()?.y ?? 0;

        selectionRect.width(0);
        selectionRect.height(0);
        selecting = true;
    });

    stage.on('mousemove touchmove', (evt) => {
        // do nothing if we didn't start selection
        if (!selecting) {
            return;
        }
        evt.evt.preventDefault();
        x2 = stage.getPointerPosition()?.x ?? 0;
        y2 = stage.getPointerPosition()?.y ?? 0;

        selectionRect.setAttrs({
            visible: true,
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        });
    });

    stage.on('mouseup touchend', (evt) => {
        // do nothing if we didn't start selection
        selecting = false;
        if (!selectionRect.visible()) {
            return;
        }
        evt.evt.preventDefault();
        // update visibility in timeout, so we can check it in click event
        selectionRect.visible(false);
        let shapes = stage.find('.card');
        let box = selectionRect.getClientRect();
        let selected = shapes.filter((shape) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        selector.nodes(selected);
    });

    stage.on('click tap', function (evt) {
        // if we are selecting with rect, do nothing
        if (selectionRect.visible()) {
            return;
        }

        // if click on empty area - remove all selections
        if (evt.target === stage) {
            selector.nodes([]);
            return;
        }

        // do nothing if clicked NOT on our rectangles
        if (!evt.target.hasName('card')) {
            return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = evt.evt.shiftKey || evt.evt.ctrlKey || evt.evt.metaKey;
        const isSelected = selector.nodes().indexOf(evt.target) >= 0;

        if (!metaPressed && !isSelected) {
            // if no key pressed and the node is not selected
            // select just one
            selector.nodes([evt.target]);
        } else if (metaPressed && isSelected) {
            // if we pressed keys and node was selected
            // we need to remove it from selection:
            const nodes = selector.nodes().slice(); // use slice to have new copy of array
            // remove node from array
            nodes.splice(nodes.indexOf(evt.target), 1);
            selector.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            // add the node into selection
            const nodes = selector.nodes().concat([evt.target]);
            selector.nodes(nodes);
        }
    });
}