import { useState } from 'react';
import styles from './Posting.module.css';

export default function Posting() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pinned: false,
        visibility: 'Global',
        timePosted: new Date().toISOString(),
    });

    const [successMessage, setSuccessMessage] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const createRequest = async (visibility,content,pinned,title,timePosted) => {
        const request = {
            author: "john",
            timePosted:  (new Date()).getTime(),
            visibility : "GLOBAL",
            pinned: pinned,
            content : content,
            title: title,
        };
        console.log(request)
        try {
            const response = await fetch("http://localhost:8080/api/createPost", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            });
            if (!response.ok) {
                throw new Error("Failed to create ticket");
            }
            } 
        catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        createRequest("GLOBAL",formData.description,formData.pinned,formData.title);
        // Show success message
        setSuccessMessage(true);
        // Reset form
        setFormData({
            title: '',
            description: '',
            pinned: false,
            visibility: 'Global',
            timePosted: new Date().toISOString(),
        });
        // Hide message after 3 seconds
        setTimeout(() => setSuccessMessage(false), 3000);
    };

    return (
        <div className={styles.postingFormContainer}>
            <h2>Create New Post</h2>
            {/* Only show this div if success message is true */}
            {successMessage && (
                <div className={styles.successMessage}>
                    Successfully posted
                </div>
            )}
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
                    <label htmlFor="visibility">Visibility *</label>
                    <select
                        id="visibility"
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        required
                    >
                        <option value="Global">Global</option>
                        <option value="Regional">Regional</option>
                        <option value="Social">Social</option>
                    </select>
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