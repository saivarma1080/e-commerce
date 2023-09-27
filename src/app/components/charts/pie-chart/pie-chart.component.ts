import { Component, ElementRef, NgZone, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as $ from 'jquery';
import { EChartTypes } from 'src/app/models/enum';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
})
export class PieChartComponent {
  @Input('clickable') clickable: boolean = false;
  @Input('customTitle') customTitle: string;
  @ViewChild('pieChart', { static: false }) private chartDom: ElementRef;
  @Output() onClickData = new EventEmitter<any>();
  public inputFromParent: any;
  private pieChart: am4charts.PieChart3D;
  public dataFound: boolean = true;
  public noDataText: string;
  public titleX: string;
  public titleY: string;
  private mappingKeys: any;

  constructor(private zone: NgZone) { }
  @Input()
  set pieChartInput(data: any) {
    if (data) {
      this.inputFromParent = JSON.parse(JSON.stringify(data));
      console.log(this.inputFromParent);
      this.dataFound = true;
    } else {
      this.dataFound = false;
    }
  }
  @Input()
  set loading(data: boolean) {
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    if (data) {
      let pie = am4core.create(
        this.chartDom?.nativeElement,
        am4charts.PieChart3D
      );
      this.pieChart = pie;
      this.setupPieChart(pie);
      let transitionEnded = 0;
      this.pieChart.events.on('transitionended', () => {
        transitionEnded++;
        // checking for 2 because transitionended event is fired twice before and after animation
        if (transitionEnded === 2) {
          this.getGraphSrcAndEmitPrintableObject();
        }
      });
    }
    $('g[role="scrollbar"]').css('transform', 'scale(0)');
    $('g:has(> g[stroke="#3cabff"])').hide();
  }
  @Input()
  set keys(data: any) {
    if (data) {
      this.mappingKeys = data;
    }
  }
  @Input()
  set noDataMessage(data: any) {
    if (data) {
      this.noDataText = data;
    }
  }
  private setupPieChart(pieChart: any) {
    pieChart.legend = new am4charts.Legend();
    pieChart.hiddenState.properties.radius = am4core.percent(0);
    pieChart.numberFormatter.numberFormat = '#,###.00';
    // Let's cut a hole in our Pie chart the size of 40% the radius
    let piChartSeries = pieChart.series.push(new am4charts.PieSeries3D());
    piChartSeries.dataFields.value = this.mappingKeys.y;
    piChartSeries.dataFields.category = this.mappingKeys.x;
    piChartSeries.slices.template.strokeOpacity = 0;

    piChartSeries.labels.template.text = `{value.value}`;
    piChartSeries.slices.template.tooltipText = `{category}: {value.value}`;

    piChartSeries.labels.template.maxWidth = 130;
    piChartSeries.labels.template.wrap = true;
    piChartSeries.labels.template.truncate = true;
    piChartSeries.hiddenState.properties.endAngle = -90;
    piChartSeries.slices.template.showOnInit = true;
    piChartSeries.slices.template.hiddenState.properties.shiftRadius = 1;
    pieChart.legend.valueLabels.template.text = ``;

    // Disabling labels and ticks on inner circle
    piChartSeries.labels.template.disabled = false;
    piChartSeries.ticks.template.disabled = false;
    // Disable sliding out of slices
    piChartSeries.slices.template.states.getKey(
      'hover'
    ).properties.shiftRadius = 0;
    piChartSeries.slices.template.states.getKey('hover').properties.scale = 1.1;

    this.pieChart.data = this.inputFromParent;

    if (this.clickable) {
      piChartSeries.labels.template.events.on('hit', (ev: any) => {
        if (ev?.target?.dataItem?.dataContext) {
          this.onClickData.emit(ev.target.dataItem.dataContext);
        }
      });
      piChartSeries.slices.template.events.on('hit', (event: any) => {
        if (event?.target?.dataItem?.dataContext) {
          this.onClickData.emit(event.target.dataItem.dataContext);
        }
      });
      piChartSeries.slices.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
      piChartSeries.labels.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
    }
    if (this.customTitle?.length) {
      let title = this.pieChart.titles.create();
      title.text = this.customTitle;
      title.marginBottom = 15;
    }
    pieChart.data = this.inputFromParent.data;
  }
  private getGraphSrcAndEmitPrintableObject() {
    let printableObject = {
      reportData: this.inputFromParent.data,
      reportGraphSrc: '',
      showGrid: false,
      chartType: EChartTypes.pie,
    };
    Promise.all([
      this.pieChart.exporting.getImage('png', { maxWidth: 2560 }),
    ]).then((res) => {
      if (res.length) {
        printableObject.reportGraphSrc = res[0];
      }
    });
  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.pieChart) {
        this.pieChart.dispose();
      }
    });
  }
}
