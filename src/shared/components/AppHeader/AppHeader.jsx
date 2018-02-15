import React from 'react';

const AppHeader = ({ className, id, title }) => (
  <header className={className || 'app-header'} id={id}>
    <div className="nypl-full-width-wrapper">
      <h1 className="title">{title}</h1>
    </div>
  </header>
);

export default AppHeader;
