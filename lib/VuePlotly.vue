<template>
    <div ref="divRef" :id="plotlyId"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watchEffect } from 'vue'
import Plotly from 'plotly.js-dist-min'

const props = defineProps<{
    data?: Plotly.Data[]
    layout?: Partial<Plotly.Layout>
    config?: Partial<Plotly.Config>
}>()

const emit = defineEmits([
    'plotly_click',
    'plotly_hover',
    'plotly_unhover',
    'plotly_selecting',
    'plotly_selected',
    'plotly_restyle',
    'plotly_relayout',
    'plotly_relayouting',
    'plotly_clickannotation',
    'plotly_animatingframe',
    'plotly_legendclick',
    'plotly_legenddoubleclick',
    'plotly_sliderchange',
    'plotly_sliderend',
    'plotly_sliderstart',
    'plotly_sunburstclick',
    'plotly_event',
    'plotly_beforeplot',
    'plotly_afterexport',
    'plotly_afterplot',
    'plotly_animated',
    'plotly_animationinterrupted',
    'plotly_autosize',
    'plotly_beforeexport',
    'plotly_deselect',
    'plotly_doubleclick',
    'plotly_framework',
    'plotly_redraw',
    'plotly_transitioning',
    'plotly_transitioninterrupted',
])

const randomString = Math.random().toString(36).slice(2, 7)
const plotlyId = ref<string>(`plotly-${randomString}`)
const divRef = ref<Plotly.PlotlyHTMLElement>()

let isCreated = false

function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number
): (...args: Params) => void {
    let timer: NodeJS.Timeout
    return (...args: Params) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func(...args)
        }, timeout)
    }
}

function resize() {
    Plotly.Plots.resize(divRef.value as Plotly.Root)
}

const resizeObserver = new ResizeObserver(debounce(resize, 50))

function setPlotlyEventHandlers() {
    const div = divRef.value as Plotly.PlotlyHTMLElement
    div.on('plotly_click', (e: Plotly.PlotMouseEvent) => {
        emit('plotly_click', e)
    })
    div.on('plotly_hover', (e: Plotly.PlotHoverEvent) => {
        emit('plotly_hover', e)
    })
    div.on('plotly_unhover', (e: Plotly.PlotMouseEvent) => {
        emit('plotly_unhover', e)
    })
    div.on('plotly_selecting', (e: Plotly.PlotSelectionEvent) => {
        emit('plotly_selecting', e)
    })
    div.on('plotly_selected', (e: Plotly.PlotSelectionEvent) => {
        emit('plotly_selected', e)
    })
    div.on('plotly_restyle', (e: Plotly.PlotRestyleEvent) => {
        emit('plotly_restyle', e)
    })
    div.on('plotly_relayout', (e: Plotly.PlotRelayoutEvent) => {
        emit('plotly_relayout', e)
    })
    div.on('plotly_clickannotation', (e: Plotly.ClickAnnotationEvent) => {
        emit('plotly_clickannotation', e)
    })
    div.on('plotly_legendclick', (e: Plotly.LegendClickEvent) => {
        emit('plotly_legendclick', e)
        return true
    })
    div.on('plotly_legenddoubleclick', (e: Plotly.LegendClickEvent) => {
        emit('plotly_legenddoubleclick', e)
        return true
    })
    div.on('plotly_sliderchange', (e: Plotly.SliderChangeEvent) => {
        emit('plotly_sliderchange', e)
    })
    div.on('plotly_sliderend', (e: Plotly.SliderEndEvent) => {
        emit('plotly_sliderend', e)
    })
    div.on('plotly_sliderstart', (e: Plotly.SliderStartEvent) => {
        emit('plotly_sliderstart', e)
    })
    div.on('plotly_sunburstclick', (e: Plotly.SunburstClickEvent) => {
        emit('plotly_sunburstclick', e)
    })
    div.on('plotly_event', (e: any) => {
        emit('plotly_event', e)
    })
    div.on('plotly_beforeplot', (e: Plotly.BeforePlotEvent) => {
        emit('plotly_beforeplot', e)
        return true
    })
    div.on('plotly_afterexport', () => {
        emit('plotly_afterexport')
    })
    div.on('plotly_afterplot', () => {
        emit('plotly_afterplot')
    })
    div.on('plotly_animated', () => {
        emit('plotly_animated')
    })
    div.on('plotly_animationinterrupted', () => {
        emit('plotly_animationinterrupted')
    })
    div.on('plotly_autosize', () => {
        emit('plotly_autosize')
    })
    div.on('plotly_beforeexport', () => {
        emit('plotly_beforeexport')
    })
    div.on('plotly_deselect', () => {
        emit('plotly_deselect')
    })
    div.on('plotly_doubleclick', () => {
        emit('plotly_doubleclick')
    })
    div.on('plotly_framework', () => {
        emit('plotly_framework')
    })
    div.on('plotly_redraw', () => {
        emit('plotly_redraw')
    })
    div.on('plotly_transitioning', () => {
        emit('plotly_transitioning')
    })
    div.on('plotly_transitioninterrupted', () => {
        emit('plotly_transitioninterrupted')
    })
}

watchEffect(async () => {
    const data = props.data ? props.data : []
    const div = divRef.value as Plotly.Root
    if (isCreated) {
        Plotly.react(div, data, props.layout, props.config)
    } else if (div) {
        await Plotly.newPlot(div, data, props.layout, props.config)
        resizeObserver.observe(div as Plotly.PlotlyHTMLElement)
        setPlotlyEventHandlers()
        isCreated = true
    }
})

onBeforeUnmount(() => {
    resizeObserver.disconnect()
    Plotly.purge(divRef.value as Plotly.Root)
})

defineExpose({ plotlyId, setPlotlyEventHandlers })
</script>