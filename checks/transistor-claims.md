# Claims ledger: transistor ("Why can't AI chips just run at a lower voltage?") — DRAFT, day-5 candidate

Goal (draft, for Mark to argue with): get an AI-curious non-scientist to believe, in about 90 seconds and
without being told anything false, why chips can't simply run at a lower voltage to save power: a
transistor's gate switches it by letting electrons climb into the channel; heat spreads their energies,
so each tenfold of current costs the gate at least 60 mV, and a good off-to-on switch needs a few tenths
of a volt.

| id | claim | evidence | kind |
|---|---|---|---|
| swing | this transistor: tenfold per 72 mV below threshold; nearly straight, 72–80 mV per tenfold, below about 0.25 V | `swing_mV` 72.1 (PASS, 10⁷–10⁹ cm⁻²), textbook 71–74; local slope 72 at 0–0.2 V, 77–82 lower and near 0.3 (science review) | model + law |
| limit | 60 mV per tenfold at room temperature is the floor for any barrier-climbing switch | kT ln10 = 59.5 mV (300 K) | law |
| five-sixths | about five-sixths of each gate volt reaches the surface | 60/72 = 0.83 (1/(1 + C_d/C_ox)) | model |
| on-off | 0 → 0.6 V: channel up more than 100 000× | `n_at_0V` 7.9e6, n(0.6) 2.1e12 cm⁻² (2.7e5) | model |
| 044 | from 0 V, a hundred-thousand-fold takes about 0.44 V on the gate (the curve bends at threshold); off to on, five tenfolds, at least 0.3 V | science review probe: 10⁵ × n(0) at ≈ 0.44 V; 5 × 60 mV | model + arithmetic |
| threshold | about 0.3 V | `VT_textbook` 0.275, `VT_extrapolated` 0.38 | model + law |
| cv2 | switching energy ∝ V²: half the voltage, a quarter the energy | CV² | physics |
| history | 5 V in the 1980s → ~1.1 V by the mid-2000s → ~0.7 V now | Dennard-scaling history (review: 1.1–1.2 V at 90/65 nm, 0.7–0.8 V nominal today) | source |
| best | today's transistors come within about 10 mV of the limit | science review: production short-channel 65–70 well supported; no primary source for 60.1 | source |
| margin | variability needs margin; SRAM sets a minimum voltage | review | source |
| half-volt | somewhere around half a volt, depending on the chip, leakage eats the savings (near-threshold computing) | review; hedged | source |
| cold | 77 K: limit 15 mV/dec, real devices ~20–30; quantum controllers run cold to sit near qubits | kT ln10 at 77 K = 15.3; review sources (arXiv 1806.01142; J. Phys. IV 1994; arXiv 1811.01693) | law + source |
| oxide | below ~1.2 nm SiO₂ tunnels; high-k (hafnium-based) since 2007, Intel 45 nm first, others by ~2011; the drain's say over the channel is why gates wrap fins | review | source |

## Reviews
- **Blind, open brief (16 Oct overnight).** Fixed: "no design can change the 60" contradicted the FAQ's tunnel/negative-capacitance switches (now "for any switch that works by electrons climbing over a barrier"); voltage history inconsistent (now 1.1 → 0.7); cryo controllers run cold for the qubits, not the swing; 15 mV at 77 K is the limit, real ~20–30; "within a few mV" → 5–10; added variability, DVFS/near-threshold, the AI-power line, holes and electronvolt glosses, units (millivolts), log-scale gloss; the dashed limit line now starts at the curve's foot so the curve never appears to beat it; oxide FAQ now gives the drain/short-channel reason and dates high-k adoption.
- **Framing (16 Oct overnight).** Lede now gives the reason (climb, heat, five tenfolds ≈ 0.3 V) inside 90 s; So split in three, ending with the sum to 0.7 V; picture 2 gets an energy axis, knocked-out labels, the holes' band label dropped, the default gate at 0.15 V (a visible climb); picture 3 gridlines a hundredfold at every width; picture 1's instruction before the figure, and "(at low gate voltages, almost none cross)".
- **Science (16 Oct overnight).** Fixed: "0.36 V of climb" was gate voltage (now 0.44 V on the gate from 0 V, and the 0.3 V floor as 5 × 60); the 60 is universal for the climb (meV per tenfold) but for the gate only while it can't move the hill by more than its own voltage (negative capacitance does; FAQ fixed); threshold "about a tenth" from the textbook's; "below threshold" added; 72–80 mV nearly straight below 0.25 V; long-channel and ~2000-oxide caveats; gate caption sign for negative V; holes left behind; 4 K cryo saturation; oxide tunnelling and high-k wording. Verified: the gate's level −V_G exactly, five-sixths, 2.7e5 on/off, kT ln10 at 300/77 K, voltage history, high-k dates, near-threshold optimum 0.3–0.45 V.
