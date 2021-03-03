class Translation {
    constructor() {
        this.ptBR = [
            { element: '.menu-vrapps', content: 'Apps em RV' },
            { element: '.menu-projects', content: 'Projetos' },
            { element: '.menu-about', content: 'Sobre' },
            { element: '.menu-contact', content: 'Contato' },
        ];

        this.enUS = [
            { element: '.menu-vrapps', content: 'VR Apps' },
            { element: '.menu-projects', content: 'Projects' },
            { element: '.menu-about', content: 'About' },
            { element: '.menu-contact', content: 'Contact' },
        ];

        this.PT_BR = 0;
        this.EN_US = 1;
        this.currentLang = 'enus';
    }


    add(element, enUS, ptBR) {
        if (!element) {
            console.error('No html element was passed!');
            return;
        }
        if (!enUS) {
            console.warn('No english translation was set for ' + element);
        }
        if (!ptBR) {
            console.warn('No portuguese translation was set for ' + element);
        }

        this.enUS.push({ element, content: enUS });
        this.ptBR.push({ element, content: ptBR });
    }

    translateDocument(language) {
        let textArray;
        if (language === this.PT_BR) {
            textArray = this.ptBR;
        }
        else if (language === this.EN_US) {
            textArray = this.enUS;
        }
        else {
            console.error('Invalid Language!')
            return;
        }

        let elements;
        for (const txt of textArray) {
            if (txt.element) {
                elements = document.querySelectorAll(txt.element);

                if (elements) {
                    for (let e of elements) {
                        e.innerHTML = txt.content;
                    }
                }
            }
        }
    }

    toggleNavFlag() {
        document.querySelector('#navFlag').classList.toggle('active');
        document.querySelector('#lang-options').classList.toggle('w3-show');
    }

    changeSelectedLanguage(lang) {
        const flag = document.querySelector('#navFlag');

        if (lang !== this.currentLang) {
            const pt = document.querySelectorAll('.pt-option');
            const us = document.querySelectorAll('.us-option');

            if (lang === 'ptbr') {
                flag.innerHTML = '&#x1F1E7;&#x1F1F7;';
                TRANSLATION.translateDocument(TRANSLATION.PT_BR)
            }
            else if (lang === 'enus') {
                flag.innerHTML = '&#127482;&#127480;';
                TRANSLATION.translateDocument(TRANSLATION.EN_US);
            }

            pt.forEach(e => { e.classList.toggle('selected'); });
            us.forEach(e => { e.classList.toggle('selected'); });

            this.currentLang = lang;
        }

        flag.classList.remove('active');
        document.querySelector('#lang-options').classList.remove('w3-show');
    }
}

const TRANSLATION = new Translation();

window.onload = function () {
    const url = new URLSearchParams(window.location.search);
    const lang = url.get('lang');

    if (lang && lang === 'pt-BR') {
        TRANSLATION.changeSelectedLanguage('ptbr')
        TRANSLATION.translateDocument(TRANSLATION.PT_BR);
    }
    // else {
    //     TRANSLATION.translateDocument(TRANSLATION.EN_US);
    // }
}