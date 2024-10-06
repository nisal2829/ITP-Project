import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './createInvoice.css';

function CreateInvoice() {
    const { id } = useParams();
    const [medicineList, setMedicineList] = useState([]);
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState({ customerName: '', customerEmail: '', medicines: [], total: 0 });

    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [errors, setErrors] = useState({});

    // Fetch medicines
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/savinda/auth/users/sitems`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setMedicineList(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        let formErrors = {};
        if (!invoice.customerName || invoice.customerName.length < 2) {
            formErrors.customerName = 'Customer name must be at least 2 characters.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!invoice.customerEmail || !emailRegex.test(invoice.customerEmail)) {
            formErrors.customerEmail = 'Please enter a valid email address.';
        }
        if (!selectedMedicine) {
            formErrors.selectedMedicine = 'Please select a medicine.';
        }
        if (quantity <= 0) {
            formErrors.quantity = 'Quantity must be greater than zero.';
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddMedicine = () => {
        if (!validateForm()) return;

        const selectedMed = medicineList.find(med => med._id === selectedMedicine);
        if (selectedMed && quantity > 0) {
            const newMedicine = {
                medicineId: selectedMed._id,
                namee: selectedMed.namee,
                quantity: quantity,
                price: selectedMed.price
            };
            setInvoice({
                ...invoice,
                medicines: [...invoice.medicines, newMedicine],
                total: invoice.total + (selectedMed.price * quantity)
            });
            setSelectedMedicine('');
            setQuantity(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            let res;
            if (id) {
                res = await fetch(`/api/savinda/auth/invoices/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(invoice),
                });
            } else {
                res = await fetch('/api/savinda/auth/create_invoice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(invoice),
                });
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create/update invoice');
            }

            alert('Invoice created successfully!');
            navigate('/invoices');
        } catch (err) {
            console.error("Error adding data:", err);
        }
    };

    return (
        <div className="create-invoice-page">
            <form onSubmit={handleSubmit} className="create-invoice-form">
                <div className="form-content">
                    <div className="form-left">
                        <div>
                            <h2>CREATE INVOICE</h2>
                        </div>
                        <br />
                        <div className="form-group">
                            <label>Customer Name:</label>
                            <input
                                type="text"
                                id='customerName'
                                name="customerName"
                                value={invoice.customerName}
                                placeholder="Enter customer name"
                                onChange={handleChange}
                                required
                            />
                            {errors.customerName && <span className="error">{errors.customerName}</span>}
                        </div>
                        <div className="form-group">
                            <label>Customer Email:</label>
                            <input
                                type="email"
                                id='customerEmail'
                                name="customerEmail"
                                value={invoice.customerEmail}
                                placeholder="Enter email"
                                onChange={handleChange}
                                required
                            />
                            {errors.customerEmail && <span className="error">{errors.customerEmail}</span>}
                        </div>
                        <div className="form-group medicine-quantity-group">
                            <label>Medicines:</label>
                            <select
                                value={selectedMedicine}
                                onChange={(e) => setSelectedMedicine(e.target.value)}
                            >
                                <option value="">Select Medicine</option>
                                {medicineList.map((medicine) => (
                                    <option key={medicine._id} value={medicine._id}>
                                        {medicine.namee}
                                    </option>
                                ))}
                            </select>
                            {errors.selectedMedicine && <span className="error">{errors.selectedMedicine}</span>}
                            <label>Quantity needed:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min="0"
                            />
                            {errors.quantity && <span className="error">{errors.quantity}</span>}
                        </div>
                        <div className="form-group">
                            <button type="button" onClick={handleAddMedicine} className="add-medicine-btn">Add Medicine</button>
                        </div>
                        <ul>
                            {invoice.medicines.map((med, index) => (
                                <li key={index}>{med.namee} - {med.quantity} x {med.price} = {med.quantity * med.price}</li>
                            ))}
                        </ul>
                        <p>Total Amount: {invoice.total}</p>
                        <div className="form-group">
                            <button type="submit" className="create-invoice-btn">Create Invoice</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateInvoice;
