import * as Colyseus from 'colyseus.js';

export interface NetworkAdapter {
    sendData: (data: Action) => void;
    disconnect: () => void;
    setOnUpdateCb: (cb: (data: Action) => void) => void;
    syncState: (data: any) => void;
    setSyncDataCb: (cb: (data: any) => void) => void;
}

interface Action {
    type: string;
    [key: string]: string | number;
}

export class Network {
    private _client = new Colyseus.Client('ws://localhost:2567');
    private _room?: Colyseus.Room;
    private _onUpdateCb?: (data: Action) => void;
    private _onSyncDataCb?: (data: any) => void;
    private _firstStateArrived: boolean = false;

    constructor() {
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

    init() {}

    sendData(action: Action) {
        this._room?.send('action', action);
    }

    syncState(state: any) {
        this._room?.send('syncState', state);
    }

    disconnect(): void {
        this._room?.leave();
    }

    setOnUpdateCb(cb: (data: Action) => void) {
        this._onUpdateCb = cb;
    }

    setSyncDataCb(cb: (data: any) => void) {
        this._onSyncDataCb = cb;
    }

    async connect() {
        try {
            this._room = await this._client.joinOrCreate('default_room');

            if (!this._room) {
                throw new Error('Connection failed');
            }

            this.subscribe();
        } catch (err) {
            console.error(err);
        }
    }

    private subscribe() {
        this._room?.onStateChange(state => {
            if (!this._firstStateArrived) {
                const isCreated = this._room?.state.isCreated;
                this._firstStateArrived = true;

                if (isCreated) {
                    const json = state.gameState.get('map');

                    if (json) {
                        this._onSyncDataCb?.(JSON.parse(json));
                    }
                }
            }
        });

        this._room?.onMessage('action', msg => {
            console.log(msg);
            this._onUpdateCb?.(msg);
        });
    }

    getNetworkAdapter(): NetworkAdapter {
        return {
            sendData: this.sendData.bind(this),
            disconnect: this.disconnect,
            setOnUpdateCb: this.setOnUpdateCb.bind(this),
            syncState: this.syncState.bind(this),
            setSyncDataCb: this.setSyncDataCb.bind(this),
        };
    }
}
