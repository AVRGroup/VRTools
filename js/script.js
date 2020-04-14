let slideIndex = 1;

window.addEventListener('resize', () => {
    showDivs(slideIndex)
})

showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n)
}

function showDivs(n) {
    const slide = document.getElementsByClassName("slide");
    const display = window.innerWidth <= 768 ? 'none' : "inline-block"

    if (n > slide.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slide.length
    }
    for (let i = 0; i < slide.length; i++) {
        slide[i].style.display = display;
    }
    slide[slideIndex - 1].style.display = "inline-block";
}