from django.urls import include, path
from analysis.views import (
    EoqAnalysisView,
    HMLAnalysisView,
    KeyMetricsCSVView,
    KeyMetricsSummaryView,
    KeyMetricsView,
    SSAnalysisView,
    ToDoListView,
    StatisticsView,
    ABCAnalysisView,
)

urlpatterns = [
    path(r"to_do_list/", ToDoListView, name="toDoListView"),
    path(r"statistics/", StatisticsView, name="statisticsView"),
    path(r"key_metrics/", KeyMetricsView, name="keyMetricsView"),
    path(r"key_metrics/report/", KeyMetricsCSVView, name="keyMetricsCSVView"),
    path(r"key_metrics/summary/", KeyMetricsSummaryView, name="keyMetricsSummaryView"),
    path(r"abc/", ABCAnalysisView.as_view(), name="abcAnalysisView"),
    path(r"hml/", HMLAnalysisView.as_view(), name="hmlAnalysisView"),
    path(r"ss/", SSAnalysisView.as_view(), name="ssAnalysisView"),
    path(r"eoq/", EoqAnalysisView.as_view(), name="eoqAnalysisView"),
]
