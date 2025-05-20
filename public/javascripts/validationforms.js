(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("image");
    const fileList = document.getElementById("fileList");

    input.addEventListener("change", () => {
      const files = Array.from(input.files);
      if (files.length === 0) {
        fileList.textContent = "No files selected.";
      } else {
        fileList.innerHTML =
          `<strong>Selected Files:</strong><br>` +
          files.map((file) => `📄 ${file.name}`).join("<br>");
      }
    });
  });
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
