---
layout: single
title: Zixuan Wu
permalink: /
description: Ph.D. student in Statistics at the University of Chicago. Research in causal inference, high-dimensional statistics, and reliable statistical learning.
redirect_from:
  - /about/
  - /about.html
---

I am a Ph.D. student in the [Department of Statistics at the University of Chicago](https://stat.uchicago.edu/). My research focuses on **causal inference, high-dimensional statistics, and statistical learning**, with an emphasis on methods that combine statistical guarantees with computational efficiency.

I work on Mendelian randomization and causal mediation, sparse canonical correlation analysis, and conformal prediction. My recent work also studies synthetic data augmentation and statistical guarantees for link prediction with neural network representations.

Before my Ph.D., I earned an M.S. in Statistics from the University of Chicago and an Honours B.Sc. in Applied Mathematics and Statistics from the University of Toronto. I have also worked on quantitative research at **Optiver** and large-scale experimentation at **Roblox**.

**Research interests:** {{ site.data.profile.interests | join: '; ' }}.

## Selected research

[All publications]({{ '/publications/' | relative_url }})

{% assign selected = site.data.publications | where: 'selected', true %}
{% for paper in selected %}
{% include publication-entry.html paper=paper summary=true %}
{% endfor %}

*\* Equal contribution.*

## Recent highlights

- **2026:** Received a Poster Award Honorable Mention at the Statistical Learning and Data Science Conference for work on link prediction with neural network latent representations.
- **Summer 2026:** Joined Optiver in Austin as a Quantitative Research Intern, working on statistical models for systematic trading.
- **Summer 2025:** Worked with the Creator team at Roblox on user segmentation and graph-based experimental design.

[Talks and posters]({{ '/talks/' | relative_url }})

For research correspondence, reach me at [{{ site.data.profile.email }}](mailto:{{ site.data.profile.email }}).
