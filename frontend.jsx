import { useState, useRef } from "react";

const Upload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const Play = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const Check = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const X = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Download = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

const Status = ({ status }) => {
  const styles = {
    idle: { bg: '#f3f4f6', color: '#6b7280', label: 'Idle' },
    running: { bg: '#fef3c7', color: '#d97706', label: 'Running' },
    success: { bg: '#d1fae5', color: '#059669', label: 'Success' },
    fail: { bg: '#fee2e2', color: '#dc2626', label: 'Failed' }
  };
  const s = styles[status] || styles.idle;
  return <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: s.bg, color: s.color }}>{s.label}</span>;
};

function FileUpload({ onFile, file, onClear }) {
  const ref = useRef();
  if (file) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6 }}>
      <div style={{ flex: 1, fontSize: 12 }}>{file.name} <span style={{ color: '#9ca3af' }}>({(file.size/1024).toFixed(0)} KB)</span></div>
      <button onClick={onClear} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}><X/></button>
    </div>
  );
  return (
    <div onClick={() => ref.current.click()} style={{ border: '2px dashed #d1d5db', borderRadius: 6, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
      <input ref={ref} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
      <Upload/>
      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Click to upload Excel/CSV</div>
    </div>
  );
}

function FlowCard({ name, description, steps, showTemplate, triggerOnly }) {
  const [file, setFile] = useState(null);
  const [dagStatus, setDagStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState(0);

  const trigger = () => {
    if (!triggerOnly && !file) return;
    setDagStatus('running');
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(s => {
        if (s >= steps.length - 1) {
          clearInterval(interval);
          setDagStatus(Math.random() > 0.3 ? 'success' : 'fail');
          setValidationErrors(triggerOnly ? 0 : Math.floor(Math.random() * 5));
          return s;
        }
        return s + 1;
      });
    }, 1500);
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{description}</div>
        </div>
        <Status status={dagStatus}/>
      </div>

      {showTemplate && (
        <button style={{ width: '100%', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: '#fff', border: '1px solid #3b82f6', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}>
          <Download/> Download Template
        </button>
      )}

      {!triggerOnly && <FileUpload file={file} onFile={setFile} onClear={() => { setFile(null); setDagStatus('idle'); setCurrentStep(0); }}/>}

      {dagStatus !== 'idle' && (
        <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>PIPELINE STEPS</div>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12 }}>
              {i < currentStep ? <span style={{ color: '#10b981' }}><Check/></span> :
               i === currentStep && dagStatus === 'running' ? <span style={{ color: '#d97706' }}>⏳</span> :
               dagStatus === 'fail' && i === currentStep ? <span style={{ color: '#dc2626' }}><X/></span> :
               <span style={{ color: '#d1d5db' }}>○</span>}
              <span style={{ color: i <= currentStep ? '#111827' : '#9ca3af' }}>{step}</span>
            </div>
          ))}
        </div>
      )}

      {dagStatus !== 'idle' && dagStatus !== 'running' && validationErrors > 0 && (
        <div style={{ marginTop: 8, padding: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#dc2626', marginBottom: 4 }}>{validationErrors} validation errors found</div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 8px', background: '#fff', border: '1px solid #dc2626', borderRadius: 4, color: '#dc2626', cursor: 'pointer' }}>
            <Download/> Download annotated file
          </button>
        </div>
      )}

      <button onClick={trigger} disabled={(!triggerOnly && !file) || dagStatus === 'running'} 
        style={{ marginTop: 12, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: (!triggerOnly && !file) || dagStatus === 'running' ? '#f3f4f6' : '#3b82f6', color: (!triggerOnly && !file) || dagStatus === 'running' ? '#9ca3af' : '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: (!triggerOnly && !file) || dagStatus === 'running' ? 'not-allowed' : 'pointer' }}>
        <Play/> {triggerOnly ? 'Trigger Flow' : 'Trigger Flow'}
      </button>
    </div>
  );
}

function BaseTableCard({ name, description }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState(0);

  const upload = () => {
    if (!file) return;
    setStatus('running');
    setTimeout(() => {
      setStatus(Math.random() > 0.3 ? 'success' : 'fail');
      setErrors(Math.floor(Math.random() * 8));
    }, 2000);
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{description}</div>
        </div>
        <Status status={status}/>
      </div>

      <button style={{ width: '100%', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: '#fff', border: '1px solid #3b82f6', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}>
        <Download/> Download Template
      </button>

      <FileUpload file={file} onFile={setFile} onClear={() => { setFile(null); setStatus('idle'); setErrors(0); }}/>

      {status === 'success' && (
        <div style={{ marginTop: 8, padding: 8, background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 6, fontSize: 12, color: '#059669' }}>
          ✓ Successfully uploaded to database
        </div>
      )}

      {status === 'fail' && errors > 0 && (
        <div style={{ marginTop: 8, padding: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#dc2626', marginBottom: 4 }}>{errors} rows failed validation</div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 8px', background: '#fff', border: '1px solid #dc2626', borderRadius: 4, color: '#dc2626', cursor: 'pointer' }}>
            <Download/> Download error report
          </button>
        </div>
      )}

      <button onClick={upload} disabled={!file || status === 'running'} 
        style={{ marginTop: 12, width: '100%', padding: '8px', background: !file || status === 'running' ? '#f3f4f6' : '#10b981', color: !file || status === 'running' ? '#9ca3af' : '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: !file || status === 'running' ? 'not-allowed' : 'pointer' }}>
        {status === 'running' ? 'Processing...' : 'Upload & Process'}
      </button>
    </div>
  );
}

function SimpleTrigger({ name, description, query }) {
  const [status, setStatus] = useState('idle');

  const trigger = () => {
    setStatus('running');
    setTimeout(() => {
      setStatus(Math.random() > 0.3 ? 'success' : 'fail');
    }, 2000);
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{description}</div>
        </div>
        <Status status={status}/>
      </div>

      {query && (
        <div style={{ marginBottom: 12, padding: 8, background: '#f9fafb', borderRadius: 6, fontSize: 11, fontFamily: 'monospace', color: '#6b7280' }}>
          {query}
        </div>
      )}

      <button onClick={trigger} disabled={status === 'running'} 
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: status === 'running' ? '#f3f4f6' : '#8b5cf6', color: status === 'running' ? '#9ca3af' : '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: status === 'running' ? 'not-allowed' : 'pointer' }}>
        <Play/> {status === 'running' ? 'Running...' : 'Trigger Query'}
      </button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('flows');

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Fulcrum Admin Panel</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Data pipeline and base table management</p>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid #e5e7eb' }}>
          <button onClick={() => setActiveTab('flows')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'flows' ? '2px solid #3b82f6' : '2px solid transparent', fontSize: 14, fontWeight: 600, color: activeTab === 'flows' ? '#3b82f6' : '#6b7280', cursor: 'pointer', marginBottom: -2 }}>
            Flow Triggers
          </button>
          <button onClick={() => setActiveTab('tables')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'tables' ? '2px solid #10b981' : '2px solid transparent', fontSize: 14, fontWeight: 600, color: activeTab === 'tables' ? '#10b981' : '#6b7280', cursor: 'pointer', marginBottom: -2 }}>
            Base Table Updates
          </button>
        </div>

        {activeTab === 'flows' && (
          <div>
            <div style={{ marginBottom: 16, padding: 12, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 4 }}>Flow Triggers with DAG Monitoring</div>
              <div style={{ fontSize: 12, color: '#1e3a8a' }}>Upload input files to trigger multi-step pipeline flows. Monitor DAG execution in real-time with step-by-step progress.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              <FlowCard 
                name="Warehouse Flow"
                description="Warehouse addition or deletion → assortment → projection update"
                steps={['Warehouse change detected', 'Assortment Updated', 'In Scope mpcs resolved', 'National forward projections fetched and flowed in as input', 'Regionalization and Day phasing Processed', 'dp_projection updated']}
              />
              <FlowCard 
                name="MPCs Assortment Addition"
                description="Assortment addition → scope resolution → projection update"
                steps={['Input validated', 'Assortment Updated', 'In Scope mpcs resolved', 'National forward projections fetched and flowed in as input', 'Regionalization and Day phasing Processed', 'dp_projection updated']}
                showTemplate={true}
              />
              <FlowCard 
                name="Platform NR Demand Update"
                description="National NR demand → regionalization → projection update"
                steps={['Input validated', 'National forward projections fetched and flowed in as input', 'Regionalization and Day phasing Processed', 'dp_projection updated']}
                showTemplate={true}
              />
              <FlowCard 
                name="Platform R Demand Update"
                description="National R demand → regionalization → projection update"
                steps={['Input validated', 'National forward projections fetched and flowed in as input', 'Regionalization and Day phasing Processed', 'dp_projection updated']}
                showTemplate={true}
              />
              <FlowCard 
                name="NPD Addition"
                description="NPD input → assortment → regionalization → projection update"
                steps={['Input validated', 'Assortment Addition', 'National forward projections fetched and flowed in as input', 'Regionalization and Day phasing Processed', 'dp_projection updated']}
                showTemplate={true}
              />
              <FlowCard 
                name="CPG Demand Update"
                description="CPG demand input → day phasing → fulcrum update"
                steps={['Input validated', 'Day phasing Processed', 'dp_fulcrum updated']}
                showTemplate={true}
              />
              <FlowCard 
                name="Stores Demand Update"
                description="Store demand input → day phasing → fulcrum update"
                steps={['Input validated', 'Day phasing Processed', 'dp_fulcrum updated']}
                showTemplate={true}
              />
              <FlowCard 
                name="Platform dp_class Update"
                description="Trigger dp_class query → auto-trigger dp_mdq update"
                steps={['dp_class query executed', 'dp_mdq automatically updated']}
                triggerOnly={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'tables' && (
          <div>
            <div style={{ marginBottom: 16, padding: 12, background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 4 }}>Direct Base Table Updates</div>
              <div style={{ fontSize: 12, color: '#047857' }}>Upload fixed-format files for direct insertion into base tables. Backend handles validation and enrichment automatically.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              <BaseTableCard 
                name="MDQ Update"
                description="Upload MDQ data → enrich → load to table"
              />
              <BaseTableCard 
                name="Class Update"
                description="Upload class updates → validate → update base table"
              />
              <SimpleTrigger 
                name="Platform dp_mdq Update"
                description="Standalone dp_mdq query execution (runs independently)"
                query="CALL `project.dataset.sp_platform_dp_mdq`()"
              />
              <BaseTableCard 
                name="Manual dp_fulcrum Update"
                description="Upload manual fulcrum data → validate → insert"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
