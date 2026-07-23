<template>
    <div style="padding:1rem;margin:1rem">
        <h1>Hello World</h1>
        <hr />
        <p>font-size:1.4rem</p>
        <p class="f16rem">font-size:1.6rem</p>
        <p class="f18rem">font-size:1.8rem</p>
        <p class="f20rem">font-size:2.0rem</p>
        <p>util.ffixwidth() = {{ util.ffixwidth() }}</p>
        <hr />
        <button @click="sendMsg" style="padding:.6rem">use-eventbus-send-msg</button>
    </div>
</template>

<script setup>
import { useAppBaseEventBus } from '@/helper';
import { util } from '@/helper';

console.log(util);
const sendMsg = (e)=>{
    useAppBaseEventBus().emit({
        event:e,
        data:{
            a:1,
            b:2,
            t:(new Date()).getTime(),
        }
    })
}

</script>