let slideIndex = 1;
const modal = [];
const slidesGroup = [];
const slidesModal = [];

window.addEventListener('resize', () => {
    showDivs(slideIndex);
});

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    for(let i = 0; i < slidesGroup.length; i++){
        let slideEl = slidesGroup[i];
        console.log(slideEl);
        let display = window.innerWidth < 1024 ? 'none' : "inline-block";

        if (n > slideEl.length) {
            slidesGroup[i].slideIndex = 1;
        }
        if (n < 1) {
            slidesGroup[i].slideIndex = slideEl.length;
        }
        for (let j = 0; j < slideEl.length; j++) {
            slideEl[j].style.display = display;
        }
        slideEl[slidesGroup[i].slideIndex - 1].style.display = "inline-block";
    }
}

function buildModalArray(modalEl, slidesNumber, slidesModalAux){
    for(let i = 0; i < modalEl.length; i++){
        modal.push(document.getElementById(modalEl[i]));
        console.log(document.getElementById(modalEl[i]));
    }
    for(let i = 0; i < slidesNumber.length; i++){
        let slide = document.getElementsByClassName(slidesNumber[i]);
        slide.slideIndex = 1;
        slidesGroup.push(slide);
    }
    for(let i = 0; i < slidesModalAux.length; i++){
        let slideModal = document.getElementsByClassName(slidesModalAux[i]);
        slidesModal.push(slideModal);
    }
    //document.getElementsByClassName("slide-modal");
    showDivs(slideIndex);
}

function openModal(n, idModal) {
    modal[idModal].style.display = "block";
    showModal(slidesGroup[idModal].slideIndex = n, idModal);
}

function closeModal(idModal) {
    modal[idModal].style.display = "none";
}

function plusModal(n, idModal) {
    showModal(slidesGroup[idModal].slideIndex += n, idModal);
}

function showModal(n, idModal) {
    let slide = slidesModal[idModal];

    if (n > slide.length) {
        //slideIndex = 1;
        slidesGroup[idModal].slideIndex = 1;
    }
    if (n < 1) {
        slidesGroup[idModal].slideIndex = slide.length;
    }
    for (let i = 0; i < slide.length; i++) {
        slide[i].style.display = "none";
    }
    slide[slidesGroup[idModal].slideIndex - 1].style.display = "block";
}