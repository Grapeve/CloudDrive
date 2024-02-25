import axios from '@/utils/axios'

export const renameFileApi = async (id: number, newFilename: string) => {
  return await axios.put('/file', { id: id, newFilename: newFilename })
}

export const createFolderApi = async (foldername: string, id: number) => {
  return await axios.post('/folder/addFolder', { name: foldername, parentId: id })
}

export const renameFolderApi = async (id: number, newFoldername: string) => {
  return await axios.post('/folder/updateFolder', { folderId: id, name: newFoldername })
}
