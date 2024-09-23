const createHiddenInput = (form, name, value) => {
    const hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = name;
    hiddenField.value = value;
    form.appendChild(hiddenField);
}

export default createHiddenInput;