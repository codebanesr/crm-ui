import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OrganizationComponent } from './organization/organization.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent, data: { breadcrumb: 'login' } },
  {
    path: 'login', pathMatch: 'full', component: LoginComponent, data: {
      breadcrumb: 'login'
    }
  },
  {
    path: 'signup', pathMatch: 'full', component: SignupComponent, data: {
      breadcrumb: 'signup'
    }
  },
  {
    path: 'register-organization', pathMatch: 'full', component: OrganizationComponent, data: {
      breadcrumb: 'register-organization'
    }
  },
  {
    path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule), data: {
      breadcrumb: 'welcome'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
