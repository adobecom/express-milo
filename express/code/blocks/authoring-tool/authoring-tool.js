import { getLibs, fixIcons, createTag } from '../../scripts/utils.js';
import { determineTemplateXType, determineTemplateXTypeFromProps, PROPS } from './../template-x/determine-template-x-type.js'

function setValueByKeyPath(obj, keyPath, value) {
    let current = obj
    for (let i = 0; i < keyPath.length - 1; i++) {
        current = current[keyPath[i]]
    }
    current[keyPath[keyPath.length - 1]] = value
}

function getValueByKeyPath(obj, keyPath) {
    let value = obj
    for (let i = 0; i < keyPath.length; i++) {
        value = value[keyPath[i]]
    }
    return value
}

function createInputFields(current, keyPath, output, sourceOfTruth, parentContainer) {

    if (typeof current === 'object') {
        if (current.allowed) {
            output.push(createRestrictedInputfield(current, keyPath, sourceOfTruth, parentContainer))
        } else {
            Array.from(Object.keys(current)).forEach(key => {
                const divider = createTag('div', { class: 'divider' })
                divider.textContent = key
                parentContainer.appendChild(divider)
                const newFields = [...keyPath, key]
                createInputFields(current[key], newFields, output, sourceOfTruth, divider)
            });

        }
    } else {
        output.push(createBasicInputField(current, keyPath, sourceOfTruth, parentContainer))
    }

    return output
}

function createRestrictedInputfield(current, keyPath, sourceOfTruth, parentContainer) {
    const allowed = current.allowed
    const wrapper = createTag('div', { class: 'input-field-wrapper' })
    const div = createTag('select')
    allowed.forEach((entry) => {
        const option = createTag('option')
        option.innerText = entry;
        div.appendChild(option)
    })
    wrapper.appendChild(div)
    createHandlerEvent(div, keyPath, sourceOfTruth)
    parentContainer.appendChild(wrapper)
}

function createHandlerEvent(inputElement, keyPath, sourceOfTruth) {
    inputElement.addEventListener('blur', (e) => {
        setValueByKeyPath(sourceOfTruth, keyPath, e.target.value)
    })
}

function createBasicInputField(current, keyPath, sourceOfTruth, parentContainer) {
    const wrapper = createTag('div', { class: 'input-field-wrapper' })
    const input = createTag('input', { class: 'input-field' })
    input.setAttribute('type', typeof current)
    wrapper.appendChild(input)
    createHandlerEvent(input, keyPath, sourceOfTruth)
    parentContainer.appendChild(wrapper)
}

function preview (sourceOfTruth) {
    const {props, variant} =  determineTemplateXTypeFromProps(sourceOfTruth)
    
}

export default function decorate(block) {
    const sourceOfTruth = { ...PROPS }
    const output = []
    createInputFields({ ...PROPS }, [], output, sourceOfTruth, block)


}