import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { projects } from '../projects';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  projectURL;
  projects = projects;
  nrs;

  constructor(private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectURL = params.get('project');
      this.nrs = params.get('project.nrImages');
      console.log(this.projectURL);
    });
  }
}
