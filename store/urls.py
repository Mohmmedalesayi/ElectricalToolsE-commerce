from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'), # Maps the root URL to home_view
      path('category/<int:category_id>/', views.home_view, name='products_by_category'), # مسار جديد لتصفية المنتجات حسب الصنف

]


