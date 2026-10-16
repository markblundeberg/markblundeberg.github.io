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
| model-pmax | silicon loses about 0.3 to 0.4% of its power per °C; the simulation 0.38%; panel makers list about 0.25 to 0.45% (most 0.3 to 0.4) | `Pmax_coeff_pct_per_K` = −0.38 (PASS line); datasheets (science review, 15 Oct): PERC −0.34 to −0.37, TOPCon −0.29 to −0.32, IBC ≈ −0.29, heterojunction −0.24 to −0.26, old multi-crystalline −0.40 to −0.45 | model + source |
| green | Green's formula dVoc/dT = −(Eg0/q − Voc + γkT/q)/T | `gamma_implied` = 1.85, within this cell's own 1.58–3 (PASS line); M. A. Green, Prog. Photovolt. 11, 333 (2003) | model + source |
| fifteen | under the same sun, a hot roof (65 °C) makes about 15% less than a cool bright day (25 °C): 233 W against 275 | `hot_over_cool_power` = 0.847; `panel_cool_best.W` 275.2, `panel_hot_best.W` 233.2 | model |
| same-current | both deliver about 8.1 A: the same number of electrons each second | `panel_cool_best.A` 8.09, `panel_hot_best.A` 8.05 | model |
| voltage | the hot one runs at 29.0 V, the cool one at 34.0 V; power is current × voltage | `panel_*_best.V` | model |
| held | at 34 V (as it happens, about the most this hot panel can reach at all), it delivers nothing: its whole current leaks back inside | page and film hold it at min(cool V_mp, hot V_oc) = its own V_oc, 0.46 mV a cell below the cool one's best (`held_V_cell`); `panel_hot_at_cool_V` A = 0, W = 0 (PASS lines); by superposition, at V_oc all the photocurrent recombines inside | model |
| as-many | it delivers just as many electrons (lede); its current is only half a percent lower, since the hot cell absorbs a little more sunlight; 83 of every 100 pairs delivered, against 85 | `panel_*_best.A` 8.05/8.09 = 0.995; `absorbed_mA_cm2` 39.78/39.33 = 1.011; `panel_*_best.per100.delivered` 83.3, 84.6 | model |
| one-in-100 | just over one in a hundred fewer; heat costs almost nothing in electrons, and 5 volts on every one; the rest leak back, 4 in the cool panel and 5 in the hot | 84.6 − 83.3 = 1.3; 100 − 84.6 − 11.5 = 3.9, 100 − 83.3 − 11.7 = 5.0 (`per100`, `delivered_at_0V_per100`); 34.0 − 29.0 V | model |
| at-0V | even at 0 V, where nothing leaks back, each delivers only 88 | `delivered_at_0V_per100` 88.5, 88.3 | model |
| front-loss | in this simulated cell about 12 more of every 100 are lost whatever the voltage, mostly light absorbed in its bare front layer (two-thirds of it blue and violet); real cells, with a treated front surface, lose fewer there and some light to reflection instead | `front_loss_at_0V_per100` = 10; `freed_in_front_layer_per100` = 15.8; `…below_500nm_share` = 0.65; real passivated cells lose ~1–3 per 100 at the front (science review) | model + source |
| leak | raise the voltage and the hill gets lower: more and more electrons in the front layer climb back over it into the base, and meet holes there or at the back of the cell, and are lost | hill = V_bi − V (0.92 eV at 0 V, 0.353 at 0.567 V); `leak_by_place_cool`: of the extra loss, base 19%, back 36% (L_n ≈ 0.6 mm ≫ 180 µm base), front 45% (holes) | model |
| holes-half | holes leak the other way, into the front layer: in this cell, nearly half the leak | `leak_by_place_cool.front_share` = 0.45 | model |
| one-in | at 34 V, for every electron at the top of the hill about 900 000 wait at its foot in the cool panel; 36 000 in the hot one held there: about twenty-five times as many make it up. Caption: "gets over" compares the numbers at the top and at the foot (Boltzmann factor) | `panel_cool_best.one_in` 920 000, `panel_hot_at_cool_V.one_in` 36 000, `one_in_ratio_same_V` 25.6; exp(hill/kT) = n_foot/n_top exactly, E_Fn flat, Boltzmann statistics (science review: NOT the share of electrons at the foot with enough energy, which differs by a factor of several) | model + arithmetic |
| twice | heat does it twice: electrons jiggle harder (kT), and at the same voltage warm silicon's hill is lower (0.30 eV against 0.35) | hill at 34 V: 0.353 eV cool, 0.305 hot; kT 25.7 → 29.1 meV | model |
| hill-best | the hot panel backs off to 29 V, where the hill is 0.39 eV, pulling its leak down to about one in 600 000 | `panel_hot_best.hill_eV` 0.388, `panel_hot_best.one_in` 600 000 | model |
| roof-air | panels in full sun run 25 to 40 °C hotter than the air (intro: 65 °C is the panel's own temperature) | as roof-temp | source |
| film-hill | (film) heat lets its electrons leak back over the cell's one-way hill; lower voltage, higher hill, less leak; same electrons, less energy each | as leak, hill-best, as-many | model |
| doubles | near a panel's working voltage, the leak doubles about every 8 °C | `leak_doubles_every_K` = 7.6 at 0.55 V a cell (analytic ≈ 7.3 K; it depends on the voltage) | model |
| split | the split between the electrons' and holes' levels is the cell's voltage | picture 2: E_Fn − E_Fp at the back of the window = V (0.569 at 0.567 V; the levels are flat to 2 mV across the base) | model |
| front-contact | at the front contact, the holes' level drops to meet the electrons' | picture 2; the contact is an equilibrium sink for both | model |
| cloudy | at half sun the current halves and the power falls to 133 W; the best voltage drops by just 1 V, 34 to 33 | `half_sun.Jsc_ratio` 0.4999; `panel_half_sun` W 133.3, Vmp 33.0; V_oc falls by V_T ln 2 (PASS line) | model |
| cloud-vs-heat | halving the sun costs far more than heating the panel to 65 °C | 0.484 against 0.847 | model |
| stc | rated power is measured at 1000 W/m² with cells at 25 °C (standard test conditions) | IEC 61215 / 60904 STC: 1000 W/m², AM1.5G, 25 °C cell | source |
| roof-temp | in full sun, cells typically run 25 to 45 °C above the air (the high end on a roof in still air), so 55 to 75 °C on a 30 °C day: about 11 to 19% below rating | NOCT ≈ +25–35 K (open rack, 1 m/s wind); close-roof mounts ≈ +35–50 K at 1000 W/m² (Sandia, PVsyst U ≈ 20 W/m²K; science review); `power_over_25C` C55 0.886, C75 0.809 | source + model |
| cold | at −10 °C (in full sun, that takes air at about −40 °C) it makes 312 W, 13% more than at 25 °C; that's part of why panels on snowy mountains can beat their ratings: cold cells, and extra light from thin air and bright snow | `panel_minus10` W 311.6, 1.132; cells run 25–45 °C above the air (roof-temp); over-rating is usually cold plus extra light | model + source |
| 60-cells | each panel is 60 silicon cells joined in a row (in series), 15.6 cm square | model: `CELLS`, `AREA`; the common 60-cell panel format | model + source |
| pairs | sunlight frees electron–hole pairs; the junction sends electrons one way and holes the other | the model's photogeneration and the band diagram (picture 2) | model + textbook |
| dot | each blue dot is about 4 × 10¹⁸ electrons, in real time | `electrons_per_dot` = 3.8e18 (14 dots/s at 8.5 A) | arithmetic |
| energy-each | the voltage is the energy each electron carries away | definition: energy per charge (qV per electron) | textbook |
| inverter | the inverter a panel is wired to finds the peak by itself | maximum power point tracking, standard in grid inverters | source |
| jsc-up | (not on the page) heat adds a little current: a warmer cell absorbs a little more infrared | `Jsc_coeff_pct_per_K` +0.023 (datasheets +0.03 to +0.06): the model's absorption edge shifts with the gap | dropped from page text; true in the model |
| p4-base | most electrons are freed out in the base: 84 of every 100 | `freed_beyond_front_layer_per100` = 84.2 | model |
| p4-depths | blue light is absorbed in the first thousandth of a millimetre, red within a few, infrared all through the base | `absorption_depth_um`: 450 nm 0.41, 650 nm 3.6, 950 nm 64 (Green 2008) | model + source |
| p4-wander | with no field in the base, a freed electron wanders at random until it reaches the junction's edge, where the hill sweeps it into the front layer | the solution: the base is neutral and its electron current is diffusion; picture 4's dots hop at the solution's own rates | model |
| p4-length | an electron can wander about 0.6 mm before it meets a hole, three times the cell's depth | `diffusion_length_mm` 0.63 (√(Dτ), 25 °C); base 180 µm | model |
| p4-dots | each dot is a fixed number of electrons, a sample of the simulation's density, at its rates | `cell_dots`: 123 recombinations against 126 expected, 280 out at the back against 274, over 50 µs (PASS lines, 3σ) | model |
| p4-crowd | the higher the voltage, the lower the hill and the more electrons come back over it, so the base fills; more of them meet holes or reach the back | base density at the junction edge ∝ e^{V/V_T}; held hot panel: the base floods (picture 4), losses `panel_hot_at_cool_V.per100` base 19, back 32 | model |
| p4-holes | holes outnumber electrons in the base several hundred to one | `holes_over_electrons_mid_base` = 625 (at the best voltage, 50 µm deep) | model |
| sim | it follows electrons and holes through the depth of one cell as they diffuse and drift; silicon's gap narrows, its electrons slow, with temperature | model.js: drift–diffusion (driftlet), Varshni gap, μ ∝ T^−2.42 / T^−2.2, N_c,v ∝ T^1.5 | model |
| spectrum | the standard spectrum in 90 bands, each absorbed as deep as silicon's measured absorption says | ASTM G173 AM1.5G (1000.4 W/m² integrated); Green 2008 α at 300 K, shifted with the gap | source |
| real-panels | real panels make somewhat less; heat costs them a similar share, the best of today's (higher voltage to start from) about 0.25 to 0.35% per degree | model −0.38 %/°C inside the datasheet range; Green's formula: the loss scales with E_g0/q − V_oc, so higher-V_oc cells lose less (heterojunction ≈ −0.25, TOPCon ≈ −0.30, PERC ≈ −0.35) | model + source |

Model simplifications to state on the page: no reflection or light trapping; no series resistance or
wiring; contacts cover each face (the front is an unpassivated sink); a panel is 60 identical cells;
recombination is one rate law (lifetime 100 µs in the base, 1000× shorter in the doped layers), the same
at every temperature; Boltzmann statistics even in the 10¹⁹ layers.

## Reviews (15 Oct 2026)

- **Framing (cold, "not a mere science reviewer").** The film never said why (no hill); its meters, dots and power curve were unreadable or unexplained at phone size; "65 °C · a hot summer roof" read as air temperature; "every electron leaks back" contradicted picture 3; the film's 0 W against the page's −5 W; picture 2 buried its point and seemed to contradict itself (a lower hill when hot, but 0.39 > 0.35, at different voltages). All taken: new captions with the hill, a dot legend, larger labels, "25 °C panel", the held voltage min(V_mp, V_oc) on both, the lede states the mechanism, picture 2 leads with it.
- **Science (cold).** No false headline claim; dVoc/dT right for the right reason (set by E_g0 − V_oc; the model's flaws move γ by ~1, dVoc/dT by ~0.1 mV/K). Taken: roof temperatures (open rack vs roof), the datasheet range, "gets over" as a density ratio, where leaked electrons die, the front loss as this cell's, cold panels, "as it happens" for the held demo, "near its working voltage". Model caveats noted, not on the page: n_i(300 K) = 6.1e9 (accepted 9.65e9: J0 ~2.5× low), no band-gap narrowing at 1e19, one mobility for all dopings, Jsc coefficient below datasheets (no light trapping); "nearly half the leak is holes" is this cell's and says so.
- **Blind, open brief (15 Oct, after Mark caught it).** Given only the page before picture 4 and "what would a solar-cell physicist say is wrong or missing?", it ranked first what the two briefed reviews missed: light makes pairs mostly deep in the base and they reach the junction by diffusion, not field (Mark's catch, fixed with picture 4 and "wander on the flat"). Also: the Würfel view (the voltage is the levels' split in the absorber, the loss is recombination; the junction only sorts carriers), offered to Mark; "heat takes away their energy" (fixed); today's panels lose less (fixed); −10 °C cells need about −40 °C air (fixed). Its "heat does it twice double-counts" is not taken: the hill's fall and kT's rise are the two factors of one Boltzmann exponent, about 5× each (science review).
