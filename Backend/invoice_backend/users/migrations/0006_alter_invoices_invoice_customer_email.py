# Generated by Django 3.2.9 on 2021-11-06 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_invoices_invoice_customer_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoices',
            name='invoice_customer_email',
            field=models.EmailField(max_length=254),
        ),
    ]
