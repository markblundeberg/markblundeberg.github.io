# Claims ledger: LED ("How does an LED make light?")

Every sentence in the page or the film that says *why* something happens, or states a number, points
here, and each entry points at its evidence: a line of `checks/led.mjs` output (re-run it after any
change to the model; `BREAK=walls` makes it fail), a picture on the page, or a source outside. A claim
with no entry doesn't ship.

Goal: get an AI-curious non-scientist to believe, in about 90 seconds and without being told anything
false, why an LED glows one colour and why a blue one needs more volts than a red one: the voltage
pushes electrons and holes into one thin layer, each meeting drops an electron across the gap and gives
off a photon of about that energy, so the gap sets both the colour and the volts.

| id | claim (as worded on the page or in the film) | evidence | kind |
|---|---|---|---|
| peak | each peak sits just above its gap, by half the jiggle energy, kT | `peak_above_gap_kT` = 0.519 (PASS); Schubert, *Light-Emitting Diodes*, ch. 5 | law + source |
| width | about twice kT wide: for the infrared LED, 28 nm | `width_kT` = 1.86, `width_nm_GaAs` = 28.4 (PASS) | law |
| nm | infrared 863 nm, red 630, blue 460 | `battery_3V[].nm` (red and blue gaps chosen so: E_g = hc/λ − kT/2) | model |
| 870 | gallium arsenide’s light peaks at about 870 nm at room temperature | `peak_nm_GaAs` 862.5 (PASS, 850–880); band-edge PL of GaAs ≈ 870 nm | law + source |
| vf | the infrared LED takes 1.25 V for 20 mA, as real GaAs LEDs take about 1.2 to 1.3 before their resistance | `walled.Vf_20A_cm2` = 1.246 (PASS); datasheets (science review, 16 Oct) | model + source |
| 60mV | once lit, current rises tenfold per 60 mV, the same in all three | `mV_per_decade` 59.5–60.0 (PASS, kT ln10 = 59.5); `dVf_dEg` = 1 (curves shifted) | model + law |
| one-for-one | the volts go up with the gap, one for one; a 2.7 eV gap takes about 2.7 V | `dVf_dEg` = 1.000 (PASS; exact in this model, since only the gap changes); qV = E_g − 0.18 at 20 mA (`gap_minus_qV`) | model |
| lights | the infrared lights at about 1.1 V across it, the red at 1.6, the blue at 2.4 (0.1 mA of light) | `battery_3V[].lights_at_V` 1.11, 1.64, 2.37 | model |
| at-3V | at 3 V (two AA cells) all bright, 1.26, 1.78, 2.49 V across them; 35, 24, 10 mA | `battery_3V[].V`, `.mA` | model |
| 92 | at 20 mA, 92 of every 100 electrons make light and 8 make heat at flaws; good real ones are comparable | `walled.light` 0.917, `.heat` 0.083 (PASS); good GaAs/AlGaAs double heterostructures (Schnitzer 1993: 99.7 % with photon recycling) | model + source |
| walls | the steps stop electrons going on into the p side and holes into the n side; caught between, they meet; the walls’ wider gap lets the light out without swallowing it | picture 2 (band steps 0.23/0.14 eV); `BREAK=walls`: light share 1.6 % in this thin chip (most reach the contact); transparency is from the cladding’s gap (1.80 eV > 1.44 eV photons), outside the model | model + physics |
| nobel | heterostructures won Alferov and Kroemer a share of the 2000 Nobel Prize in physics | nobelprize.org (half the prize; Kilby the other half) | source |
| crowd | raise the voltage and the levels split further; electrons crowd in from the n side, holes from the p side | picture 2; E_Fn − E_Fp in the layer = V | model |
| ev | an electronvolt is the energy one electron gains crossing one volt | definition | definition |
| kT | electrons sit within about kT (0.026 eV at room temperature) of their band’s floor | Boltzmann statistics (model); kT = 25.9 meV at 300 K | law |
| gap-v-split | at 3 V the gap is 1.42 eV but the split 1.26; each photon carries about 1.46 eV | picture 2; `photon_eV_mean` 1.463 (E_g + 3kT/2) | model |
| more-light | even with 7 in 100 lost to heat at flaws, this LED gives out 8% more energy as light than it takes in; the rest from heat: carriers sit a little above their levels (holes the larger share, science review) | `battery_3V[0].light_energy_over_qV` 1.078 (PASS); `light_share` 0.930 | model |
| santhanam | only warmed, and at tiny currents, has an LED been measured giving out more light than the electrical power put in | P. Santhanam, D. J. Gray, R. J. Ram, Phys. Rev. Lett. 108, 097403 (2012) (verified to exist by the science review; heated LED, picowatts) | source |
| si-wait | in doped silicon (10¹⁷) an electron waits about 2 ms to give off light; in GaAs 14 ns | `radiative_wait` 2.11 ms, 13.9 ns (1/(B N_A)); B: Trupke 2003, Ioffe (Varshni) | model + source |
| si-1in100 | in ordinary silicon fewer than 1 in 100 meetings make light; the best silicon LEDs only just pass 1 in 100 | `Si.light_over_light_plus_heat` 0.0058 (PASS, τ = 10 µs); Green et al., Nature 412, 805 (2001), >1 % | model + source |
| momentum | silicon’s band edges have different momentum; a photon can’t carry it; the crystal must jiggle at the same moment | indirect gap (textbook) | physics |
| blue-3V | real blue LEDs need 2.8 to 3.3 V at 20 mA (p-type GaN conducts poorly; barriers around the wells); real red 1.8 to 2.2 | datasheets (science review); the GaN wording from the science review | source |
| wider | real LEDs are wider, often two or three times: heavy doping blurs the band edges; mixed crystals aren’t quite even | science review: InGaN ≈ 20–30 nm (≈ 5 kT); GaAs broadened by doping | source |
| white | a white LED is a blue LED with a yellow phosphor | textbook | source |
| burn | a few tenths of a volt too much across a bare LED sends its current up a thousandfold | 60 mV per decade: 0.18 V = 10³ | model |
| backwards | an LED is a solar cell run backwards; in clean crystal each meeting makes one photon | solar-heat page; `walled.light` | model |
| film | (film) turn up the voltage: infrared first, then red, then blue; each colour waits for its own voltage; electrons drop across a gap, each drop gives off one particle of light with the gap’s energy; a bigger drop: bluer light, and more volts | as lights, peak, one-for-one | model |

## Reviews (16 Oct, overnight)

- **Framing.** Mechanism too late (the log chart was picture 1): moved the chart to picture 4, picture 1 now the three LEDs alone. Volts-to-gap link unstated: glossed the electronvolt, "a 2.7 eV gap takes about 2.7 volts". Infrared looked visible on phones: "unseen" kept on phones. Picture 2 legibility (bracket like a photon stroke, grey legend for coloured lines, holes only shading, label collisions): arrowed dotted brackets, coloured legend, "shading: holes", photons clipped below the labels, "blue LED’s gap" label. Captions shortened. Numbers made consistent (863; 1.26 at 3 V). Walls dilute: cut to one paragraph, picture 4's ledger dropped.
- **Science.** Silicon "even in good silicon, fewer than 1 in 100" wrong (Green 2001 > 1 %): reworded. "A little wider… mixtures" wrong for GaAs: reworded. The walls ledger (2 vs 92 per 100) an artefact of the 3 µm p side: dropped. "Had to be cooled" unsupported: dropped with the ledger. Santhanam: "warmed, and at tiny currents". Heat point: holes carry the larger share: reworded. "Measured rate": "standard rate" (Varshni's B from absorption). Turn-on voltages checked; TV remote wording softened.
- **Blind, open brief.** Ranked first the same walls artefact (and the electron mobility: 8500 is pure GaAs's; now 4000 among 10¹⁷ holes). Also: "can't climb out" the wrong mechanism (fixed: each carrier is stopped by the far wall); "no electron can have an energy in the gap" vs dashed levels in the gap ("in a perfect crystal"; the levels explained as how crowded, not places); "twice that wide" ambiguous (fixed); "each meeting makes one photon" vs heat ("in clean crystal"); cooling point understated (now the model's own 8 %); coin cell can't supply 70 mA ("two AA cells"); "takes as much current as it's offered" (now the thousandfold); 1962 "first" (dropped).
