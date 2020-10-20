$(() => {
    const CONTACTS_URL = 'http://5dd3d5ba8b5e080014dc4bfa.mockapi.io/contacts/';
    const DELETE_BTN_CLASS = 'delete-btn';
    const EDIT_BTN_CLASS = 'edit-btn';

    const $addContactBtn = $('.submit-btn');
    const $contactNameInput = $('#contactName');
    const $contactSurnameInput = $('#contactSurname');
    const $contactPhoneInput = $('#contactPhoneNumber');
    const $contactList = $('#contactList');
    const contactItemTemplate = $('#contactItemTemplate').html();

    let listAddedContacts = [];
    let selectedId = null;

    const $dialog = $('#dialog-form').dialog({
        autoOpen: false,
        height: 350,
        width: 350,
        modal: true,
        buttons: {
          Save: () => {
            submitForm();
          },
          Cancel: () => {
            $dialog.dialog('close');
          },
        },
      });

    $addContactBtn.on('click', () => openModal());

    $contactList.on('click', '.' + EDIT_BTN_CLASS, onEditBtnCLick);
    $contactList.on('click', '.' + DELETE_BTN_CLASS, onDelBtnCLick);

    init();

    function openModal(){
        return $dialog.dialog('open');
    }

    function onEditBtnCLick() {
        const $element = $(this);
        const contactItem = $element.parent().parent().data('id')
        editContact(contactItem);
    }

    function onDelBtnCLick() {
        // e.stopProragation();
        const $element = $(this);
        const id = $element.parent().parent().data('id');
        deleteContact(id);
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
        $contactList.empty();
        $contactList.html(data.map(getFormHtml).join('\n'));
    }

    function getFormHtml(contactItem) {
        return contactItemTemplate 
            .replace('{{id}}', contactItem.id)
            .replace('{{name}}', contactItem.name)
            .replace('{{phone}}', contactItem.phone)
            .replace('{{surname}}', contactItem.surname);
    }

    function submitForm() {
        const contactItem = {
            name: $contactNameInput.val(),
            phone: $contactPhoneInput.val(),
            surname: $contactSurnameInput.val(),
        };
        if(selectedId){ 
            editContact(contactItem);
            selectedId = null;
        } else { 
            addContact(contactItem);
        }
        clearForm();
        $dialog.dialog('close');
    }

    function addContact(contactItem) {
        return fetch(CONTACTS_URL, {
            method: 'POST',
            body: JSON.stringify(contactItem),
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
        $contactNameInput.val('');
        $contactPhoneInput.val('');
        $contactSurnameInput.val('');
    }

    function editContact(id) {
        const contactItem = listAddedContacts.find((el) => el.id == id);
        openModal();
        $contactNameInput.val(contactItem.name);
        $contactSurnameInput.val(contactItem.surname);
        $contactPhoneInput.val(contactItem.phone);
        selectedId = id; 
    }

    function updateContactOnServer(contactItem, id) {
        return fetch(CONTACTS_URL + id, {
            method: 'PUT',
            body: JSON.stringify(contactItem),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(getList);
    }
});