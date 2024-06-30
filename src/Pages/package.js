import React, { useState, useEffect } from 'react';
import '../Styles/package.css';
import axiosInstance from '../Auth/AxiosInstance';

const Package = () => {
    const [name, setPackageName] = useState('');
    const [price, setPrice] = useState('');
    const [packages, setPackages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axiosInstance.get('/package');
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    const handleAddPackage = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/package', {
                name,
                price
            });
            setMessage('Package added successfully');
            setPackages([...packages, response.data]);
            setPackageName('');
            setPrice('');
            setLoading(false);
            setTimeout(() => {
                setMessage('');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setMessage('Failed to add package');
            console.error('Error adding package:', error);
            setTimeout(() => {
                setMessage('');
            }, 1000); 
        }
    };

    const handleRemovePackage = async (id) => {
        try {
            await axiosInstance.delete(`/package/${id}`);
            setPackages(packages.filter(pkg => pkg._id !== id));
            setMessage('Package removed successfully');
            setTimeout(() => {
                setMessage('');
            }, 1000); 
        } catch (error) {
            setMessage('Failed to remove package');
            console.error('Error removing package:', error);
            setTimeout(() => {
                setMessage('');
            }, 1000);
        }
    };

    return (
        <div className="package-form-container">
            <div className="package-form-group">
                <label>Add Package</label>
                <input
                    type="text"
                    placeholder="Package name"
                    className="package-name"
                    value={name}
                    onChange={(e) => setPackageName(e.target.value)}
                />
                <br />
                <input
                    type="text"
                    placeholder="Price"
                    className="package-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <div>
                    <button onClick={handleAddPackage} className="add-button">
                        {loading ? "Adding..." : "Add"}
                    </button>
                </div>
            </div>

            {message && <div className="message">{message}</div>}

            <div className="package-display">
                {packages.map((pkg) => (
                    <div key={pkg._id} className="package-item">
                        <span>{pkg.name} -- {pkg.price} Taka</span>
                        <button onClick={() => handleRemovePackage(pkg._id)} className="remove-button">Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Package;
