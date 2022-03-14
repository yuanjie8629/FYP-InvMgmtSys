from rest_framework import serializers


class ChoiceField(serializers.ChoiceField):
    def __init__(self, **kwargs):
        self.html_cutoff = kwargs.pop("html_cutoff", self.html_cutoff)
        self.html_cutoff_text = kwargs.pop("html_cutoff_text", self.html_cutoff_text)

        self.allow_blank = kwargs.pop("allow_blank", False)
        super(ChoiceField, self).__init__(**kwargs)

    def to_representation(self, value):
        return self.choices.get(value, value)

    def bind(self, field_name, parent):
        super().bind(field_name, parent)
        self.choices = parent.Meta.model._meta.get_field(field_name).choices

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)