import React, { useState } from 'react';
import { useAppStore, AppPage } from '../../store/useAppStore';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { NotificationDrawer } from './NotificationDrawer';
import { CreateIncidentModal } from '../../features/incidents/CreateIncidentModal';
import { CreateEventModal } from '../../features/events/CreateEventModal';

// Pages
import { LandingPage } from '../../features/landing/LandingPage';
import { CommandOverview } from '../../features/command/CommandOverview';
import { LiveOperations } from '../../features/command/LiveOperations';
import { EventsPage } from '../../features/events/EventsPage';
import { VenueDesigner } from '../../features/venue/VenueDesigner';
import { CrowdSimulationPage } from '../../features/simulation/CrowdSimulationPage';
import { ScenarioLabPage } from '../../features/scenarios/ScenarioLabPage';
import { GatesZonesPage } from '../../features/gates/GatesZonesPage';
import { StaffResourcesPage } from '../../features/staff/StaffResourcesPage';
import { IncidentManagementPage } from '../../features/incidents/IncidentManagementPage';
import { EmergencyPlansPage } from '../../features/emergency/EmergencyPlansPage';
import { RiskAnalysisPage } from '../../features/risk/RiskAnalysisPage';
import { ReadinessPage } from '../../features/readiness/ReadinessPage';
import { ReportsPage } from '../../features/reports/ReportsPage';
import { TeamLogsSettingsPage } from '../../features/admin/TeamLogsSettingsPage';

export const AppShell: React.FC = () => {
  const { currentPage } = useAppStore();
  
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  // Landing page renders without application shell
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  // Live Operations renders in immersive full-screen mode
  if (currentPage === 'live') {
    return (
      <>
        <LiveOperations onOpenReportIncident={() => setIsCreateIncidentOpen(true)} />
        <CreateIncidentModal
          isOpen={isCreateIncidentOpen}
          onClose={() => setIsCreateIncidentOpen(false)}
        />
        <NotificationDrawer />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <CommandOverview onOpenReportIncident={() => setIsCreateIncidentOpen(true)} />;
      case 'events':
        return <EventsPage onOpenCreateModal={() => setIsCreateEventOpen(true)} />;
      case 'venue':
        return <VenueDesigner />;
      case 'simulation':
        return <CrowdSimulationPage />;
      case 'scenarios':
        return <ScenarioLabPage />;
      case 'gates':
        return <GatesZonesPage />;
      case 'staff':
        return <StaffResourcesPage />;
      case 'incidents':
        return <IncidentManagementPage onOpenReportModal={() => setIsCreateIncidentOpen(true)} />;
      case 'emergency':
        return <EmergencyPlansPage />;
      case 'risk':
        return <RiskAnalysisPage />;
      case 'readiness':
        return <ReadinessPage />;
      case 'reports':
        return <ReportsPage />;
      case 'admin':
        return <TeamLogsSettingsPage />;
      default:
        return <CommandOverview onOpenReportIncident={() => setIsCreateIncidentOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#101513] text-[#F0F2EC]">
      {/* Fixed Collapsible Navigation Sidebar */}
      <Sidebar onOpenCreateModal={() => setIsCreateEventOpen(true)} />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Operational Header */}
        <TopHeader onOpenReportIncident={() => setIsCreateIncidentOpen(true)} />

        {/* Dynamic Page Component */}
        <main className="flex-1 min-h-0 overflow-hidden relative">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Drawers & Modals */}
      <NotificationDrawer />
      
      <CreateIncidentModal
        isOpen={isCreateIncidentOpen}
        onClose={() => setIsCreateIncidentOpen(false)}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
      />
    </div>
  );
};

