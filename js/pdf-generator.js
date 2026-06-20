const submitBtn =
document.getElementById("submitBtn");

submitBtn.addEventListener("click", submitForm);

function submitForm() {

    const marks =
        document.getElementById("marks").value;

    if (!marks || Number(marks) === 0) {

        alert(
            "Please complete the assessment."
        );

        return;
    }

    const confirmPrint = confirm(
        "Assessment completed. Print now?"
    );

    if (confirmPrint) {

        window.print();

    }
}