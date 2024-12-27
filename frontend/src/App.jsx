import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GlobalStyles } from './styles/GlobalStyles.js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './ui/AppLayout.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import Login from './pages/Login.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './ui/ProtectedRoute.jsx';
import Chargement from './pages/Chargement.jsx';
import Reporting from './pages/reports/Reporting.jsx';
import ReportingTransaction from './pages/reports/ReportingTransactionGlobal.jsx';
import ReportingTransactionAgrege from './pages/reports/ReportingTransactionAgrege.jsx';
import ChargementDetail from './pages/ChargementDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Habilitation from './pages/habilitation/Habilitation.jsx';
import Fonction from './features/habilitation/fonction/Fonction.jsx';
import Menu from './features/habilitation/menu/Menu.jsx';
import Permission from './features/habilitation/permission/Permission.jsx';
import ConfigFonction from './features/habilitation/configuration-fonction/ConfigFonction.jsx';
import AttributionFonction from './features/habilitation/attribution-fonction/AttributionFonction.jsx';
import Etat from './features/configuration/etat/Etat.jsx';
import Configuration from './pages/configuration/Configuration.jsx';
import CleListe from './features/configuration/cle-liste/CleListe.jsx';
import ListeToUse from './features/configuration/liste-to-use/ListeToUse.jsx';
import Agence from './features/configuration/agence/Agence.jsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <GlobalStyles />
            <BrowserRouter>
                <Routes>
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate replace to="/home" />} />
                        <Route path="home" element={<Home />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="chargement" element={<Chargement />} />
                        <Route path="chargement/:chargement_id" element={<ChargementDetail />} />
                        <Route path="reporting" element={<Reporting />}>
                            <Route index element={<Navigate replace to="/reporting" />} />
                            <Route path="transactions" element={<ReportingTransaction />} />
                            <Route path="transactions-agrege" element={<ReportingTransactionAgrege />} />
                        </Route>
                        <Route path="habilitation" element={<Habilitation />}>
                            <Route index element={<Navigate replace to="/habilitation" />} />
                            <Route path="fonctions" element={<Fonction />} />
                            <Route path="menus" element={<Menu />} />
                            <Route path="permissions" element={<Permission />} />
                            <Route path="configuration-fonction" element={<ConfigFonction />} />
                            <Route path="attribution-fonction" element={<AttributionFonction />} />
                        </Route>
                        <Route path="configuration" element={<Configuration />}>
                            <Route index element={<Navigate replace to="/configuration" />} />
                            <Route path="etat" element={<Etat />} />
                            <Route path="usage" element={<CleListe />} />
                            <Route path="liste" element={<ListeToUse />} />
                            <Route path="agence" element={<Agence />} />
                        </Route>
                    </Route>

                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>

            <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ margin: '8px' }}
                toastOptions={{
                    success: {
                        duration: 3000,
                    },
                    error: {
                        duration: 5000,
                    },
                    style: {
                        fontSize: '16px',
                        maxWidth: '500px',
                        padding: '16px 24px',
                        backgroundColor: 'var(--color-grey-0)',
                        color: 'var(--color-grey-700)',
                    },
                }}
            />
        </QueryClientProvider>
    );
}

export default App;
