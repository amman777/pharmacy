const scriptURL = 'https://script.google.com/macros/s/AKfycbw529GQUsJAV5ZQXe6DSbbxkgh1CX0pNB6adwoK9OsBFy-R3sMY_2RpuyWNQaqUlL2oUw/exec';
const form = document.forms['search-form'];
const customerForm = document.getElementById('customerForm');
const loadingIndicator = document.getElementById('loadingIndicator');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const fetchMedicineBtn = document.getElementById('fetchMedicineBtn');
const medicineDetails = document.getElementById('medicineDetails');
const medicineDetailsContent = document.getElementById('medicineDetailsContent');
const medicineFormFields = document.getElementById('medicineFormFields');
const totalBtn = document.getElementById('totalBtn'); // New total button

form.addEventListener('submit', e => {
    e.preventDefault();
    fetchMedicine();
});

fetchMedicineBtn.addEventListener('click', e => {
    fetchMedicine();
});

function fetchMedicine() {
    loadingIndicator.style.display = 'block';
    const formData = new FormData(form);
    formData.append('action', 'fetch_medicine');

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.style.display = 'none';
            if (data.result === 'success') {
                displayMedicineDetails(data.medicine);
            } else {
                messageDiv.innerText = data.message || 'An error occurred.';
            }
            //form.reset();
        })
        .catch(error => {
            loadingIndicator.style.display = 'none';
            console.error('Error!', error.message);
        });
}

function displayMedicineDetails(medicine) {
    const newMedicineForm = document.createElement('form');
    newMedicineForm.className = 'medicine-form';

    const today = new Date();
    const phoneNumber = document.getElementById('phoneNumber').value;
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const invoiceNumber = day + month + year + phoneNumber.slice(0, 5);

    const newInvoiceField = document.createElement('input');
    newInvoiceField.type = 'text';
    newInvoiceField.name = `invoiceNumber`;
    newInvoiceField.value = invoiceNumber;
    newInvoiceField.readOnly = true;

    const newBarcodeField = document.createElement('input');
    newBarcodeField.type = 'text';
    newBarcodeField.name = `barcode`;
    newBarcodeField.value = document.getElementById('barcode').value;
    newBarcodeField.readOnly = true;

    const newQuantity = form.querySelector('#quantity').value;
    const newAmountField = document.createElement('input');
    newAmountField.type = 'text';
    newAmountField.name = `amount`;
    newAmountField.value = (parseFloat(medicine.price) * parseInt(newQuantity)).toFixed(2);
    newAmountField.readOnly = true;

    const newCustomerNameField = document.createElement('input');
    newCustomerNameField.type = 'text';
    newCustomerNameField.name = `customerName`;
    newCustomerNameField.value = document.getElementById('customerName').value;
    newCustomerNameField.readOnly = true;

    const newCustomerPhoneNumberField = document.createElement('input');
    newCustomerPhoneNumberField.type = 'text';
    newCustomerPhoneNumberField.name = `customerPhoneNumber`;
    newCustomerPhoneNumberField.value = phoneNumber;
    newCustomerPhoneNumberField.readOnly = true;

    const newMedicineNameField = document.createElement('input');
    newMedicineNameField.type = 'text';
    newMedicineNameField.name = `medicineName`;
    newMedicineNameField.value = medicine.medicineName;
    newMedicineNameField.readOnly = true;

    const newPriceField = document.createElement('input');
    newPriceField.type = 'text';
    newPriceField.name = `price`;
    newPriceField.value = medicine.price;
    newPriceField.readOnly = true;

    const newQuantityField = document.createElement('input');
    newQuantityField.type = 'text';
    newQuantityField.name = `quantity`;
    newQuantityField.value = newQuantity;
    newQuantityField.readOnly = true;

    newMedicineForm.appendChild(newInvoiceField);
    newMedicineForm.appendChild(newCustomerNameField);
    newMedicineForm.appendChild(newCustomerPhoneNumberField);
    newMedicineForm.appendChild(newBarcodeField);
    newMedicineForm.appendChild(newMedicineNameField);
    newMedicineForm.appendChild(newQuantityField);
    newMedicineForm.appendChild(newPriceField);
    newMedicineForm.appendChild(newAmountField);

    medicineFormFields.appendChild(newMedicineForm);

    medicineFormFields.style.display = 'block';
}

const scriptStoreURL = 'https://script.google.com/macros/s/AKfycbzCKHVog3F3AkywVneaBLmqOXt9zof3ODi9KUD6tWHWTw-BxqrhVzooB388iz7kclpbuA/exec';
const loadingIndicator2 = document.getElementById('loadingIndicator2');

submitBtn.addEventListener('click', e => {
    const medicineForms = document.querySelectorAll('.medicine-form');

    loadingIndicator2.style.display = 'block';

    medicineForms.forEach(medicineForm => {
        const form = medicineForm.closest('form');
        const formData = new FormData(form);

        fetch(scriptStoreURL, { method: 'POST', body: formData })
            .then(response => {
                loadingIndicator2.style.display = 'none';
                // form.reset();
            })
            .catch(error => {
                loadingIndicator2.style.display = 'none';
                console.error('Error!', error.message);
            });
    });
});

let totalAmount = 0;

totalBtn.addEventListener('click', () => {
    const medicineForms = document.querySelectorAll('.medicine-form');
    totalAmount = 0;
    medicineForms.forEach(medicineForm => {
        const quantity = parseInt(medicineForm.querySelector('[name="quantity"]').value);
        const price = parseFloat(medicineForm.querySelector('[name="price"]').value);
        totalAmount += quantity * price;
    });
    const totalAmountField = document.getElementById('totalAmount');
    totalAmountField.value = totalAmount.toFixed(2);
    const totalForm = document.getElementById('totalForm');
    totalForm.style.display = 'block';
});

printBtn.addEventListener('click', () => {
    const customerName = document.getElementById('customerName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    let contentToPrint = `
        <h2>Customer Information:</h2>
        <p>Customer Name: ${customerName}</p>
        <p>Phone Number: ${phoneNumber}</p>
        <h2>Invoice Details:</h2>
        <div style="display: flex;">
            <div style="flex: 1; padding-right: 5px;"><p>Invoice Number</p></div>
            <div style="flex: 1; padding-right: 5px;"><p>Barcode:</p></div>
            <div style="flex: 1; padding-right: 5px;"><p>Medicine Name:</p></div>
            <div style="flex: 1; padding-right: 5px;"><p>Quantity:</p></div>
            <div style="flex: 1; padding-right: 5px;"><p>Price:</p></div>
            <div style="flex: 1; padding-right: 5px;"><p>Amount:</p></div>
        </div>
    `;

    const medicineForms = document.querySelectorAll('.medicine-form');
    medicineForms.forEach(medicineForm => {
        const invoiceNumber = medicineForm.querySelector('[name="invoiceNumber"]').value;
        const barcode = medicineForm.querySelector('[name="barcode"]').value;
        const medicineName = medicineForm.querySelector('[name="medicineName"]').value;
        const quantity = medicineForm.querySelector('[name="quantity"]').value;
        const price = medicineForm.querySelector('[name="price"]').value;
        const amount = medicineForm.querySelector('[name="amount"]').value;
        
        contentToPrint += `
            <div style="display: flex;">
                <div style="flex: 1; padding-right: 5px;"><p>${invoiceNumber}</p></div>
                <div style="flex: 1; padding-right: 5px;"><p>${barcode}</p></div>
                <div style="flex: 1; padding-right: 5px;"><p>${medicineName}</p></div>
                <div style="flex: 1; padding-right: 5px;"><p>${quantity}</p></div>
                <div style="flex: 1; padding-right: 5px;"><p>${price}</p></div>
                <div style="flex: 1; padding-right: 5px;"><p>${amount}</p></div>
            </div>
            
        `;
    });
    const totalAmount = document.getElementById('totalAmount').value; // Corrected variable name
    contentToPrint+=`    <p>Total: ${totalAmount}</p>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(contentToPrint);
    printWindow.document.close();
    printWindow.print();
});
