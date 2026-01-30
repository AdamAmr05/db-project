import DashboardShell from '../components/ai-dashboard/DashboardShell';
import SectionHeader from '../components/ai-dashboard/SectionHeader';
import { Grid, GridItem } from '../components/ai-dashboard/DashboardGrid';
import KpiCard from '../components/ai-dashboard/KpiCard';
import ChartBlockFlat from '../components/ai-dashboard/ChartBlockFlat';
import DataTableFlat from '../components/ai-dashboard/DataTableFlat';

export const dashboardRegistry = {
    DashboardShell,
    SectionHeader,
    Grid,
    GridItem,
    KpiCard,
    ChartCard: ChartBlockFlat,
    DataTable: DataTableFlat
};
