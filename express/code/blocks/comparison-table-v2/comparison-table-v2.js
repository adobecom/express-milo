



function partitionContent(children) {
    const groups = [];
    let currentGroup = [];

    for (const child of children) {
        const hasHr = child.querySelector('hr');
        if (hasHr) {
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
                currentGroup = [];
            }
        } else {
            currentGroup.push(child);
        }
    }

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }
    return groups;
}

function toggleVisibleContentMobile(block, visibleCol){
   const planCell = block.querySelectorAll('.plan-cell');
   planCell.forEach((cell, index) => {
        cell.classList.toggle('invisible-content', index !== visibleCol && index > 0);
   });
   const rows = block.querySelectorAll('.table-container tr');
   console.log(rows);
   rows.forEach((row) => {
    const featureCells = row.querySelectorAll('.feature-cell');
    featureCells.forEach((cell, index) => {
        cell.classList.toggle('invisible-content', index !== visibleCol + 1 && index > 1);
    });
   });
}

function convertToTable(group, headers) {
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const colors = []
    group.forEach((div, index) => {
        if (index === 0) {
            const firstRow = document.createElement('div');
            firstRow.classList.add('first-row');
            firstRow.appendChild(div.children[0]);
            for (let i = 1; i < div.children.length - 1; i++) {
                const cell = div.children[i];
                const color = cell.textContent.trim();
                colors.push(color);
                cell.textContent = '';
            }

            const button = document.createElement('button');
            button.textContent = 'Toggle';
            if (div.children[div.children.length - 1].textContent.trim() === 'hidden') {
                table.classList.add('hide-table');
            }
            button.onclick = () => {
                table.classList.toggle('hide-table');
            }
            const buttonCell = document.createElement('div');
            buttonCell.appendChild(button);
            buttonCell.classList.add('button-cell');
            firstRow.appendChild(buttonCell);

            tableContainer.appendChild(firstRow);

            const invisibleHeaders = document.createElement('thead');
            const invisibleHeaderRow = document.createElement('tr');
            invisibleHeaders.classList.add('invisible-headers');
            invisibleHeaders.appendChild(invisibleHeaderRow);
            const headerCell = document.createElement('th');
            headerCell.textContent = div.children[0].textContent.trim();
            invisibleHeaderRow.appendChild(headerCell);

            for (let i = 0; i < headers.length; i++) {
                const th = document.createElement('th');
                th.textContent = headers[i];
                invisibleHeaderRow.appendChild(th);
            }
            table.appendChild(invisibleHeaders);
        } else {
            const row = document.createElement('tr');
            const cells = div.children;
            for (const cell of cells) {
                const td = document.createElement('td');
                td.classList.add('feature-cell');
                td.innerHTML = cell.innerHTML;
                row.appendChild(td);
            }

            tbody.appendChild(row);
        }
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    return tableContainer;
}

function createStickyHeader(stickyHeader) {
    const headers = []
    stickyHeader.classList.add('sticky-header');
    const stickyHeaderContent = stickyHeader.querySelectorAll('div');
    stickyHeaderContent.forEach((div, index) => {
        if (index === 0) {
            div.classList.add('first-cell');
        } else {
            div.classList.add('plan-cell');
            const choicesButton = document.createElement('button');
            choicesButton.textContent = '>';
            choicesButton.classList.add('choices-button');
            div.appendChild(choicesButton);
            headers.push(div.textContent.trim());
        }
        stickyHeader.appendChild(div);
    });
    return { stickyHeader, headers };
}

export default async function decorate(block) {
    const children = Array.from(block.children);

    const groups = partitionContent(children);

    block.innerHTML = '';

    const { stickyHeader, headers } = createStickyHeader(groups[0][0]);
    block.appendChild(stickyHeader);
    for (let i = 1; i < groups.length; i++) {
        const table = convertToTable(groups[i], headers);
        block.appendChild(table);
    }

    toggleVisibleContentMobile(block, 1);
}   