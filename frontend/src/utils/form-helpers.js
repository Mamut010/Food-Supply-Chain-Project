import { formatDate } from "./date-helpers"

export const readFormInputsAsJson = (form) => {
    let jsonInput = {};
    const inputElements = form.elements;
	for (let i = 0; i < inputElements.length; i++) {
        if(inputElements[i].nodeName === "INPUT") {
            const value = inputElements[i].value;
            jsonInput[inputElements[i].name] = (inputElements[i].type === "date") ? formatDate(value) : (value ?? "");
        }
	}

    return jsonInput;
}

export const sanitize = (str) => {
    return str.trim();
}