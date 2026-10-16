// Home-page pictures: /img/home/<slug>.jpg, a crop of each piece's link card down to its figure.
// A new explorable without one falls back to its whole link card (og.png) until someone crops it.
import { existsSync } from 'node:fs';
import explorables from './explorables.js';

const pick = (slug, card) => (existsSync(`src/img/home/${slug}.jpg`) ? `/img/home/${slug}.jpg` : card);

export default Object.fromEntries(
    explorables.map((x) => [x.slug, pick(x.slug, `/explorables/${x.slug}/og.png`)]),
);
