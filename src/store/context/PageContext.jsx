import { createContext, useMemo, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "./AppContext";
import {createAliasMap, matchAntPath} from "@/js/utils";

const contextStructs = import.meta.glob('./page/impl/*PageContextStruct.js', { eager: true });

const contextStructsMap = createAliasMap(contextStructs, "PageContextStruct");

export const PageContext = createContext(null);


function addContextType(ctx, type){
    return {type, ...ctx};
}

function defaultPageContextBuilder(location, appCtx){
    const {list,filter,...other} = appCtx;
    const stores = extractStoresByCollection(appCtx, collection, storesKeys);

    return addContextType(other,"default");
};


function matchSimpleRule(location, rule){
    if (typeof rule == "string") {
        return matchAntPath(rule,location.pathname) ? 1 : 0;
    }else if (typeof rule == "function"){
        return rule(location);
    }else{
        return 0;
    }
}

function matchRule(location, rule){
    if (typeof rule == "array"){
        let max = 0;
        rule.forEach((r) => {
            let v = matchSimpleRule(location,r);
            if (max < v) max = v;
        });
        return max;
    }else{
        return matchSimpleRule(location,rule);
    }
}

function matchContextBuilder(location){
    let max = 0, res = undefined;
    Object.entries(contextStructsMap).forEach(([field, value]) => {
        let v = matchRule(location, value.rule);
        if (max < v){
            max = v;
            res = (location, appCtx) => addContextType(value.builder(location, appCtx),field);
        }
    });
    return res;
}


/**
 * Создаёт PageContext на основе AppContext и URL.
 * Например, /users → list: appCtx.lists.users
 */
export function usePageContextValue() {
  const appCtx = useContext(AppContext);
  const location = useLocation();

  return useMemo(() => {
    return contextStructsMap["collection"].builder(location, appCtx);
  }, [location.pathname, appCtx]);
}
