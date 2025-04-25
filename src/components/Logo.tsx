import { Shield, ShieldAlert } from 'lucide-react';
import '../styles/Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <Shield className="shield-icon" />
        <ShieldAlert className="shield-alert-icon" />
      </div>
      <div className="logo-text">
        <span className="logo-text-human">SAFETY</span>
        <span className="logo-text-chain">DASHBOARD</span>
      </div>
    </div>
  );
};

export default Logo;
