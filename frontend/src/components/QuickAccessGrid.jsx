import React from 'react';

const items = [
  'Pop Au...',
  'Chill',
  'Renaissance',
  'Future Nostalgia',
  'Starboy',
  'Renaissance',
];

const QuickAccessGrid = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '16px',
      marginBottom: '30px',
    }}>
      {items.map((title, index) => (
        <div key={index} style={{
          backgroundColor: '#282828',
          borderRadius: '8px',
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: '500',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#333',
            borderRadius: '4px',
            marginRight: '10px',
          }} />
          <span>{title}</span>
        </div>
      ))}
    </div>
  );
};

export default QuickAccessGrid;
