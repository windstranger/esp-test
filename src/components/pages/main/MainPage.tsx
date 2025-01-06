'use client'

import {FileUploadDownloadControls} from "@/components/pages/main/PageControls";
import {LazyRender} from "@/components/pages/main/LazyRender";
import useSWR from "swr";
import {fetcher} from "@/components/pages/main/JSONDataRenderer";

export const MainPage = () => {

    //precache data needed to render edit form
    useSWR("/api/user-meta", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    return <div className={"pt-[126px] h-full"}>
        <FileUploadDownloadControls/>
        <LazyRender/>
    </div>

}
