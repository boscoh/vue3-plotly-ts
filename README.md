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
callback function arguments:

* plotly_click -  `(e: Plotly.PlotMouseEvent)`
* plotly_hover -  `(e: Plotly.PlotHoverEvent)`
* plotly_unhover -  `(e: Plotly.PlotMouseEvent)`
* plotly_selecting -  `(e: Plotly.PlotSelectionEvent)`
* plotly_selected -  `(e: Plotly.PlotSelectionEvent)`
* plotly_restyle -  `(e: Plotly.PlotRestyleEvent)`
* plotly_relayout -  `(e: Plotly.PlotRelayoutEvent)`
* plotly_clickannotation -  `(e: Plotly.ClickAnnotationEvent)`
* plotly_legendclick -  `(e: Plotly.LegendClickEvent)`
* plotly_legenddoubleclick -  `(e: Plotly.LegendClickEvent)`
* plotly_sliderchange -  `(e: Plotly.SliderChangeEvent)`
* plotly_sliderend -  `(e: Plotly.SliderEndEvent)`
* plotly_sliderstart -  `(e: Plotly.SliderStartEvent)`
* plotly_sunburstclick -  `(e: Plotly.SunburstClickEvent)`
* plotly_event -  `(e: any)`
* plotly_beforeplot -  `(e: Plotly.BeforePlotEvent)`
* plotly_afterexport -  `()`
* plotly_afterplot -  `()`
* plotly_animated -  `()`
* plotly_animationinterrupted -  `()`
* plotly_autosize -  `()`
* plotly_beforeexport -  `()`
* plotly_deselect -  `()`
* plotly_doubleclick -  `()`
* plotly_framework -  `()`
* plotly_redraw -  `()`
* plotly_transitioning -  `()`
* plotly_transitioninterrupted -  `()`
  
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