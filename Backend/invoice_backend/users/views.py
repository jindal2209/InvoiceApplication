from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST,HTTP_403_FORBIDDEN, HTTP_405_METHOD_NOT_ALLOWED
from .models import CompanySerializer, InvoiceItemsSerializer, Items,ItemsSerializer,Company,InvoiceItems,Invoices
from .emailsend import sendMail
import razorpay,json

# Create your views here.
@api_view(['POST'])
def CreateItem(request):
    data = json.loads(request.body)
    item_name = data.get('item_name')
    item_price = data.get('item_price')
    obj = Items.objects.create(item_name=item_name,item_price=item_price)
    if(obj):
        return Response({'status': 'OK'},status=HTTP_200_OK)
    else:
        return Response({'error': 'BAD_REQUEST'},status=HTTP_400_BAD_REQUEST)

def CreateCompany(request):
    company_name = '' # request.body
    obj = Company.objects.create(company_name=company_name)
    if(obj):
        return Response({'status': 'OK'},status=HTTP_200_OK)
    else:
        return Response({'error': 'BAD_REQUEST'},status=HTTP_400_BAD_REQUEST)

# Create Invoice
@api_view(['POST'])
def CreateInvoice(request):
    if(request.method == 'POST'):
        # extract data
        data = json.loads(request.body) #request.body.data
        invoice_items = data.get('items_list')
        customer_name = data.get('customer_name')
        company_id = data.get('company_id')
        customer_email_id = data.get('customer_email')
        total_amount = data.get('total_amount')
        # get references to objects
        company_obj = Company.objects.get(id=company_id)

        invoice_items_list = []
        
        # create invoice
        invoice_obj = Invoices.objects.create(company=company_obj,invoice_customer_name=customer_name,total_amount=total_amount,invoice_customer_email=customer_email_id)

        # create invoice item
        for item in invoice_items:
            # item_no item_name quantity price total
            invoice_items_list.append({item['item_no'],item['item_name'],item['quantity'],item['item_price'],item['item_total_price']})
            item_obj = Items.objects.get(item_no=item['item_no'])
            InvoiceItems.objects.create(item=item_obj,invoice=invoice_obj,quantity=item['quantity'])


        # send mail
        ## invoice_id company_name invoice_items_list customer_name customer_email_id total_amount
        sendMail(invoice_obj.id,company_obj.company_name,invoice_items_list,customer_name,customer_email_id,total_amount)

        # return response
        if(invoice_obj):
            return Response({'status': 'OK', 'invoice_id': invoice_obj.id},status=HTTP_200_OK)
        else:
            return Response({'error': 'BAD_REQUEST'},status=HTTP_400_BAD_REQUEST)
    return Response({'error': 'FORBIDDEN'},status=HTTP_403_FORBIDDEN)

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))
# Verify Payments
@api_view(['POST'])
def createOrder(request):
    if (request.method == 'POST'):
        amount = 10000 # rs 100
        currency = 'INR'
        # Create a Razorpay Order
        razorpay_order = razorpay_client.order.create(dict(amount=amount,
                                                        currency=currency,
                                                        payment_capture='0'))
    
        # order id of newly created order.
        razorpay_order_id = razorpay_order['id']
        callback_url = 'payment_handler/'
    
        # we need to pass these details to frontend.
        context = {}
        context['razorpay_order_id'] = razorpay_order_id
        context['razorpay_merchant_key'] = settings.RAZORPAY_KEY_ID
        context['razorpay_amount'] = amount
        context['currency'] = currency
        context['callback_url'] = callback_url
        return Response(context,status=HTTP_200_OK)
    return Response({'error': 'METHOD NOT ALLOWED'},status=HTTP_405_METHOD_NOT_ALLOWED)

# payment handler
@api_view(['POST'])
def paymentHandler(request):
    if (request.method == 'POST'):
        try:
            # get the required parameters from post request.
            data = json.loads(request.body)
            payment_id = data.get('razorpay_payment_id', '')
            razorpay_order_id = data.get('razorpay_order_id', '')
            signature = data.get('razorpay_signature', '')
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            # verify the payment signature.
            result = razorpay_client.utility.verify_payment_signature(params_dict)

            if result is None:
                amount = data.get('amount')  # Rs. 200
                try:
                    # capture the payemt
                    razorpay_client.payment.capture(payment_id, amount)
                    # render success page on successful caputre of payment
                    return Response({'status': 'OK'},status=HTTP_200_OK)
                except:
                   return Response({'error': 'Payment Failed'},status=HTTP_400_BAD_REQUEST)
            else:
               return Response({'error': 'Payment Failed'},status=HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'BAD_REQUEST'},status=HTTP_400_BAD_REQUEST)
    return Response({'error': 'FORBIDDEN'},status=HTTP_403_FORBIDDEN)

# GET INVOICE
@api_view(['GET'])
def getInvoice(request,invoice_id):
    if(request.method == 'GET'):
        # invoice_id = request.GET['invoice_id']
        try:
            invoice_obj = Invoices.objects.get(id=invoice_id)   
        except :
            return Response({'error': 'invoice not found'},status=HTTP_400_BAD_REQUEST)
        invoice_date = invoice_obj.invoice_date
        customer_name = invoice_obj.invoice_customer_name
        invoice_status = invoice_obj.invoice_status
        total_amount = invoice_obj.total_amount
        customer_email = invoice_obj.invoice_customer_email
        company_name = invoice_obj.company.company_name
        items_data = InvoiceItems.objects.raw(
            """
                SELECT 
                    id,
                    users_invoiceitems.item_id,
                    users_invoiceitems.quantity,
                    users_items.item_name,
                    users_items.item_price
                FROM
                    users_invoiceitems,
                    users_items
                WHERE
                    users_invoiceitems.invoice_id={invoice_id}
                    AND
                    users_invoiceitems.item_id = users_items.item_no
            """.format(invoice_id=invoice_id)
        )
        serialized_data = InvoiceItemsSerializer(items_data,many=True).data
        data = {
            'company_name': company_name,
            'invoice_id': invoice_id,
            'invoice_date': invoice_date,
            'customer_name': customer_name,
            'customer_email': customer_email,
            'total_amount': total_amount,
            'invoice_status': invoice_status,
            'items_data': serialized_data
        }
        return Response(data,status=HTTP_200_OK)
    return Response({'error': 'FORBIDDEN'},status=HTTP_403_FORBIDDEN)

# GET ITEMS LIST
@api_view(['GET'])
def getItems(request):
    if(request.method == 'GET'):
        items_data = ItemsSerializer(Items.objects.all(),many=True).data
        return Response(items_data,status=HTTP_200_OK)
    return Response({'error': 'FORBIDDEN'},status=HTTP_403_FORBIDDEN)
    
# GET COMPANIES LIST
@api_view(['GET'])
def getCompanies(request):
    if(request.method == 'GET'):
        company_data = CompanySerializer(Company.objects.all(),many=True).data
        return Response(company_data,status=HTTP_200_OK)
    return Response({'error': 'FORBIDDEN'},status=HTTP_403_FORBIDDEN)