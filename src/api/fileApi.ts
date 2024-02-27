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
  return await axios.post('folder/deleteFolder', { folderIds: ids, status: status })
}

export const getFolderTreeApi = async (id: number) => {
  return await axios.post('/folder/getFolderTree', { folderId: id })
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
    'folder/downloadFolder',
    { folderId },
    {
      responseType: 'blob'
    }
  )
}
