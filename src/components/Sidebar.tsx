import React, { useState } from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronRight,
  Bell,
  Shield,
  Zap,
  BookOpen
} from 'lucide-react';
import '../styles/Sidebar.css';


interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  hasSubMenu?: boolean;
  subItems?: {
    id: string;
    label: string;
    isActive: boolean;
  }[];
}

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => {

  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      isActive: true,
      hasSubMenu: false
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: <AlertTriangle size={20} />,
      isActive: false,
      hasSubMenu: true,
      subItems: [
        { id: 'all-incidents', label: 'All Incidents', isActive: false },
        { id: 'reported', label: 'Reported by Me', isActive: false },
        { id: 'assigned', label: 'Assigned to Me', isActive: false }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 size={20} />,
      isActive: false,
      hasSubMenu: true,
      subItems: [
        { id: 'overview', label: 'Overview', isActive: false },
        { id: 'trends', label: 'Trends', isActive: false },
        { id: 'reports', label: 'Reports', isActive: false }
      ]
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell size={20} />,
      isActive: false,
      hasSubMenu: false
    },
    {
      id: 'safety',
      label: 'Safety Measures',
      icon: <Shield size={20} />,
      isActive: false,
      hasSubMenu: false
    }
  ]);


  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});


  const toggleSubMenu = (itemId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };


  const handleItemClick = (itemId: string) => {
    setSidebarItems(items =>
      items.map(item => ({
        ...item,
        isActive: item.id === itemId,
        subItems: item.subItems?.map(subItem => ({
          ...subItem,
          isActive: false
        }))
      }))
    );
  };


  const handleSubItemClick = (itemId: string, subItemId: string) => {
    setSidebarItems(items =>
      items.map(item => ({
        ...item,
        isActive: item.id === itemId,
        subItems: item.subItems?.map(subItem => ({
          ...subItem,
          isActive: subItem.id === subItemId && item.id === itemId
        }))
      }))
    );
  };

  return (
    <aside className={`sidebar ${className}`}>
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {sidebarItems.map(item => (
            <li
              key={item.id}
              className={`sidebar-nav-item ${item.isActive ? 'active' : ''}`}
            >
              <div className="sidebar-nav-item-container">
                <a
                  href={`#${item.id}`}
                  className="sidebar-nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.id);
                    if (item.hasSubMenu) {
                      toggleSubMenu(item.id);
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
                {item.hasSubMenu && (
                  <button
                    className={`submenu-toggle ${expandedMenus[item.id] ? 'expanded' : ''}`}
                    onClick={() => toggleSubMenu(item.id)}
                    aria-label={`Toggle ${item.label} submenu`}
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {item.hasSubMenu && item.subItems && (
                <ul className={`submenu ${expandedMenus[item.id] ? 'expanded' : ''}`}>
                  {item.subItems.map(subItem => (
                    <li
                      key={subItem.id}
                      className={`submenu-item ${subItem.isActive ? 'active' : ''}`}
                    >
                      <a
                        href={`#${item.id}-${subItem.id}`}
                        className="submenu-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubItemClick(item.id, subItem.id);
                        }}
                      >
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="quick-actions">
          <button className="quick-action-button" title="Quick Actions">
            <Zap size={18} />
          </button>
          <button className="quick-action-button" title="Documentation">
            <BookOpen size={18} />
          </button>
        </div>

        <div className="sidebar-footer-links">
          <a href="#settings" className="sidebar-footer-link">
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <a href="#help" className="sidebar-footer-link">
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
