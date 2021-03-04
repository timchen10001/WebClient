import axios from "axios";

export const uploadImage = (formData: FormData) => {
  return axios({
    url: process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API_URL as string,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "mulipart/form-data",
    },
  });
};
