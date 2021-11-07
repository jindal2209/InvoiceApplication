from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Invoices
import smtplib

@receiver(post_save,sender=Invoices)
def sendMails(sender,instance,created,**kwargs):
    if created :
        print('will now send mail')
        gmail_user = 'techcse2020@bpitindia.com'
        gmail_password = 'Bpit@1234'

        sent_from = gmail_user
        to = ['shubham7811@yahoo.com']
        subject = 'Form registration successful'
        body = '''
            Hi, thank you for registering
            Please join this telegram group for future updates and notifications
            https://t.me/joinchat/17V9iyzIYIRiN2Rl
        '''

        email_text = """
        From: %s
        To: %s
        Subject: %s

        %s
        """ % (sent_from, ", ".join(to), subject, body)

        try:
            smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            smtp_server.ehlo()
            smtp_server.login(gmail_user, gmail_password)
            smtp_server.sendmail(sent_from, to, email_text)
            smtp_server.close()
            print ("Email sent successfully!")
        except Exception as ex:
            print("Something went wrong")