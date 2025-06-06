const generateFolderPath = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `social_app/users/${userId}/posts/${year}/${month}/`;
};

export default generateFolderPath;
