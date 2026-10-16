// Standalone interactive pieces under /explorables/<slug>/.
// Each is a self-contained page in src/explorables/<slug>/ (its own HTML,
// styles and scripts), passthrough-copied rather than run through a layout.
// This list feeds the /explorables/ index and the sitemap.
export default [
    {
        slug: 'solar-heat',
        title: 'Why do solar panels hate heat?',
        description:
            'Two identical solar panels under the same sun, simulated live: one cool, one hot. ' +
            'Why the hot one makes less power: a leak that heat opens, and the voltage it costs.',
    },
    {
        slug: 'nerves',
        title: 'Why are your nerves wrapped in fat?',
        description:
            'Three nerves race, simulated live: a thin bare one, the same one wrapped in myelin, ' +
            "and a squid's giant one. Why wrapping wins, and which ions carry the signal.",
    },
    {
        slug: 'lithium-ion',
        title: 'Why does fast charging slow down near full?',
        description:
            'A lithium-ion battery drawn four ways, all driven live by one simulation: ' +
            'the crowd of lithium, the two shelves of its energy, the charging curve, and every species.',
    },
    {
        slug: 'daniell-cell',
        title: 'One battery, four pictures',
        description:
            'The Daniell cell drawn four ways: particles, the textbook ledger, ' +
            'electron levels, and species voltages, all driven live by one model.',
    },
];
