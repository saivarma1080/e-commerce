import { Component, ElementRef, NgZone, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as $ from 'jquery';
import { EChartTypes } from 'src/app/models/enum';

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
})
export class DonutChartComponent {
  @Input('clickable') clickable: boolean = false;
  @Input('customTitle') customTitle: string;
  @ViewChild('donutChart', { static: false }) private chartDom: ElementRef;
  @Output() onClickData = new EventEmitter<any>();
  public inputFromParent: any;
  private donutChart: am4charts.PieChart3D;
  public dataFound: boolean = true;
  public noDataText: string;
  public titleX: string;
  public titleY: string;
  private mappingKeys: any;

  constructor(private zone: NgZone) { }
  @Input()
  set donutChartInput(data: any) {
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
    if (this.donutChart) {
      this.donutChart.dispose();
    }
    if (data) {
      let donut = am4core.create(
        this.chartDom.nativeElement,
        am4charts.PieChart3D
      );
      this.donutChart = donut;
      this.setupDonutChart(donut);
      let transitionEnded = 0;
      this.donutChart.events.on('transitionended', () => {
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
  private setupDonutChart(donutChart: any) {
    donutChart.innerRadius = am4core.percent(50);
    donutChart.responsive.enabled = true;
    donutChart.legend = new am4charts.Legend();
    donutChart.data = this.inputFromParent;
    donutChart.innerRadius = am4core.percent(30);
    donutChart.hiddenState.properties.innerRadius = am4core.percent(0);
    donutChart.hiddenState.properties.radius = am4core.percent(100);
    donutChart.numberFormatter.numberFormat = '#,###.00';
    // Let's cut a hole in our Pie chart the size of 40% the radius
    let dountChartSeries = donutChart.series.push(new am4charts.PieSeries3D());
    dountChartSeries.dataFields.value = this.mappingKeys.y;
    dountChartSeries.dataFields.category = this.mappingKeys.x;
    dountChartSeries.slices.template.strokeOpacity = 0;

    dountChartSeries.labels.template.text = `{value.value}`;
    dountChartSeries.slices.template.tooltipText = `{category} : {value.value}`;

    dountChartSeries.labels.template.maxWidth = 150;
    dountChartSeries.labels.template.wrap = true;
    // TODO : feature reference
    // dountChartSeries.labels.template.truncate = true;

    donutChart.legend.valueLabels.template.text = ``;
    donutChart.legend.labels.template.text = '{category}';
    donutChart.legend.maxHeight = 120;
    donutChart.legend.scrollable = true;

    // Disabling labels and ticks on inner circle
    dountChartSeries.labels.template.disabled = false;
    dountChartSeries.ticks.template.disabled = false;
    // Disable sliding out of slices
    dountChartSeries.slices.template.states.getKey(
      'hover'
    ).properties.shiftRadius = 0;
    dountChartSeries.slices.template.states.getKey(
      'hover'
    ).properties.scale = 1.1;
    if (this.clickable) {
      dountChartSeries.labels.template.events.on('hit', (ev: any) => {
        if (ev?.target?.dataItem?.dataContext) {
          this.onClickData.emit(ev.target.dataItem.dataContext);
        }
      });
      dountChartSeries.slices.template.events.on('hit', (event: any) => {
        if (event?.target?.dataItem?.dataContext) {
          this.onClickData.emit(event.target.dataItem.dataContext);
        }
      });
      dountChartSeries.slices.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
      dountChartSeries.labels.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
    }
    if (this.customTitle?.length) {
      let title = this.donutChart.titles.create();
      title.text = this.customTitle;
      title.marginBottom = 15;
    }
    donutChart.data = this.inputFromParent.data;
  }
  private getGraphSrcAndEmitPrintableObject() {
    let printableObject = {
      reportData: this.inputFromParent.data,
      reportGraphSrc: '',
      showGrid: false,
      chartType: EChartTypes.donut,
    };
    Promise.all([
      this.donutChart.exporting.getImage('png', { maxWidth: 2560 }),
    ]).then((res) => {
      if (res.length) {
        printableObject.reportGraphSrc = res[0];
      }
    });
  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.donutChart) {
        this.donutChart.dispose();
      }
    });
  }
}
