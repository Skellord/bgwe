export enum EventTypes {
    CardDragStart = 'carddragstart',
    CardDragEnd = 'carddragend',
    CardDragMove = 'carddragmove',
    CardFlip = 'cardflip',
    DeckMenuOpen = 'deckmenuopen',
    CardMenuOpen = 'cardmenuopen',
    CardHover = 'cardhover',
    CardClick = 'cardclick',
}

export enum InternalEvents {
    Move = '_move',
    RemoveParent = '_remove_parent',
    Flip = '_flip',
}

export type GenericInternalEventData<T extends InternalEvents> = {
    type: T;
    targetId: string;
    currentTargetId?: string;
};

type MoveEventData = GenericInternalEventData<InternalEvents.Move> & {
    x: number;
    y: number;
};

type RemoveParentEventData = GenericInternalEventData<InternalEvents.RemoveParent> & {
    parentId: string;
};

type FlipEventData = GenericInternalEventData<InternalEvents.Flip>;

export type InternalEventData = MoveEventData | RemoveParentEventData | FlipEventData;
