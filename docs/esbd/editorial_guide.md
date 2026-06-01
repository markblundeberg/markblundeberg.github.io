# ESBD Project Editorial Guide and Standards

Welcome to the **Electrochemical Species Band Diagram (ESBD)** web book project. This document serves as a guide to the project's pedagogy, writing voice, target audience, mathematical notation, template conventions, and interactive visualization guidelines.

Refer to this guide when writing, editing, or restructuring pages to ensure the book remains conceptually consistent, accessible, and mathematically rigorous.

---

## 1. Project Vision & Pedagogy

The ESBD web book aims to rebuild electrochemistry from the ground up using the **Species Voltage ($V_i$)** framework. Traditional electrochemistry teaching is often bogged down by confusing sign conventions, historical artifacts, and unmeasurable quantities. By treating electrochemistry through the lens of semiconductor physics and fundamental thermodynamics, and introducing a new visualization tool, we demystify these topics.

### Core Conceptual Pillars
1. **The $V_i$ Framework**: The fundamental thermodynamic variable for any charged species $i$ (electrons, protons, metal ions, anions) is its species voltage:
   $$ V_i = \frac{\bar\mu_i}{q_i} $$
   where $\bar\mu_i$ is the electrochemical potential, and $q_i = z_i F$ (or $z_i e$ on a per-particle basis) is the charge of the species.
2. **Symmetric Treatment of Carriers**: We treat electrons and ions symmetrically as charge carriers. Both have their own energy levels, bands, and voltages that drive their currents.
3. **Bypassing the Electrostatic Potential ($\phi$)**:
   - In traditional textbooks, the Galvani potential $\phi$ is introduced early as the "real" electrostatic potential. However, $\phi$ inside a material is **experimentally inaccessible and thermodynamically arbitrary**. 
   - Instead of splitting the driving force into drift ($-\nabla \phi$) and diffusion ($-\nabla c_i$), we stick with the unified thermodynamic force:
     $$ J_i = -\sigma_i \nabla V_i $$
   - We avoid invoking $\phi$ inside conductors as much as possible. When an electrostatic reference is needed we use the standard species states $V^\circ_i$ or semiconductor band edges.
   - Inside of insulators or vacuum we might refer to $\phi$. But note that this is restricted to the interior of these non-conductors: we do not import $\phi_{vac}$ as a reference level inside of conductors, and in fact we actively caution against the trap or relying on vacuum level alignment heuristics which often fail in practice (e.g. Anderson's rule).
4. **Top-Down Pedagogy**: We start with pure thermodynamics (species voltages, equilibrium, battery cells) before diving into microscopic details (solutions, solid-state, junctions, electrostatics, kinetics). This ensures readers grasp the macroscopic, coordinate-free thermodynamic constraints before getting lost in microscopic models.
5. **Visualization**: The electrochemical band diagrams themselves are the key novel concept enabled by the trick of normalizing all the charge carriers' energies by the species charge. The $V_i$ math alone would just be a reframing of existing arguments in favour of working with electrochemical potentials (e.g. Newman's electrochemistry book). A primary goal of this web book is to promote these diagrams by using them in all sorts of situations. One way to see it is that we are trying to make the electrochemical potential viewpoint more intuitive.

---

## 2. Target Audience & Tone

### Target Audience
* **Who they are**: Upper-level undergraduate and graduate students, researchers, and engineers in physics, chemistry, materials science, and device engineering.
* **Prerequisites**: Basic familiarity with electronic circuits, introductory thermodynamics (Gibbs free energy, chemical potential), and college-level calculus. Prior knowledge of electrochemistry is **not** required (and in fact, unlearning some traditional electrochemistry conventions is expected).

### Tone & Voice
* **Rigorous yet Conversational**: Use clear, direct, and engaging language. Avoid dry academic passive voice. Use first-person plural ("we") or address the reader directly ("you").
* **Empathetic**: Acknowledge that these concepts are difficult and that standard textbooks often teach confusing "lies to children" (e.g., that voltmeters measure electrostatic potential differences, or that standard hydrogen electrodes have a globally absolute reference potential of zero).
* **Physical & Intuitive**: Always anchor mathematical definitions to physical reality (e.g., "Species voltage is available work per unit charge," "Voltmeters measure differences in $V_{\mathrm{e}^-}$").
* **Visual**: Connect concepts immediately to band diagrams. The text and diagrams must act as a single, coherent explanation.

---

## 3. Mathematical & LaTeX Standards

To maintain consistency across pages, adhere to the following LaTeX math conventions. The project compiles math statically using `@vscode/markdown-it-katex`.

### Delimiters
* **Inline Math**: Use single dollar signs: `$ ... $` (e.g., `$V_i$`).
* **Display Math**: Use double dollar signs on their own lines:
  ```markdown
  $$ V_i = \frac{\bar\mu_i}{q_i} $$
  ```

### Notation Rules
| Concept | Symbol | LaTeX Code | Notes |
| :--- | :--- | :--- | :--- |
| **Species Voltage** | $V_i$ | `V_i` | Subscript denotes species (e.g., $V_{\mathrm{e}^-}$, $V_{\mathrm{H}^+}$, $V_{\mathrm{Na}^+}$). |
| **Standard Species Voltage** | $V^\circ_i$ | `V^\circ_i` | The superscript $\circ$ denotes standard state conditions (e.g., $V^\circ_{\mathrm{e}^-}$). |
| **Electrochemical Potential** | $\bar\mu_i$ | `\bar\mu_i` | Use bar-mu to distinguish from chemical potential of neutral species. |
| **Chemical Potential** | $\mu_i$ | `\mu_i` | Reserved for neutral species (e.g., $\mu_{\mathrm{H_2O}}$, $\mu_{\mathrm{Zn}}$). |
| **Electrode Potential** | $E$ | `E` | Traditional cell/electrode potential, introduced later as $V_{\mathrm{e}^-} - \phi$. |
| **Standard Electrode Potential**| $E^\circ$ | `E^\circ` | Traditional standard potential (vs SHE). |
| **Electrostatic Potential** | $\phi$ | `\phi` | Bypassed inside bulk materials; only used when comparing to traditional frameworks or for vacuum levels. |
| **Faraday Constant** | $F$ | `F` | Equal to $96.485~\mathrm{kJ/mol/V}$. |
| **Gas Constant & Temp** | $RT$ | `RT` | Often paired with Faraday constant as $RT/F$ or $k_{\mathrm{B}}T/e$. |

### Chemical Reactions & Formatting
* Use `\mathrm` for chemical species names: `\mathrm{e}^-`, `\mathrm{H}^+`, `\mathrm{OH}^-`, `\mathrm{H_2O}`, `\mathrm{Zn}^{2+}`.
* Use `\rightleftharpoons` or `\leftharpoons` for equilibrium reactions:
  ```latex
  \mathrm{H}^+ + \mathrm{OH}^- \rightleftharpoons \mathrm{H_2O}
  ```
* Standard units should be non-italicized: `~\mathrm{V}`, `~\mathrm{kJ/mol}`, `~\mathrm{mol/L}`.

---

## 4. Markdown & Eleventy Configuration

The site is built using **Eleventy**. Pages are written in Markdown (`.md`) with Nunjucks templating capability.

### Front Matter
Every topic page must start with the following front matter:
```yaml
---
layout: layouts/esbd_topic.njk
title: "Your Topic Title"
tags: [page, esbd_topic]
orderESBD: 20 # Keep track of the reading order
---
```

### Custom Shortcodes

#### 1. Wikipedia Links (`wiki`)
Instead of hardcoding external links to Wikipedia, use the custom `wiki` shortcode. It automatically appends a clean external link icon and sets `target="_blank"`.
* **Syntax**: `{% wiki "Wikipedia Page Title", "Optional Display Text" %}`
* **Examples**:
  - `{% wiki "quasi Fermi level" %}`
  - `{% wiki "Galvani potential", "Galvani potentials" %}`

#### 2. Figures & Captions (`figcaption`)
For figures, wraps, and diagrams, use standard `<figure>` HTML elements combined with the paired `figcaption` shortcode. This ensures that markdown (including math and links) inside the caption is parsed correctly by the Eleventy renderer.
* **Syntax**:
  ```html
  <figure class="demo-container" style="max-width: 400px">
    <img src="/esbd/img/your-diagram.svg" style="max-width:100%"/>
    {% figcaption %}
      This is a caption with math $V_i$ and a {% wiki "chemical potential" %} link.
    {% endfigcaption %}
  </figure>
  ```

### Footnotes
The project uses `markdown-it-footnote`. Footnotes are written inline and compiled to the bottom of the page.
* **Basic inline notes**: `^[Your footnote text here. Include [links](http://example.com) if needed.]`
* **Long footnotes**: Especially useful when the footnotes are long explanations with paragraph breaks, or when two places need to refer to the same footnote, these are flagged inline with `[^longnote]` and are then defined with a block starting with `[^longnote]:` and followed by and indented block.

---

## 5. Visual Standards & D3 Diagrams

A core feature of the ESBD book is the use of clear, clean diagrams (both static SVG/HTML and interactive D3 components).

### Diagram Conventions
* **Vertical Axis**: Represents energy or potential in Volts ($V$), pointing **upwards**. Since positive charges prefer lower voltage and negative charges (electrons) prefer higher voltage, make sure arrows indicating "spontaneous flow direction" are species-appropriate.
* **Horizontal Axis**: Represents spatial position ($x$).
* **Species Lines (Traces)**:
  - Keep traces distinct and consistent across diagrams.
  - Electrons ($V_{\mathrm{e}^-}$): Typically drawn as a solid/dashed line, colored blue (always #377EB8).
  - Cations ($V_{\mathrm{H}^+}$, $V_{\mathrm{Li}^+}$): Colored in warm tones (e.g., orange or red).
  - Anions ($V_{\mathrm{Cl}^-}$, $V_{\mathrm{OH}^-}$): Colored in cool/earthy tones (e.g., green or purple).
* **Reaction Markers (⇌)**: Use the ⇌ symbol at interfaces or inside bulk domains to highlight active chemical equilibrium coupling different species' voltages.

### Interactive Components (D3)
* Many examples of these figures can be found in `src/_includes/esbd-diagrams`.
* The common class files (ElectrochemicalSpeciesBandDiagram.js etc.) are located in `src/esbd/js/`.
* They should bind dynamically to inputs (such as HTML5 range sliders) to let the reader tune concentrations, currents, or applied voltages, demonstrating how the $V_i$ curves shift.
* Keep visualizations responsive, lightweight, and cleanly styled using standard CSS.

### Making calculations and getting numbers for realistic devices

* **Chemical offset**: One intrinsic and unavoidable aspect of the $V_i$ diagrams involving multiple species is that there are per-species chemical offsets that globally affect the traces. In general we assign $\mu_i=0$ for the IUPAC reference used for standard Gibbs energies of formation, a common and convenient choice. This has cascading effects via thermodynamic consistency which ultimately fix the energy offsets of the ions' $\bar\mu_i$ and thus $V_i$.
* **Thermodynamic consistency**: Try to keep a single ground source of truth. E.g. the ionic standard states and electrode potentials are closely related so we should choose one or the other, and avoid mixing together the two tables.
* **Electrical offset**: Regardless of chemistry there is always an arbitrary global electrical offset. For devices with electrodes generally we will adopt $V_{\mathrm{e}^-}=0$ for a chosen electrical ground which is connected to some terminal of the device. For more abstract and disconnected diagrams we might not zero out any trace, to emphasize the point that references are optional. We actively *avoid* zeroing based on: 'the standard hydrogen electrode', 'the vacuum', 'the potential at infinity', etc. as these are not robust global references in general.
* **Aqueous ion standard states**: These data can be found in e.g. `src/esbd/iondata.txt`.
* **Missing data**: If we can't find some specific thermodynamic information, then it's usually fine to substitute in a reasonable educated guess to generate a meaningful visual, provided it is well-flagged in the code, and may need to be mentioned in caption.
* **Interface electrostatics**: Most of our diagrams won't involve this, but we will sometimes illustrate band bending, electrostatic double layers, and the like. Between disparate materials this raises the question of alignment. We actively *avoid* the use of vacuum level alignment assumptions (work function matching / electron affinity rule), as one of the ongoing undercurrents is that interfaces are messy and we want to caution against relying on such assumptions. Even when no specific alignment data are available, we prefer to make up an alignment value that intentionally differs from the naive heuristic, or even add a slider to control this.
* **Vacuum boundaries and Work Functions**: Since the vacuum potential $\phi_{\mathrm{vac}}$ is screened out inside conductors, we do not draw $\phi_{\mathrm{vac}}$ lines running through the bulk of a conductor. Instead, $\phi_{\mathrm{vac}}$ should only exist in the vacuum or insulator phase. It starts at the boundary at a height of $V_{\mathrm{e}^-} - \Phi/e$ (where $\Phi$ is the work function), visually reinforcing that the work function is an interfacial step rather than a bulk level.

---

## 6. Structure & Checklist for New Pages

When drafting or editing a topic page, verify the following:

- [ ] Does the page begin with correct Nunjucks front matter?
- [ ] Is there an $H1$ header (`# Title`) matching the title in the front matter?
- [ ] Are all inline math equations wrapped in `$ ... $` and display equations in `$$ ... $$`?
- [ ] Are chemical formulas wrapped in `\mathrm{...}`?
- [ ] Does the page avoid referring to Galvani potential $\phi$ inside bulk phases, framing the physical driving force around $V_i$ instead?
- [ ] Are external Wikipedia links wrapped in the `{% wiki %}` shortcode?
- [ ] Do figures use `<figure>` and the `{% figcaption %}` paired shortcode?
- [ ] Is there a "Next Topic" link at the bottom of the page to guide the reader through the book's narrative flow?
