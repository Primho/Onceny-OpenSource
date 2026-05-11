import { getDataCards } from './state.js'
import './components/dialog.js';


const listsWrapper = document.querySelector('.lists-wrapper');

const cardDialog = document.querySelector('#card-dialog');
const cardDialogHeader = document.querySelector('#card-dialog__header');

listsWrapper.addEventListener('click', (e) => {
    const isCard = e.target.closest('.todo-card');

    if (!isCard) return;
    cardDialog.showModal();
    const card = Number(isCard.dataset.id);
    
    const findIt = getDataCards().find(elemento => elemento.id === card);
    console.log(findIt);

});