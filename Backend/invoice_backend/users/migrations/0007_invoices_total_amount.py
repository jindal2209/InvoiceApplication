# Generated by Django 3.2.9 on 2021-11-06 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_invoices_invoice_customer_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoices',
            name='total_amount',
            field=models.IntegerField(default=200),
        ),
    ]
