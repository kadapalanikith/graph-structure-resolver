import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

// small inline SVGs — keeping them here instead of a separate file since
// there are only three and they're tiny
function GraphIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="6" cy="12" r="2" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="18" cy="18" r="2" />
            <line x1="8" y1="11" x2="16" y2="7" />
            <line x1="8" y1="13" x2="16" y2="17" />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg
            className="alert-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

function CycleIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <polyline points="1 4 1 10 7 10" />
            <polyline points="23 20 23 14 17 14" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
    );
}

// recursive component that renders a node and its children as an indented tree
function TreeNode({ name, children }) {
    const childKeys = Object.keys(children);

    return (
        <div className="tree-node">
            <div className="tree-node-content">
                <span className="node-chip">{name}</span>
            </div>
            {childKeys.length > 0 && (
                <div className="tree-children">
                    {childKeys.map(key => (
                        <TreeNode key={key} name={key} children={children[key]} />
                    ))}
                </div>
            )}
        </div>
    );
}

// the sample from the spec — useful as a default so people can hit
// "Analyse" immediately and see how it works
const SAMPLE_INPUT = `[
  "A->B", "A->C", "B->D", "C->E", "E->F",
  "X->Y", "Y->Z", "Z->X",
  "P->Q", "Q->R",
  "G->H", "G->H", "G->I",
  "hello", "1->2", "A->"
]`;

export default function App() {
    const [input, setInput]       = useState(SAMPLE_INPUT);
    const [result, setResult]     = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading]   = useState(false);

    function resetForm() {
        setInput(SAMPLE_INPUT);
        setResult(null);
        setErrorMsg('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg('');
        setResult(null);
        setLoading(true);

        try {
            let parsed;

            // try to parse the textarea content as JSON before hitting the network
            try {
                parsed = JSON.parse(input);
                if (!Array.isArray(parsed)) {
                    throw new Error('expected a JSON array, not an object or primitive');
                }
            } catch (parseErr) {
                throw new Error('Invalid JSON — ' + parseErr.message);
            }

            const api = import.meta.env.VITE_API_URL || 'http://localhost:5000/bfhl';
            const { data } = await axios.post(api, { data: parsed });
            setResult(data);
        } catch (err) {
            if (err.response) {
                setErrorMsg(err.response.data?.error || 'The server returned an error.');
            } else {
                setErrorMsg(err.message || 'Could not reach the server. Is the backend running?');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-wrapper">
            <header className="site-header">
                <div className="container">
                    <div className="header-icon">
                        <GraphIcon />
                    </div>
                    <span className="header-title">BFHL Graph Analyzer</span>
                    <span className="header-badge">SRM Challenge · Round 1</span>
                </div>
            </header>

            <main className="main-content">
                <div className="container">
                    <div className="hero">
                        <h1 className="hero-title">Hierarchical Graph Processor</h1>
                        <p className="hero-subtitle">
                            Submit a list of node edges to analyse tree structures and detect cycles
                        </p>
                    </div>

                    {/* input section */}
                    <div className="card">
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label className="form-label" htmlFor="data-input">
                                    Data Payload
                                    <span className="form-label-hint">JSON array of strings</span>
                                </label>
                                <textarea
                                    id="data-input"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder='["A->B", "A->C", "B->D"]'
                                    spellCheck="false"
                                    autoComplete="off"
                                    rows={8}
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    id="btn-submit"
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? <><span className="spinner" aria-hidden="true" /> Processing…</>
                                        : 'Analyse'
                                    }
                                </button>
                                <button
                                    id="btn-reset"
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={resetForm}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* error state */}
                    {errorMsg && (
                        <div className="alert alert-error" role="alert" aria-live="assertive">
                            <AlertIcon />
                            <div>
                                <strong>Error</strong>
                                {errorMsg}
                            </div>
                        </div>
                    )}

                    {/* results — only shown after a successful response */}
                    {result && (
                        <>
                            <div className="meta-grid">
                                {/* identity card */}
                                <div className="meta-box">
                                    <p className="meta-box-title">Identity</p>
                                    <div className="kv-row">
                                        <span className="kv-key">User ID</span>
                                        <span className="kv-value">{result.user_id}</span>
                                    </div>
                                    <div className="kv-row">
                                        <span className="kv-key">Email</span>
                                        <span className="kv-value">{result.email_id}</span>
                                    </div>
                                    <div className="kv-row">
                                        <span className="kv-key">Roll No.</span>
                                        <span className="kv-value">{result.college_roll_number}</span>
                                    </div>
                                </div>

                                {/* summary card */}
                                <div className="meta-box">
                                    <p className="meta-box-title">Summary</p>
                                    <div className="stat-row">
                                        <span className="stat-pill stat-pill-success">
                                            <span className="stat-dot stat-dot-success" />
                                            {result.summary.total_trees} tree{result.summary.total_trees !== 1 ? 's' : ''}
                                        </span>
                                        <span className="stat-pill stat-pill-warning">
                                            <span className="stat-dot stat-dot-warning" />
                                            {result.summary.total_cycles} cycle{result.summary.total_cycles !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    {result.summary.largest_tree_root && (
                                        <div className="kv-row" style={{ marginTop: '0.75rem', borderBottom: 'none' }}>
                                            <span className="kv-key">Deepest root</span>
                                            <span className="kv-value">{result.summary.largest_tree_root}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* hierarchies */}
                            <div className="card">
                                <p className="section-heading">
                                    Hierarchies ({result.hierarchies.length})
                                </p>

                                {result.hierarchies.length === 0 ? (
                                    <p className="empty-note">No valid structures generated.</p>
                                ) : (
                                    <div className="hierarchy-grid">
                                        {result.hierarchies.map((h, i) => (
                                            <div key={i} className="hierarchy-card">
                                                <div className="hierarchy-card-header">
                                                    <span className="hierarchy-root-label">
                                                        Root&nbsp;
                                                        <span className="root-node">{h.root}</span>
                                                    </span>
                                                    {h.has_cycle
                                                        ? <span className="badge badge-danger"><CycleIcon /> Cycle</span>
                                                        : <span className="badge badge-success">Depth {h.depth}</span>
                                                    }
                                                </div>

                                                <div className="hierarchy-card-body">
                                                    {h.has_cycle ? (
                                                        <span className="cycle-note">
                                                            <CycleIcon />
                                                            Cyclic group — no tree structure
                                                        </span>
                                                    ) : (
                                                        <div className="tree-wrap">
                                                            {Object.keys(h.tree).map(key => (
                                                                <TreeNode
                                                                    key={key}
                                                                    name={key}
                                                                    children={h.tree[key]}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* invalid entries + duplicate edges side by side */}
                            <div className="meta-grid">
                                <div className="meta-box">
                                    <p className="meta-box-title">
                                        Invalid Entries ({result.invalid_entries.length})
                                    </p>
                                    {result.invalid_entries.length > 0 ? (
                                        <div className="tag-list">
                                            {result.invalid_entries.map((entry, i) => (
                                                <span key={i} className="tag tag-danger">
                                                    {entry || '""'}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="empty-note">None detected.</p>
                                    )}
                                </div>

                                <div className="meta-box">
                                    <p className="meta-box-title">
                                        Duplicate Edges ({result.duplicate_edges.length})
                                    </p>
                                    {result.duplicate_edges.length > 0 ? (
                                        <div className="tag-list">
                                            {result.duplicate_edges.map((edge, i) => (
                                                <span key={i} className="tag tag-warning">{edge}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="empty-note">None detected.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <footer className="site-footer">
                SRM Full Stack Engineering Challenge — Round 1 &nbsp;·&nbsp; kadapalavenkatanikithreddy_11012006
            </footer>
        </div>
    );
}
