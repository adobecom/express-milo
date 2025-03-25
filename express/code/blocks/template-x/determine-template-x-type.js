import isDarkOverlayReadable from '../../scripts/color-tools.js';
import { createOptimizedPicture } from '../../scripts/utils/media.js';

export const PROPS = {
    templates: [],
    filters: {
        locales: 'en',
         topics: ''
    },
    limit: 20, 
    collectionId: 'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418',
    loadedOtherCategoryCounts: false,
    tasks : '',
    topics : '',
    locales : 'en',
    behaviors : '', 
    premium : '',
    animated: "",
    templateStats : "",
    orientation :  "",
    width : "",
    mini : "",
    print : "",

};

function camelize(str) {
    return str.replace(/^\w|[A-Z]|\b\w/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');
}

export function constructProps(block) {
    
    const props = { ...PROPS }
    Array.from(block.children).forEach((row) => {
        const cols = row.querySelectorAll('div');
        const key = cols[0].textContent.trim().toLowerCase();
        if (cols.length === 1) {
            [props.contentRow] = cols;
        } else if (cols.length === 2) {
            let value = cols[1].textContent.trim();
            // Treat "null" as blank
            if (value.toLowerCase() === 'null') {
                value = '';
            }
            console.log(key,value)
            if (key && value) {
                // FIXME: facebook-post
                if (['tasks', 'topics', 'locales', 'behaviors'].includes(key) || (['premium', 'animated'].includes(key) && value.toLowerCase() !== 'all')) {
                    props.filters[camelize(key)] = value;
                } else if (['yes', 'true', 'on', 'no', 'false', 'off'].includes(value.toLowerCase())) {
                    props[camelize(key)] = ['yes', 'true', 'on'].includes(value.toLowerCase());
                } else if (key === 'collection id') {
                    props[camelize(key)] = value.replaceAll('\\:', ':');
                } else {
                    props[camelize(key)] = value;
                }
            }
        } else if (cols.length === 3) {
            if (key === 'template stats' && ['yes', 'true', 'on'].includes(cols[1].textContent.trim().toLowerCase())) {
                props[camelize(key)] = cols[2].textContent.trim();
            }
        } else if (cols.length === 4) {

            if (key === 'blank template') {
                cols[0].remove();
                props.templates.push(row);
            }
            
        }
    });

    return props;
}

export function determineTemplateXTypeFromProps (props) {
    const type = [];
   
    // orientation aspect
    if (props.orientation && props.orientation.toLowerCase() === 'horizontal') type.push('horizontal');
    console.log(props.orientation)
    // style aspect
    if (props.width && props.width.toLowerCase() === 'full') type.push('fullwidth');
    if (props.width && props.width.toLowerCase() === 'sixcols') type.push('sixcols');
    if (props.width && props.width.toLowerCase() === 'fourcols') type.push('fourcols');
    if (props.mini) type.push('mini');
    console.log(props)
    if (props.print){
        type.push('print');
        if (props.print.toLowerCase() === 'flyer') type.push('flyer');
        if (props.print.toLowerCase() === 't-shirt') type.push('t-shirt');
    }
    console.log(props)
    return {props, variant:type}
}

export function determineTemplateXType(block) {
    const props = constructProps(block)
    console.log(props)
    // todo: build layers of aspects based on props conditions - i.e. orientation -> style -> use case
    
    return determineTemplateXTypeFromProps(props)
}
