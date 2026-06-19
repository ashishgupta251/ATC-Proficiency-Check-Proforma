document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("userId").value;

  const password = document.getElementById("password").value;

  const user = USERS.find((u) => u.id === id && u.password === password);

  if (!user) {
    alert("Invalid ID or Password");

    return;
  }

  sessionStorage.setItem("user", JSON.stringify(user));

  location.href = "dashboard.html";
});
