const elem = document.getElementById("phone");
const answerCard = document.getElementById("answer");
const ntc1 = /^([9][8])\)?[456]$/;
const ntc2 = /^([9][7])\)?[45]$/;
const ncell = /^([9][8])\)?[012]$/;
const smart = /^([9][68])\)?[128]$/;
const ntc3 = /^(972)\)?$/;
const ntc4 = /^(963)\)?$/;

elem.addEventListener("keyup", (e) => {
  onChange(e);
});

const onChange = (e) => {
  const value = e.target.value;

  if (value.length === 10) {
    elem.classList.remove("invalid");
    check(value);
  } else if (value.length === 0) {
    elem.classList.remove("invalid");
    if (!answerCard.classList.contains("hide")) {
      answerCard.classList.add("hide");
    }
  } else if (!elem.classList.contains("invalid")) {
    elem.classList.add("invalid");
    if (!answerCard.classList.contains("hide")) {
      answerCard.classList.add("hide");
    }
  }
};

const check = (oldvalue) => {
  let value = oldvalue.slice(0, 3);
  if (
    value.match(ntc1) ||
    value.match(ntc2) ||
    value.match(ntc3) ||
    value.match(ntc4)
  ) {
    answerVisibility("./images/ntc.png", "NTC");
  } else if (value.match(ncell)) {
    answerVisibility("./images/ncell.png", "NCELL");
  } else if (value.match(smart)) {
    answerVisibility("./images/smart.png", "SMART");
  } else {
    answerCard.classList.remove("hide");
    answerVisibility(
      "./images/not-found.png",
      "No Carrier had this number yet."
    );
  }
};

const answerVisibility = (src, text) => {
  if (answerCard.classList.contains("hide")) {
    answerCard.classList.remove("hide");
  }
  answerCard.querySelector("img").src = src;
  answerCard.querySelector("h2").innerText = text;
};
