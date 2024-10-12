export interface EntityProps {
    id: string;
    type: EntityType;
    w: number;
    h: number;
    x: number;
    y: number;
}

export type EntityType = 'card' | 'magnet' | 'deck' | 'text' | 'button';

export interface CardEntity extends EntityProps {
    type: 'card';
    name: string;
    front: BasicEntity[];
    back: BasicEntity[];
    isFlipped: boolean;
    fill?: string;
    deckId?: string;
}

export interface MagnetEntity extends EntityProps {
    type: 'magnet';
    magnetFor: Exclude<EntityType, 'magnet'>
    fill?: string;
    background?: ImageEntity;
}

export interface DeckEntity extends EntityProps {
    type: 'deck';
    deckFor: string;
    visible: boolean;
}

export interface TextEntity extends EntityProps {
    type: 'text',
    value: string;
    listeningParam?: string;
}

export interface ButtonEntity extends EntityProps {
    type: 'button';
    text: string;
    fill?: string;
}

export type Entity = CardEntity | MagnetEntity | DeckEntity | TextEntity | ButtonEntity;

export type BasicEntityType = 'image';

export interface BasicEntityProps {
    x: number;
    y: number;
    type: BasicEntityType;
    id: string;
}

export interface ImageEntity extends BasicEntityProps {
    src: string;
    w?: number;
    h?: number;
    type: 'image';
}

export type BasicEntity = ImageEntity;
