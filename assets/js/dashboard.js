let openModalBtn = document.querySelector('.open-modal');
let closeModalBtn = document.querySelector('#closeModal');
let hidden = document.querySelector('.hidden');
let filter = document.querySelector('.filter');





closeModalBtn.addEventListener('click', () => {
    closeModal();
});

function openModal(elem) {
    hidden.classList.remove('hidden');
    filter.classList.remove('filter');
    document.documentElement.style.overflow = 'hidden';

    let dataEmployee = JSON.parse(elem.getAttribute('data-employee'))._doc;
    let employeeId = elem.getAttribute('data-employeeId');
    console.log(employeeId);
    console.log(dataEmployee);
    document.getElementById('action').action = `/updateEmployee/${employeeId}`;
    document.getElementById('modalName').value = dataEmployee.name;
    document.getElementById('modalFunction').value = dataEmployee.function;
    document.getElementById('modalBlame').value = dataEmployee.blame;
}

function closeModal() {
    hidden.classList.add('hidden');
    filter.classList.add('filter');
    document.documentElement.style.overflow = 'visible';
};


