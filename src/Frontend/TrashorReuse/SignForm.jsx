import InputField from '../components/modals/shared/InputField';
import '../shared/styles.css';
import { useState } from 'react';

function SignInForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className='form-container gap-4 flex p-4 rounded-md'>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

export default SignInForm;
        
