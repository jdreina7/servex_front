import { Routes, RouterModule } from '@angular/router';

// Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'users',
    loadChildren: './users/users.module#UsersModule'
  },
  {
    path: 'users/user/:id',
    loadChildren: './users/user/user.module#UserModule'
  },
  {
    path: 'clients',
    loadChildren: './clients/clients.module#ClientsModule'
  },
  {
    path: 'clients/client/:id',
    loadChildren: './clients/client/client.module#ClientModule'
  },
  {
    path: 'categories',
    loadChildren: './categories/categories.module#CategoriesModule'
  },
  {
    path: 'categories/category/:id',
    loadChildren: './categories/category/category.module#CategoryModule'
  },
  {
    path: 'subcategories',
    loadChildren: './subcategories/subcategories.module#SubcategoriesModule'
  },
  {
    path: 'subcategories/subcategory/:id',
    loadChildren: './subcategories/subcategory/subcategory.module#SubcategoryModule'
  },
  {
    path: 'products',
    loadChildren: './products/products.module#ProductsModule'
  },
  {
    path: 'products/product/:id',
    loadChildren: './products/product/product.module#ProductModule'
  },
  {
    path: 'pages',
    loadChildren: './pages/full-pages/full-pages.module#FullPagesModule'
  },

];
