import { Entity } from '../entities';

export class StateStore {
    entities: Entity[] = [];

    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    removeEntity(entity: Entity) {
        this.entities = this.entities.filter(e => e.id !== entity.id);
    }

    clearEntities() {
        this.entities = [];
    }
}