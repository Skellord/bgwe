import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';
import * as Colyseus from 'colyseus.js';

import { EntitiesConfig, Entity } from '../core';

export interface NetworkAdapter {
    sendData: (data: any) => void;
    disconnect: () => void;
    setOnUpdateCb: (cb: (data: any) => void) => void;
}

export class Network {
    private readonly _doc: Y.Doc;
    // private _provider: WebsocketProvider | WebrtcProvider;
    private _client = new Colyseus.Client('ws://localhost:2567');
    private _room?: Colyseus.Room;
    private _ymap?: Y.Map<any>;
    private _onUpdateCb?: (data: any) => void;

    constructor() {
        this._doc = new Y.Doc();
        // this._provider = new WebsocketProvider('ws://localhost:1234', 'room', this._doc);
        const b = document.createElement('button');
        b.innerText = 'Connect';
        b.addEventListener('click', async () => {
            await this.connect();
        });
        document.body.appendChild(b);
        const d = document.createElement('button');
        d.innerText = 'Dicconnect';
        d.addEventListener('click', async () => {
            await this.disconnect();
        });
        document.body.appendChild(d);
    }

    init() {
        // this._ymap = this._doc.getMap('map');
        // this._ymap.observe(() => {
        //     console.log(this._doc, this._provider);
        //     this._onUpdateCb?.(this._ymap?.toJSON());
        // });
    }

    sendData(entities: EntitiesConfig) {
        // console.log('senData', entities, this._ymap, this);
        // this._ymap?.set('state', entities);

        console.log(entities);
        this._room?.send('action', JSON.stringify(entities));
    }

    disconnect(): void {
        this._room?.leave();
    }

    setOnUpdateCb(cb: (data: any) => void) {
        this._onUpdateCb = cb;
        console.log(this._onUpdateCb);
    }

    async connect() {
        try {
            this._room = await this._client.joinOrCreate('default_room');

            if (!this._room) {
                throw new Error('Connection failed');
            }
            console.log(this._room?.state);

            this.subscribe();
        } catch (err) {
            console.error(err);
        }
    }

    private subscribe() {
        this._room?.onStateChange(state => {
            console.log(state);
        });

        this._room?.onMessage('action', msg => {
            console.log(msg);
        });
    }

    getNetworkAdapter(): NetworkAdapter {
        return {
            sendData: this.sendData.bind(this),
            disconnect: this.disconnect,
            setOnUpdateCb: this.setOnUpdateCb.bind(this),
        };
    }
}
