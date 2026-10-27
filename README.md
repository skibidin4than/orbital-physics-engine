# Orbital 🪐

I wanted to know how physics engines actually work, so I stopped using one and wrote my own. Everything here is plain JavaScript. No Box2D, no Matter.js, no dependencies, no build step.

**Try it: https://orbital-physics-engine.vercel.app**

<!-- put a GIF or screenshot here -->

## Two toys in one

**Rigid body mode** is a box of stuff you can throw around. Crates, orbs, triangles, pentagons, hexagons. Stack them, knock a pyramid over, grab a shape with your mouse (or finger) and fling it. Crank gravity to Jupiter or switch to zero-G and watch everything float.

**Orbital mode** is a tiny solar system sandbox. Launch planets, watch them crash and merge, and switch between Euler, Verlet and RK4 to see which one slowly falls apart. There's a live energy graph, so you can literally watch Euler cheat. Try the figure-8 preset, it's three stars chasing each other in a loop and it's weirdly satisfying.

Keys: `Space` pauses, `S` is slow-mo, `N` steps one frame.

## What's under the hood

The rigid body side uses SAT for collisions, a sequential impulse solver with warm starting, friction and bounciness, and a spatial hash so it doesn't check every pair. The orbital side uses Barnes-Hut once there are lots of bodies. The physics runs at a fixed 240 Hz, so a pyramid settles the same way every time.

The engines don't touch the DOM, so you can steal them:

```js
import {create} from './src/rigid/index.js';

const world = create();
world.reset();
for (let i = 0; i < 240; i++) world.step(); // one second of physics
console.log(world.bodies.length);
```

## Run it locally

Browsers won't load ES modules from a `file://` page, so you need a tiny server:

```bash
git clone https://github.com/skibidin4than/orbital-physics-engine.git
cd orbital-physics-engine
npm start
```

Then open http://localhost:8000. Tests are `npm test` (Node 18+). They check stuff like boxes coming to rest, fast things not tunneling through the floor, and Barnes-Hut agreeing with brute force.

## Heads up

The code is pretty compact. I went for short and fast over pretty, so some of it reads like a puzzle. It's a learning project, not a replacement for a real engine.

## License

MIT, do whatever you want. See [LICENSE](LICENSE).
