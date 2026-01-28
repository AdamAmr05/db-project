import DashboardShell from '../components/ai-dashboard/DashboardShell';
import SectionHeader from '../components/ai-dashboard/SectionHeader';
import { Grid, GridItem } from '../components/ai-dashboard/DashboardGrid';
import KpiCard from '../components/ai-dashboard/KpiCard';
import ChartBlock from '../components/chat/ChartBlock';
import DataTable from '../components/chat/DataTable';

export const dashboardRegistry = {
    DashboardShell,
    SectionHeader,
    Grid,
    GridItem,
    KpiCard,
    ChartCard: ChartBlock,
    DataTable
};
