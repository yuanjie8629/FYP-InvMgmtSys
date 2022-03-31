from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from customer.models import Cust, CustPosReg
from item.models import Package, Product
from order.models import Order, OrderLine
from django.db.models import Sum, F, Case, When
from reversion.models import Version

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
    sales = (
        Order.objects.filter(created_at=datetime.today())
        .aggregate(
            sales=Sum(
                Case(
                    When(
                        order_line__item__special_price__isnull=True,
                        then=(F("order_line__quantity") * F("order_line__item__price")),
                    ),
                    When(
                        order_line__item__special_price__isnull=False,
                        then=(
                            F("order_line__quantity")
                            * F("order_line__item__special_price")
                        ),
                    ),
                )
            )
        )
        .get("sales")
    )
    print(sales)

    order = Order.objects.filter(created_at=datetime.today())
    
    item_version = (
            Version.objects.get_for_object(order.order_line.item)
            .filter(revision__date_created__lte=self.order.created_at)
            .order_by("-revision__date_created")
            .first()
        )

    profit = Order.objects.filter(created_at=datetime.today()).aggregate(
        Sum("order_line__get_profit")
    )
    new_cust = Cust.objects.filter(date_joined=datetime.today()).count()
    new_order = Order.objects.filter(created_at=datetime.today()).count()

    data = {
        "sales": sales,
        "profit": profit,
        "new_cust": new_cust,
        "new_order": new_order,
    }
    return Response(data=data, status=status.HTTP_200_OK)
