---
layout: default
title: Courses
---

# Coursework

<!-- Controls: Functionality for sorting courses by tags -->
<section id="controls" aria-label="Course filters">
  <!-- Tags -->
  <div class="tags" role="group" aria-label="Filter by subject">
    <!--
    Gets all possible tags from courses, then creates an alphabetical set of tags.
    site.courses = all items in the courses collection
    map: 'subjects' = pulling each course item's 'subjects' field, which is an array for the subject tags
    -->
    {% assign tags = site.courses | map: 'subjects' | join: ',' | split: ',' | uniq | sort %}
    <!--
    Loop through each tag from the created set, then create a button for selecting the tag
    -->
    {% for tag in tags %}
      <button class="tag-toggle" data-tag="{{ tag | downcase }}" aria-pressed="false">{{ tag }}</button>
    {% endfor %}
  </div>

  <!-- Buttons for AND / OR selection -->
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
  <!--
  Loop over all course elements and emit one <article> per item
  -->
  {% for course in site.courses %}
    <article class="card" data-tags="{{ course.subjects | join: ',' | downcase }}">
      <h3 class="card__title">{{ course.title }}</h3>
      <p class="card__desc">{{ course.description }}</p>
      <!-- Render tags in each grid item -->
      <ul class="card__tags">
        {% for t in course.subjects %}
          <li class="tag">{{ t }}</li>
        {% endfor %}
      </ul>
    </article>
  {% endfor %}
</section>
