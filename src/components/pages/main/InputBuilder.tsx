import {memo, useCallback, useEffect, useRef} from "react";
import {useSetAtom} from "jotai/index";
import {jsonAtom} from "@/components/pages/main/atoms";
import {dataTypeConverter} from "@/services/typeConverters";

export function InputBuilderFn({fieldName, dataType, value, elId}: {
    fieldName: string,
    elId: number,
    dataType: string,
    value?: boolean | number | string
}) {
    console.log(`field ${fieldName} with type ${dataType} and initial value ${value} rerenders`);
    const setJSONData = useSetAtom(jsonAtom);
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
    const handleChange = useCallback((event: Event) => {
        const target = event.target as HTMLInputElement;
        console.log("Input value changed to:", target.value);
        setJSONData(prev => {
            if (prev) {
                prev[elId] = {...prev[elId], [fieldName]: dataTypeConverter(dataType, target.value)};
                return {...prev};
            }
        });
    }, [dataType, elId, fieldName, setJSONData]);

    useEffect(() => {
        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.addEventListener("input", handleChange);
            // Cleanup event listener on component unmount
            return () => {
                inputElement.removeEventListener("input", handleChange);
            };
        }
    }, [handleChange]);

    if (dataType === "boolean") {
        return <input ref={inputRef as React.Ref<HTMLInputElement>} className={"bg-gray-100 p-2 border"}
                      type={"checkbox"} defaultChecked={value as boolean}/>;
    }

    if (Array.isArray(dataType)) {
        return <select ref={inputRef as React.Ref<HTMLSelectElement>} className={"bg-gray-100 p-2 border"}
                       defaultValue={value as string}>
            {dataType.map(opt => {
                return <option key={opt} value={opt}>{opt}</option>;
            })}
        </select>;
    }

    return <input ref={inputRef as React.Ref<HTMLInputElement>} className={"bg-gray-100 p-2 border"}
                  defaultValue={value as string | number} type={dataType}/>;
}

export const InputBuilder = memo(InputBuilderFn);
