const DARK_BG_SECTION_CLASS = 'color-dark';

class Logo {
    constructor() {
        this.logoDarkClipDOM = document.querySelector('#logo-dark-mask rect');
        this.logoLightClipDOM = document.querySelector('#logo-light-mask rect');
        const logoBoundingBox = document.querySelector('.logo').getBoundingClientRect();
        this.logoBox = {
            start: logoBoundingBox.top,
            end: logoBoundingBox.top + logoBoundingBox.height
        }
    }

    resizeClipRect(sectionIsDark, sectionIntersectingLogoAtDistance) {
        if (sectionIsDark) {
            this.logoLightClipDOM.setAttribute('y', sectionIntersectingLogoAtDistance);
            this.logoLightClipDOM.setAttribute('height', this.logoBox.end - sectionIntersectingLogoAtDistance);

            this.logoDarkClipDOM.setAttribute('y', 0);
            this.logoDarkClipDOM.setAttribute('height', sectionIntersectingLogoAtDistance);
        } else {
            this.logoDarkClipDOM.setAttribute('y', sectionIntersectingLogoAtDistance);
            this.logoDarkClipDOM.setAttribute('height', this.logoBox.end - sectionIntersectingLogoAtDistance);

            this.logoLightClipDOM.setAttribute('y', 0);
            this.logoLightClipDOM.setAttribute('height', sectionIntersectingLogoAtDistance);
        }
    }
}

function captureSectionsData() {
    const sectionsDOM = document.querySelectorAll('section');
    const windowScrollY = window.scrollY;
    const sectionsData = Array.prototype.map.call(sectionsDOM, (sectionDOM) => {
                                const isDark = sectionDOM.classList.contains(DARK_BG_SECTION_CLASS);
                                const sectionBoxProperty = sectionDOM.getBoundingClientRect();
                                const top = sectionBoxProperty.top + windowScrollY;
                                const height = sectionBoxProperty.height;

                                return {
                                    isDark,
                                    start: top,
                                    end: top + height,
                                    sectionDOM
                                };
                            });
    return sectionsData;
}

function paintSectionLogoIntersection(logo, sectionsData) {
    const windowScrollY = window.scrollY;
    const logoBox = logo.logoBox;
    for (let section of sectionsData ) {
        const sectionViewPortStart = section.start - windowScrollY;
        const sectionViewPortEnd = section.end - windowScrollY;
        if ( sectionViewPortStart > logoBox.start && sectionViewPortStart <= logoBox.end) {
            const sectionIntersectingLogoAtDistance = sectionViewPortStart - logoBox.start;
            logo.resizeClipRect(section.isDark, sectionIntersectingLogoAtDistance);
            return false;
        } else if (logoBox.start > sectionViewPortStart && logoBox.end < sectionViewPortEnd) {
            logo.resizeClipRect(section.isDark, 0);
            return false;
        }
    };
}

const logo = new Logo();
const sectionsData = captureSectionsData();

window.onscroll = () => { paintSectionLogoIntersection(logo, sectionsData); };
