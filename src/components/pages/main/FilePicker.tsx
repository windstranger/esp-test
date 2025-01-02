import {useSetAtom} from "jotai/index";
import {jsonAtom} from "@/components/pages/main/atoms";
import {ChangeEvent, useCallback, useState} from "react";

type JsonObject = { [key: string]: any };

const CHUNK_SIZE = 32 * 1024; // 32kB

function extractJsonObjects(buffer: string): { remainingBuffer: string; objects: JsonObject[] } {
    const objects: JsonObject[] = [];
    let remainingBuffer = '';

    // Detect and process complete objects in the buffer
    let startIdx = 0;
    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === '{') {
            startIdx = i; // Start of a JSON object
        } else if (buffer[i] === '}') {
            const jsonString = buffer.slice(startIdx, i + 1);

            try {
                const obj = JSON.parse(jsonString); // Try parsing the JSON object
                objects.push(obj);
                startIdx = i + 1; // Move the start index forward
            } catch {
                // Ignore invalid JSON fragments
            }
        }
    }

    // Save remaining unprocessed data in the buffer
    if (startIdx < buffer.length) {
        remainingBuffer = buffer.slice(startIdx);
    }

    return {remainingBuffer, objects};
}

export async function processLargeJsonFile(file: File): Promise<void> {
    const reader = file.stream().getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = ''; // Buffer for incomplete JSON data

    const outputElement = document.getElementById('output') as HTMLUListElement;

    while (true) {
        const {done, value} = await reader.read();

        if (done) {
            break; // End of file
        }

        buffer += decoder.decode(value, {stream: true});

        // Process JSON objects from the buffer
        const {remainingBuffer, objects} = extractJsonObjects(buffer);
        buffer = remainingBuffer;

        // Display objects
        objects.forEach((obj, i) => {
            const li = document.createElement('li');
            li.textContent = JSON.stringify(obj, null, 2);
            outputElement.appendChild(li);

            // debugger
        });
    }

    // Handle leftover buffer
    try {
        if (buffer.trim()) {
            const finalObject = JSON.parse(buffer.trim());
            const li = document.createElement('li');
            li.textContent = JSON.stringify(finalObject, null, 2);
            outputElement.appendChild(li);
        }
    } catch {
        console.error('Invalid JSON at the end of the file.');
    }

    console.log('File processing complete!');
}

export function FilePicker() {
    const setJSONData = useSetAtom(jsonAtom);
    const [isLoading, setIsLoading] = useState<boolean>()
    const fileProcessor = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        const file = event.target?.files?.[0]; // Get the selected file
        if (!file) {
            alert('No file selected!');
            return;
        }

        await processLargeJsonFile(file);

        // const reader = new FileReader(); // Create a FileReader instance
        //
        // // Define the onload event to parse and display the JSON
        // reader.onload = function (e: ProgressEvent<FileReader>) {
        //     try {
        //         if (e.target?.result && typeof e.target?.result === 'string') {
        //             const json = JSON.parse(e.target.result); // Parse JSON content
        //             const data = convertArrayToObject(json)
        //             setJSONData(data)
        //         }
        //     } catch (error: unknown) {
        //         if (error instanceof Error) {
        //             console.log('Invalid JSON file!', error.message);
        //         }
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };
        //
        // reader.onerror = () => {
        //     setIsLoading(false);
        // }
        //
        // reader.readAsText(file);

    }, [setJSONData]);

    return <div>
        {isLoading && "Loading..."}
        <input type="file" onChange={fileProcessor} accept={"application/json"}/>
    </div>
}
