import React, { useState } from 'react';
import { useSetCookie } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { MAIN_ROUTE } from '../../consts';
import { useSelector } from 'react-redux';
import styles from './Admin.module.css';
import { createRecordsAPI } from './adminAPI';
import { FIRST_SEMIFINAL, SECOND_SEMIFINAL, GRAND_FINAL } from '../../enum';

const COLUMNS = ['CONTEST_STEP', 'YEAR', 'ORDER', 'COUNTRY', 'ARTIST', 'SONG', 'PLACE'];
const STEP_OPTIONS = [FIRST_SEMIFINAL, SECOND_SEMIFINAL, GRAND_FINAL];

const EMPTY_ROW = () => ({
    CONTEST_STEP: FIRST_SEMIFINAL,
    YEAR: new Date().getFullYear(),
    ORDER: '',
    COUNTRY: '',
    ARTIST: '',
    SONG: '',
    PLACE: '',
});

const Admin = () => {
    useSetCookie();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);

    const [rows, setRows] = useState([EMPTY_ROW()]);
    const [csvText, setCsvText] = useState('');
    const [mode, setMode] = useState('table'); // 'table' | 'csv'
    const [status, setStatus] = useState(null); // null | 'loading' | 'ok' | 'error'
    const [statusMsg, setStatusMsg] = useState('');
    const [parseError, setParseError] = useState('');

    // --- CSV parsing ---
    const parseCSV = (text) => {
        setParseError('');
        const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        const firstLine = lines[0];
        // Определяем разделитель: запятая или таб
        const sep = firstLine.includes('\t') ? '\t' : ',';
        const headers = firstLine.split(sep).map(h => h.trim().toUpperCase());

        // Проверяем что все нужные колонки есть
        const missing = COLUMNS.filter(c => !headers.includes(c));
        if (missing.length > 0) {
            setParseError(`Не хватает колонок: ${missing.join(', ')}`);
            return;
        }

        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
            const vals = lines[i].split(sep);
            if (vals.length < headers.length) continue;
            const row = {};
            headers.forEach((h, idx) => { row[h] = (vals[idx] || '').trim(); });
            parsed.push(row);
        }

        if (parsed.length === 0) {
            setParseError('Нет строк с данными');
            return;
        }

        setRows(parsed);
        setMode('table');
    };

    const handleCSVPaste = (e) => {
        const text = e.target.value;
        setCsvText(text);
        parseCSV(text);
    };

    // --- Table editing ---
    const updateCell = (rowIdx, col, value) => {
        setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [col]: value } : r));
    };

    const addRow = () => {
        const last = rows[rows.length - 1];
        setRows(prev => [...prev, EMPTY_ROW(last
            ? { ...EMPTY_ROW(), CONTEST_STEP: last.CONTEST_STEP, YEAR: last.YEAR }
            : undefined
        )]);
    };

    const removeRow = (idx) => {
        setRows(prev => prev.filter((_, i) => i !== idx));
    };

    const duplicateRow = (idx) => {
        setRows(prev => {
            const copy = [...prev];
            copy.splice(idx + 1, 0, { ...prev[idx], ORDER: '' });
            return copy;
        });
    };

    // Применить CONTEST_STEP и YEAR ко всем строкам
    const applyToAll = (col, value) => {
        setRows(prev => prev.map(r => ({ ...r, [col]: value })));
    };

    // --- Submit ---
    const handleSubmit = async () => {
        const valid = rows.filter(r => r.COUNTRY && r.ARTIST && r.SONG && r.YEAR && r.ORDER);
        if (valid.length === 0) {
            setStatusMsg('Нет валидных строк (нужны COUNTRY, ARTIST, SONG, YEAR, ORDER)');
            setStatus('error');
            return;
        }
        setStatus('loading');
        setStatusMsg(`Отправляю ${valid.length} записей...`);
        try {
            const resp = await createRecordsAPI({ parsedData: valid });
            if (resp.message === 'OK') {
                setStatus('ok');
                setStatusMsg(`Готово! Добавлено ${valid.length} записей.`);
                setRows([EMPTY_ROW()]);
                setCsvText('');
            } else {
                setStatus('error');
                setStatusMsg(resp.message || 'Ошибка сервера');
            }
        } catch (e) {
            setStatus('error');
            setStatusMsg(e.message || 'Сетевая ошибка');
        }
    };

    const validCount = rows.filter(r => r.COUNTRY && r.ARTIST && r.SONG && r.YEAR && r.ORDER).length;

    return (
        <div className={styles.adminContainer}>
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => navigate(MAIN_ROUTE + '/' + user.id)}>
                    ← Back
                </button>
                <h2 className={styles.title}>Add entries</h2>
                <div className={styles.modeTabs}>
                    <button
                        className={mode === 'table' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                        onClick={() => setMode('table')}
                    >Table</button>
                    <button
                        className={mode === 'csv' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                        onClick={() => setMode('csv')}
                    >Paste CSV</button>
                </div>
            </div>

            {mode === 'csv' && (
                <div className={styles.csvPane}>
                    <p className={styles.hint}>
                        Вставь содержимое CSV-файла (с заголовком). Разделитель — запятая или таб.<br />
                        Колонки: <code>CONTEST_STEP, YEAR, ORDER, COUNTRY, ARTIST, SONG, PLACE</code>
                    </p>
                    <textarea
                        className={styles.csvTextarea}
                        value={csvText}
                        onChange={handleCSVPaste}
                        placeholder={"CONTEST_STEP,YEAR,ORDER,COUNTRY,ARTIST,SONG,PLACE\nFirst Semi-Final,2026,1,Iceland,Band Name,Song Title,"}
                        spellCheck={false}
                    />
                    {parseError && <div className={styles.errorMsg}>{parseError}</div>}
                    {!parseError && rows.length > 0 && csvText && (
                        <div className={styles.parseOk}>✓ Распознано {rows.length} строк — переключись на Table для проверки</div>
                    )}
                </div>
            )}

            {mode === 'table' && (
                <div className={styles.tablePane}>
                    <div className={styles.bulkActions}>
                        <label className={styles.bulkLabel}>Применить ко всем:</label>
                        <select
                            className={styles.bulkSelect}
                            onChange={e => applyToAll('CONTEST_STEP', e.target.value)}
                        >
                            {STEP_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input
                            className={styles.bulkInput}
                            type="number"
                            placeholder="Год"
                            onBlur={e => e.target.value && applyToAll('YEAR', e.target.value)}
                        />
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Contest step</th>
                                    <th>Year</th>
                                    <th>Order</th>
                                    <th>Country</th>
                                    <th>Artist</th>
                                    <th>Song</th>
                                    <th>Place</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => {
                                    const isValid = row.COUNTRY && row.ARTIST && row.SONG && row.YEAR && row.ORDER;
                                    return (
                                        <tr key={idx} className={isValid ? styles.rowValid : styles.rowInvalid}>
                                            <td className={styles.rowNum}>{idx + 1}</td>
                                            <td>
                                                <select
                                                    className={styles.cellSelect}
                                                    value={row.CONTEST_STEP}
                                                    onChange={e => updateCell(idx, 'CONTEST_STEP', e.target.value)}
                                                >
                                                    {STEP_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <input className={styles.cellInput} type="number" value={row.YEAR}
                                                    onChange={e => updateCell(idx, 'YEAR', e.target.value)} />
                                            </td>
                                            <td>
                                                <input className={styles.cellInputSm} type="number" value={row.ORDER}
                                                    onChange={e => updateCell(idx, 'ORDER', e.target.value)} />
                                            </td>
                                            <td>
                                                <input className={styles.cellInput} value={row.COUNTRY}
                                                    onChange={e => updateCell(idx, 'COUNTRY', e.target.value)} />
                                            </td>
                                            <td>
                                                <input className={styles.cellInput} value={row.ARTIST}
                                                    onChange={e => updateCell(idx, 'ARTIST', e.target.value)} />
                                            </td>
                                            <td>
                                                <input className={styles.cellInputLg} value={row.SONG}
                                                    onChange={e => updateCell(idx, 'SONG', e.target.value)} />
                                            </td>
                                            <td>
                                                <input className={styles.cellInputSm} type="number" value={row.PLACE}
                                                    onChange={e => updateCell(idx, 'PLACE', e.target.value)} />
                                            </td>
                                            <td className={styles.rowActions}>
                                                <button className={styles.dupBtn} title="Дублировать" onClick={() => duplicateRow(idx)}>⧉</button>
                                                <button className={styles.delBtn} title="Удалить" onClick={() => removeRow(idx)}>✕</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <button className={styles.addRowBtn} onClick={addRow}>+ Add row</button>
                </div>
            )}

            <div className={styles.submitBar}>
                {status === 'loading' && <span className={styles.statusLoading}>{statusMsg}</span>}
                {status === 'ok' && <span className={styles.statusOk}>{statusMsg}</span>}
                {status === 'error' && <span className={styles.statusError}>{statusMsg}</span>}
                <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={status === 'loading' || validCount === 0}
                >
                    {status === 'loading' ? 'Saving...' : `Save ${validCount > 0 ? validCount : ''} entries`}
                </button>
            </div>
        </div>
    );
};

export default Admin;