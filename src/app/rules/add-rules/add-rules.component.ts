import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CampaignService } from "src/app/home/campaign.service";
import { NzTreeNode } from "ng-zorro-antd/tree";
import { UsersService } from "src/app/home/users.service";
import { User } from "src/app/home/interfaces/user";
import { Trigger, TriggerOptions, ActionOptions, EActions } from './rules.constants';

interface IRules {
  action: string,
  changeHandler: string,
  daysOverdue: number,
  disposition: string,
  fromDisposition: string,
  newDisposition: string,
  newHandler: string,
  numberOfAttempts: number,
  toDisposition: string,
  trigger: string,
  url: string
}

@Component({
  selector: "app-add-rules",
  templateUrl: "./add-rules.component.html",
  styleUrls: ["./add-rules.component.scss"],
})
export class AddRulesComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService
  ) {}

  triggerEnum = Trigger;
  triggerOptions = TriggerOptions;
  eActions = EActions;
  actionOptions = ActionOptions;
  ngOnInit() {
    const campaignId = this.activatedRoute.snapshot.queryParamMap.get('campaignId');
    console.log(campaignId);
    this.initRuleForm();
    this.initDispositionNodes(campaignId);
    this.getAllHandler();
  }

  handlers: User[] = [];
  getAllHandler() {
    this.userService.getAllUsersHack().subscribe(data=>{
      this.handlers = data[0].users;
    }, error=>{
      console.log(error);
    })
  }

  initDispositionNodes(campaignId) {
    this.campaignService.getDisposition(campaignId).subscribe((result: any)=>{
      this.flattenDispositionTree(result.options);
    }, error=>{
      console.log(error);
    });
  }

  dispositionOpts = [];
  flattenDispositionTree(nodes: NzTreeNode[]) {
    nodes.forEach(n=>{
      this.flattenNode(n);
    })
  }

  flattenNode(node) {
    if(!node) {
      return;
    }
    this.dispositionOpts.push({title: node.title, key: node.key, disabled: !node.isLeaf });
    node.children.forEach(c=>{
      this.flattenNode(c);
    })
  }

  ruleForm: FormGroup;
  trigger = new FormControl("", [Validators.required]);
  action = new FormControl("", [Validators.required]);
  url = new FormControl("", [Validators.required]);

  numberOfAttempts = new FormControl("", [Validators.required]); //repeatedDisposition, numberOfAttempts

  fromDisposition = new FormControl("", [Validators.required]);
  toDisposition = new FormControl("", [Validators.required]);
  daysOverdue = new FormControl("", [Validators.required]);
  repeatedDisposition = new FormControl("", [Validators.required]);
  changeHandler = new FormControl("", [Validators.required]);
  disposition = new FormControl("", [Validators.required]);
  newHandler = new FormControl("", [Validators.required]);
  newDisposition = new FormControl("", [Validators.required]);

  initRuleForm() {
    this.ruleForm = this.fb.group({
      trigger: this.trigger,
      numberOfAttempts: this.numberOfAttempts,
      action: this.action,
      url: this.url,
      fromDisposition: this.fromDisposition,
      toDisposition: this.toDisposition,
      changeHandler: this.changeHandler,
      daysOverdue: this.daysOverdue,
      disposition: this.disposition,
      newHandler: this.newHandler,
      newDisposition: this.newDisposition
    });
  }

  handleSubmit(rulesObj: IRules) {
    console.log(rulesObj)
    switch(rulesObj.trigger) {
      case this.triggerEnum.dispositionChange: {
        if(!rulesObj.fromDisposition || !rulesObj.toDisposition) {
          return;
        }
        break;
      }
      case this.triggerEnum.changeHandler: {
        break;
      }
      case this.triggerEnum.numberOfAttempts: {
        if(!rulesObj.numberOfAttempts) {
          return;
        }
        break;
      }
      case this.triggerEnum.overdueFollowups: {
        if(!rulesObj.daysOverdue) {
          return;
        }
        break;
      }
      case this.triggerEnum.repeatedDisposition: {
        if(!rulesObj.disposition || !rulesObj.numberOfAttempts) {
          return;
        }

        break;
      }
      default: {
        return;
      }
    }

    console.log("Passed trigger check");

    switch(rulesObj.action) {
      case this.eActions.callApi: {
        if(!rulesObj.url) {
          return;
        }
        break;
      }

      case this.eActions.changeDisposition: {
        if(!rulesObj.newDisposition) {
          return;
        }

        break;
      }

      case this.eActions.changeProspectHandler: {
        if(!rulesObj.newHandler) {
          return;
        }

        break;
      }

      default:{
        return;
      }
    }

    console.log("Passed trigger and action check");
  }

  dictionary = {
    "Common Fields": [
      "$First name$ First name of the prospect",
      "$Last name$ Last name of the prospect",
      "$Full name$ Full name of the prospect",
      "$Mobile phone$ Comma separated list of all the prospects mobile phone numbers",
      "$Home phone$ Comma separated list of all the prospects home phone numbers",
      "$Work phone$ Comma separated list of all the prospects home work numbers",
      "$Last called phone$ The phone number used for the last contact with the prospect",
      "$Email$ Comma separated list of all the prospects email addresses",
      "$Handler email$ Email address of the last handler",
      "$Handler name$ Name of the last handler",
      "$Handler phone number$ Handler's phone number",
      "$Handler mobile PIN$ PIN of the Call Handler",
      "$Disposition$ The disposition",
      "$Follow up time$ The follow up time converted to UTC in YYYY-MM-DD HH:mm:ss format",
      "$Source$ The source of the prospect's data",
      "$Unique call ID$ Unique Call Identifier",
      "$Remark$ Remark recorded with the transaction",
    ],
    "Call Details": [
      "$Call Direction$ inbound or outbound",
      "$Call Duration$ in seconds",
      "$Call Status$ answered or unanswered or unknown",
      "$Called At$ Timestamp of when the call occured",
      "$Call Recording URL$ URL of the call recording",
    ],

    // @Todo custom fields to be brought from the backend
    // "Custom Prospect Fields"
  };
}
