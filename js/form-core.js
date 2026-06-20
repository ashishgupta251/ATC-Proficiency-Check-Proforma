document.addEventListener("DOMContentLoaded", function() {
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
            inputEl.addEventListener('input', function() {
                const selectedName = this.value;
                if (typeof EMPLOYEE_ROSTER !== "undefined" && EMPLOYEE_ROSTER[selectedName]) {
                    const licNo = EMPLOYEE_ROSTER[selectedName];
                    licenceEl.value = (licNo === "NA" || licNo === "N/A") ? "NA" : licNo;
                } else {
                    licenceEl.value = "";
                }

                if (inputId === 'cName') {
                    let cleanName = selectedName.split(' (')[0];
                    const sigLabel = document.getElementById('lblAssesseeName');
                    if (sigLabel) sigLabel.value = cleanName || selectedName;
                }
            });
        }
    }

    setupAutoFill('cName', 'cLicence');
    setupAutoFill('eName', 'eLicence');

    const form = document.getElementById('proficiencyForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let missingPIs = [];
            const radioGroups = new Set();
            document.querySelectorAll('.radio-container input[type="radio"]').forEach(r => radioGroups.add(r.name));
            
            const sortedGroups = Array.from(radioGroups).sort();
            sortedGroups.forEach(name => {
                if (!document.querySelector(`input[name="${name}"]:checked`)) {
                    missingPIs.push(name.replace('pi', ''));
                }
            });

            if (missingPIs.length > 0) {
                alert(`Error! Form poora nahi bhara hai.\nKripya in Performance Identifiers (PI) me grade de:\n👉 PI No: ${missingPIs.join(', ')}`);
                return false;
            }

            setTimeout(() => window.print(), 300);
        });
    }
});