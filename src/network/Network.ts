import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';

import { Entity } from '../core/entities';

export interface NetworkAdapter {
    sendData: (entities: Entity[]) => void;
    disconnect: () => void;
    setOnUpdateCb: (cb: (data: any) => void) => void;
}

export class Network {
    private readonly _doc: Y.Doc;
    private _provider: WebsocketProvider | WebrtcProvider;
    private _ymap?: Y.Map<any>;
    private _onUpdateCb?: (data: any) => void;

    constructor() {
        this._doc = new Y.Doc();
        this._provider = new WebsocketProvider('ws://localhost:1234', 'room', this._doc);
    }

    init() {
        this._ymap = this._doc.getMap('map');

        this._ymap.observe(() => {
            console.log(this._onUpdateCb)
            this._onUpdateCb?.(this._ymap?.toJSON());
        });
        console.log(this._ymap, this._doc)
    }

    sendData(entities: Entity[]) {
        console.log('senData', entities, this._ymap, this)
        this._ymap?.set('state', entities);
    }

    disconnect(): void {
        this._provider.disconnect();
    }

    setOnUpdateCb(cb: (data: any) => void) {
        this._onUpdateCb = cb;
        console.log(this._onUpdateCb);
    }

    getNetworkAdapter(): NetworkAdapter {
        return {
            sendData: this.sendData.bind(this),
            disconnect: this.disconnect,
            setOnUpdateCb: this.setOnUpdateCb.bind(this),
        };
    }
}
