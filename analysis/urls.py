from django.urls import include, path
from analysis.views import KeyMetricsSummaryView, KeyMetricsView, ToDoListView, StatisticsView

urlpatterns = [
    path(r"to_do_list/", ToDoListView, name="toDoListView"),
    path(r"statistics/", StatisticsView, name="statisticsView"),
    path(r"key_metrics/", KeyMetricsView, name="keyMetricsView"),
    path(r"key_metrics/summary/", KeyMetricsSummaryView, name="keyMetricsSummaryView"),
]
