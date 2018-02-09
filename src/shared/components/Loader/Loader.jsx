import React from 'react';

const Loader = ({ status = false, title = '' }) => {
  const baseClass = "loader";

  return status === true && (
    <div
      className={baseClass}
      role="alertdialog"
      aria-labelledby="loading-animation"
      aria-describedby="loading-description"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex="0"
    >
      <div className={`${baseClass}-layer`}></div>
      <div className={`${baseClass}-texts`}>
        <span id="loading-animation" className={`${baseClass}-texts-loadingWord`}>
          Loading...
        </span>
        <span
          id="loading-description"
          className={`${baseClass}-texts-title`}
        >
          {title}
        </span>
        <div className="loadingDots">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
