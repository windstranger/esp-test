import {useAtomValue} from "jotai/index";
import {jsonArrayAtom} from "@/components/pages/main/atoms";

import {JSONDataRenderer} from "@/components/pages/main/JSONDataRenderer";

export function JSONArrayRenderer() {
    const jsonIds = useAtomValue(jsonArrayAtom)
    // const nameAtom = selectAtom(jsonAtom, (users) => users.ids)
    return <div className={"flex flex-col gap-4 max-w-[320px]"}>{jsonIds?.map(el => {
        return <JSONDataRenderer key={el} el={el}/>
    })}</div>
}
