let items = document.getElementById("items");

// track items in storage
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

// persist storage
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

// set item as selected
exports.select = (e) => {
  console.log(e);
  // remove currently selected item class
  document
    .getElementsByClassName("read-item selected")[0]
    .classList.remove("selected");

  // add to clicked item
  e.currentTarget.classList.add("selected");
};

exports.addItem = (item, isNew = false) => {
  let itemNode = document.createElement("div");

  itemNode.setAttribute("class", "read-item");

  itemNode.innerHTML = `
    <img src="${item.screenshot}" />
      <h3>${item.title}</h3>
      <h4>${item.content}</h4>
  `;

  items.appendChild(itemNode);

  // attach click handler to select
  itemNode.addEventListener("click", this.select);

  // if this is the first item, select it
  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

// get items
this.storage.forEach((item) => {
  this.addItem(item, false);
});
