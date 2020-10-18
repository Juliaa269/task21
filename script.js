$(() => {
    const CONTACTS_URL = 'http://5dd3d5ba8b5e080014dc4bfa.mockapi.io/contacts/';
    const DELETE_BTN_CLASS = 'delete-btn';
    const EDIT_BTN_CLASS = 'edit-btn';

    const $addContactForm = $('#addContactForm');
    const $contactNameInput = $('#contactNameInput');
    const $contactSurnameInput = $('#contactSurnameInput');
    const $contactPhoneInput = $('#contactPhoneInput');
    const $contactList = $('#contactList');
    const contactItemTemplate = $('#contactItemTemplate').html();

    let listAddedContacts = [];

    $addContactForm.on('submit', onAddContactFormSubmit);
    $contactList.on('click', '.' + EDIT_BTN_CLASS, onEditBtnCLick);
    $contactList.on('click', '.' + DELETE_BTN_CLASS, onDelBtnCLick);

    init();

    function onAddContactFormSubmit(e) {
        e.preventDefault();

        submitForm();
    }

    function onEditBtnCLick() {
        const $element = $(this);
        updateContact($element.parent().parent().data('id'));
    }

    function onDelBtnCLick() {
        const $element = $(this);
        deleteContact($element.parent().parent().data('id'));
    }

    function init() {
        getList();
    }

    function getList() {
        return fetch(CONTACTS_URL)
            .then((res) => res.json())
            .then((data) => (listAddedContacts = data))
            .then(renderList);
    }

    function renderList(data) {
        $contactList.html(data.map(getFormHtml).join(''));
    }

    function getFormHtml(contact) {
        return contactItemTemplate 
            .replace('{{id}}', contact.id)
            .replace('{{name}}', contact.name)
            .replace('{{surname}}', contact.surname)
            .replace('{{phone}}', contact.phone);
    }

    function submitForm() {
        if (formIsValid()){
            const contactItem = {
                name: $contactNameInput.val(),
                surname: $contactSurnameInput.val(),
                phone: $contactPhoneInput.val(),
            };

            addContact(contactItem);
            clearForm();

        } else {
            alert('Введите верные данные!')
        }
    }

    function formIsValid(){
        return $contactNameInput.val() !== "" && $contactSurnameInput.val() !== "" && +$contactPhoneInput.val();
    }

    function addContact(contact) {
        return fetch(CONTACTS_URL, {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((contact) => {
                listAddedContacts.push(contact);
                renderList(listAddedContacts);
            });
    }

    function deleteContact(id){
        fetch(CONTACTS_URL + id, {
            method: 'DELETE',
        }).then(getList); 
    }

    function clearForm(){
        $contactNameInput.val("");
        $contactSurnameInput.val("");
        $contactPhoneInput.val("");
    }

    // function updateContact(id, contactItem) {
    //     fetch(CONTACTS_URL + id, {
    //         method: 'PUT',
    //         body: JSON.stringify(contactItem),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     }).then(getList); 
    // }
});