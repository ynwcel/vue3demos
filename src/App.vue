<template>
    <h1>app-base-event-data:</h1>
    <div style="padding:2rem;margin:1rem;border:1px solid #999;">{{ event_base_msg }}</div>
    <hr />
    <RouterView />
</template>

<script setup>
import { useAppBaseEventBus } from '@/helper';

let event_base_msg = ref('')
useAppBaseEventBus().on((event)=>{
    event_base_msg.value = JSON.stringify(event);
})


</script>