<script setup lang="ts">
import { ref } from 'vue'
import VuePlotly from 'vue3-plotly-ts'
import Plotly from 'plotly.js-dist-min'
import _ from 'lodash'

const plotRef = ref<typeof VuePlotly>()

const initData: Plotly.Data[] = [
    {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter',
    },
]
const data = ref<Plotly.Data[]>(initData)
const layout = ref<Partial<Plotly.Layout>>({
    margin: {
        l: 20,
        r: 20,
        b: 20,
        t: 20,
        pad: 4,
    },
    height: 230,
    title: '',
})

const codeString = `import VuePlotly from 'vue3-plotly-ts'

<VuePlotly
  :data="data"
  :layout="layout"
  :config="config"
  ref="plotRef"
  @plotly_click="onPlotlyClick"
/>`

const dataJsonString = ref(convertDataToString(initData as Plotly.PlotData[]))

const plotlyClickString = ref('')

function onPlotlyClick(data: Plotly.PlotMouseEvent) {
    const point = data.points[0]
    plotlyClickString.value = `plotly_click -> arg.points[0].y = ${_.cloneDeep(
        point.y
    )}`
}

function convertDataToString(data: Plotly.PlotData[]) {
    return 'data[0].y = ' + JSON.stringify(data[0].y)
}

function randomizeData(): Plotly.PlotData[] {
    const currData = _.cloneDeep(initData) as Plotly.PlotData[]
    const y = currData[0].y
    for (let i = 0; i < y.length; i += 1) {
        y[i] = Math.round(Math.random() * 40)
    }
    dataJsonString.value = convertDataToString(currData)
    return currData
}

function onRandomize() {
    console.log('onRandomize')
    const currData = randomizeData()
    data.value = currData
    const newMaxY = Math.max.apply(null, currData[0].y as number[])
    const currLayout = _.cloneDeep(layout.value)
    currLayout['yaxis'] = { range: [0, newMaxY * 1.1] }
    layout.value = currLayout
}

async function onAnimate() {
    console.log('onAnimate')
    const animateOpts: Partial<Plotly.AnimationOpts> = {
        transition: {
            duration: 500,
        },
    }
    const currData = randomizeData()
    console.log('onAnimate randomData', currData)

    // Note: if layout is done before data, there is some SVG bug
    // that only occurs in the built SPA
    console.log('onAnimate data')
    const dataaFrame: Partial<Plotly.Frame> = { data: currData }
    await Plotly.animate(plotRef.value?.plotlyId, dataaFrame, animateOpts)
    data.value = currData

    let newMaxY = Math.max.apply(null, currData[0].y as number[])
    const layoutFrame: Partial<Plotly.Frame> = {
        layout: { yaxis: { range: [0, newMaxY * 1.1] } },
    }
    console.log('onAnimate layout')
    await Plotly.animate(plotRef.value?.plotlyId, layoutFrame, animateOpts)

    // Have to reset plotly handlers after a layout animate.
    // Debug at your own leisure for your cases
    plotRef.value?.setPlotlyEventHandlers()
}
</script>

<template>
    <h1>demo: vue3-plotly-ts</h1>

    github:
    <a href="https://github.com/boscoh/vue3-plotly-ts/"
        >boscoh/vue3-plotly-ts</a
    >

    <pre
        style="padding: 20px; border: 1px solid #ddd; text-align: left"
    ><code>{{ codeString }}
    </code></pre>

    <pre style="text-align: left"><code>
[composition] plotRef.value.plotlyId = "{{ plotRef?.plotlyId }}"
[options] this.$ref.plotRef.plotlyId = "{{ plotRef?.plotlyId }}"
    </code></pre>

    <div style="width: 100%">
        <VuePlotly
            ref="plotRef"
            @plotly_click="onPlotlyClick"
            :data="data"
            :layout="layout"
        />
    </div>

    <div style="margin-top: 10px">
        <button @click="onRandomize">randomize</button>
        &nbsp;<button @click="onAnimate">animate</button>
        &nbsp; [click on points]
    </div>

    <pre style="text-align: left"><code>{{ dataJsonString }}
{{ plotlyClickString }}
    </code></pre>
</template>

<style scoped></style>