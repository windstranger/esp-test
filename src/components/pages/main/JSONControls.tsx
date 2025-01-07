import { useAtomValue } from 'jotai/index';
import { jsonArrayAtom, jsonAtom } from '@/components/pages/main/atoms';
import { useCallback } from 'react';
import { saveJsonToFile } from '@/services/fileDownloader';
import { FilePicker } from '@/components/pages/main/private/FilePicker/FilePicker';

export function JSONControls() {
  const jsonData = useAtomValue(jsonAtom);
  const jsonArray = useAtomValue(jsonArrayAtom);
  const onDownloadJSON = useCallback(() => {
    if (jsonData) {
      saveJsonToFile({ data: jsonData, ids: jsonArray }, 'updatedData');
    }
  }, [jsonArray, jsonData]);

  return (
    <div className={'fixed top-0 left-0 w-full z-20 p-4 shadow-xl flex flex-col gap-2'}>
      {!!jsonArray.length && (
        <button  className={'bg-blue-300 w-full p-4'} onClick={onDownloadJSON}>
          Download JSON
        </button>
      )}
      <FilePicker />
    </div>
  );
}
