import { useState } from 'react';
import styles from './Posting.module.css';

export default function Posting() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pinned: false,
        timePosted: new Date().toISOString(),
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add API call or form submission logic here
    };

    return (
        <div className={styles.postingFormContainer}>
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>
                        <input
                            type="checkbox"
                            name="pinned"
                            checked={formData.pinned}
                            onChange={handleChange}
                        />
                        Pin this post
                    </label>
                </div>

                <div className={styles.formGroup}>
                    <label>Time Posted</label>
                    <p className={styles.timePosted}>{new Date(formData.timePosted).toLocaleString()}</p>
                </div>

                <button type="submit">Submit Post</button>
            </form>
        </div>
    );
}