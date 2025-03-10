import isDarkOverlayReadable from '../../scripts/color-tools.js';
import { createOptimizedPicture } from '../../scripts/utils/media.js';

export const PROPS = {
    templates: [],
    filters: {
        locales: 'en',
        topics: ''
    },
    limit: 70,
    total: 0,
    collectionId: {
        allowed : undefined
    },
 
    loadedOtherCategoryCounts: undefined,
    tasks : {
        allowed :   undefined,
    },
    topics : {
        allowed :  undefined,
    },
    locales : {
        allowed :   undefined,
    },
    behaviors :{
        allowed :  ['still', 'animated', 'all'],
    },
    premium : {
        allowed : [true, false, 'all']
    },
    animated: {
        allowed : [true, false]
    },
    templateStats : {
        allowed :  ['still', 'animated', 'all'],
    },
    orientation : {
        allowed : ['horizontal']
    },
    width : {
        allowed : ['full','sixcols','fourcols']
    },
    mini : {
        allowed : [true, false]
    },
    print : {
        allowed : [
            'flyer', 't-shirt'
        ]
    }

};

function camelize(str) {
    return str.replace(/^\w|[A-Z]|\b\w/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');
}

export function constructProps(block) {
    
    const props = { ...PROPS }
    Array.from(block.children).forEach((row) => {
        const cols = row.querySelectorAll('div');
        const key = cols[0].querySelector('strong')?.textContent.trim().toLowerCase();
        if (cols.length === 1) {
            [props.contentRow] = cols;
        } else if (cols.length === 2) {
            let value = cols[1].textContent.trim();
            // Treat "null" as blank
            if (value.toLowerCase() === 'null') {
                value = '';
            }

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

export function determineTemplateXType(block) {
    const props = constructProps(block)
    // todo: build layers of aspects based on props conditions - i.e. orientation -> style -> use case
    const type = [];

    // orientation aspect
    if (props.orientation && props.orientation.toLowerCase() === 'horizontal') type.push('horizontal');

    // style aspect
    if (props.width && props.width.toLowerCase() === 'full') type.push('fullwidth');
    if (props.width && props.width.toLowerCase() === 'sixcols') type.push('sixcols');
    if (props.width && props.width.toLowerCase() === 'fourcols') type.push('fourcols');
    if (props.mini) type.push('mini');

    if (props.print ){
        type.push('print');
        if (props.print.toLowerCase() === 'flyer') type.push('flyer');
        if (props.print.toLowerCase() === 't-shirt') type.push('t-shirt');
    }
   

    return {props, variant:type}
}
