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

## Basic usage in Typescript

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

See demo source for a fully interactive example with Plotly functions: 
<https://github.com/boscoh/vue3-plotly-ts/blob/main/demo/src/App.vue/>

## Component props

* data `Plotly.Data[]` - array of objects, see [documentation](https://plotly.com/javascript/reference)
* layout `Partial<Plotly.Layout>` - layout on the page,
  see [documentation](https://plotly.com/javascript/reference/layout)
* config `Partial<Plotly.Config>` - configuration of
  interactivity [documentation](https://plotly.com/javascript/configuration-options)

## Event handlers 

Plotly provides a number of event handlers such as capturing a mouse
click on a data point. These are propagated to VuePlotly as 
event handlers which expect a callback. These are the expected
callback arguments:

* plotly_click `callback(event: Plotly.PlotMouseEvent)`
* plotly_hover `callback(event: Plotly.PlotHoverEvent)`
* plotly_unhover `callback(event: Plotly.PlotMouseEvent)`
* plotly_selecting `callback(event: Plotly.PlotSelectionEvent)`
* plotly_selected `callback(event: Plotly.PlotSelectionEvent)`
* plotly_restyle `callback(event: Plotly.PlotRestyleEvent)`
* plotly_relayout `callback(event: Plotly.PlotRelayoutEvent)`
* plotly_clickannotation `callback(event: Plotly.ClickAnnotationEvent)`
* plotly_legendclick `callback(event: Plotly.LegendClickEvent)`
* plotly_legenddoubleclick `callback(event: Plotly.LegendClickEvent)`
* plotly_sliderchange `callback(event: Plotly.SliderChangeEvent)`
* plotly_sliderend `callback(event: Plotly.SliderEndEvent)`
* plotly_sliderstart `callback(event: Plotly.SliderStartEvent)`
* plotly_sunburstclick `callback(event: Plotly.SunburstClickEvent)`
* plotly_event `callback(: any)`
* plotly_beforeplot `callback(event: Plotly.BeforePlotEvent)`
* plotly_afterexport `callback()`
* plotly_afterplot `callback()`
* plotly_animated `callback()`
* plotly_animationinterrupted `callback()`
* plotly_autosize `callback()`
* plotly_beforeexport `callback()`
* plotly_deselect `callback()`
* plotly_doubleclick `callback()`
* plotly_framework `callback()`
* plotly_redraw `callback()`
* plotly_transitioning `callback()`
* plotly_transitioninterrupted `callback()`
  
See the [Plotly event handler page](https://plotly.com/javascript/plotlyjs-events/) for further details.

## Plotly functions

There are several high-level [Plotly functions](https://plotly.com/javascript/plotlyjs-function-reference/) that allow dynamic
manipulations of plots such as animation
and saving images. To access these functions, you need 
the `id` of the `div` element of the Plotly graph. This
is given in the `plotlyId` property of the `VuePlotly` instance. Here is a schematic: 

```Vue
<template>
  <VuePlotly ref="plotRef"/>
</template>

<script setup>
  import VuePlotly from "vue3-plotly-ts"
  import Plotly from "plotly.js-dist-min"
  import {ref} from "vue"

  const plotRef = ref()
  Plotly.animate(plotref.value?.plotId, {data, ...}, {transition...})
</script>
```

Full details can be found in the [demo](https://github.com/boscoh/vue3-plotly-ts/blob/main/demo/src/App.vue).