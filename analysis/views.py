import datetime
import pandas as pd
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from core.utils import get_date
from customer.models import Cust, CustPosReg
from item.models import Package, Product
from order.models import Order, OrderLine
from django.db.models import (
    Sum,
    Count,
    F,
    Case,
    When,
    Avg,
    Q,
    QuerySet,
    FloatField,
    Value,
)
from django.db.models.functions import (
    # ExtractHour,
    # ExtractDay,
    # ExtractMonth,
    TruncHour,
    TruncDay,
    TruncMonth,
    Coalesce,
    Cast,
)


def split_by_date(date_field, date_type, queryset: QuerySet):
    if date_type in ["hour"]:
        queryset = queryset.values(hour=TruncHour(date_field))

    if date_type in ["day"]:
        queryset = queryset.values(day=TruncDay(date_field))

    if date_type in ["month"]:
        queryset = queryset.values(month=TruncMonth(date_field))
    return queryset


def sort_by_date(key_metrics, date_type, from_date, to_date, queryset: QuerySet):
    to_date = to_date - datetime.timedelta(days=1)
    if date_type in ["hour"]:
        queryset = queryset.order_by("hour").values("hour", key_metrics)

        if not queryset.exists():
            queryset = [{"hour": None, key_metrics: None}]

        range = pd.date_range(
            start=from_date.replace(hour=0, minute=0, second=0, microsecond=0),
            end=to_date.replace(hour=23, minute=0, second=0, microsecond=0),
            freq="H",
            name="range",
        )

        queryset = (
            pd.DataFrame(queryset)
            .set_index("hour")
            .reindex(range, fill_value=0)
            .reset_index()
        )

    if date_type in ["day"]:
        queryset = queryset.order_by("day").values("day", key_metrics)
        if not queryset.exists():
            queryset = [{"day": None, key_metrics: None}]

        range = pd.date_range(
            start=from_date.replace(hour=0, minute=0, second=0, microsecond=0),
            end=to_date.replace(hour=0, minute=0, second=0, microsecond=0),
            freq="D",
            name="range",
        )

        queryset = (
            pd.DataFrame(queryset)
            .set_index("day")
            .reindex(range, fill_value=0)
            .reset_index()
        )

    if date_type in ["month"]:
        queryset = queryset.order_by("month").values("month", key_metrics)

        if not queryset.exists():
            queryset = [{"month": None, key_metrics: None}]

        range = pd.date_range(
            start=from_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0),
            end=to_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0),
            freq="MS",
            name="range",
        )
        queryset = (
            pd.DataFrame(queryset)
            .set_index("month")
            .reindex(range, fill_value=0)
            .reset_index()
        )

    range = queryset.pop("range")
    print(range)

    return queryset, range


def get_sales(from_date, to_date):
    return (
        Order.objects.filter(created_at__range=(from_date, to_date))
        .exclude(status__in=("unpaid", "cancel"))
        .aggregate(
            sales=Sum(
                Case(
                    When(
                        order_line__item__special_price__isnull=True,
                        then=(F("order_line__quantity") * F("order_line__price")),
                    ),
                    When(
                        order_line__item__special_price__isnull=False,
                        then=(
                            F("order_line__quantity") * F("order_line__special_price")
                        ),
                    ),
                )
            )
        )
        .get("sales")
        or 0
    )


def get_avg_sales(from_date, to_date):
    return (
        Order.objects.filter(created_at__range=(from_date, to_date))
        .exclude(status__in=("unpaid", "cancel"))
        .aggregate(
            avg_sales=Avg(
                Case(
                    When(
                        order_line__item__special_price__isnull=True,
                        then=(F("order_line__quantity") * F("order_line__price")),
                    ),
                    When(
                        order_line__item__special_price__isnull=False,
                        then=(
                            F("order_line__quantity") * F("order_line__special_price")
                        ),
                    ),
                )
            )
        )
        .get("avg_sales")
        or 0
    )


def get_profit(from_date, to_date):
    return (
        Order.objects.filter(created_at__range=(from_date, to_date))
        .exclude(status__in=("unpaid", "cancel"))
        .aggregate(
            profit=Sum(
                Case(
                    When(
                        order_line__special_price__isnull=True,
                        then=(
                            (F("order_line__quantity") * F("order_line__price"))
                            - (
                                F("order_line__quantity")
                                * F("order_line__cost_per_unit")
                            )
                        ),
                    ),
                    When(
                        order_line__special_price__isnull=False,
                        then=(
                            (F("order_line__quantity") * F("order_line__special_price"))
                            - (
                                F("order_line__quantity")
                                * F("order_line__cost_per_unit")
                            )
                        ),
                    ),
                )
            )
        )
        .get("profit")
        or 0
    )


@api_view(["GET"])
def ToDoListView(request):
    pending_shipment = Order.objects.filter(status="toShip").count()
    pending_pickup = Order.objects.filter(status="toPick").count()
    unpaid_orders = Order.objects.filter(status="unpaid").count()
    product_oos = Product.objects.filter(status="oos").count()
    package_oos = Package.objects.filter(status="oos").count()
    pending_agent_reg = CustPosReg.objects.filter(
        accept=False, position__type="agent"
    ).count()
    pending_dropshipper_reg = CustPosReg.objects.filter(
        accept=False, position__type="drpshpr"
    ).count()

    data = {
        "order_shipment": pending_shipment,
        "order_pickup": pending_pickup,
        "order_unpaid": unpaid_orders,
        "product_oos": product_oos,
        "package_oos": package_oos,
        "agent_reg": pending_agent_reg,
        "drpshpr_reg": pending_dropshipper_reg,
    }
    return Response(data, status.HTTP_200_OK)


@api_view(["GET"])
def StatisticsView(request):
    from_date, to_date = get_date(request)

    sales = get_sales(from_date, to_date)
    profit = get_profit(from_date, to_date)
    new_cust = Cust.objects.filter(date_joined__range=(from_date, to_date)).count()
    new_order = Order.objects.filter(created_at__range=(from_date, to_date)).count()

    data = {
        # "date": datetime.today().strftime("%d-%m-%Y"),
        "sales": sales,
        "profit": profit,
        "new_cust": new_cust,
        "new_order": new_order,
    }
    return Response(data, status.HTTP_200_OK)


@api_view(["GET"])
def KeyMetricsSummaryView(request):
    from_date, to_date = get_date(request)

    sales = get_sales(from_date, to_date)
    profit = get_profit(from_date, to_date)
    orders = Order.objects.filter(created_at__range=(from_date, to_date)).count()
    customers = Cust.objects.filter(date_joined__range=(from_date, to_date)).count()
    buyers = (
        Order.objects.filter(created_at__range=(from_date, to_date))
        .values("email")
        .distinct()
        .count()
    )
    avg_order_value = get_avg_sales(from_date, to_date)
    units_sold = (
        OrderLine.objects.aggregate(
            units_sold=Sum(
                Case(
                    When(
                        Q(
                            order__created_at__range=(
                                from_date,
                                to_date,
                            )
                        ),
                        then=F("quantity"),
                    )
                )
            ),
        ).get("units_sold")
        or 0
    )

    avg_basket_size = (
        OrderLine.objects.filter(order__created_at__range=(from_date, to_date))
        .aggregate(avg_basket_size=Avg(F("quantity")))
        .get("avg_basket_size")
        or 0
    )

    data = {
        # "date": datetime.today().strftime("%d-%m-%Y"),
        "sales": sales,
        "profit": profit,
        "orders": orders,
        "customers": customers,
        "buyers": buyers,
        "avg_order_value": avg_order_value,
        "units_sold": units_sold,
        "avg_basket_size": avg_basket_size,
    }

    return Response(data, status.HTTP_200_OK)


@api_view(["GET"])
def KeyMetricsView(request):
    valid_key_metrics = [
        "sales",
        "profit",
        "orders",
        "customers",
        "buyers",
        "avg_order_value",
        "units_sold",
        "avg_basket_size",
    ]
    from_date, to_date = get_date(request)
    date_type = request.query_params.get("date_type", None)

    valid_date_type = ["hour", "day", "month"]

    if not date_type in valid_date_type:
        raise serializers.ValidationError(
            detail={
                "error": {
                    "code": "invalida_date_type",
                    "message": "The valid date type are {}".format(valid_date_type),
                }
            }
        )

    key_metrics = request.query_params.get("key", None)
    key_metrics_list = key_metrics.split(",")

    if not all(item in valid_key_metrics for item in key_metrics_list):
        raise serializers.ValidationError(
            detail={
                "error": {
                    "code": "invalid_key_metrics",
                    "message": "The valid key metrics are {}".format(valid_key_metrics),
                }
            }
        )

    data = {}

    if "sales" in key_metrics_list:
        query = split_by_date(
            "created_at",
            date_type,
            Order.objects.filter(created_at__range=(from_date, to_date)).exclude(
                status__in=("unpaid", "cancel")
            ),
        )

        query = query.annotate(
            sales=Cast(
                Coalesce(
                    Sum(
                        Case(
                            When(
                                order_line__item__special_price__isnull=True,
                                then=(
                                    F("order_line__quantity") * F("order_line__price")
                                ),
                            ),
                            When(
                                order_line__item__special_price__isnull=False,
                                then=(
                                    F("order_line__quantity")
                                    * F("order_line__special_price")
                                ),
                            ),
                        )
                    ),
                    Value(0),
                ),
                FloatField(),
            )
        )
        query, range = sort_by_date("sales", date_type, from_date, to_date, query)
        data.update(query)
        data.update({"range": range})

    if "profit" in key_metrics_list:
        query = split_by_date(
            "created_at",
            date_type,
            Order.objects.filter(created_at__range=(from_date, to_date)).exclude(
                status__in=("unpaid", "cancel")
            ),
        )

        query = query.annotate(
            profit=Sum(
                Case(
                    When(
                        order_line__special_price__isnull=True,
                        then=(
                            (F("order_line__quantity") * F("order_line__price"))
                            - (
                                F("order_line__quantity")
                                * F("order_line__cost_per_unit")
                            )
                        ),
                    ),
                    When(
                        order_line__special_price__isnull=False,
                        then=(
                            (F("order_line__quantity") * F("order_line__special_price"))
                            - (
                                F("order_line__quantity")
                                * F("order_line__cost_per_unit")
                            )
                        ),
                    ),
                )
            )
        )

        query, range = sort_by_date("profit", date_type, from_date, to_date, query)
        data.update(query)
        data.update({"range": range})

    if "orders" in key_metrics_list:
        query = split_by_date(
            "created_at",
            date_type,
            Order.objects.filter(created_at__range=(from_date, to_date)),
        )
        query = query.annotate(orders=Count(F("pk")))

        query = sort_by_date("orders", date_type, from_date, to_date, query)
        data.update({"orders": query})

    if "customers" in key_metrics_list:
        query = split_by_date(
            "date_joined",
            date_type,
            Cust.objects.filter(date_joined__range=(from_date, to_date)),
        )

        query = query.annotate(customers=Count(F("pk")))

        query, range = sort_by_date("customers", date_type, from_date, to_date, query)
        data.update(query)
        data.update({"range": range})

    if "buyers" in key_metrics_list:
        query = split_by_date(
            "created_at",
            date_type,
            Order.objects.filter(created_at__range=(from_date, to_date))
            .values("email")
            .distinct(),
        )

        query = query.annotate(customers=Count(F("pk")))

        query, range = sort_by_date("buyers", date_type, from_date, to_date, query)
        data.update(query)
        data.update({"range": range})

    if "avg_order_value" in key_metrics_list:
        query = split_by_date(
            "created_at",
            date_type,
            Order.objects.filter(created_at__range=(from_date, to_date)).exclude(
                status__in=("unpaid", "cancel")
            ),
        )

        query = query.annotate(
            avg_sales=Avg(
                Case(
                    When(
                        order_line__item__special_price__isnull=True,
                        then=(F("order_line__quantity") * F("order_line__price")),
                    ),
                    When(
                        order_line__item__special_price__isnull=False,
                        then=(
                            F("order_line__quantity") * F("order_line__special_price")
                        ),
                    ),
                )
            )
        )

        query, range = sort_by_date(
            "avg_order_value", date_type, from_date, to_date, query
        )
        data.update(query)
        data.update({"range": range})

    if "units_sold" in key_metrics_list:
        query = split_by_date(
            "created_at",
            date_type,
            Order.objects.filter(created_at__range=(from_date, to_date)).exclude(
                status__in=("unpaid", "cancel")
            ),
        )

        query = query.annotate(
            units_sold=Sum(
                Case(
                    When(
                        Q(
                            order__created_at__range=(
                                from_date,
                                to_date,
                            )
                        ),
                        then=F("quantity"),
                    )
                )
            ),
        )

        query, range = sort_by_date("units_sold", date_type, from_date, to_date, query)
        data.update(query)
        data.update({"range": range})

    if "avg_basket_size" in key_metrics_list:
        query = split_by_date(
            "order__created_at",
            date_type,
            OrderLine.objects.filter(order__created_at__range=(from_date, to_date)),
        )

        query = query.annotate(avg_basket_size=Avg(F("quantity")))

        query, range = sort_by_date(
            "avg_basket_size", date_type, from_date, to_date, query
        )
        data.update(query)
        data.update({"range": range})

    return Response(data, status.HTTP_200_OK)
