import pageContextStructBuilder from '../pageContextStructBuilder';
import {parseUrlPathParams} from "@/js/utils";

function extractStoresByCollection (appCtx, collection, keys = []) {
    return keys.reduce((acc, key) => {
      if (appCtx[key]) {
        acc[key] = collection ? appCtx[key][collection] || null : null;
        console.log("key:"+key+" collection:"+collection+" acc:"+acc[key]);
      } else {
        acc[key] = null;
      }
      return acc;
    }, {});
}

export const collectionPageContextStructure = pageContextStructBuilder(
    (location) => location.pathname.startsWith("/collections/"),
    (location, appCtx) => {
        const storesKeys = ["list"];

        const params = parseUrlPathParams(location.pathname,"/:collection");

        const {collection} = params;

        const {list,filter,...other} = appCtx;

        const stores = extractStoresByCollection(appCtx, collection, storesKeys);

        return {
          collection,
          ...stores,
          ...other
        };
    }
);