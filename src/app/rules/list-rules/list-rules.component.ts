import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { startCase } from 'lodash';
import { RuleService } from 'src/app/rule.service';
import { IRules } from '../add-rules/rules.constants';

@Component({
  selector: 'app-list-rules',
  templateUrl: './list-rules.component.html',
  styleUrls: ['./list-rules.component.scss'],
})
export class ListRulesComponent implements OnInit {

  constructor(
    private ruleService: RuleService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) { }

  rules: IRules[]

  startCase = startCase;
  campaignId = '';
  objectKeys = Object.keys;
  ngOnInit() {
    this.campaignId = this.activatedRouter.snapshot.queryParamMap.get('campaignId');
    this.ruleService.getAllRules(this.campaignId, 20, 0).subscribe((rules: IRules[])=>{
      this.rules = rules;
    }, error=>{
      console.log(error);
    })
  }


  navigateToRuleDetails(r: IRules) {
    this.router.navigate(['rules', 'add-rules'], {
      queryParams: {
        ruleId: r._id,
        campaignId: this.campaignId
      }
    })
  }
}
