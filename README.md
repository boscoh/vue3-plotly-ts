# vue-plotly-ts

Plotly.js component for Vue3 in Typescript:
- type definitions in Typescript
- written in composition API
- distinguish between `newPlot` and `react`
- attach to ResizeObserver
- propagate `plotly_*` event handlers 
- examples to load data in Typescript
- example for Plotly functions such as `animate`

## Live demo

<https://boscoh.github.io/vue3-plotly-ts/>

## Install

```bash
npm i vue3-plotly-ts
```

## Usage with composition API in Typescript

```Vue
<template>
  <VuePlot
    :data="data"
    :layout="layout"
    ref="plotRef"
    @plotly_click="onPlotlyClick"
  />
</template>

<script setup lang="ts">
  import {ref} from "vue"
  import VuePlot from "vue3-plotly-ts"
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
  
  const plotRef = ref<typeof VuePlot>()

  function onPlotlyClick(data: Plotly.PlotMouseEvent) {
    console.log(data.points)
  }
</script>
```

## Component props

* data `Plotly.Data[]` - data to be displayed
* layout `Partial<Plotly.Layout>` - graphic layout
* config `Partial<Plotly.Config>` - configuration parameters

## Event handlers in props

Plotly provides a number of event handlers, and these 
are propagated to VuePlotly via the handlers `@plotly_event="yourHandler"`. For 
function signatures see [the Plotly event handler page](https://plotly.com/javascript/plotlyjs-events/):

* `plotly_click` - Function
* `plotly_hover` - Function
* `plotly_selecting` - Function
* `plotly_restyle` - Function
* `plotly_relayout` - Function
* `plotly_clickannotation` - Function
* `plotly_animatingframe` - Function
* `plotly_legendclick` - Function
* `plotly_sliderchange` - Function
* `plotly_sliderend` - Function
* `plotly_sliderstart` - Function
* `plotly_sunburstclick` - Function
* `plotly_event` - Function
* `plotly_beforeplot` - Function

##  Plotly functions 

There are several high level Plotly functions that allow dynamic 
manipulations of plots over and above data changes, such as animation
and saving images. To access these functions, you will need the `plotlyId`
that gives the `id` of the `div` element containg the Plotly graph.

Here is a schematic. Full details can be found in the [example](https://github.com/boscoh/vue3-plotly-ts/tree/main/example).

```Vue
<template>
  <VuePlot
    :data="data"
    ref="plotRef"
  />
</template>

<script setup lang="ts">
  import {ref} from "vue"
  import VuePlot from "vue3-plotly-ts"
  import Plotly from "plotly.js-dist-min"

  const plotRef = ref<typeof VuePlot>()
  const frame: Plotly.Frame = {data: ...}
  Plotly.animate(plotref.value?.plotId, frame, {})
</script>
```