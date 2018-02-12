import React from 'react';
import NavLink from 'react-router-dom/NavLink';

const SidebarNavigation = ({ className = '' }) => (
  <nav className={`${className} sidebar-navigation`} id="sidebar-navigation">
    <ul>
      <li>
        <NavLink to="/update-metadata" activeClassName="active">
          Update Metadata
        </NavLink>
      </li>
      <li>
        <NavLink to="/transfer-metadata" activeClassName="active">
          Transfer Barcode & Update Metadata
        </NavLink>
      </li>
    </ul>
  </nav>
)

export default SidebarNavigation;
