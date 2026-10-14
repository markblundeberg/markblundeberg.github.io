// Standalone interactive pieces under /explorables/<slug>/.
// Each is a self-contained page in src/explorables/<slug>/ (its own HTML,
// styles and scripts), passthrough-copied rather than run through a layout.
// This list feeds the /explorables/ index and the sitemap.
export default [
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
