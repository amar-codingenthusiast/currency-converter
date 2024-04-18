let types = document.querySelectorAll(".type");
let amounts = document.querySelectorAll(".amount");
let para1 = document.querySelector("#para1");
let para2 = document.querySelector("#para2");
let para3 = document.querySelector("#para3");
let about = document.querySelector("#footer span");
let timestamp = 0;

let baseURL = "https://openexchangerates.org/api/latest.json?app_id=68a69aa66d244ddead2047b8d7f3dfe4";
const callAPI = async (from, to, amount) => {
    let promise = await fetch(baseURL);
    let data = await promise.json();
    let result = data["rates"][to] / data["rates"][from] * amount;
    timestamp = data["timestamp"];
    return result.toFixed(3);
};
types.forEach(type => {
    for (code in codes) {
        let newOption = document.createElement("option");
        newOption.innerText = codes[code];
        newOption.value = code;
        type.append(newOption);
        types[0].value = "INR";
        types[1].value = "USD";
    }
});

window.addEventListener("load", async () => {
    let result = await callAPI("INR", "USD", 1);
    para1.innerText = `1 Indian Rupee equals`;
    para2.innerText = `${result} United States Dollar`;
    amounts[0].value = 1;
    amounts[1].value = result;
    updateDateTime();
});

types.forEach(type => {
    type.addEventListener("change", async () => {
        para1.innerText = `1 ${codes[types[0].value]} equals`;
        let result = await callAPI(types[0].value, types[1].value, 1);
        para2.innerText = `${result} ${codes[types[1].value]}`;
        amounts[1].value = (result * amounts[0].value).toFixed(3);
        about.innerText = types[0].value + "/" + types[1].value;
    });
});

amounts.forEach((amount, index) => {
    amount.addEventListener("input", async () => {
        if (amount.value < 0 || amount.value == '') {
            amounts[index === 0 ? 1 : 0].value = '';
        } else {
            let result = index === 0 ? await callAPI(types[0].value, types[1].value, amounts[0].value) : await callAPI(types[1].value, types[0].value, amounts[1].value);
            amounts[index === 0 ? 1 : 0].value = result;
        }
    });
});

let updateDateTime = async () => {
    let currentDate = new Date(timestamp * 1000);
    let options = {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "UTC"
    };
    let formattedDateTime = currentDate.toLocaleString('en-US', options);
    para3.innerText = formattedDateTime + " UTC · ";
};
setInterval(updateDateTime, 60000);
