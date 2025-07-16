from django.shortcuts import render, get_object_or_404
from .models import Product, Category # استورد Category

def home_view(request, category_id=None):
    # جلب جميع الأصناف لعرضها في شريط التنقل/الجانبي
    categories = Category.objects.all()

    if category_id:
        # إذا تم تحديد صنف، قم بتصفية المنتجات حسب هذا الصنف
        category = get_object_or_404(Category, id=category_id)
        products = Product.objects.filter(category=category, is_available=True)
        title = f"منتجات في صنف: {category.name}"
    else:
        # إذا لم يتم تحديد صنف، اعرض جميع المنتجات المتاحة
        products = Product.objects.filter(is_available=True)
        title = "جميع المنتجات"

    context = {
        'products': products,
        'categories': categories, # تمرير الأصناف إلى القالب
        'title': title,
    }
    return render(request, 'store/index.html', context)

