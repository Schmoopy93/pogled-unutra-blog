import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { ServiceblogService } from 'src/app/services/blog-service';

@Component({
  selector: 'app-blog-statistics',
  templateUrl: './blog-statistics.component.html',
  styleUrls: ['./blog-statistics.component.css']
})
export class BlogStatisticsComponent implements OnInit {
  public barChartData: Array<any> = [];
  public barChartLabels: Array<any> = [];
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = Array.from({ length: 2031 - 2022 }, (_, index) => 2022 + index);
  yearlyPostCounts: Map<number, number> = new Map<number, number>();
  currentYear: number = new Date().getFullYear();
  yearlyPostsCollapseOpen: boolean = false;

  public barChartOptions: any = {
    responsive: true
  };
  public barChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(46, 204, 113, 0.5)',
      borderColor: 'rgba(26, 152, 80, 1)',
      borderWidth: 1
    }
  ];
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';

  constructor(private blogService: ServiceblogService) { }

  ngOnInit(): void {
    this.getPostsForBarChart();
  }

  getPostsForBarChart(){
      this.blogService.getAllPostsWithoutParams().subscribe((postData: any) => {
      const posts = postData.posts;

      const monthNames = this.generateMonthNames();

      // Kreiranje mape sa brojem postova po mesecima i godinama
      const postsPerMonthYear = new Map<string, number>();
      posts.forEach((post: any) => {
        const createdAt = new Date(post.createdAt);
        const monthName = this.getMonthName(createdAt.getMonth());
        const year = createdAt.getFullYear();
        const key = `${monthName}-${year}`;
      

  // Povećaj broj postova za taj mesec i godinu
      if (postsPerMonthYear.has(key)) {
        postsPerMonthYear.set(key, postsPerMonthYear.get(key) + 1);
      } else {
        postsPerMonthYear.set(key, 1);
      }

      this.yearlyPostCounts = posts.reduce((map, post) => {
        const createdAt = new Date(post.createdAt);
        const year = createdAt.getFullYear();
  
        if (map.has(year)) {
          map.set(year, map.get(year) + 1);
        } else {
          map.set(year, 1);
        }
  
        return map;
      }, new Map<number, number>());
    });
      // Konvertuj mapu u niz za izgradnju grafa
      const barData = [];
      monthNames.forEach((month) => {
        const year = this.selectedYear;
        const key = `${month}-${year}`;
        barData.push(postsPerMonthYear.get(key) || 0);
      });
      

      // Prikazivanje podataka u vertikalnom grafikonu
      this.barChartLabels = monthNames;
      this.barChartData = [
        { data: barData, label: `Number of posts for ${this.selectedYear} year` }
      ];
      this.barChartOptions.scales = {
        y: [
          {
            ticks: {
              beginAtZero: false, 
              min: 1, // Minimalna vrednost na y osi
              max: 20, // Maksimalna vrednost na y osi
              stepSize: 1, // Korak za vrednosti na y osi
              precision: 0
            }
          }
        ]
      };
    });

  }

  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  }

  private generateMonthNames(): string[] {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.ngOnInit();
  }

  toggleYearlyPostsCollapse() {
    this.yearlyPostsCollapseOpen = !this.yearlyPostsCollapseOpen;
  }
}

