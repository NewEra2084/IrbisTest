
export const orgProfileFormData = {
    cols: 1,
    fields : [
        {key:"shortName", placeholder:"@i18n(form.field.short_name)", type:"input",
            validation: [
                { method: "required" },
                //{ method: "min", args: [18], message: "Возраст должен быть >= {1}" }
            ]
        },
        {key:"fullName", placeholder:"@i18n(form.field.full_name)", type:"input",
            validation: [
                { method: "required" },
                //{ method: "min", args: [18], message: "Возраст должен быть >= {1}" }
            ]
        },
        {key:"orgType", label:"@i18n(form.field.org_type)", type:"select",
            description:"@i18n(form.description.org_type)",
            options:[
                {key:1,value:"ИТ компания"},
                {key:2,value:"Другая компания"},
            ],

            validation: [
                { method: "required" }
            ]
        }
    ]
};

/*,
        {key:"positions",label:"@i18n(form.field.work_positions)",type:"array",
            add_element_message:"@i18n(form.control.add_work_position)",
            remove_element_message:"@i18n(form.control.remove_work_position)",
            fields:[
                {key:"position", placeholder:"@i18n(form.field.work_position)", type:"input",
                    validation: [
                        { method: "required" }
                    ]
                }
            ]
        },
        {key:"taskTypes",label:"@i18n(form.field.task_types)",type:"array",
            add_element_message:"@i18n(form.control.add_task_type)",
            remove_element_message:"@i18n(form.control.remove_task_type)",
            fields:[
                {key:"position", placeholder:"@i18n(form.field.task_type)", type:"input",
                    validation: [
                        { method: "required" }
                    ]
                }
            ]
        }*/