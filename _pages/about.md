---
layout: single
title: Zixuan Wu
permalink: /
description: Ph.D. student in Statistics at the University of Chicago. Research in causal inference, high-dimensional statistics, and reliable statistical learning.
redirect_from:
  - /about/
  - /about.html
---

I am a Ph.D. student in the [Department of Statistics at the University of Chicago](https://stat.uchicago.edu/). I am fortunate to work with Professors Jingshu Wang and Claire Donnat.

One line of my research focuses on causal inference, particularly methods for Mendelian randomization, which uses genetic variants as instrumental variables to estimate causal effects.

Another line of my research lies at the intersection of statistics and machine learning, ranging from developing statistical methods for high-dimensional data to understanding the performance of machine learning models.

Before beginning my Ph.D., I earned an Honours B.Sc. in Applied Mathematics from the University of Toronto, where I had the opportunity to work with Professor Jeffrey Rosenthal on MCMC convergence and inference. I have also worked on quantitative research at **Optiver** and large-scale experimentation at **Roblox**.

**Research interests:** {{ site.data.profile.interests | join: '; ' }}.

## Recent publications

[All publications]({{ '/publications/' | relative_url }})

{% assign selected = site.data.publications | where: 'selected', true %}
{% for paper in selected %}
{% include publication-entry.html paper=paper summary=true %}
{% endfor %}

For research correspondence, reach me at [{{ site.data.profile.email }}](mailto:{{ site.data.profile.email }}).
