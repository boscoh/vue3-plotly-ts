# vue-plotly-ts

Plotly.js component for Vue3 in (optional) Typescript:

- type definitions in Typescript
- written in composition API 
- distinguish between `newPlot` and `react`
- attach to ResizeObserver
- propagate `plotly_*` event handlers

## Live demo

<https://boscoh.github.io/vue3-plotly-ts/>

## Install

```bash
npm i vue3-plotly-ts
```

## Usage with composition API in Typescript

```Vue

<template>
  <VuePlotly
    :data="data"
    :layout="layout"
    ref="plotRef"
    @plotly_click="onPlotlyClick"
  />
</template>

<script setup lang="ts">
  import {ref} from "vue"
  import VuePlotly from "vue3-plotly-ts"
  import Plotly from "plotly.js-dist-min"

  const data: Plotly.Data[] = [
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'scatter',
    }
  ]

  const layout = ref<Partial<Plotly.Layout>>({
    height: 230,
    title: 'Example plot',
  })

  const plotRef = ref<typeof VuePlotly>()

  function onPlotlyClick(data: Plotly.PlotMouseEvent) {
    console.log(data.points)
  }
</script>
```

## How to use VuePlotly in Typescript

<https://github.com/boscoh/vue3-plotly-ts/blob/main/demo/src/App.vue/>

## Component props

* data `Plotly.Data[]` - array of objects, see [documentation](https://plotly.com/javascript/reference)
* layout `Partial<Plotly.Layout>` - layout on the page,
  see [documentation](https://plotly.com/javascript/reference/layout)
* config `Partial<Plotly.Config>` - configuration of
  interactivity [documentation](https://plotly.com/javascript/configuration-options)

## Event handlers 

Plotly provides a number of event handlers such as capturing a mouse
click on data point These
are propagated to VuePlotly via the handlers `@plotly_event="yourHandler"`. For
function signatures see [the Plotly event handler page](https://plotly.com/javascript/plotlyjs-events/):

* `plotly_click` 
* `plotly_hover` 
* `plotly_selecting` 
* `plotly_restyle` 
* `plotly_relayout` 
* `plotly_clickannotation` 
* `plotly_animatingframe` 
* `plotly_legendclick` 
* `plotly_sliderchange` 
* `plotly_sliderend` 
* `plotly_sliderstart` 
* `plotly_sunburstclick` 
* `plotly_event` 
* `plotly_beforeplot` 

## Plotly functions

There are several high level Plotly functions that allow dynamic
manipulations of plots over and above data changes, such as animation
and saving images. To access these functions, you need 
the `id` of the `div` element of the Plotly graph. This
is given in the `plotlyId` property of the `VuePlotly` instance.

Here is a schematic. Full details can be found in
the [demo](https://github.com/boscoh/vue3-plotly-ts/blob/main/demo/src/App.vue).

```Vue
<template>
  <VuePlotly
    :data="data"
    ref="plotRef"
  />
</template>

<script setup>
  import VuePlotly from "vue3-plotly-ts"
  import {ref} from "vue"
  const plotRef = ref()
  Plotly.animate(plotref.value?.plotId, {data, ...}, {transition...})
</script>
```