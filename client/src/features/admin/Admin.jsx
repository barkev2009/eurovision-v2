import React, { useState, useCallback } from 'react';
import { useSetCookie } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { MAIN_ROUTE } from '../../consts';
import { useSelector } from 'react-redux';
import styles from './Admin.module.css';
import { createRecordsAPI } from './adminAPI';
import { FIRST_SEMIFINAL, SECOND_SEMIFINAL, GRAND_FINAL } from '../../enum';

const COLUMNS = ['CONTEST_STEP', 'YEAR', 'ORDER', 'COUNTRY', 'ARTIST', 'SONG', 'PLACE'];
const STEP_OPTIONS = [FIRST_SEMIFINAL, SECOND_SEMIFINAL, GRAND_FINAL];

const EMPTY_ROW = (defaults = {}) => ({
    CONTEST_STEP: defaults.CONTEST_STEP || FIRST_SEMIFINAL,
    YEAR: defaults.YEAR || new Date().getFullYear(),
    ORDER: '',
    COUNTRY: '',
    ARTIST: '',
    SONG: '',
    PLACE: '',
});

// Фикс кодировки Windows-1252 → UTF-8
// Excel при копировании TSV иногда отдаёт символы в Latin-1 байтах
// интерпретированных как UTF-8 двухбайтовыми последовательностями.
// Например: Æ (U+00C6) → Г† (0xC3 0x86 прочитанные как Latin-1 → "ГÂ†")
// Решение: декодировать через escape/unescape trick в браузере.
const fixEncoding = (str) => {
    try {
        // Попытка: интерпретировать строку как Latin-1 байты → UTF-8
        return decodeURIComponent(escape(str));
    } catch {
        return str;
    }
};

const parseTabText = (text) => {
    const rawLines = text.split('\n').map(l => l.replace(/\r$/, ''));
    const lines = rawLines.filter(l => l.trim());
    if (lines.length === 0) return { rows: [], error: '' };

    const firstLine = lines[0];
    const sep = firstLine.includes('\t') ? '\t' : ',';
    const headers = firstLine.split(sep).map(h => h.trim().toUpperCase());

    const missing = COLUMNS.filter(c => !headers.includes(c));
    if (missing.length > 0) {
        return { rows: [], error: `Не хватает колонок: ${missing.join(', ')}` };
    }

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(sep);
        if (vals.length < 2) continue;
        const row = {};
        headers.forEach((h, idx) => {
            const val = (vals[idx] || '').trim();
            row[h] = fixEncoding(val);
        });
        if (row.COUNTRY || row.ARTIST) rows.push(row);
    }

    if (rows.length === 0) return { rows: [], error: 'Нет строк с данными' };
    return { rows, error: '' };
};

const Admin = () => {
    useSetCookie();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);

    const [rows, setRows] = useState([EMPTY_ROW()]);
    const [pasteText, setPasteText] = useState('');
    const [parseError, setParseError] = useState('');
    const [showPaste, setShowPaste] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMsg, setSubmitMsg] = useState('');

    const handlePaste = useCallback((e) => {
        const text = e.target.value;
        setPasteText(text);
        if (!text.trim()) {
            setParseError('');
            return;
        }
        const { rows: parsed, error } = parseTabText(text);
        if (error) {
            setParseError(error);
        } else {
            setParseError('');
            setRows(parsed);
            setShowPaste(false);
            setSubmitStatus(null);
        }
    }, []);

    const updateCell = (rowIdx, col, value) => {
        setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [col]: value } : r));
    };

    const addRow = () => {
        const last = rows[rows.length - 1] || {};
        setRows(prev => [...prev, EMPTY_ROW({ CONTEST_STEP: last.CONTEST_STEP, YEAR: last.YEAR })]);
    };

    const clearAll = () => {
        if (window.confirm(`Удалить все ${rows.length} строк?`)) {
            setRows([EMPTY_ROW()]);
            setPasteText('');
            setSubmitStatus(null);
        }
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

    const applyToAll = (col, value) => {
        setRows(prev => prev.map(r => ({ ...r, [col]: value })));
    };

    const handleSubmit = async () => {
        const valid = rows.filter(r => r.COUNTRY && r.ARTIST && r.SONG && r.YEAR && r.ORDER);
        if (valid.length === 0) {
            setSubmitMsg('Нет валидных строк');
            setSubmitStatus('error');
            return;
        }
        setSubmitStatus('loading');
        setSubmitMsg(`Отправляю ${valid.length} записей...`);
        try {
            const resp = await createRecordsAPI({ parsedData: valid });
            if (resp.message === 'OK') {
                setSubmitStatus('ok');
                setSubmitMsg(`Готово! Добавлено ${valid.length} записей.`);
                setRows([EMPTY_ROW()]);
                setPasteText('');
            } else {
                setSubmitStatus('error');
                setSubmitMsg(resp.message || 'Ошибка сервера');
            }
        } catch (e) {
            setSubmitStatus('error');
            setSubmitMsg(e.message || 'Сетевая ошибка');
        }
    };

    const validCount = rows.filter(r => r.COUNTRY && r.ARTIST && r.SONG && r.YEAR && r.ORDER).length;

    return (
        <div className={styles.adminContainer}>

            {/* ── Top bar ── */}
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => navigate(MAIN_ROUTE + '/' + user.id)}>
                    ← Back
                </button>
                <h2 className={styles.title}>Add entries</h2>
                <button
                    className={styles.tab}
                    onClick={() => { setShowPaste(v => !v); setParseError(''); }}
                >
                    {showPaste ? 'Hide paste' : '📋 Paste from Excel'}
                </button>
            </div>

            {/* ── Paste area ── */}
            {showPaste && (
                <div className={styles.csvPane}>
                    <p className={styles.hint}>
                        Скопируй строки прямо из Excel (включая заголовок) и вставь сюда.<br />
                        Ожидаемые колонки: <code>CONTEST_STEP · YEAR · ORDER · COUNTRY · ARTIST · SONG · PLACE</code>
                    </p>
                    <textarea
                        className={styles.csvTextarea}
                        value={pasteText}
                        onChange={handlePaste}
                        placeholder={"CONTEST_STEP\tYEAR\tORDER\tCOUNTRY\tARTIST\tSONG\tPLACE\nFirst Semi-Final\t2026\t1\tIceland\t...\t...\t"}
                        spellCheck={false}
                        autoFocus
                    />
                    {parseError && <div className={styles.errorMsg}>⚠ {parseError}</div>}
                    {!parseError && pasteText && (
                        <div className={styles.parseOk}>
                            ✓ Распознано {rows.length} строк — таблица обновлена
                        </div>
                    )}
                </div>
            )}

            {/* ── Table ── */}
            <div className={styles.tablePane}>
                <div className={styles.bulkActions}>
                    <span className={styles.bulkLabel}>Применить ко всем:</span>
                    <select
                        className={styles.bulkSelect}
                        defaultValue=""
                        onChange={e => e.target.value && applyToAll('CONTEST_STEP', e.target.value)}
                    >
                        <option value="" disabled>Contest step</option>
                        {STEP_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input
                        className={styles.bulkInput}
                        type="number"
                        placeholder="Year"
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
                                            <button className={styles.dupBtn} title="Дублировать строку" onClick={() => duplicateRow(idx)}>⧉</button>
                                            <button className={styles.delBtn} title="Удалить строку" onClick={() => removeRow(idx)}>✕</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={styles.tableFooter}>
                    <button className={styles.addRowBtn} onClick={addRow}>+ Add row</button>
                    <button className={styles.clearAllBtn} onClick={clearAll}>✕ Clear all ({rows.length})</button>
                </div>
            </div>

            {/* ── Submit bar ── */}
            <div className={styles.submitBar}>
                {submitStatus === 'loading' && <span className={styles.statusLoading}>{submitMsg}</span>}
                {submitStatus === 'ok'      && <span className={styles.statusOk}>{submitMsg}</span>}
                {submitStatus === 'error'   && <span className={styles.statusError}>{submitMsg}</span>}
                <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={submitStatus === 'loading' || validCount === 0}
                >
                    {submitStatus === 'loading' ? 'Saving...' : `Save ${validCount > 0 ? validCount : ''} entries`}
                </button>
            </div>
        </div>
    );
};

export default Admin;