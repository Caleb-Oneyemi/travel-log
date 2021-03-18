import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createLogEntry } from './api';

const EntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit } = useForm();

    const submitData = async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(submitData)} className='entry-form'>
            { error ? <h3 className='error'>{error}err</h3> : null }
            <label htmlFor='location'>Location</label>
            <input name='location' required ref={register} />
            <label htmlFor='comments'>Comments</label>
            <textarea name='comments' rows={3} ref={register}></textarea>
            <label htmlFor='image'>Image Link</label>
            <input name='image' ref={register} />
            <label htmlFor='visitDate'>Visit Date</label>
            <input name='visitDate' type='date' required ref={register} />
            <button disabled={loading}> {loading ? 'Loading...' : 'Create'} </button>
        </form>
    );
}

export default EntryForm; 