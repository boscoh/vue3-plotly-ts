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
    'plotly_autosize',
    'plotly_deselect',
    'plotly_doubleclick',
    'plotly_redraw',
    'plotly_animated',
    'plotly_afterplot',
])

const randomString = Math.random().toString(36).slice(2, 7)
const plotlyId = ref<string>(`plotly-${randomString}`)
const divRef = ref<HTMLDivElement>()

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

watchEffect(async () => {
    const data = props.data ? props.data : []
    if (isCreated) {
        const div = divRef.value as Plotly.Root
        Plotly.react(div, data, props.layout, props.config)
    } else if (divRef.value) {
        const div = await Plotly.newPlot(
            divRef.value as Plotly.Root,
            data,
            props.layout,
            props.config
        )

        resizeObserver.observe(div)

        div.on('plotly_click', (...args: any[]) =>
            emit('plotly_click', ...args)
        )
        div.on('plotly_hover', (...args: any[]) =>
            emit('plotly_hover', ...args)
        )
        div.on('plotly_unhover', (...args: any[]) =>
            emit('plotly_unhover', ...args)
        )
        div.on('plotly_selecting', (...args: any[]) =>
            emit('plotly_selecting', ...args)
        )
        div.on('plotly_selected', (...args: any[]) =>
            emit('plotly_selected', ...args)
        )
        div.on('plotly_restyle', (...args: any[]) =>
            emit('plotly_restyle', ...args)
        )
        div.on('plotly_relayout', (...args: any[]) =>
            emit('plotly_relayout', ...args)
        )
        div.on('plotly_autosize', (...args: any[]) =>
            emit('plotly_autosize', ...args)
        )
        div.on('plotly_deselect', (...args: any[]) =>
            emit('plotly_deselect', ...args)
        )
        div.on('plotly_doubleclick', (...args: any[]) =>
            emit('plotly_doubleclick', ...args)
        )
        div.on('plotly_redraw', (...args: any[]) =>
            emit('plotly_redraw', ...args)
        )
        div.on('plotly_animated', (...args: any[]) =>
            emit('plotly_animated', ...args)
        )
        div.on('plotly_afterplot', (...args: any[]) =>
            emit('plotly_afterplot', ...args)
        )

        isCreated = true
    }
})

onBeforeUnmount(() => {
    resizeObserver.disconnect()
    Plotly.purge(divRef.value as Plotly.Root)
})

defineExpose({ plotlyId })
</script>
