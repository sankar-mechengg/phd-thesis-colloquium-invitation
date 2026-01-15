import React, { useState } from 'react';
import ThesisPresentation from './SankarPhDThesisPresentationInvitation';
import ThesisColloquium from './SankarPhDThesisColloquiumInvitation';

function App() {
  const [activeTab, setActiveTab] = useState('presentation1');

  return (
    <div className="App">
      {/* Tabs */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}>
        <button
          onClick={() => setActiveTab('presentation1')}
          style={{
            padding: '10px 24px',
            fontSize: '14px',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '500',
            color: activeTab === 'presentation1' ? '#1a1a2e' : '#fef3c7',
            background: activeTab === 'presentation1' 
              ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)'
              : 'rgba(254, 243, 199, 0.2)',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: activeTab === 'presentation1' 
              ? '0 3px 12px rgba(252, 211, 77, 0.4)'
              : 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            if (activeTab !== 'presentation1') {
              e.target.style.background = 'rgba(254, 243, 199, 0.3)';
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'presentation1') {
              e.target.style.background = 'rgba(254, 243, 199, 0.2)';
            }
          }}
        >
          Presentation 1 @ DM
        </button>
        <button
          onClick={() => setActiveTab('presentation2')}
          style={{
            padding: '10px 24px',
            fontSize: '14px',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '500',
            color: activeTab === 'presentation2' ? '#1a1a2e' : '#fef3c7',
            background: activeTab === 'presentation2' 
              ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)'
              : 'rgba(254, 243, 199, 0.2)',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: activeTab === 'presentation2' 
              ? '0 3px 12px rgba(252, 211, 77, 0.4)'
              : 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            if (activeTab !== 'presentation2') {
              e.target.style.background = 'rgba(254, 243, 199, 0.3)';
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'presentation2') {
              e.target.style.background = 'rgba(254, 243, 199, 0.2)';
            }
          }}
        >
          Presentation 2 @ Mechanical
        </button>
      </div>

      {/* Content with top padding to account for fixed tabs */}
      <div style={{ marginTop: '60px' }}>
        {activeTab === 'presentation1' ? (
          <ThesisPresentation />
        ) : (
          <ThesisColloquium />
        )}
      </div>
    </div>
  );
}

export default App;
