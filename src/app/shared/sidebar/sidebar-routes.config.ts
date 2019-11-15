import { RouteInfo } from './sidebar.metadata';

// Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

    // tslint:disable-next-line:max-line-length
    { path: '/dashboard/dashboard1', title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/users', title: 'Users', icon: 'ft-users', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/clients', title: 'Clients', icon: 'icon-badge', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    // tslint:disable-next-line:max-line-length
    { path: '/categories', title: 'Categories', icon: 'ft-layers', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    // tslint:disable-next-line:max-line-length
    { path: '/subcategories', title: 'Subcategories', icon: 'ft-grid', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/products', title: 'Products', icon: 'ft-package', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];
