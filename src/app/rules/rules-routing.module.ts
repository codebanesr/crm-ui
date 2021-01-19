import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddRulesComponent } from "./add-rules/add-rules.component";

const routes: Routes = [
    {
        path: 'add-rules',
        pathMatch: 'full',
        component: AddRulesComponent
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RulesRoutingModule {}