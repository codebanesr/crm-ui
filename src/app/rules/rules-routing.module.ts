import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddRulesComponent } from "./add-rules/add-rules.component";
import { ListRulesComponent } from "./list-rules/list-rules.component";

const routes: Routes = [
    {
        path: 'add-rules',
        pathMatch: 'full',
        component: AddRulesComponent
    }, {
        path: 'list-rules',
        pathMatch: 'full',
        component: ListRulesComponent
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RulesRoutingModule {}