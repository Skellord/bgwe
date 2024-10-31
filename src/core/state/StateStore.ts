import { Entity, EntitiesConfig, EntityType } from '../objects';

const storeMap: Record<EntityType, keyof EntitiesConfig> = {
    button: 'buttons',
    card: 'cards',
    deck: 'decks',
    stack: 'stacks',
    text: 'texts',
};

export class StateStore {
    entities: EntitiesConfig = {};

    addEntity(entity: Entity) {
        const configKey = storeMap[entity.type];

        if (!this.entities[configKey]) {
            this.entities[configKey] = [];
        }

        (this.entities[configKey] as Array<any>).push(entity);
    }

    removeEntity(entity: Entity) {
        const configKey = storeMap[entity.type];

        if (this.entities[configKey]) {
            if (this.entities[configKey]?.length === 1) {
                delete this.entities[configKey];
                return;
            }

            //@ts-ignore
            this.entities[configKey] = this.entities[configKey].filter(e => e.id !== entity.id);
        }
    }

    changeEntity(entity: Entity) {
        const configKey = storeMap[entity.type];

        if (this.entities[configKey]) {
            const entityIndex = this.entities[configKey].findIndex(e => e.id === entity.id);

            if (entityIndex) {
                //@ts-ignore
                this.entities[configKey].splice(entityIndex, 1, entity);
            }
        }
    }

    clearEntities() {
        this.entities = {};
    }
}
