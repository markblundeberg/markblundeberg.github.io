# Claims ledger: nerves ("Why are your nerves wrapped in fat?")

Every sentence in the page or the film that says *why* something happens, or states a number, points
here, and each entry points at its evidence: a line of `checks/nerves.mjs` output (re-run it after any
change to the model), a picture on the page, or a source outside. A claim with no entry doesn't ship.

Goal: get an AI-curious non-scientist to believe, in about 90 seconds and without being told anything
false, why their nerves are wrapped in fat: the wrapping lets a thin nerve's signal jump from gap to gap
instead of crawling, so it can be fast without being thick.

| id | claim (as worded on the page or in the film) | evidence | kind |
|---|---|---|---|
| speeds | thin bare 2.7 m/s; thin wrapped 34 m/s; squid 18.7 m/s (model) | `bare/myelin/squid.steady_m_per_s` | model |
| hh | the squid nerve matches Hodgkin and Huxley's own 18.8 m/s | `squid.steady_m_per_s` = 18.73 (their hand calculation: 18.8 m/s, J Physiol 1952) | model + source |
| sqrt | a bare nerve's speed goes as the square root of its radius | `bare_from_squid_by_sqrt_radius` = bare's measured 2.71 | model |
| race | over 2 cm: wrapped 0.48 ms, squid 1.26 ms, bare 7.4 ms | `*.arrives_ms` | model |
| ratio-bare | the wrapped nerve is over ten times faster than the same nerve bare (12.5×) | `myelin_over_bare` | model |
| ratio-squid | the thin wrapped nerve beats a squid nerve 48× wider, over 2,000× the cross-section | `myelin_over_squid` = 1.81, `squid_radius_ratio`, `squid_area_ratio` | model |
| jump | only the gaps fire (Na⁺ enters only there), one after another; the wrapped stretches follow the gaps at their ends. NOT "arrives in steps": arrival times every 1/8 mm rise smoothly (3.5 µs each, within 5%), about seven gaps rising at once (science review, 14 Oct) | channels only at nodes; the race's flashes mark each gap's crossing of −30 mV | model |
| why-slow | a bare nerve is slow because every bit of membrane must be charged as the signal passes | the wave picture: the capacitive current ahead of the front | model + textbook |
| potassium | along the inside, more than half the current is carried by K⁺, not the Na⁺ that enters | `axial_shares_at_peak_current` (K⁺ about 0.57, with the large anions at half the small ions' mobility, as isethionate and aspartate are); immobile anions would overstate it at 0.79 | model + arithmetic |
| no-travel | the signal shifts each ion less than a nanometre; its own random jiggling in a millisecond is thousands of times further | `K_shift_nm_mid_squid` (integrated over the spike), `thermal_um_in_1ms` | model |
| fast-fibres | your fast nerve fibres are wrapped (bare C fibres outnumber wrapped ones in skin nerves) | standard anatomy | source |
| sliver | wrapping means the long stretches need only a sliver of the charge each (200 membranes: 1 mm holds what 5 µm of bare membrane does; still most of the total, which is why too little wrapping fails) | model: C/wraps; arithmetic | model |
| seal | myelin also seals the nerve, but what speeds it up is the charge (internode length constant ≈ 2 cm ≫ 1 mm) | science review's estimate; model has a perfect seal | arithmetic |
| fat | myelin is mostly fat: about 70–85% lipid by dry weight | standard neurochemistry (e.g. Siegel et al., *Basic Neurochemistry*); state as "mostly fat" | source |
| real-speeds | real fast human nerves reach about 120 m/s; thin bare ones about 1 m/s | textbook fibre classes (Aα ≈ 70–120 m/s; C fibres ≈ 0.5–2 m/s) | source |
| toe | a stubbed toe hurts twice: thin wrapped (Aδ, ~5–30 m/s) bring the sharp first pain, bare (C, ~1 m/s) the dull ache, most of a second later over a metre | textbook "first and second pain" | source |
| pencil | a squid's giant axon is about as thick as a pencil lead | up to ~1 mm across (Hodgkin and Huxley's: 0.48 mm); pencil leads 0.5–0.7 mm | source |
| escape | the squid's giant axon fires its escape jet | standard (it drives the mantle contraction for jet escape) | source |
| thicker | more wrapping is faster: 800 layers → about 70 m/s (model) | `myelin_800_layers_m_per_s` = 69.3 | model |
| too-thin | too little wrapping and the signal stops | `myelin_20_layers_arrives` = false (dies within 0.2 mm) | model |
| ms | in multiple sclerosis, damaged myelin slows or blocks signals | standard (conduction slowing and block in demyelinated fibres); state carefully, no treatment claims | source |
| energy | (not stated: no model number yet) | — | dropped |
| cable | the race alone is a classic cable-equation result; what this simulation adds is the ions | myelin demo's `cable` test (driftlet test suite); propagation demo's 2e-3 agreement | model |

Model simplifications to state on the page: one dimension (the axon's length), the outside held fixed,
Hodgkin and Huxley's squid channels in every axon (at 18.5 °C), myelin as capacitance only (no leak, no
paranodes), nodes 1 µm wide every millimetre.
