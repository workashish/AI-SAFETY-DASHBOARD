import { useState, useEffect } from 'react';
import { Incident, mockIncidents } from '../data/mockIncidents';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  SortDesc,
  SortAsc,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  Plus,
  Search,
  X,
  Download,
  Share2,
  Printer,
  MoreHorizontal
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import DashboardSummary from './DashboardSummary';
import '../styles/IncidentDashboard.css';

const IncidentDashboard = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [expandedIncidentId, setExpandedIncidentId] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newIncident, setNewIncident] = useState<Omit<Incident, 'id' | 'reported_at'>>({
    title: '',
    description: '',
    severity: 'Medium',
  });
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      document.querySelectorAll('.incident-dropdown.show').forEach(dropdown => {
        if (!dropdown.contains(event.target as Node)) {
          dropdown.classList.remove('show');
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleIncidentDetails = (id: number) => {
    setExpandedIncidentId(expandedIncidentId === id ? null : id);
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    if (isFormVisible) {
      resetForm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIncident({
      ...newIncident,
      [name]: value,
    });

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: false,
      });
    }
  };

  const resetForm = () => {
    setNewIncident({
      title: '',
      description: '',
      severity: 'Medium',
    });
    setFormErrors({
      title: false,
      description: false,
    });
    setFormStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = {
      title: !newIncident.title.trim(),
      description: !newIncident.description.trim(),
    };

    setFormErrors(errors);

    if (errors.title || errors.description) {
      return;
    }

    setFormStatus('submitting');

    setTimeout(() => {
      const newIncidentWithId: Incident = {
        ...newIncident,
        id: Math.max(0, ...incidents.map(inc => inc.id)) + 1,
        reported_at: new Date().toISOString(),
      };

      setIncidents([newIncidentWithId, ...incidents]);

      setFormStatus('success');

      setTimeout(() => {
        resetForm();
        setIsFormVisible(false);
      }, 1500);
    }, 1000);
  };

  const filterIncidents = () => {
    let filteredIncidents = [...incidents];

    if (severityFilter !== 'All') {
      filteredIncidents = filteredIncidents.filter(incident => incident.severity === severityFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredIncidents = filteredIncidents.filter(incident =>
        incident.title.toLowerCase().includes(query) ||
        incident.description.toLowerCase().includes(query)
      );
    }

    filteredIncidents.sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filteredIncidents;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low':
        return <AlertTriangle className="severity-icon severity-low" />;
      case 'Medium':
        return <AlertCircle className="severity-icon severity-medium" />;
      case 'High':
        return <AlertOctagon className="severity-icon severity-high" />;
      default:
        return null;
    }
  };

  const displayedIncidents = filterIncidents();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSeverityFilter('All');
  };

  const exportIncidents = () => {
    const dataToExport = displayedIncidents;

    const headers = ['ID', 'Title', 'Description', 'Severity', 'Reported Date'];
    const csvRows = [
      headers.join(','),
      ...dataToExport.map(incident => [
        incident.id,
        `"${incident.title.replace(/"/g, '""')}"`,
        `"${incident.description.replace(/"/g, '""')}"`,
        incident.severity,
        formatDate(incident.reported_at)
      ].join(','))
    ];

    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-safety-incidents-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareIncident = (incident: Incident) => {
    const shareText = `AI Safety Incident Report: ${incident.title} (${incident.severity} Severity) - ${formatDate(incident.reported_at)}`;

    if (navigator.share) {
      navigator.share({
        title: 'AI Safety Incident',
        text: shareText,
        url: window.location.href
      }).catch(error => {
        console.log('Error sharing:', error);
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const printIncident = (incident: Incident) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>AI Safety Incident: ${incident.id}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1 { color: #2c3e50; }
              .meta { margin-bottom: 20px; }
              .severity {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 20px;
                font-weight: bold;
                margin-right: 10px;
              }
              .severity.High { background-color: #fdedec; color: #c0392b; }
              .severity.Medium { background-color: #fef5e9; color: #d35400; }
              .severity.Low { background-color: #fef9e7; color: #d4ac0d; }
              .date { color: #7f8c8d; }
              .description { margin-top: 20px; }
              .footer { margin-top: 30px; color: #7f8c8d; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>${incident.title}</h1>
            <div class="meta">
              <span class="severity ${incident.severity}">${incident.severity} Severity</span>
              <span class="date">Reported on: ${formatDate(incident.reported_at)}</span>
            </div>
            <div class="description">
              <h2>Description:</h2>
              <p>${incident.description}</p>
            </div>
            <div class="footer">
              <p>Incident ID: ${incident.id.toString().padStart(6, '0')}</p>
              <p>Printed from AI Safety Dashboard on ${new Date().toLocaleString()}</p>
            </div>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className={`incident-dashboard ${animateIn ? 'animate-in' : ''}`}>

      <DashboardSummary incidents={incidents} />


      <div className="incidents-section">
        <div className="section-header">
          <h2>AI Safety Incidents</h2>
          <button
            className="new-incident-button"
            onClick={toggleForm}
            aria-label="Report new incident"
          >
            <Plus size={18} />
            Report New Incident
          </button>
        </div>


        <div className="controls-container">
          <div className="search-controls">
            <div className="search-input-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={clearSearch} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-sort-controls">
            <div className="filter-controls">
              <Filter className="control-icon" size={18} />
              <select
                id="severity-filter"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as 'All' | 'Low' | 'Medium' | 'High')}
                className="control-select"
                aria-label="Filter by severity"
              >
                <option value="All">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="sort-controls">
              {sortOrder === 'newest' ? (
                <SortDesc className="control-icon" size={18} />
              ) : (
                <SortAsc className="control-icon" size={18} />
              )}
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="control-select"
                aria-label="Sort by date"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="export-controls">
              <button
                className="export-button"
                aria-label="Export data"
                onClick={exportIncidents}
              >
                <Download size={18} />
                <span className="export-text">Export</span>
              </button>
            </div>
          </div>
        </div>


        {isFormVisible && (
          <div className="incident-form-container">
            <div className="form-header">
              <h2>Report New AI Safety Incident</h2>
              <button
                className="close-form-button"
                onClick={toggleForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="incident-form">
              <div className="form-group">
                <label htmlFor="title">Incident Title <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newIncident.title}
                  onChange={handleInputChange}
                  className={formErrors.title ? 'error' : ''}
                  placeholder="Enter a descriptive title"
                  disabled={formStatus === 'submitting'}
                  aria-required="true"
                  aria-invalid={formErrors.title}
                />
                {formErrors.title && <span className="error-message">Title is required</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description <span className="required">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={newIncident.description}
                  onChange={handleInputChange}
                  className={formErrors.description ? 'error' : ''}
                  placeholder="Describe the incident in detail"
                  rows={4}
                  disabled={formStatus === 'submitting'}
                  aria-required="true"
                  aria-invalid={formErrors.description}
                />
                {formErrors.description && <span className="error-message">Description is required</span>}
              </div>

              <div className="form-group">
                <label htmlFor="severity">Severity Level <span className="required">*</span></label>
                <div className="severity-options">
                  <div className="severity-option">
                    <input
                      type="radio"
                      id="severity-low"
                      name="severity"
                      value="Low"
                      checked={newIncident.severity === 'Low'}
                      onChange={handleInputChange}
                      disabled={formStatus === 'submitting'}
                    />
                    <label htmlFor="severity-low" className="severity-label low">
                      <AlertTriangle size={16} />
                      Low
                    </label>
                  </div>

                  <div className="severity-option">
                    <input
                      type="radio"
                      id="severity-medium"
                      name="severity"
                      value="Medium"
                      checked={newIncident.severity === 'Medium'}
                      onChange={handleInputChange}
                      disabled={formStatus === 'submitting'}
                    />
                    <label htmlFor="severity-medium" className="severity-label medium">
                      <AlertCircle size={16} />
                      Medium
                    </label>
                  </div>

                  <div className="severity-option">
                    <input
                      type="radio"
                      id="severity-high"
                      name="severity"
                      value="High"
                      checked={newIncident.severity === 'High'}
                      onChange={handleInputChange}
                      disabled={formStatus === 'submitting'}
                    />
                    <label htmlFor="severity-high" className="severity-label high">
                      <AlertOctagon size={16} />
                      High
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="reset-button"
                  disabled={formStatus === 'submitting'}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className={`submit-button ${formStatus}`}
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'idle' && 'Submit Incident'}
                  {formStatus === 'submitting' && 'Submitting...'}
                  {formStatus === 'success' && 'Incident Reported!'}
                  {formStatus === 'error' && 'Error - Try Again'}
                </button>
              </div>
            </form>
          </div>
        )}


        <div className="incidents-list">
          <div className="list-header">
            <h3>Reported Incidents ({displayedIncidents.length})</h3>
            {searchQuery && (
              <div className="search-results">
                Search results for: <span className="search-query">"{searchQuery}"</span>
              </div>
            )}
          </div>

          {displayedIncidents.length === 0 ? (
            <div className="no-incidents">
              <AlertCircle size={48} className="no-results-icon" />
              <h4>No incidents found</h4>
              <p>
                {searchQuery
                  ? "No incidents match your search criteria. Try adjusting your filters or search terms."
                  : "No incidents match the current filters."}
              </p>
              {searchQuery && (
                <button className="clear-filters-button" onClick={clearSearch}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="incident-cards">
              {displayedIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`incident-card severity-${incident.severity.toLowerCase()}-border`}
                >
                  <div className="incident-header">
                    <div className="incident-title-container">
                      {getSeverityIcon(incident.severity)}
                      <h3 className="incident-title">{incident.title}</h3>
                    </div>
                    <div className="incident-meta">
                      <span className={`severity-badge severity-${incident.severity.toLowerCase()}`}>
                        {incident.severity}
                      </span>
                      <div className="incident-dates">
                        <span className="incident-date" title={formatDate(incident.reported_at)}>
                          {formatRelativeTime(incident.reported_at)}
                        </span>
                        <span className="incident-date-full">
                          {formatDate(incident.reported_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="incident-actions">
                    <button
                      className="details-toggle"
                      onClick={() => toggleIncidentDetails(incident.id)}
                      aria-expanded={expandedIncidentId === incident.id}
                      aria-controls={`incident-details-${incident.id}`}
                    >
                      {expandedIncidentId === incident.id ? (
                        <>
                          Hide Details
                          <ChevronUp className="toggle-icon" />
                        </>
                      ) : (
                        <>
                          View Details
                          <ChevronDown className="toggle-icon" />
                        </>
                      )}
                    </button>

                    <div className="incident-action-buttons">
                      <button
                        className="action-icon-button"
                        aria-label="Share incident"
                        onClick={() => shareIncident(incident)}
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        className="action-icon-button"
                        aria-label="Print incident"
                        onClick={() => printIncident(incident)}
                      >
                        <Printer size={16} />
                      </button>
                      <div className="dropdown-container">
                        <button
                          className="action-icon-button"
                          aria-label="More options"
                          onClick={(e) => {
                            e.stopPropagation();
                            const dropdown = e.currentTarget.nextElementSibling;
                            if (dropdown) {
                              dropdown.classList.toggle('show');
                            }
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="incident-dropdown">
                          <button
                            className="incident-dropdown-item"
                            onClick={() => {
                              const text = `ID: ${incident.id}\nTitle: ${incident.title}\nSeverity: ${incident.severity}\nDate: ${formatDate(incident.reported_at)}\nDescription: ${incident.description}`;
                              copyToClipboard(text);
                            }}
                          >
                            Copy Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedIncidentId === incident.id && (
                    <div
                      id={`incident-details-${incident.id}`}
                      className="incident-details"
                    >
                      <h4>Incident Description:</h4>
                      <p>{incident.description}</p>

                      <div className="incident-details-footer">
                        <div className="incident-id">
                          ID: {incident.id.toString().padStart(6, '0')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDashboard;
