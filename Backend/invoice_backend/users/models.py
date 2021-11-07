from django.db import models
from django.db.models import fields
from django.db.models.expressions import F
from rest_framework import serializers

# Create your models here.
class Company(models.Model):
    company_name = models.CharField(max_length=200,null=False,blank=False)
    date_joined = models.DateTimeField(auto_now_add=True)

class Items(models.Model):
    item_no = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100,null=False,blank=False)
    item_price = models.IntegerField(null=False,blank=False)
    # available

class Invoices(models.Model):
    invoice_date = models.DateTimeField(auto_now_add=True)
    # due_date = models.DateTimeField(null=False,blank=False) for now take 10 days from creation date
    company = models.ForeignKey(Company,on_delete=models.CASCADE)
    invoice_customer_name = models.CharField(max_length=100,null=False,default='Customer Name Undefined')
    invoice_customer_email = models.EmailField(null=False,blank=False)
    invoice_status = models.CharField(max_length=50,choices=[('paid','paid'),('pending','pending'),('overdue','overdue'),('cancelled','cancelled')],null=False,default='pending')
    total_amount = models.IntegerField(null=False,blank=False)

class InvoiceItems(models.Model):
    item = models.ForeignKey(Items,on_delete=models.CASCADE)
    invoice = models.ForeignKey(Invoices,on_delete=models.CASCADE)
    quantity = models.IntegerField(null=False,default=1)

## serializers
class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class InvoiceItemsSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    quantity = serializers.IntegerField()
    item_name = serializers.CharField(max_length=100)
    item_price = serializers.IntegerField()