const mainHeader = document.querySelector('.main-header');
const specificPageContainer = document.querySelector('.specific-items');
const mainPageContainer = document.querySelector('.specialities-container');
const clearBtn = document.querySelector('.clear-order');

if (clearBtn) {
    clearBtn.addEventListener('click', clearOrder);
}



(async function () {
    if (mainHeader) {
        let response = await fetch('./dist/json/items.json');
        let jsonFile = await response.json();
        //MAIN PAGE
        if (mainHeader.textContent.toLowerCase() === 'italian specialities') {
            for (item of jsonFile) {
                if (item.id === '1111' || item.id === '1112' || item.id === '1113' || item.id === '1114') {
                    let itemWrapper = document.createElement('div');
                    let imageWrapper = document.createElement('div');
                    let infoWrapper = document.createElement('div');
                    let itemName = document.createElement('h4');
                    let itemInfo = document.createElement('p');
                    let itemPrice = document.createElement('h6');
                    let itemImage = document.createElement('img');

                    imageWrapper.appendChild(itemImage);
                    infoWrapper.appendChild(itemName);
                    infoWrapper.appendChild(itemInfo);
                    infoWrapper.appendChild(itemPrice);
                    itemWrapper.appendChild(infoWrapper);
                    itemWrapper.appendChild(imageWrapper);

                    itemName.textContent = item.name;
                    itemInfo.textContent = item.aboutMini;
                    itemPrice.textContent = item.price;
                    itemImage.src = './dist/image/' + item.imagePath;
                    itemImage.alt = item.name;
                    createOrderButton(item.id, infoWrapper);

                    mainPageContainer.appendChild(itemWrapper);
                }
            }
        }
        // SPECIFICS
        if (mainHeader.textContent.toLowerCase() === 'main dishes' || mainHeader.textContent.toLowerCase() === 'salad' || mainHeader.textContent.toLowerCase() === 'drinks') {
            let nthChild = 1;
            let type;
            if (mainHeader.textContent.includes(' ')) {
                type = mainHeader.textContent.slice(0, mainHeader.textContent.indexOf(' '));
            } else {
                type = mainHeader.textContent;
            }
            for (item of jsonFile) {
                if (item.type === type.toLowerCase()) {
                    ++nthChild;
                    let itemWrapper = document.createElement('div');
                    let imageWrapper = document.createElement('div');
                    let infoWrapper = document.createElement('div');
                    let itemName = document.createElement('h4');
                    let itemInfo = document.createElement('p');
                    let itemPrice = document.createElement('h6');
                    let itemImage = document.createElement('img');

                    imageWrapper.appendChild(itemImage);
                    infoWrapper.appendChild(itemName);
                    infoWrapper.appendChild(itemInfo);
                    infoWrapper.appendChild(itemPrice);
                    if (nthChild % 2 === 0) {
                        itemWrapper.appendChild(infoWrapper);
                        itemWrapper.appendChild(imageWrapper);
                    } else {
                        itemWrapper.appendChild(imageWrapper);
                        itemWrapper.appendChild(infoWrapper);
                    }


                    itemName.textContent = item.name;
                    itemInfo.textContent = item.about;
                    itemPrice.textContent = item.price;
                    itemImage.src = './dist/image/' + item.imagePath;
                    itemImage.alt = item.name;
                    createOrderButton(item.id, infoWrapper);

                    specificPageContainer.appendChild(itemWrapper);
                }
            }
            nthChild = 1;
        }
        // ORDER
        if (mainHeader.textContent.toLowerCase() === 'your order') {
            if (localStorage.order) {
                let order = orderToObject(localStorage.order);
                for (let pos in order) {
                    for (item of jsonFile) {
                        if (item.id === pos) {
                            let imageWrapper = document.createElement('div');
                            let itemWrapper = document.createElement('div');
                            let itemName = document.createElement('h4');
                            let itemInfo = document.createElement('p');
                            let itemPrice = document.createElement('h6');
                            let itemImage = document.createElement('img');

                            imageWrapper.appendChild(itemImage);
                            itemWrapper.appendChild(imageWrapper);
                            itemWrapper.appendChild(itemName);
                            itemWrapper.appendChild(itemInfo);
                            itemWrapper.appendChild(itemPrice);

                            itemPrice.classList.add('item-price');

                            itemName.textContent = item.name;
                            itemInfo.textContent = item.aboutMini;

                            if (order[pos] > 1) {
                                itemPrice.textContent = `${(item.price * order[pos]).toFixed(2)}$ in total. ${item.price}$ for each.`;
                            } else {
                                itemPrice.textContent = `${item.price}$ in total.`;
                            }

                            itemImage.src = './dist/image/' + item.imagePath;
                            itemImage.alt = item.name;
                            createOrderButton(item.id, itemWrapper, order[pos], itemPrice, item.price);

                            specificPageContainer.appendChild(itemWrapper);
                        }
                    }
                }
                let orderTotal = document.createElement('h2');
                orderTotal.classList.add('order-total');
                specificPageContainer.appendChild(orderTotal);
                getOrderTotal();
                createFormElements(specificPageContainer);



            } else {
                clearBtn.style.display = 'none';
                let emptyOrder = document.createElement('p');
                emptyOrder.textContent = 'Your order is empty';
                specificPageContainer.appendChild(emptyOrder);
            }
        }
    }
})();

let total = 0;

function createFormElements(appendTo) {
    let form = document.createElement('form');
    let nameLabel = document.createElement('label');
    let nameInput = document.createElement('input');
    let phoneLabel = document.createElement('label');
    let phoneInput = document.createElement('input');
    let emailLabel = document.createElement('label');
    let emailInput = document.createElement('input');
    let submitBtn = document.createElement('button');

    // form.setAttribute('novalidate', '');
    form.action = '#';
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let newOrder = {};
        newOrder.ids = orderToObject(localStorage.order);
        newOrder.name = nameInput.value;
        newOrder.phone = phoneInput.value;
        if (emailInput.textContent !== '') {
            newOrder.email = emailInput.value;
        }
        newOrder.timestamp = new Date().toLocaleString();
        newOrder.total = total + '$';
    });
    nameLabel.setAttribute('for', 'name');
    nameLabel.textContent = 'Your name (2-15 symbols)';
    nameInput.type = 'text';
    nameInput.id = 'name';
    nameInput.name = 'name';
    nameInput.setAttribute('required', '');
    nameInput.minLength = 2;
    nameInput.maxLength = 15;
    nameInput.placeholder = 'Your name 2-15 chars.';

    phoneLabel.setAttribute('for', 'phone');
    phoneLabel.textContent = 'Your phone number';
    phoneInput.type = 'tel';
    phoneInput.id = 'phone';
    phoneInput.name = 'phone';
    phoneInput.setAttribute('required', '');
    phoneInput.placeholder = "+7 (___) ___-____";
    phoneInput.pattern = "\\+7\\s\\([0-9]{3}\\)\\s[0-9]{3}-[0-9]{4}";
    phoneInput.dataset.slots = "_";
    //Not my piece of code////////////////////////////////////////////////////////////////////////////////////////////////////////
    const pattern = phoneInput.getAttribute("placeholder"),
        slots = new Set(phoneInput.dataset.slots || "_"),
        prev = (j => Array.from(pattern, (c, i) => slots.has(c) ? j = i + 1 : j))(0),
        first = [...pattern].findIndex(c => slots.has(c)),
        accept = new RegExp(phoneInput.dataset.accept || "\\d", "g"),
        clean = input => {
            input = input.match(accept) || [];
            return Array.from(pattern, c =>
                input[0] === c || slots.has(c) ? input.shift() || c : c
            );
        },
        format = () => {
            const [i, j] = [phoneInput.selectionStart, phoneInput.selectionEnd].map(i => {
                i = clean(phoneInput.value.slice(0, i)).findIndex(c => slots.has(c));
                return i < 0 ? prev[prev.length - 1] : back ? prev[i - 1] || first : i;
            });
            phoneInput.value = clean(phoneInput.value).join ``;
            phoneInput.setSelectionRange(i, j);
            back = false;
        };
    let back = false;
    phoneInput.addEventListener("keydown", (e) => back = e.key === "Backspace");
    phoneInput.addEventListener("input", format);
    phoneInput.addEventListener("focus", format);
    phoneInput.addEventListener("blur", () => phoneInput.value === pattern && (phoneInput.value = ""));
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    emailLabel.setAttribute('for', 'email');
    emailLabel.textContent = 'Your email (Optional)';
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.size = 30;

    // submitBtn.type = 'submit';
    submitBtn.textContent = 'Make order';
    submitBtn.type = 'submit';
    submitBtn.value = 'submit';


    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(phoneLabel);
    form.appendChild(phoneInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(submitBtn);
    appendTo.appendChild(form);
}

function getOrderTotal() {
    total = 0;
    let orderTotal = document.querySelector('.order-total');
    let prices = document.querySelectorAll('.item-price');
    prices.forEach(price => {
        total += parseFloat(price.textContent.slice(0, price.textContent.indexOf('$')));
    });
    orderTotal.textContent = `Total order is ${total.toFixed(2)}$`;
}

function createOrderButton(itemId, appendTo, orderedValue, priceField, price) {
    let inputWrapper = document.createElement('div');
    let minusBtn = document.createElement('span');
    let input = document.createElement('input');
    let plusBtn = document.createElement('span');


    minusBtn.textContent = '-';
    minusBtn.addEventListener('click', () => {
        if (minusBtn.nextElementSibling.value != '1') {
            minusBtn.nextElementSibling.value = parseInt(minusBtn.nextElementSibling.value) - 1;
            if (orderedValue) {
                let newOrder = orderToObject(localStorage.order);
                newOrder[itemId] -= 1;
                if (newOrder[itemId] > 1) {
                    priceField.textContent = `${(price * newOrder[itemId]).toFixed(2)}$ in total. ${price}$ for each.`;
                } else {
                    priceField.textContent = `${price}$ in total.`;
                }
                getOrderTotal();

                localStorage.order = orderToString(newOrder);
            }
        }
    })
    plusBtn.textContent = '+';
    plusBtn.addEventListener('click', () => {
        plusBtn.previousElementSibling.value = parseInt(plusBtn.previousElementSibling.value) + 1;
        if (orderedValue) {
            let newOrder = orderToObject(localStorage.order);
            newOrder[itemId] += 1;
            if (newOrder[itemId] > 1) {
                priceField.textContent = `${(price * newOrder[itemId]).toFixed(2)}$ in total. ${price}$ for each.`;
            } else {
                priceField.textContent = `${price}$ in total.`;
            }
            getOrderTotal();

            localStorage.order = orderToString(newOrder);
        }
    })
    input.type = 'number';
    if (orderedValue) {
        input.value = orderedValue;
    } else {
        input.value = 1;
    }
    input.min = 1;
    input.setAttribute('readonly', '');
    inputWrapper.appendChild(minusBtn);
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(plusBtn);

    appendTo.appendChild(inputWrapper);
    if (orderedValue) {
        let deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            let newOrder = orderToObject(localStorage.order);
            delete newOrder[itemId];
            localStorage.order = orderToString(newOrder);
            deleteButton.parentElement.remove();
            getOrderTotal();
        })
        appendTo.appendChild(deleteButton);
    } else {
        let button = document.createElement('button');
        button.textContent = "Order";
        button.value = itemId;
        appendTo.appendChild(button);
        button.addEventListener('click', () => {
            let inputValue = parseInt(button.previousSibling.children[1].value);
            if (localStorage.order) {
                if (inputValue > 1) {
                    localStorage.order += ',' + button.value + 'x' + inputValue;
                } else {
                    localStorage.order += ',' + button.value;
                }

            } else {
                if (inputValue > 1) {
                    localStorage.setItem('order', `${button.value}x${inputValue}`);
                } else {
                    localStorage.setItem('order', `${button.value}`);
                }
            }
        });
    }
};







function orderToString(fullOrder) {
    let newOrder = '';
    let arrayObj = Object.entries(fullOrder); //Object to array of arrays
    arrayObj.forEach(element => {
        if (arrayObj.indexOf(element) === arrayObj.length - 1) { //If index of item is last
            newOrder += element[0] + 'x' + element[1];
        } else {
            newOrder += element[0] + 'x' + element[1] + ',';
        }
    });
    return newOrder; //RETURN NEW STRING LIKE WAS TAKEN FROM LOCALSTORAGE BUT PROCESSED
}

function orderToObject(orderStr) {
    let arrayElements = orderStr.split(',')
    arrayElements.sort();

    let current = null;
    let cnt = 0;
    let fullOrder = {}; //NEW OBJECT
    for (let i = 0; i < arrayElements.length; i++) {
        if (!arrayElements[i].includes(current)) {
            if (!arrayElements[i].includes('x')) {
                if (cnt > 0) {
                    fullOrder[current] = cnt;
                }
                current = arrayElements[i];
                cnt = 1;
            } else {
                if (cnt > 0) {
                    fullOrder[current] = cnt;
                }
                current = arrayElements[i].slice(0, 4);
                cnt = parseInt(arrayElements[i].slice(arrayElements[i].indexOf('x') + 1));
            }
        } else {
            if (arrayElements[i].includes('x')) {
                cnt += parseInt(arrayElements[i].slice(arrayElements[i].indexOf('x') + 1));
            } else {
                cnt++;
            }
        }
    }
    if (cnt > 0) {
        fullOrder[current] = cnt;
    }
    return fullOrder; //RETURN OBJECT WITH KEY/VALUE ID/COUNT FROM TAKEN STRING
}

function clearOrder() {
    while (specificPageContainer.firstChild) {
        specificPageContainer.firstChild.remove();
        localStorage.clear();
    }
    total = 0;
    clearBtn.style.display = 'none';
    let emptyOrder = document.createElement('p');
    emptyOrder.textContent = 'Your order is empty';
    specificPageContainer.appendChild(emptyOrder);
}

