const loginUser = async (email, password) => {
  try {
    const res = await fetcher.post("http://localhost:5000/api/user/login", {
      email,
      password,
    });

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success("Login Successful.");
    setTimeout(() => location.assign("/"), 2000);
  } catch (e) {
    alert.error(res.message);
  }
};

const handleLoginForm = (e) => {
  e.preventDefault();

  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;
  loginUser(email, password);
};

document
  .querySelector("#loginForm")
  .addEventListener("submit", handleLoginForm);
