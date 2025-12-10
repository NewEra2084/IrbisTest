import {createAliasMap} from "@/js/utils";

const actionModules = import.meta.glob('./impl/*EventActions.js', { eager: true });

const actionsMap = createAliasMap(actionModules, "EventActions");

export function bindEventActions(appCtx){
    const res = {};
    Object.entries(actionsMap).forEach(([key,value]) => {
        res[key] = value(appCtx);
    });
    return res;
}

export function handleEvent(eventActions, event){
    const parts = event.title.split(/\./);
    if (parts.length == 2){
        let actionFn = eventActions;
        for (let i=0; i<parts.length; i++){
            if (actionFn){
                actionFn = actionFn[parts[i]];
            }else{
                break;
            }
        }
        if (actionFn && typeof actionFn == 'function'){
            actionFn(event.message);
        }
    }
}

export function handleEvents(eventActions, events){
    events?.forEach((event) => {
        handleEvent(eventActions,event);
    });
}