import PhotoMaker from '@/components/camera/PhotoMaker';
import GridSubmitForm from '@/components/ui/forms/GridSubmitForm';
import AbstractCard from '@/components/ui/cards/AbstractCard';
import UserProfileCardContent from './cabinet/UserProfileCardContent';
import OrgProfileCardContent from './cabinet/OrgProfileCardContent';
import React, { useState} from "react";
import ModalTitle from "@/pages/general/modal/ModalTitle";
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { cabinetApi } from "@/js/api-cabinet";
import mockApi from "@/js/api-mock";
import { translateDeep, modifyFormField } from "@/js/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';
import * as yup from "yup";

export default function CabinetProfileContent({data, context}) {
  //const { user, updateUser, avatarLink } = useAuthStore();
  const { user, updateUser, avatarLink } = useUserStore();
  const { t, i18n } = useTranslation();

  const lang = i18n.language;

  const [cols, setCols] = useState(3);
  const [modalId, setModalId] = useState(0);



  const formFields = [
                                                  {key:"name1", placeholder:"Имя", type:"input", cols:2,
                                                        validationType : "number",
                                                        validation: [
                                                            { method: "required" },
                                                            { method: "min", args: [18], message: "Возраст должен быть >= {1}" }
                                                        ]
                                                  },
                                                  {key:"name2", label:"Имя", type:"toggle", collection:"users", collectionView:"active"},
                                                  {key:"name3", label:"Имя", type:"input"},
                                                  {key:"name4", label:"Имя", type:"input", cols:2},
                                                  {key:"array1",label:"Пример массива",type:"array",cols:4, maxItems:2, add_element_message:"Добавить скил",
                                                    fields:[
                                                        {key:"arr1", placeholder:"Имя", type:"input", cols:2,
                                                            //validationType : "number",
                                                            validation: [
                                                                { method: "required" },
                                                                //{ method: "min", args: [18], message: "Возраст должен быть >= {1}" }
                                                            ]
                                                        },
                                                        {key:"arr2", placeholder:"Имя", type:"input"},
                                                        {key:"array2", label:"Вложенный массив", type:"array", cols:3,
                                                            fields:[
                                                                {key:"v1", label:"Имя", type:"input", cols:2},
                                                                {key:"v2", label:"Имя", type:"input", cols:1},
                                                            ]
                                                        }
                                                    ]
                                                  }
                                              ];

        const modifyProps = function (props){
            console.log(props.cols);

            return {...props,cols : props.cols==1 ? 3 : props.cols-1};
        }

        const formSubmit = (modalId,setError) => {
            return async function (data) {
                // Покажем данные для отладки
                setError(JSON.stringify(data));

                try {
                  // Ждём ответа мок-API
                  const fSave = await mockApi(true, false, 2000);

                  // Закрываем модалку после успешного "сохранения"
                  context.Modal.close(modalId);
                } catch (err) {
                  console.error("Ошибка при сохранении:", err);
                  setError(err.message);
                }
              };
        };


  const handleOrgProfileEdit = function (){
        const loadFields = async function (){
            const orgTypes = await cabinetApi.getOrgTypes(lang);

            return translateDeep(modifyFormField(data.forms.org_profile.fields,'orgType',{options:orgTypes}),t);
            //return formFields;
        }

        context.Modal.open({
                    type:"lazy_grid_form",
                    title:t('action.edit_profile'),
                    props : {
                        loadFields : loadFields,
                        cols: data.forms.org_profile,
                        onSubmit:formSubmit,
                        validationMessages: t('form.validation', { returnObjects: true }),
                        controlMessages: t('form.control', { returnObjects: true }),
                    },
                    TitleContent:ModalTitle
        });

        /*const translated = translateDeep(data.forms.org_profile,t);

        context.Modal.open({
            type:"grid_form",
            title:<ModalTitle title={t('action.edit_profile')}/>,
            props : {
                ...translated,
                onSubmit:formSubmit,
                validationMessages: t('form.validation', { returnObjects: true }),
                controlMessages: t('form.control', { returnObjects: true }),
            }
        });*/
        return false;
  };

  const saveFullName = async (newName) => {
      const fSave = await cabinetApi.setFullName(newName);
      updateUser({ fullName: newName });
    };

  const userAvatarLink = () => {
        return user.avatarKey ? avatarLink() : user.avatar;
  };

  const handleSaveUserAvatar = async (file) => {
        const serverAvatarKey = await cabinetApi.uploadAvatar(file);
        const serverUrl = cabinetApi.buildAvatarUrl(serverAvatarKey);
        updateUser({ avatar: serverUrl, avatarKey: serverAvatarKey });
        return serverUrl;
  };

  const handleRemoveUserAvatar = async () => {
        if (user.avatarKey) await cabinetApi.deleteAvatar();
        updateUser({ avatar: null, avatarKey: null });
  };


  return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
              <AbstractCard type={"simple"}>
                     <UserProfileCardContent
                        user={user}
                        saveFullName={saveFullName}
                        imageLink={userAvatarLink}
                        onSaveImage={handleSaveUserAvatar}
                        onRemoveImage={handleRemoveUserAvatar}
                     />
              </AbstractCard>
              <AbstractCard type={"simple"} buttons={[{onClick:handleOrgProfileEdit,prefix:"Редактировать", icon:faEdit}]}>
                    <OrgProfileCardContent
                                            imageLink={userAvatarLink}
                                            onSaveImage={handleSaveUserAvatar}
                                            onRemoveImage={handleRemoveUserAvatar}
                                         />
              </AbstractCard>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-6">
              <AbstractCard type={"simple"} >
                    <div>Режим работы</div>
              </AbstractCard>
        </div>
    </>
  );
}