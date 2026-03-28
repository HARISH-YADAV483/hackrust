import axiosInstance from "./axiosInstance";

export const getProfile = async (token) => {
  const res = await axiosInstance.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const uploadProfilePic = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axiosInstance.put(
    "/users/profile/pic",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};