document.addEventListener("i18n-en-us-action", function (ev) {
    const pathname = window.location.pathname;
    const filename = pathname.replace(/^.*\//, "");
    let href = window.location.href;
    href = href.replace(/\/\w{2}-\w{2}\//, "/");
    href = href.substring(0, href.length - filename.length) + "en-us/" + filename;
    window.location.href = href;
});

document.addEventListener("i18n-pt-br-action", function (ev) {
    const pathname = window.location.pathname;
    const filename = pathname.replace(/^.*\//, "");
    let href = window.location.href;
    href = href.replace(/\/\w{2}-\w{2}\//, "/");
    href = href.substring(0, href.length - filename.length) + "pt-br/" + filename;
    window.location.href = href;
});



document.addEventListener("DOMContentLoaded", function (ev) {
    const lang = document.body.parentElement.getAttribute("lang");
    const radioButton = document.querySelector(`.menu-item[data-action="i18n-${lang.toLowerCase()}"]>input[type="radio"]`);
    radioButton.checked = true;
});