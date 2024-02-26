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
