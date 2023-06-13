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

    console.log(elem);
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

let search = document.querySelectorAll('.search-bar');
let invisible = document.querySelectorAll('.invisible');
let openBtn = document.querySelector('.open-btn');
let closeBtn = document.querySelector('.close-btn');

openBtn.addEventListener('click', () => {
    openSearchBar();
});

function openSearchBar() {

    search.forEach(element => {
        element.style.transition = "100ms"
        element.style.width = "800px";
    });
    invisible.forEach(element => {
        element.style.display = "block"
    });
    openBtn.style.display = "none";
}

closeBtn.addEventListener('click', () => {
    closeSearchBar();
});

function closeSearchBar() {

    search.forEach(element => {
        element.style.transition = "100ms"
        element.style.width = "0px";
    });
    invisible.forEach(element => {
        element.style.display = "none"
    });

    openBtn.style.display = "block"
}





function preview(event) {

    document.querySelector('.preview').innerHTML = ""
    let file = event.target.files[0];

    let reader = new FileReader();

    reader.onload = function () {
        let imagePreview = document.querySelector('.preview')
        imagePreview.innerHTML = "";

        let img = document.createElement('img');
        img.src = reader.result;
        img.style.maxWidth = '50px';
        img.style.maxHeight = '50px';

        imagePreview.appendChild(img);
    }
 reader.readAsDataURL(file);

}

// alternative
// const previewPicture = function (e) {
//     const [picture] = e.files
//     const types = ["image/jpg", "image/jpeg", "image/png"];
//     if (picture) {
//         const image = document.getElementById("image");
//         if (types.includes(picture.type)) {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 image.src = e.target.result
//             }
//             reader.readAsDataURL(picture)
//         }
//     }
// }