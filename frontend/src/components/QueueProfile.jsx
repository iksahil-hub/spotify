import React from 'react';
import { FaListUl } from 'react-icons/fa';

const QueueProfile = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FaListUl style={styles.icon} />
        <h2 style={styles.title}>Queue</h2>
      </div>

      <div style={styles.body}>
        <p style={styles.text}>Your queue is empty</p>
        {/* You can add more logic here to show upcoming songs */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 30px',
    color: 'white',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  icon: {
    fontSize: '28px',
  },
  title: {
    fontSize: '24px',
    margin: 0,
  },
  body: {
    backgroundColor: '#181818',
    padding: '30px',
    borderRadius: '10px',
  },
  text: {
    fontSize: '18px',
    color: '#b3b3b3',
  },
};

export default QueueProfile;
