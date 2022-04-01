import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, serializers
from customer.models import Cust, CustPosReg
from item.models import Package, Product
from order.models import Order
from django.db.models import Sum, F, Case, When


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
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(["GET"])
def StatisticsView(request):

    from_date = request.query_params.get("from_date", None)
    to_date = request.query_params.get("to_date", None)

    if from_date and to_date:
        try:
            from_date = datetime.datetime.strptime(from_date, "%d-%m-%Y")

            # add 1 day to to_date so that it won't miss the last date
            to_date = datetime.datetime.strptime(
                to_date, "%d-%m-%Y"
            ) + datetime.timedelta(days=1)

        except ValueError:
            raise serializers.ValidationError(
                detail={
                    "error": {
                        "code": "invalid date",
                        "message": "Please ensure the date format is 'DD-MM-YYYY'",
                    }
                }
            )
    else:
        return Response(
            {"detail": "require from_date and to_date"}, status.HTTP_400_BAD_REQUEST
        )

    sales = (
        Order.objects.filter(created_at__range=(from_date, to_date))
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
    ) or 0
    print(sales)

    profit = (
        Order.objects.filter(created_at__range=(from_date, to_date))
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
    ) or 0
    new_cust = Cust.objects.filter(date_joined__range=(from_date, to_date)).count()
    new_order = Order.objects.filter(created_at__range=(from_date, to_date)).count()

    data = {
        # "date": datetime.today().strftime("%d-%m-%Y"),
        "sales": sales,
        "profit": profit,
        "new_cust": new_cust,
        "new_order": new_order,
    }
    return Response(data=data, status=status.HTTP_200_OK)
