const DARK_BG_SECTION_CLASS = 'color-dark';

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


const logoDarkClipDOM = document.querySelector('#logo-dark-mask rect');
const logoLightClipDOM = document.querySelector('#logo-light-mask rect');
const logoBoundingBox = document.querySelector('.logo').getBoundingClientRect();
const logoBox = {
    start: logoBoundingBox.top,
    end: logoBoundingBox.top + logoBoundingBox.height
}


function resizeClipRect(sectionIsDark, sectionIntersectingLogoAtDistance) {
    if (sectionIsDark) {
        logoLightClipDOM.setAttribute('y', sectionIntersectingLogoAtDistance);
        logoLightClipDOM.setAttribute('height', logoBox.end - sectionIntersectingLogoAtDistance);

        logoDarkClipDOM.setAttribute('y', 0);
        logoDarkClipDOM.setAttribute('height', sectionIntersectingLogoAtDistance);
    } else {
        logoDarkClipDOM.setAttribute('y', sectionIntersectingLogoAtDistance);
        logoDarkClipDOM.setAttribute('height', logoBox.end - sectionIntersectingLogoAtDistance);

        logoLightClipDOM.setAttribute('y', 0);
        logoLightClipDOM.setAttribute('height', sectionIntersectingLogoAtDistance);
    }
}

function findSectionLogoIntersection() {
    const windowScrollY = window.scrollY;
    for (let section of sectionsData ) {
        const sectionViewPortStart = section.start - windowScrollY;
        const sectionViewPortEnd = section.end - windowScrollY;
        if ( sectionViewPortStart > logoBox.start && sectionViewPortStart <= logoBox.end) {
            const sectionIntersectingLogoAtDistance = sectionViewPortStart - logoBox.start;
            resizeClipRect(section.isDark, sectionIntersectingLogoAtDistance);
            return false;
        } else if (logoBox.start > sectionViewPortStart && logoBox.end < sectionViewPortEnd) {
            resizeClipRect(section.isDark, 0);
            return false;
        }
    };
}

window.onscroll = findSectionLogoIntersection;
