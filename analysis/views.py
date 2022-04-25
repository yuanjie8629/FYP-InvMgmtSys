import calendar
import datetime
from io import BytesIO
import json
from django.http import HttpResponse
import pandas as pd
import numpy as np
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers, generics
from analysis.serializers import (
    ABCAnalysisResultSerializer,
    ABCAnalysisSerializer,
    EOQAnalysisResultSerializer,
    EOQAnalysisSerializer,
    HMLAnalysisResultSerializer,
    HMLAnalysisSerializer,
    SSAnalysisResultSerializer,
    SSAnalysisSerializer,
)
from core.utils import get_date, get_month
from customer.models import Cust, CustPosReg
from item.models import Package, PackageItem, Product
from order.models import Order, OrderLine
from django.db.models import (
    Sum,
    Count,
    F,
    Case,
    When,
    Avg,
    Max,
    Q,
    QuerySet,
    FloatField,
    Value,
    Subquery,
    OuterRef,
    IntegerField,
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
from item.choices import PROD_CAT
from reversion.models import Version


def split_by_date(date_field, date_type, queryset: QuerySet):
    if date_type in ["hour"]:
        queryset = queryset.values(hour=TruncHour(date_field))

    if date_type in ["day"]:
        queryset = queryset.values(day=TruncDay(date_field))

    if date_type in ["month"]:
        queryset = queryset.values(month=TruncMonth(date_field))
    return queryset


def sort_by_date(
    key_metrics,
    date_type,
    from_date: datetime.date,
    to_date: datetime.date,
    queryset: QuerySet,
):
    to_date = to_date - datetime.timedelta(days=1)
    if date_type == "hour":
        queryset = queryset.order_by("hour").values("hour", "value")

        if not queryset.exists():
            queryset = [{"hour": None, "value": None}]

        end_hour = 23

        if to_date.date() >= datetime.date.today():
            end_hour = datetime.datetime.now().hour

        # Return None if the specified time has not elapsed today
        if end_hour != 23:
            hour = pd.date_range(
                start=from_date.replace(hour=0, minute=0, second=0, microsecond=0),
                end=datetime.datetime.today().replace(
                    hour=end_hour,
                    minute=0,
                    second=0,
                    microsecond=0,
                ),
                freq="H",
                name="hour",
            )

            new_hour = pd.date_range(
                start=datetime.datetime.today().replace(
                    hour=end_hour + 1 if end_hour != 0 else end_hour,
                    minute=0,
                    second=0,
                    microsecond=0,
                ),
                end=to_date.replace(hour=23, minute=0, second=0, microsecond=0),
                freq="H",
                name="hour",
            )

            hour_passed = (
                pd.DataFrame(queryset)
                .set_index("hour")
                .reindex(hour, fill_value=0)
                .reset_index()
            )

            hour_passed["hour"] = (
                hour_passed["hour"].dt.tz_localize("Asia/Kuala_Lumpur").astype(str)
            )

            hour_future = (
                pd.DataFrame(queryset)
                .set_index("hour")
                .reindex(new_hour, fill_value=None)
                .reset_index()
            )

            hour_future["hour"] = (
                hour_future["hour"].dt.tz_localize("Asia/Kuala_Lumpur").astype(str)
            )

            queryset = json.loads(
                pd.concat([hour_passed, hour_future])
                .assign(category=key_metrics)
                .sort_values(by=["hour"])
                .to_json(orient="records")
            )
        else:

            hour = pd.date_range(
                start=from_date.replace(hour=0, minute=0, second=0, microsecond=0),
                end=to_date.replace(hour=end_hour, minute=0, second=0, microsecond=0),
                freq="H",
                name="hour",
            )

            queryset = (
                pd.DataFrame(queryset)
                .set_index("hour")
                .reindex(hour, fill_value=0)
                .reset_index()
            )

            queryset["hour"] = (
                queryset["hour"].dt.tz_localize("Asia/Kuala_Lumpur").astype(str)
            )

            queryset = json.loads(
                queryset.assign(category=key_metrics)
                .sort_values(by=["hour"])
                .to_json(orient="records")
            )

    elif date_type == "day":
        queryset = queryset.order_by("day").values("day", "value")
        if not queryset.exists():
            queryset = [{"day": None, "value": None}]

        end_day = to_date

        if to_date.date() >= datetime.date.today():
            end_day = datetime.date.today()

        day = pd.date_range(
            start=from_date,
            end=end_day,
            freq="D",
            name="day",
        )

        day_passed = (
            pd.DataFrame(queryset)
            .set_index("day")
            .reindex(day, fill_value=0)
            .reset_index()
        )

        day_passed["day"] = (
            day_passed["day"].dt.tz_localize("Asia/Kuala_Lumpur").astype(str)
        )

        new_day = pd.date_range(
            start=(end_day + datetime.timedelta(days=1)),
            end=to_date,
            freq="D",
            name="day",
        )

        day_future = (
            pd.DataFrame(queryset)
            .set_index("day")
            .reindex(new_day, fill_value=None)
            .reset_index()
        )

        day_future["day"] = (
            day_future["day"].dt.tz_localize("Asia/Kuala_Lumpur").astype(str)
        )

        queryset = json.loads(
            pd.concat([day_passed, day_future])
            .assign(category=key_metrics)
            .to_json(orient="records")
        )

    elif date_type == "month":
        queryset = queryset.order_by("month").values("month", "value")

        if not queryset.exists():
            queryset = [{"month": None, "value": None}]
        end_month = to_date
        if (
            to_date.date().month >= datetime.date.today().month
            and to_date.date().year == datetime.date.today().year
        ):
            end_month = datetime.date.today()

        if end_month != to_date:
            month = pd.date_range(
                start=from_date.replace(day=1),
                end=end_month,
                freq="MS",
                name="month",
            )

            month_passed = (
                pd.DataFrame(queryset)
                .set_index("month")
                .reindex(month, fill_value=0)
                .reset_index()
            )

            month_passed["month"] = (
                month_passed["month"].dt.tz_localize("Asia/Kuala_Lumpur").astype(str)
            )

            new_month = pd.date_range(
                start=(end_month),
                end=to_date,
                freq="MS",
                name="month",
            )

            month_future = (
                pd.DataFrame(queryset)
                .set_index("month")
                .reindex(new_month, fill_value=None)
                .reset_index()
            )

            month_future["month"] = (
                month_future["month"].dt.tz_localize("Asia/Kuala_Lumpur").astype(str)
            )

            queryset = json.loads(
                pd.concat([month_passed, month_future])
                .assign(category=key_metrics)
                .to_json(orient="records")
            )
        else:
            month = pd.date_range(
                start=from_date.replace(day=1),
                end=to_date,
                freq="MS",
                name="month",
            )

            result = (
                pd.DataFrame(queryset)
                .set_index("month")
                .reindex(month, fill_value=0)
                .reset_index()
            )

            result["month"] = (
                result["month"].dt.tz_localize("Asia/Kuala_Lumpur").astype(str)
            )

            queryset = json.loads(
                result.assign(category=key_metrics).to_json(orient="records")
            )

    return queryset


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
        accept=None, position__type="agent"
    ).count()
    pending_dropshipper_reg = CustPosReg.objects.filter(
        accept=None, position__type="drpshpr"
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


def get_sales_metrics(from_date, to_date, date_type):
    query = split_by_date(
        "created_at",
        date_type,
        Order.objects.filter(created_at__range=(from_date, to_date)).exclude(
            status__in=("unpaid", "cancel")
        ),
    )

    query = query.annotate(
        value=Cast(
            Coalesce(
                Sum(
                    Case(
                        When(
                            order_line__item__special_price__isnull=True,
                            then=(F("order_line__quantity") * F("order_line__price")),
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
    return sort_by_date("sales", date_type, from_date, to_date, query)


def get_profit_metrics(from_date, to_date, date_type):
    query = split_by_date(
        "created_at",
        date_type,
        Order.objects.filter(created_at__range=(from_date, to_date)).exclude(
            status__in=("unpaid", "cancel")
        ),
    )

    query = query.annotate(
        value=Sum(
            Case(
                When(
                    order_line__special_price__isnull=True,
                    then=(
                        (F("order_line__quantity") * F("order_line__price"))
                        - (F("order_line__quantity") * F("order_line__cost_per_unit"))
                    ),
                ),
                When(
                    order_line__special_price__isnull=False,
                    then=(
                        (F("order_line__quantity") * F("order_line__special_price"))
                        - (F("order_line__quantity") * F("order_line__cost_per_unit"))
                    ),
                ),
            )
        )
    )

    return sort_by_date("profit", date_type, from_date, to_date, query)


def get_orders_metrics(from_date, to_date, date_type):
    query = split_by_date(
        "created_at",
        date_type,
        Order.objects.filter(created_at__range=(from_date, to_date)),
    )
    query = query.annotate(value=Count(F("pk")))

    return sort_by_date("orders", date_type, from_date, to_date, query)


def get_customers_metrics(from_date, to_date, date_type):
    query = split_by_date(
        "date_joined",
        date_type,
        Cust.objects.filter(date_joined__range=(from_date, to_date)),
    )

    query = query.annotate(value=Count(F("pk")))

    return sort_by_date("customers", date_type, from_date, to_date, query)


def get_buyers_metrics(from_date, to_date, date_type):
    query = split_by_date(
        "created_at",
        date_type,
        Order.objects.filter(created_at__range=(from_date, to_date)),
    )

    query = query.annotate(value=Count(F("email"), distinct=True))

    return sort_by_date("buyers", date_type, from_date, to_date, query)


def get_avg_order_value_metrics(from_date, to_date, date_type):
    query = split_by_date(
        "created_at",
        date_type,
        Order.objects.filter(created_at__range=(from_date, to_date)).exclude(
            status__in=("unpaid", "cancel")
        ),
    )

    query = query.annotate(
        value=Avg(
            Case(
                When(
                    order_line__item__special_price__isnull=True,
                    then=(F("order_line__quantity") * F("order_line__price")),
                ),
                When(
                    order_line__item__special_price__isnull=False,
                    then=(F("order_line__quantity") * F("order_line__special_price")),
                ),
            )
        )
    )

    return sort_by_date("avg_order_value", date_type, from_date, to_date, query)


def get_units_sold_metrics(from_date, to_date, date_type):
    query = split_by_date(
        "order__created_at",
        date_type,
        OrderLine.objects.filter(order__created_at__range=(from_date, to_date)).exclude(
            order__status__in=("unpaid", "cancel")
        ),
    )

    query = query.annotate(
        value=Sum(
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

    return sort_by_date("units_sold", date_type, from_date, to_date, query)


def get_avg_basket_size_metrics(from_date, to_date, date_type):
    query = split_by_date(
        "order__created_at",
        date_type,
        OrderLine.objects.filter(order__created_at__range=(from_date, to_date)),
    )

    query = query.annotate(value=Avg(F("quantity")))

    return sort_by_date("avg_basket_size", date_type, from_date, to_date, query)


def get_key_metrics_summary(from_date, to_date):
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

    return {
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

    data = []

    if "sales" in key_metrics_list:
        data.extend(get_sales_metrics(from_date, to_date, date_type))

    if "profit" in key_metrics_list:
        data.extend(get_profit_metrics(from_date, to_date, date_type))

    if "orders" in key_metrics_list:
        data.extend(get_orders_metrics(from_date, to_date, date_type))

    if "customers" in key_metrics_list:
        data.extend(get_customers_metrics(from_date, to_date, date_type))

    if "buyers" in key_metrics_list:
        data.extend(get_buyers_metrics(from_date, to_date, date_type))

    if "avg_order_value" in key_metrics_list:
        data.extend(get_avg_order_value_metrics(from_date, to_date, date_type))

    if "units_sold" in key_metrics_list:
        data.extend(get_units_sold_metrics(from_date, to_date, date_type))

    if "avg_basket_size" in key_metrics_list:
        data.extend(get_avg_basket_size_metrics(from_date, to_date, date_type))

    return Response(data, status.HTTP_200_OK)


@api_view(["GET"])
def KeyMetricsSummaryView(request):
    from_date, to_date = get_date(request)
    return Response(get_key_metrics_summary(from_date, to_date), status.HTTP_200_OK)


def generate_business_report(df_list: list[pd.DataFrame], spaces, sheets):
    with BytesIO() as b:
        # Use the StringIO object as the filehandle.
        writer = pd.ExcelWriter(b, engine="xlsxwriter")
        row = 0
        max_width = {}
        for df in df_list:
            df.to_excel(
                writer,
                sheet_name=sheets,
                startrow=row,
                startcol=0,
                index=False,
            )

            for i, width in enumerate(get_col_widths(df)):
                if i in max_width and width <= max_width[i]:
                    continue
                max_width.update({i: width})
                print(max_width)

            two_dec_point_fmt = writer.book.add_format({"num_format": "#,##0.00"})

            header_format = writer.book.add_format(
                {
                    "bold": True,
                    "text_wrap": True,
                    "align": "center",
                    "valign": "vcenter",
                    "fg_color": "#D9D9D9",
                    "border": 1,
                }
            )

            sub_header_format = writer.book.add_format(
                {
                    "bold": False,
                    "text_wrap": True,
                    "border": 0,
                }
            )

            if row == 0:
                for col_num, value in enumerate(df.columns.values):
                    writer.sheets[sheets].write(0, col_num, value, header_format)
            else:
                for col_num, value in enumerate(df.columns.values):
                    writer.sheets[sheets].write(row, col_num, value, sub_header_format)
            row = row + len(df.index) + spaces + 1

        for i, width in max_width.items():
            width = width + 5
            if df.columns[i] in [
                "Sales",
                "Profit",
                "Average Order Value",
                "Average Basket Size",
            ]:
                writer.sheets[sheets].set_column(i, i, width, two_dec_point_fmt)
            elif df.columns[i] == "Date":
                writer.sheets[sheets].set_column(i, i, 25, two_dec_point_fmt)
            else:
                writer.sheets[sheets].set_column(i, i, width)

        writer.sheets[sheets].set_row(0, 50)

        writer.save()
        return b.getvalue()


def get_col_widths(df: pd.DataFrame):
    return [
        max(
            [len(str(s)) for s in df[col].values] + [len(str(x)) for x in col]
            if df.columns.nlevels > 1
            else [len(str(col))]
        )
        for col in df.columns
    ]


@api_view(["GET"])
def KeyMetricsCSVView(request):
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

    data = []
    data.extend(get_sales_metrics(from_date, to_date, date_type))
    data.extend(get_profit_metrics(from_date, to_date, date_type))
    data.extend(get_orders_metrics(from_date, to_date, date_type))
    data.extend(get_customers_metrics(from_date, to_date, date_type))
    data.extend(get_buyers_metrics(from_date, to_date, date_type))
    data.extend(get_avg_order_value_metrics(from_date, to_date, date_type))
    data.extend(get_units_sold_metrics(from_date, to_date, date_type))
    data.extend(get_avg_basket_size_metrics(from_date, to_date, date_type))

    if data:
        df = pd.DataFrame(data)
        if date_type == "hour":
            df[date_type] = pd.to_datetime(df[date_type]).dt.strftime("%d-%m-%Y %H:%M")
        elif date_type == "day":
            df[date_type] = pd.to_datetime(df[date_type]).dt.strftime("%d-%m-%Y")
        else:
            df[date_type] = pd.to_datetime(df[date_type]).dt.strftime("%Y-%m")

        df = df.round(2)
        df = df.pivot_table(values="value", index=[date_type], columns="category")
        df["orders"] = df["orders"].replace(np.nan, 0).astype("int")
        df["customers"] = df["customers"].replace(np.nan, 0).astype("int")
        df["buyers"] = df["buyers"].replace(np.nan, 0).astype("int")
        df["units_sold"] = df["units_sold"].replace(np.nan, 0).astype("int")
        df.index.name = None
        df.columns.name = None
        df.reset_index(inplace=True)
        df.rename(
            columns={
                "index": "Date",
                "sales": "Sales",
                "profit": "Profit",
                "orders": "Orders",
                "customers": "Customers",
                "buyers": "Buyers",
                "avg_order_value": "Average Order Value",
                "units_sold": "Units Sold",
                "avg_basket_size": "Average Basket Size",
            },
            inplace=True,
        )

    # Get summary data

    summary_data = get_key_metrics_summary(from_date, to_date)

    if date_type == "month":
        summary_data = {
            "Date": "{} - {}".format(
                from_date.strftime("%Y-%m"), to_date.strftime("%Y-%m")
            ),
            **summary_data,
        }
    else:
        summary_data = {
            "Date": "{} - {}".format(
                from_date.strftime("%d-%m-%Y"), to_date.strftime("%d-%m-%Y")
            ),
            **summary_data,
        }

    df_summary = pd.DataFrame([summary_data.values()], columns=summary_data.keys())
    df_summary["sales"] = df_summary["sales"].astype("float").round(2)
    df_summary["profit"] = df_summary["profit"].astype("float").round(2)
    df_summary["avg_order_value"] = (
        df_summary["avg_order_value"].astype("float").round(2)
    )
    df_summary["avg_basket_size"] = (
        df_summary["avg_basket_size"].astype("float").round(2)
    )

    df_summary.rename(
        columns={
            "sales": "Sales",
            "profit": "Profit",
            "orders": "Orders",
            "customers": "Customers",
            "buyers": "Buyers",
            "avg_order_value": "Average Order Value",
            "units_sold": "Units Sold",
            "avg_basket_size": "Average Basket Size",
        },
        inplace=True,
    )

    # Reorder the data column
    ordering = [
        "Date",
        "Sales",
        "Profit",
        "Orders",
        "Customers",
        "Buyers",
        "Average Order Value",
        "Units Sold",
        "Average Basket Size",
    ]
    df = df[ordering]
    df_summary = df_summary[ordering]

    df_list = [df_summary, df]

    excel = generate_business_report(df_list, 2, "Key Metrics")

    response = HttpResponse(
        excel,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    response["Content-Disposition"] = "attachment; filename={}".format(
        "shrf-report_{}-{}.xlsx".format(
            from_date.strftime("%d-%m-%Y"), to_date.strftime("%d-%m-%Y")
        )
    )
    return response


def abc_classification(percentage):
    if percentage > 0 and percentage <= 80:
        return "A"
    elif percentage > 80 and percentage <= 95:
        return "B"
    else:
        return "C"


class ABCAnalysisView(generics.ListAPIView):
    queryset = (
        Product.objects.all().prefetch_related("image").order_by(("-last_update"))
    )
    serializer_class = ABCAnalysisResultSerializer

    def get(self, request, *args, **kwargs):
        date = get_month(request)

        # Get product demand in packages sold in which the packages contain the product
        prod_quantity_in_pack = (
            PackageItem.objects.filter(
                pack__order__created_at__year=date.year,
                pack__order__created_at__month=date.month,
            )
            .values("prod")
            .annotate(
                demand=Coalesce(Sum(F("quantity") * F("pack__order_line__quantity")), 0)
            )
            .values("demand")
        )

        # Get cost_per_unit for precise result (to avoid any modification of unit cost during the specified period)
        # Get demand
        query = (
            Product.objects.all()
            .values("id")
            .annotate(
                cost_per_unit=Coalesce(
                    Avg(
                        Case(
                            When(
                                order__created_at__year=date.year,
                                order__created_at__month=date.month,
                                then=F("order_line__cost_per_unit"),
                            )
                        )
                    ),
                    F("cost_per_unit"),
                ),
                demand=Coalesce(
                    Sum(
                        Case(
                            When(
                                order__created_at__year=date.year,
                                order__created_at__month=date.month,
                                then=F("order_line__quantity"),
                            )
                        )
                    )
                    + Coalesce(
                        Subquery(
                            prod_quantity_in_pack.filter(pk=OuterRef("pk")).values(
                                "demand"
                            ),
                            output_field=IntegerField(),
                        ),
                        0,
                    ),
                    0,
                ),
            )
        )

        # Get consumption value
        data = (
            query.annotate(
                consumption_value=F("demand") * F("cost_per_unit"),
            )
            .values(
                "id",
                "name",
                "sku",
                "category",
                "thumbnail",
                "demand",
                "cost_per_unit",
                "consumption_value",
            )
            .cache()
        )

        serializer = ABCAnalysisSerializer(data, many=True)
        data = serializer.data

        if data:

            df = pd.DataFrame(data)
            df["demand"] = df["demand"].astype("float")
            df["consumption_value"] = df["consumption_value"].astype("float")
            df.sort_values(by=["consumption_value"], ascending=False, inplace=True)
            df.reset_index(drop=True, inplace=True)
            df["demand_total"] = df["demand"].sum()
            df["demand_percent"] = df["demand"] / df["demand_total"]
            df["consumption_value_total"] = df["consumption_value"].sum()
            df["consumption_value_percent"] = (
                df["consumption_value"] / df["consumption_value_total"]
            )
            df["consumption_value_cumsum"] = df["consumption_value"].cumsum()
            df["consumption_value_cumsum_percent"] = (
                df["consumption_value_cumsum"] / df["consumption_value_total"]
            ) * 100
            df["grade"] = df["consumption_value_cumsum_percent"].apply(
                abc_classification
            )

            if not any(df["grade"] == "A"):
                if df.loc[0, "consumption_value_percent"] > 0.8:
                    df = df.copy()
                    df.loc[0, "grade"] = "A"

            if not any(df["grade"] == "B"):
                df = df.copy()
                df.loc[
                    ((df["grade"] == "C") & (df["consumption_value_percent"] > 0.15)),
                    "grade",
                ] = "B"

            df = df.drop(
                columns=[
                    "demand_total",
                    "consumption_value_total",
                    "consumption_value_cumsum",
                    "consumption_value_cumsum_percent",
                ],
            )
            df = df.round(4)
            df["consumption_value_percent"] = (
                df["consumption_value_percent"].astype(float).round(4)
            )
            df["cost_per_unit"] = df["cost_per_unit"].astype(float).round(2)
            df = df.fillna(0)

            # filter & ordering
            ordering = request.query_params.get("ordering", None)

            # if not ordering:
            #     df.sort_values(
            #         by=["consumption_value_percent", "grade"],
            #         ascending=False,
            #         inplace=True,
            #     )
            # else:
            if ordering:
                ascending = True
                if "-" in ordering:
                    ordering = ordering[1:]
                    ascending = False
                df.sort_values(by=[ordering], ascending=ascending, inplace=True)

            name = request.query_params.get("name", None)
            sku = request.query_params.get("sku", None)
            category = request.query_params.get("category", None)
            min_demand = request.query_params.get("min_demand", None)
            max_demand = request.query_params.get("max_demand", None)
            min_consumption_value = request.query_params.get(
                "min_consumption_value", None
            )
            max_consumption_value = request.query_params.get(
                "max_consumption_value", None
            )

            if name:
                df = df[df.name.str.contains("(?i){}".format(name))]

            if sku:
                df = df[df.sku.str.contains("(?i){}".format(sku))]

            if category:
                df = df[df.category == dict(PROD_CAT)[category]]

            if min_demand:
                df = df[df.demand >= float(min_demand)]

            if max_demand:
                df = df[df.demand <= float(max_demand)]

            if min_consumption_value:
                df = df[df.consumption_value >= float(min_consumption_value)]

            if max_consumption_value:
                df = df[df.consumption_value <= float(max_consumption_value)]

            # summary = df.groupby("grade", as_index=False).agg(
            #     total_demand=("demand", sum),
            #     total_consumption_value=("consumption_value", sum),
            # )

            data = json.loads(df.to_json(orient="records"))
            # summary = json.loads(summary.to_json(orient="records"))
            # final_data = {"data": data, "summary": summary}

        page = self.paginate_queryset(data)
        serializer = self.get_serializer(page, many=True)
        data = serializer.data

        if page is not None:
            return self.get_paginated_response(data)
        return Response(data, status.HTTP_200_OK)


def hml_classification(percentage):
    if percentage > 0 and percentage <= 75:
        return "H"
    elif percentage > 75 and percentage <= 90:
        return "M"
    else:
        return "L"


class HMLAnalysisView(generics.ListAPIView):
    queryset = (
        Product.objects.all().prefetch_related("image").order_by(("-last_update"))
    )
    serializer_class = HMLAnalysisResultSerializer

    def get(self, request, *args, **kwargs):
        date = get_month(request)

        # Get cost_per_unit for precise result (to avoid any modification of unit cost during the specified period)
        data = (
            Product.objects.filter()
            .values("id")
            .annotate(
                cost_per_unit=Coalesce(
                    Avg(
                        Case(
                            When(
                                order__created_at__year=date.year,
                                order__created_at__month=date.month,
                                then=F("order_line__cost_per_unit"),
                            )
                        )
                    ),
                    F("cost_per_unit"),
                )
            )
            .values(
                "id",
                "name",
                "sku",
                "thumbnail",
                "category",
                "stock",
                "cost_per_unit",
            )
            .cache()
        )

        serializer = HMLAnalysisSerializer(data, many=True)
        data = serializer.data

        if data:
            df = pd.DataFrame(data)
            df["cost_per_unit"] = df["cost_per_unit"].astype("float")
            df["cost_per_unit_total"] = df["cost_per_unit"].sum()
            df.sort_values(by=["cost_per_unit"], ascending=False, inplace=True)
            df.reset_index(drop=True, inplace=True)
            df["cost_per_unit_percent"] = (
                df["cost_per_unit"] / df["cost_per_unit_total"]
            )
            df["cost_per_unit_cumsum"] = df["cost_per_unit"].cumsum()
            df["cost_per_unit_cumsum_percent"] = (
                df["cost_per_unit_cumsum"] / df["cost_per_unit_total"]
            ) * 100
            df["grade"] = df["cost_per_unit_cumsum_percent"].apply(hml_classification)

            if not any(df["grade"] == "H"):
                if df.loc[0, "cost_per_unit_percent"] > 0.75:
                    df = df.copy()
                    df.loc[0, "grade"] = "H"

            if not any(df["grade"] == "M"):
                df = df.copy()
                df.loc[
                    ((df["grade"] == "L") & (df["cost_per_unit_percent"] > 0.15)),
                    "grade",
                ] = "M"

            df = df.drop(
                columns=[
                    "cost_per_unit_total",
                    "cost_per_unit_cumsum",
                    "cost_per_unit_cumsum_percent",
                ],
            )
            df = df.round(4)
            df["cost_per_unit"] = df["cost_per_unit"].astype(float).round(2)
            df = df.fillna(0)

            # filter & ordering
            ordering = request.query_params.get("ordering", None)

            # if not ordering:
            #     df.sort_values(
            #         by=["cost_per_unit_percent", "grade"], ascending=False, inplace=True
            #     )

            # else:
            if ordering:
                ascending = True
                if "-" in ordering:
                    ordering = ordering[1:]
                    ascending = False
                if not ordering == "grade":
                    df.sort_values(by=[ordering], ascending=ascending, inplace=True)

            name = request.query_params.get("name", None)
            sku = request.query_params.get("sku", None)
            category = request.query_params.get("category", None)
            min_cost_per_unit = request.query_params.get("min_cost_per_unit", None)
            max_cost_per_unit = request.query_params.get("max_cost_per_unit", None)
            min_stock = request.query_params.get("min_stock", None)
            max_stock = request.query_params.get("max_stock", None)

            if name:
                df = df[df.name.str.contains("(?i){}".format(name))]

            if sku:
                df = df[df.sku.str.contains("(?i){}".format(sku))]

            if category:
                df = df[df.category == dict(PROD_CAT)[category]]

            if min_cost_per_unit:
                df = df[df.cost_per_unit >= float(min_cost_per_unit)]

            if max_cost_per_unit:
                df = df[df.cost_per_unit <= float(max_cost_per_unit)]

            if min_stock:
                df = df[df.stock >= float(min_stock)]

            if max_stock:
                df = df[df.stock <= float(max_stock)]

            data = json.loads(df.to_json(orient="records"))

        page = self.paginate_queryset(data)
        serializer = self.get_serializer(page, many=True)
        data = serializer.data

        if page is not None:
            return self.get_paginated_response(data)
        return Response(data, status.HTTP_200_OK)


@api_view(["GET"])
def CheckEOQComponent(request):
    date = get_month(request)
    product_list = Product.objects.all()
    incomplete_ordering_cost = []
    incomplete_holding_cost = []
    for product in product_list:
        # Replace the month to the last date of month
        date = date.replace(day=calendar.monthrange(date.year, date.month)[1])
        product_version = (
            Version.objects.get_for_object(product)
            .filter(revision__date_created__lte=date)
            .order_by("-revision__date_created")
            .first()
        )

        ordering_cost = product.ordering_cost
        holding_cost = product.holding_cost

        if product_version:
            if product_version.field_dict["ordering_cost"]:
                ordering_cost = product_version.field_dict["ordering_cost"]

            if product_version.field_dict["holding_cost"]:
                holding_cost = product_version.field_dict["holding_cost"]

        if ordering_cost is None:
            incomplete_ordering_cost.append({"id": product.id, "name": product.name})
        if holding_cost is None:
            incomplete_holding_cost.append({"id": product.id, "name": product.name})

    return Response(
        {
            "ordering_cost": incomplete_ordering_cost,
            "holding_cost": incomplete_holding_cost,
        },
        status.HTTP_200_OK,
    )


class EoqAnalysisView(generics.ListAPIView):
    queryset = (
        Product.objects.all().prefetch_related("image").order_by(("-last_update"))
    )
    serializer_class = EOQAnalysisResultSerializer

    def get(self, request, *args, **kwargs):
        date = get_month(request)

        # Get product demand in packages sold in which the packages contain the product
        prod_quantity_in_pack = (
            PackageItem.objects.filter(
                pack__order__created_at__year=date.year,
                pack__order__created_at__month=date.month,
            )
            .values("prod")
            .annotate(
                demand=Coalesce(Sum(F("quantity") * F("pack__order_line__quantity")), 0)
            )
            .values("demand")
        )

        # Get demand
        query = (
            Product.objects.filter(
                order__created_at__year=date.year, order__created_at__month=date.month
            )
            .values(
                "id",
                day=TruncDay("order_line__order__created_at"),
            )
            .annotate(
                demand=Coalesce(
                    Sum(F("order_line__quantity"))
                    + Coalesce(
                        Subquery(
                            prod_quantity_in_pack.filter(pk=OuterRef("pk")).values(
                                "demand"
                            ),
                            output_field=IntegerField(),
                        ),
                        0,
                    ),
                    0,
                ),
            )
            .values(
                "id",
                "demand",
            )
            .annotate(total_demand=F("demand"))
            .values(
                "id",
                "name",
                "sku",
                "category",
                "thumbnail",
                "demand",
                "ordering_cost",
                "holding_cost",
            )
        )

        query = query.union(
            Product.objects.exclude(pk__in=[q.get("id") for q in query])
            .annotate(demand=Sum(0))
            .values(
                "id",
                "name",
                "sku",
                "category",
                "thumbnail",
                "demand",
                "ordering_cost",
                "holding_cost",
            )
        ).cache()

        # Check if the product's lead time is modified and replace to the original lead time during the specified date

        data = []

        for instance in query:
            product = Product.objects.get(pk=instance.get("id"))

            # Replace the month to the last date of month
            date = date.replace(day=calendar.monthrange(date.year, date.month)[1])
            product_version = (
                Version.objects.get_for_object(product)
                .filter(revision__date_created__lte=date)
                .order_by("-revision__date_created")
                .first()
            )

            ordering_cost = instance.get("ordering_cost", None)
            holding_cost = instance.get("holding_cost", None)

            if product_version:
                if product_version.field_dict["ordering_cost"]:
                    ordering_cost = product_version.field_dict["ordering_cost"]

                if product_version.field_dict["holding_cost"]:
                    holding_cost = product_version.field_dict["holding_cost"]

            data.append(
                {
                    **instance,
                    "ordering_cost": ordering_cost,
                    "holding_cost": holding_cost,
                }
            )

        serializer = EOQAnalysisSerializer(data, many=True)
        data = serializer.data
        if data:
            df = pd.DataFrame(data)
            df["ordering_cost"] = df["ordering_cost"].replace("", np.nan).astype(float)
            df["holding_cost"] = df["holding_cost"].replace("", np.nan).astype(float)
            df["optimal_order_qty"] = np.sqrt(
                (2 * df["demand"] * df["ordering_cost"]) / df["holding_cost"]
            )
            df["optimal_order_qty"] = df["optimal_order_qty"].round(0) + 1

            # filter & ordering
            ordering = request.query_params.get("ordering", None)

            if not ordering:
                df.sort_values(by=["optimal_order_qty"], ascending=False, inplace=True)
            else:
                ascending = True
                if "-" in ordering:
                    ordering = ordering[1:]
                    ascending = False

                else:
                    df.sort_values(by=[ordering], ascending=ascending, inplace=True)

            name = request.query_params.get("name", None)
            sku = request.query_params.get("sku", None)
            category = request.query_params.get("category", None)
            min_demand = request.query_params.get("min_demand", None)
            max_demand = request.query_params.get("max_demand", None)
            min_ordering_cost = request.query_params.get("min_ordering_cost", None)
            max_ordering_cost = request.query_params.get("max_ordering_cost", None)
            min_holding_cost = request.query_params.get("min_holding_cost", None)
            max_holding_cost = request.query_params.get("max_holding_cost", None)
            min_optimal_order_qty = request.query_params.get(
                "min_optimal_order_qty", None
            )
            max_optimal_order_qty = request.query_params.get(
                "max_optimal_order_qty", None
            )

            if name:
                df = df[df.name.str.contains("(?i){}".format(name))]

            if sku:
                df = df[df.sku.str.contains("(?i){}".format(sku))]

            if category:
                df = df[df.category == dict(PROD_CAT)[category]]

            if min_demand:
                df = df[df.demand >= float(min_demand)]

            if max_demand:
                df = df[df.demand <= float(max_demand)]

            if min_ordering_cost:
                df = df[df.ordering_cost >= float(min_ordering_cost)]

            if max_ordering_cost:
                df = df[df.ordering_cost <= float(max_ordering_cost)]

            if min_holding_cost:
                df = df[df.holding_cost >= float(min_holding_cost)]

            if max_holding_cost:
                df = df[df.holding_cost <= float(max_holding_cost)]

            if min_optimal_order_qty:
                df = df[df.optimal_order_qty >= float(min_optimal_order_qty)]

            if max_optimal_order_qty:
                df = df[df.optimal_order_qty <= float(max_optimal_order_qty)]

            data = json.loads(df.to_json(orient="records"))

        page = self.paginate_queryset(data)
        serializer = self.get_serializer(page, many=True)
        data = serializer.data

        if page is not None:
            return self.get_paginated_response(data)
        return Response(data, status.HTTP_200_OK)


@api_view(["GET"])
def CheckSSComponent(request):
    date = get_month(request)
    product_list = Product.objects.all()
    incomplete_avg_lead_tm = []
    incomplete_max_lead_tm = []
    for product in product_list:
        # Replace the month to the last date of month
        date = date.replace(day=calendar.monthrange(date.year, date.month)[1])
        product_version = (
            Version.objects.get_for_object(product)
            .filter(revision__date_created__lte=date)
            .order_by("-revision__date_created")
            .first()
        )

        avg_lead_tm = product.avg_lead_tm
        max_lead_tm = product.max_lead_tm

        if product_version:
            if product_version.field_dict["avg_lead_tm"]:
                avg_lead_tm = product_version.field_dict["avg_lead_tm"]

            if product_version.field_dict["max_lead_tm"]:
                max_lead_tm = product_version.field_dict["max_lead_tm"]

        if avg_lead_tm is None:
            incomplete_avg_lead_tm.append({"id": product.id, "name": product.name})
        if max_lead_tm is None:
            incomplete_max_lead_tm.append({"id": product.id, "name": product.name})

    return Response(
        {"avg_lead_tm": incomplete_avg_lead_tm, "max_lead_tm": incomplete_max_lead_tm},
        status.HTTP_200_OK,
    )


class SSAnalysisView(generics.ListAPIView):
    queryset = (
        Product.objects.all().prefetch_related("image").order_by(("-last_update"))
    )
    serializer_class = SSAnalysisResultSerializer

    def get(self, request, *args, **kwargs):
        date = get_month(request)

        # Get product demand in packages sold in which the packages contain the product
        prod_quantity_in_pack = (
            PackageItem.objects.filter(
                pack__order__created_at__year=date.year,
                pack__order__created_at__month=date.month,
            )
            .values("prod")
            .annotate(
                demand=Coalesce(Sum(F("quantity") * F("pack__order_line__quantity")), 0)
            )
            .values("demand")
        )

        # Get max daily demand
        subquery = (
            Product.objects.filter(
                order__created_at__year=date.year,
                order__created_at__month=date.month,
                pk=OuterRef("pk"),
            )
            .values(
                day=TruncDay("order_line__order__created_at"),
            )
            .annotate(
                demand=Coalesce(
                    Sum(F("order_line__quantity"))
                    + Coalesce(
                        Subquery(
                            prod_quantity_in_pack.filter(pk=OuterRef("pk")).values(
                                "demand"
                            ),
                            output_field=IntegerField(),
                        ),
                        0,
                    ),
                    0,
                ),
            )
            .order_by("-demand")
            .values("demand")[:1]
        )

        # Combine all query and get avg daily demand
        query = (
            Product.objects.filter(
                order__created_at__year=date.year, order__created_at__month=date.month
            )
            .values("id")
            .annotate(
                day=TruncDay("order_line__order__created_at"),
                demand=Coalesce(
                    Sum(F("order_line__quantity"))
                    + Coalesce(
                        Subquery(
                            prod_quantity_in_pack.filter(pk=OuterRef("pk")).values(
                                "demand"
                            ),
                            output_field=IntegerField(),
                        ),
                        0,
                    ),
                    0,
                ),
            )
            .values(
                "id",
                "name",
                "sku",
                "category",
                "thumbnail",
                "avg_lead_tm",
                "max_lead_tm",
                "demand",
            )
            .annotate(
                avg_demand=F("demand") / Count("day", distinct=True),
                max_demand=Max(Subquery(subquery)),
            )
        )

        query = query.union(
            Product.objects.exclude(pk__in=[q.get("id") for q in query])
            .annotate(demand=Sum(0))
            .values(
                "id",
                "name",
                "sku",
                "category",
                "thumbnail",
                "avg_lead_tm",
                "max_lead_tm",
                "demand",
            )
            .annotate(
                avg_demand=Sum(0),
                max_demand=Sum(0),
            )
        ).cache()

        # Check if the product's lead time is modified and replace to the original lead time during the specified date

        data = []
        for instance in query:
            product = Product.objects.get(pk=instance.get("id"))

            # Replace the month to the last date of month
            date = date.replace(day=calendar.monthrange(date.year, date.month)[1])
            product_version = (
                Version.objects.get_for_object(product)
                .filter(revision__date_created__lte=date)
                .order_by("-revision__date_created")
                .first()
            )

            avg_lead_tm = instance.get("avg_lead_tm", None)
            max_lead_tm = instance.get("max_lead_tm", None)

            if product_version:
                if product_version.field_dict["avg_lead_tm"]:
                    avg_lead_tm = product_version.field_dict["avg_lead_tm"]

                if product_version.field_dict["max_lead_tm"]:
                    max_lead_tm = product_version.field_dict["max_lead_tm"]

            data.append(
                {**instance, "avg_lead_tm": avg_lead_tm, "max_lead_tm": max_lead_tm}
            )

        serializer = SSAnalysisSerializer(data, many=True)
        data = serializer.data

        if data:

            df = pd.DataFrame(data)
            df["safety_stock"] = (df["max_demand"] * df["max_lead_tm"]) - (
                df["avg_demand"] * df["avg_lead_tm"]
            )
            df["reorder_point"] = (df["avg_demand"] * df["avg_lead_tm"]) + df[
                "safety_stock"
            ]

            # filter & ordering
            ordering = request.query_params.get("ordering", None)

            if not ordering:
                df.sort_values(by=["reorder_point"], ascending=False, inplace=True)
            else:
                ascending = True
                if "-" in ordering:
                    ordering = ordering[1:]
                    ascending = False

                else:
                    df.sort_values(by=[ordering], ascending=ascending, inplace=True)

            name = request.query_params.get("name", None)
            sku = request.query_params.get("sku", None)
            category = request.query_params.get("category", None)
            avg_demand_start = request.query_params.get("avg_demand_start", None)
            avg_demand_end = request.query_params.get("avg_demand_end", None)
            max_demand_start = request.query_params.get("max_demand_start", None)
            max_demand_end = request.query_params.get("max_demand_end", None)
            avg_lead_tm_start = request.query_params.get("avg_lead_tm_start", None)
            avg_lead_tm_end = request.query_params.get("avg_lead_tm_end", None)
            safety_stock_start = request.query_params.get("safety_stock_start", None)
            safety_stock_end = request.query_params.get("safety_stock_end", None)
            reorder_point_start = request.query_params.get("reorder_point_start", None)
            reorder_point_end = request.query_params.get("reorder_point_end", None)

            if name:
                df = df[df.name.str.contains("(?i){}".format(name))]

            if sku:
                df = df[df.sku.str.contains("(?i){}".format(sku))]

            if category:
                df = df[df.category == dict(PROD_CAT)[category]]

            if avg_demand_start:
                df = df[df.avg_demand >= float(avg_demand_start)]

            if avg_demand_end:
                df = df[df.avg_demand <= float(avg_demand_end)]

            if max_demand_start:
                df = df[df.max_demand >= float(max_demand_start)]

            if max_demand_end:
                df = df[df.max_demand <= float(max_demand_end)]

            if avg_lead_tm_start:
                df = df[df.avg_lead_tm >= float(avg_lead_tm_start)]

            if avg_lead_tm_end:
                df = df[df.avg_lead_tm <= float(avg_lead_tm_end)]

            if safety_stock_start:
                df = df[df.safety_stock >= float(safety_stock_start)]

            if safety_stock_end:
                df = df[df.safety_stock <= float(safety_stock_end)]

            if reorder_point_start:
                df = df[df.reorder_point >= float(reorder_point_start)]

            if reorder_point_end:
                df = df[df.reorder_point <= float(reorder_point_end)]

            data = json.loads(df.to_json(orient="records"))

        page = self.paginate_queryset(data)
        serializer = self.get_serializer(page, many=True)
        data = serializer.data

        if page is not None:
            return self.get_paginated_response(data)
        return Response(data, status.HTTP_200_OK)
