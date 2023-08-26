import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogStatisticsComponent } from './blog-statistics.component';

describe('BlogStatisticsComponent', () => {
  let component: BlogStatisticsComponent;
  let fixture: ComponentFixture<BlogStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
