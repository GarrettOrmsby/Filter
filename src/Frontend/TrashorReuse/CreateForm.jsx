import InputField from '../shared/InputField';
import '../shared/styles.css';
import { useState } from 'react';

function CreateAccountForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className='form-container gap-4 flex flex-col p-4 rounded-md'>
            <h2 className='section-heading'>Create Your Filter</h2>
            <form onSubmit={handleSubmit}>
                <InputField
                    name="email"
                    label="Email: "
                    value={formData.email}
                    onChange={handleChange}
                    className="full-width"
                />
                <InputField
                    name="username"
                    label="Username: "
                    value={formData.username}
                    onChange={handleChange}
                />
                <InputField
                    name="password"
                    label="Password: "
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                />
                <InputField
                    name="confirmPassword"
                    label="Confirm Password: "
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password"
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default CreateAccountForm;