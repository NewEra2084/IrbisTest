import { PageContext, usePageContextValue } from "@/store/context/PageContext";

import Header from "@/pages/general/Header";
import Filters from "@/pages/general/Filters";
import Sidebar from "@/pages/general/Sidebar";
import Footer from "@/pages/general/Footer";
import Modal from '@/components/ui/modals/Modal';
import ModalTitle from "@/pages/general/modal/ModalTitle";

import AbstractContent from "@/pages/custom/content/AbstractContent";
import { useFilterStoreBase } from '@/store/filterStore';
import { useModalStore } from '@/store/modalStore';
import { createContextBindings } from '@/js/utils';

export default function Page({ data }) {
    const pageCtxValue = usePageContextValue();

    const modalCtx = createContextBindings(
        useModalStore,
        "Modal",
        [
            { open: "openModal" },
            { updateData: "updateModalProps"},
            { close: "closeModal" },
            { closeAll : "closeAllModals"}
        ]
    );

    const filtersCtx = createContextBindings(
        useFilterStoreBase,
        "Filters",
        [{isShowFilters:"showFilters"}]
    );

    const ctx = {
      ...modalCtx,
      ...filtersCtx,
    };

  return (
    <PageContext.Provider value={pageCtxValue}>
        <div className="bg-gray-50 font-sans flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
            <div className="flex-1 flex flex-col">
                <Header data={data.header} context={ctx}/>
                <div className={`transition-all duration-300 overflow-hidden ${ctx.Filters.isShowFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Filters filters={data.filters} filtersName={data.name} />
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar items={data.sidebarItems} />
                    <main className="p-6 flex-1 overflow-auto border-b border-t border-gray-200 dark:border-gray-700">
                        <AbstractContent
                                type={data.content.type}
                                data={data.content.data}
                                context={ctx}
                        />
                        <Modal TitleContent={ModalTitle}/>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    </PageContext.Provider>
  );
}
