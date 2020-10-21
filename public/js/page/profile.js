const updateUser = async (formData) => {
  try {
    const res = await fetcher.patch("/api/user/updateMe", formData);

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success(
      `Profile Updated Successfully!`
    );
  } catch (e) {
    alert.error(res.message);
  }
};

const handleUserUpdate = (e) => {
  e.preventDefault();

  const fullname = document.querySelector("#updateFullname").value;
  const email = document.querySelector("#updateEmail").value;
  const phone = document.querySelector("#updateMobile").value;
  updateUser({ fullname, email, phone });
};

document.querySelector("#personalInformation").addEventListener("submit", handleUserUpdate)
