import {
  faDiagramProject,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import {orgProfileFormData} from './forms/org_profile_form.js';
import {menuLinksData} from "@/data/general/menu/links.js";

const name = "cabinet_profile";

//const orgProfileFormData = {};

export const cabinetProfileData = {
    name : "cabinet_profile",

    header : {
        menu : {
            links : menuLinksData
        },
        toolbar : {
            buttons : []
        }
    },
    filters :[],
    sidebarItems : [
      { key: "profile", label: "Профиль", icon: faUser, link: "/cabinet/profile" },
      { key: "calendar", label: "Команды", icon: faDiagramProject, link: "/cabinet/calendar" },
    ],
    content:{
        type : "cabinet_profile",
        data :{
            forms : {
                org_profile : orgProfileFormData
            }
        }
    }
};