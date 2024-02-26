export const convertSize = (size: number) => {
  if (size / 1024 < 1) {
    return size + 'B'
  } else if (size / 1024 < 1e3) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size / 1024 < 1e6) {
    return (size / 1024 / 1024).toFixed(2) + 'MB'
  }
}
