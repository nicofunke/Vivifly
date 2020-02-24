/**
 * Interface for window to store global variables that can be accessed by WebGL to
 * load models
 */
export interface Window {
    triLibFiles: {
        name: string,
        data: Uint8Array
    }[],
    triLibFilesCount: number,
    triLibFileIndex: number,
    triLibResetFiles: (length: number) => void,
    triLibAddFile: (filename: string, filedata: Uint8Array) => void,
    triLibHandlePaste: (text: string) => void
}