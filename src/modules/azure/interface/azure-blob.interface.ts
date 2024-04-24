export interface blobResult {
    status: boolean,
    path?: string
}

export interface blobRequest {
    fileName: string,
    data: any,
    mimetype: any,
    folderName: string,
    type: string
}