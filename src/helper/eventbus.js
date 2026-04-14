import { useEventBus } from "@vueuse/core"

export const useAppBaseEventBus = ()=>{
    return useEventBus('app.base.event');
}