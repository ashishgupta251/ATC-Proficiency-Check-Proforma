document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(sessionStorage.getItem("user")) || {
    name: "Controller",
  };

  const navbarHTML = `
        <div class="common-navbar no-print">
            <div class="nav-left">
                <img src="../assets/bglogo.png" onerror="this.src='../assets/logo.png'" alt="AAI Logo" class="nav-logo">
                <span class="brand-text">AIRPORTS AUTHORITY OF INDIA</span>
            </div>
            <div class="nav-center">
                <i class="fa-regular fa-clock"></i> <span id="utcClock">00:00:00 UTC</span>
            </div>
            <div class="nav-right">
                <span class="nav-user">Welcome, ${user.name}</span>
                <button type="button" class="nav-btn nav-pdf" id="globalSavePdfBtn"><i class="fa-solid fa-file-pdf"></i> Save PDF</button>
                <button type="button" class="nav-btn nav-logout" id="globalLogoutBtn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  function updateUTC() {
    const now = new Date();
    const utcTime = now.toISOString().substring(11, 19);
    const clockEl = document.getElementById("utcClock");
    if (clockEl) clockEl.innerText = utcTime + " UTC";
  }
  setInterval(updateUTC, 1000);
  updateUTC();

  const logoutBtn = document.getElementById("globalLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.clear();
      window.location.href = "../index.html";
    });
  }

  const dataList = document.getElementById("employeeList");
  if (dataList && typeof EMPLOYEE_ROSTER !== "undefined") {
    for (const name of Object.keys(EMPLOYEE_ROSTER)) {
      let option = document.createElement("option");
      option.value = name;
      dataList.appendChild(option);
    }
  }

  function setupAutoFill(inputId, licenceId) {
    const inputEl = document.getElementById(inputId);
    const licenceEl = document.getElementById(licenceId);

    if (inputEl && licenceEl) {
      inputEl.addEventListener("input", function () {
        const selectedName = this.value;
        if (
          typeof EMPLOYEE_ROSTER !== "undefined" &&
          EMPLOYEE_ROSTER[selectedName]
        ) {
          const licNo = EMPLOYEE_ROSTER[selectedName];
          licenceEl.value = licNo === "NA" || licNo === "N/A" ? "NA" : licNo;
        } else {
          licenceEl.value = "";
        }

        if (inputId === "cName") {
          let cleanName = selectedName.split(" (")[0];
          const sigLabel = document.getElementById("lblAssesseeName");
          if (sigLabel) sigLabel.value = cleanName || selectedName;
        }
      });
    }
  }
  setupAutoFill("cName", "cLicence");
  setupAutoFill("eName", "eLicence");

  const form = document.getElementById("proficiencyForm");
  const savePdfBtn = document.getElementById("globalSavePdfBtn");

  if (savePdfBtn && form) {
    savePdfBtn.addEventListener("click", function () {
      if (!form.reportValidity()) {
        return;
      }

      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      document
        .querySelectorAll('.radio-container input[type="radio"]')
        .forEach((r) => r.setCustomValidity(""));

      const radioGroups = new Set();
      document
        .querySelectorAll('.radio-container input[type="radio"]')
        .forEach((r) => radioGroups.add(r.name));
      const sortedGroups = Array.from(radioGroups).sort();

      let missingGroup = null;

      for (let name of sortedGroups) {
        if (!document.querySelector(`input[name="${name}"]:checked`)) {
          missingGroup = name;
          break;
        }
      }

      if (missingGroup) {
        const radios = document.querySelectorAll(
          `input[name="${missingGroup}"]`,
        );
        const firstRadio = radios[0];

        firstRadio.setCustomValidity(
          "Please select a grade for this identifier.",
        );
        firstRadio.reportValidity();

        const row = firstRadio.closest("tr");
        if (row) {
          const originalBg = row.style.backgroundColor;
          row.style.backgroundColor = "#ffe6e6";
          row.style.transition = "background-color 0.3s";

          radios.forEach((r) => {
            r.addEventListener(
              "change",
              function () {
                firstRadio.setCustomValidity("");
                row.style.backgroundColor = originalBg;
              },
              { once: true },
            );
          });
        }
        return false;
      }

      setTimeout(() => window.print(), 300);
    });
  }
});
