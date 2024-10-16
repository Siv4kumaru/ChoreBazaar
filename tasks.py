from celery import shared_task

@shared_task()
def lemon(x,y):
    return x+y