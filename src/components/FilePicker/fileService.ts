import {JSONData, User} from "@/models/User";
import {convertArrayToObject} from "@/services/arrayObjectConverter";

type JsonObject = { [key: string]: number | string | boolean };

// json parser of chunks of large files
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

// implementation for really large files
export async function processLargeJsonFile(file: File, onObjectsRead: (objects: User[]) => void) {
    const reader = file.stream().getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = ''; // Buffer for incomplete JSON data

    while (true) {
        const {done, value} = await reader.read();

        if (done) {
            break; // End of file
        }

        buffer += decoder.decode(value, {stream: true});

        // Process JSON objects from the buffer
        const {remainingBuffer, objects} = extractJsonObjects(buffer);
        buffer = remainingBuffer;

        onObjectsRead(objects as User[])
    }

    // Handle leftover buffer
    try {
        if (buffer.trim()) {
            const finalObject = JSON.parse(buffer.trim());

            onObjectsRead([finalObject])
        }
    } catch {
        console.error('Invalid JSON at the end of the file.');
    }

    console.log('File processing complete!');
}

export function simpleFileReader(file: File) {
    return new Promise<JSONData>((resolve, reject) => {
        const reader = new FileReader(); // Create a FileReader instance

        // Define the onload event to parse and display the JSON
        reader.onload = function (e: ProgressEvent<FileReader>) {
            try {
                if (e.target?.result && typeof e.target?.result === 'string') {
                    const json = JSON.parse(e.target.result); // Parse JSON content
                    const data = convertArrayToObject(json)
                    resolve(data)
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    reject('Invalid JSON file! ' + error.message)
                }
            }
        };

        reader.onerror = () => {
            reject("cant read file");
        }

        reader.readAsText(file);
    })
}
