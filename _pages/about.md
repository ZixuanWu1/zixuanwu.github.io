---
layout: academic
title: Zixuan Wu
permalink: /
eyebrow: Statistics · University of Chicago
description: Ph.D. student in Statistics at the University of Chicago. Research in causal inference, high-dimensional statistics, and reliable statistical learning.
redirect_from:
  - /about/
  - /about.html
---

<div class="intro" markdown="1">
I am a Ph.D. student in the [Department of Statistics at the University of Chicago](https://stat.uchicago.edu/). My research focuses on **causal inference, high-dimensional statistics, and statistical learning**, with an emphasis on methods that combine statistical guarantees with computational efficiency.

I work on Mendelian randomization and causal mediation, sparse canonical correlation analysis, and conformal prediction. My recent work also studies synthetic data augmentation and statistical guarantees for link prediction with neural network representations.
</div>

Before my Ph.D., I earned an M.S. in Statistics from the University of Chicago and an Honours B.Sc. in Applied Mathematics and Statistics from the University of Toronto. I have also worked on quantitative research at **Optiver** and large-scale experimentation at **Roblox**.

<ul class="interests" aria-label="Research interests">
{% for interest in site.data.profile.interests %}<li>{{ interest }}</li>{% endfor %}
</ul>

<div class="section-heading"><h2 id="selected-research">Selected research</h2><a href="{{ '/publications/' | relative_url }}">All publications <span aria-hidden="true">→</span></a></div>
{% assign selected = site.data.publications | where: 'selected', true %}
{% for paper in selected %}
{% include publication-entry.html paper=paper summary=true %}
{% endfor %}
<p class="publication-notes">* Equal contribution.</p>

<div class="section-heading"><h2>Recent highlights</h2><a href="{{ '/talks/' | relative_url }}">Talks &amp; posters <span aria-hidden="true">→</span></a></div>
<div class="highlight"><time>2026</time>Received a Poster Award Honorable Mention at the Statistical Learning and Data Science Conference for work on link prediction with neural network latent representations.</div>
<div class="highlight"><time>Summer 2026</time>Joined Optiver in Austin as a Quantitative Research Intern, working on statistical models for systematic trading.</div>
<div class="highlight"><time>Summer 2025</time>Worked with the Creator team at Roblox on user segmentation and graph-based experimental design.</div>

<p class="contact-line">For research correspondence, reach me at <a href="mailto:{{ site.data.profile.email }}">{{ site.data.profile.email }}</a>.</p>
