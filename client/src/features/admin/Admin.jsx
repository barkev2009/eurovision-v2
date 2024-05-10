import React, { useEffect, useState } from 'react'
import { useSetCookie } from '../../hooks'
import { useNavigate } from 'react-router-dom'
import { MAIN_ROUTE } from '../../consts';
import { useSelector } from 'react-redux';
import styles from './Admin.module.css';
import { createRecordsAPI } from './adminAPI';

const Admin = () => {

    useSetCookie();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);

    const [rawData, setRawData] = useState('');
    const [resp, setResp] = useState(null);
    const [parsedData, setParsedData] = useState('');
    const parseRawData = () => {
        const lines = rawData.split('\n');
        const keys = lines[0].split('\t');
        const records = [];
        let line, record = {};
        if (lines.length > 1) {
            for (let i = 1; i < lines.length; i++) {
                record = {}
                line = lines[i].split('\t');
                if (line.length === keys.length) {
                    for (let j = 0; j < line.length; j++) {
                        record[keys[j]] = line[j].trim();
                    }
                    records.push(record);
                }       
            }
            setParsedData(records);
        }
    }
    const createRecords = async () => {
        const response = await createRecordsAPI({parsedData});
        setResp(response);
        setRawData('');
    }

    useEffect(
        () => {
            parseRawData();
        }, [rawData]
    );

    return (
        <div className={styles.adminContainer}>
            <button onClick={() => navigate(MAIN_ROUTE + '/' + user.id)}>Return</button>
            <textarea name="entries" value={rawData} onChange={e => {setRawData(e.target.value); setResp(null)}}></textarea>
            <button onClick={createRecords}>Create records</button>
            {resp && <div>{JSON.stringify(resp, null, 2)}</div>}
        </div>
    )
}

export default Admin