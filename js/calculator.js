document.addEventListener("DOMContentLoaded", function () {
  function runLiveCalculation() {
    let totalMarks = 0;
    let pi01Value = null;
    let gradedCount = 0;

    const radioGroups = new Set();
    document
      .querySelectorAll('.radio-container input[type="radio"]')
      .forEach((r) => radioGroups.add(r.name));
    const totalPIsCount = radioGroups.size;

    for (let i = 1; i <= totalPIsCount; i++) {
      const sn = String(i).padStart(2, "0");
      const selectedRadio = document.querySelector(
        `input[name="pi${sn}"]:checked`,
      );
      if (selectedRadio) {
        const marks = parseInt(selectedRadio.value);
        totalMarks += marks;
        gradedCount++;
        if (i === 1) pi01Value = marks;
      }
    }

    const maxPossibleMarks = totalPIsCount * 5;
    const percentage = ((totalMarks * 100) / maxPossibleMarks).toFixed(2);

    const outMarks = document.getElementById("outMarks");
    const outPercentage = document.getElementById("outPercentage");
    if (outMarks) outMarks.value = totalMarks > 0 ? totalMarks : "";
    if (outPercentage)
      outPercentage.value = totalMarks > 0 ? percentage + "%" : "";

    const chkPass = document.getElementById("chkPass");
    const chkFail = document.getElementById("chkFail");

    if (chkPass && chkFail) {
      if (gradedCount > 0) {
        if (pi01Value === 5 && percentage >= 80) {
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

  document
    .querySelectorAll('.radio-container input[type="radio"]')
    .forEach((radio) => {
      radio.addEventListener("change", runLiveCalculation);
    });
});
