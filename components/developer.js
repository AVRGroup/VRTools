class Developer extends HTMLElement {
    constructor(props) {
        super();
        this.connectedCallback = this.connectedCallback.bind(this);
    }

    connectedCallback() {
        const prevPath = window.location.origin === "https://avrgroup.github.io" ? '/vrtools/' : '/';

        const devs = {
            andre: {
                name: 'André Luiz',
                pic: `${prevPath}img/vrtools_andre.jpg`
            },
            lucas: {
                name: 'Lucas da Costa',
                pic: `${prevPath}img/vrtools_lucas.jpg`
            },
            paulo: {
                name: 'Paulo Rozatto',
                pic: `${prevPath}img/vrtools_paulo.jpg`
            }
        }

        let name = this.attributes['dev']

        if (typeof name === 'undefined') {
            console.warn('No dev attribute set for vrtools-dev');
            return;
        }

        let dev = devs[name.nodeValue.toLowerCase()]

        if (typeof dev === 'undefined') {
            console.warn('There isn\'t a dev called ' + name.nodeValue);
            return;
        }

        let isMain = this.attributes['main'] ? true : false;

        if (isMain) {
            TRANSLATION.add(
                '.main-dev',
                'main dev',
                'dev principal'
            )
        }
        else {
            TRANSLATION.add(
                '.aux-dev',
                'auxiliar dev',
                'dev auxiliar'
            )
        }

        this.innerHTML = `
        <div class="w3-card" style="text-align:center;">
            <a href="javascript: TRANSLATION.redirect('', '#about')" style="text-decoration: none;">
                <img src="${dev.pic}" alt="" style="width:100%; border-radius: 0%;">

                <div class="w3-container">
                <div style="text-align: center; font-size: 1.2em; border-bottom: 1px solid grey;">${dev.name}</div>
                <div style="text-align: center; font-size: 1em;">
                    ${isMain ? '<b class="main-dev">main dev</b>' : '<span class="aux-dev">auxiliar dev<span>'}
                </div>
                </div>
            </a>
        </div>
        `
    }
}

customElements.define('vrtools-dev', Developer);