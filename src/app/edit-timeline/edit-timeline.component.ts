import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceblogService } from '../services/blog-service';

@Component({
  selector: 'app-edit-timeline',
  templateUrl: './edit-timeline.component.html',
  styleUrls: ['./edit-timeline.component.css']
})
export class EditTimelineComponent implements OnInit {
  timeline: any = {};
  constructor(private blogService: ServiceblogService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.blogService.editTimeline(params.id).subscribe(res => {
        this.timeline = res;
        console.log(this.timeline, "this")
        //this.adminId = this.route.snapshot.params.id;
      });
    });
  }

  updateTimelineById(timelineText) {
    this.route.params.subscribe(params => {
      this.blogService.updateTimeline(timelineText, params.id);
      this.router.navigate(['/my-profile'])
    });
  }

}
