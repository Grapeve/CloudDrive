import axios from '@/utils/axios'

export const renameFileApi = async (id: number, newFilename: string) => {
  return await axios.put('/file', { id: id, newFilename: newFilename })
}

export const deleteFileApi = async (ids: number[], category: number = 0) => {
  return await axios.delete('/file', { data: { fileIdList: ids, category: category } })
}

export const getFolderApi = async (id: number, keyword: string = '') => {
  return await axios.post('/folder/getFolder', { folderId: id, keyword: keyword })
}

export const createFolderApi = async (foldername: string, id: number) => {
  return await axios.post('/folder/addFolder', { name: foldername, parentId: id })
}

export const renameFolderApi = async (id: number, newFoldername: string) => {
  return await axios.post('/folder/updateFolder', { folderId: id, name: newFoldername })
}

export const deleteFolderApi = async (ids: number[], status: number = 0) => {
  return await axios.post('/folder/deleteFolder', { folderIds: ids, status: status })
}

export const getFolderTreeApi = async (id: number) => {
  return await axios.post('/folder/getFolderTree', { folderId: id })
}

export const searchFilesByMimeTypeApi = async (type: string) => {
  return await axios.post('/folder/searchFilesByMimeType', { type: type })
}

export const getRecentFilesApi = async () => {
  return await axios.get('/folder/getRecentFiles')
}

export const moveFolderApi = async (
  srcFolderIds: number[],
  srcFileIds: number[],
  destFolderId: number
) => {
  return await axios.post('/folder/moveFolder', { srcFolderIds, srcFileIds, destFolderId })
}

export const singleUploadFileApi = async (formData: FormData) => {
  return await axios.post('/file/singleUploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
    // responseType: 'blob'
  })
}

export const uploadFolderApi = async (parentId: number, formData: FormData) => {
  return await axios.post(`/folder/uploadFolder?parentId=${parentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const addFileDataToDBApi = async (fileData: any) => {
  return await axios.post('/file', { ...fileData })
}

export const downloadFileApi = async (key: string) => {
  return await axios.post(
    '/file/downloadFile',
    { objectKey: key },
    {
      responseType: 'blob'
    }
  )
}

export const downloadFolderApi = (folderId: number) => {
  return axios.post(
    '/folder/downloadFolder',
    { folderId },
    {
      responseType: 'blob'
    }
  )
}

// 浏览回收站文件
export const getRecycleBinApi = () => {
  return axios.get('/folder/getRecycleBin')
}

// 在某个文件夹下搜索文件或文件夹（既搜索当前文件夹，也搜索子孙文件夹）
export const searchFileOrFolders = (id: number, keyword: string = '') => {
  return axios.post('folder/searchFilesOrFolders', { folderId: id, keyword: keyword })
}

// 批量从回收站取回文件
export const retrieveFileApi = (idList: Number[]) => {
  return axios.put('/file/retrieveFile', { idList: idList })
}

// 批量从回收站取回文件夹
export const retrieveFolderApi = (idList: Number[]) => {
  return axios.post('/folder/retrieveFolder', { folderIds: idList })
}

// 分片上传
export const initiateMultipartUploadApi = (filename: string) => {
  return axios.post(`/file/initiateMultipartUpload?filename=${filename}`)
}

export const uploadPart = (key: string, uploadId: string, chunkNum: number, file: FormData) => {
  return axios.post(`/file/uploadPart?key=${key}&uploadId=${uploadId}&chunkNum=${chunkNum}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const completeMultipartUploadApi = (
  key: string,
  uploadId: string,
  partETagDTOs: any[],
  uploadFileDTO: object
) => {
  return axios.post('/file/completeMultipartUpload', { key, uploadId, partETagDTOs, uploadFileDTO })
}
