# Claims ledger: solar heat ("Why do solar panels hate heat?")

Every sentence in the page or the film that says *why* something happens, or states a number, points
here, and each entry points at its evidence: a line of `checks/solar-heat.mjs` output (re-run it after
any change to the model; `BREAK=gap` makes it fail), a picture on the page, or a source outside. A claim
with no entry doesn't ship.

Goal: get an AI-curious non-scientist to believe, in about 90 seconds and without being told anything
false, why a solar panel makes less power when it's hot: heat lets electrons leak back over the panel's
one-way hill, and to keep that leak small a hot panel has to run at a lower voltage, so each electron it
delivers carries less energy.

(Revised from the first goal sentence, "…so the panel leaks back some of what sunlight pushed
through": the check showed the hot panel at its best delivers nearly as many electrons as the cool one,
84.6 vs 83.3 per 100 pairs. What heat takes is voltage, not count.)

| id | claim (as worded on the page or in the film) | evidence | kind |
|---|---|---|---|
| model-dvoc | the cell loses about 2.0 mV per °C; measured silicon cells, about −2 mV/°C | `dVoc_dT_mV_per_K` = −2.01 (PASS line); Green 2003 | model + source |
| model-pmax | the simulation loses 0.38% of its power per °C; panel makers list 0.3 to 0.5% | `Pmax_coeff_pct_per_K` = −0.38; crystalline-silicon datasheets (typically −0.35 to −0.45 %/°C; heterojunction ~−0.26, outside this range) | model + source |
| green | Green's formula dVoc/dT = −(Eg0/q − Voc + γkT/q)/T | `gamma_implied` = 1.85, within this cell's own 1.58–3 (PASS line); M. A. Green, Prog. Photovolt. 11, 333 (2003) | model + source |
| fifteen | under the same sun, a hot roof (65 °C) makes about 15% less than a cool bright day (25 °C): 233 W against 275 | `hot_over_cool_power` = 0.847; `panel_cool_best.W` 275.2, `panel_hot_best.W` 233.2 | model |
| same-current | both deliver about 8.1 A: the same number of electrons each second | `panel_cool_best.A` 8.09, `panel_hot_best.A` 8.05 | model |
| voltage | the hot one runs at 29.0 V, the cool one at 34.0 V; power is current × voltage | `panel_*_best.V` | model |
| held | at the cool panel's 34 V, the hot panel delivers nothing (a trickle even runs backwards) | `panel_hot_at_cool_V` A = −0.13, W = −4.5 (PASS line); the film holds it at its own V_oc (0.1 mV a cell lower), reading 34.0 V and 0 W | model |
| hardly-loses | it hardly loses any electrons: 83 of every 100 pairs delivered, against 85 | `panel_*_best.per100.delivered` 83.3, 84.6 | model |
| one-in-100 | heat costs about one electron in a hundred, and 5 volts on every one | 84.6 − 83.3 = 1.3; 34.0 − 29.0 V | model |
| at-0V | even at 0 V, where nothing leaks back, each delivers only 88 | `delivered_at_0V_per100` 88.5, 88.3 | model |
| front-loss | lost at the front: mostly light absorbed in the thin front layer, two-thirds of it blue and violet | `front_loss_at_0V_per100` = 10; `freed_in_front_layer_per100` = 15.8; `freed_in_front_layer_below_500nm_share` = 0.65 | model |
| leak | the leak: the higher the voltage, the more electrons climb back over the hill and are lost; it grows with the voltage | `leak_by_place_cool` (3.9 per 100 more lost at 34 V than at 0 V); hill 0.92 eV at 0 V, 0.35 at 34 V (`hill` in `Panel.operate`) | model |
| holes-half | holes leak the other way, into the front layer: in this cell, nearly half the leak | `leak_by_place_cool.front_share` = 0.45 | model |
| one-in | about one in 900 000 gets over at 34 V in the cool panel; one in 35 000 in the hot one held there: twenty-six times as many | `panel_cool_best.one_in` 920 000, `panel_hot_at_cool_V.one_in` 35 000, `one_in_ratio_same_V` 26.3 (the Boltzmann factor e^{−hill/kT}, read as the share at the foot that reaches the top) | model + arithmetic |
| twice | heat does it twice: electrons jiggle harder (kT), and in warm silicon the hill is lower | hill at 34 V: 0.353 eV cool, 0.305 hot; kT 25.7 → 29.1 meV | model |
| hill-best | the hot panel runs where the hill is 0.39 eV, the cool one's 0.35 | `panel_hot_best.hill_eV` 0.388, `panel_cool_best.hill_eV` 0.353 | model |
| doubles | at a fixed voltage the leak doubles about every 8 °C | `leak_doubles_every_K` = 7.6; 25× from 25 to 65 °C at 0.55 V a cell (`leak_at_0_55V_mA_cm2`) | model |
| split | the split between the electrons' and holes' levels is the cell's voltage | picture 2: E_Fn − E_Fp at the back of the window = V (0.569 at 0.567 V; the levels are flat to 2 mV across the base) | model |
| front-contact | at the front contact, the holes' level drops to meet the electrons' | picture 2; the contact is an equilibrium sink for both | model |
| cloudy | at half sun the current halves and the power falls to 133 W; the best voltage drops by just 1 V, 34 to 33 | `half_sun.Jsc_ratio` 0.4999; `panel_half_sun` W 133.3, Vmp 33.0; V_oc falls by V_T ln 2 (PASS line) | model |
| cloud-vs-heat | halving the sun costs far more than heating the panel to 65 °C | 0.484 against 0.847 | model |
| stc | rated power is measured at 1000 W/m² with cells at 25 °C (standard test conditions) | IEC 61215 / 60904 STC: 1000 W/m², AM1.5G, 25 °C cell | source |
| roof-temp | in full sun on a roof, cells typically run 25 to 35 °C above the air, so 55 to 65 °C on a 30 °C day: 11 to 15% below rating | NOCT ≈ 45 °C at 800 W/m², 20 °C air (≈ +31 °C at 1000 W/m²); roof mounts run hotter; `power_over_25C` C55 0.886, C65 0.847 | source + model |
| cold | at −10 °C it makes 312 W in full sun, 13% more than at 25 °C; panels in cold, clear conditions can beat their ratings | `panel_minus10` W 311.6, 1.132 | model + source |
| 60-cells | each panel is 60 silicon cells joined in a row (in series), 15.6 cm square | model: `CELLS`, `AREA`; the common 60-cell panel format | model + source |
| pairs | sunlight frees electron–hole pairs; the junction sends electrons one way and holes the other | the model's photogeneration and the band diagram (picture 2) | model + textbook |
| dot | each blue dot is about 4 × 10¹⁸ electrons, in real time | `electrons_per_dot` = 3.8e18 (14 dots/s at 8.5 A) | arithmetic |
| energy-each | the voltage is the energy each electron carries away | definition: energy per charge (qV per electron) | textbook |
| inverter | the inverter a panel is wired to finds the peak by itself | maximum power point tracking, standard in grid inverters | source |
| jsc-up | (not on the page) heat adds a little current: a warmer cell absorbs a little more infrared | `Jsc_coeff_pct_per_K` +0.023 (datasheets +0.03 to +0.06): the model's absorption edge shifts with the gap | dropped from page text; true in the model |
| sim | it follows electrons and holes through the depth of one cell as they diffuse and drift; silicon's gap narrows, its electrons slow, with temperature | model.js: drift–diffusion (driftlet), Varshni gap, μ ∝ T^−2.42 / T^−2.2, N_c,v ∝ T^1.5 | model |
| spectrum | the standard spectrum in 90 bands, each absorbed as deep as silicon's measured absorption says | ASTM G173 AM1.5G (1000.4 W/m² integrated); Green 2008 α at 300 K, shifted with the gap | source |
| real-panels | real panels make somewhat less (reflection, wiring, glass), but heat costs them about the same share | model −0.38 %/°C inside the datasheet range; efficiency 18.9% with no reflection or series resistance | model + source |

Model simplifications to state on the page: no reflection or light trapping; no series resistance or
wiring; contacts cover each face (the front is an unpassivated sink); a panel is 60 identical cells;
recombination is one rate law (lifetime 100 µs in the base, 1000× shorter in the doped layers), the same
at every temperature; Boltzmann statistics even in the 10¹⁹ layers.
