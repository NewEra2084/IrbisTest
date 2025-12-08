import React, { useEffect, useState, useCallback, useContext } from 'react';
import { PageContext } from "@/store/context/PageContext";
import PreloadContent from '../preload/PreloadContent';
import AbstractCardContent from '@/pages/custom/collections/cards/AbstractCardContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faEllipsisH, faBars } from '@fortawesome/free-solid-svg-icons';
//import FetchCollection from '@/pages/general/collections/impl/FetchCollection';
//import LazyCollection from '@/pages/general/collections/impl/LazyCollection';
import AbstractCollection from '@/pages/general/collections/AbstractCollection';
//import Pagination from '@/components/ui/pagination/Pagination';
import { useFilters } from '@/store/filterStore';

const view = {
    type : "card",
    buttons : []
};

export default function UserListContent(){
    return (
        <AbstractCollection type="grid" itemView={view} ElementContent={AbstractCardContent} PreloadContent={PreloadContent}/>
        /*<AbstractCollection type="grid" itemView={view} ElementContent={AbstractCardContent} PreloadContent={PreloadContent}>
            {({ Pagination, Collection }) => (
                <>
                  <div className="mb-4"><Pagination/></div>
                  <Collection />
                </>
            )}
        </AbstractCollection>*/
    );
}
