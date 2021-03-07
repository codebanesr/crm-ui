import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DynamicFormComponent } from "./dynamic-form/dynamic-form.component";

const routes: Routes = [
    {
        path: 'build',
        pathMatch: 'full',
        component: DynamicFormComponent
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SharedRoutingModule {}