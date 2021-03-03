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
        this.currentLang = 'en-US';
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

    changeSelectedLanguage(lang) {
        const flag = document.querySelector('#navFlag');

        if (lang !== this.currentLang) {
            const pt = document.querySelectorAll('.pt-option');
            const us = document.querySelectorAll('.us-option');

            if (lang === 'pt-BR') {
                TRANSLATION.translateDocument(TRANSLATION.PT_BR)
            }
            else if (lang === 'en-US') {
                TRANSLATION.translateDocument(TRANSLATION.EN_US);
            }

            pt.forEach(e => { e.classList.toggle('selected'); });
            us.forEach(e => { e.classList.toggle('selected'); });

            this.currentLang = lang;

            if (window.history.pushState) {
                const newURL = window.location.origin + window.location.pathname + '?lang=' + this.currentLang + window.location.hash;
                window.history.pushState({ path: newURL }, '', newURL)
            }

        }

        flag.classList.remove('active');
        document.querySelector('#lang-options').classList.remove('w3-show');
    }

    redirect(path, hash) {
        const prevPath = window.location.origin === "https://avrgroup.github.io" ? '/vrtools/' : '/';

        if (!hash) {
            hash = '';
        }
        const newURL = window.location.origin + prevPath + path + '?lang=' + this.currentLang + hash;
        window.location.href = newURL;
    }
}

const TRANSLATION = new Translation();

