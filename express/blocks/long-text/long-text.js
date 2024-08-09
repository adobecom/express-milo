import { addTempWrapper } from '../../scripts/decorate.js';

export default function decorate(block) {
  if (!block.parentElement.classList.contains('long-text-wrapper')) {
    addTempWrapper(block, 'long-text');
  }

  if (block.classList.contains('plain')) {
    block.parentElement.classList.add('plain');
  }

  if (block.textContent.trim() === '') {
    if (block.parentElement.classList.contains('long-text-wrapper')) {
      block.parentElement.remove();
    } else {
      block.remove();
    }
  }
}
