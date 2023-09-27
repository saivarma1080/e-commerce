import { Component, ElementRef, NgZone, OnDestroy, ViewChild, Input, Output, EventEmitter, } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as $ from 'jquery';
import { EChartTypes } from 'src/app/models/enum';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent implements OnDestroy {
  @ViewChild('chart', { static: false }) private chartDom: ElementRef;
  @Output() onClickData = new EventEmitter<any>();
  private chart: am4charts.XYChart;
  public inputFromParent: any;
  public dataFound: boolean = true;
  public noDataText: string;
  public titleX: string;
  public titleY: string;
  private mappingKeys: any;

  constructor(private zone: NgZone) { }

  @Input('clickable') clickable: boolean = false;
  @Input('customTitle') customTitle: string;
  @Input()
  set barChartInput(data: any) {
    if (data) {
      this.inputFromParent = JSON.parse(JSON.stringify(data));
      this.titleX = this.inputFromParent.xAxis;
      if (this.inputFromParent.data && this.inputFromParent.data.length) {
        this.dataFound = true;
      } else {
        this.dataFound = false;
      }
    } else {
      this.dataFound = false;
    }
  }
  @Input()
  set loading(data: boolean) {
    if (this.chart) {
      this.chart.dispose();
    }
    if (data) {
      let barChart = am4core.create(
        this.chartDom.nativeElement,
        am4charts.XYChart
      );
      this.chart = barChart;
      this.chart.numberFormatter.numberFormat = '#,###.00';
      this.setupBarChart(this.chart);
      this.setSeries(this.chart);
      let transitionEnded = 0;
      this.chart.events.on('transitionended', () => {
        transitionEnded++;
        // checking for 2 because transitionended event is fired twice before and after animation
        if (transitionEnded === 2) {
          this.getGraphSrcAndEmitPrintableObject();
        }
      });
    }
    $('g:has(> g[stroke="#3cabff"])').hide();
  }
  @Input()
  set keys(data: any) {
    // to set the chart keys (x-axis, y-axis) values
    if (data) {
      this.mappingKeys = data;
    }
  }
  private getGraphSrcAndEmitPrintableObject() {
    let printableObject = {
      reportData: this.inputFromParent.data,
      reportGraphSrc: '',
      showGrid: false,
      chartType: EChartTypes.bar,
    };
    Promise.all([
      this.chart.exporting.getImage('png', { maxWidth: 2560 }),
    ]).then((res) => {
      if (res.length) {
        printableObject.reportGraphSrc = res[0];
      }
    });
  }
  @Input()
  set noDataMessage(data: any) {
    if (data) {
      this.noDataText = data;
    }
  }
  private setupBarChart(barChart: any) {
    // Horizontal axis
    let categoryAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.strokeWidth = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    // x-axis lables hide/show
    categoryAxis.renderer.labels.template.disabled = false;
    categoryAxis.title.text = this.titleX;
    categoryAxis.dataFields.category = this.inputFromParent.xAxis;

    //Vertical axis
    let valueAxis = barChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.title.text = this.titleY;
    barChart.cursor = new am4charts.XYCursor();

    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = '{category}';
    categoryAxis.events.on('sizechanged', function (ev: any) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });
    if (this.clickable) {
      categoryAxis.renderer.labels.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
      categoryAxis.renderer.labels.template.events.on('hit', (ev: any) => {
        if (ev?.target?.dataItem?.dataContext) {
          this.onClickData.emit(ev.target.dataItem.dataContext);
        }
      });
    }
    if (this.customTitle?.length) {
      let title = this.chart.titles.create();
      title.text = this.customTitle;
      title.marginBottom = 15;
    }
    // mapping the data to preview in charts
    barChart.data = this.inputFromParent.data;
  }
  private setSeries(barChart: any) {
    // showing bar chats data
    let barChartSeries = barChart.series.push(new am4charts.ColumnSeries3D());
    barChartSeries.sequencedInterpolation = true;
    barChartSeries.dataFields.valueY = this.inputFromParent.yAxis;
    barChartSeries.dataFields.categoryX = this.inputFromParent.xAxis;

    barChartSeries.tooltipText = `{categoryX} : {valueY}`;
    barChartSeries.columns.template.tooltipText = `{categoryX} : [bold]{valueY.value}[/]`;

    barChartSeries.columns.template.tooltipY = 0;
    barChartSeries.tooltip.pointerOrientation = 'vertical';
    barChartSeries.columns.template.strokeOpacity = 0;
    barChartSeries.columns.template.width = am4core.percent(30);
    // different colors for each bar
    barChartSeries.columns.template.adapter.add(
      'fill',
      (fill: any, target: any) => {
        return barChart.colors.getIndex(target.dataItem.index);
      }
    );

    this.setLegend(barChart, barChartSeries);

    if (this.clickable) {
      barChartSeries.columns.template.events.on('hit', (ev: any) => {
        if (ev?.target?.dataItem?.dataContext) {
          this.onClickData.emit(ev.target.dataItem.dataContext);
        }
      });
      barChartSeries.columns.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
    }
  }
  private setLegend(barChart: any, barChartSeries: any) {
    let legend = new am4charts.Legend();
    legend.parent = barChart.chartContainer;
    legend.maxHeight = 120;
    legend.scrollable = true;
    legend.itemContainers.template.togglable = false;
    legend.marginTop = 20;

    legend.itemContainers.template.events.on('hit', (ev: any) => {
      if (!ev.target.isActive) {
        ev.target.dataItem.dataContext['columnDataItem'].hide();
        ev.target.isActive = !ev.target.isActive;
      } else {
        ev.target.dataItem.dataContext['columnDataItem'].show();
        ev.target.isActive = !ev.target.isActive;
      }
    });
    legend.itemContainers.template.events.on('over', (ev: any) => {
      ev.target.dataItem.dataContext['columnDataItem'].column.isHover = true;
      ev.target.dataItem.dataContext['columnDataItem'].column.showTooltip();
    });

    legend.itemContainers.template.events.on('out', (ev: any) => {
      ev.target.dataItem.dataContext['columnDataItem'].column.isHover = false;
      ev.target.dataItem.dataContext['columnDataItem'].column.hideTooltip();
    });
    let legenddata: any[] = [];
    barChartSeries.events.on('ready', (ev: any) => {
      barChartSeries.columns.each((column: any) => {
        legenddata.push({
          name: column.dataItem.categories.categoryX,
          fill: column.fill,
          columnDataItem: column.dataItem,
        });
      });
      legend.data = legenddata;
    });
  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
