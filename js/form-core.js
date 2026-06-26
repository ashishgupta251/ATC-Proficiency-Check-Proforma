document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const navbarHTML = `
    <div class="common-navbar no-print">
      <div class="nav-left">
        <div class="brand-box">
          <img src="../assets/bglogo.png" onerror="this.src='../assets/logo.png'" alt="AAI Logo" class="nav-logo">
          <span class="brand-text">AIRPORTS AUTHORITY OF INDIA</span>
        </div>
      </div>
      <div class="nav-center">
        <i class="fa-regular fa-clock"></i> <span id="utcClock">00:00:00 UTC</span>
      </div>
      <div class="nav-right">
        <span class="nav-user">Welcome, ${user.name}</span>
        <button type="button" class="nav-btn nav-pdf no-print" id="globalSavePdfBtn">
          <i class="fa-solid fa-file-pdf"></i> Save PDF
        </button>
        <button type="button" class="nav-btn nav-logout no-print" id="globalLogoutBtn">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
        </button>
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

  const controllerListEl = document.getElementById("controllerList");
  if (controllerListEl && typeof CONTROLLER_LIST !== "undefined") {
    CONTROLLER_LIST.forEach((emp) => {
      if (emp.display !== "") {
        let option = document.createElement("option");
        option.value = emp.display;
        controllerListEl.appendChild(option);
      }
    });
  }

  const examinerListEl = document.getElementById("examinerList");
  if (examinerListEl && typeof EXAMINER_LIST !== "undefined") {
    EXAMINER_LIST.forEach((emp) => {
      if (emp.display !== "") {
        let option = document.createElement("option");
        option.value = emp.display;
        examinerListEl.appendChild(option);
      }
    });
  }

  function setupAutoFill(inputId, licenceId, listData) {
    const inputEl = document.getElementById(inputId);
    const licenceEl = document.getElementById(licenceId);

    if (inputEl && licenceEl) {
      inputEl.addEventListener("input", function () {
        const selectedValue = this.value;

        if (typeof listData !== "undefined") {
          const matchedEmp = listData.find(
            (emp) => emp.display === selectedValue,
          );
          if (matchedEmp) {
            licenceEl.value =
              matchedEmp.licence === "NA" || matchedEmp.licence === "N/A"
                ? "NA"
                : matchedEmp.licence;
          } else {
            licenceEl.value = "";
          }
        }

        if (inputId === "cName") {
          let cleanName = selectedValue.split(" (")[0];
          const sigLabel = document.getElementById("lblAssesseeName");
          if (sigLabel) sigLabel.value = cleanName || selectedValue;
        }
      });
    }
  }

  setupAutoFill("cName", "cLicence", CONTROLLER_LIST);
  setupAutoFill("eName", "eLicence", EXAMINER_LIST);

  const remarksToggle = document.getElementById("remarksToggle");
  const txtRemarks = document.getElementById("txtRemarks");

  if (remarksToggle && txtRemarks) {
    remarksToggle.addEventListener("change", function () {
      if (this.value !== "") {
        if (txtRemarks.value.trim() === "") {
          txtRemarks.value = this.value;
        } else {
          txtRemarks.value += " " + this.value;
        }
        this.value = "";
      }
    });
  }

  const form = document.getElementById("proficiencyForm");
  const savePdfBtn = document.getElementById("globalSavePdfBtn");

  if (savePdfBtn && form) {
    savePdfBtn.addEventListener("click", function () {
      if (!form.reportValidity()) return;

      let allFilled = true;
      let firstMissingRow = null;

      const gradingRows = Array.from(
        document.querySelectorAll(".pi-table tbody tr"),
      ).filter((row) => row.querySelector('input[type="checkbox"]'));

      gradingRows.forEach((row) => {
        const isChecked = row.querySelector('input[type="checkbox"]:checked');
        if (!isChecked) {
          allFilled = false;
          row.style.backgroundColor = "#ffe6e6";
          if (!firstMissingRow) firstMissingRow = row;
        } else {
          row.style.backgroundColor = "";
        }
      });

      if (!allFilled) {
        alert(
          "Incomplete Form! Please select a grade for all Performance Identifiers to continue.",
        );
        firstMissingRow.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const originalBtnHtml = savePdfBtn.innerHTML;
      savePdfBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
      savePdfBtn.style.pointerEvents = "none";

      setTimeout(() => {
        window.print();
        savePdfBtn.innerHTML = originalBtnHtml;
        savePdfBtn.style.pointerEvents = "auto";
      }, 400);
    });
  }
});
