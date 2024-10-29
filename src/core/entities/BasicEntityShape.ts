import Konva from 'konva';

import { BasicEntity, ImageEntity, RectangleEntity } from './types.ts';

export class BasicEntityShape {
    public static renderEntity(entity: BasicEntity, container: Konva.Container) {
        if (entity.type === 'image') {
            BasicEntityShape.renderImage(entity, container);
        }

        if (entity.type === 'rectangle') {
            BasicEntityShape.renderRectangle(entity, container);
        }
    }

    private static renderImage(imageEntity: ImageEntity, container: Konva.Container) {
        const imageObj = new Image();

        imageObj.onload = function () {
            const image = new Konva.Image({
                x: imageEntity.x,
                y: imageEntity.y,
                image: imageObj,
                width: imageEntity.w,
                height: imageEntity.h,
            });

            container.add(image);
        };

        imageObj.src = imageEntity.src;
    }

    private static renderRectangle(rectEntity: RectangleEntity, container: Konva.Container) {
        const rect = new Konva.Rect({
            x: rectEntity.x,
            y: rectEntity.y,
            width: rectEntity.w,
            height: rectEntity.h,
            fill: rectEntity.fill,
            strokeWidth: rectEntity.strokeWidth,
            stroke: rectEntity.stroke,
            id: rectEntity.id,
            rotation: rectEntity.rotation,
        });

        container.add(rect);
    }
}
