export const getFormDataFromFileList = (
  fileList: FileList,
  fieldname: string
): FormData => {
  const formData = new FormData();
  for (let i = 0; i < fileList.length; i++) {
    formData.append(fieldname, fileList[i]);
  }
  return formData;
};
