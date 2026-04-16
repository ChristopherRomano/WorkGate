import { useEffect, useState } from 'react';
import { createExpenseRequest, fetchExpenseRequests } from '../api/api';
import Modal from '../components/Modal';
import '../styles/components.css';
import styles from './Expenses.module.css';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  Train: '\u{1F687}',
  Hotel: '\u{1F3E8}',
  Lunch: '\u{1F37D}',
  Taxi: '\u{1F695}',
  Flight: '\u2708\uFE0F',
  Other: '\u{1F4CE}',
};

const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;
const ALLOWED_RECEIPT_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const ALLOWED_RECEIPT_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'];
const CURRENCY_SYMBOLS = { GBP: '\u00A3', USD: '$', EUR: '\u20AC' };
const CURRENCY_LABELS = { GBP: 'GBP (\u00A3)', USD: 'USD ($)', EUR: 'EUR (\u20AC)' };
const DEFAULT_PROJECT = 'CLIENT-003';
const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const isAllowedReceipt = (file) => {
  if (!file) return false;
  if (ALLOWED_RECEIPT_TYPES.includes(file.type)) return true;
  const extension = file.name.split('.').pop()?.toLowerCase();
  return !!extension && ALLOWED_RECEIPT_EXTENSIONS.includes(extension);
};

const buildInitialForm = (projectCode = DEFAULT_PROJECT) => ({
  description: '',
  amount: '',
  currency: 'GBP',
  date: '',
  project: projectCode || DEFAULT_PROJECT,
});

const getIcon = (description) => {
  const normalizedDescription = String(description ?? '');
  const key = Object.keys(ICONS).find((label) => normalizedDescription.toLowerCase().includes(label.toLowerCase()));
  return ICONS[key] || ICONS.Other;
};

const mapExpenseStatus = (status) => {
  switch (String(status ?? '').toUpperCase()) {
    case 'ACCEPTED':
    case 'RESOLVED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    case 'OPEN':
    case 'IN_PROGRESS':
    default:
      return 'pending';
  }
};

const formatDisplayDate = (timestamp) => {
  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp)) {
    return '\u2014';
  }

  const parsed = new Date(numericTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return '\u2014';
  }

  return DATE_FORMATTER.format(parsed);
};

const formatAmount = (value, currency = 'GBP') => {
  const numericValue = Number(value) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${numericValue.toFixed(2)}`;
};

const formatPendingTotal = (expenses) => {
  const totalsByCurrency = expenses.reduce((totals, expense) => {
    const currency = expense.currency || 'GBP';
    totals[currency] = (totals[currency] ?? 0) + expense.amountValue;
    return totals;
  }, {});

  const orderedCurrencies = Object.keys(totalsByCurrency).sort((left, right) => {
    const currencyOrder = ['GBP', 'USD', 'EUR'];
    const leftIndex = currencyOrder.indexOf(left);
    const rightIndex = currencyOrder.indexOf(right);
    const normalizedLeftIndex = leftIndex === -1 ? currencyOrder.length : leftIndex;
    const normalizedRightIndex = rightIndex === -1 ? currencyOrder.length : rightIndex;
    return normalizedLeftIndex - normalizedRightIndex || left.localeCompare(right);
  });

  if (!orderedCurrencies.length) {
    return formatAmount(0, 'GBP');
  }

  return orderedCurrencies
    .map((currency) => formatAmount(totalsByCurrency[currency], currency))
    .join(' / ');
};

const mapExpenseRequest = (expenseRequest, fallbackProject) => {
  const amountValue = Number(expenseRequest?.amount) || 0;
  const currency = expenseRequest?.currency ?? 'GBP';
  const createdAt = Number(expenseRequest?.creationTime) || 0;

  return {
    id: expenseRequest?.id ?? `expense-${createdAt || Date.now()}`,
    description: expenseRequest?.reason ?? 'Expense',
    date: formatDisplayDate(createdAt),
    project: expenseRequest?.project ?? fallbackProject ?? '\u2014',
    amount: formatAmount(amountValue, currency),
    amountValue,
    currency,
    status: mapExpenseStatus(expenseRequest?.status),
    createdAt,
  };
};

export default function Expenses() {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email ?? currentUser?.username ?? '';
  const projectCode = currentUser?.clientCode || DEFAULT_PROJECT;
  const projectOptions = [...new Set([projectCode, DEFAULT_PROJECT, 'CLIENT-001', 'INTERNAL'].filter(Boolean))];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(() => buildInitialForm(projectCode));
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptError, setReceiptError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadExpenses = async () => {
    if (!userEmail) {
      setItems([]);
      setLoadError('');
      return;
    }

    setLoading(true);
    setLoadError('');

    try {
      const expenseRequests = await fetchExpenseRequests(userEmail);
      const formattedExpenses = Array.isArray(expenseRequests)
        ? expenseRequests
            .map((expenseRequest) => mapExpenseRequest(expenseRequest, projectCode))
            .sort((left, right) => right.createdAt - left.createdAt)
        : [];

      setItems(formattedExpenses);
    } catch (error) {
      console.error(error);
      setItems([]);
      setLoadError('Unable to load your expense claims right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [userEmail, projectCode]);

  useEffect(() => {
    setForm((currentForm) => {
      if (currentForm.project && currentForm.project !== DEFAULT_PROJECT) {
        return currentForm;
      }

      return { ...currentForm, project: projectCode };
    });
  }, [projectCode]);

  const submit = async () => {
    if (!form.description || !form.amount || !receiptFile) {
      if (!receiptFile) {
        setReceiptError('Please attach a receipt file.');
      }
      return;
    }

    if (!userEmail) {
      setSubmitError('You must be signed in to submit an expense claim.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const purchaseDate = form.date ? new Date(`${form.date}T00:00:00`).getTime() : Date.now();

    try {
      await createExpenseRequest({
        username: userEmail,
        amount: parseFloat(form.amount),
        purchaseDate,
        currency: form.currency,
        reason: form.description,
        evidence: receiptFile.name,
      });

      setShowModal(false);
      setForm(buildInitialForm(projectCode));
      setReceiptFile(null);
      setReceiptError('');

      await loadExpenses();
    } catch (error) {
      console.error(error);
      setSubmitError('Unable to submit your expense claim right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const onReceiptChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setReceiptFile(null);
      setReceiptError('');
      return;
    }

    if (!isAllowedReceipt(file)) {
      setReceiptFile(null);
      setReceiptError('Invalid file type. Allowed: PDF, PNG, JPG, JPEG.');
      return;
    }

    if (file.size > MAX_RECEIPT_SIZE) {
      setReceiptFile(null);
      setReceiptError('File is too large. Maximum size is 10MB.');
      return;
    }

    setReceiptFile(file);
    setReceiptError('');
  };

  const pending = items.filter((expense) => expense.status === 'pending');
  const pendingTotal = formatPendingTotal(pending);

  return (
    <div className="animate-fade">
      <div className={styles.statsGrid}>
        {[
          { icon: '\u23F3', val: pending.length, label: 'Pending claims' },
          { icon: '\u{1F4B0}', val: pendingTotal, label: 'Pending total', highlight: true },
          { icon: '\u2705', val: items.filter((expense) => expense.status === 'approved').length, label: 'Paid claims' },
        ].map(({ icon, val, label, highlight }) => (
          <div key={label} className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statVal}>{val}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Claims</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + New Claim
          </button>
        </div>

        {loadError && (
          <div style={{ color: 'var(--danger)', padding: '0 16px 16px' }}>
            {loadError}
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Description</th>
                <th>Date</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 16px' }}>
                    No claims found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px 16px' }}>
                    Loading claims...
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((expense) => (
                  <tr key={expense.id}>
                    <td className={styles.iconCell}>{getIcon(expense.description)}</td>
                    <td>
                      <strong>{expense.description}</strong>
                    </td>
                    <td>{expense.date}</td>
                    <td className={styles.projectCell}>{expense.project}</td>
                    <td>
                      <strong className={styles.amountCell}>{expense.amount}</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${expense.status}`}>{expense.status.toUpperCase()}</span>
                    </td>
                    <td>
                      {expense.status === 'pending' ? (
                        <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>Awaiting review</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{'\u2014'}</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Expense Claim">
        <div className="form-grid">
          <div className="form-group">
            <label>Description</label>
            <input
              className="field"
              placeholder="e.g. Train - London to Manchester"
              value={form.description}
              onChange={(event) => setForm((currentForm) => ({ ...currentForm, description: event.target.value }))}
            />
          </div>

          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Amount</label>
              <input
                className="field"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, amount: event.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Currency</label>
              <select
                className="field"
                value={form.currency}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, currency: event.target.value }))}
              >
                {Object.entries(CURRENCY_LABELS).map(([currencyCode, label]) => (
                  <option key={currencyCode} value={currencyCode}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Date</label>
              <input
                className="field"
                type="date"
                value={form.date}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, date: event.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Project Code</label>
              <select
                className="field"
                value={form.project}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, project: event.target.value }))}
              >
                {projectOptions.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Receipt</label>
            <div className="upload-zone">
              <label htmlFor="expense-receipt" style={{ display: 'block', cursor: 'pointer' }}>
                <div className="upload-zone-icon">{'\u{1F4CE}'}</div>
                <div className="upload-zone-label">Click to upload receipt</div>
                <div className="upload-zone-sub">PDF, PNG, JPG, JPEG - max 10MB</div>
                <input
                  id="expense-receipt"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  onChange={onReceiptChange}
                  style={{ display: 'none' }}
                />
              </label>

              {receiptFile && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text)' }}>
                  Selected: <strong>{receiptFile.name}</strong>
                </div>
              )}

              {receiptError && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--danger)' }}>{receiptError}</div>
              )}
            </div>
          </div>

          {submitError && (
            <div style={{ color: 'var(--danger)', fontSize: 12 }}>
              {submitError}
            </div>
          )}

          <div className="modal-actions">
            <button className="btn btn-primary" onClick={submit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
