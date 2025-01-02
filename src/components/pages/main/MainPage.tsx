'use client'

import {PageControls} from "@/components/pages/main/PageControls";
import {JSONArrayRenderer} from "@/components/pages/main/JSONArrayRenderer";
import {LazyRender} from "@/components/pages/main/LazyRender";

export const MainPage = () => {
    return (<div>
            <PageControls/>
            <div id={"output"}></div>
            <LazyRender/>
            {/*<JSONArrayRenderer/>*/}
        </div>
    )
}
