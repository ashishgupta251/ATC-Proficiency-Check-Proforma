document.addEventListener("DOMContentLoaded", function () {
  
  // --- NAYA STRICT LOGIN CHECK ---
  const user = JSON.parse(sessionStorage.getItem("user"));
  
  // Agar user logged in nahi hai, toh seedha index.html (Login page) par bhej do
  if (!user) {
    window.location.href = "../index.html";
    return; // Code ko yahin rok do taaki form load hi na ho
  }
  // -------------------------------

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

  // ... (Baaki ki file ka aage ka pura code waise ka waisa hi rahega jaise pichli baar diya tha)

  // UTC Clock Logic
  function updateUTC() {
    const now = new Date();
    const utcTime = now.toISOString().substring(11, 19);
    const clockEl = document.getElementById("utcClock");
    if (clockEl) clockEl.innerText = utcTime + " UTC";
  }
  setInterval(updateUTC, 1000);
  updateUTC();

  // Logout Logic
  const logoutBtn = document.getElementById("globalLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.clear();
      window.location.href = "../index.html";
    });
  }

  // Populate Datalist using the new Array Structure
  const dataList = document.getElementById("employeeList");
  if (dataList && typeof EMPLOYEE_ROSTER !== "undefined") {
    EMPLOYEE_ROSTER.forEach((emp) => {
      let option = document.createElement("option");
      option.value = emp.display;
      dataList.appendChild(option);
    });
  }

  // Updated Autofill Logic
  function setupAutoFill(inputId, licenceId) {
    const inputEl = document.getElementById(inputId);
    const licenceEl = document.getElementById(licenceId);

    if (inputEl && licenceEl) {
      inputEl.addEventListener("input", function () {
        const selectedValue = this.value;

        if (typeof EMPLOYEE_ROSTER !== "undefined") {
          // Find the selected employee in the new array structure
          const matchedEmp = EMPLOYEE_ROSTER.find(
            (emp) => emp.display === selectedValue
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

        // Clean name for Assessee signature block
        if (inputId === "cName") {
          let cleanName = selectedValue.split(" (")[0];
          const sigLabel = document.getElementById("lblAssesseeName");
          if (sigLabel) sigLabel.value = cleanName || selectedValue;
        }
      });
    }
  }

  setupAutoFill("cName", "cLicence");
  setupAutoFill("eName", "eLicence");

  const form = document.getElementById("proficiencyForm");
  const savePdfBtn = document.getElementById("globalSavePdfBtn");

  // Trigger form validation on Save PDF button click
  if (savePdfBtn && form) {
    savePdfBtn.addEventListener("click", function () {
      if (!form.reportValidity()) {
        return;
      }
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    });
  }

  // Validation and Print Logic
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Reset custom validation
      document
        .querySelectorAll('.radio-container input[type="radio"]')
        .forEach((r) => r.setCustomValidity(""));

      const radioGroups = new Set();
      document
        .querySelectorAll('.radio-container input[type="radio"]')
        .forEach((r) => radioGroups.add(r.name));
      const sortedGroups = Array.from(radioGroups).sort();

      let missingGroup = null;

      // Check if any radio group is completely unchecked
      for (let name of sortedGroups) {
        if (!document.querySelector(`input[name="${name}"]:checked`)) {
          missingGroup = name;
          break;
        }
      }

      // Handle Validation Failure
      if (missingGroup) {
        const radios = document.querySelectorAll(
          `input[name="${missingGroup}"]`
        );
        const firstRadio = radios[0];

        firstRadio.setCustomValidity(
          "Please select a grade for this identifier."
        );
        firstRadio.reportValidity();

        const row = firstRadio.closest("tr");
        if (row) {
          const originalBg = row.style.backgroundColor;
          row.style.backgroundColor = "#ffe6e6"; // Highlight missing row in red
          row.style.transition = "background-color 0.3s";

          radios.forEach((r) => {
            r.addEventListener(
              "change",
              function () {
                firstRadio.setCustomValidity("");
                row.style.backgroundColor = originalBg;
              },
              { once: true }
            );
          });
        }
        return false;
      }

      // Handle Validation Success & Provide Print Notification UX
      const originalBtnHtml = savePdfBtn.innerHTML;
      savePdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
      savePdfBtn.style.pointerEvents = "none";

      setTimeout(() => {
        window.print();
        // Reset button after print dialog opens
        savePdfBtn.innerHTML = originalBtnHtml;
        savePdfBtn.style.pointerEvents = "auto";
      }, 500); // Small delay to let the UI update the loading state
    });
  }
});
