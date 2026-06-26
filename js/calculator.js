document.addEventListener("DOMContentLoaded", function () {
  const gradingRows = Array.from(
    document.querySelectorAll(".pi-table tbody tr"),
  ).filter((row) => row.querySelector('input[type="checkbox"]'));

  gradingRows.forEach((row) => {
    for (let i = 1; i <= 5; i++) {
      let td = row.querySelector(`td:nth-last-child(${i})`);
      if (td) {
        let cb = td.querySelector('input[type="checkbox"]');
        if (cb) {
          cb.dataset.grade = i;

          td.style.cursor = "pointer";
          td.addEventListener("click", function (e) {
            if (e.target !== cb) {
              cb.click();
            }
          });

          cb.addEventListener("change", function () {
            if (this.checked) {
              row
                .querySelectorAll('input[type="checkbox"]')
                .forEach((otherCb) => {
                  if (otherCb !== this) otherCb.checked = false;
                });
              row.style.backgroundColor = "";
            }
            runLiveCalculation();
          });
        }
      }
    }
  });

  function runLiveCalculation() {
    let totalMarks = 0;
    let isFail = false;
    let gradedCount = 0;

    gradingRows.forEach((row) => {
      const checkedBox = row.querySelector('input[type="checkbox"]:checked');
      if (checkedBox) {
        let grade = parseInt(checkedBox.dataset.grade);
        totalMarks += grade;
        gradedCount++;

        const snCell = row.querySelector(".center-text");
        if (snCell && snCell.innerText.trim() === "01" && grade < 5) {
          isFail = true;
        }
      }
    });

    const maxPossibleMarks = 125;
    let percentage = 0;

    const outMarks = document.getElementById("outMarks");
    const outPercentage = document.getElementById("outPercentage");
    const chkPass = document.getElementById("chkPass");
    const chkFail = document.getElementById("chkFail");

    if (outMarks) {
      outMarks.value = gradedCount > 0 ? totalMarks : "";
    }

    if (outPercentage) {
      if (gradedCount > 0) {
        percentage = (totalMarks * 100) / maxPossibleMarks;
        outPercentage.value =
          (percentage % 1 === 0 ? percentage : percentage.toFixed(2)) + "%";
      } else {
        outPercentage.value = "";
      }
    }

    if (chkPass && chkFail) {
      if (gradedCount > 0) {
        if (percentage >= 80 && !isFail) {
          chkPass.innerHTML = "&#10003;";
          chkFail.innerHTML = "";
        } else {
          chkPass.innerHTML = "";
          chkFail.innerHTML = "&#10003;";
        }
      } else {
        chkPass.innerHTML = "";
        chkFail.innerHTML = "";
      }
    }
  }
});