import Konva from 'konva';
import { createEntity } from './entities';
import { subscribe } from './events';
import { EngineConfig } from './GameEngine.ts';

export function init(config: EngineConfig) {
    const stage = new Konva.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const mainLayer = new Konva.Layer();
    const secondLayer = new Konva.Layer();

    config.entities.forEach((entity) => {
        createEntity(entity, mainLayer, secondLayer, stage);
    });

    stage.add(mainLayer);
    stage.add(secondLayer);

    subscribe(stage, mainLayer, secondLayer)
}

export { EngineConfig } from './GameEngine.ts';