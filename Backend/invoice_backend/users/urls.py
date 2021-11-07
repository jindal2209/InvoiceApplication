from django.contrib import admin
from django.urls import path
from users import views

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # Post APIs
    path('create_invoice/',views.CreateInvoice),
    path('create_order/',views.createOrder),
    path('create_item/',views.CreateItem),
    path('payment_handler/',views.paymentHandler),
    # Get APIs
    path('invoice/<int:invoice_id>',views.getInvoice),
    path('get_items/',views.getItems),
    path('get_companies/',views.getCompanies),
]
