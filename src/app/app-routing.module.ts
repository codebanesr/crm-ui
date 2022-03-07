import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "src/login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full",
  },
  {
    path: "forgot-password/:uuid",
    component: ForgotPasswordComponent,
    pathMatch: "full",
  },
  {
    path: "orders",
    loadChildren: () =>
      import("./orders/orders.module").then((m) => m.OrdersModule),
  },
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "reseller",
    loadChildren: () =>
      import("./reseller/reseller.module").then((m) => m.ResellerModule),
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./reports/reports.module").then((m) => m.ReportsModule),
  },
  {
    path: "builder",
    loadChildren: () =>
      import("./shared/shared.module").then((m) => m.SharedModule),
  },
  {
    path: "rules",
    loadChildren: () =>
      import("./rules/rules.module").then((m) => m.RulesModule),
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
