<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import VuePlotly from 'vue3-plotly-ts'
import Plotly from 'plotly.js-dist-min'
import _ from 'lodash'

const plot = ref<typeof VuePlotly>()
const data = ref<Plotly.Data[]>(randomizeData())
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

const dataString = ref(convertDataToString(data.value as Plotly.PlotData[]))
const clickString = ref('onPlotlyClick(event) ->')

const codeString =
`<VuePlotly
  :data="data"
  ref="plot"
  @plotly_click="onPlotlyClick"
/>`

const idString = computed(() => {
    return ` plot.value.plotlyId = "${plot.value?.plotlyId}"`
})

function convertDataToString(data: Plotly.PlotData[]) {
    return 'data[0].y = ' + JSON.stringify(data[0].y, null, 2)
}

function randomizeData(): Plotly.PlotData[] {
    function buildData() {
        const n = 20
        const x = _.range(1, n + 1)
        const y = _.map(x, () => Math.round(Math.random() * 40))
        return { x, y, type: 'scatter' } as Plotly.PlotData
    }

    return [buildData(), buildData(), buildData()]
}

async function onRandomize() {
    console.log('onRandomize')
    const currData = randomizeData()
    dataString.value = convertDataToString(currData)
    data.value = currData

    await nextTick()

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
    dataString.value = convertDataToString(currData)
    console.log('onAnimate randomData', currData)

    // Note: if layout is done before data, there is some SVG bug
    // that only occurs in the built SPA
    console.log('onAnimate data')
    const dataaFrame: Partial<Plotly.Frame> = { data: currData }
    await Plotly.animate(plot.value?.plotlyId, dataaFrame, animateOpts)
    data.value = currData

    await nextTick()

    let newMaxY = Math.max.apply(null, currData[0].y as number[])
    const layoutFrame: Partial<Plotly.Frame> = {
        layout: { yaxis: { range: [0, newMaxY * 1.1] } },
    }
    console.log('onAnimate layout')
    await Plotly.animate(plot.value?.plotlyId, layoutFrame, animateOpts)

    // Have to reset plotly handlers after a layout animate.
    // Debug at your own leisure for your cases
    plot.value?.setPlotlyEventHandlers()
}

function onPlotlyClick(data: Plotly.PlotMouseEvent) {
    const point = data.points[0]
    clickString.value = `onPlotlyClick(event) -> event.points[0].y = ${_.cloneDeep(
        point.y
    )}`
}

</script>

<template>
    <div class="narrow">
        <h1>demo: vue3-plotly-ts</h1>

        <div>
            github:
            <a href="https://github.com/boscoh/vue3-plotly-ts/"
                >boscoh/vue3-plotly-ts</a
            >
        </div>

        <code class="card">import VuePlotly from 'vue3-plotly-ts</code>

        <code><pre class="card">{{ codeString }}</pre></code>

    </div>

    <div class="wide">
        <VuePlotly
            ref="plot"
            @plotly_click="onPlotlyClick"
            :data="data"
            :layout="layout"
        />
    </div>

    <div class="narrow">
        <div style="margin: 10px 0">
            <button @click="onRandomize">randomize</button>
            &nbsp;<button @click="onAnimate">animate</button>
            &nbsp; [click on points]
        </div>


        <code class="card">{{ dataString }}</code>

        <code class="card">{{ idString }}</code>

        <code class="card">{{ clickString }}</code>
    </div>
</template>

<style scoped>
code {
    margin-top: 10px;
}
pre {
    margin: 0;
}
.card {
    padding: 0.3rem 1rem;
    border: 1px solid #ddd;
}
.narrow {
    width: 80%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
}

.wide {
    width: 80%;
}
</style>