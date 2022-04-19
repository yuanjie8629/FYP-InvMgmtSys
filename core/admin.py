from django.contrib import admin


def restore_model(modeladmin, request, queryset):
    """
    Restore a softdeletd model set
    """
    for obj in queryset:
        obj.restore()


class SoftDeleteAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "is_deleted",
    )
    list_filter = ("is_deleted",)
    actions = [restore_model]

    def get_queryset(self, request):
        """Returns a QuerySet of all model instances that can be edited by the
        admin site. This is used by changelist_view."""
        # Default: qs = self.model._default_manager.get_query_set()
        qs = self.model.objects_with_deleted

        return qs

    queryset = get_queryset
