const { ipcRenderer } = require("electron");
const items = require("./items");

// DOM Nodes
let showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal"),
  addItem = document.getElementById("add-item"),
  itemUrl = document.getElementById("url"),
  itemTitle = document.getElementById("title"),
  search = document.getElementById("search");

// search filter
search.addEventListener("keyup", (e) => {
  // loop items
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

const toggleModalButtons = () => {
  // check state of buttons
  if (addItem.disabled) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

// show modal
showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemTitle.focus();
});

// close modal
closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

// handle new item
addItem.addEventListener("click", (e) => {
  const prefix = itemUrl.value.split(":")[0];
  const isUrl = prefix === "https" || prefix === "http" ? true : false;

  if (
    itemTitle.value === "" ||
    itemTitle.value === null ||
    itemTitle.value === undefined
  ) {
    alert("제목을 입력하세요");
    itemTitle.focus();
    return;
  }

  if (!isUrl) {
    alert("옳바르지 않은 URL 입니다");
    itemUrl.focus();
    return;
  }

  if (itemUrl.value) {
    // send new item url to main process
    ipcRenderer.send("new-item", {
      title: itemTitle.value,
      url: itemUrl.value,
    });
    toggleModalButtons();
  }
});

// listen for new item from main process
ipcRenderer.on("new-item-success", (e, newItem) => {
  // add new item to "items" node
  items.addItem(newItem, true);

  toggleModalButtons();

  //hide modal and clear value
  modal.style.display = "none";
  itemUrl.value = "";
});

// listen for keyboard submit
itemUrl.addEventListener("keyup", (e) => {
  e.key === "Enter" && addItem.click();
});
