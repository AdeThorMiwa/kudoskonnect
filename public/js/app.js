const logout = async () => {
  try {
    const res = await fetcher.get("http://localhost:5000/api/user/logout");

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    location.assign("/");
  } catch (e) {
    alert.error("Error Logging Out! Please Try Again.");
  }
};
