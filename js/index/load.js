import highligh from "../prism.js"
import History from "../history.js"
import handelMenu from "./header.js"

let loader = document.querySelector("#loader div")
let main = document.getElementById("main")


export default function load(src = "Home", scrollAmount = 0) {
    let fetchLink = `./pages/${src}.html`


    resetLoadTransition()
    activeSideBarElements(src)

    fetch(fetchLink)
        .then((text) => text.text())
        .then((html) => {
            main.innerHTML = html
            clickOpenPage()
            setHistoryBack()
            loadCodes(scrollAmount)
        })

    History.store(src);

    changeWindowLocation(src);

}
function changeWindowLocation(src) {
    let url = window.location;
    let newUrl = new URL(url)

    newUrl.search = `?file=${src}`;
    newUrl.hash = src

    let title = src.substring(src.indexOf("/") + 1)
    document.title = title

    window.history.pushState("object or string", src, newUrl);
}

// window.url = ()=>{
//     alert("Hash Change")
//     load(new URL(window.location).searchParams("file"))
// }



handelMenu()
function activeSideBarElements(src) {
    let lastPage = localStorage.lastPage
    let lastActiveElement = document.querySelector(`[data-open="${lastPage}"]`)
    let activeElement = document.querySelector(`[data-open="${src}"]`)



    if (lastActiveElement)
        lastActiveElement.classList.remove("activeOption")
    if (activeElement)
        activeElement.classList.add("activeOption")
}


function setHistoryBack() {
    let elements = document.querySelectorAll(".hist")
    elements.forEach((elem) => {
        elem.addEventListener("click", () => {
            let backData = History.back()

            load(backData[0], backData[1])
            console.log(backData[0], backData[1])
            

        })
    })
}

function loaderTransition() {
    loader.style.transitionDuration = "300ms"
    loader.style.width = "100%"
    setTimeout(() => {
        loader.style.transitionDuration = "0s"
        loader.style.width = "0"
    }, 400);
}

function resetLoadTransition() {
    loader.style.transitionDuration = "2s"
    loader.style.width = "80%"
}


function clickOpenPage() {
    let dataPage = main.querySelectorAll("[data-page]")
    dataPage.forEach((elem) => {
        elem.addEventListener("click", function () {
            load(elem.getAttribute('data-page'))
        }, { once: true })
    })
}


function loadCodes(scrollAmount) {
    let loadPromises = [];

    let codesElements = document.querySelectorAll("[data-code]")
    codesElements.forEach((codeElem) => {
        if (codeElem.classList.contains("language-css")) {
            fetchData(codeElem, `./learning/css/${codeElem.getAttribute("data-code")}`)
        }

        if (codeElem.classList.contains("language-js")) {
            fetchData(codeElem, `./learning/js/${codeElem.getAttribute("data-code")}`)
        }

    })

    function fetchData(elem, src) {
        let promise = fetch(src)
            .then(text => text.text())
            .then((text) => {
                elem.innerHTML = text
                return text
            })
        loadPromises.push(promise)
    }

    Promise.allSettled(loadPromises).then(() => {
        highligh()
        loaderTransition()

        //------------------------------------------------------------------------------------------------------------------
        // console.log(scrollAmount);
        // window.scrollBy(0,scrollAmount)

    })
}