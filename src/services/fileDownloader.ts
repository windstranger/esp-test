import {JSONData, User} from "@/models/User";
import {convertObjectToArray} from "@/services/arrayObjectConverter";

export function saveJsonToFile(data: JSONData, filename: string): void {
    const objToSave = convertObjectToArray(data);
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(objToSave, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`; // Set the filename

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the URL and removing the link
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
}
