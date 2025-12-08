import {extractStoreMethod} from "@/js/utils";

export default function userProfileEventActions(appCtx){
    return {
        full_name : function (msg){
            appCtx.main.user.getState().updateUser({fullName:msg});
        },
    };
};