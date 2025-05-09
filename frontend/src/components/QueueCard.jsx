// src/components/QueueCard.jsx
import React from "react";

const QueueCard = ({ song, onRemove, onPlay }) => {
  return (
    <div className="queue-card">
      <img src={song.thumbnail} alt={song.title} className="queue-thumbnail" />
      <div className="queue-details">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
        <div className="queue-actions">
          <button onClick={() => onPlay(song.id)}>Play</button>
          <button onClick={() => onRemove(song.id)}>Remove</button>
        </div>
      </div>
    </div>
  );
};

export default QueueCard;
