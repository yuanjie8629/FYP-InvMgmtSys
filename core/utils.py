import datetime
import jwt
import zipfile
import pdfkit
import os, sys, subprocess, platform
from django.conf import settings
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions, status, serializers
from customer.models import Cust
from io import BytesIO
from django.template.loader import get_template


def enforce_csrf(request):
    check = CSRFCheck(request)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied("CSRF Failed: %s" % reason)


def show_debug_toolbar_in_staging(*args, **kwargs):
    return True


def dict_to_querydict(dictionary):
    from django.http import QueryDict
    from django.utils.datastructures import MultiValueDict

    qdict = QueryDict("", mutable=True)

    for key, value in dictionary.items():
        d = {key: value}
        qdict.update(MultiValueDict(d) if isinstance(value, list) else d)

    return qdict


def update_request_data(request, data):
    if hasattr(request.data, "_mutable"):
        request.data._mutable = True
    request.data.clear()
    request.data.update(data)
    if hasattr(request.data, "_mutable"):
        request.data._mutable = False
    return request


def split_date(date):
    return date.split("-")


def get_request_cust(request):
    refresh = jwt.decode(
        request.COOKIES.get("refresh_token"),
        settings.SIMPLE_JWT["SIGNING_KEY"],
        algorithms=[settings.SIMPLE_JWT["ALGORITHM"]],
    )
    return Cust.objects.get(pk=refresh.get("user_id"))


def render_to_pdf(template_src, context_dict={}):
    # get wkhtmltopdf path
    if platform.system() == "Windows":
        pdfkit_config = pdfkit.configuration(
            wkhtmltopdf=os.environ.get(
                "WKHTMLTOPDF_BINARY",
                "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe",
            )
        )
        options = {
            "encoding": "UTF-8",
            "page-size": "A4",
            "margin-top": "0.75in",
            "margin-right": "0.5in",
            "margin-bottom": "0.5in",
            "margin-left": "0.5in",
            "enable-local-file-access": True,
            "header-html": "core/templates/pdf_header.html",
            "footer-html": "core/templates/pdf_footer.html",
            "footer-font-name": "Helvetica",
            "header-font-name": "Helvetica",
        }

    else:
        os.environ["PATH"] += os.pathsep + os.path.dirname(sys.executable)
        WKHTMLTOPDF_CMD = (
            subprocess.Popen(
                ["which", os.environ.get("WKHTMLTOPDF_BINARY", "wkhtmltopdf")],
                stdout=subprocess.PIPE,
            )
            .communicate()[0]
            .strip()
        )
        pdfkit_config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_CMD)
        options = {
            "encoding": "UTF-8",
            "page-size": "A4",
            "margin-top": "0.75in",
            "margin-right": "0.5in",
            "margin-bottom": "0.5in",
            "margin-left": "0.5in",
            # zoom to fix production invoice view
            "zoom": "0.8",
            "enable-local-file-access": True,
            "header-html": "core/templates/pdf_header.html",
            "footer-html": "core/templates/pdf_footer.html",
            "footer-font-name": "Helvetica",
            "header-font-name": "Helvetica",
        }

    template = get_template(template_src)
    html = template.render(context_dict)
    return pdfkit.from_string(
        html, False, options=options, configuration=pdfkit_config, verbose=True
    )


def generate_zip(files):
    mem_zip = BytesIO()
    with zipfile.ZipFile(mem_zip, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            zf.writestr(f[0], f[1])

    return mem_zip.getvalue()


def get_date(request):
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
                        "code": "invalid_date",
                        "message": "Please ensure the date format is 'DD-MM-YYYY'",
                    }
                }
            )
    else:
        raise serializers.ValidationError(
            {"detail": "require from_date and to_date"}, status.HTTP_400_BAD_REQUEST
        )

    # if (
    #     from_date > datetime.datetime.today()
    #     or to_date - datetime.timedelta(days=1) > datetime.datetime.today()
    # ):
    #     raise serializers.ValidationError(
    #         detail={
    #             "error": {
    #                 "code": "date_out_of_range",
    #                 "message": "from_date and to_date should not be greater than today.",
    #             }
    #         }
    #     )

    return from_date, to_date


def get_month(request):
    month_date = request.query_params.get("month", None)
    if month_date:
        try:
            month_date = datetime.datetime.strptime(month_date, "%Y-%m")

        except ValueError:
            raise serializers.ValidationError(
                detail={
                    "error": {
                        "code": "invalid_date",
                        "message": "Please ensure the date format is 'YYYY-MM'",
                    }
                }
            )
    else:
        raise serializers.ValidationError(
            {"detail": "require_month"}, status.HTTP_400_BAD_REQUEST
        )

    if (
        month_date.year >= datetime.date.today().year
        and month_date.month >= datetime.date.today().month
    ):
        raise serializers.ValidationError(
            detail={
                "error": {
                    "code": "invalid_date",
                    "message": "Unable to perform analysis on future month_date.",
                }
            }
        )
    return month_date
