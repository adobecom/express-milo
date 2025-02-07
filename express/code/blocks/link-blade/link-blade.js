import { getLibs } from '../../scripts/utils.js';


function handleChevron(createTag, linksContainer, linksRow) {
    const leftChev = createTag('button', { class: 'link-blade-chevron left' });
    const rightChev = createTag('button', { class: 'link-blade-chevron' });
    // Scroll handler
    const toggleChevronVisibility = () => {
        const maxScroll = linksContainer.scrollWidth - linksContainer.clientWidth - 10; 
        if (linksContainer.scrollLeft  <= 0) {
            leftChev.classList.add('hidden');
        } else if (linksContainer.scrollLeft >= maxScroll - 10) {
            rightChev.classList.add('hidden')
        } else {
            leftChev.classList.remove('hidden');
            rightChev.classList.remove('hidden')
        }


    };

    // Initial check
    toggleChevronVisibility();

    // Scroll event listener
    linksContainer.addEventListener('scroll', toggleChevronVisibility);

    // Window resize handler
    window.addEventListener('resize', toggleChevronVisibility);

    // Click handler with boundary check
    rightChev.addEventListener('click', () => {
        const newScrollPos = linksContainer.scrollLeft + 400;
        const maxScroll = linksContainer.scrollWidth - linksContainer.clientWidth;
        linksContainer.scrollTo({
            left: Math.min(newScrollPos, maxScroll),
            behavior: 'smooth'
        });
        toggleChevronVisibility()
    });
    leftChev.addEventListener('click', () => {
        const newScrollPos = linksContainer.scrollLeft - 400;
        const maxScroll = linksContainer.scrollWidth - linksContainer.clientWidth;
        linksContainer.scrollTo({
            left: Math.min(newScrollPos, maxScroll),
            behavior: 'smooth'
        });
        toggleChevronVisibility()
    });

    linksRow.appendChild(leftChev)
    linksRow.appendChild(rightChev)
 
}

export default async function decorate(block) {

    const { createTag } = await import(`${getLibs()}/utils/utils.js`);

    // Process header row
    const [headerRow, linksRow] = block.children;
    const headerContent = headerRow.querySelector('div')?.textContent.trim();
    if (headerContent) {
        const header = createTag('h2', { class: 'link-blade-header' }, headerContent);
        headerRow.innerHTML = '';
        headerRow.appendChild(header);
    }

    // Process links row
    const linksContainer = linksRow.querySelector('div');
    linksRow.classList.add("link-blade-link-row");
    if (linksContainer) {
        linksContainer.classList.add('link-blade-links');
        const paragraphs = linksContainer.querySelectorAll('p');
        const links = [];

        paragraphs.forEach((p) => {
            // Remove any <br> elements and extract links
            const brs = p.querySelectorAll('br');
            brs.forEach(br => br.remove());
            const a = p.querySelector('a');
            if (a) {
                links.push(a);
                a.classList.add('link-blade-item');
            }
            p.remove();
        });

        // Clear container and append clean links
        linksContainer.innerHTML = '';
        links.forEach(link => linksContainer.appendChild(link));
    }


    handleChevron(createTag, linksContainer, linksRow)
}