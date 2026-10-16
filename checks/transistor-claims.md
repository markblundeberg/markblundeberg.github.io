# Claims ledger: transistor ("Why can't AI chips just run at a lower voltage?") — DRAFT, day-5 candidate

Goal (draft, for Mark to argue with): get an AI-curious non-scientist to believe, in about 90 seconds and
without being told anything false, why chips can't simply run at a lower voltage to save power: a
transistor's gate switches it by letting electrons climb into the channel; heat spreads their energies,
so each tenfold of current costs the gate at least 60 mV, and a good off-to-on switch needs a few tenths
of a volt.

| id | claim | evidence | kind |
|---|---|---|---|
| swing | this transistor: tenfold per 72 mV below threshold | `swing_mV` 72.1 (PASS), textbook 71–74 | model + law |
| limit | 60 mV per tenfold at room temperature is the floor for any barrier-climbing switch | kT ln10 = 59.5 mV (300 K) | law |
| five-sixths | about five-sixths of each gate volt reaches the surface | 60/72 = 0.83 (1/(1 + C_d/C_ox)) | model |
| on-off | 0 → 0.6 V: channel up more than 100 000× | `n_at_0V` 7.9e6, n(0.6) 2.1e12 cm⁻² (2.7e5) | model |
| 036 | 100 000-fold switching needs about 0.36 V of climb alone | 5 × 72 mV | arithmetic |
| threshold | about 0.3 V | `VT_textbook` 0.275, `VT_extrapolated` 0.38 | model + law |
| cv2 | switching energy ∝ V²: half the voltage, a quarter the energy | CV² | physics |
| history | 5 V in the 1980s → ~1.1 V by the mid-2000s → ~0.7 V now | Dennard-scaling history (review: 1.1–1.2 V at 90/65 nm, 0.7–0.8 V nominal today) | source |
| best | today's best come within about 5–10 mV of the limit; real 65–100 | review (TSMC N2 reported 60.1 second-hand; short-channel production 65–75) | source |
| margin | variability needs margin; SRAM sets a minimum voltage | review | source |
| half-volt | somewhere around half a volt, depending on the chip, leakage eats the savings (near-threshold computing) | review; hedged | source |
| cold | 77 K: limit 15 mV/dec, real devices ~20–30; quantum controllers run cold to sit near qubits | kT ln10 at 77 K = 15.3; review sources (arXiv 1806.01142; J. Phys. IV 1994; arXiv 1811.01693) | law + source |
| oxide | below ~1.2 nm SiO₂ tunnels; high-k (hafnium-based) since 2007, Intel 45 nm first, others by ~2011; the drain's say over the channel is why gates wrap fins | review | source |

## Reviews
- **Blind, open brief (16 Oct overnight).** Fixed: "no design can change the 60" contradicted the FAQ's tunnel/negative-capacitance switches (now "for any switch that works by electrons climbing over a barrier"); voltage history inconsistent (now 1.1 → 0.7); cryo controllers run cold for the qubits, not the swing; 15 mV at 77 K is the limit, real ~20–30; "within a few mV" → 5–10; added variability, DVFS/near-threshold, the AI-power line, holes and electronvolt glosses, units (millivolts), log-scale gloss; the dashed limit line now starts at the curve's foot so the curve never appears to beat it; oxide FAQ now gives the drain/short-channel reason and dates high-k adoption.
- Framing and science reviews: not yet run (waiting for Mark's pick).
