
const searchInputs = document.querySelectorAll(".input-container .search-input");

function whenFocusInput(input, label, ul) {
    input.onfocus = function () {

        // Show flash message
        getMessages("sales", "getMessagesAjax", "sales.messages").then((result) => {
            if (input.name === "Name") {
                flashMessage("info", result.message_hint_search_client, 5000);
            } else if(input.name === "Email") {
                flashMessage("info", result.message_hint_search_client_email, 5000);
            }
        });

        // flay label
        label.classList.add("up");

        // Active list
        ul.classList.add("active");
    }
}
function whenBlurInput(input, label, ul, lis) {
    input.onblur = () => {

        // control label input
        if (input.value === '') {
            label.classList.remove("up");
        } else if (input.value == null) {
            label.classList.add("up");
        }

        // Control label
        if (input.value === '') {
            ul.classList.add("active");
            label.classList.add("up");
        }

        document.addEventListener("click", (e) => {
            const element = e.target;

            if (element === input) {
                ul.classList.remove("active");
                ul.classList.add("active");
            } else {
                lis.forEach(li => {
                    if (element === li) {
                        ul.classList.remove("active")
                    } else {
                        ul.classList.remove("active");
                    }
                });
            }


        });
    };
}

function whenWriteInInput(input, fetchButton, lis) {

    // control button
    input.addEventListener("keyup", (e) => {

        if (input.getAttribute("primaryKey") != null) input.removeAttribute("primaryKey");

        if (input.value === '') {
            fetchButton.classList.remove("active");
        } else {
            fetchButton.classList.add("active");
        }

    });
}
function whenClickDownUp(input, ul, lis) {

    let count = -1;
    document.addEventListener("keydown", (e) => {
        if (ul.classList.contains("active")) {
            if (e.key === "ArrowDown") {
                if (count < ul.children.length - 1) {
                    count++;
                    console.log(count)
                    count-1 >= 0 ? lis[count-1].classList.remove("hover") : null;
                    lis[count].classList.add("hover");
                }
            } else if (e.key === "ArrowUp") {
                if (count > 0) {
                    count--;
                    count+1 <= ul.children.length - 1 ? lis[count+1].classList.remove("hover") : null;

                    lis[count].classList.add("hover");
                }
            } else if (e.key === "Enter") {
                lis.forEach(li => {
                   if (li.classList.contains("hover")) {
                       li.classList.remove("hover");
                       li.click();
                   }
                });
            }
        }
    });
}
function ifExist(input, lis) {
    let value = input.value.trim();

    lis.forEach(li => {
       if (li.textContent.trim() === value) {
           input.removeAttribute("primaryKey");
           input.setAttribute("primaryKey", li.getAttribute("primaryKey"));
           return true;
       }
    });

    // return false;

}
function whenClickInButtonSearch(input, fetchButton, lis, label) {
    fetchButton.addEventListener("click", () => {
        ifExist(input, lis);

        getInfo(
            "sales",
            "getInfoClientAjax",
            input.getAttribute("primaryKey"),
            input.name
        );
        input.value = '';
        label.classList.remove("up");
        fetchButton.classList.remove("active");


    });
}
function whenClickLis(lis, input, ul, fetchButton) {
    lis.forEach(li => {
        li.addEventListener("click", () => {
            input.value = li.textContent;
            ul.classList.remove("active");
            fetchButton.classList.add("active");
            input.setAttribute("primaryKey", li.getAttribute("primaryKey"));
        });
    });
}
searchInputs.forEach(searchInput => {
    let ul = searchInput.closest(".input-container").querySelector("ul");
    let lis = searchInput.closest(".input-container").querySelectorAll("li");
    let fetchButton = searchInput.parentElement.querySelector(".fetch-btn");
    let label = searchInput.parentElement.querySelector(".label-input");

    // When focus search input
    whenFocusInput(searchInput, label, ul);

    // When Blur input
    whenBlurInput(searchInput, label, ul, lis);

    // When Write in input
    whenWriteInInput(searchInput, fetchButton, lis)

    // When click li
    whenClickLis(lis, searchInput, ul, fetchButton);

    // Control button search
    whenClickInButtonSearch(searchInput, fetchButton, lis, label);

    // When Click up down
    whenClickDownUp(searchInput, ul, lis);
});

function getInfo(controller, action, primaryKey, name) {
    let xml = new XMLHttpRequest();

    xml.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            console.log(xml.responseText)
            let response = JSON.parse(xml.responseText);

            if (response.result === "false" || response.result === false) {
                flashMessage("danger", response.message, 5000);
            } else {
                flashMessage("success", response.message, 5000);

                const theyFillInputs = document.querySelectorAll(".they-fill");
                theyFillInputs.forEach(fillInput => {

                   fillInput.value =  response[fillInput.name];
                   fillInput.parentElement.querySelector("label").classList.add("up");
                });
            }
        }
    }


    xml.open("POST", "http://estore.local/"+ controller +"/" + action);
    xml.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
    );
    xml.send(`primaryKey=${primaryKey}&name=${name}`);
}