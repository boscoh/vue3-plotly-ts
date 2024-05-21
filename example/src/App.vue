<script setup lang="ts">
import { ref } from 'vue'
import VuePlotly from 'vue3-plotly-ts'
import {
    animate,
    AnimationOpts,
    Data,
    Frame,
    Layout,
    PlotData,
    PlotMouseEvent,
} from 'plotly.js-dist-min'
import _ from 'lodash'

const plotRef = ref<typeof VuePlotly>()

const initData: Data[] = [
    {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter',
    },
]
const data = ref<Data[]>(initData)
const layout = ref<Partial<Layout>>({
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
  ref="plotRef"
  @plotly_click="onPlotlyClick"
/>`

const dataJsonString = ref(convertDataToString(initData as PlotData[]))

const plotlyClickString = ref('')

function onPlotlyClick(data: PlotMouseEvent) {
    const point = data.points[0]
    plotlyClickString.value = `plotly_click -> arg.points[0].y = ${_.cloneDeep(
        point.y
    )}`
}

function convertDataToString(data: PlotData[]) {
    return 'data[0].y = ' + JSON.stringify(data[0].y)
}

function randomizeData(): PlotData[] {
    const currData = _.cloneDeep(initData) as PlotData[]
    const y = currData[0].y
    for (let i = 0; i < y.length; i += 1) {
        y[i] = Math.round(Math.random() * 40)
    }
    dataJsonString.value = convertDataToString(currData)
    return currData
}

function onRandomize() {
    const currData = randomizeData()
    data.value = currData
    let newMaxY = Math.max(...(currData[0].y as number[]))
    if (!newMaxY) {
        return
    }
    const currLayout = _.cloneDeep(layout.value)
    currLayout['yaxis'] = { range: [0, newMaxY * 1.1] }
    layout.value = currLayout
}

async function onAnimate() {
    const animateOpts: Partial<AnimationOpts> = {
        transition: {
            duration: 500,
            easing: 'cubic-in-out',
        },
    }

    const currData = randomizeData()
    let newMaxY = Math.max(...(currData[0].y as number[]))
    console.log(currData[0].y, newMaxY)
    if (!newMaxY) {
        return
    }

    console.log(newMaxY)

    const layoutFrame: Partial<Frame> = {
        layout: { yaxis: { range: [0, newMaxY * 1.1] } },
    }
    await animate(plotRef.value?.plotlyId, layoutFrame, animateOpts)

    const dataaFrame: Partial<Frame> = { data: currData }
    await animate(plotRef.value?.plotlyId, dataaFrame, animateOpts)
}
</script>

<template>
    <h1>vue3-plotly-ts demo</h1>

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
