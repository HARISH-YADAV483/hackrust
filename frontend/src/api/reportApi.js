import axiosInstance from "./axiosInstance";

export const createReport = async (form, token) => {
  const formData = new FormData();

  formData.append("description", form.description);
  formData.append("contact", form.contact);
  formData.append("domain", form.domain);
  formData.append("title", form.title);
formData.append("platform", form.platform);

  if (form.file) {
    formData.append("file", form.file);
  }

  const res = await axiosInstance.post("/reports", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};