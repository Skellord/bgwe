import { EngineConfig, GameEngine } from './core/GameEngine.ts';
import { Network } from './network/Network.ts';

const config: EngineConfig = {
    entities: [
        {
            type: 'card',
            name: 'default',
            back: [
                {
                    type: 'image',
                    src: '/public/120.webp',
                    y: 0,
                    x: 0,
                    w: 80,
                    h: 80,
                    id: 'image1'
                },
            ],
            front: [
                {
                    type: 'image',
                    src: '/public/vite.svg',
                    y: 0,
                    x: 0,
                    w: 80,
                    h: 80,
                    id: 'image2'
                },
            ],
            h: 100,
            w: 100,
            y: 100,
            x: 100,
            id: '1',
            isFlipped: true,
        },
        {
            type: 'card',
            name: 'default',
            back: [],
            front: [],
            h: 100,
            w: 100,
            y: 100,
            x: 100,
            id: '2',
            isFlipped: false,
        },
        {
            type: 'magnet',
            x: 200,
            y: 200,
            w: 100,
            h: 100,
            id: 'magnet1',
            magnetFor: 'card',
        },
        {
            type: 'deck',
            visible: true,
            w: 100,
            h: 100,
            x: 500,
            y: 500,
            id: 'deck0',
            deckFor: 'default'
        },
        {
            type: 'text',
            w: 100,
            h: 100,
            x: 300,
            y: 300,
            value: 'text',
            id: 'text1',
            listeningParam: 'first',
        },
        {
            type: 'button',
            w: 150,
            h: 100,
            x: 550,
            y: 300,
            fill: 'red',
            text: '+',
            id: 'button1',
        }
    ],
    name: 'a',
    version: '1.0.0',
    rules: {
        params: {
            first: 1,
        },
        actions: [
            {
                name: 'action',
                targetId: 'button1',
                handler: evt => {
                    const param = evt.paramsStore.getParameter('first')
                    console.log('action', param);
                    if (typeof param === 'number') {
                        // const num = parseInt(param);
                        evt.paramsStore.changeParameter('first', (param + 1));
                    }
                },
                on: 'buttonclick'
            }
        ]
    }
};


const network = new Network();
const adapter = network.getNetworkAdapter()
const game = new GameEngine(config, adapter);

network.init();
game.init();



const button = document.createElement('button');
button.innerText = 'Save';
button.addEventListener('click', evt => {
    game.saveState();;
});
const button2 = document.createElement('button');
button2.innerText = 'Load';
button2.addEventListener('click', evt => {
    game.loadState()
});
document.body.appendChild(button);
document.body.appendChild(button2);
