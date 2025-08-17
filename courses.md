---
layout: default
title: Courses
---

<!-- 1. Page Header -->
<header class="page-header">
  <h1 class="page-title">{{ page.title }}</h1>
  <p class="page-subtitle">Browse by subject. Combine filters with OR/AND.</p>
</header>

<!-- 2. Controls: Tags and OR/AND Toggle -->
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
  <div class="logic logic--switch" aria-label="Match logic">
    <label class="switch" title="Toggle AND / OR">
      <input id="logicSwitch" type="checkbox" aria-label="Toggle AND (on) / OR (off)">
      <span class="switch__track" aria-hidden="true"></span>
      <span class="switch__thumb" aria-hidden="true"></span>
    </label>
    <span id="logicLabel" class="logic__mode" aria-live="polite" role="status">OR</span>
  </div>

</section>

<!-- 3. Grid -->
<section id="grid" aria-live="polite">
  {% for course in site.courses %}
    <article class="card"
             data-tags="{{ course.subjects | join: ',' | downcase }}"
             tabindex="0" aria-label="Open details for {{ course.title }}">
      <h3 class="card__title">{{ course.title }}</h3>
      <p class="card__desc">{{ course.description }}</p>
      <ul class="card__tags">
        {% for t in course.subjects %}
          <li class="tag">{{ t }}</li>
        {% endfor %}
      </ul>
      <!-- Hidden details template for the modal -->
      <template class="card__details">
        <article>
          <h2 id="modal-title" class="modal__title">{{ course.title }}</h2>
          <p class="modal__lead">
            {% if course.long_description %}{{ course.long_description }}{% else %}{{ course.description }}{% endif %}
          </p>
          <dl class="modal__meta">
            {% if course.subjects %}<dt>Subjects</dt><dd>{{ course.subjects | join: ', ' }}</dd>{% endif %}
            {% if course.credits %}<dt>Credits</dt><dd>{{ course.credits }}</dd>{% endif %}
            {% if course.prereqs %}<dt>Prereqs</dt><dd>{{ course.prereqs }}</dd>{% endif %}
            {% if course.semester %}<dt>Offered</dt><dd>{{ course.semester }}</dd>{% endif %}
          </dl>
        </article>
      </template>
    </article>
  {% endfor %}
</section>

<!-- 4. Modal (hidden by default) -->
<div id="modal" class="modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal__backdrop"></div>
  <div class="modal__dialog" role="document">
    <button class="modal__close" aria-label="Close">×</button>
    <div id="modal-content"></div>
  </div>
</div>
