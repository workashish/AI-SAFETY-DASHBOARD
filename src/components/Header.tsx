import { useState, useEffect } from 'react';
import { Bell, User, Menu, X, Check } from 'lucide-react';
import Logo from './Logo';
import '../styles/Header.css';


interface NavItem {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);


  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard', isActive: true },
    { id: 'incidents', label: 'Incidents', href: '#incidents', isActive: false },
    { id: 'analytics', label: 'Analytics', href: '#analytics', isActive: false },
    { id: 'reports', label: 'Reports', href: '#reports', isActive: false },
    { id: 'settings', label: 'Settings', href: '#settings', isActive: false },
  ]);


  const notificationItems = [
    { id: 1, title: 'New high severity incident reported', time: '10 minutes ago', read: false },
    { id: 2, title: 'System update completed', time: '1 hour ago', read: false },
    { id: 3, title: 'Weekly security report available', time: '3 hours ago', read: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    setShowNotificationDropdown(false);
    setShowUserDropdown(false);
  };

  const handleNavItemClick = (clickedId: string) => {

    setNavItems(navItems.map(item => ({
      ...item,
      isActive: item.id === clickedId
    })));


    setIsMobileMenuOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);

    setShowUserDropdown(false);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);

    setShowNotificationDropdown(false);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(0);
  };

  const handleClickOutside = () => {
    setShowNotificationDropdown(false);
    setShowUserDropdown(false);
  };

  useEffect(() => {
    if (showNotificationDropdown || showUserDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showNotificationDropdown, showUserDropdown]);

  return (
    <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <Logo />
        </div>

        <div className="header-center">
          <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <ul className="nav-list">
              {navItems.map(item => (
                <li key={item.id} className={`nav-item ${item.isActive ? 'active' : ''}`}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavItemClick(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="header-right">
          <div className="header-actions">
            <div className="dropdown-container">
              <button
                className="action-button notification-button"
                aria-label="Notifications"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNotificationDropdown();
                }}
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="notification-badge">{notifications}</span>
                )}
              </button>

              {showNotificationDropdown && (
                <div className="dropdown-menu notification-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    <button
                      className="mark-all-read"
                      onClick={markAllNotificationsAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="dropdown-content">
                    {notificationItems.map(notification => (
                      <div key={notification.id} className={`notification-item ${notification.read ? 'read' : ''}`}>
                        <div className="notification-content">
                          <p className="notification-title">{notification.title}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        {notification.read && <Check size={16} className="read-icon" />}
                      </div>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <a href="#all-notifications">View all notifications</a>
                  </div>
                </div>
              )}
            </div>

            <div className="dropdown-container">
              <button
                className="action-button user-button"
                aria-label="User profile"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleUserDropdown();
                }}
              >
                <User size={20} />
              </button>

              {showUserDropdown && (
                <div className="dropdown-menu user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar">AP</div>
                    <div className="user-details">
                      <h4>Ashish Pathak</h4>
                      <p>Administrator</p>
                    </div>
                  </div>
                  <div className="dropdown-content">
                    <a href="#profile" className="dropdown-item">Your Profile</a>
                    <a href="#settings" className="dropdown-item">Settings</a>
                    <a href="#help" className="dropdown-item">Help & Support</a>
                    <div className="dropdown-divider"></div>
                    <a href="#logout" className="dropdown-item logout">Sign Out</a>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
