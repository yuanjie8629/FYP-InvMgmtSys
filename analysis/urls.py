from django.urls import include, path
from analysis.views import ToDoListView, StatisticsView

urlpatterns = [
    path(r"to_do_list/", ToDoListView, name="toDoListView"),
    path(r"statistics/", StatisticsView, name="statisticsView"),
]
