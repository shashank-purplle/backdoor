import { useState, useCallback } from "react";

// ── Icons ────────────────────────────────────────────────────────────────────
const Upload = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const Play = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const Check = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>;
const Xmark = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const Download = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const History = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" /></svg>;

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  blue: '#2563eb',
  green: '#059669',
  amber: '#d97706',
  red: '#dc2626',
  purple: '#7c3aed',
  slate: '#64748b',
  border: '#e2e8f0',
  bg: '#f1f5f9',
  card: '#ffffff',
};

const USER_COLOR = {
  Shibayan: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  Akash: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  Pranay: { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
  Pramit: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
};

const CHANNEL_COLOR = {
  'online-purplle NR': { bg: '#dbeafe', color: '#1e40af' },
  'online-purplle R': { bg: '#ede9fe', color: '#5b21b6' },
  'online-purplle R NR': { bg: '#e0e7ff', color: '#3730a3' },
  'online-purplle': { bg: '#dbeafe', color: '#1e40af' },
  'CPG': { bg: '#fce7f3', color: '#be185d' },
  'retail-stores': { bg: '#d1fae5', color: '#065f46' },
  '—': { bg: '#f1f5f9', color: '#475569' },
};

// ── Small reusable atoms ───────────────────────────────────────────────────────
function Badge({ label, style }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: 10, fontWeight: 600,
      padding: '2px 7px', borderRadius: 99, lineHeight: 1.6, ...style
    }}>
      {label}
    </span>
  );
}

function TableTag({ name }) {
  return (
    <span style={{
      fontSize: 10, padding: '1px 5px', borderRadius: 4,
      background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0',
      fontFamily: 'monospace', lineHeight: 1.6
    }}>
      {name}
    </span>
  );
}

function RunStatus({ status }) {
  const map = {
    idle: { bg: '#f1f5f9', color: '#64748b', label: 'Idle' },
    running: { bg: '#fef3c7', color: '#d97706', label: 'Running…' },
    success: { bg: '#d1fae5', color: '#059669', label: 'Success' },
    fail: { bg: '#fee2e2', color: '#dc2626', label: 'Failed' },
  };
  const s = map[status] || map.idle;
  return <Badge label={s.label} style={{ background: s.bg, color: s.color }} />;
}

// ── Pipeline Stepper ───────────────────────────────────────────────────────────
function Stepper({ steps, currentStep, status }) {
  return (
    <div style={{ marginTop: 6 }}>
      {steps.map((step, i) => {
        const done = status !== 'idle' && i < currentStep;
        const active = status === 'running' && i === currentStep;
        const failed = status === 'fail' && i === currentStep;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 20 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? C.green : active ? C.amber : failed ? C.red : '#e2e8f0',
                color: '#fff', boxShadow: active ? '0 0 0 3px #fef3c7' : 'none',
                transition: 'all 0.3s',
              }}>
                {done ? <Check /> :
                  failed ? <Xmark /> :
                    active ? <span style={{ fontSize: 9, fontWeight: 700 }}>●</span> :
                      <span style={{ fontSize: 9, color: '#94a3b8' }}>○</span>}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, flexGrow: 1, minHeight: 12, background: done ? C.green : C.border, transition: 'background 0.3s' }} />
              )}
            </div>
            <div style={{
              fontSize: 11, paddingTop: 3,
              paddingBottom: i < steps.length - 1 ? 9 : 0,
              color: (done || active) ? '#0f172a' : '#94a3b8',
              fontWeight: active ? 600 : 400, transition: 'color 0.3s',
            }}>{step}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── File Upload ────────────────────────────────────────────────────────────────
function FileUpload({ file, onFile, onClear }) {
  const ref = { current: null };
  if (file) return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
      background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6
    }}>
      <div style={{ flex: 1, fontSize: 11, color: '#334155' }}>
        {file.name} <span style={{ color: '#94a3b8' }}>({(file.size / 1024).toFixed(0)} KB)</span>
      </div>
      <button onClick={onClear} style={{ padding: 3, background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><Xmark /></button>
    </div>
  );
  return (
    <div onClick={() => ref.current?.click()} style={{
      border: '2px dashed #cbd5e1', borderRadius: 6,
      padding: '12px 16px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc'
    }}>
      <input ref={r => ref.current = r} type="file" accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }} onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
      <Upload />
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Click to upload Excel / CSV</div>
    </div>
  );
}

// ── Flow Card ─────────────────────────────────────────────────────────────────
function FlowCard({ flow, onRunComplete }) {
  const { name, useCase, channel, allowedUser, affectedTables, steps, needsFile, showTemplate } = flow;
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState(0);

  const canTrigger = (needsFile ? !!file : true) && status !== 'running';

  const trigger = () => {
    if (!canTrigger) return;
    const startedAt = new Date();
    setStatus('running');
    setCurrentStep(0);
    setErrors(0);

    let step = 0;
    const go = () => {
      step++;
      if (step >= steps.length) {
        const ok = Math.random() > 0.25;
        const finalErrors = ok ? 0 : Math.floor(Math.random() * 5) + 1;
        setStatus(ok ? 'success' : 'fail');
        setErrors(finalErrors);
        onRunComplete({
          id: Date.now(),
          name,
          type: 'Flow',
          channel,
          allowedUser,
          startedAt,
          endedAt: new Date(),
          status: ok ? 'success' : 'fail',
          errors: finalErrors,
          steps,
        });
      } else {
        setCurrentStep(step);
        setTimeout(go, 1300);
      }
    };
    setTimeout(go, 1300);
  };

  const reset = () => { setFile(null); setStatus('idle'); setCurrentStep(0); setErrors(0); };

  const uc = USER_COLOR[allowedUser] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
  const cc = CHANNEL_COLOR[channel] || CHANNEL_COLOR['—'];

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, background: C.card, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2, lineHeight: 1.3 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{useCase}</div>
        </div>
        <RunStatus status={status} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        <Badge label={`👤 ${allowedUser}`} style={{ background: uc.bg, color: uc.color, border: `1px solid ${uc.border}` }} />
        <Badge label={channel} style={{ background: cc.bg, color: cc.color }} />
        {(affectedTables || []).map(t => <TableTag key={t} name={t} />)}
      </div>

      <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', marginBottom: 10, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>Pipeline Steps</div>
        <Stepper steps={steps} currentStep={currentStep} status={status} />
      </div>

      {showTemplate && (
        <button style={{
          width: '100%', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          padding: '7px', background: '#fff', border: `1px solid ${C.blue}`, borderRadius: 6, fontSize: 11, fontWeight: 600, color: C.blue, cursor: 'pointer'
        }}>
          <Download /> Download Template
        </button>
      )}

      {needsFile && <FileUpload file={file} onFile={setFile} onClear={reset} />}

      {status === 'fail' && errors > 0 && (
        <div style={{ marginTop: 8, padding: '8px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11 }}>
          <span style={{ fontWeight: 600, color: C.red }}>{errors} validation {errors === 1 ? 'error' : 'errors'} found</span>
          <button style={{ marginLeft: 10, fontSize: 10, padding: '2px 6px', background: '#fff', border: '1px solid #dc2626', borderRadius: 4, color: C.red, cursor: 'pointer' }}>
            <Download /> annotated file
          </button>
        </div>
      )}
      {status === 'success' && (
        <div style={{ marginTop: 8, padding: '6px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 11, color: C.green, fontWeight: 600 }}>
          ✓ Flow completed successfully
        </div>
      )}

      <button onClick={trigger} disabled={!canTrigger}
        style={{
          marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '9px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 700,
          cursor: canTrigger ? 'pointer' : 'not-allowed',
          background: !canTrigger ? '#f1f5f9' : C.blue,
          color: !canTrigger ? '#94a3b8' : '#fff', transition: 'background 0.2s'
        }}>
        <Play /> {status === 'running' ? 'Running…' : 'Trigger Flow'}
      </button>
    </div>
  );
}

// ── Base Table Card ────────────────────────────────────────────────────────────
function BaseTableCard({ name, description, affectedTables, channel, allowedUser, steps, onRunComplete }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const upload = () => {
    if (!file) return;
    const startedAt = new Date();
    setStatus('running');
    setCurrentStep(0);
    let step = 0;
    const go = () => {
      step++;
      if (step >= steps.length) {
        const ok = Math.random() > 0.25;
        const finalErrors = ok ? 0 : Math.floor(Math.random() * 8) + 1;
        setStatus(ok ? 'success' : 'fail');
        setErrors(finalErrors);
        onRunComplete({
          id: Date.now(),
          name,
          type: 'Base Table',
          channel,
          allowedUser,
          startedAt,
          endedAt: new Date(),
          status: ok ? 'success' : 'fail',
          errors: finalErrors,
          steps,
        });
      } else {
        setCurrentStep(step);
        setTimeout(go, 1100);
      }
    };
    setTimeout(go, 1100);
  };

  const reset = () => { setFile(null); setStatus('idle'); setCurrentStep(0); setErrors(0); };

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, background: C.card }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{description}</div>
        </div>
        <RunStatus status={status} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        <Badge label={`👤 ${allowedUser}`} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }} />
        <Badge label={channel} style={{ background: '#e2e8f0', color: '#334155' }} />
        {(affectedTables || []).map(t => <TableTag key={t} name={t} />)}
      </div>

      <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', marginBottom: 10, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>Pipeline Steps</div>
        <Stepper steps={steps} currentStep={currentStep} status={status} />
      </div>

      <button style={{
        width: '100%', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        padding: '7px', background: '#fff', border: `1px solid ${C.green}`, borderRadius: 6, fontSize: 11, fontWeight: 600, color: C.green, cursor: 'pointer'
      }}>
        <Download /> Download Template
      </button>

      <FileUpload file={file} onFile={setFile} onClear={reset} />

      {status === 'fail' && errors > 0 && (
        <div style={{ marginTop: 8, padding: '8px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 11 }}>
          <span style={{ fontWeight: 600, color: C.red }}>{errors} rows failed validation</span>
          <button style={{ marginLeft: 10, fontSize: 10, padding: '2px 6px', background: '#fff', border: '1px solid #dc2626', borderRadius: 4, color: C.red, cursor: 'pointer' }}>
            <Download /> error report
          </button>
        </div>
      )}
      {status === 'success' && (
        <div style={{ marginTop: 8, padding: '6px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 11, color: C.green, fontWeight: 600 }}>
          ✓ Pushed to {(affectedTables || []).join(', ')}
        </div>
      )}

      <button onClick={upload} disabled={!file || status === 'running'}
        style={{
          marginTop: 10, width: '100%', padding: '9px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 700,
          cursor: !file || status === 'running' ? 'not-allowed' : 'pointer',
          background: !file || status === 'running' ? '#f1f5f9' : C.green,
          color: !file || status === 'running' ? '#94a3b8' : '#fff'
        }}>
        {status === 'running' ? 'Processing…' : 'Upload & Process'}
      </button>
    </div>
  );
}

// ── Historical Run Row ─────────────────────────────────────────────────────────
function RunRow({ run }) {
  const [expanded, setExpanded] = useState(false);
  const duration = Math.round((run.endedAt - run.startedAt) / 1000);
  const timeStr = run.startedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const uc = USER_COLOR[run.allowedUser] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
  const cc = CHANNEL_COLOR[run.channel] || CHANNEL_COLOR['—'];

  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <div onClick={() => setExpanded(e => !e)} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', cursor: 'pointer', background: expanded ? '#f8fafc' : 'transparent',
        transition: 'background 0.15s'
      }}>

        {/* status dot */}
        <div style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: run.status === 'success' ? C.green : C.red
        }} />

        {/* name + type */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{run.name}</span>
          <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 6 }}>{run.type}</span>
        </div>

        {/* badges */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
          <Badge label={`👤 ${run.allowedUser}`} style={{ background: uc.bg, color: uc.color, border: `1px solid ${uc.border}` }} />
          <Badge label={run.channel} style={{ background: cc.bg, color: cc.color }} />
        </div>

        {/* time + duration */}
        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', flexShrink: 0, minWidth: 90 }}>
          <div>{timeStr}</div>
          <div>{duration}s</div>
        </div>

        {/* status */}
        <RunStatus status={run.status} />

        {/* chevron */}
        <span style={{ fontSize: 10, color: '#94a3b8', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▶</span>
      </div>

      {expanded && (
        <div style={{ padding: '10px 14px 14px 32px', background: '#f8fafc' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>Pipeline Steps</div>
          {run.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ color: C.green }}><Check /></span>
              <span style={{
                fontSize: 11, color: i < run.steps.length - 1 ? '#334155' : run.status === 'fail' ? C.red : '#334155',
                fontWeight: i === run.steps.length - 1 && run.status === 'fail' ? 600 : 400
              }}>{step}</span>
            </div>
          ))}
          {run.errors > 0 && (
            <div style={{ marginTop: 8, fontSize: 11, color: C.red, fontWeight: 600 }}>
              ⚠ {run.errors} {run.errors === 1 ? 'error' : 'errors'} encountered
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── RBAC Flow Data ────────────────────────────────────────────────────────────
const FLOW_GROUPS = [
  {
    user: 'Shibayan',
    flows: [
      {
        name: 'Demand Update — NR', useCase: 'National Demand Update (partial/complete months) — Non-Retail', channel: 'online-purplle NR', allowedUser: 'Shibayan', affectedTables: ['dp_projections', 'dp_fulcrum'], needsFile: true, showTemplate: true,
        steps: ['Input validated (MPC-National qty)', 'National demand uploaded', 'Regionalization Script triggered', 'Day Phasing Script triggered', 'dp_projections updated', 'dp_fulcrum updated']
      },
      {
        name: 'Demand Update — R', useCase: 'National Demand Update (partial/complete months) — Retail', channel: 'online-purplle R', allowedUser: 'Shibayan', affectedTables: ['dp_projections', 'dp_fulcrum'], needsFile: true, showTemplate: true,
        steps: ['Input validated (MPC-National qty)', 'National demand uploaded', 'Regionalization Script triggered', 'Day Phasing Script triggered', 'dp_projections updated', 'dp_fulcrum updated']
      },
      {
        name: 'Assortment Addition (Non-NPD)', useCase: 'Add given MPC to assortment — non-new product', channel: 'online-purplle R NR', allowedUser: 'Shibayan', affectedTables: ['assortment', 'dp_projections', 'dp_fulcrum'], needsFile: true, showTemplate: true,
        steps: ['Input validated (MPC list)', 'Assortment Rerun triggered', 'In-scope MPCs resolved', 'National forward projections fetched', 'Regionalization Script triggered', 'Day Phasing Script triggered', 'dp_projections updated', 'dp_fulcrum updated']
      },
      {
        name: 'Assortment Addition (NPD)', useCase: 'Add given MPC to assortment — new product with demand input', channel: 'online-purplle R NR', allowedUser: 'Shibayan', affectedTables: ['assortment', 'dp_projections', 'dp_fulcrum'], needsFile: true, showTemplate: true,
        steps: ['Input validated (MPC-National qty)', 'Assortment Rerun triggered', 'In-scope MPCs resolved', 'NPD Regionalization Script triggered', 'Day Phasing Script triggered', 'dp_projections updated', 'dp_fulcrum updated']
      },
      {
        name: 'Refresh MDQ', useCase: 'Refresh dp_mdq using DRR and class data', channel: 'online-purplle', allowedUser: 'Shibayan', affectedTables: ['dp_mdq'], needsFile: false, showTemplate: false,
        steps: ['MDQ Refresh Script triggered', 'dp_mdq updated', 'Redistribution triggered for affected MPCs']
      },
    ],
  },
  {
    user: 'Akash',
    flows: [
      {
        name: 'Dark Store Demand Allocation', useCase: 'Allocate demand to new Dark Stores via pincode/WH remapping', channel: 'online-purplle R NR', allowedUser: 'Akash', affectedTables: ['assortment', 'dp_projections', 'dp_fulcrum', 'dp_class', 'dp_mdq'], needsFile: true, showTemplate: true,
        steps: ['Input validated (Pincodes + WH mappings)', 'Assortment Rerun triggered', 'Regionalization Script triggered', 'Day Phasing Script triggered', 'dp_class refresh triggered', 'dp_mdq updated']
      },
      {
        name: 'Dark Store MDQ Refresh', useCase: 'Refresh class and MDQ for new Dark Stores', channel: '—', allowedUser: 'Akash', affectedTables: ['dp_class', 'dp_mdq'], needsFile: true, showTemplate: false,
        steps: ['Input validated (Class-wise DS MDQ)', 'WH-Pincode mappings verified', 'Class assignment Script triggered', 'dp_class updated', 'dp_mdq updated']
      },
    ],
  },
  {
    user: 'Pranay',
    flows: [
      {
        name: 'CPG Demand Update — WH-wise', useCase: 'Warehouse-wise Demand Update for CPG', channel: 'CPG', allowedUser: 'Pranay', affectedTables: ['dp_projections', 'dp_fulcrum'], needsFile: true, showTemplate: true,
        steps: ['Input validated (MPC-WH qty)', 'WH-wise demand uploaded', 'Day Phasing Script triggered', 'dp_projections updated', 'dp_fulcrum updated']
      },
      {
        name: 'CPG Demand Update — National', useCase: 'National Demand Update for CPG', channel: 'CPG', allowedUser: 'Pranay', affectedTables: ['dp_projections', 'dp_fulcrum'], needsFile: true, showTemplate: true,
        steps: ['Input validated (MPC-National qty)', 'National demand uploaded', 'Regionalization Script triggered', 'Day Phasing Script triggered', 'dp_projections updated', 'dp_fulcrum updated']
      },
    ],
  },
  {
    user: 'Pramit',
    flows: [
      {
        name: 'Stores Demand Update — WH-wise', useCase: 'Warehouse-wise Demand Update for Retail Stores', channel: 'retail-stores', allowedUser: 'Pramit', affectedTables: ['dp_projections', 'dp_fulcrum'], needsFile: true, showTemplate: true,
        steps: ['Input validated (MPC-WH qty)', 'WH-wise demand uploaded', 'Day Phasing Script triggered', 'dp_projections updated', 'dp_fulcrum updated']
      },
      {
        name: 'Stores Demand Update — National', useCase: 'National Demand Update for Retail Stores', channel: 'retail-stores', allowedUser: 'Pramit', affectedTables: ['dp_projections', 'dp_fulcrum'], needsFile: true, showTemplate: true,
        steps: ['Input validated (MPC-National qty)', 'National demand uploaded', 'Regionalization & Day Phasing Scripts triggered', 'Assortment rerun for specific WH', 'Redistribution triggered (relevant WH cluster)', 'dp_projections updated', 'dp_fulcrum updated']
      },
    ],
  },
];

const BASE_TABLES = [
  {
    name: 'Update MDQ', description: 'Direct MDQ update for online-purplle & retail', affectedTables: ['dp_mdq'], channel: 'online-purplle & retail-stores', allowedUser: 'all',
    steps: ['Input validated (MPC-WH MDQ)', 'Rows upserted to dp_mdq']
  },
  {
    name: 'Update Class', description: 'Direct class update for retail-stores and CPG', affectedTables: ['dp_class'], channel: 'retail-stores, CPG', allowedUser: 'all',
    steps: ['Input validated (MPC-WH Class)', 'Rows upserted to dp_class']
  },
  {
    name: 'Update DP_FULCRUM', description: 'Direct dp_fulcrum update across all channels', affectedTables: ['dp_fulcrum'], channel: 'all', allowedUser: 'all',
    steps: ['Input validated (MPC-WH-Date NR R Qty)', 'Rows upserted to dp_fulcrum']
  },
];

// ── User Section ──────────────────────────────────────────────────────────────
function UserSection({ user, flows, onRunComplete }) {
  const uc = USER_COLOR[user] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: uc.color }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: uc.color }}>{user}</span>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>— {flows.length} flow{flows.length > 1 ? 's' : ''}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {flows.map((flow, i) => <FlowCard key={i} flow={flow} onRunComplete={onRunComplete} />)}
      </div>
    </div>
  );
}

// ── Historical Runs Tab ───────────────────────────────────────────────────────
function HistoryTab({ runs, onClear }) {
  const success = runs.filter(r => r.status === 'success').length;
  const failed = runs.filter(r => r.status === 'fail').length;

  return (
    <div>
      {/* summary strip */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ padding: '8px 14px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{runs.length}</span>
          <span style={{ color: '#94a3b8', marginLeft: 5 }}>total runs</span>
        </div>
        <div style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: C.green }}>{success}</span>
          <span style={{ color: '#64748b', marginLeft: 5 }}>succeeded</span>
        </div>
        <div style={{ padding: '8px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: C.red }}>{failed}</span>
          <span style={{ color: '#64748b', marginLeft: 5 }}>failed</span>
        </div>
        {runs.length > 0 && (
          <button onClick={onClear} style={{
            marginLeft: 'auto', fontSize: 11, padding: '6px 12px', background: '#fff',
            border: `1px solid ${C.border}`, borderRadius: 6, color: '#64748b', cursor: 'pointer'
          }}>
            Clear History
          </button>
        )}
      </div>

      {runs.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8' }}>
          <History />
          <div style={{ fontSize: 13, marginTop: 10, fontWeight: 500 }}>No runs yet</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>Trigger a flow or upload a base table file to see runs here.</div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
          {/* header row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
            background: '#f8fafc', borderBottom: `1px solid ${C.border}`
          }}>
            <div style={{ width: 8, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Flow / Table</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 180 }}>Owner · Channel</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 90, textAlign: 'right' }}>Time · Dur.</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 60 }}>Status</div>
            <div style={{ width: 12, flexShrink: 0 }} />
          </div>
          {/* runs newest-first */}
          {[...runs].reverse().map(run => <RunRow key={run.id} run={run} />)}
        </div>
      )}
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('flows');
  const [runs, setRuns] = useState([]);

  const onRunComplete = useCallback((run) => {
    setRuns(prev => [...prev, run]);
  }, []);

  const tabStyle = (t, color) => ({
    padding: '9px 18px', background: 'none', border: 'none', cursor: 'pointer',
    borderBottom: tab === t ? `2px solid ${color}` : '2px solid transparent',
    fontSize: 13, fontWeight: 700,
    color: tab === t ? color : '#94a3b8',
    marginBottom: -2, transition: 'color 0.2s',
    display: 'flex', alignItems: 'center', gap: 6,
  });

  return (
    /* Full-page centering wrapper */
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', justifyContent: 'center', padding: '24px 16px', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Fulcrum Admin Panel
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
            Data pipeline management · RBAC-controlled flows
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, borderBottom: `2px solid ${C.border}`, marginBottom: 24 }}>
          <button style={tabStyle('flows', C.blue)} onClick={() => setTab('flows')}>
            Flow Triggers
          </button>
          <button style={tabStyle('tables', C.green)} onClick={() => setTab('tables')}>
            Base Table Updates
          </button>
          <button style={tabStyle('history', C.purple)} onClick={() => setTab('history')}>
            <History />
            Run History
            {runs.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, background: C.purple, color: '#fff',
                borderRadius: 99, padding: '1px 6px', minWidth: 18, textAlign: 'center'
              }}>
                {runs.length}
              </span>
            )}
          </button>
        </div>

        {/* Flows Tab */}
        {tab === 'flows' && (
          <div>
            <div style={{ marginBottom: 20, padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1e40af', marginBottom: 2 }}>Flow Triggers with Pipeline Monitoring</div>
              <div style={{ fontSize: 11, color: '#3b82f6' }}>Each flow shows its full pipeline. Upload an input file (if required) and trigger to animate execution step-by-step. Completed runs are logged in Run History.</div>
            </div>
            {FLOW_GROUPS.map(g => <UserSection key={g.user} user={g.user} flows={g.flows} onRunComplete={onRunComplete} />)}
          </div>
        )}

        {/* Base Tables Tab */}
        {tab === 'tables' && (
          <div>
            <div style={{ marginBottom: 20, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#065f46', marginBottom: 2 }}>Direct Base Table Updates</div>
              <div style={{ fontSize: 11, color: '#059669' }}>Upload fixed-format files for direct upsert into base tables. Backend validates and enriches automatically.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {BASE_TABLES.map((bt, i) => <BaseTableCard key={i} {...bt} onRunComplete={onRunComplete} />)}
            </div>
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <HistoryTab runs={runs} onClear={() => setRuns([])} />
        )}

      </div>
    </div>
  );
}
