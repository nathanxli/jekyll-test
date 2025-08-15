---
layout: default
title: Courses
---

<!-- Controls -->
<section id="controls" aria-label="Course filters">
  <div class="tags" role="group" aria-label="Filter by subject">
    {% assign tags = site.courses | map: 'subjects' | join: ',' | split: ',' | uniq | sort %}
    {% for tag in tags %}
      <button class="tag-toggle" data-tag="{{ tag | downcase }}" aria-pressed="false">{{ tag }}</button>
    {% endfor %}
  </div>

   <div class="logic">
    <label>
      <input type="radio" name="logic" value="or" checked>
      OR
    </label>
    <label>
      <input type="radio" name="logic" value="and">
      AND
    </label>
  </div>
</section>

<!-- Grid -->
<section id="grid" aria-live="polite">
  {% for course in site.courses %}
    <article class="card"
             data-tags="{{ course.subjects | join: ',' | downcase }}">
      <h3 class="card__title">{{ course.title }}</h3>
      <p class="card__desc">{{ course.description }}</p>
      <ul class="card__tags">
        {% for t in course.subjects %}
          <li class="tag">{{ t }}</li>
        {% endfor %}
      </ul>
    </article>
  {% endfor %}
</section>
