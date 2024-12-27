import styled from 'styled-components';
import Logo from './Logo.jsx';
import {
    HiOutlineBars4,
    HiOutlineHome,
    HiOutlineLockClosed,
    HiOutlineUsers,
    HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';
import { HiOutlineChartBar, HiOutlineUpload } from 'react-icons/hi';
import MainNav from './MultiLevelNav.jsx';

const StyledSidebar = styled.aside`
    background-color: var(--color-grey-0);
    padding: 3.2rem 1rem;
    border-right: 1px solde var(--color-grey-100);

    grid-row: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 3rem;
`;

function Sidebar() {
    const navItems = [
        { icon: <HiOutlineHome />, text: 'Accueil', to: '/' },
        { icon: <HiOutlineChartBar />, text: 'Dashboard', to: '/dashboard' },
        { icon: <HiOutlineUpload />, text: 'Chargement', to: '/chargement' },
        {
            icon: <HiOutlineBars4 />,
            text: 'Reporting',
            subItems: [
                { text: 'Globale', to: '/reporting/transactions' },
                { text: 'Agrégées', to: '/reporting/transactions-agrege' },
            ],
        },
        { icon: <HiOutlineUsers />, text: 'Utilisateurs', to: '/users' },
        {
            icon: <HiOutlineLockClosed />,
            text: 'Habilitation',
            subItems: [
                { text: 'Fonctions', to: '/habilitation/fonctions' },
                { text: 'Menus', to: '/habilitation/menus' },
                { text: 'Permissions', to: '/habilitation/permissions' },
                { text: 'Configuration des fonctions', to: '/habilitation/configuration-fonction' },
                { text: 'Attribution des fonctions', to: '/habilitation/attribution-fonction' },
            ],
        },
        {
            icon: <HiOutlineWrenchScrewdriver />,
            text: 'Configuration',
            subItems: [
                {
                    text: 'Agence - Etat',
                    subItems: [
                        { text: 'Agence', to: '/configuration/agence' },
                        { text: 'Etat', to: '/configuration/etat' },
                    ],
                },
                {
                    text: 'Usage et liste',
                    subItems: [
                        { text: 'Usage', to: '/configuration/usage' },
                        { text: 'Liste statique', to: '/configuration/liste' },
                    ],
                },
            ],
        },
    ];

    return (
        <StyledSidebar>
            <Logo />
            <MainNav items={navItems} />
        </StyledSidebar>
    );
}

export default Sidebar;
