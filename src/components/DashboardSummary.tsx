import { AlertTriangle, AlertCircle, AlertOctagon, Clock } from 'lucide-react';
import { Incident } from '../data/mockIncidents';
import { format } from 'date-fns';
import '../styles/DashboardSummary.css';

interface DashboardSummaryProps {
  incidents: Incident[];
}

const DashboardSummary = ({ incidents }: DashboardSummaryProps) => {
  const totalIncidents = incidents.length;
  const highSeverityCount = incidents.filter(inc => inc.severity === 'High').length;
  const mediumSeverityCount = incidents.filter(inc => inc.severity === 'Medium').length;
  const lowSeverityCount = incidents.filter(inc => inc.severity === 'Low').length;

  const sortedIncidents = [...incidents].sort((a, b) =>
    new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
  );
  const mostRecentIncident = sortedIncidents[0];

  const formattedRecentDate = mostRecentIncident
    ? format(new Date(mostRecentIncident.reported_at), 'MMM d, yyyy h:mm a')
    : 'N/A';

  return (
    <div className="dashboard-summary">
      <h2 className="summary-title">AI Safety Overview</h2>

      <div className="summary-cards">
        <div className="summary-card total">
          <div className="card-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="card-content">
            <h3 className="card-title">Total Incidents</h3>
            <p className="card-value">{totalIncidents}</p>
          </div>
        </div>

        <div className="summary-card high">
          <div className="card-icon">
            <AlertOctagon size={24} />
          </div>
          <div className="card-content">
            <h3 className="card-title">High Severity</h3>
            <p className="card-value">{highSeverityCount}</p>
          </div>
        </div>

        <div className="summary-card medium">
          <div className="card-icon">
            <AlertCircle size={24} />
          </div>
          <div className="card-content">
            <h3 className="card-title">Medium Severity</h3>
            <p className="card-value">{mediumSeverityCount}</p>
          </div>
        </div>

        <div className="summary-card low">
          <div className="card-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="card-content">
            <h3 className="card-title">Low Severity</h3>
            <p className="card-value">{lowSeverityCount}</p>
          </div>
        </div>
      </div>

      <div className="recent-incident">
        <div className="recent-header">
          <Clock size={18} />
          <h3>Most Recent Incident</h3>
        </div>
        {mostRecentIncident ? (
          <div className="recent-content">
            <h4>{mostRecentIncident.title}</h4>
            <div className="recent-meta">
              <span className={`severity-badge severity-${mostRecentIncident.severity.toLowerCase()}`}>
                {mostRecentIncident.severity}
              </span>
              <span className="recent-date">{formattedRecentDate}</span>
            </div>
          </div>
        ) : (
          <p>No incidents reported yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardSummary;
